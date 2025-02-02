import React, { useState, useEffect } from "react";
import {
  Box,
  Flex,
  Link as ChakraLink,
  IconButton,
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
  Button,
  Badge,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import LoginForm from "./LoginForm";
import SignUpForm from "./SignUpForm";
import { useAuthStore } from "../store/authStore";
import ProfileForm from "./ProfileForm";
import SearchBar from "./SearchBar";
import InboxModal from "./Inbox";
import { useStoreRecipe } from "../store/StoreRecipe";

const Navbar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // For hamburger menu
  const [isSignUp, setIsSignUp] = useState(false);
  const { isAuthenticated, logout, user, fetchUserInbox, userInbox = [] } = useAuthStore();
  const { isOpen: isOpenProfile, onOpen: onOpenProfile, onClose: onCloseProfile } = useDisclosure();
  const location = useLocation();

  const { selectedUserId } = useAuthStore(); // ✅ Get selectedUserId from global state
  const { setSelectedFoodGlobal } = useStoreRecipe();

  const [unreadNum, setUnreadNum] = useState(0);

  const [isFavorite, setIsFavorite] = useState(false); // Track favorite state
  const navigate = useNavigate();

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const [isInboxOpen, setIsInboxOpen] = useState(false);

  // Define pages where the search bar should be shown
  const pagesWithSearch = ["/recipes", "/visitors", "/eventrecipes", "/favourite"];
  
  // Check if current pathname matches one of the allowed pages
  const shouldShowSearch = pagesWithSearch.includes(location.pathname);

  const openLoginForm = () => {
    setIsSignUp(false);
    onOpen();
  };

  const openSignUpForm = () => {
    setIsSignUp(true);
    onOpen();
  };

  const switchToSignUp = () => {
    setIsSignUp(true);
  };

  const switchToLogin = () => {
    setIsSignUp(false);
  };

  const openProfileForm = () => {
      onOpenProfile();
  };

  const openInbox = () => {
    setIsInboxOpen(true);
  }

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
  };

  const handleFavoriteClick = () => {
    const newState = !isFavorite; // Determine the new state
    setIsFavorite(newState);

    if (newState) {
      // Navigate to favorites page when activated
      navigate("/favourite");
    } else {
      // Navigate back to the page based on user role when deactivated
      if (user?.role === "cook") {
        navigate("/recipes");
      } else if (user?.role === "guest") {
        navigate("/visitors");
      }
    }
  };

  useEffect(() => {
    if (location.pathname === "/verify-email") {
      setIsMobileMenuOpen(false);
    }
  }, [location]);


  // Check number of unread messages
  useEffect(() => {
    if (user) {
      fetchUserInbox();
    }
  }, [isOpen, fetchUserInbox]);

  // Calculate unread count dynamically
  useEffect(() => {
    setUnreadNum(userInbox.filter((msg) => !msg.readStatus).length);
  }, [userInbox]);

  return (
    <Flex
      as="nav"
      bg="transparent"
      position="fixed"
      top="0"
      left="0"
      width="100%"
      px={{ base: "2", md: "4" }}
      py={{ base: "2", md: "4" }}
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
        <ChakraLink as={RouterLink} to="/" fontSize="lg" _hover={{ color: "orange.300" }}
          color={location.pathname === "/" ? "orange.300" : "inherit"}>
          Home
        </ChakraLink>
        <ChakraLink as={RouterLink} to="/about" fontSize="lg" _hover={{ color: "orange.300" }}
          color={location.pathname === "/about" ? "orange.300" : "inherit"}>
          About
        </ChakraLink>
        {/* Role based links */}
        {user?.role === "cook" && (
        <ChakraLink as={RouterLink} to="/recipes" fontSize="lg" _hover={{ color: "orange.300" }}
         color={location.pathname === "/recipes" ? "orange.300" : "inherit"}>
          Recipe
        </ChakraLink>
        )}
        {user?.role === "guest" && (
          <ChakraLink as={RouterLink} to="/visitors" fontSize="lg" _hover={{ color: "orange.300" }}
          color={location.pathname === "/visitors" ? "orange.300" : "inherit"}>
            Recipe
          </ChakraLink>
        )}
        {user?.role === "moderator" && (
          <ChakraLink as={RouterLink} to="/moderatorpg" fontSize="lg" _hover={{ color: "orange.300" }}
          color={location.pathname === "/moderatorpg" ? "orange.300" : "inherit"}>
            DashBoard
          </ChakraLink>
        )}
        {isAuthenticated && user?.role !== "moderator" && (
          <ChakraLink as={RouterLink} to="/events" fontSize="lg" _hover={{ color: "orange.300" }}
          color={location.pathname === "/events" ? "orange.300" : "inherit"}>
            Event
          </ChakraLink> 
        )}
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
              color={location.pathname === "/" ? "orange.300" : "inherit"}
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
              color={location.pathname === "/about" ? "orange.300" : "inherit"}
            >
              About
            </ChakraLink>
            {user?.role === "cook" && (
            <ChakraLink
              as={RouterLink}
              to="/recipes"
              display="block"
              py="2"
              _hover={{ color: "orange.300" }}
              onClick={toggleMobileMenu}
              color={location.pathname === "/recipes" ? "orange.300" : "inherit"}
            >
              Recipe
            </ChakraLink>
            )}
            {user?.role === "guest" && (
              <ChakraLink
                as={RouterLink}
                to="/visitors"
                display="block"
                py="2"
                _hover={{ color: "orange.300" }}
                onClick={toggleMobileMenu}
                color={location.pathname === "/visitors" ? "orange.300" : "inherit"}
              >
                Recipe
              </ChakraLink>
            )}
            {user?.role === "moderator" && (
              <ChakraLink
                as={RouterLink}
                to="/moderatorpg"
                display="block"
                py="2"
                _hover={{ color: "orange.300" }}
                onClick={toggleMobileMenu}
                color={location.pathname === "/moderatorpg" ? "orange.300" : "inherit"}
              >
                DashBoard
              </ChakraLink>
            )}
            {isAuthenticated && user?.role !== "moderator" && (
              <ChakraLink
                as={RouterLink}
                to="/events"
                display="block"
                py="2"
                _hover={{ color: "orange.300" }}
                onClick={toggleMobileMenu}
                color={location.pathname === "/events" ? "orange.300" : "inherit"}
              >
                Events
              </ChakraLink>
            )}
          </Box>
        )}
      </Box>

      {/* Right Section: Search, Favorites, Profile */}
      <Flex align="center" gap="4" position="relative">
      {isAuthenticated ? (
        <>
        {/* Search Bar */}
        {shouldShowSearch && (
            <SearchBar 
                selectedUserId={selectedUserId} 
                setSelectedFoodGlobal={setSelectedFoodGlobal} 

                /> 

          )}

        {/* Favorites Button */}
        {(user?.role === "cook" || user?.role === "guest") && (
        <IconButton
            icon={<i className="fas fa-heart"></i>}
            aria-label="Favorite"
            bg={"transparent"}
            onClick={handleFavoriteClick}
            _hover={{ bg: "whiteAlpha.200", color: "orange.300" }}
            color={location.pathname === "/favourite" ? "red" : "inherit"}
          />
        )}

        {/* Inbox Button */}
        {(user?.role === "cook" || user?.role === "guest" || user?.role === "event-organizer") && (
        <Box position="relative" display="inline-block">
          <IconButton
            icon={<i className="fas fa-envelope"></i>} // Add a font-awesome envelope icon
            aria-label="Inbox"
            onClick={openInbox}
            color="white"
            variant=""
            _hover={{ bg: "whiteAlpha.200", color: "orange.300" }}
            
          />

          {unreadNum > 0 && (
            <Badge
              colorScheme="red"
              position="absolute"
              top="2.5"
              right="2.5"
              transform="translate(50%, -50%)"
              borderRadius="full"
              px={2}
              fontSize="0.7em"
              alignItems="center"
              justifyContent="center" 
              display="flex"
              width="1.5em"
              height="1.5em"
            >
              {unreadNum}
            </Badge>
          )}
        </Box>
        )}


        

        {/* Profile Dropdown */}
        <Menu>
          <MenuButton
            as={IconButton}
            icon={<i className="fas fa-user"></i>}
            variant="outline"
            color="white"
            _hover={{ bg: "whiteAlpha.200", color: "orange.300" }}
          />
          <MenuList bg="gray.800" color="black">
                <MenuItem onClick={openProfileForm} _hover={{ bg: "orange.300" }}> 
                  Profile 
                </MenuItem> 
                <MenuItem onClick={handleLogout} _hover={{ bg: "orange.300" }}> 
                  Sign Out 
                </MenuItem>
          </MenuList>
        </Menu>
        {/* Profile Modal*/}
        <ProfileForm isOpen={isOpenProfile} onClose={onCloseProfile} />
          </>
        ) : (
          <>
            <Button colorScheme="yellow" onClick={openLoginForm}>Login</Button>
            <Button colorScheme="orange" onClick={openSignUpForm}>Sign Up</Button>
          </>
        )}

      
      </Flex>

      <InboxModal
            isOpen={isInboxOpen}
            onClose={() => setIsInboxOpen(false)}
        />
  

      {/* Modal */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent
          maxW="420px"
          bg="linear-gradient(to top left, #ffecd2, #fcb69f)"
          borderRadius="30px"
          p={{ base: "4", md: "8" }}
          boxShadow="lg"
          position="absolute"
          top="14%"
        >
          <ModalHeader position="relative" display="flex" alignItems="center" justifyContent="center" minHeight={{ base: "100px", md: "130px" }}>
            <AnimatePresence mode="wait">
              {isSignUp ? (<SignUpForm onClose={onClose} switchToLogin={switchToLogin} />) : (<LoginForm onClose={onClose} switchToSignUp={switchToSignUp} />)}
            </AnimatePresence>
          </ModalHeader>
        </ModalContent>
      </Modal>
    </Flex>
  );
};

export default Navbar;
