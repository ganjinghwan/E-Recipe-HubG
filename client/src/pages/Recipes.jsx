import React, { useEffect, useState } from "react";
import {
  Box,
  Flex,
  Grid,
  GridItem,
  Image,
  Text,
  Button,
  IconButton,
  useToast,
  VStack,
  HStack,
  Input,
  Textarea,
  Center,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Link,
  Tooltip,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Stack,
  useBreakpointValue,
} from "@chakra-ui/react";
import { FaHeart, FaPlus, FaEdit, FaTrash, FaClock, FaYoutube, FaStar, FaFlag} from "react-icons/fa";
import { FaChevronLeft, FaChevronRight, FaChevronDown } from "react-icons/fa"; // Import specific icons
import recipesBackground from "../pic/room.jpg";
import { useStoreRecipe } from "../store/StoreRecipe";
import { useAuthStore } from "../store/authStore";

const Recipes = () => {
  const [selectedFood, setSelectedFood] = useState(null);
  const [animationState, setAnimationState] = useState("");
  const [activeTab, setActiveTab] = useState("Instruction");
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [favoriteFoods, setFavoriteFoods] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [activeModal, setActiveModal] = useState("");
  const [newRecipe, setNewRecipe] = useState({
    title: "",
    ingredients: [],
    instructions: [],
    prepTime: "",
    category: "",
    image: "",
    video: "",
  });

  const {createRecipe, deleteRecipes, updateRecipes, fetchRecipeById, addReportUser, toggleFavorite} = useStoreRecipe();
  const { fetchFavoriteRecipes, favoriteRecipes } = useStoreRecipe();
  const {fetchRecipes, recipes} = useStoreRecipe();
  const [categories, setCategories] = useState(["All"]); // "All" as default
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [updatedRecipe, setUpdatedRecipe] = useState(selectedFood);
  const toast = useToast();
  const iconButtonSize = useBreakpointValue({ base: "sm", md: "md" });
  const numberOfItems = useBreakpointValue({ base: 3, md: 5 });

  const [imageSource, setImageSource] = useState("url"); // Default to URL

  const [selectedUser, setSelectedUser] = useState(null);
  const [reportDetails, setReportDetails] = useState({ title: "", reason: "" });
  const [availableUsers, setAvailableUsers] = useState([]);

  const { user, fetchCGE, CGEs } = useAuthStore();

  useEffect(() => {
    if (isOpen) {
      console.log("Focused Element:", document.activeElement);
    }
  }, [isOpen]);
  

  const resetNewRecipe = () => {
    setNewRecipe({
      title: "",
      ingredients: [],
      instructions: [],
      prepTime: "",
      category: "",
      image: "",
      video: "",
    });
  };
  
  const getImageSrc = (image) => {
    return isValidUrl(image) ? image : "https://i.pinimg.com/originals/88/4f/6b/884f6bbb75ed5e1446d3b6151b53b3cf.gif";
  };

  const truncateText = (text, charLimit) => {
    if (!text) return ""; // Handle null or undefined text
    return text.length > charLimit
      ? `${text.slice(0, charLimit)}...` // Truncate by characters and add ellipsis
      : text; // Return the full text if within the limit
  };


  const truncateSentences = (text, charLimit) => {
    if (!text) return ""; // Handle null or undefined text
  
    const words = text.split(" "); // Split the text into words
    const lines = []; // Array to store lines of text
    let currentLine = ""; // Current line being constructed
  
    for (const word of words) {
      if (word.length > charLimit) {
        // If a single word exceeds the limit, split it into chunks
        const chunks = word.match(new RegExp(`.{1,${charLimit}}`, "g"));
        if (currentLine.trim()) {
          lines.push(currentLine.trim()); // Push the current line before splitting the word
          currentLine = ""; // Clear the current line
        }
        lines.push(...chunks); // Add the word chunks as separate lines
      } else if ((currentLine + word).length > charLimit) {
        // If adding the word exceeds the line limit, push the current line
        lines.push(currentLine.trim());
        currentLine = word + " "; // Start a new line with the current word
      } else {
        currentLine += word + " "; // Add the word to the current line
      }
    }
  
    // Add the last line if it's not empty
    if (currentLine.trim()) {
      lines.push(currentLine.trim());
    }
  
    // Join the lines with a newline character
    return lines.join("\n");
  };
  

  const capitalize = (str) => {
    return str.replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  };
  

  const isValidYoutubeUrl = (url) => {
    try {
      const parsedUrl = new URL(url);
      // Check if hostname is YouTube or YouTube Shortened URL
      const isYouTube = parsedUrl.hostname === "www.youtube.com" || parsedUrl.hostname === "youtu.be";
      // Additional validation for required parameters
      const hasVideoId = parsedUrl.searchParams.has("v") || parsedUrl.hostname === "youtu.be";
      return isYouTube && hasVideoId;
    } catch (e) {
      return false;
    }
  };
  
   useEffect(() => {
      const fetchRecipeData = async () => {
        if (!selectedFood) return; // Ensure a recipe is selected before fetching data
    
        try {
          const response = await fetchRecipeById(selectedFood._id); // Fetch full recipe data, including updated AveRating
          if (response.success) {
            setSelectedFood(response.data); // Sync state with the latest data from the backend
          }
        } catch (error) {
          console.error("Failed to fetch updated recipe data:", error);
        }
      };
    
      // Set an interval to fetch data every 10 seconds
      const interval = setInterval(() => {
        fetchRecipeData();
      }, 10000); // 10 seconds
    
      // Cleanup: clear the interval when the component unmounts or `selectedFood` changes
      return () => clearInterval(interval);
    }, [selectedFood, fetchRecipeById]);
  

  useEffect(() => {
    fetchRecipes().then(() => {
      setSelectedCategory("all"); // Set category to "All" after fetching recipes
    });
  }, [fetchRecipes]);


  useEffect(() => {
    if (recipes.length > 0) {
      setSelectedFood(recipes[0]); // Set the first recipe as the initial selected food

      // Get unique categories from recipes
      const uniqueCategories = Array.from(
        new Set(
          recipes.map((recipe) => recipe.category.toLowerCase())
        )
      ).map(capitalize);
      setCategories(["All", ...uniqueCategories]);

    }
  }, [recipes]);

  const filteredRecipes =
    selectedCategory === "all"
      ? recipes
      : recipes.filter(
          (recipe) => recipe.category.toLowerCase() === selectedCategory
        );


  useEffect(() => {
      if (filteredRecipes.length > 0) {
        setSelectedFood(filteredRecipes[0]); // Set the first recipe as default
      } else {
        setSelectedFood(null); // Clear selection if no recipes match
      }
    }, [selectedCategory]); // Re-run effect when `selectedCategory`

  const handleFoodSelection = (food) => {
    // console.log("Clicked Food111:", food);
    if (food._id !== selectedFood?._id && !animationState) {
      setAnimationState("slide-left");
      // console.log("The food id is111:", food._id);
      
      setTimeout(() => {
        setSelectedFood(food);
        // console.log("Selected Food Updated2:", food);
        // console.log("The food id is2222:", food._id);
        setAnimationState("slide-down");

        setTimeout(() => {
          setAnimationState("");
        }, 1000);
      }, 1000);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchFavoriteRecipes();

        if (response.success) {
          // Map the favorite recipes to their IDs and update `setFavoriteFoods`
          setFavoriteFoods(response.data.map((recipe) => recipe._id));
        } else {
          console.error("Failed to fetch favorite recipes:", response.message);
        }
      } catch (error) {
        console.error("Error fetching favorite recipes:", error);
      }
    };

    fetchData();
  }, [fetchFavoriteRecipes, setFavoriteFoods]);
  

  const handleToggleFavorite = async (foodId) => {
    const isFavorite = favoriteFoods.includes(foodId);

    const { success, message } = await toggleFavorite(foodId);

    if (success) {
        setFavoriteFoods((prevFavorites) =>
            isFavorite
                ? prevFavorites.filter((id) => id !== foodId) // Remove from favorites
                : [...prevFavorites, foodId] // Add to favorites
        );

        toast({
            title: message,
            status: isFavorite ? "warning" : "success",
            duration: 2000,
            isClosable: true,
        });
    } else {
        toast({
            title: "Failed to update favorite",
            status: "error",
            duration: 2000,
            isClosable: true,
        });
    }
    setSelectedFood(selectedFood);
};


  const handleScrollLeft = () => {
    setCarouselIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  const handleScrollRight = () => {
    setCarouselIndex((prevIndex) =>
      Math.min(prevIndex + 1, recipes.length - 5)
    );
  };

  const handleIconClick = (action) => {

    if (action === "update") {
      setUpdatedRecipe(selectedFood); // Ensure `updatedRecipe` is set
    }

    setActiveModal(action);
    onOpen();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRecipe((prevRecipe) => ({
      ...prevRecipe,
      [name]: name === "ingredients" || name === "instructions"
        ? value
            .split(name === "ingredients" ? "," : "\n")
            .map((i) => i.trimStart()) // Trims only leading whitespace, keeping spaces within words intact
        : value,
    }));
  };
  

  const handleAddRecipe = async () => {

    // Validate the image URL
    if (newRecipe.image && !isValidUrl(newRecipe.image)) {
      toast({
        title: "Invalid Image URL",
        description: "Please enter a valid image URL.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return; // Stop further execution if validation fails
    }

    const {success,message} = await createRecipe(newRecipe);
    console.log(newRecipe);
    if (!success) {
      toast({
        title:"Error",
        description: message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } else {
      toast({
        title:"Success",
        description: message,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    }
    setNewRecipe({
      title: "",
      ingredients: [],
      instructions: [],
      prepTime: "",
      category: "",
      image: "",
      video: "",
    });
    onClose();
  };

  const handleDeleteRecipe = async (rid) => {
   const {success,message} = await deleteRecipes(rid);
   if (!success) {
     toast({
       title:"Error",
       description: message,
       status: "error",
       duration: 5000,
       isClosable: true,
     });
   } else {
     toast({
       title:"Success",
       description: message,
       status: "success",
       duration: 5000,
       isClosable: true,
     });
   }
   onClose();
  };


  const handleUpdateRecipe = async (rid,updatedRecipe) => {

    // Validate the image URL
    if (updatedRecipe.image && !isValidUrl(updatedRecipe.image)) {
      toast({
        title: "Invalid Image URL",
        description: "Please enter a valid image URL.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return; // Stop further execution if validation fails
    }

    const {success,message} = await updateRecipes(rid,updatedRecipe);
    if (!success) {
      toast({
        title:"Error",
        description: message,
        status: "error",
        duration: 3500,
        isClosable: true,
      });
    } else {
      toast({
        title:"Success",
        description: message,
        status: "success",
        duration: 3500,
        isClosable: true,
      });
      setSelectedFood(updatedRecipe);
      
    }
    onClose();
  };

  /********************************************** Handling Report **************************************************/
  useEffect(() => {
    if (activeModal === "report") {
      fetchCGE(); // Fetch CGE users when report modal is opened
    }
  }, [activeModal, fetchCGE]);

  useEffect(() => {
    if (CGEs.length > 0) {
      // Filter out the current user
      setAvailableUsers(CGEs.filter((cge) => cge.name !== user?.name));
    }
  }, [CGEs, user]);

  const closeModal = () => {
    setSelectedUser(null);
    setReportDetails({ title: "", reason: "" });
    onClose();
  };
  

  const handleSubmitReport = async () => {
    if (!selectedUser || !reportDetails.title.trim() || !reportDetails.reason.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all fields.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const reportData = {
      reportedUserId:  selectedUser._id, 
      reportedUserName: selectedUser.name,
      reportTitle:  reportDetails.title,
      reportReason: reportDetails.reason,
      reporter_id: user._id, // Current user ID
      reporter_name: user.name, // Current user name
      reporter_role: user.role, // Current user role
      date: new Date().toISOString(),
  };

  console.log("Report Data:", reportData);

    try {
      const response = await addReportUser(reportData);

      if (!response.success) {
            throw new Error(response.message);
      }

      toast({
        title: "Report Submitted",
        description: "The user has been reported successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      onClose();
      setReportDetails({ title: "", reason: "" });
      setSelectedUser(null);
    } catch (error) {
      console.error("Error submitting report:", error);
      toast({
        title: "Error",
        description: "Failed to submit the report.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };


  return (
    <Flex
      direction="column"
      justify="center"
      align="center"
      h={{ base: "120vh", md: "100vh" }}
      bgImage={`url(${recipesBackground})`}
      bgSize="cover"
      bgPosition="center"
      bgRepeat="no-repeat"
      bgAttachment="fixed"
      position="relative"
      textAlign="center"
      filter={isOpen ? "blur(5px)" : "none"}  // Apply blur when modal is open
    > 
      {/* Keyframe animations */}
      <style>
        {`
          @keyframes slideLeftFadeOut {
            from { opacity: 1; transform: translateX(0); }
            to { opacity: 0; transform: translateX(-100px); }
          }

          @keyframes slideInFromCurve {
            from {
              transform: translate(150%, -150%) rotate(-20deg); /* Start at top-right tilted */
              opacity: 0;
            }
            to {
              transform: translate(0, 0) rotate(0deg); /* Settle at the center upright */
              opacity: 1;
            }
          }
        `}
      </style>

      {recipes.length === 0 ? (
        // Show message if no recipes exist
        <Center>
          <VStack spacing={4} bg="rgba(255, 255, 255, 0.8)" p={4} borderRadius="md">
            <Text fontSize="xl" fontWeight="bold">
              There are no recorded food recipes yet.
            </Text>
            <Link color="blue.500" onClick={() => handleIconClick("create")}>
              Create a new recipe
            </Link>
          </VStack>
        </Center>
      ) : (
        // Show main recipe content if recipes exist
      <Grid
        templateColumns={{ base: "1fr", md: "2fr 1fr" }}
        templateRows={{ base: "auto", md: "auto auto" }}
        gap={{ base: 4, md: 10 }}
        w="90%"
        maxW="1200px"
        // border = "3px solid white"
      >
        {/*Top Left column - Display Animation Image and details*/}
        <GridItem colSpan={{ base: 1, md: 1 }} rowSpan={{ base: 1, md: 1 }}>
          <Flex direction={{ base: "column", md: "row" }} gap={4} align="start"
                // border = "3px solid black"
                >
            <Center
              w={{ base: "200px", md: "300px" }}
              h={{ base: "200px", md: "300px" }}
              overflow="hidden"
              borderRadius="50%"
              border="3px solid white"
              pos="relative"
              sx={{
                animation:
                  animationState === "slide-left"
                    ? "slideLeftFadeOut 1.2s forwards"
                    : animationState === "slide-down"
                    ? "slideInFromCurve 1.4s forwards cubic-bezier(0.25, 1, 0.5, 1)"
                    : "none",
              }}
            >
             {selectedFood && (
              <Image
                // src={selectedFood.image}
                src={getImageSrc(selectedFood.image)}
                alt={selectedFood.title}
                objectFit="cover"
                w="full"
                h="full"
              />
            )}
            </Center>
            <VStack align="start" 
            // border="3px solid purple" 
            >
              <HStack 
                marginTop="20px"
                marginLeft="30px"
                >
                <Text fontSize={{ base: "2xl", md: "4xl" }} fontWeight="bold">
                  {truncateText(selectedFood?.title?.toUpperCase(), 12)}
                </Text>
                <Tooltip label="Add to favorites">
                <IconButton
                  marginTop="4px"
                  marginLeft= "4px"
                  size="sm"
                  icon={<FaHeart/>}
                  onClick={() => handleToggleFavorite(selectedFood?._id)}
                  colorScheme={favoriteFoods.includes(selectedFood?._id) ? "red" : "gray"}
                />
                </Tooltip>
              </HStack>

              {/* Rate Icon*/}
              <HStack 
                marginLeft="30px" 
                alignItems="center" 
                marginBottom="10px"
              > 
                <Text fontSize={{ base: "sm", md: "md", lg: "lg" }} fontWeight="medium">
                  {selectedFood?.AveRating ? selectedFood.AveRating : "No Yet Rated"}
                </Text>
                <Tooltip label=" Recipe Rating">
                  <Box
                    as="button"
                    size="25px"
                    backgroundColor="red"
                    borderRadius="full"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <FaStar size="20px" color="gold" />
                  </Box>
                </Tooltip>
                
              </HStack>

              <HStack 
                marginLeft="30px" 
                alignItems="center" 
                marginBottom="10px"  
              >
                <FaClock size="20px" />
                <Text fontSize={{ base: "sm", md: "md" }} fontWeight="medium">
                  {selectedFood?.prepTime}mins
                </Text>
              </HStack>
             
              
              <HStack spacing={5} marginLeft="30px"> {/* Wider gap for icons */}
                <Tooltip label="Create">
                <IconButton
                  size={iconButtonSize}
                  icon={<FaPlus />}
                  aria-label="Create"
                  bg="rgba(255, 255, 255, 0.6)" // Semi-transparent background
                  backdropFilter="blur(10px)" // Apply blur effect
                  _hover={{ bg: "rgba(255, 255, 255, 0.3)" }}
                  _active={{ bg: "rgba(255, 255, 255, 0.4)" }}
                  borderRadius="md" // Medium border radius for rounded corners
                  boxShadow="sm" // Subtle shadow for depth
                  onClick={() => handleIconClick("create")}
                />
                </Tooltip>
                <Tooltip label="Video">
                <IconButton
                  size={iconButtonSize}
                  icon={<FaYoutube/>}
                  aria-label="Video"
                  bg="rgba(255, 255, 255, 0.6)"
                  backdropFilter="blur(10px)"
                  _hover={{ bg: "rgba(255, 255, 255, 0.3)" }}
                  _active={{ bg: "rgba(255, 255, 255, 0.4)" }}
                  borderRadius="md"
                  boxShadow="sm"

                  // colorScheme="red"
                  onClick={() => {
                    if (!selectedFood?.video || !isValidYoutubeUrl(selectedFood.video)) {
                      toast({
                        title: "Invalid or missing video link.",
                        description: "Please provide a valid YouTube link.",
                        status: "warning",
                        duration: 3000,
                        isClosable: true,
                        position: "bottom",
                      });
                    } else {
                      window.open(selectedFood.video, "_blank");
                    }
                  }}
                />
                </Tooltip>
                <Tooltip label="Update"  >
                <IconButton
                  size={iconButtonSize}
                  icon={<FaEdit />}
                  aria-label="Update"
                  bg="rgba(255, 255, 255, 0.6)"
                  backdropFilter="blur(10px)"
                  _hover={{ bg: "rgba(255, 255, 255, 0.3)" }}
                  _active={{ bg: "rgba(255, 255, 255, 0.4)" }}
                  borderRadius="md"
                  boxShadow="sm"

                  // colorScheme="yellow"
                  onClick={() => handleIconClick("update")}
                />
                </Tooltip>

                {/* Report IconButton */}
                <Tooltip label="Report User">
                    <IconButton
                    size={iconButtonSize}
                    icon={<FaFlag />}
                    aria-label="Report User"
                    bg="rgba(255, 255, 255, 0.6)"
                    backdropFilter="blur(10px)"
                    _hover={{ bg: "rgba(255, 255, 255, 0.3)" }}
                    _active={{ bg: "rgba(255, 255, 255, 0.4)" }}
                    borderRadius="md"
                    boxShadow="sm"

                    onClick={() => handleIconClick("report")}
                    />
                </Tooltip>

                <Tooltip label="Delete">
                <IconButton
                  size={iconButtonSize}
                  icon={<FaTrash />}
                  bg="rgba(255, 255, 255, 0.6)"
                  backdropFilter="blur(10px)"
                  _hover={{ bg: "rgba(255, 255, 255, 0.3)" }}
                  _active={{ bg: "rgba(255, 255, 255, 0.4)" }}
                  borderRadius="md"
                  boxShadow="sm"
                  aria-label="Delete"
                  // colorScheme="orange"
                  onClick={() => handleIconClick("delete")}
                />
                </Tooltip>
              </HStack>
              <HStack spacing={4} mt={4} marginLeft="30px">
                <Menu>
                <MenuButton as={Button} rightIcon={<FaChevronDown />} height={{ base: "30px", md: "40px" }} width={{ base: "150px", md: "180px" }} fontSize={{ base: "sm", md: "md" }} border="2px solid">
                  {truncateText(selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1), 10)}{/* Display selected category */}
                </MenuButton>
                <MenuList maxH={{ base: "100px", md: "130px" }} minW={{ base: "150px", md: "180px" }} overflowY="auto"> {/* Set scrollable dropdown content */}
                  {categories.map((category) => (
                    <MenuItem key={category} onClick={() => setSelectedCategory(category.toLowerCase())}
                      fontSize={{ base: "sm", md: "md" }}
                      whiteSpace="pre-wrap"
                      overflowWrap="break-word"
                      _hover={{ bg: "gray.100" }}
                    >
                      {truncateSentences(category.charAt(0).toUpperCase() + category.slice(1), 17)}
                    </MenuItem>
                  ))}
                </MenuList>
              </Menu>
              </HStack>
            </VStack>
          </Flex>
        </GridItem>

        {/* Info Board content */}
        <GridItem 
          colSpan={{ base: 1, md: 1 }} 
          rowSpan={{ base: 1, md: 1 }}
        >
          <Box 
            bg="white" 
            p={{ base: 2, md: 4 }}
            borderRadius="md" 
            shadow="md" 
            maxW={{ base: "60%", md: "100%" }}
            maxH={{ base: "150px", md: "300px" }}
          >
            {/* Tab Navigation */}
            <Flex justify="space-around" mb={{ base: 2, md: 4 }}>
              <Button
                variant="link"
                colorScheme={activeTab === "Ingredients" ? "orange" : "gray"}
                onClick={() => setActiveTab("Ingredients")}
                borderBottom={activeTab === "Ingredients" ? "3px solid orange" : "none"}
                fontSize={{ base: "sm", md: "md" }}
              >
                Ingredients
              </Button>
              <Button
                variant="link"
                colorScheme={activeTab === "Instruction" ? "orange" : "gray"}
                onClick={() => setActiveTab("Instruction")}
                borderBottom={activeTab === "Instruction" ? "3px solid orange" : "none"}
                fontSize={{ base: "sm", md: "md" }}
              >
                Instructions
              </Button>
              <Button
                variant="link"
                colorScheme={activeTab === "Comments" ? "orange" : "gray"}
                onClick={() => setActiveTab("Comments")}
                borderBottom={activeTab === "Comments" ? "3px solid orange" : "none"}
                fontSize={{ base: "sm", md: "md" }}
              >
                Comments
              </Button>
            </Flex>

            {/* Scrollable Content */}
            <Box 
              maxH={{ base: "100px", md: "230px" }} 
              overflowY="auto" 
              padding={{ base: "8px", md: "10px" }}
              border="1px solid lightgray" 
              borderRadius="md"
              textAlign="left"
              fontSize={{ base: "sm", md: "md" }}
            >
              {activeTab === "Ingredients" ? (
              <VStack align="start">
                <Text fontWeight="semibold" mb={2}>Ingredients:</Text>
                <ul style={{ paddingLeft: "20px" }}>
                  {selectedFood?.ingredients.map((ingredient, index) => (
                   <li key={index}>
                   {truncateSentences(ingredient, 31)}
                 </li>
                  ))}
                </ul>
              </VStack>
            ) : activeTab === "Instruction" ? (
              <VStack align="start">
                <Text fontWeight="semibold" mb={2}>Instructions:</Text>
                <ol style={{ paddingLeft: "20px" }}>
                  {selectedFood?.instructions.map((instruction, index) => (
                    <li key={index} >
                      {/* <Text as="span" fontWeight="medium"></Text> */}
                      {truncateSentences(instruction, 31)}
                    </li>
                  ))}
                </ol>
              </VStack>
              ) : (
                <VStack align="start">
                  <Text fontWeight="semibold" mb={2}>Comments:</Text>
                  <ul style={{ paddingLeft: "20px" }}>
                    {selectedFood?.comments && selectedFood.comments.length > 0 ? (
                      selectedFood.comments.map((comment, index) => (
                        <li key={index}>
                          <Text fontWeight="medium">{truncateSentences(comment.user, 31)}:</Text> {/* User's name */}
                          <Text ml={4}>{truncateSentences(comment.text, 20)}</Text> {/* Comment text */}
                       
                          <Text fontSize="sm" color="gray.500" ml={4}>
                            {new Date(comment.date).toLocaleString()} {/* Comment date */}
                          </Text>
                        </li>
                      ))
                    ) : (
                      <Text>No comments available.</Text>
                    )}
                  </ul>
                </VStack>
              )}
            </Box>
          </Box>
        </GridItem>


        {/* Carousel content */}
        <GridItem colSpan={{ base: 1, md: 1 }} rowSpan={{ base: 1, md: 2 }}>
          <Flex
            align="center"
            pos="relative"
            overflow="hidden"
            w="100%"
            h={{ base: "130px", md: "150px" }}
            borderRadius="md"
            // border="3px solid red"
          >
            {/* Left Scroll Button */}
            <IconButton
              icon={<FaChevronLeft />} 
              onClick={handleScrollLeft}
              pos="absolute"
              left={{ base: "5px", md: "10px" }}
              bg="transparent"
              color="black"
              boxShadow="md"
              zIndex="2"
              aria-label="Scroll Left"
              _hover={{ bg: "gray.200" }}
              isDisabled={carouselIndex === 0} 
              size={{ base: "sm", md: "md" }}
            />
            <Flex
              as="div"
              alignItems="center"
              position="relative"
              overflow="hidden"
              w="full"
              gap={{ base: 6, md: 10 }}
              pl={{ base: "45px", md: "60px" }}
              pr={{ base: "45px", md: "60px" }}
              transition="transform 0.5s ease-in-out"
              // transform={`translateX(-${carouselIndex * 1}px)`} // Smooth transition
            >
              {filteredRecipes
                .slice(carouselIndex, carouselIndex + numberOfItems) // Show only 5 items
                .map((food) => (
                  <VStack
                    key={food._id}
                    onClick={() => handleFoodSelection(food)}
                    cursor="pointer"
                    w="100px"
                    flexShrink={0}
                    p={2}
                    textAlign="center"
                    bg={food._id === selectedFood?._id ? "#b1b5b5" : "transparent"} // Apply background only to the selected item
                    boxShadow={
                      food._id === selectedFood?._id
                        ? "0 4px 15px rgba(0, 0, 0, 0.2)" // Highlight shadow for the selected item
                        : "none"
                    }
                    transform={
                      food._id === selectedFood?._id
                        ? "scale(1.05)" // Slight zoom for the selected item
                        : "scale(1)"
                    }
                    borderRadius="15px"
                    transition="transform 0.3s ease, background-color 0.3s ease"
                    _hover={{
                      boxShadow: "xl",
                      transform: food._id === selectedFood?._id ? "scale(1.05)" : "scale(1.1)", // Ensure hover works correctly
                     }}
                    >
                    
                    <Image
                      src={getImageSrc(food?.image)}
                      alt={food?.title || "404 No Found"}
                      borderRadius="full"
                      boxSize="85px"
                    />
                    <Text>{truncateText(food.title, 7)}</Text>
                  </VStack>
                ))}
            </Flex>
            {/* Right Scroll Button */}
            <IconButton
              icon={<FaChevronRight />} // Use the React Icon component here
              onClick={handleScrollRight}
              pos="absolute"
              right={{ base: "5px", md: "10px" }}
              bg="transparent"
              color= "black"
              boxShadow="md"
              zIndex="2"
              aria-label="Scroll Right"
              _hover={{ bg: "gray.200" }}
              isDisabled={carouselIndex + 5 >= filteredRecipes.length} // Disable if at end
              size={{ base: "sm", md: "md" }}
            />
          </Flex>
        </GridItem>

      </Grid>
      )}

        {/* CRUD Icon Section */}
        {/* <GridItem 
          colSpan={{ base: 2, md: 2 }} 
          rowSpan={{ base: 1, md: 1 }}
          display = "flex"
          justifyContent="left"
          position="absolute"
          bottom="20"
          w="100%"
          marginLeft="250px"
        > */}

      {/* Modal for CRUD actions */}
      <Modal isOpen={isOpen} onClose={() => {
          if (activeModal === "create") {
            resetNewRecipe(); // Clear the input fields
          }
          onClose(); // Close the modal
        }}
      >
        <ModalOverlay />
        <ModalContent
          bg="rgba(255, 255, 255, 0.6)" // Semi-transparent modal background
          boxShadow="lg"
          border="1px solid grey"
        > 
          <ModalHeader>
            {activeModal === "create" && "Create New Recipe"}
            {activeModal === "update" && "Update Recipe"}
            {activeModal === "delete" && "Delete Recipe"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
          {["create", "update"].includes(activeModal) && (
            <VStack spacing={4} align="stretch">
              <Input
                placeholder="Title"
                name="title"
                value={activeModal === "update" ? updatedRecipe?.title || "" : newRecipe.title}
                onChange={(e) =>
                  activeModal === "update"
                    ? setUpdatedRecipe((prev) => ({
                        ...prev,
                        [e.target.name]: e.target.value,
                      }))
                    : handleInputChange(e)
                }
              />
              <Textarea
                placeholder="Ingredients (comma-separated)"
                name="ingredients"
                value={
                  activeModal === "update"
                    ? updatedRecipe?.ingredients.join(",") || ""
                    : newRecipe.ingredients.join(",")
                }
                onChange={(e) =>
                  activeModal === "update"
                    ? setUpdatedRecipe((prev) => ({
                        ...prev,
                        [e.target.name]: e.target.value.split(","),
                      }))
                    : handleInputChange(e)
                }
              />
              <Textarea
                placeholder="Instructions (one per line)"
                name="instructions"
                value={
                  activeModal === "update"
                    ? updatedRecipe?.instructions.join("\n") || ""
                    : newRecipe.instructions.join("\n")
                }
                onChange={(e) =>
                  activeModal === "update"
                    ? setUpdatedRecipe((prev) => ({
                        ...prev,
                        [e.target.name]: e.target.value.split("\n"),
                      }))
                    : handleInputChange(e)
                }
              />
              <Input
                placeholder="Time Needed (minutes)"
                type="number"
                name="prepTime"
                value={activeModal === "update" ? updatedRecipe?.prepTime || "" : newRecipe.prepTime}
                onChange={(e) =>
                  activeModal === "update"
                    ? setUpdatedRecipe((prev) => ({
                        ...prev,
                        [e.target.name]: e.target.value,
                      }))
                    : handleInputChange(e)
                }
              />
              <Input
                placeholder="Category"
                name="category"
                value={activeModal === "update" ? updatedRecipe?.category || "" : newRecipe.category}
                onChange={(e) =>
                  activeModal === "update"
                    ? setUpdatedRecipe((prev) => ({
                        ...prev,
                        [e.target.name]: e.target.value,
                      }))
                    : handleInputChange(e)
                }
              />
              <Box>
                <Text fontWeight="bold">Select Image Source:</Text>
                <Stack direction="row" spacing={4} mt={2}>
                  <Button
                    variant={imageSource === "url" ? "solid" : "outline"}
                    onClick={() => setImageSource("url")}
                  >
                    URL
                  </Button>
                  <Button
                    variant={imageSource === "upload" ? "solid" : "outline"}
                    onClick={() => setImageSource("upload")}
                  >
                    Upload
                  </Button>
                </Stack>
                {imageSource === "url" ? (
                  <Input
                    mt={4}
                    placeholder="Enter Image URL"
                    name="image"
                    value={activeModal === "update" ? updatedRecipe?.image || "" : newRecipe.image || ""}
                    onChange={(e) =>
                      activeModal === "update"
                        ? setUpdatedRecipe((prev) => ({
                            ...prev,
                            [e.target.name]: e.target.value,
                          }))
                        : handleInputChange(e)
                    }
                  />
                ) : (
                  <Input
                    mt={4}
                    type="file"
                    accept="image/*"
                    key={activeModal === "update" ? "updateFileInput" : "newFileInput"} // Force re-render for consistent behavior
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = () => {
                          const base64String = reader.result || ""; // Default to empty string
                          if (activeModal === "update") {
                            setUpdatedRecipe((prev) => ({ ...prev, image: base64String }));
                          } else {
                            setNewRecipe((prev) => ({ ...prev, image: base64String }));
                          }
                        };
                        reader.readAsDataURL(file);
                      } else {
                        // Handle case where no file is selected
                        if (activeModal === "update") {
                          setUpdatedRecipe((prev) => ({ ...prev, image: "" }));
                        } else {
                          setNewRecipe((prev) => ({ ...prev, image: "" }));
                        }
                      }
                    }}
                  />


                )}
              </Box>

              <Input
                placeholder="Video URL [optional]"
                name="video"
                value={activeModal === "update" ? updatedRecipe?.video || "" : newRecipe.video}
                onChange={(e) =>
                  activeModal === "update"
                    ? setUpdatedRecipe((prev) => ({
                        ...prev,
                        [e.target.name]: e.target.value,
                      }))
                    : handleInputChange(e)
                }
              />
            </VStack>
          )}
           

            {activeModal === "delete" && (
              <Text>Are you sure you want to delete{" "}
              <Text as="span" fontWeight="bold">
                "{selectedFood?.title}"
              </Text>{" "}
              recipe?
              </Text>
            )}
          </ModalBody>
          <ModalFooter>
            {activeModal === "delete" ? (
              <>
                <Button colorScheme="red" mr={3} onClick={() => handleDeleteRecipe(selectedFood?._id)} >
                  Delete
                </Button>
                <Button onClick={onClose}>Cancel</Button>
              </>
            ) : ["create", "update"].includes(activeModal) ? (
              <>
                <Button
                  colorScheme="blue"
                  mr={3}
                  onClick={
                    activeModal === "create"
                      ? handleAddRecipe
                      : () => handleUpdateRecipe(selectedFood?._id, updatedRecipe)
                  }
                >
                  {activeModal === "create" ? "Submit" : "Confirm"}
                </Button>
                <Button
                  onClick={() => {
                    if (activeModal === "create") {
                      resetNewRecipe(); // Reset the inputs when the "Cancel" button is clicked
                    }
                    onClose(); // Close the modal
                  }}
                >
                  Cancel
                </Button>
              </>
            ) : null}
          </ModalFooter>
        </ModalContent>
      </Modal>
      
      {/* Modal for Reporting Users */}
      {activeModal === "report" && (
        <Modal 
          isOpen={isOpen} 
          onClose = {closeModal}
          autoFocus = {false}
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Report User</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={4}  align="stretch">
              <Menu>
                <MenuButton as={Button} rightIcon={<FaChevronDown />} width="400px">
                    {selectedUser ? truncateText(selectedUser.name, 20) : "Select a User"}
                </MenuButton>
                <MenuList maxHeight="200px" overflowY="auto" width="400px">
                  {availableUsers.map((user, index) => (
                    <MenuItem key={user.id || index} onClick={() => setSelectedUser(user)}>
                      {truncateText( user.name, 50)}{/* Display selected user */}
                    </MenuItem>
                  ))}
                </MenuList>
              </Menu>
    

                <Input
                  placeholder="Title"
                  value={reportDetails.title}
                  onChange={(e) =>
                    setReportDetails((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  }
                />
                <Textarea
                  placeholder="Reason"
                  value={reportDetails.reason}
                  onChange={(e) =>
                    setReportDetails((prev) => ({
                      ...prev,
                      reason: e.target.value,
                    }))
                  }
                />
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={handleSubmitReport}>
                Submit Report
              </Button>
              <Button variant="ghost" onClick={closeModal}
              >
                Cancel
                </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}

    </Flex>
    
  );
};

export default Recipes;
