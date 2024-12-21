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
  useBreakpointValue 
} from "@chakra-ui/react";
import { FaHeart, FaPlus, FaEdit, FaTrash, FaClock, FaYoutube, FaStar} from "react-icons/fa";
import { FaChevronLeft, FaChevronRight, FaChevronDown } from "react-icons/fa"; // Import specific icons
import recipesBackground from "../pic/room.jpg";
import { useStoreRecipe } from "../store/StoreRecipe";

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
  const {createRecipe, deleteRecipes, updateRecipes} = useStoreRecipe();
  const {fetchRecipes, recipes} = useStoreRecipe();
  const [categories, setCategories] = useState(["All"]); // "All" as default
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [updatedRecipe, setUpdatedRecipe] = useState(selectedFood);
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
    fetchRecipes().then(() => {
      setSelectedCategory("all"); // Set category to "All" after fetching recipes
    });
  }, [fetchRecipes]);
  

  // useEffect(() => {
  //   fetchRecipes();
  // }, [fetchRecipes]);


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
  


  const handleToggleFavorite = (foodId) => {
    const isFavorite = favoriteFoods.includes(foodId);
    setFavoriteFoods((prevFavorites) =>
      isFavorite
        ? prevFavorites.filter((id) => id !== foodId)
        : [...prevFavorites, foodId]
    );

    toast({
      title: isFavorite ? "Unsaved" : "Saved as Favourite",
      status: isFavorite ? "warning" : "success",
      duration: 2000,
      isClosable: true,
    });
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

  return (
    <Flex
      direction="column"
      justify="center"
      align="center"
      h="100vh"
      bgImage={`url(${recipesBackground})`}
      bgSize="cover"
      bgPosition="center"
      bgRepeat="no-repeat"
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
                  onClick={() => handleToggleFavorite(selectedFood?.id)}
                  colorScheme={favoriteFoods.includes(selectedFood?.id) ? "red" : "gray"}
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
             
              
              <HStack spacing={7} marginLeft="30px"> {/* Wider gap for icons */}
                <Tooltip label="Create">
                <IconButton
                  size={iconButtonSize}
                  icon={<FaPlus/>}
                  aria-label="Create"
                  colorScheme="teal"
                  onClick={() => handleIconClick("create")}
                />
                </Tooltip>
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
                  colorScheme="yellow"
                  onClick={() => handleIconClick("update")}
                />
                </Tooltip>
                <Tooltip label="Delete">
                <IconButton
                  size={iconButtonSize}
                  icon={<FaTrash />}
                  aria-label="Delete"
                  colorScheme="orange"
                  onClick={() => handleIconClick("delete")}
                />
                </Tooltip>
              </HStack>
              <HStack spacing={4} mt={4} marginLeft="30px">
                <Menu>
                  <MenuButton as={Button} rightIcon={<FaChevronDown />} width={{ base: "150px", md: "180px" }} fontSize={{ base: "sm", md: "md" }} border="2px solid">
                    {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} {/* Display selected category */}
                  </MenuButton>
                  <MenuList maxH="100px" minW={{ base: "150px", md: "180px" }} overflowY="auto"> {/* Set scrollable dropdown content */}
                    {categories.map((category) => (
                      <MenuItem key={category} onClick={() => setSelectedCategory(category.toLowerCase())}
                        fontSize={{ base: "sm", md: "md" }}
                      >
                        {category.charAt(0).toUpperCase() + category.slice(1)}
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
                   {ingredient}
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
                      {instruction}
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
                          <Text fontWeight="medium">{comment.user}:</Text> {/* User's name */}
                          <Text ml={4}>{comment.text}</Text> {/* Comment text */}
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
                .slice(carouselIndex, carouselIndex + 5) // Show only 5 items
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
      <Modal isOpen={isOpen} onClose={onClose}>
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
              <Input
                placeholder="Image URL"
                name="image"
                value={activeModal === "update" ? updatedRecipe?.image || "" : newRecipe.image}
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
                <Button onClick={onClose}>Cancel</Button>
              </>
            ) : null}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
};

export default Recipes;
