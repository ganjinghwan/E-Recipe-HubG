import React, { useEffect, useRef, useState } from 'react';
import goodRainbow from '../pic/goodrainbow.jpg';
import { 
    Box, 
    Flex, 
    Text, 
    Button, 
    Image, 
    useToast, 
    AlertDialog,
    AlertDialogOverlay,
    AlertDialogHeader,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogContent,
    Tooltip,
    IconButton,
    useBreakpointValue
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useEventStore } from '../store/eventStore';
import LoadingSpinner from '../components/LoadingSpinner';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

import UpdateEventForm from '../components/UpdateEventForm';
import InviteAttendeesForm from '../components/InviteAttendeesForm';

import { IoBook } from "react-icons/io5";
import { FaRegEdit } from "react-icons/fa";
import { IoIosSend } from "react-icons/io";
import { MdDelete } from "react-icons/md";

const EventDetailsPage = () => {
    const { user } = useAuthStore();
    const { eventSpecificEndUrl } = useParams();
    const { events, getEventInfo, deleteEvent, joinEvent, isLoading } = useEventStore();
    const [isFetching, setIsFetching] = useState(true);

    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
    const [isAlertOpen, setIsAlertOpen] = useState(false);

    const [isJoinAlertOpen, setIsJoinAlertOpen] = useState(false);
    const cancelRef = useRef();

    const navigate = useNavigate();
    const toast = useToast();

    const iconButtonSize = useBreakpointValue({ base: "sm", md: "md" });

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

    const isEventExpired = new Date(events?.specificEventInfo?.end_date) < new Date();

    const openUpdateEventModal = () => {
        setIsUpdateModalOpen(true);
    };

    const closeUpdateEventModal = () => {
        setIsUpdateModalOpen(false);
    };

    const openInviteAttendeesModal = () => {
        setIsInviteModalOpen(true);
    };

    const closeInviteAttendeesModal = () => {
        setIsInviteModalOpen(false);
    };

    const handleDeleteEvent = async () => {
        setIsAlertOpen(false);

        try {
            await deleteEvent(eventSpecificEndUrl);
            toast({
                position: "bottom",
                title: "Event deleted successfully",
                description: "Redirect back to events page...",
                status: "success",
                duration: 5000,
                isClosable: true,
            })

            navigate("/events")
        } catch (error) {
            toast({
                position: "bottom",
                title: "Failed to delete event",
                description: error.message,
                status: "error",
                duration: 5000,
                isClosable: true,
            })
        }
    }

    const handleJoinEvent = async () => {
        setIsJoinAlertOpen(false);

        try {
            await joinEvent(eventSpecificEndUrl);
            toast({
                position: "bottom",
                title: "Successfully joined event",
                description: "Redirect back to events page...",
                status: "success",
                duration: 5000,
                isClosable: true,
            })

            navigate("/events")
        } catch (error) {
            toast({
                position: "bottom",
                title: "Failed to join event",
                description: error.message, 
                status: "error",
                duration: 5000,
                isClosable: true,
            })
        }
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
            bgImage={`url(${goodRainbow})`}
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
                            overflowX={"hidden"}
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
                                width="90%"
                                display="flex"
                                justifyContent="center"
                                alignItems="center"
                            >
                                <Image
                                    src={events?.specificEventInfo?.event_thumbnail}
                                    position={"relative"}
                                    width={"100%"}
                                    height={"100%"}
                                    objectFit={"cover"}
                                />
                            </Box>
                        </Box>


                        {user && events ? (
                            user.role === "event-organizer" && events?.specificEventInfo?.eventBelongs_id === user?._id ? (
                            <>
                                {!isEventExpired && (
                                    <>
                                    <Tooltip label="Invite Attendees">
                                        <IconButton
                                            size={iconButtonSize}
                                            icon={<IoIosSend />}
                                            position={"absolute"}
                                            aria-label='Invite Attendees'
                                            colorScheme='blue'
                                            bottom={"10px"}
                                            right={"170px"}
                                            onClick={openInviteAttendeesModal}
                                        />
                                    </Tooltip>
                                    <InviteAttendeesForm isOpen={isInviteModalOpen} onClose={closeInviteAttendeesModal} eventURL={eventSpecificEndUrl}/>
                                    </>
                                )}

                                <Tooltip label="Update Event">
                                    <IconButton
                                        size={iconButtonSize}
                                        icon={<FaRegEdit />}
                                        position={"absolute"}
                                        aria-label='Update Event'
                                        colorScheme='green'
                                        bottom="10px"
                                        right="120px"
                                        onClick={openUpdateEventModal}
                                    />
                                </Tooltip>
                                <UpdateEventForm isOpen={isUpdateModalOpen} onClose={closeUpdateEventModal} eventURL={eventSpecificEndUrl} eventsNowInfo={events?.specificEventInfo}/>

                                <Tooltip label="Delete Event">
                                    <IconButton
                                        size={iconButtonSize}
                                        icon={<MdDelete />}
                                        position={"absolute"}
                                        aria-label='Delete Event'
                                        colorScheme='red'
                                        bottom={"10px"}
                                        right={"70px"}
                                        onClick={() => setIsAlertOpen(true)}
                                    />
                                </Tooltip>

                                <Tooltip label="View Event Recipe">
                                    <IconButton
                                        size={iconButtonSize}
                                        icon={<IoBook />}
                                        position={"absolute"}
                                        aria-label="View Event Recipe"
                                        colorScheme="orange"
                                        bottom="10px"
                                        right="20px"
                                        onClick={() => {
                                            navigate(`/eventrecipes?event_id=${events?.specificEventInfo?._id}`); // Pass event_id as query param
                                        }}
                                    />
                                </Tooltip>
                            </>
                            ) : user.role !== "event-organizer" ? (
                                // Display join button for users who are not event organizers
                                events?.specificEventInfo?.attendees?.includes(user?._id) ? (
                                <>
                                    <Box
                                        position={"absolute"}
                                        bottom="16px"
                                        right="20px"
                                    >
                                        <Flex
                                            direction={"row"}
                                            align={"center"}
                                        >
                                            <Tooltip label="View Event Recipe">
                                            <IconButton
                                                size={iconButtonSize}
                                                icon={<IoBook />}
                                                ml={4}
                                                aria-label="View Event Recipe"
                                                colorScheme="green"
                                                onClick={() => {
                                                    navigate(`/eventrecipes?event_id=${events?.specificEventInfo?._id}`); // Pass event_id as query param
                                                }}
                                            />
                                            </Tooltip>
                                            {/* Display text cannot join if user is already attending */}
                                            <Text
                                                fontSize={"xl"} 
                                                fontWeight={"bold"} 
                                                color={"blue.500"}
                                                ml={"10px"}
                                                mt={"6px"}    
                                            >
                                                {isEventExpired ? "Event expired" : "You have already join this event"}
                                            </Text>
                                        </Flex>
                                    </Box>
                                </>                                
                                ) : (
                                    <>
                                    {isEventExpired ? (
                                        <Box
                                            position={"absolute"}
                                            bottom="16px"
                                            right="20px"
                                        >
                                            <Text 
                                                fontSize={"xl"} 
                                                fontWeight={"bold"} 
                                                color={"purple.500"}
                                                ml={"10px"}
                                                mt={"6px"}                                               
                                            >
                                                Event expired, unable to join event
                                            </Text>                                        
                                        </Box>
                                    ) : (
                                        <Button
                                        position={"absolute"}
                                        bottom="10px"
                                        right="20px"
                                        colorScheme="teal"
                                        size="md"
                                        _hover={{ bg: "teal.600" }}
                                        onClick={() => setIsJoinAlertOpen(true)}
                                        >
                                            Join Event
                                        </Button>
                                    )}
                                    </>
                                )
                            ) : (
                                // Display text to event organizer cannot join
                                <Text position={"absolute"} bottom="10px" right="20px" fontSize={"xl"} fontWeight={"bold"} color={"red.500"}>Event organizer cannot join other events</Text>
                            )
                        ) : (
                            navigate("/")
                        )}
                    </Box>
                </motion.div>
            )}

            {/* Alert Dialog for deleting event */}
            <AlertDialog
                isOpen={isAlertOpen}
                leastDestructiveRef={cancelRef}
                onClose={() => setIsAlertOpen(false)}
                isCentered
            >
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            Confirm Delete Event
                        </AlertDialogHeader>

                        <AlertDialogBody>
                            Are you sure you want to delete this event? Once confirmed, it cannot be undone.
                        </AlertDialogBody>

                        <AlertDialogFooter>
                            <Button ref={cancelRef} onClick={() => setIsAlertOpen(false)}>
                                Cancel
                            </Button>
                            <Button colorScheme="red" ml={3} onClick={handleDeleteEvent}>
                                Confirm
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>


            {/* Alert Dialog for joining event */}
            <AlertDialog
                isOpen={isJoinAlertOpen}
                leastDestructiveRef={cancelRef}
                onClose={() => setIsJoinAlertOpen(false)}
                isCentered
            >
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            Join Event
                        </AlertDialogHeader>

                        <AlertDialogBody>
                            Confirm to Join Event? Once join you cannot leave
                        </AlertDialogBody>

                        <AlertDialogFooter>
                            <Button ref={cancelRef} onClick={() => setIsJoinAlertOpen(false)}>
                                Cancel
                            </Button>
                            <Button colorScheme="green" ml={3} onClick={handleJoinEvent}>
                                Confirm
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </Flex>
        );
};

export default EventDetailsPage;