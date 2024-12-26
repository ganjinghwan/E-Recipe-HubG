import { Box, Button, Flex, FormControl, FormErrorMessage, FormLabel, Input, Text, Textarea, useToast } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import eventOrganizerHappy from "../pic/event-organizer-smile.jpg";
import eventOrganizerSmiling from "../pic/event-organizer-smiling.png";
import eventOrganizerCheck from "../pic/event-organizer-check.jpg";
import eventShow from "../pic/event-show.jpg";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useEventOrgStore } from "../store/eventOrgStore";

const EventOrganizerInfoFillPage = () => {
  // Event Organizer state
  const [eventOrganizerName, setEventOrganizerName] = useState("");
  const [eventOrganizerDescription, setEventOrganizerDescription] = useState("");
  const [eventOrganizerContact, setEventOrganizerContact] = useState("");
  const [eventOrganizerLocation, setEventOrganizerLocation] = useState("");
  const [newEventOrgError, setNewEventOrgError] = useState({});

  const [hasSubmitted, setHasSubmitted] = useState(false);
  const { user } = useAuthStore();
  const { newEventOrganizerInfo, isLoading } = useEventOrgStore();
  
  const images = [
    { src: eventOrganizerHappy, position: "86%" }, 
    { src: eventOrganizerSmiling, position: "32%" }, 
    { src: eventOrganizerCheck, position: "34%" }, 
    { src: eventShow, position: "center" }
  ];
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);
  
  const toast = useToast();
  const navigate = useNavigate();
  const maxCharacters = 250;

  if (!user) {
    navigate("/");
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setIsFading(true);

      // Wait for the fade-out animation to complete before switching images
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        setIsFading(false);
      }, 500);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, [images.length]);

  
  const handleDescriptionChange = (e) => {
    const input = e.target.value;
    if (input.length <= maxCharacters) {
      setEventOrganizerDescription(input);
    } else {
      return;
    }
  };
  
  const returnHomepage = () => {
    navigate("/");
  }
  
  const validateFields = () => {
    const errorHandling = {};

    if (!eventOrganizerName) {
      errorHandling.eventOrganizerName = "Event Organizer Name is required";
    }
    if (!eventOrganizerDescription) {
      errorHandling.eventOrganizerDescription = "Event Organizer Description is required";
    }
    if (!eventOrganizerContact) {
      errorHandling.eventOrganizerContact = "Event Organizer Contact is required";
    }
    if (!eventOrganizerLocation) {
      errorHandling.eventOrganizerLocation = "Event Organizer Location is required";
    }

    setNewEventOrgError(errorHandling);
    return errorHandling;
  }

  useEffect(() => {
    if (hasSubmitted) {
      validateFields();
    }
  }, [eventOrganizerName, eventOrganizerDescription, eventOrganizerContact, eventOrganizerLocation, hasSubmitted]);

  const handleNewEventOrg = async (e) => {
    e.preventDefault();
    setHasSubmitted(true);
    const errors = validateFields();

    if (Object.keys(errors).length > 0) {
      return;
    }

    try {
      await newEventOrganizerInfo(eventOrganizerName, eventOrganizerDescription, eventOrganizerContact, eventOrganizerLocation);
      toast({
        position: "bottom",
        title: "New Event Organizer Info added successfully",
        description:"Welcome Event Organizer! Redirect to homepage...",
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
          title: "New Event Organizer Info failed",
          description: message,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      });
    
      clearForm();
    }
  }

  const clearForm = () => {
    setEventOrganizerName("");
    setEventOrganizerDescription("");
    setEventOrganizerContact("");
    setEventOrganizerLocation("");
    setNewEventOrgError({});
    setHasSubmitted(false);
  }

  return (
    <Flex
      minH="100vh"
      minW="100vw"
      direction="row"
      overflow="hidden"
    >
      {/* Left Content */}
      <Box flex={3} bg="white" p={{ base: 4, md: 8, lg: 16 }}>
        <Text fontSize="4xl" color="black" fontWeight="bold" mt={{base: 0, md: -10}}>
          E-Recipes Hub
        </Text>

        <Box mt={3}>
          <Text fontSize="xl" fontWeight={"bold"}>
            Welcome Event Organizer! Before continue, please fill all in the information below.
          </Text>
        </Box>

        <Box as="form" mt={4} direction={"column"} onSubmit={handleNewEventOrg}>
          <FormControl isInvalid={!!newEventOrgError.eventOrganizerName} mt={2}>
            <FormLabel>Event Organizer Name</FormLabel>
            <Input
              type="text"
              borderColor={"black.500"}
              placeholder="Enter your Event Organizer Name here"
              value={eventOrganizerName}
              onChange={(e) => setEventOrganizerName(e.target.value)}
            />
            {newEventOrgError.eventOrganizerName && <FormErrorMessage>{newEventOrgError.eventOrganizerName}</FormErrorMessage>}
          </FormControl>

          <FormControl isInvalid={!!newEventOrgError.eventOrganizerDescription}mb="2">
            <FormLabel>Organization Description</FormLabel>
            <Textarea
              borderColor={"black.500"}
              placeholder="Enter your new organization description here (maximum 250 characters)"
              value={eventOrganizerDescription}
              onChange={handleDescriptionChange}
              height={"160px"}
              maxH={"160px"}
              minH={"160px"}
              resize={"vertical"}
            />
              <Text mt="2" color={eventOrganizerDescription.length == maxCharacters ? "red.500" : "gray.500"}>
              {`Words: ${eventOrganizerDescription.length} / ${maxCharacters}`}
              {newEventOrgError.eventOrganizerDescription && <FormErrorMessage>{newEventOrgError.eventOrganizerDescription}</FormErrorMessage>}
            </Text>
          </FormControl>

          <FormControl isInvalid={!!newEventOrgError.eventOrganizerContact} mb="2">
            <FormLabel>Organization Contact</FormLabel>
            <Input
              type="number"
              borderColor={"black.500"}
              placeholder="Enter your new organization contact here"
              value={eventOrganizerContact}
              onChange={(e) => setEventOrganizerContact(e.target.value)}
              onWheel={(e) => e.target.blur()} // Prevent scrolling from messing with numbers
            />
            {newEventOrgError.eventOrganizerContact && <FormErrorMessage>{newEventOrgError.eventOrganizerContact}</FormErrorMessage>}
          </FormControl>

          <FormControl isInvalid={!!newEventOrgError.eventOrganizerLocation} mb="4">
            <FormLabel>Organization Location</FormLabel>
            <Textarea 
              borderColor={"black.500"}
              placeholder="Enter your new organization location here"
              value={eventOrganizerLocation}
              onChange={(e) => setEventOrganizerLocation(e.target.value)}
              height={"70px"}
              maxH={"70px"}
              minH={"70px"}
              resize={"vertical"}
            />
            {newEventOrgError.eventOrganizerLocation && <FormErrorMessage>{newEventOrgError.eventOrganizerLocation}</FormErrorMessage>}
          </FormControl>

          <Box display={"flex"} justifyContent={"space-between"} width={"100%"}>
            <Button
              colorScheme="red"
              onClick={returnHomepage}
            >
              Return to Homepage
            </Button>

            <Button
              type="submit"
              colorScheme="blue"
              isLoading={isLoading}
              loadingText="Submitting, please wait..."
            >
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

export default EventOrganizerInfoFillPage;