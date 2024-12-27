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
import { FaHeart, FaComment, FaClock, FaYoutube, FaStar} from "react-icons/fa";
import { FaUser, FaFlag, FaBook, FaExclamationTriangle } from "react-icons/fa";
import { FaChevronLeft, FaChevronRight, FaChevronDown } from "react-icons/fa"; // Import specific icons
import generalBackground from "../pic/mod3.jpg";
import { useStoreRecipe } from "../store/StoreRecipe";
import { useAuthStore } from "../store/authStore";
import Chart from "react-apexcharts"; // Use ApexCharts for graphing

const ModeratorPage = () => {
  const { user } = useAuthStore(); // Access current user info
  const { fetchCook, cooks} = useAuthStore();
  const { fetchFavoriteRecipes, favoriteRecipes, toggleFavorite } = useStoreRecipe();
  const {fetchAllRecipes, recipes, addComment, addRate, fetchRecipeById} = useStoreRecipe();


  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [tempUserName, setTempUserName] = useState("");
  

  const [selectedFood, setSelectedFood] = useState(null);
  const [animationState, setAnimationState] = useState("");
  const [activeTab, setActiveTab] = useState("Instruction");
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [favoriteFoods, setFavoriteFoods] = useState([]);
  const [categories, setCategories] = useState(["All"]); // "All" as default
  const [selectedCategory, setSelectedCategory] = useState("All");


  const toast = useToast();
  const iconButtonSize = useBreakpointValue({ base: "sm", md: "md" });

  const [isOpen, setIsOpen] = useState(false);
  const dataChartOptions = {
    chart: {
      id: "user-activity",
    },
    xaxis: {
      categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], // Last 7 days
    },
  };

  const userActivityData = {
    series: [
      {
        name: "Active Users",
        data: [5, 10, 7, 12, 15, 20, 18], // Mock data for login activity
      },
    ],
  };

  const recipeData = {
    series: [
      {
        name: "Recipes",
        data: [2, 3, 1, 4, 5, 6, 8], // Mock data for recipes
      },
    ],
  };


  return (
    <Flex
        direction="column"
        justify="center"
        align="center"
        h="100vh"
        position="relative"
        textAlign="center"
        overflow="hidden"
    >
    <Box
        position="absolute"
        top="0"
        left="0"
        w="100%"
        h="100%"
        bgImage={`url(${generalBackground})`}
        bgSize="cover"
        bgPosition="center"
        bgRepeat="no-repeat"
        zIndex="-1"
        filter="blur(8px)" // Adjust blur intensity here
    />
    
      {/* Horizontal Blur Background */}
      <Box
        position="absolute"
        top="13%"
        left="5%"
        w="90%"
        h="80%"
        bg="rgba(255, 255, 255, 0.01)"
        borderRadius="lg"
        backdropFilter="blur(30px)"
        zIndex="1"
      />

      {/* Dashboard Content */}
      <Flex direction="column" w="80%" h="65%" zIndex="2">
        <Grid
          templateColumns={{ base: "repeat(2, 1fr)", md: "repeat(4, 1fr)" }}
          gap={4}
          p={4}
        >
          {/* Red Components */}
          {[
            { title: "Users", icon: <FaUser />, count: 150 },
            { title: "Reports", icon: <FaFlag />, count: 34 },
            { title: "Recipes", icon: <FaBook />, count: 128 },
            { title: "Warnings", icon: <FaExclamationTriangle />, count: 5 },
          ].map((item, index) => (
            <Box
              key={index}
              p={4}
              bg="rgba(255, 255, 255, 0.2)"
              borderRadius="lg"
              textAlign="center"
              cursor="pointer"
              onClick={() => setIsOpen(true)} // Placeholder for modal
              backdropFilter="blur(10px)"
              _hover={{ bg: "rgba(255, 255, 255, 0.3)" }}
            >
              <Center fontSize="2xl" mb={2}>
                {item.icon}
              </Center>
              <Text fontWeight="bold">{item.title}</Text>
              <Text fontSize="lg">{item.count}</Text>
            </Box>
          ))}
        </Grid>

        <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={4} p={4}>
          {/* Green Component - User Activity Chart */}
          <Box
            bg="rgba(255, 255, 255, 0.2)"
            borderRadius="lg"
            p={4}
            backdropFilter="blur(10px)"
          >
            <Text fontWeight="bold" mb={2}>
              User Activity
            </Text>
            <Chart
              options={dataChartOptions}
              series={userActivityData.series}
              type="line"
              height="200"
            />
          </Box>

          {/* Blue Component - Recipes Histogram */}
          <Box
            bg="rgba(255, 255, 255, 0.2)"
            borderRadius="lg"
            p={4}
            backdropFilter="blur(10px)"
          >
            <Text fontWeight="bold" mb={2}>
              Recipes Submitted
            </Text>
            <Chart
              options={dataChartOptions}
              series={recipeData.series}
              type="bar"
              height="200"
            />
          </Box>
        </Grid>
      </Flex>
    </Flex>
  );
};

export default ModeratorPage;