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
  Select,
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
  useBreakpointValue
} from "@chakra-ui/react";
import { FaHeart, FaComment, FaFlag, FaClock, FaYoutube, FaUser, FaStar} from "react-icons/fa";
import { FaChevronLeft, FaChevronRight, FaChevronDown } from "react-icons/fa"; // Import specific icons
import recipesBackground from "../pic/room.jpg";
import { useStoreRecipe } from "../store/StoreRecipe";
import { useAuthStore } from "../store/authStore";
import StarRatings from "react-star-ratings";

const VisitorPage = () => {
  const { user, setSelectedUserId } = useAuthStore(); // Access current user info
  const { fetchCook, cooks} = useAuthStore();
  const { fetchFavoriteRecipes, toggleFavorite } = useStoreRecipe();
  const { addComment, addReport, addRate, fetchRecipeById} = useStoreRecipe();
  const {fetchRecipesWithoutEvent, recipesWithoutEvent} = useStoreRecipe();
  const {selectedFoodGlobal} = useStoreRecipe();


  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedUserName, setSelectedUserName] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [tempUserName, setTempUserName] = useState("");


  const [showCommentModal, setShowCommentModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showRateModal, setShowRateModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [commentText, setCommentText] = useState("");
  const [reportTitle, setReportTitle] = useState("");
  const [reportReason, setReportReason] = useState("");
  const [selectedFood, setSelectedFood] = useState(null);
  const [animationState, setAnimationState] = useState("");
  const [activeTab, setActiveTab] = useState("Instruction");
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [favoriteFoods, setFavoriteFoods] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [categories, setCategories] = useState(["All"]); // "All" as default
  const [selectedCategory, setSelectedCategory] = useState("All");
  
  const numberOfItems = useBreakpointValue({ base: 2, md: 5 });
  
  const toast = useToast();
  const iconButtonSize = useBreakpointValue({ base: "sm", md: "md" });

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
    if (showModal) {
        // console.log("Before fetch, cooks:", cooks); // Initial state
        fetchCook();
        // console.log("After fetch, cooks:", cooks); // Check if cooks are updated
    }
  }, [showModal, fetchCook]);
  

  useEffect(() => {
    fetchRecipesWithoutEvent().then(() => {
      setSelectedCategory("all"); // Set category to "All" after fetching recipes
    });
  }, [fetchRecipesWithoutEvent]);


  useEffect(() => {
    if (selectedUser && recipesWithoutEvent.length > 0) {
        // Filter recipes for the selected user
        const userRecipes = recipesWithoutEvent.filter((recipe) => recipe.user_id === selectedUser);

        // Check if the current `selectedFood` is still valid
        const isCurrentSelectedValid = userRecipes.some(
            (recipe) => recipe._id === selectedFood?._id
        );

        if (!isCurrentSelectedValid) {
            // If current `selectedFood` is invalid, set the first recipe or null
            setSelectedFood(userRecipes.length > 0 ? userRecipes[0] : null);
        }

        // Get unique categories from this user's recipes
        const uniqueCategories = Array.from(
            new Set(
                userRecipes.map((recipe) => recipe.category.toLowerCase())
            )
        ).map(capitalize);
        setCategories(["All", ...uniqueCategories]);
    }
}, [selectedUser, recipesWithoutEvent, selectedFood]);

  

  const filteredByUser = selectedUser
  ? recipesWithoutEvent.filter((recipe) => recipe.user_id === selectedUser) // Match by ID
  : recipesWithoutEvent;

  const filteredRecipes = selectedCategory === "all"
  ? filteredByUser
  : filteredByUser.filter(
      (recipe) => recipe.category.toLowerCase() === selectedCategory
    );

  /**********************************When global selection changes *********************************/
  useEffect(() => {
      if (selectedFoodGlobal) {
        setSelectedCategory("all"); // Set category to "All" after fetching recipes
        setSelectedFood(selectedFoodGlobal); // Update local state when global selection changes
      }
    }, [selectedFoodGlobal]); // Runs whenever `selectedFoodGlobal` changes
  


  useEffect(() => {
    if (selectedFoodGlobal) return; // ✅ Prevent override if `selectedFoodGlobal` was just set

    if (filteredRecipes.length > 0) {
      setSelectedFood(filteredRecipes[0]); // Set the first recipe as default
    } else {
      setSelectedFood(null); // Clear selection if no recipes match
    }
  }, [selectedCategory, selectedFoodGlobal]); // Re-run effect when `selectedCategory


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

  /* ******************************************Favourite Recipes****************************************** */

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
  
      if (user?.role === "cook" || user?.role === "guest") {
        fetchData();
      }
    }, [fetchFavoriteRecipes, setFavoriteFoods, user?.role]);


    const handleToggleFavorite = async (foodId) => {
      const isFavorite = favoriteFoods.includes(foodId);
      //console.log ("********foodID pass to handleToggleFavorite**********",foodId);
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
      Math.min(prevIndex + 1, recipesWithoutEvent.length - numberOfItems)
    );
  };

  const handleUserSelection = () => {
    const user = cooks.find((user) => user.name === tempUserName); // Match user by name

    if (!user) {
      toast({
        title: "User Not Found",
        description: `${tempUserName} is not recognized.`,
        status: "info",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    const selectedRecipes = recipesWithoutEvent.filter((recipe) => recipe.user_id === user._id);
    // console.log("Recipe user_id format after:", recipes.map((recipe) => recipe.user_id));

    if (selectedRecipes.length === 0) {
      toast({
        title: "No Recipes Found",
        description: `${tempUserName} has not created any recipes.`,
        status: "info",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      return; // Don't close the modal if no recipes exist
    }
    
    setSelectedUserId(user._id); // ✅ Update global state with selectedUserId
    setSelectedUser(user._id); // Store user ID instead of name
    setSelectedUserName(user.name);
    setSelectedFood(selectedRecipes[0]);// Set the first recipe from this user
    setSelectedCategory("all"); // Reset category to "All" when a new user is selected
    setShowModal(false);
  };
  
   const handleIconClick = (type) => {
    if (type === "comments") {
      setShowCommentModal(true);
    } else if (type === "report") {
      setShowReportModal(true);
    } else if (type === "rate") {
      setShowRateModal(true);
    }
  };

  const handleSubmitComment = async () => {
    if (!commentText.trim()) {
        toast({
            title: "Comment is empty",
            description: "Please enter a valid comment.",
            status: "warning",
            duration: 2000,
            isClosable: true,
        });
        return;
    }

    const comment = {
        user: user.name, // Dynamically fetch the current user's name
        text: commentText,
        date: new Date().toISOString(), // Include the current date
    };

    try {
        const response = await addComment(selectedFood._id, comment);

        if (!response.success) {
            throw new Error(response.message);
        }

        setSelectedFood((prev) => ({
          ...prev,
          comments: [...(prev.comments || []), comment], // Add the new comment
      }));

        toast({
            title: "Comment added successfully",
            status: "success",
            duration: 2000,
            isClosable: true,
        });

        setCommentText("");
        setShowCommentModal(false);
    } catch (error) {
        console.error("Failed to add comment:", error);
        toast({
            title: "Failed to add comment",
            description: error.message || "An unexpected error occurred.",
            status: "error",
            duration: 2000,
            isClosable: true,
        });
        setCommentText("");
    }
  };


  const handleSubmitReport = async () => {
    if (!reportTitle.trim() || !reportReason.trim()) {
        toast({
            title: "Incomplete Report",
            description: "Please fill in both the title and reason.",
            status: "warning",
            duration: 2000,
            isClosable: true,
        });
        return;

    }

    if (!selectedFood) {
        toast({
            title: "No Recipe Selected",
            description: "Please select a recipe to report.",
            status: "warning",
            duration: 2000,
            isClosable: true,
        });
        return;
    }

    const reportData = {
        reportedUserId: selectedFood.user_id, // Recipe's author ID
        reportedUserName: selectedUserName,
        reportedRecipeId: selectedFood._id,
        reportedRecipeName: selectedFood.title,
        reportTitle: reportTitle,
        reportReason: reportReason,
        reporter_id: user._id, // Current user ID
        reporter_name: user.name, // Current user name
        reporter_role: user.role, // Current user role
        date: new Date().toISOString(),
    };

    try {
        const response = await addReport(reportData);

        if (!response.success) {
            throw new Error(response.message);
        }

        toast({
            title: "Report submitted successfully",
            description: response.message,
            status: "success",
            duration: 2000,
            isClosable: true,
        });

        setReportTitle("");
        setReportReason("");
        setShowReportModal(false);
    } catch (error) {
        console.error("Failed to submit report:", error);
        toast({
            title: "Failed to submit report",
            description: error.message || "An unexpected error occurred.",
            status: "error",
            duration: 2000,
            isClosable: true,
        });

    }
};



  const changeRating = (newRating) => {
    setRating(newRating);
  };

  useEffect(() => {
    if(showRateModal) {
      setRating(0);
    }
  }, [showRateModal]);


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
  
  
  

  const handleSubmitRate = async () => {
    if (!rating) {
      toast({
        title: "Incomplete Rating",
        description: "Please select a rating.",
        status: "warning",
        duration: 2000,
        isClosable: true,
      });
      return;
    }
  
    const recipeId = selectedFood._id;
    const userId = user._id;
  
    try {
      const response = await addRate(recipeId, { userId, rating });
      if (!response.success) {
        throw new Error(response.message);
      }
  
      toast({
        title: "Rating submitted",
        description: "Thank you for your rating.",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
      setShowRateModal(false);
    } catch (error) {
      console.error("Failed to submit rating:", error);

      const errorMessage = error.response?.previousRating
      ? `${error.message} You previously rated this recipe with ${error.response.previousRating} star(s).`
      : error.message || "An unexpected error occurred.";

      toast({
        title: "Failed to submit rating",
        description: errorMessage,
        status: "error",
        duration: 2000,
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
      w={{ base: "100%", md: "150vh", lg: "100%" }}
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

      {!selectedUser ? (
        <Center>
         <VStack spacing={4} bg="rgba(255, 255, 255, 0.8)" p={4} borderRadius="md">
          <Text fontSize="xl" fontWeight="bold">
             {user ? `Hello, ${truncateText(user.name, 20)} !` : "Welcome, Visitor!"}
            </Text>
            <Text fontSize="xl" fontWeight="light">
              Please choose a user/chef to view their recipes.
            </Text>
            <Link color="blue.500" onClick={() => setShowModal(true)}>
              Choose Chef/User
            </Link>
          </VStack>
        </Center>
      ) : (
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
                {user?.role === "guest" && (
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
                )}
                
              </HStack>
              <Text marginLeft="30px" fontSize={{ base: "sm", md: "md" }} fontWeight="semibold" color="gray.600">
                Author: {truncateText(cooks.find((u) => u._id === selectedUser)?.name || "Unknown",15)}
            </Text>

            {/* Rate IconButton */}
              <HStack 
                marginLeft="30px" 
                alignItems="center" 
                marginBottom="10px"
              > 
                <Text fontSize={{ base: "sm", md: "md", lg: "lg" }} fontWeight="medium">
                  {selectedFood?.AveRating ? selectedFood.AveRating : "No Yet Rated"}
                </Text>
                <Tooltip label="Rate Recipe">
                  <Box
                    as="button"
                    size="25px"
                    backgroundColor="red"
                    borderRadius="full"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    onClick={() => handleIconClick("rate")}
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
              <HStack spacing={7} marginLeft="30px"> {/* Wider gap for icons */}
                
              
                {/* Comments IconButton */}
                {user?.role === "guest" && (
                <Tooltip label="Comments">
                    <IconButton
                    size={iconButtonSize}
                    icon={<FaComment />}
                    aria-label="Add Comment"
                    colorScheme="teal"
                    onClick={() => handleIconClick("comments")}
                    />
                </Tooltip>
                )}

                {/* Report IconButton */}
                {user?.role === "guest" && (
                <Tooltip label="Report Recipe">
                    <IconButton
                    size={iconButtonSize}
                    icon={<FaFlag />}
                    aria-label="Report Recipe"
                    colorScheme="orange"
                    onClick={() => handleIconClick("report")}
                    />
                </Tooltip>
                )}
                

                <Tooltip label="Video">
                <IconButton
                  size={iconButtonSize}
                  icon={<FaYoutube/>}
                  aria-label="Video"
                  colorScheme="red"
                  onClick={() => {
                    if (!selectedFood?.video || !isValidYoutubeUrl(selectedFood.video)) {
                      toast({
                        title: "Invalid or missing video link.",
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


                {/* Cook Selection IconButton */}
                <Tooltip label="Select Cook">
                    <IconButton
                        size={iconButtonSize}
                        icon={<FaUser />}
                        aria-label="Select Cook"
                        colorScheme="blue"
                        onClick={() => setShowModal(true)} // Opens the modal for Cook selection
                    />
                </Tooltip>


              </HStack>
              <HStack spacing={4} mt={4} marginLeft="30px">
                <Menu>
                  <MenuButton as={Button} rightIcon={<FaChevronDown />} width={{ base: "150px", md: "180px" }} fontSize={{ base: "sm", md: "md" }} border="2px solid">
                    {truncateText(selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1), 10)}{/* Display selected category */}
                  </MenuButton>
                  <MenuList maxH="100px" minW={{ base: "150px", md: "180px" }} overflowY="auto"> {/* Set scrollable dropdown content */}
                    {categories.map((category) => (
                      <MenuItem key={category} onClick={() => setSelectedCategory(category.toLowerCase())}
                        fontSize={{ base: "sm", md: "md" }}
                        whiteSpace="pre-wrap"
                        overflowWrap="break-word"
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
            maxW={{ base: "80%", md: "100%" }}
            maxH={{ base: "150px", md: "300px" }}
          >
            {/* Tab Navigation */}
            <Flex justify="space-around" mb={4}>
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
                          <Text fontWeight="medium">{truncateSentences(comment.user, 28)}:</Text> {/* User's name */}
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
              left="1px"
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
              right={{ base: "60px", md: "10px" }}
              bg="transparent"
              color= "black"
              boxShadow="md"
              zIndex="2"
              aria-label="Scroll Right"
              _hover={{ bg: "gray.200" }}
              isDisabled={carouselIndex + numberOfItems >= filteredRecipes.length} // Disable if at end
              size={{ base: "sm", md: "md" }}
            />
          </Flex>
        </GridItem>

      </Grid>
      )}


      {/* Modal for choosing a user/chef */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <ModalOverlay />
        <ModalContent bg="linear-gradient(to top left, #ffecd2, #fcb69f)" border={"2px solid black"}>
            <ModalHeader>Select a Cook</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
            {cooks.length > 0 ? (
                <Select
                placeholder="Select a Cook"
                border={"1px solid black"}
                value={tempUserName}
                onChange={(e) => setTempUserName(e.target.value)}
                >
                {cooks.map((user) => (
                    <option key={user._id?.$oid || user.name} value={user.name}>
                    {truncateText(user.name, 35)}
                    
                    </option>
                ))}
                </Select>
            ) : (
                <Text>Loading Usernames...</Text> // Error handling when no usernames are available
            )}
            </ModalBody>
            <ModalFooter>
            <Button onClick={() => setShowModal(false)} mr={3}>
                Cancel
            </Button>
            <Button
                onClick={handleUserSelection}
                colorScheme="blue"
                isDisabled={!tempUserName} // Disable Confirm if no user is selected
            >
                Confirm
            </Button>
            </ModalFooter>
        </ModalContent>
        </Modal>

        {/* Rate Modal */}
        <Modal isOpen={showRateModal} onClose={() => setShowRateModal(false)}>
            <ModalOverlay />
            <ModalContent bg="linear-gradient(to top left, #ffecd2, #fcb69f)" border={"2px solid black"}>
            <ModalHeader>Rate Recipe</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <StarRatings
                rating={rating}
                starRatedColor="gold"
                changeRating={changeRating}
                numberOfStars={5}
                name="recipeRating"
                starDimension="30px"
                starSpacing="5px"
              />
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" onClick= {handleSubmitRate} >
                Submit
              </Button>
              <Button variant="ghost" onClick={() => 
                setShowRateModal(false)}
                >
                Cancel
                </Button>
            </ModalFooter>
            </ModalContent>
        </Modal>


        {/* Comment Modal */}
        <Modal isOpen={showCommentModal} onClose={() =>{
          setCommentText('');
          setShowCommentModal(false);
        }
          }>
            <ModalOverlay />
            <ModalContent bg="linear-gradient(to top left, #ffecd2, #fcb69f)" border={"2px solid black"}>
            <ModalHeader>Add a Comment</ModalHeader>
            <ModalCloseButton 
            />
            <ModalBody>
                <Textarea
                placeholder="Enter your comment here..."
                value={commentText}
                border={"1px solid black"}
                onChange={(e) => setCommentText(e.target.value)}
                />
            </ModalBody>
            <ModalFooter>
                <Button colorScheme="blue" mr={2}onClick={handleSubmitComment}>
                Submit
                </Button>
                <Button variant="ghost" onClick={() => {
                  setShowCommentModal(false);
                  setCommentText("");
                }}
                  >
                Cancel
                </Button>
            </ModalFooter>
            </ModalContent>
        </Modal>

        {/* Report Modal */}
        <Modal isOpen={showReportModal} onClose={() => {
          setReportTitle("") ;
          setReportReason("") ;
          setShowReportModal(false);
          }}>
            <ModalOverlay />
            <ModalContent bg="linear-gradient(to top left, #ffecd2, #fcb69f)" border={"2px solid black"}>
            <ModalHeader>Report Recipe</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
                <VStack spacing={4}>
                <Input
                    placeholder="Report Title"
                    value={reportTitle}
                    border={"1px solid black"}
                    onChange={(e) => setReportTitle(e.target.value)}
                />
                <Textarea
                    placeholder="Reason for reporting"
                    value={reportReason}
                    border={"1px solid black"}
                    onChange={(e) => setReportReason(e.target.value)}
                />
                </VStack>
            </ModalBody>
            <ModalFooter>
                <Button colorScheme="red" mr={2} onClick={handleSubmitReport}>
                Submit Report
                </Button>
                <Button variant="ghost" onClick={() =>{
                   setReportTitle("") ;
                   setReportReason("") ;
                   setShowReportModal(false);
                  }}
                   >
                Cancel
                </Button>
            </ModalFooter>
            </ModalContent>
        </Modal>

    </Flex>
  );
};

export default VisitorPage;
