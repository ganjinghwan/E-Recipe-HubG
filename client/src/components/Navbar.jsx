import React, { useState } from "react";
import {
  Box,
  Flex,
  Link as ChakraLink,
  IconButton,
  Input,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Text,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Button,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import { Link as RouterLink } from "react-router-dom";
import { motion } from "framer-motion";

const MotionBox = motion(Box); // For animations

const Navbar = () => {
  const [isSearchBarActive, setIsSearchBarActive] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // For hamburger menu

  const toggleSearchBar = () => setIsSearchBarActive(!isSearchBarActive);

  const handleSignOut = () => {
    setIsLoggedIn(false);
    onClose();
  };

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <Flex
      as="nav"
      bg="transparent"
      position="fixed"
      top="0"
      left="0"
      width="100%"
      px="4"
      py="2"
      zIndex="1000"
      align="center"
      justify="space-between"
      color="white"
      backdropFilter="blur(5px)"
    >
      {/* Logo or Home Link */}
      <Text fontSize="xl" fontWeight="bold">
        <ChakraLink as={RouterLink} to="/" _hover={{ textDecoration: "none" }}>
          E-Recipes Hub
        </ChakraLink>
      </Text>

      {/* Links Section (Desktop and Mobile Menu) */}
      <Flex
        as="ul"
        flex="1"
        display={{ base: "none", md: "flex" }}
        gap="8"
        justify="center"
        align="center"
        listStyleType="none"
      >
        <ChakraLink as={RouterLink} to="/" fontSize="lg" _hover={{ color: "orange.300" }}>
          Home
        </ChakraLink>
        <ChakraLink as={RouterLink} to="/about" fontSize="lg" _hover={{ color: "orange.300" }}>
          About
        </ChakraLink>
        <ChakraLink as={RouterLink} to="/recipes" fontSize="lg" _hover={{ color: "orange.300" }}>
          Recipes
        </ChakraLink>
      </Flex>

      {/* Hamburger Menu for Smaller Screens */}
      <Box display={{ base: "block", md: "none" }}>
        <IconButton
          icon={isMobileMenuOpen ? <CloseIcon /> : <HamburgerIcon />}
          aria-label="Toggle menu"
          onClick={toggleMobileMenu}
          bg="transparent"
          color="white"
          _hover={{ bg: "whiteAlpha.200" }}
        />
        {isMobileMenuOpen && (
          <Box
            position="absolute"
            top="60px"
            left="50%"
            transform="translateX(-50%)"
            bg="gray.800"
            color="white"
            p="4"
            boxShadow="lg"
            borderRadius="md"
            zIndex="100"
            textAlign="center"
          >
            <ChakraLink
              as={RouterLink}
              to="/"
              display="block"
              py="2"
              _hover={{ color: "orange.300" }}
              onClick={toggleMobileMenu}
            >
              Home
            </ChakraLink>
            <ChakraLink
              as={RouterLink}
              to="/about"
              display="block"
              py="2"
              _hover={{ color: "orange.300" }}
              onClick={toggleMobileMenu}
            >
              About
            </ChakraLink>
            <ChakraLink
              as={RouterLink}
              to="/recipes"
              display="block"
              py="2"
              _hover={{ color: "orange.300" }}
              onClick={toggleMobileMenu}
            >
              Recipes
            </ChakraLink>
          </Box>
        )}
      </Box>

      {/* Right Section: Search, Favorites, Profile */}
      <Flex align="center" gap="4" position="relative">
        {/* Search Bar */}
        <Box position="relative" display="flex" alignItems="center">
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
                _focus={{ outline: "none" }}
                onBlur={toggleSearchBar}
              />
            )}
          </MotionBox>
        </Box>


        {/* Favorites Link */}
        <ChakraLink as={RouterLink} to="/favorites" fontSize="lg" _hover={{ color: "orange.300" }}>
          <i className="fas fa-heart"></i>
        </ChakraLink>

        {/* Profile Dropdown */}
        <Menu>
          <MenuButton
            as={IconButton}
            icon={<i className="fas fa-user"></i>}
            variant="outline"
            color="white"
            _hover={{ bg: "whiteAlpha.200" }}
          />
          <MenuList bg="gray.800" color="black">
            <MenuItem _hover={{ bg: "orange.300" }}>
              {isLoggedIn ? "Logged In" : "Not Logged In"}
            </MenuItem>
            {!isLoggedIn && (
              <MenuItem onClick={onOpen} _hover={{ bg: "orange.300" }}>
                Sign In
              </MenuItem>
            )}
            {isLoggedIn && (
              <MenuItem onClick={handleSignOut} _hover={{ bg: "orange.300" }}>
                Sign Out
              </MenuItem>
            )}
          </MenuList>
        </Menu>
      </Flex>

      {/* Sign-In Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Sign In</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Button as={RouterLink} to="/login" colorScheme="blue" w="full" mb="4">
              Log In
            </Button>
            <Button as={RouterLink} to="/signup" colorScheme="green" w="full">
              Sign Up
            </Button>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Flex>
  );
};

export default Navbar;
