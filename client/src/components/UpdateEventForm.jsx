/*import { Modal, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, useToast } from '@chakra-ui/react';
import React, { useState } from 'react';
import { 
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const UpdateEventForm = ({isOpen, onClose}) => {
    const [newEventName, setNewEventName] = useState("");
    const [newEventDescription, setNewEventDescription] = useState("");
    const [newEventStartDate, setNewEventStartDate] = useState("");
    const [newEventEndDate, setNewEventDate] = useState("");
    const [newEventImage, setNewEventImage] = useState("");

    const [updateEventErrors, setUpdateEventErrors] = useState([]);
    const [hasSubmitted, setHasSubmitted] = useState(false);

    const toast = useToast();
    const navigate = useNavigate();
    const maxCharacters = 250;

    const handleUpdateDescriptionChange = (e) => {
        const description = e.target.value; 
        if (description.length <= maxCharacters) {
            setNewEventDescription(description);
        }
    };    

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

    const clearForm = () => {
        setNewEventName("");
        setNewEventDescription("");
        setNewEventStartDate("");
        setNewEventDate("");
        setNewEventImage("");
        setUpdateEventErrors([]);
        setHasSubmitted(false);
    };

    return (
        <Modal isOpen={isOpen} onClose={() => { clearForm(); onClose(); }} isCentered>
            <ModalOverlay />
            <ModalContent
                maxW={{ base: "100%", sm: "90%", md: "80%", lg: "50%" }}
                maxH="90vh"
                overflowY="auto"
                overflowX="auto"
            >
                <ModalHeader>Update Event</ModalHeader>
                <ModalCloseButton />
            </ModalContent>
        </Modal>
    )
};*/