import React, { useEffect, useRef, useState } from 'react';
import { Box, IconButton, Input, List, ListItem, Text, useToast } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useStoreRecipe } from '../store/StoreRecipe';

const MotionBox = motion(Box);

const SearchBar = ({ onSearch }) => {
    const [isSearchBarActive, setIsSearchBarActive] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [hasFetched, setHasFetched] = useState(false);
    const [searchRecipeResults, setSearchRecipeResults] = useState([]);

    const { fetchAllRecipes, recipes } = useStoreRecipe();

    const toast = useToast();
    const searchBarRef = useRef(null);

    const toggleSearchBar = () => {
        setIsSearchBarActive(!isSearchBarActive);
        if (!isSearchBarActive) {
            setHasFetched(false);
            setSearchQuery('');
            setSearchRecipeResults([]);
        }
    };

    // Fetch recipes once when search bar is opened
    useEffect(() => {
        if (isSearchBarActive && !hasFetched) {
            fetchAllRecipes();
            setHasFetched(true);
        }
    }, [isSearchBarActive, fetchAllRecipes, hasFetched]);

    // Update search results based on query
    useEffect(() => {
        if (searchQuery) {
            const matchRecipeResults = recipes.filter((recipe) =>
                recipe.title.toLowerCase().includes(searchQuery.toLowerCase())
            );

            setSearchRecipeResults(matchRecipeResults);
        } else {
            setSearchRecipeResults([]);
        }
    }, [recipes, searchQuery]);

    // Handle clicking outside of the search bar
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchBarRef.current && !searchBarRef.current.contains(event.target)) {
                setIsSearchBarActive(false);
            }
        };

        document.addEventListener('click', handleClickOutside);

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    const handleInputChange = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        if (onSearch) {
            onSearch(query);
        }
    };

    const handleItemClick = (item) => {
        setIsSearchBarActive(false);
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
                bg={isSearchBarActive ? "white" : "transparent"}
                color={isSearchBarActive ? "black" : "white"}
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
                <IconButton
                    icon={<i className="fas fa-search"></i>}
                    onClick={toggleSearchBar}
                    bg="transparent"
                    size="sm"
                    aria-label="Search"
                    color={isSearchBarActive ? "black" : "white"}
                    _hover={{ bg: "transparent" }}
                />
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
            {searchRecipeResults.length > 0 && isSearchBarActive && (
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
