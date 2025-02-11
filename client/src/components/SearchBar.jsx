import React, { useEffect, useRef, useState } from 'react';
import { Box, IconButton, Input, List, ListItem, Text, useToast } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useStoreRecipe } from '../store/StoreRecipe';
import { useAuthStore } from '../store/authStore';
import { useLocation } from 'react-router-dom';

const MotionBox = motion(Box);

const SearchBar = ({ setSelectedFoodGlobal, selectedUserId }) => {
    const location = useLocation();
    const { user } = useAuthStore();
    const searchBarRef = useRef(null);
    const toast = useToast();

    /*********************************** State ***********************************/
    const [isSearchBarActive, setIsSearchBarActive] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [recipesData, setRecipesData] = useState([]); // Store all recipes
    const [searchResults, setSearchResults] = useState([]); // Filtered results

    /*********************************** Fetch Recipes ***********************************/
    /**************For cook user directly access the /recipes */
    const {fetchRecipes, recipes} = useStoreRecipe();
    /**************For guest and moderator user access the /visitors */
    /* so it must pass the cook user id but not the current user id */
    const {fetchRecipesByUserId, userRecipes} = useStoreRecipe();
    /**************For all user access the /eventrecipes */
    const {fetchEventRecipes, eventRecipes} = useStoreRecipe();
    /**************For guest and cook user access the /favourite */
    const {fetchFavoriteRecipes, favoriteRecipes} = useStoreRecipe();

    /*********************************** Get IDs ***********************************/
    const searchParams = new URLSearchParams(location.search);
    const event_id = searchParams.get("event_id");


    /*********************************** Handle Search Toggle ***********************************/
    const toggleSearchBar = () => {
        setIsSearchBarActive(!isSearchBarActive);
        if (!isSearchBarActive) {
            setSearchQuery('');
            setSearchResults([]); 
        }
    };

    /*********************************** Fetch Data When Search Bar Opens ***********************************/
    useEffect(() => {
        if (!isSearchBarActive) return;  

        const fetchRelevantRecipes = async () => {
            try {
                let fetchedData = [];

                if (location.pathname === "/recipes") {
                    await fetchRecipes();
                    fetchedData = recipes;
                } else if (location.pathname === "/visitors" && selectedUserId) {
                    await fetchRecipesByUserId(selectedUserId);
                    fetchedData = userRecipes;
                } else if (location.pathname === "/eventrecipes" && event_id) {
                    await fetchEventRecipes(event_id);
                    fetchedData = eventRecipes;
                } else if (location.pathname === "/favourite") {
                    await fetchFavoriteRecipes();
                    fetchedData = favoriteRecipes;
                }

                setRecipesData(fetchedData);
            } catch (error) {
                console.error("Error fetching recipes:", error);
            }
        };

        fetchRelevantRecipes();
    }, [isSearchBarActive, location.pathname, selectedUserId, event_id]);

    /*********************************** Handle Click Outside to Close Search Bar ***********************************/
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchBarRef.current && !searchBarRef.current.contains(event.target)) {
                setIsSearchBarActive(false);
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    /*********************************** Search Filtering Logic ***********************************/
    const handleInputChange = (e) => {
        const query = e.target.value; // Keep spaces intact
        setSearchQuery(query);
    
        if (!query.trim()) { // Only clear results if the input is entirely empty
            setSearchResults([]);
            return;
        }
    
        const lowercaseQuery = query.toLowerCase();
    
        // Filter only if the recipe title starts with the entered text
        const filteredResults = recipesData.filter((recipe) =>
            recipe.title.toLowerCase().startsWith(lowercaseQuery) // ✅ Match only from the start
        );
    
        setSearchResults(filteredResults);
    };
    

    /*********************************** Handle Selecting a Recipe ***********************************/
    const handleItemClick = (recipe) => {
        setIsSearchBarActive(false);
        setSelectedFoodGlobal(recipe); 

        toast({
            title: "Recipe Selected",
            description: recipe.title,
            status: "success",
            duration: 3000,
            isClosable: true,
        });
    };

    return (
        <Box position="relative" display="flex" alignItems="center" ref={searchBarRef}>
            <MotionBox
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                bg={isSearchBarActive ? "white" : "transparent"}
                color={isSearchBarActive ? "black" : "white"}
                borderRadius="full"
                px="2"
                width={{ base: "180px", md: "250px" }} 
                height="40px"
                initial={{ width: "40px" }}
                animate={{
                    width: isSearchBarActive ? "100%" : "40px",
                    backgroundColor: isSearchBarActive ? "#FFFFFF" : "transparent",
                }}
                transition={{ duration: 0.3 }}
            >
                {/* Search icon */}
                <IconButton
                    icon={<i className="fas fa-search"></i>}
                    onClick={toggleSearchBar}
                    bg="transparent"
                    size="sm"
                    aria-label="Search"
                    color={isSearchBarActive ? "black" : "white"}
                    _hover={{ bg: "transparent" }}
                />

                {/* Search input */}
                {isSearchBarActive && (
                    <Input
                        bg="transparent"
                        border="none"
                        placeholder="Search..."
                        flex="1"
                        value={searchQuery}
                        onChange={handleInputChange}
                        _focus={{ outline: "none" }}
                    />
                )}
            </MotionBox>

            {/* Search results */}
            {isSearchBarActive && (
                <Box
                    position="absolute"
                    top="100%"
                    left="0"
                    bg="white"
                    width="100%"
                    borderRadius="md"
                    mt={2}
                    maxH="250px"
                    overflowY="auto"
                    boxShadow="lg"
                >
                    {searchResults.length > 0 ? (
                        <List spacing={2}>
                            {searchResults.map((recipe, index) => (
                                <ListItem
                                    key={index}
                                    px="4"
                                    py="2"
                                    borderBottom="1px solid #ddd"
                                    textColor="black"
                                    _hover={{ bg: "#FBBF77" }}
                                    onClick={() => handleItemClick(recipe)}
                                    cursor="pointer"
                                >
                                    {recipe.title}
                                </ListItem>
                            ))}
                        </List>
                    ) : (
                        <Box p={4}>
                            <Text textColor="black">No results found.</Text>
                        </Box>
                    )}
                </Box>
            )}
        </Box>
    );
};

export default SearchBar;
