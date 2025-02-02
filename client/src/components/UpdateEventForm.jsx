import React, { useEffect, useRef, useState } from 'react';
import { 
    Modal,
    ModalBody,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalCloseButton,
    AlertDialog,
    AlertDialogBody, 
    AlertDialogContent, 
    AlertDialogFooter, 
    AlertDialogHeader, 
    AlertDialogOverlay, 
    Box, 
    Button, 
    useToast,
    FormControl, 
    FormLabel, 
    Input, 
    Text,
    Textarea, 
    FormErrorMessage
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { useEventStore } from '../store/eventStore';

const UpdateEventForm = ({isOpen, onClose, eventURL, eventsNowInfo}) => {
    const [newEventName, setNewEventName] = useState(eventsNowInfo.event_name);
    const [newEventDescription, setNewEventDescription] = useState(eventsNowInfo.event_description);
    const [newEventStartDate, setNewEventStartDate] = useState(new Date(eventsNowInfo.start_date));
    const [newEventEndDate, setNewEventEndDate] = useState(new Date(eventsNowInfo.end_date));
    const [newEventImage, setNewEventImage] = useState(eventsNowInfo.event_thumbnail);

    const [updateEventErrors, setUpdateEventErrors] = useState([]);
    const [hasSubmitted, setHasSubmitted] = useState(false);

    // Alert dialog state
    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const cancelRef = useRef();

    const { updateEvent, isLoading } = useEventStore();

    const toast = useToast();
    const navigate = useNavigate();
    const maxCharacters = 250;

    const handleUpdateDescriptionChange = (e) => {
        const description = e.target.value; 
        if (description.length <= maxCharacters) {
            setNewEventDescription(description);
        }
    };    

    const validateFields = () => {
        const errorHandling = {};

        if ((newEventStartDate && !newEventEndDate) || (!newEventStartDate && newEventEndDate)) {
            errorHandling.newEventStartDate = "Please enter both start and end dates for the event.";
        }

        if (!newEventName && !newEventDescription && !newEventStartDate && !newEventEndDate && !newEventImage) {
            errorHandling.noInputValue = "Empty input is not allowed";
        }

        // Show error if all useState fields remains the same/ did not make changes
        if ((newEventName === eventsNowInfo.event_name) && (newEventDescription === eventsNowInfo.event_description) && (newEventStartDate.getTime() === new Date(eventsNowInfo.start_date).getTime()) && (newEventEndDate.getTime() === new Date(eventsNowInfo.end_date).getTime()) && (newEventImage === eventsNowInfo.event_thumbnail)) {
            errorHandling.noChangesMade = "Please make any changes to update the event";
        }

        setUpdateEventErrors(errorHandling);
        console.log("Something is happening right here");
        console.log("Error handling:", errorHandling);
        return errorHandling;
    }

    const handleUpdateImageUpload = (e) => {
        const file = e.target.files[0];
        setNewEventImage(file);

        if (!file) {
            return;
        }

        const validImageTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
        if (!validImageTypes.includes(file.type)) {
            toast({
              position: "bottom",
              title: "Invalid image type",
              description: "Please upload a JPEG, PNG, GIF, or WebP image.",
              status: "error",
              duration: 5000,
              isClosable: true,
            });
            return;
        }

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const base64Image = reader.result;
            setNewEventImage(base64Image);
            console.log("Base64 image:", base64Image);
        };
        toast({
            position: "bottom",
            title: "Event picture uploaded successfully",
            description: "Your new event picture has been uploaded.",
            status: "success",
            duration: 5000,
            isClosable: true,
        });
    };

    const handleUpdateEvent = async (e) => {
        e.preventDefault();
        setIsAlertOpen(false);

        setHasSubmitted(true);
        const errors = validateFields();

        if (Object.keys(errors).length > 0) {
            return;
        }

        try {
            await updateEvent(newEventName, newEventDescription, newEventStartDate, newEventEndDate, newEventImage, eventURL);
            toast({
                position: "bottom",
                title: "Update Event successful",
                description: "Your event has been updated successful, updating event info...",
                status: "success",
                duration: 5000,
                isClosable: true,
            });

            onClose();

            navigate("/events");
        } catch (updateErrors) {
            const messages = updateErrors.response?.data?.messages || ["An unexpected error occurred"];

            messages.forEach((message) => {
                toast({
                    position: "bottom",
                    title: "Update Event failed",
                    description: message,
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                });
            });

            resetForm();
        }
    }

    const resetForm = () => {
        setNewEventName(eventsNowInfo.event_name);
        setNewEventDescription(eventsNowInfo.event_description);
        setNewEventStartDate(new Date(eventsNowInfo.start_date));
        setNewEventEndDate(new Date(eventsNowInfo.end_date));
        setNewEventImage(eventsNowInfo.event_thumbnail);
        setUpdateEventErrors([]);
        setHasSubmitted(false);
    };

    useEffect(() => {
        if (hasSubmitted) {
            validateFields();
        }
    }, [newEventStartDate, newEventEndDate, hasSubmitted]);

    return (
        <Modal isOpen={isOpen} onClose={() => { resetForm(); onClose(); }} isCentered>
            <ModalOverlay />
            <ModalContent
                maxW={{ base: "100%", sm: "90%", md: "80%", lg: "50%" }}
                maxH="90vh"
                overflowY="auto"
                overflowX="auto"
                bg="linear-gradient(to top left, #ffecd2, #fcb69f)"
                border={"2px solid black"}
            >
                <ModalHeader>Update Event</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Box as="form" onSubmit={(e) => { e.preventDefault() }}>
                        <FormControl mb="4">
                            <FormLabel>New Event Name</FormLabel>
                            <Input 
                                type="text"
                                placeholder="Enter Event Name here"
                                value={newEventName}
                                onChange={(e) => setNewEventName(e.target.value)}
                                borderColor={"black.500"}
                            />
                        </FormControl>

                        <FormControl mb="4">
                        <FormLabel>New Event Description</FormLabel>
                        <Textarea
                            type="text"
                            placeholder="Enter Event Description here"
                            value={newEventDescription}
                            onChange={handleUpdateDescriptionChange}
                            height={"160px"}
                            resize={"vertical"}
                            borderColor={"black.500"}
                        />
                        <Text
                            mt="2"
                            color={newEventDescription.length === maxCharacters ? "red.500" : "gray.500"}
                        >
                            Words: {newEventDescription.length} / {maxCharacters}
                        </Text>
                        </FormControl>

                        <Box display={"flex"} justifyContent={"space-between"}>
                            <FormControl isInvalid={!!updateEventErrors.newEventStartDate} mb="4">
                                <FormLabel>Start Date</FormLabel>
                                <Box display={"flex"} border={"1px solid black"} borderRadius={"sm"}
                                    sx={{
                                        '.react-datepicker__input-container input': {
                                            backgroundColor: 'transparent'
                                        }
                                    }}
                                >
                                    <DatePicker
                                        selected={newEventStartDate}
                                        onChange={(date) => setNewEventStartDate(date)}
                                        showTimeSelect
                                        dateFormat="Pp"
                                        placeholderText="Select Start Date here"
                                        className="chakra-input"
                                        popperPlacement="top-end"
                                        withPortal
                                    />
                                </Box>
                                {updateEventErrors.newEventStartDate && <FormErrorMessage>{updateEventErrors.newEventStartDate}</FormErrorMessage>}
                            </FormControl>

                            <FormControl mb="4">
                                <FormLabel ml={"8px"}>End Date</FormLabel>
                                <Box display={"flex"} border={"1px solid black"} borderRadius={"sm"} ml={"8px"}
                                    sx={{
                                        '.react-datepicker__input-container input': {
                                            backgroundColor: 'transparent'
                                        }
                                    }}                                
                                >
                                    <DatePicker
                                        selected={newEventEndDate}
                                        onChange={(date) => setNewEventEndDate(date)}
                                        showTimeSelect
                                        dateFormat="Pp"
                                        placeholderText="Select End Date here"
                                        className="chakra-input"
                                        withPortal
                                    />
                                </Box>
                            </FormControl>
                        </Box>

                        <FormControl mb="4">
                            <Box display={"flex"}>
                                <Text mt={"4"} fontWeight={"bold"} mr={"4"}>
                                    Event Image
                                </Text>
                                <Button
                                    as={"label"}
                                    htmlFor='eventImage-upload'
                                    mt={2} // Adds margin top to create space below the text
                                    colorScheme="green"
                                    size="md"
                                >
                                    Upload Event Image
                                </Button>
                                <Input
                                    type="file"
                                    id="eventImage-upload"
                                    accept="image/*"
                                    onChange={handleUpdateImageUpload}
                                    display={"none"}
                                />
                            </Box>
                        </FormControl>

                        {updateEventErrors.noChangesMade && (
                            <Text color="red.500" mb="4">
                                {updateEventErrors.noChangesMade}
                            </Text>
                        )}

                        {updateEventErrors.noInputValue && (
                            <Text color="red.500" mb="4">
                                {updateEventErrors.noInputValue}
                            </Text>
                        )}
                    </Box>
                </ModalBody>

                <ModalFooter>
                    <Button
                        colorScheme='orange'
                        onClick={() => setIsAlertOpen(true)}
                        isLoading={isLoading}
                        loadingText="Updating Event..."
                    >
                        Update
                    </Button>
                </ModalFooter>

                {/* Alert Dialog for Confirmation */}
                <AlertDialog
                isOpen={isAlertOpen}
                leastDestructiveRef={cancelRef}
                onClose={() => setIsAlertOpen(false)}
                >
                    <AlertDialogOverlay>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                Confirm Update Event
                            </AlertDialogHeader>

                            <AlertDialogBody>
                                Are you sure you want to update this event info?
                            </AlertDialogBody>

                            <AlertDialogFooter>
                                <Button ref={cancelRef} onClick={() => setIsAlertOpen(false)}>
                                    Cancel
                                </Button>
                                <Button colorScheme='orange' onClick={handleUpdateEvent} ml={3}>
                                    Confirm
                                </Button>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialogOverlay>
                </AlertDialog>
            </ModalContent>
        </Modal>
    )
};

export default UpdateEventForm;