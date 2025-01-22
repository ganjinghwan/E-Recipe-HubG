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
    const [processedInvites, setProcessedInvites] = useState(new Set()); // Prevent sending multiple times
    const [isFinding, setIsFinding] = useState(false);

    const toast = useToast();

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
        if (inviteNeeded && loadingUserId && !processedInvites.has(loadingUserId)) {
            // Ensure we process only unprocessed invites
            const { senderInfo, specificEventInfo } = inviteNeeded;

            // Add to processed invites
            setProcessedInvites((prev) => new Set(prev).add(loadingUserId));

            // Mark as invited and send inbox
            setInvitedUsers((prev) => [...prev, loadingUserId]);
            addInbox(
                loadingUserId,
                senderInfo.senderName,
                senderInfo.senderRole,
                "You are being invited to an event!",
                `You have been invited to event ${specificEventInfo.event_name}`
            );

            // Show toast
            toast({
                title: 'Invite Sent',
                description: 'Invite sent successfully',
                status: 'success',
                duration: 2000,
                isClosable: true,
            });
        }
    }, [inviteNeeded, loadingUserId, addInbox, toast, processedInvites]);

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent maxW="50%" maxH="90vh" overflowY="auto">
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
    );
};

export default InviteAttendeesForm;
