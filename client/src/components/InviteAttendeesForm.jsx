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
} from '@chakra-ui/react';
import { useAuthStore } from '../store/authStore';
import { useEventStore } from '../store/eventStore';
import LoadingSpinner from './LoadingSpinner';

const InviteAttendeesForm = ({ isOpen, onClose, eventURL }) => {
    const { attendeesList, getInviteAttendeesList, sendInviteEventReq, inviteNeeded } = useEventStore();
    const { addInbox } = useAuthStore();
    const [loadingUserId, setLoadingUserId] = useState(null); // Track user being invited
    const [invitedUsers, setInvitedUsers] = useState([]); // Track successfully invited users
    const [isFinding, setIsFinding] = useState(false);

    const toast = useToast();

    useEffect(() => {
        setIsFinding(true);
        const timer = setTimeout(() => {
            setIsFinding(false);
        }, 4000);

        getInviteAttendeesList(eventURL);
        console.log("Attendees list:", attendeesList);

        return () => clearTimeout(timer);
    }, [getInviteAttendeesList, eventURL]);

    // useCallback = make sure this function is only created once and not recreated every single render
    const handleInvite = useCallback(async (selectedUserID) => {
        setLoadingUserId(selectedUserID); // Set loading state
        try {
            console.log("Inviting user:", selectedUserID);
            await sendInviteEventReq(eventURL, selectedUserID);

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
    }, [eventURL, sendInviteEventReq, toast]);
    
    
    useEffect(() => {
        if (inviteNeeded && loadingUserId) {
            console.log("Invite sent successfully:", inviteNeeded);
            console.log("loadingUserId", loadingUserId);
            console.log("sender name", inviteNeeded.senderInfo.senderName);
            console.log("sender role", inviteNeeded.senderInfo.senderRole);
            console.log("Inbox event name title", inviteNeeded.specificEventInfo.event_name);
            setInvitedUsers((prev) => [...prev, loadingUserId]); // Mark as invited
            addInbox(loadingUserId, inviteNeeded.senderInfo.senderName, inviteNeeded.senderInfo.senderRole, "You are being invited to an event!", `You have been invited to event ${inviteNeeded.specificEventInfo.event_name}`);
            toast({
                title: 'Invite Sent',
                description: 'Invite sent successfully',
                status: 'success',
                duration: 2000,
                isClosable: true,
            });
        }
    }, [inviteNeeded, loadingUserId, toast, addInbox]);

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent
                maxW={{ base: '100%', sm: '90%', md: '80%', lg: '50%' }}
                maxH="90vh"
                overflowY="auto"
                overflowX="auto"
            >
                <ModalHeader>Invite Attendees</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Box
                        width="100%"
                        height="400px"
                        overflowY="auto"
                        borderRadius="xl"
                    >
                        {isFinding ? (
                            <>
                                <Flex
                                    width="100%"
                                    height="100%"
                                    alignItems="center"
                                    justifyContent="center"
                                    direction="column"
                                >
                                    <LoadingSpinner />
                                    <Text fontSize="lg" fontWeight="bold" color="black" zIndex={1} mt={4}>
                                        Fetching attendees...
                                    </Text>
                                </Flex>
                            </>
                        ) : (
                            <VStack spacing={2} align="stretch">
                                {attendeesList?.length > 0 ? (
                                    attendeesList.map((invite) => {
                                        const isInvited = invitedUsers.includes(invite._id);

                                        return (
                                            <Flex
                                                key={ invite._id }
                                                p={4}
                                                bg="purple.100"
                                                borderRadius="md"
                                                height="80px"
                                                minW="90%"
                                                textAlign="left"
                                                alignItems="center"
                                                _hover={{ bg: 'purple.200' }}
                                            >
                                                <Box flex={4} minW="0">
                                                    <Text
                                                        fontSize="md"
                                                        fontWeight="bold"
                                                        color="#000000"
                                                        isTruncated
                                                    >
                                                        Username: {invite.name}
                                                    </Text>

                                                    <Text
                                                        fontSize="md"
                                                        fontWeight={'bold'}
                                                        color={'#000000'}
                                                        isTruncated
                                                    >
                                                        Email: {invite.email}
                                                    </Text>
                                                </Box>

                                                <Box
                                                    flex={1}
                                                    display="flex"
                                                    justifyContent="center"
                                                    alignItems="center"
                                                >
                                                    {isInvited ? (
                                                        <Button
                                                            colorScheme="gray"
                                                            isDisabled
                                                        >
                                                            Invited
                                                        </Button>
                                                    ) : (
                                                        <Button
                                                            colorScheme="green"
                                                            onClick={() => handleInvite(invite._id)}
                                                            isLoading={loadingUserId === invite._id}
                                                            loadingText="Inviting..."
                                                            isDisabled={loadingUserId === invite._id} // Disable if loading
                                                        >
                                                            Invite
                                                        </Button>
                                                    )}
                                                </Box>
                                            </Flex>
                                        );
                                    })
                                ) : (
                                    <Text fontSize="lg" fontWeight="bold" color="black">
                                        No attendees found
                                    </Text>
                                )}
                            </VStack>
                        )}
                    </Box>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default InviteAttendeesForm;
