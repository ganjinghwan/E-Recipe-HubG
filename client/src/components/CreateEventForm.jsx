import React, { useEffect, useState } from 'react';
import { 
    Box,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Input,
    Modal, 
    ModalBody, 
    ModalCloseButton, 
    ModalContent, 
    ModalHeader, 
    ModalOverlay, 
    Textarea, 
    useToast,
    Text,
    Button,
    ModalFooter
} from '@chakra-ui/react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { useEventStore } from '../store/eventStore';


const CreateEventForm = ({isOpen, onClose}) => {
    const [eventName, setEventName] = useState("");
    const [eventDescription, setEventDescription] = useState("");
    const [eventStartDate, setEventStartDate] = useState("");
    const [eventEndDate, setEventEndDate] = useState("");
    const [eventImage, setEventImage] = useState("");

    const [createEventErrors, setCreateEventErrors] = useState({});
    const [hasSubmitted, setHasSubmitted] = useState(false);

    const toast = useToast();
    const { createNewEvent, isLoading } = useEventStore();
    const maxCharacters = 250;

    const handleDescriptionChange = (e) => {
        const description = e.target.value; 
        if (description.length <= maxCharacters) {
            setEventDescription(description);
        }
    };

    const validateFields = () => {
        const errorHandling = {};

        if (!eventName) {
            errorHandling.eventName = "Event name is required";
        }

        if (!eventDescription) {
            errorHandling.eventDescription = "Event description is required";
        }

        if (!eventStartDate) {
            errorHandling.eventStartDate = "Event start date is required";
        }

        if (!eventEndDate) {
            errorHandling.eventEndDate = "Event end date is required";
        }

        if (!eventImage) {
            errorHandling.eventImage = "Event image is required";
        }

        setCreateEventErrors(errorHandling);
        return errorHandling;
    };

    const handleEventImageUpload = (e) => {
        const file = e.target.files[0];
        setEventImage(file);
        
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
            setEventImage(base64Image);
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

    const handleCreateEventSubmit = async (e) => {
        e.preventDefault();
        setHasSubmitted(true);
        const errors = validateFields();
        
        if (Object.keys(errors).length > 0) {
            return;
        }

        try {
            await createNewEvent(eventName, eventDescription, eventStartDate, eventEndDate, eventImage);
            toast({
                position: "bottom",
                title: "Event created successfully",
                description: "Your event has been created. Updating the list...",
                status: "success",
                duration: 5000,
                isClosable: true,
            });
            // Refresh page
            window.location.reload();
            
            onClose();
        } catch (createErrors) {
            const messages = createErrors.response?.data?.messages || ["An unexpected error occurred"];

            messages.forEach((message) => {
                toast({
                    position: "bottom",
                    title: "Create Event failed",
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
        setEventName("");
        setEventDescription("");
        setEventStartDate("");
        setEventEndDate("");
        setEventImage("");
        setCreateEventErrors({});
        setHasSubmitted(false);
    }

    useEffect(() => {
        if (hasSubmitted) {
            validateFields();
        }
    }, [eventName, eventDescription, eventStartDate, eventEndDate, eventImage, hasSubmitted]);
    
    return (
        <Modal isOpen={isOpen} onClose={() => { clearForm(); onClose(); }} isCentered>
            <ModalOverlay />
            <ModalContent
                maxW={{ base: "100%", sm: "90%", md: "80%", lg: "50%" }}
                maxH="90vh"
                overflowY="auto"
                overflowX="auto"
            >
                <ModalHeader>Create Event</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Box as="form" onSubmit={(e) => { e.preventDefault() }}>
                        <FormControl isInvalid={!!createEventErrors.eventName} mb="4">
                            <FormLabel>Event Name</FormLabel>
                            <Input 
                                type="text"
                                placeholder="Enter Event Name here"
                                value={eventName}
                                onChange={(e) => setEventName(e.target.value)}
                                borderColor={"black.500"}
                            />
                            {createEventErrors.eventName && <FormErrorMessage>{createEventErrors.eventName}</FormErrorMessage>}
                        </FormControl>

                        <FormControl isInvalid={!!createEventErrors.eventDescription} mb="4">
                        <FormLabel>Event Description</FormLabel>
                        <Textarea
                            type="text"
                            placeholder="Enter Event Description here"
                            value={eventDescription}
                            onChange={handleDescriptionChange}
                            height={"160px"}
                            resize={"vertical"}
                            borderColor={"black.500"}
                        />
                        <Text
                            mt="2"
                            color={eventDescription.length === maxCharacters ? "red.500" : "gray.500"}
                        >
                            Words: {eventDescription.length} / {maxCharacters}
                        </Text>
                        {createEventErrors.eventDescription && <FormErrorMessage>{createEventErrors.eventDescription}</FormErrorMessage>}
                        </FormControl>

                        <Box display={"flex"} justifyContent={"space-between"}>
                            <FormControl isInvalid={!!createEventErrors.eventStartDate} mb="4">
                                <FormLabel>Start Date</FormLabel>
                                <Box display={"flex"} border={"1px solid black"} borderRadius={"sm"}>
                                    <DatePicker
                                        selected={eventStartDate}
                                        onChange={(date) => setEventStartDate(date)}
                                        showTimeSelect
                                        dateFormat="Pp"
                                        placeholderText="Select Start Date here"
                                        className="chakra-input"
                                        popperPlacement="top-end"
                                        withPortal
                                    />
                                </Box>
                                {createEventErrors.eventStartDate && <FormErrorMessage>{createEventErrors.eventStartDate}</FormErrorMessage>}
                            </FormControl>

                            <FormControl isInvalid={!!createEventErrors.eventEndDate} mb="4">
                                <FormLabel ml={"8px"}>End Date</FormLabel>
                                <Box display={"flex"} border={"1px solid black"} borderRadius={"sm"} ml={"8px"}>
                                    <DatePicker
                                        selected={eventEndDate}
                                        onChange={(date) => setEventEndDate(date)}
                                        showTimeSelect
                                        dateFormat="Pp"
                                        placeholderText="Select End Date here"
                                        className="chakra-input"
                                        withPortal
                                    />
                                </Box>
                                {createEventErrors.eventEndDate && <FormErrorMessage ml={"8px"}>{createEventErrors.eventEndDate}</FormErrorMessage>}
                            </FormControl>
                        </Box>

                        <FormControl isInvalid={!!createEventErrors.eventImage} mb="4">
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
                                    onChange={handleEventImageUpload}
                                    display={"none"}
                                />
                            </Box>
                            {createEventErrors.eventImage && <FormErrorMessage>{createEventErrors.eventImage}</FormErrorMessage>}
                        </FormControl>
                    </Box>
                </ModalBody>
                
                <ModalFooter>
                    <Button
                        colorScheme='orange'
                        onClick={handleCreateEventSubmit}
                        isLoading={isLoading}
                        loadingText="Creating Event..."
                    >
                        Create Event
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
};

export default CreateEventForm;
