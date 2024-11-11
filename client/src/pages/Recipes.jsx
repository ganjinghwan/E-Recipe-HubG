import React, { useState } from "react";
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
} from "@chakra-ui/react";
import { FaHeart, FaPlus, FaEye, FaEdit, FaTrash } from "react-icons/fa";
import recipesBackground from "../pic/room.jpg";
import Croissant from "../pic/Croissant.jpeg";
import Macaron from "../pic/Macaron.jpeg";
import Cannoli from "../pic/Cannoli.jpeg";
import Profiterole from "../pic/Profiteroles.jpeg";
import Eclair from "../pic/Eclair.jpeg";
import Brownie from "../pic/Brownie.jpeg";
import Pancake from "../pic/Pancakes.jpeg";
import { useStoreRecipe } from "../store/StoreRecipe";


// Define food items
const foodItems = [
  { id: 1, name: "Croissant", image: Croissant, rating: "4.5" },
  { id: 2, name: "Macaron", image: Macaron, rating: "4.7" },
  { id: 3, name: "Cannoli", image: Cannoli, rating: "4.3" },
  { id: 4, name: "Profiterole", image: Profiterole, rating: "4.8" },
  { id: 5, name: "Eclair", image: Eclair, rating: "4.6" },
  { id: 6, name: "Brownie", image: Brownie, rating: "4.4" },
  { id: 7, name: "Pancake", image: Pancake, rating: "4.9" },
];

const Recipes = () => {
  const [selectedFood, setSelectedFood] = useState(foodItems[0]);
  const [animationState, setAnimationState] = useState("");
  const [activeTab, setActiveTab] = useState("Overview");
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [favoriteFoods, setFavoriteFoods] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [activeModal, setActiveModal] = useState("");
  const [newRecipe, setNewRecipe] = useState({
    title: "",
    ingredients: [],
    instructions: "",
    prepTime: "",
    steps: [],
    category: "",
    image: "",
  });
  const {createRecipe} = useStoreRecipe();
  const toast = useToast();

  const handleFoodSelection = (food) => {
    if (food.id !== selectedFood.id && !animationState) {
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
      Math.min(prevIndex + 1, foodItems.length - 5)
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
      [name]: name === "ingredients" || name === "steps"
        ? value.split(name === "ingredients" ? "," : "\n").map(i => i.trim())
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
      instructions: "",
      prepTime: "",
      steps: [],
      category: "",
      image: "",
    });
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

          @keyframes scrollAnimation {
            from {
              transform: translateX(0);
            }
            to {
              transform: translateX(-100%);
            }
          }
        `}
        
      </style>
      <Grid
        templateColumns={{ base: "1fr", md: "2fr 1fr" }}
        templateRows={{ base: "auto", md: "auto auto" }}
        gap={6}
        w="90%"
        maxW="1200px"
      >
        {/*Top Left column - Display Animation Image and details*/}
        <GridItem colSpan={{ base: 1, md: 1 }} rowSpan={{ base: 1, md: 1 }}>
          <Flex direction={{ base: "column", md: "row" }} gap={4} align="start">
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
              <Image
                src={selectedFood.image}
                alt={selectedFood.name}
                objectFit="cover"
                w="full"
                h="full"
              />
            </Center>
            <VStack align="start" >
              <HStack 
                marginTop="20px"
                marginLeft="30px"
                >
                <Text fontSize="4xl" fontWeight="bold">
                  {selectedFood.name.toUpperCase()}
                </Text>
                <IconButton
                  icon={<FaHeart/>}
                  onClick={() => handleToggleFavorite(selectedFood.id)}
                  colorScheme={
                  favoriteFoods.includes(selectedFood.id) ? "red" : "gray"
                  }
                />
              </HStack>
              <HStack spacing={7} marginLeft="30px"> {/* Wider gap for icons */}
                <IconButton
                  icon={<FaPlus />}
                  aria-label="Create"
                  colorScheme="teal"
                  onClick={() => handleIconClick("create")}
                />
                <IconButton
                  icon={<FaEye />}
                  aria-label="Read"
                  colorScheme="blue"
                  onClick={() => handleIconClick("read")}
                />
                <IconButton
                  icon={<FaEdit />}
                  aria-label="Update"
                  colorScheme="yellow"
                  onClick={() => handleIconClick("update")}
                />
                <IconButton
                  icon={<FaTrash />}
                  aria-label="Delete"
                  colorScheme="red"
                  onClick={() => handleIconClick("delete")}
                />
              </HStack>
              <HStack spacing={4} mt={4} marginLeft="30px">
                <Button colorScheme="orange">Play Video</Button>
                <Button colorScheme="orange">Pastry</Button>
              </HStack>
            </VStack>
          </Flex>
        </GridItem>

        {/* Info Board content */}
        <GridItem colSpan={{ base: 1, md: 1 }} rowSpan={{ base: 1, md: 1 }}>
          <Box bg="white" p={4} borderRadius="md" shadow="md">
            <Flex justify="space-around" mb={4}>
              <Button
                variant="link"
                colorScheme={activeTab === "Overview" ? "orange" : "gray"}
                onClick={() => setActiveTab("Overview")}
              >
                Overview
              </Button>
              <Button
                variant="link"
                colorScheme={activeTab === "Ingredients" ? "orange" : "gray"}
                onClick={() => setActiveTab("Ingredients")}
              >
                Ingredients
              </Button>
            </Flex>
            <Box>
              {activeTab === "Overview" ? (
                <VStack align="start" margin="10px" textAlign="left">
                  <Text fontSize="lg">Overview</Text>
                  <Text>
                    <strong>Rating:</strong> {selectedFood.rating}
                  </Text>
                  <Text>
                    Chef Reza, a talented chef, brings authentic{" "}
                    {selectedFood.name} to life.
                  </Text>
                </VStack>
              ) : (
                <VStack align="start" margin="10px" textAlign="left">
                  <Text fontSize="lg">Ingredients</Text>
                  <ul>
                    <li>Ingredient 1: Qincai</li>
                    <li>Ingredient 2: No need any Ingredients</li>
                    <li>Ingredient 3: Keep it usual</li>
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
        >
            {/* <IconButton
              icon={"<"}
              onClick={handleScrollLeft}
              pos="absolute"
              left="0"
              transform="translateY(-50%)"
              bg="transparent"
              colorScheme="purple"
              zIndex="2"
            /> */}
            <Flex
              as="div"
              display="flex"
              alignItems="center"
              position="absolute"
              w="max-content"
              gap={10}
              animation="scrollAnimation 50s linear infinite"
            >
              {/* Duplicate food items for smooth looping */}
              {/* Continuously Append Food Items */}
              {Array(5) // Number of times the array is repeated (can be adjusted)
                .fill(foodItems) // Fill the array multiple times
                .flat() // Flatten the arrays into a single array
                .map((food, index) => (
                  <VStack
                    key={`${food.id}-${index}`}
                    onClick={() => handleFoodSelection(food)}
                    cursor="pointer"
                    w="100px"
                    flexShrink={0}
                    p={2}
                    textAlign="center"
                    bg={food.id === selectedFood.id ? "#b1b5b5" : "transparent"}
                    borderRadius="lg"
                    boxShadow={food.id === selectedFood.id ? "md" : "none"}
                  >
                  <Image
                    src={food.image}
                    alt={food.name}
                    borderRadius="full"
                    boxSize="85px"
                  />
                  <Text>{food.name}</Text>
                </VStack>
              ))}
            </Flex>
            {/* <IconButton
              icon={">"}
              onClick={handleScrollRight}
              pos="absolute"
              right="0"
              transform="translateY(-50%)"
              bg="transparent"
              colorScheme="purple"
              zIndex="2"
            /> */}
          </Flex>
        </GridItem>

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
        >
        <Center mt={8}>
          <HStack spacing={8}> 
            <IconButton
              icon={<FaPlus />}
              aria-label="Create"
              colorScheme="teal"
              onClick={() => handleIconClick("create")}
            />
            <IconButton
              icon={<FaEye />}
              aria-label="Read"
              colorScheme="blue"
              onClick={() => handleIconClick("read")}
            />
            <IconButton
              icon={<FaEdit />}
              aria-label="Update"
              colorScheme="yellow"
              onClick={() => handleIconClick("update")}
            />
            <IconButton
              icon={<FaTrash />}
              aria-label="Delete"
              colorScheme="red"
              onClick={() => handleIconClick("delete")}
            />
          </HStack>
        </Center>
      </GridItem> */}

      {/* Modal for CRUD actions */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay 
          //  sx={{
          //   bg: "rgba(255, 255, 255, 0.1)", // Semi-transparent background color
          //   backdropFilter: "blur(10px)", // Blur effect
          // }}
        />
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
                  value={newRecipe.instructions}
                  onChange= {(e) => handleInputChange(e)}
                />
                <Input
                  placeholder="Prep Time"
                  name="prepTime"
                  value={newRecipe.prepTime}
                  onChange= {(e) => handleInputChange(e)}
                />
                <Textarea
                  placeholder="Steps"
                  name="steps"
                  value={newRecipe.steps.join("\n")}
                  onChange= {(e) => handleInputChange(e)}                
              />
                <Select
                  placeholder="Category"
                  name="category"
                  value={newRecipe.category}
                  onChange= {(e) => handleInputChange(e)}                
                  >
                  <option value="Pastry">Pastry</option>
                  <option value="Breakfast">Breakfast</option>
                  {/* Add more categories as needed */}
                </Select>
                <Input
                  placeholder="Image URL"
                  name="image"
                  value={newRecipe.image}
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
                  value={newRecipe.instructions}
                  onChange= {(e) => handleInputChange(e)}
                />
                <Input
                  placeholder="Prep Time"
                  name="prepTime"
                  value={newRecipe.prepTime}
                  onChange= {(e) => handleInputChange(e)}
                />
                <Textarea
                  placeholder="Steps"
                  name="steps"
                  value={newRecipe.steps.join("\n")}
                  onChange= {(e) => handleInputChange(e)}                
               />
                <Select
                  placeholder="Category"
                  name="category"
                  value={newRecipe.category}
                  onChange= {(e) => handleInputChange(e)}                
                  >
                  <option value="Pastry">Pastry</option>
                  <option value="Breakfast">Breakfast</option>
                  {/* Add more categories as needed */}
                </Select>
                <Input
                  placeholder="Image URL"
                  name="image"
                  value={newRecipe.image}
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
                  Add Recipe
                </Button>
                <Button onClick={onClose}>Cancel</Button>
              </>
            ) : activeModal === "update" ? (
              <>
                <Button colorScheme="blue" mr={3} onClick={onClose}>
                  Update Recipe
                </Button>
                <Button onClick={onClose}>Cancel</Button>
              </>
            ) : activeModal === "read" ? (
              <>
                <Button colorScheme="blue" mr={3} onClick={onClose}>
                  Read Recipe
                </Button>
                <Button onClick={onClose}>Cancel</Button>
              </>
            ) : null}
          </ModalFooter>
        </ModalContent>
      </Modal>
      </Grid>
    </Flex>
  );
};

export default Recipes;
