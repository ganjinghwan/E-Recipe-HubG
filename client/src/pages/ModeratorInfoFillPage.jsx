import React, { useEffect, useState } from "react";
import { useAuthStore } from "../store/authStore";
import { useModeratorStore } from "../store/moderatorStore";
import moderatorWorking from "../pic/moderator-work.jpg";
import moderatorDiscuss from "../pic/moderator-discuss.jpg";
import moderatorWriting from "../pic/moderator-writing.jpg";
import moderatorViewing from "../pic/moderator-viewing.jpg";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const ModeratorInfoFillPage = () => {
  const [moderatorKey, setModeratorKey] = useState("");
  const [newModeratorError, setNewModeratorError] = useState("");
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const { user } = useAuthStore();
  const { confirmModerator, isLoading } = useModeratorStore();

  const images = [
    { src: moderatorWorking, position: "60%" },
    { src: moderatorDiscuss, position: "32%" },
    { src: moderatorWriting, position: "34%" },
    { src: moderatorViewing, position: "82%" },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);

  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user, navigate]);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsFading(true);

      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        setIsFading(false);
      }, 500);
    }, 5000);

    return () => clearInterval(interval);
  }, [images.length]);

  const returnHomepage = () => {
    navigate("/");
  };

  const validateFields = () => {
    let error = "";
    if (!moderatorKey) {
      error = "Moderator Key is required";
    }
    setNewModeratorError(error);
    return error;
  };

  useEffect(() => {
    if (hasSubmitted) {
      validateFields();
    }
  }, [moderatorKey, hasSubmitted]);

  const handleNewModerator = async (e) => {
    e.preventDefault();
    setHasSubmitted(true);
    const errors = validateFields();

    if (errors) {
      return;
    }

    try {
      await confirmModerator(moderatorKey);
      toast({
        position: "bottom",
        title: "Moderator Info added successfully",
        description: "Welcome Moderator! Redirect to homepage...",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      navigate("/");
    } catch (error) {
      const messages = error.response?.data?.messages || ["An unexpected error occured"];
      
      messages.forEach((message) => {
        toast({
          position: "bottom",
          title: "Moderator Info failed",
          description: message,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      });

      clearForm();
    }
  };

  const clearForm = () => {
    setModeratorKey("");
    setNewModeratorError("");
    setHasSubmitted(false);
  };

  return (
    <Flex minH="100vh" minW="100vw" direction="row" overflow="hidden">
      {/* Left Content */}
      <Box flex={3} bg="white" p={{ base: 4, md: 8, lg: 16 }}>
        <Text fontSize="4xl" color="black" fontWeight="bold" mt={{ base: 0, md: -10 }}>
          E-Recipes Hub
        </Text>

        <Box mt={3}>
          <Text fontSize="xl" fontWeight="bold">
            Welcome Moderator! Before continue, please fill in the required information.
          </Text>
        </Box>

        <Box as="form" mt={4} onSubmit={handleNewModerator}>
          <FormControl isInvalid={!!newModeratorError} mt={2}>
            <FormLabel>Moderator Key</FormLabel>
            <Input
              type="text"
              borderColor={"black.500"}
              placeholder="Please enter your Moderator Key for verification"
              value={moderatorKey}
              onChange={(e) => setModeratorKey(e.target.value)}
            />
            <FormErrorMessage>{newModeratorError}</FormErrorMessage>
          </FormControl>

          <Box display="flex" justifyContent="space-between" width="100%" mt={4}>
            <Button colorScheme="red" onClick={returnHomepage}>
              Return to Homepage
            </Button>

            <Button type="submit" colorScheme="orange" isLoading={isLoading} loadingText="Verifying, please wait...">
              Confirm
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Right Content with Smooth Cross-Fade */}
      <Box
        flex={1}
        bg="orange"
        p={{ base: 2, md: 4, lg: 8 }}
        display={{ base: "none", md: "block" }}
        position="relative"
        overflow="hidden"
      >
        {images.map((image, index) => (
          <Box
            key={index}
            bgImage={`url(${image.src})`}
            bgRepeat="no-repeat"
            bgSize="cover"
            bgPosition={image.position}
            position="absolute"
            top={0}
            left={0}
            right={0}
            bottom={0}
            transition="opacity 1s ease-in-out"
            opacity={currentIndex === index ? (isFading ? 0 : 1) : 0}
            zIndex={currentIndex === index ? 1 : 0}
          />
        ))}
      </Box>
    </Flex>
  );
};

export default ModeratorInfoFillPage;
