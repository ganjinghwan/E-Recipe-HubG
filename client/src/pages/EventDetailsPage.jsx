import React, { useEffect, useState } from 'react';
import eventDetailsBgImage from '../pic/eventsDetailsImg.jpg';
import { Box, Flex, Text, Button, Image, useToast } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useEventStore } from '../store/eventStore';
import LoadingSpinner from '../components/LoadingSpinner';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

import UpdateEventForm from '../components/UpdateEventForm';

const EventDetailsPage = () => {
    const { user } = useAuthStore();
    const { eventSpecificEndUrl } = useParams();
    const { events, getEventInfo } = useEventStore();
    const [isFetching, setIsFetching] = useState(true);

    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

    const navigate = useNavigate();
    const toast = useToast();

    useEffect(() => {
        const fetchEventData = async () => {
          try {
            // Simulate loading time and fetch data simultaneously
            // Promise = ensures both operations are done before rendering the component
            await Promise.all([
              getEventInfo(eventSpecificEndUrl),
              new Promise(resolve => setTimeout(resolve, 4000)) // 4-second delay
            ]);
          } catch (error) {
            toast({
              title: "Error",
              description: "Invalid or missing event URL.",
              status: "error",
              duration: 5000,
              isClosable: true,
            });
            navigate("/events");
          } finally {
            setIsFetching(false);  // Stop loading spinner
          }
        };
    
        fetchEventData();
      }, [eventSpecificEndUrl, getEventInfo, navigate, toast]);

    console.log("Events:", events);

    const openUpdateEventModal = () => {
        setIsUpdateModalOpen(true);
    };

    const closeUpdateEventModal = () => {
        setIsUpdateModalOpen(false);
    };

    return (
        <Flex
            direction="column"
            justify="center"
            align="center"
            h="100vh"
            position="relative"
            textAlign="center"
            overflow="hidden"
            bgImage={`url(${eventDetailsBgImage})`}
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
                bg="blackAlpha.600"
                zIndex="0"
            />

            {/* Content */}
            {isFetching ? (
                <>
                <LoadingSpinner />
                <Text fontSize="xl" fontWeight="bold" mt="4" color="#FFFFFF" zIndex={1}>
                    Loading...
                </Text>
                </>
            ) : (
                <motion.div
                position="relative"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.2 }}
                >
                    <Box
                    position={"absolute"}
                    top="11%"
                    left={"3%"}
                    zIndex={"1"}
                    width="94%"
                    height="84%"
                    bg={"white"}
                    justifyContent={"flex-start"}
                    borderRadius={"lg"}
                    alignItems={"flex-start"}
                    >
                        <Box
                            position={"absolute"}
                            width={"100%"}
                            height={"90%"}
                            opacity={"1"}
                            overflowY={"auto"}
                            textAlign={"left"}
                        >
                            <Text 
                                fontSize={"5xl"} 
                                fontWeight={"bold"} 
                                mt={"10px"} 
                                ml={"26px"}
                                color={"#4CAF50"}
                            >
                                {events?.specificEventInfo?.event_name}
                            </Text>

                            <Text
                                fontSize={"md"}
                                mt={"10px"}
                                ml={"26px"}
                            >
                                Created by: {events?.userInfo?.username} from {events?.eventOrgInfo?.orgName}
                            </Text>

                            <Text
                                fontSize={"xl"}
                                mt={"10px"}
                                ml={"26px"}
                                fontStyle={"italic"}
                            >
                                Description: {events?.specificEventInfo?.event_description}
                            </Text>

                            <Text
                                fontSize={"xl"}
                                mt={"10px"}
                                ml={"26px"}
                            >
                                Event Period: {events?.visualEventStartDate} to {events?.visualEventEndDate}
                            </Text>

                            <Box
                                position="absolute"
                                ml="26px"
                                mt="10px"
                                width="100%"
                                display="flex"
                                justifyContent="center"
                                alignItems="center"
                            >
                                <Image
                                    src={events?.specificEventInfo?.event_thumbnail}
                                    position={"relative"}
                                />
                            </Box>
                        </Box>
                    {user && user.role === "event-organizer" && events?.specificEventInfo?.eventBelongs_id === user?._id && (
                        <>
                        <Button
                            position={"absolute"}
                            bottom="10px"
                            right="306px"
                            colorScheme="green"
                            size="md"
                            _hover={{ bg: "green.600" }}
                            onClick={openUpdateEventModal}
                        >
                            Update Event
                        </Button>
                        <UpdateEventForm isOpen={isUpdateModalOpen} onClose={closeUpdateEventModal} eventURL={eventSpecificEndUrl}/>
                        <Button
                            position={"absolute"}
                            bottom="10px"
                            right="150px"
                            colorScheme="blue"
                            size="md"
                            _hover={{ bg: "red.600" }}
                        >
                            Invite Attendees
                        </Button>
                        <Button
                            position={"absolute"}
                            bottom="10px"
                            right="20px"
                            colorScheme="red"
                            size="md"
                            _hover={{ bg: "red.600" }}
                        >
                            Delete Event
                        </Button>
                        </>
                    )}
                    </Box>
                </motion.div>
            )}
        </Flex>
        );
};

export default EventDetailsPage;