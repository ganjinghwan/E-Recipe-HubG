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
  Tooltip
} from "@chakra-ui/react";
import { FaHeart, FaPlus, FaEye, FaEdit, FaTrash, FaClock, FaYoutube, FaVideo } from "react-icons/fa";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa"; // Import specific icons
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
  const {createRecipe} = useStoreRecipe();
  const {fetchRecipes, recipes} = useStoreRecipe();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const categories = ["All", "Breakfast", "Lunch", "Dinner", "Pastry"];
  const toast = useToast();
  const getImageSrc = (image) => {
    return isValidUrl(image) ? image : "https://images.unsplash.com/photo-1594322436404-5a0526db4d13?q=80&w=2029&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
  };

  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  };
  

  useEffect(() => {
    fetchRecipes();
  }, [fetchRecipes]);


  useEffect(() => {
    if (recipes.length > 0) {
      setSelectedFood(recipes[0]); // Set the first recipe as the initial selected food
    }
  }, [recipes]);

  const handleFoodSelection = (food) => {
    if (food._id !== selectedFood?._id && !animationState) {
      setAnimationState("slide-left");
      
      setTimeout(() => {
        setSelectedFood(food);
        setAnimationState("slide-down");

        setTimeout(() => {
          setAnimationState("");
        }, 1000);
      }, 1000);
    }
  };

  const filteredRecipes = selectedCategory === "All"
    ? recipes
    : recipes.filter((food) => food.category === selectedCategory);


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
        gap={10}
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
              w="300px"
              h="300px"
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
                <Text fontSize="4xl" fontWeight="bold">
                  {selectedFood?.title?.toUpperCase()}
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
              <HStack marginLeft="30px" alignItems="center" marginBottom="10px"  >
                <FaClock size="20px" />
                <Text fontSize="md" fontWeight="medium">
                  {selectedFood?.prepTime}mins
                </Text>
              </HStack>
              <HStack spacing={7} marginLeft="30px"> {/* Wider gap for icons */}
                <Tooltip label="Create">
                <IconButton
                  icon={<FaPlus />}
                  aria-label="Create"
                  colorScheme="teal"
                  onClick={() => handleIconClick("create")}
                />
                </Tooltip>
                <Tooltip label="Video">
                <IconButton
                  icon={<FaYoutube />}
                  aria-label="Video"
                  colorScheme="red"
                  onClick={() => {
                    if (!selectedFood?.video) {
                      toast({
                        title: "No video",
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
                <Tooltip label="Update">
                <IconButton
                  icon={<FaEdit />}
                  aria-label="Update"
                  colorScheme="yellow"
                  onClick={() => handleIconClick("update")}
                />
                </Tooltip>
                <Tooltip label="Delete">
                <IconButton
                  icon={<FaTrash />}
                  aria-label="Delete"
                  colorScheme="orange"
                  onClick={() => handleIconClick("delete")}
                />
                </Tooltip>
              </HStack>
              <HStack spacing={4} mt={4} marginLeft="30px">
              
                {/* Category selection dropdown */}
                <Select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  placeholder="Select Category"
                  width="180px"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </Select>
              </HStack>
            </VStack>
          </Flex>
        </GridItem>

        {/* Info Board content */}
        <GridItem colSpan={{ base: 1, md: 1 }} rowSpan={{ base: 1, md: 1 }} 
        // border="3px solid pink"
        >
          <Box bg="white" p={4} borderRadius="md" shadow="md">
            <Flex justify="space-around" mb={4}>
              <Button
                variant="link"
                colorScheme={activeTab === "Instruction" ? "orange" : "gray"}
                onClick={() => setActiveTab("Instruction")}
                borderBottom={activeTab === "Instruction" ? "3px solid orange" : "none"}
              >
                Instruction
              </Button>
              <Button
                variant="link"
                colorScheme={activeTab === "Ingredients" ? "orange" : "gray"}
                onClick={() => setActiveTab("Ingredients")}
                borderBottom={activeTab === "Ingredients" ? "3px solid orange" : "none"}
              >
                Ingredients
              </Button>
            </Flex>
            <Box>
              {activeTab === "Instruction" ? (
                <VStack align="start" margin="20px" textAlign="left" >
                  <ul>
                    {selectedFood?.instructions.map((instruction, index) => (
                      <li key={index}>{instruction}</li>
                    ))}
                  </ul>
                </VStack>
              ) : (
                <VStack align="start" margin="20px" textAlign="left">
                  <ul>
                    {selectedFood?.ingredients.map((ingredient, index) => (
                      <li key={index}>{ingredient}</li>
                    ))}
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
            h="150px"
            borderRadius="md"
            // border="3px solid red"
          >
            {/* Left Scroll Button */}
            <IconButton
              icon={<FaChevronLeft />} 
              onClick={handleScrollLeft}
              pos="absolute"
              left="10px"
              bg="transparent"
              color="black"
              boxShadow="md"
              zIndex="2"
              aria-label="Scroll Left"
              _hover={{ bg: "gray.200" }}
              isDisabled={carouselIndex === 0} 
            />
            <Flex
              as="div"
              alignItems="center"
              position="relative"
              overflow="hidden"
              w="full"
              gap={10}
              pl="60px"
              pr="60px"
              transition="transform 0.5s ease-in-out"
              // transform={`translateX(-${carouselIndex * 1}px)`} // Smooth transition
            >
              {filteredRecipes
                .slice(carouselIndex, carouselIndex + 5) // Show only 5 items
                .map((food) => (
                  <VStack
                    key={food.id}
                    onClick={() => handleFoodSelection(food)}
                    cursor="pointer"
                    w="100px"
                    flexShrink={0}
                    p={2}
                    textAlign="center"
                    bg={food.id === selectedFood?.id ? "#b1b5b5" : "transparent"}
                    borderRadius="lg"
                    boxShadow={food.id === selectedFood?.id ? "md" : "none"}
                    transform={food.id === selectedFood?.id ? "scale(1.05)" : "scale(1)"}
                    opacity={food.id === selectedFood?.id ? 1 : 0.6}
                    transition="transform 0.5s ease, opacity 0.5s ease"
                    _hover={{
                      boxShadow: "lg",
                      transform: "scale(1.05)",
                    }}
                  >

                    
                    <Image
                      src={getImageSrc(food?.image)}
                      alt={food?.title || "404 No Found"}
                      borderRadius="full"
                      boxSize="85px"
                    />
                    <Text>{food.title}</Text>
                  </VStack>
                ))}
            </Flex>
            {/* Right Scroll Button */}
            <IconButton
              icon={<FaChevronRight />} // Use the React Icon component here
              onClick={handleScrollRight}
              pos="absolute"
              right="10px"
              bg="transparent"
              color= "black"
              boxShadow="md"
              zIndex="2"
              aria-label="Scroll Right"
              _hover={{ bg: "gray.200" }}
              isDisabled={carouselIndex + 5 >= filteredRecipes.length} // Disable if at end
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
          bg="rgba(255, 255, 255, 0.5)" // Semi-transparent modal background
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
            {activeModal === "create" && (
              <VStack spacing={4} align="stretch">
                <Input
                  placeholder="Title"
                  name="title"
                  value={newRecipe.title}
                  onChange= {(e) => handleInputChange(e)}
                />
                <Textarea
                  placeholder="Ingredients"
                  name="ingredients"
                  value={newRecipe.ingredients.join(", ")}
                  onChange= {(e) => handleInputChange(e)}                
                />
                <Textarea
                  placeholder="Instructions"
                  name="instructions"
                  value={newRecipe.instructions.join("\n")}
                  onChange= {(e) => handleInputChange(e)}
                />
                <Input
                  placeholder="Times Needed (minutes)"
                  type="number"
                  name="prepTime"
                  value={newRecipe.prepTime}
                  onChange= {(e) => handleInputChange(e)}
                />
                <Select
                  placeholder="Category"
                  name="category"
                  value={newRecipe.category}
                  onChange= {(e) => handleInputChange(e)}                
                  >
                    <option value="breakfast">Breakfast</option>
                    <option value="lunch">Lunch</option>
                    <option value="dinner">Dinner</option>
                    <option value="snack">Pastry</option>
                  
                </Select>
                <Input
                  placeholder="Image URL"
                  name="image"
                  value={newRecipe.image}
                  onChange= {(e) => handleInputChange(e)}                
              />
                <Input
                  placeholder="Video URL [optional]"
                  name="video"
                  value={newRecipe.video}
                  onChange= {(e) => handleInputChange(e)}                
              />
              </VStack>
            )}

            {activeModal === "update" && (
              <VStack spacing={4} align="stretch">
                <Input
                  placeholder="Title"
                  name="title"
                  value={newRecipe.title}
                  onChange= {(e) => handleInputChange(e)}
                />
                <Textarea
                  placeholder="Ingredients"
                  name="ingredients"
                  value={newRecipe.ingredients.join(", ")}
                  onChange= {(e) => handleInputChange(e)}                
                />
                <Textarea
                  placeholder="Instructions"
                  name="instructions"
                  value={newRecipe.instructions.join("\n")}
                  onChange= {(e) => handleInputChange(e)}
                />
                <Input
                  placeholder="Times Needed (minutes)"
                  type="number"
                  name="prepTime"
                  value={newRecipe.prepTime}
                  onChange= {(e) => handleInputChange(e)}
                />
                <Select
                  placeholder="Category"
                  name="category"
                  value={newRecipe.category}
                  onChange= {(e) => handleInputChange(e)}                
                  >
                    <option value="breakfast">Breakfast</option>
                    <option value="lunch">Lunch</option>
                    <option value="dinner">Dinner</option>
                    <option value="snack">Pastry</option>
                </Select>
                <Input
                  placeholder="Image URL"
                  name="image"
                  value={newRecipe.image}
                  onChange= {(e) => handleInputChange(e)}                
               />
                <Input
                    placeholder="Video URL [optional]"
                    name="video"
                    value={newRecipe.video}
                    onChange= {(e) => handleInputChange(e)}                
                />
              </VStack>
            )}

            {activeModal === "delete" && (
              <Text>Are you sure you want to delete this recipe?</Text>
            )}
          </ModalBody>
          <ModalFooter>
            {activeModal === "delete" ? (
              <>
                <Button colorScheme="red" mr={3} onClick={onClose}>
                  Delete
                </Button>
                <Button onClick={onClose}>Cancel</Button>
              </>
            ) : activeModal === "create" ? (
              <>
                <Button colorScheme="blue" mr={3} onClick={handleAddRecipe}>
                  Submit
                </Button>
                <Button onClick={onClose}>Cancel</Button>
              </>
            ) : activeModal === "update" ? (
              <>
                <Button colorScheme="blue" mr={3} onClick={onClose}>
                  Confirm
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
