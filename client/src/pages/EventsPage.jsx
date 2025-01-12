import React, { useEffect, useState } from "react";
import { Box, Button, Flex, Text, VStack } from "@chakra-ui/react";
import { motion } from "framer-motion";
import LoadingSpinner from "../components/LoadingSpinner";
import eventBlur from "../pic/event-blur.png";
import { useAuthStore } from "../store/authStore";
import { useEventStore } from "../store/eventStore";

import CreateEventForm from "../components/CreateEventForm";
import { useNavigate } from "react-router-dom";

const EventsPage = () => {
  const { user } = useAuthStore();
  const { events, getAllSpecificEventOrgEvents, getAllEvents, isLoading: eventsLoading } = useEventStore();
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      // Fetch all designated event organizer created events
      if (user?.role === "event-organizer") {
        getAllSpecificEventOrgEvents();
      } else {
        getAllEvents();
      }
    }, 4000);

    return () => clearTimeout(timer);
  }, [user, getAllSpecificEventOrgEvents, getAllEvents]);

  useEffect(() => {
    if (!isLoading) {
      console.log("Events:", events);
    }
  }, [isLoading, events]);

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
      bgImage={`url(${eventBlur})`}
      bgSize="cover"
      bgPosition="center"
      bgRepeat="no-repeat"
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
          opacity={"0.8"}
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
                    >
                      <Box flex={4} minW={"0"}>
                        <Text fontSize="2xl" fontWeight="bold" color={"orange.800"} isTruncated>
                          {event.event_name}
                        </Text>
                        <Text mt={1} noOfLines={2}>
                          {event.event_description}
                        </Text>
                      </Box>

                      {/* Buttons */}
                      <Box flex={1}
                        display={"flex"}
                        justifyContent={"center"}
                        alignItems={"center"}
                      >
                        <Button
                          display={"flex"}
                          colorScheme="orange"
                          onClick={() => {
                            navigate(`/events/${event.eventSpecificEndUrl}`);
                          }}
                        >
                          More Info
                        </Button>
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
