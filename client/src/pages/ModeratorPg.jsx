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
import { FaHeart, FaComment, FaFlag, FaClock, FaYoutube, FaUser, FaStar} from "react-icons/fa";
import { FaChevronLeft, FaChevronRight, FaChevronDown } from "react-icons/fa"; // Import specific icons
import generalBackground from "../pic/room.jpg";
import { useStoreRecipe } from "../store/StoreRecipe";
import { useAuthStore } from "../store/authStore";

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
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [categories, setCategories] = useState(["All"]); // "All" as default
  const [selectedCategory, setSelectedCategory] = useState("All");


  const toast = useToast();
  const iconButtonSize = useBreakpointValue({ base: "sm", md: "md" });

  


  return (
      <Flex
            direction="column"
            justify="center"
            align="center"
            h="100vh"
            bgImage={`url(${generalBackground})`}
            bgSize="cover"
            bgPosition="center"
            bgRepeat="no-repeat"
            position="relative"
            textAlign="center"
            filter={isOpen ? "blur(5px)" : "none"}  // Apply blur when modal is open
          > 
      </Flex>
  );

};

export default ModeratorPage;