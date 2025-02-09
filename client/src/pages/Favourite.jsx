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
  Center,
  useDisclosure,
  Link,
  Tooltip,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useBreakpointValue,
} from "@chakra-ui/react";
import { FaHeart, FaClock, FaStar, FaYoutube} from "react-icons/fa";
import { FaChevronLeft, FaChevronRight, FaChevronDown } from "react-icons/fa"; // Import specific icons
import recipesBackground from "../pic/room.jpg";
import { useStoreRecipe } from "../store/StoreRecipe";
import { useAuthStore } from "../store/authStore";

const Favorites = () => {
  const { user, fetchCook, cooks } = useAuthStore(); // Access current user info
  const [recipes, setRecipes] = useState([]); // Store all fetched recipes
  const [authorName, setAuthorName] = useState("Unknown");

  const { selectedFoodGlobal} = useStoreRecipe();

  const [selectedFood, setSelectedFood] = useState(null);
  const numberOfItems = useBreakpointValue({ base: 2, md: 5 });
  
  const [animationState, setAnimationState] = useState("");
  const [activeTab, setActiveTab] = useState("Instruction");
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [favoriteFoods, setFavoriteFoods] = useState([]);
  const [toggleFav, setToggleFav] = useState(false);
  const { isOpen} = useDisclosure();
  const {fetchRecipeById, fetchFavoriteRecipes, toggleFavorite } = useStoreRecipe();
  const [categories, setCategories] = useState(["All"]); // "All" as default
  const [selectedCategory, setSelectedCategory] = useState("All");
  const iconButtonSize = useBreakpointValue({ base: "sm", md: "md" });
  const toast = useToast();

  const getImageSrc = (image) => {
    return isValidUrl(image) ? image : "https://i.pinimg.com/originals/88/4f/6b/884f6bbb75ed5e1446d3b6151b53b3cf.gif";
  };

  const capitalize = (str) => {
    return str.replace(/\b\w/g, (char) => char.toUpperCase());
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


    // Fetch Favorite Recipes on Component Mount
    useEffect(() => {
      const fetchFavorites = async () => {
          try {
              const response = await fetchFavoriteRecipes();
              if (response.success) {
                  setRecipes(response.data); // Save fetched favorite recipes
                  setFavoriteFoods(response.data.map((recipe) => recipe._id)); // Save IDs of favorites
                  setSelectedCategory("all"); // Set category to "All" after fetching recipes
              }
          } catch (error) {
              console.error("Error fetching favorite recipes:", error);
          }
      };
      fetchFavorites();

    }, [fetchFavoriteRecipes, setFavoriteFoods, toggleFav]);


    // This useEffect will fetch the author's name when a recipe is selected
    useEffect(() => {
      if (!selectedFood?._id) return;
  
      const fetchData = async () => {
        try {
          // Step 1: Fetch the recipe details by ID
          const recipeResponse = await fetchRecipeById(selectedFood._id);
  
          if (recipeResponse.success) {
            const userID = recipeResponse.data?.user_id;
  
            if (userID) {
              // Step 2: Fetch user details by userID
              // Step 2: Fetch cooks if not already loaded
              if (cooks.length === 0) {
                await fetchCook();
              }
              const foundCook = cooks.find((u) => u._id === userID);
              setAuthorName(foundCook?.name || "Unknown");

            } else {
              console.warn("User ID not found in recipe data.");
            }
          } else {
            console.error("Failed to fetch recipe:", recipeResponse.message);
          }
        } catch (error) {
          console.error("Error fetching data in useEffect:", error);
        }
      };
  
      fetchData();
    }, [selectedFood?._id, fetchRecipeById, fetchCook, cooks]);

  /**********************************When global selection changes *********************************/
    useEffect(() => {
        if (selectedFoodGlobal) {
          setSelectedCategory("all"); // Set category to "All" after fetching recipes
          setSelectedFood(selectedFoodGlobal); // Update local state when global selection changes
        }
      }, [selectedFoodGlobal]); // Runs whenever `selectedFoodGlobal` changes
    


  // This useEffect will run when recipes change
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


  // Filter recipes based on selected category
  const filteredRecipes =
    selectedCategory === "all"
        ? recipes
        : recipes.filter(
            (recipe) => recipe.category.toLowerCase() === selectedCategory
        );

  useEffect(() => {
    if (selectedFoodGlobal) return; // ✅ Prevent override if `selectedFoodGlobal` was just set

    if (filteredRecipes.length > 0) {
      setSelectedFood(filteredRecipes[0]); // Set the first recipe as default
    } else {
      setSelectedFood(null); // Clear selection if no recipes match
    }
  }, [selectedCategory, selectedFoodGlobal]); // Re-run effect when `selectedCategory`


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

        setToggleFav(!toggleFav);
    } else {
        toast({
            title: "Failed to update favorite",
            status: "error",
            duration: 2000,
            isClosable: true,
        });
    }
};

  const handleScrollLeft = () => {
    setCarouselIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  const handleScrollRight = () => {
    setCarouselIndex((prevIndex) =>
      Math.min(prevIndex + 1, recipes.length - numberOfItems)
    );
  };


   // This useEffect will fetch updated recipe data every 10 seconds
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
  


  return (
    <Flex
      direction="column"
      justify="center"
      align="center"
      h={{ base: "120vh", md: "100vh" }}
      w={{ base: "100%", md: "150vh", lg: "100%" }}
      bgImage={`url(${recipesBackground})`}
      bgAttachment="fixed"
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
                    There are no recorded favourite recipes yet.
                  </Text>
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
              <Text marginLeft="30px" fontSize="md" fontWeight="semibold" color="gray.600">
                Author: {authorName}
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


              </HStack>
                
              <HStack spacing={4} mt={4} marginLeft="30px">
                <Menu>
                <MenuButton as={Button} rightIcon={<FaChevronDown />} height={{ base: "30px", md: "40px" }} width={{ base: "150px", md: "180px" }} fontSize={{ base: "sm", md: "md" }} border="2px solid">
                  {truncateText(selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1), 10)}{/* Display selected category */}
                  </MenuButton>
                  <MenuList maxH="100px" minW={{ base: "150px", md: "180px" }} overflowY="auto"> {/* Set scrollable dropdown content */}
                    {categories.map((category) => (
                      <MenuItem key={category} onClick={() => setSelectedCategory(category.toLowerCase())}
                        fontSize={{ base: "sm", md: "md" }}
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

    </Flex>
  );
};

export default Favorites;
