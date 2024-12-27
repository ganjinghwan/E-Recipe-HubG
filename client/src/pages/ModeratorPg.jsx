import React, { useEffect, useState } from "react";
import {
  Box,
  Flex,
  Grid,
  GridItem,
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
  useBreakpointValue 
} from "@chakra-ui/react";
import { FaUser, FaFlag, FaBook, FaExclamationTriangle } from "react-icons/fa";
import generalBackground from "../pic/mod3.jpg";
import { useStoreRecipe } from "../store/StoreRecipe";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";
import Chart from "react-apexcharts"; // Use ApexCharts for graphing


import UserListModal from "../components/moderator-modal/user_list";


const ModeratorPage = () => {
  const { user } = useAuthStore(); // Access current user info
  const { fetchCGE, CGEs, userCGesCount} = useAuthStore();
  const [counts, setCounts] = useState({
    users: 0,
    reports: 0,
    recipes: 0,
    warnings: 0,
  });

  const {fetchAllRecipes, recipes, recipeCount} = useStoreRecipe();

  const [isUserListOpen, setIsUserListOpen] = useState(false);
  const [isReportListOpen, setIsReportListOpen] = useState(false);
  const [isRecipeListOpen, setIsRecipeListOpen] = useState(false);
  const [isWarningListOpen, setIsWarningListOpen] = useState(false);


  const toast = useToast();
  const navigate = useNavigate();

/**********************************Fetching Users Count******************************************************************** */
  useEffect(() => {
        fetchCGE();
    }, [fetchCGE]);

/**********************************Fetching Reports Count******************************************************************** */
/**********************************Fetching Recipes Count******************************************************************** */
 useEffect(() => {
     fetchAllRecipes();
 }, [fetchAllRecipes]);

/**********************************Fetching Warnings Count******************************************************************** */

  
//   reports: CGEs?.filter((cge) => cge.type === "report").length || 0,
//   recipes: CGEs?.filter((cge) => cge.type === "recipe").length || 0,
//   warnings: CGEs?.filter((cge) => cge.type === "warning").length || 0,

const handleClick = (type) => {

    if (type === "users") {
        setIsUserListOpen(true); // Open the UserListModal
    } else if (type === "reports") {
        setIsReportListOpen(true); // Open the ReportListModal
    } else if (type === "recipes") {
        setIsRecipeListOpen(true); // Open the RecipeListModal
    } else if (type === "warnings") {
        setIsWarningListOpen(true); // Open the WarningListModal
    } else {
        toast({
            title: "Navigation error",
            description: `No action configured for type: ${type}`,
            status: "error",
            duration: 5000,
            isClosable: true,
        });
    }
};

  

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
            { title: "Users", icon: <FaUser />, count: userCGesCount(), type: "users" },
            { title: "Reports", icon: <FaFlag />, count: counts.reports, type: "reports" },
            { title: "Recipes", icon: <FaBook />, count: recipeCount(), type: "recipes" },
            { title: "Warnings", icon: <FaExclamationTriangle />, count: counts.warnings, type: "warnings" },
          ].map((item, index) => (
            <Box
              key={index}
              p={4}
              bg="rgba(255, 255, 255, 0.2)"
              borderRadius="lg"
              textAlign="center"
              cursor="pointer"
              onClick={() => handleClick(item.type)}
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

      {/* User List Modal */}
        <UserListModal
            isOpen={isUserListOpen}
            onClose={() => setIsUserListOpen(false)}
        />
        {/* <ReportListModal
            isOpen={isReportListOpen}
            onClose={() => setIsReportListOpen(false)}
        />
        <RecipeListModal
            isOpen={isRecipeListOpen}
            onClose={() => setIsRecipeListOpen(false)}
        />
        <WarningListModal
            isOpen={isWarningListOpen}
            onClose={() => setIsWarningListOpen(false)}
        /> */}
    </Flex>
  );
};

export default ModeratorPage;