import React, { useEffect, useRef, useState } from 'react';
import { Box, IconButton, Input, List, ListItem, Text, useToast } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useStoreRecipe } from '../store/StoreRecipe';

const MotionBox = motion(Box);

const SearchBar = ({ onSearch }) => {
    /***************************************Search Bar things*************************************/
    const [isSearchBarActive, setIsSearchBarActive] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [hasFetched, setHasFetched] = useState(false);
    const [searchRecipeResults, setSearchRecipeResults] = useState([]);

    /****************************************For fetching recipes**********************************/
    const { fetchAllRecipes, recipes } = useStoreRecipe();

    /*****************************************For toast messages***********************************/
    const toast = useToast();

    /*****************************************For handling outside clicks***************************/
    const searchBarRef = useRef(null);

    /*****************************************For handling search bar when clicked*******************************/
    const toggleSearchBar = () => {
        setIsSearchBarActive(!isSearchBarActive); // Make the search bar visible
        if (!isSearchBarActive) { // If the search bar is opened
            setHasFetched(false); // Reset the hasFetched state
            setSearchQuery(''); // Clear the search query
            setSearchRecipeResults([]); // Clear the search results
        }
    };

    // Fetch recipes once when search bar is opened
    useEffect(() => {
        // Fetch recipes when the search bar is opened and has not been fetched
        if (isSearchBarActive && !hasFetched) { 
            fetchAllRecipes();
            setHasFetched(true); // Set hasFetched to true so it doesn't fetch again
        }
    }, [isSearchBarActive, fetchAllRecipes, hasFetched]);

    // Update search results based on query
    useEffect(() => {
        if (searchQuery) { // If there is a search query
            // Filter the recipes based on the search query
            const matchRecipeResults = recipes.filter((recipe) =>
                recipe.title.toLowerCase().includes(searchQuery.toLowerCase())
            );

            // Update the search results
            setSearchRecipeResults(matchRecipeResults);
        } else {
            // If there is no search query, clear the search results
            setSearchRecipeResults([]);
        }
    }, [recipes, searchQuery]);

    // Handle clicking outside of the search bar
    useEffect(() => {
        const handleClickOutside = (event) => {
            // Check if the click event occurred outside of the search bar
            if (searchBarRef.current && !searchBarRef.current.contains(event.target)) {
                setIsSearchBarActive(false); // Close the search bar
            }
        };

        // Add event listener
        document.addEventListener('click', handleClickOutside);

        return () => {
            // Remove event listener
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    /******************************************For handling search bar input*******************************/
    const handleInputChange = (e) => {
        const query = e.target.value; // Get the current input value
        setSearchQuery(query); // Update the search query
        if (onSearch) { // If onSearch prop is provided, call it with the search query
            onSearch(query);
        }
    };

    /******************************************For handling search bar input*******************************/
    const handleItemClick = (item) => {
        setIsSearchBarActive(false); // Close the search bar
        toast({
            title: `You clicked a recipe`,
            description: item.title,
            status: 'success',
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
                bg={isSearchBarActive ? "white" : "transparent"} // when active, show white background, otherwise transparent
                color={isSearchBarActive ? "black" : "white"} // when active, show black text, otherwise white
                borderRadius="full"
                px="2"
                width={isSearchBarActive ? "250px" : "40px"}
                height="40px"
                initial={{ width: "40px" }}
                animate={{
                    width: isSearchBarActive ? "250px" : "40px",
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
                        value={searchQuery} // Bind the search query
                        onChange={handleInputChange} // Handle input changes
                        _focus={{ outline: "none" }}
                    />
                )}
            </MotionBox>

            {/* Search results */}
            {searchRecipeResults.length > 0 && isSearchBarActive && (
                // Display the search results when the search bar is active and there are results
                <Box
                    position="absolute"
                    top="100%"
                    left="0"
                    bg="white"
                    width="100%"
                    borderRadius="md"
                    mt={2}
                    maxH="300px"
                    overflowY="auto"
                >
                    <List spacing={2}>
                        {/* Map over the search results and display each of the as list items */}
                        {searchRecipeResults.map((recipe, index) => (
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
                                Recipe: {recipe.title}
                            </ListItem>
                        ))}
                    </List>
                </Box>
            )}

            {/* No results message */}
            {searchRecipeResults.length === 0 && isSearchBarActive && (
                // Display a message when there are no search results
                <Box
                    position="absolute"
                    top="100%"
                    left="0"
                    bg="white"
                    width="100%"
                    borderRadius="md"
                    mt={2}
                    p={4}
                >
                    <Text textColor="black">No results found.</Text>
                </Box>
            )}
        </Box>
    );
};

export default SearchBar;
