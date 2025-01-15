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
    Button
} from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { useEventStore } from '../store/eventStore';
import LoadingSpinner from './LoadingSpinner';

const InviteAttendeesForm = ({isOpen, onClose, eventURL}) => {
    const { attendeesList, getInviteAttendeesList, isLoading } = useEventStore();

    useEffect(() => {
        getInviteAttendeesList(eventURL);
    }, [getInviteAttendeesList, eventURL]);

    console.log("Attendees List:", attendeesList);

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent
                maxW={{ base: "100%", sm: "90%", md: "80%", lg: "50%" }}
                maxH="90vh"
                overflowY="auto"
                overflowX="auto"
            >
                <ModalHeader>Invite Attendees</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Box
                        width={"100%"}
                        height={"400px"}
                        overflowY={"auto"}
                        borderRadius={"xl"}
                    >
                        {isLoading ? (
                            <>
                                <LoadingSpinner />
                                <Text fontSize="lg" fontWeight={"bold"} color={"#FFFFFF"} zIndex={1}>
                                    Fetching attendees...
                                </Text>
                            </>
                        ) : (
                            <>
                                <VStack spacing={2} align={"stretch"}>
                                    {attendeesList?.length > 0 ? (
                                        attendeesList.map((invite) => (
                                            <Flex
                                                key={invite?.invitableUser?._id}
                                                p={4}
                                                bg="red.200"
                                                borderRadius="md"
                                                height={"50px"}
                                                minW="90%"
                                                textAlign={"left"}
                                                alignItems={"center"}
                                                _hover={{ bg: "red.100" }}
                                            >
                                                <Box flex={4} minW={"0"}>
                                                    <Text fontSize= "md" fontWeight={"bold"} color={"#000000"} isTruncated>{invite.name}     {invite.email}</Text>
                                                </Box>

                                                <Box 
                                                    flex={1}
                                                    display={"absolute"}
                                                    justifyContent={"center"}
                                                    alignItems={"center"}
                                                    justifyItems={"center"} 
                                                >
                                                    <Button
                                                        display={"flex"}
                                                        colorScheme='green'
                                                    >
                                                        Invite
                                                    </Button>
                                                </Box>
                                            </Flex>
                                        ))
                                    ) : (
                                            <Text fontSize="lg" fontWeight={"bold"} color={"#FFFFFF"}>
                                                No attendees found
                                            </Text>
                                    )}
                                </VStack>
                            </>
                        )}
                    </Box>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default InviteAttendeesForm;
