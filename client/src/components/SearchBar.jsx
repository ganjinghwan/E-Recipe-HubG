import React, { useEffect, useRef, useState } from 'react';
import { Box, IconButton, Input, List, ListItem, useToast } from '@chakra-ui/react';
import { motion } from 'framer-motion'; 
import { useStoreRecipe } from '../store/StoreRecipe';

const MotionBox = motion(Box);

const SearchBar = ({ onSearch }) => {
    const [isSearchBarActive, setIsSearchBarActive] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [hasFetched, setHasFetched] = useState(false);
    const [searchResults, setSearchResults] = useState([]);

    const { fetchAllRecipes, recipes } = useStoreRecipe();

    const toast = useToast();
    const searchBarRef = useRef(null);

    const toggleSearchBar = () => {
        setIsSearchBarActive(!isSearchBarActive);
        if (!isSearchBarActive) {
            setHasFetched(false); 
            setSearchQuery('');
            setSearchResults([]);
        }
    }

    // Fetch recipes once when search bar is opened
    useEffect(() => {
        if (isSearchBarActive && !hasFetched) {
            fetchAllRecipes();
            setHasFetched(true);
        }
    }, [isSearchBarActive, fetchAllRecipes, hasFetched]);

    // Log recipes and set initial search results
    useEffect(() => {
        if (recipes.length > 0) {
            console.log("Recipes list:", recipes);
        }
        if (searchQuery) {
            const matchResults = recipes.filter((recipe) => 
                recipe.title.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setSearchResults(matchResults);
        } else {
            setSearchResults([]);
        }
    }, [recipes, searchQuery]);
    
    
    // Clicking outside handler
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

    const handleGoSearch = (recipe) => {
        setIsSearchBarActive(false);
        toast({
            title: "You have clicked something",
            description: recipe.title,
            status: "success",
            duration: 3000,
            isClosable: true,
        })
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
            {searchResults.length > 0 && isSearchBarActive && (
                <Box
                    position={"absolute"}
                    top={"100%"}
                    left={"0"}
                    bg={"white"}
                    width={"100%"}
                    borderRadius={"md"}
                    mt={2}
                >
                    <List spacing={2}>
                        {searchResults.map((recipe, index) => (
                            <ListItem
                                key={index} 
                                px="4" 
                                py="2" 
                                borderBottom="1px solid #ddd" 
                                textColor={"black"}
                                _hover={{ bg: "#FBBF77" }}
                                onClick={() => {handleGoSearch(recipe)}}
                                cursor={"pointer"}
                            >
                                {recipe.title}
                            </ListItem>
                        ))}
                    </List>
                </Box>
            )}
        </Box>
    );
};

export default SearchBar;
