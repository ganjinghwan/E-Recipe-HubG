import React, { useEffect, useState } from "react";
import { Badge, Box, Button, Flex, IconButton, Text, Tooltip, useBreakpointValue, VStack } from "@chakra-ui/react";
import { motion } from "framer-motion";
import LoadingSpinner from "../components/LoadingSpinner";
import foodTable from "../pic/foodTable.jpg"
import { useAuthStore } from "../store/authStore";
import { useEventStore } from "../store/eventStore";

import CreateEventForm from "../components/CreateEventForm";
import { useNavigate } from "react-router-dom";
import { FaInfoCircle } from "react-icons/fa";
import { IoBook } from "react-icons/io5";
import { useStoreRecipe } from "../store/StoreRecipe";

const EventsPage = () => {
  const { user } = useAuthStore();
  const { events, getAllSpecificEventOrgEvents, getAllEvents, isLoading: eventsLoading } = useEventStore();
  const { fetchEventRecipeCount, eventRecipeCounts  } = useStoreRecipe();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigate = useNavigate();

  const iconButtonSize = useBreakpointValue({ base: "sm", md: "md" });

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      // Fetch all designated event organizer created events
      if (user?.role === "event-organizer") {
        getAllSpecificEventOrgEvents();
      } else {
        getAllEvents();
      }  
    }, 1500);
    return () => clearTimeout(timer);
  }, [user, getAllSpecificEventOrgEvents, getAllEvents]);

  // Fetch recipe counts after events are loaded
  useEffect(() => {
    if (events?.length > 0) {

      events.forEach((event) => {
        fetchEventRecipeCount(event._id);  // Fetch count and store it in the store
      });
    }
  }, [events, fetchEventRecipeCount]);


  const getRecipeCount = (eventID) => {
    return eventRecipeCounts[eventID] || 0;
  }

  const openCreateEventModal = () => {
    setIsModalOpen(true);
  }

  const closeCreateEventModal = () => {
    setIsModalOpen(false);
  }

  return (
    <Flex
      direction="column"
      justify="center"
      align="center"
      h="100vh"
      position="relative"
      textAlign="center"
      overflow="hidden"
      bgImage={`url(${foodTable})`}
      bgSize="cover"
      bgPosition="center"
      bgRepeat="no-repeat"
      bgAttachment="fixed"
    >
      {/* Overlay */}
      <Box
        position="absolute"
        top="0"
        left="0"
        w="100%"
        h="100%"
        bg="blackAlpha.800"
        zIndex="0"
      />
      {isLoading ? (
        <>
          <LoadingSpinner />
          <Text fontSize="xl" fontWeight="bold" mt="4" color="#FFFFFF" zIndex={1}>
            Loading...
          </Text>
        </>
      ) : (
        <Box
          position={"absolute"}
          top="13%"
          left={"5%"}
          zIndex={"1"}
          width="90%"
          height="80%"
          bg={"white"}
          opacity={"0.9"}
          justifyContent={"flex-start"}
          borderRadius={"lg"}
          alignItems={"flex-start"}
        >               
          <Box
            position="absolute"
            width="100%"
            height={"90%"}
            opacity={"1"}
            overflowY={"auto"}
          >
            <motion.div
              position="relative"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.2 }}
            >
              {/* List Form with VStack */}
              <VStack spacing={2} align="stretch">
                {events?.length > 0 ? (
                  events.map((event) => (
                    <Flex
                      key={event._id}
                      p={4}
                      bg="blue.200"
                      borderRadius="md"
                      height={"120px"}
                      minW="90%"
                      textAlign={"left"}
                      alignItems={"center"}
                      _hover={{ bg: "blue.100" }}
                      mt={2}
                      ml={2}
                      mr={2}
                      mb={-1}
                    >
                      <Box flex={8} minW={"0"}>
                        <Text fontSize="2xl" fontWeight="bold" color={"orange.800"} isTruncated>
                          {event.event_name}
                        </Text>
                        <Text mt={1} noOfLines={2}>
                          {event.event_description}
                        </Text>
                        <Text mt={1} noOfLines={1}>
                          Ends at: {new Date(event.end_date).toLocaleString("en-US", { 
                            weekday: "short", // "Fri"
                            year: "numeric", 
                            month: "long",  // "February"
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true, // AM/PM format
                          })}
                          {new Date(event.end_date).getTime() < Date.now() ? " (Expired)" : ""}
                        </Text>
                      </Box>

                      {/* Buttons & recipe count */}
                      <Box
                        flex={2}
                        display={"flex"}
                        justifyContent={"center"}
                        alignItems={"center"}
                        align={"center"}
                        gap={1}
                      >
                          <Tooltip label="More Info">
                            <IconButton
                              size={iconButtonSize}
                              icon={<FaInfoCircle />}
                              aria-label="More Info"
                              colorScheme="orange"
                              onClick={() => {
                                navigate(`/events/${event.eventSpecificEndUrl}`);
                              }}
                            />
                          </Tooltip>
                            {(event.attendees?.includes(user?._id) || user?.role === "event-organizer" || user?.role === "moderator") && (
                              <Box position="relative" display="inline-block">
                              <Tooltip label="View Event Recipe">
                                <IconButton
                                  size={iconButtonSize}
                                  icon={<IoBook />}
                                  ml={4}
                                  aria-label="View Event Recipe"
                                  colorScheme="green"
                                  onClick={() => {
                                    navigate(`/eventrecipes?event_id=${event._id}`); 
                                  }}
                                />
                              </Tooltip>
                              
                              {getRecipeCount(event._id) > 0 && (
                                <Badge
                                  colorScheme="red"
                                  position="absolute"
                                  top="-6px"
                                  right="-8px"
                                  borderRadius="full"
                                  px={2}
                                  fontSize="0.8em"
                                >
                                  {getRecipeCount(event._id)}
                                </Badge>  
                              )}
                            </Box>
                            )}
                      </Box>
                    </Flex>
                      ))
                ) : (
                  <Box 
                    width={"100%"}
                    height={"100%"}
                    position={"absolute"}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Text fontSize={"2xl"} fontWeight={"bold"} color="black">
                      {user?.role === "event-organizer" ? "No events available, maybe try creating one?" : "No Events Happening For Now, check again later"}
                    </Text>
                  </Box>
                )}
              </VStack>
            </motion.div>
          </Box>

          {user && user.role === "event-organizer" && (
            <Button
              position={"absolute"}
              bottom="10px"
              right="20px"
              colorScheme="green"
              size="md"
              onClick={openCreateEventModal}
              _hover={{ bg: "green.600" }}
            >
              Create Event
            </Button>
          )}
          <CreateEventForm isOpen={isModalOpen} onClose={closeCreateEventModal} />
        </Box>
      )}
    </Flex>
  );
};

export default EventsPage;
