import React, { useEffect, useState, useCallback } from 'react';
import {
    Box,
    Text,
    Modal,
    ModalCloseButton,
    ModalBody,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    VStack,
    Flex,
    Button,
    useToast,
    useBreakpointValue,
    Portal,
} from '@chakra-ui/react';
import { useAuthStore } from '../store/authStore';
import { useEventStore } from '../store/eventStore';
import LoadingSpinner from './LoadingSpinner';
import { motion } from 'framer-motion';

import invitation from '../pic/Invitation.jpg';
import invitation2 from '../pic/Invitation2.jpg';
import invitation3 from '../pic/Invitation3.jpg';

const MotionImage = motion(Box);

const InviteAttendeesForm = ({ isOpen, onClose, eventURL }) => {
    const { attendeesList, getInviteAttendeesList, sendInviteEventReq } = useEventStore();
    const { addInbox } = useAuthStore();
    const [loadingUserId, setLoadingUserId] = useState(null); // Track user being invited
    const [invitedUsers, setInvitedUsers] = useState([]); // Track successfully invited users
    const [processedInvites, setProcessedInvites] = useState(new Set()); // Prevent sending multiple times
    const [isFinding, setIsFinding] = useState(false);

    const toast = useToast();
    const isLargerScreen = useBreakpointValue({ base: false, sm: false, md: false, lg: true });
  
    useEffect(() => {
        setIsFinding(true);
        const timer = setTimeout(() => {
            setIsFinding(false);
        }, 4000);
        
        getInviteAttendeesList(eventURL);
        return () => clearTimeout(timer);
    }, [getInviteAttendeesList, eventURL]);

    const handleInvite = useCallback(async (selectedUserID) => {
        setLoadingUserId(selectedUserID); // Set loading state
        try {
            const updateInviteNeeded = await sendInviteEventReq(eventURL, selectedUserID);

            console.log("Invite needed after sendInviteEventReq:", updateInviteNeeded);

            setProcessedInvites((prev) => new Set([...prev, selectedUserID]));

            // Mark as invited and send inbox
            setInvitedUsers((prev) => [...prev, selectedUserID]);

            await addInbox(
                selectedUserID,
                updateInviteNeeded.senderInfo.senderRole,
                updateInviteNeeded.senderInfo.senderName,
                "You are being invited to an event!",
                `You have been invited to event ${updateInviteNeeded.specificEventInfo.event_name}`,
                updateInviteNeeded.specificEventInfo.eventSpecificEndUrl
            );
        
            // Show toast
            toast({
                title: 'Invite Sent',
                description: 'Invite sent successfully',
                status: 'success',
                duration: 2000,
                isClosable: true,
            });
        } catch (error) {
            toast({
                title: 'Error',
                description: error.message,
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setLoadingUserId(null); // Reset loading state
        }
    }, [eventURL, sendInviteEventReq, addInbox, toast]);

    return (
        <Box position={"relative"} maxW={{ base: "100%", sm: "90%", md: "80%", lg: "50%" }} minW={"100%"} zIndex={0} overflow={"hidden"}>
            {isOpen && isLargerScreen && (
                <>    
                <Box overflow={"hidden"} >
                    <Portal>
                        <MotionImage
                            as="img"
                            src={invitation}
                            alt="Invitation"
                            position="absolute"
                            top={0}
                            width="10%"
                            left="10%"
                            zIndex={2000}
                            initial={{ x: -60, y:-600 }}
                            animate={{ x: -60, y: 400 }}
                            transition={{ duration: 1.2 }}
                        />
                    </Portal>
                </Box>
                <Box overflow={"hidden"} >
                    <Portal>
                        <MotionImage
                            as="img"
                            src={invitation2}
                            alt="Invitation2"
                            position="absolute"
                            top={0}
                            width="10%"
                            right="10%"
                            zIndex={2000}
                            initial={{ x: -40, y: -600}}
                            animate={{ x: -40, y: 100}}
                            transition={{ duration: 1.2 }}
                        />
                    </Portal>
                </Box>
                <Box overflow={"hidden"} >
                    <Portal>
                        <MotionImage
                            as="img"
                            src={invitation3}
                            alt="Invitation3"
                            position="absolute"
                            top={0}
                            width="10%"
                            right="10%"
                            zIndex={2000}
                            initial={{ x: 60, y: -600}}
                            animate={{ x: 60, y: 400}}
                            transition={{ duration: 1.2 }}
                        />
                    </Portal>
                </Box>
                </>       
            )}
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent maxW="50%" maxH="90vh" overflowY="auto" border={"2px solid black"} bg="linear-gradient(to top left, #ffecd2, #fcb69f)">
                    <ModalHeader>Invite Attendees</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Box height="400px" overflowY="auto" borderRadius="xl">
                            {isFinding ? (
                                <Flex
                                    width="100%"
                                    height="100%"
                                    alignItems="center"
                                    justifyContent="center"
                                    direction="column"
                                >
                                    <LoadingSpinner />
                                    <Text fontSize="lg" fontWeight="bold" mt={4}>
                                        Fetching attendees...
                                    </Text>
                                </Flex>
                            ) : (
                                <VStack spacing={2} align="stretch">
                                    {attendeesList?.length > 0 ? (
                                        attendeesList.map((invite) => {
                                            const isInvited = invitedUsers.includes(invite._id);

                                            return (
                                                <Flex
                                                    key={invite._id}
                                                    p={4}
                                                    bg="purple.100"
                                                    borderRadius="md"
                                                    textAlign="left"
                                                    alignItems="center"
                                                    _hover={{ bg: 'purple.200' }}
                                                >
                                                    <Box flex={4} minW="0">
                                                        <Text
                                                            fontSize="md"
                                                            fontWeight="bold"
                                                            isTruncated
                                                        >
                                                            Username: {invite.name}
                                                        </Text>
                                                        <Text
                                                            fontSize="md"
                                                            fontWeight="bold"
                                                            isTruncated
                                                        >
                                                            Email: {invite.email}
                                                        </Text>
                                                    </Box>

                                                    <Box flex={1} display="flex" justifyContent="center">
                                                        {isInvited ? (
                                                            <Button colorScheme="gray" isDisabled>
                                                                Invited
                                                            </Button>
                                                        ) : (
                                                            <Button
                                                                colorScheme="green"
                                                                onClick={() => handleInvite(invite._id)}
                                                                isLoading={loadingUserId === invite._id}
                                                                loadingText="Inviting..."
                                                            >
                                                                Invite
                                                            </Button>
                                                        )}
                                                    </Box>
                                                </Flex>
                                            );
                                        })
                                    ) : (
                                        <Text fontSize="lg" fontWeight="bold">
                                            No attendees found
                                        </Text>
                                    )}
                                </VStack>
                            )}
                        </Box>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </Box>
    );
};

export default InviteAttendeesForm;
