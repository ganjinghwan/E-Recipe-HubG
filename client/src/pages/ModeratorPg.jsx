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
import { FaUser, FaFlag, FaBook, FaExclamationTriangle, FaSync, FaSyncAlt } from "react-icons/fa";
import generalBackground from "../pic/mod3.jpg";
import { useStoreRecipe } from "../store/StoreRecipe";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";
import Chart from "react-apexcharts"; // Use ApexCharts for graphing
import dayjs from "dayjs";


import UserListModal from "../components/moderator-modal/user_list";
import RecipeListModal from "../components/moderator-modal/recipe_list";


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
  const iconButtonSize = useBreakpointValue({ base: "sm", md: "md" });
  

  const [isUserListOpen, setIsUserListOpen] = useState(false);
  const [isReportListOpen, setIsReportListOpen] = useState(false);
  const [isRecipeListOpen, setIsRecipeListOpen] = useState(false);
  const [isWarningListOpen, setIsWarningListOpen] = useState(false);

  const toast = useToast();
  const navigate = useNavigate();

  const [userActivity, setUserActivity] = useState({ labels: [], counts: [] });
  const [recipeSubmissions, setRecipeSubmissions] = useState({ labels: [], counts: [] });

/**********************************Fetching Users/Reports/Recipes/Warnings Count******************************************************************** */
    
    useEffect(() => {
      // Fetch data
      const fetchData = async () => {
        await fetchCGE(); // Fetch user data
        await fetchAllRecipes(); // Fetch recipe data
    
        // Process User Activity
        const userActivityData = processDataForLast7Days(CGEs, "lastLogin");
        setUserActivity(userActivityData);
    
        // Process Recipe Submissions
        const recipeData = processDataForLast7Days(recipes, "createdAt");
        setRecipeSubmissions(recipeData);
      };
    
      fetchData();
    }, [fetchCGE, fetchAllRecipes]);
  
//   reports: CGEs?.filter((cge) => cge.type === "report").length || 0,
//   recipes: CGEs?.filter((cge) => cge.type === "recipe").length || 0,
//   warnings: CGEs?.filter((cge) => cge.type === "warning").length || 0,

/**********************************Updating Date and time******************************************************************** */
const [currentDate, setCurrentDate] = useState("");

useEffect(() => {
    const updateDate = () => {
      const now = new Date();
      setCurrentDate(now.toLocaleString());
    };

    updateDate();
  }, []);

  const handleRefresh = () => {
    window.location.reload();
  };


//   const handleRefresh = () => {
//     setCurrentDate(new Date());
//     fetchCGE();
//     fetchAllRecipes();
//   };

/**********************************Handling Modal Clicks******************************************************************** */
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

  
/**********************************Handling Data Chart******************************************************************** */

    // Helper function to process ISO dates
    const processDataForLast7Days = (data, dateField) => {
      const today = dayjs(); // Current day
      const last7Days = [...Array(7).keys()].map((i) => today.subtract(6 - i, "day"));
      
      // Initialize results for the last 7 days
      const result = last7Days.map((day) => ({
        label: `${day.format("ddd")}/${day.format("DD")}`, // e.g., "Mon/30"
        date: day.format("YYYY-MM-DD"),
        count: 0,
      }));
    
      // Loop through the data to populate the counts
      data.forEach((item) => {
        const recordDate = dayjs(item[dateField]).format("YYYY-MM-DD"); // Parse MongoDB ISODate
        const match = result.find((day) => day.date === recordDate);
        if (match) match.count++;
      });
    
      return {
        labels: result.map((r) => r.label),
        counts: result.map((r) => r.count),
      };
    };
    
    const userActivityOptions = {
        chart: { id: "user-activity" },
        xaxis: { categories: userActivity.labels }, // Use processed labels
    };

    const recipeDataOptions = {
        chart: { id: "recipe-submissions" },
        xaxis: { categories: recipeSubmissions.labels }, // Use processed labels
    };

    const userActivitySeries = [
        { name: "Active Users", data: userActivity.counts }, // Use processed counts
    ];

    const recipeDataSeries = [
        { name: "Recipes", data: recipeSubmissions.counts }, // Use processed counts
    ];




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
      <Flex direction="column" w="80%" h="70%" zIndex="2">

        {/* Refresh and Date Section */}
        <Grid templateColumns="repeat(5, 1fr)" gap={4} p={3} alignItems="center">
            <Grid 
                templateColumns="1fr auto" 
                columnGap={4} 
                alignItems="center" 
                gridColumn="span 5"
             >
                <Box
                    bg="rgba(255, 255, 255, 0.2)" // Semi-transparent white
                    borderRadius="lg"
                    backdropFilter="blur(20px)" // Apply blur effect
                    p={2}
                    gridColumn="3" // Place the box in the last column (most right side)
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    flexDirection="row"
                >
                    <Text fontWeight="bold" textAlign="right">
                    Latest at :
                    {currentDate}
                    </Text>
                    
                </Box>

                <IconButton
                        aria-label="Refresh"
                        icon={<FaSyncAlt />}
                        size={iconButtonSize}
                        onClick={handleRefresh}
                        colorScheme="blue"
                        gridColumn= "4"
                />
                
            </Grid>
        </Grid>
        
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
            {/* User Activity Chart */}
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
                options={userActivityOptions}
                series={userActivitySeries}
                type="line"
                height="200"
                />
            </Box>

            {/* Recipe Submissions Chart */}
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
                options={recipeDataOptions}
                series={recipeDataSeries}
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
        /> */}
        {/* <RecipeListModal
            isOpen={isRecipeListOpen}
            onClose={() => setIsRecipeListOpen(false)}
        /> */}
        {/* <WarningListModal
            isOpen={isWarningListOpen}
            onClose={() => setIsWarningListOpen(false)}
        /> */}
    </Flex>
  );
};

export default ModeratorPage;