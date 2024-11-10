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
  Center,
} from "@chakra-ui/react";
import { FaHeart } from "react-icons/fa";
import recipesBackground from "../pic/room.jpg";

const foodItems = [
  { id: 1, name: "Croissant", image: "Croissant.jpeg", rating: "4.5" },
  { id: 2, name: "Macaron", image: "Macaron.jpeg", rating: "4.7" },
  { id: 3, name: "Cannoli", image: "Cannoli.jpeg", rating: "4.3" },
  { id: 4, name: "Profiterole", image: "Profiteroles.jpeg", rating: "4.8" },
  { id: 5, name: "Eclair", image: "Eclair.jpeg", rating: "4.6" },
  { id: 6, name: "Brownie", image: "Brownie.jpeg", rating: "4.4" },
  { id: 7, name: "Pancake", image: "Pancakes.jpeg", rating: "4.9" },
];

const Recipes = () => {
  const [selectedFood, setSelectedFood] = useState(foodItems[0]);
  const [animationState, setAnimationState] = useState("");
  const [activeTab, setActiveTab] = useState("Overview");
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [favoriteFoods, setFavoriteFoods] = useState([]);
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
    >
      <Grid
        templateColumns={{ base: "1fr", md: "2fr 1fr" }}
        templateRows={{ base: "auto", md: "auto auto" }}
        gap={6}
        w="90%"
        maxW="1200px"
      >
        <GridItem colSpan={1} rowSpan={1}>
          <Flex direction={{ base: "column", md: "row" }} gap={4} align="start">
            <Center
              w="300px"
              h="300px"
              overflow="hidden"
              borderRadius="50%"
              pos="relative"
              animation={animationState}
            >
              <Image
                src={require(`../pic/${selectedFood.image}`)}
                alt={selectedFood.name}
                objectFit="cover"
                w="full"
                h="full"
              />
            </Center>
            <VStack align="start">
              <HStack>
                <Text fontSize="xl" fontWeight="bold">
                  {selectedFood.name.toUpperCase()}
                </Text>
                <IconButton
                  icon={<FaHeart />}
                  onClick={() => handleToggleFavorite(selectedFood.id)}
                  colorScheme={
                    favoriteFoods.includes(selectedFood.id) ? "red" : "gray"
                  }
                />
              </HStack>
              <HStack spacing={4} mt={4}>
                <Button colorScheme="orange">Play Video</Button>
                <Button colorScheme="orange">Order Food</Button>
              </HStack>
            </VStack>
          </Flex>
        </GridItem>

        <GridItem colSpan={1} rowSpan={1}>
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
                <VStack align="start">
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
                <VStack align="start">
                  <Text fontSize="lg">Ingredients</Text>
                  <ul>
                    <li>Ingredient 1</li>
                    <li>Ingredient 2</li>
                    <li>Ingredient 3</li>
                  </ul>
                </VStack>
              )}
            </Box>
          </Box>
        </GridItem>

        <GridItem colSpan={1} rowSpan={1}>
          <Flex align="center" pos="relative" overflow="hidden">
            <IconButton
              icon={"<"}
              onClick={handleScrollLeft}
              pos="absolute"
              left="0"
              transform="translateY(-50%)"
              bg="transparent"
              colorScheme="purple"
              zIndex="2"
            />
            <Flex
              transform={`translateX(-${carouselIndex * 20}%)`}
              transition="transform 0.5s ease-in-out"
              gap={4}
              py={4}
            >
              {foodItems.map((food) => (
                <VStack
                  key={food.id}
                  onClick={() => handleFoodSelection(food)}
                  cursor="pointer"
                  w="100px"
                  bg={food.id === selectedFood.id ? "#b1b5b5" : "transparent"}
                  p={2}
                  borderRadius="lg"
                  boxShadow={food.id === selectedFood.id ? "md" : "none"}
                >
                  <Image
                    src={require(`../pic/${food.image}`)}
                    alt={food.name}
                    borderRadius="full"
                    boxSize="80px"
                  />
                  <Text>{food.name}</Text>
                </VStack>
              ))}
            </Flex>
            <IconButton
              icon={">"}
              onClick={handleScrollRight}
              pos="absolute"
              right="0"
              transform="translateY(-50%)"
              bg="transparent"
              colorScheme="purple"
              zIndex="2"
            />
          </Flex>
        </GridItem>

        <GridItem colSpan={2} rowSpan={1}>
          <Center>Some icons or additional content here.</Center>
        </GridItem>
      </Grid>
    </Flex>
  );
};

export default Recipes;
