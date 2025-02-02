import React, { useRef, useState } from "react";
import { 
    Box, 
    Button, 
    Modal, 
    ModalOverlay, 
    ModalContent, 
    ModalHeader, 
    ModalCloseButton, 
    ModalBody, 
    ModalFooter,
    useToast, 
    Text,
    FormControl,
    FormLabel,
    Input,
    Textarea,
    AlertDialog,
    AlertDialogOverlay,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogBody,
    AlertDialogFooter,
} from "@chakra-ui/react";
import { useAuthStore } from "../store/authStore";
import { useCookStore } from "../store/cookStore";
import { useEventOrgStore } from "../store/eventOrgStore";

const UpdateRoleForm = ({ isOpen, onClose, switchToProfile }) => {
    // Cook state
    const [cookSpecialty, setCookSpecialty] = useState("");
    const [cookExperience, setCookExperience] = useState("");

    // Event Organizer state
    const [eventOrganizerName, setEventOrganizerName] = useState("");
    const [eventOrganizerDescription, setEventOrganizerDescription] = useState("");
    const [eventOrganizerContact, setEventOrganizerContact] = useState("");
    const [eventOrganizerLocation, setEventOrganizerLocation] = useState("");

    // Alert dialog state
    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const cancelRef = useRef();

    const [hasSubmitted, setHasSubmitted] = useState(false);
    const toast = useToast();
    const { user } = useAuthStore();
    const { updateCookInfo, cookLoading: isLoading } = useCookStore();
    const { updateEventOrganizerInfo, eventOrgLoading: isLoadingEventOrg } = useEventOrgStore();
    const maxCharacters = 250;

    if (!user) {
        return null;
    }

    const handleDescriptionChange = (e) => {
        const input = e.target.value;
        if (input.length <= maxCharacters) {
            setEventOrganizerDescription(input);
        } else {
            return;
        }
    };

    const handleUpdateRoleSubmit = async () => {
      setIsAlertOpen(false);

      setHasSubmitted(true);

      if (user.role === "cook") {
        try {
          await updateCookInfo(cookSpecialty, cookExperience);
          toast({
            position: "bottom",
            title: "Update role successful",
            description: "Your role has been updated successfully",
            status: "success",
            duration: 5000,
            isClosable: true,
          });
          switchToProfile();
        } catch (updateCookError) {
          const warning = updateCookError.response?.data?.messages || ["An unexpected error occurred"];

          warning.forEach((warning) => {
            toast({
              position: "bottom",
              title: "Update Cook failed",
              description: warning,
              status: "error",
              duration: 5000,
              isClosable: true,
            });

            clearForm();
          });
        }
      } else if (user.role === "event-organizer") {
        try {
          await updateEventOrganizerInfo(eventOrganizerName, eventOrganizerDescription, eventOrganizerContact, eventOrganizerLocation);
          toast({
            position: "bottom",
            title: "Update role successful",
            description: "Your role has been updated successfully",
            status: "success",
            duration: 5000,
            isClosable: true,
          });
          switchToProfile();
        } catch (updateEventOrgError) {
          const warning = updateEventOrgError.response?.data?.messages || ["An unexpected error occurred"];

          warning.forEach((warning) => {
            toast({
              position: "bottom",
              title: "Update Event Organizer failed",
              description: warning,
              status: "error",
              duration: 5000,
              isClosable: true,
            });

            clearForm();
          });
        }
      }
    }

    const clearForm = () => {
      if (user.role === "cook") {
        setCookSpecialty("");
        setCookExperience("");
      } else if (user.role === "event-organizer") {
        setEventOrganizerName("");
        setEventOrganizerDescription("");
        setEventOrganizerContact("");
        setEventOrganizerLocation("");
      }
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent
            maxW={{ base: "100%", sm: "80%", md: "60%", lg: "50%" }}
            maxH="90vh"
            overflowY={"auto"}
            bg="linear-gradient(to top left, #ffecd2, #fcb69f)"
            border={"2px solid black"}
        >
            <ModalHeader>Update Role Information</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
                <Box as="form" onSubmit={(e) => { e.preventDefault(); setIsAlertOpen(true); }}>
                    {user && (user.role === "cook" || user.role === "event-organizer") && (
                        <>
                        <Text
                        mb="2"
                        fontSize={"lg"}
                        fontWeight={"bold"}
                        color={"red.700"}
                        textDecoration={"underline"}
                        >
                        Your role is {user.role}
                        </Text>

                        {user && user.role === "cook" && (
                            <>
                             <FormControl mb="4">
                                <FormLabel>Specialty</FormLabel>
                                <Input
                                  type="text"
                                  placeholder="Enter your new specialty here"
                                  value={cookSpecialty}
                                  onChange={(e) => setCookSpecialty(e.target.value)}
                                  borderColor={"black"}
                                />
                             </FormControl>

                             <FormControl mb="4">
                                <FormLabel>Experience</FormLabel>
                                <Input
                                  type="number"
                                  placeholder="Enter your years of experience here"
                                  value={cookExperience}
                                  onChange={(e) => setCookExperience(e.target.value)}
                                  onWheel={(e) => e.target.blur()} // Prevent scrolling from messing with numbers
                                  borderColor={"black"}
                                />
                             </FormControl>
                            </>
                        )}

                        {user && user.role === "event-organizer" && (
                            <>
                              <FormControl mb="4">
                                <FormLabel>Organization Name</FormLabel>
                                <Input
                                  type="text"
                                  placeholder="Enter your new organization name here"
                                  value={eventOrganizerName}
                                  onChange={(e) => setEventOrganizerName(e.target.value)}
                                  borderColor={"black"}
                                />
                              </FormControl>

                              <FormControl mb="4">
                                <FormLabel>Organization Description</FormLabel>
                                <Textarea 
                                  placeholder="Enter your new organization description here (maximum 250 characters)"
                                  value={eventOrganizerDescription}
                                  onChange={handleDescriptionChange}
                                  height={"180px"}
                                  maxH={"180px"}
                                  minH={"180px"}
                                  resize={"vertical"}
                                  borderColor={"black"}
                                />
                                  <Text mt="2" color={eventOrganizerDescription.length == maxCharacters ? "red.500" : "gray.500"}>
                                    {`Words: ${eventOrganizerDescription.length} / ${maxCharacters}`}
                                  </Text>
                              </FormControl>

                              <FormControl mb="4">
                                <FormLabel>Organization Contact</FormLabel>
                                <Input
                                  type="number"
                                  placeholder="Enter your new organization contact here"
                                  value={eventOrganizerContact}
                                  onChange={(e) => setEventOrganizerContact(e.target.value)}
                                  onWheel={(e) => e.target.blur()} // Prevent scrolling from messing with numbers
                                  borderColor={"black"}
                                />
                              </FormControl>

                              <FormControl mb="4">
                                <FormLabel>Organization Location</FormLabel>
                                <Textarea 
                                  placeholder="Enter your new organization location here"
                                  value={eventOrganizerLocation}
                                  onChange={(e) => setEventOrganizerLocation(e.target.value)}
                                  height={"70px"}
                                  maxH={"70px"}
                                  minH={"70px"}
                                  resize={"vertical"}
                                  borderColor={"black"}
                                />
                              </FormControl>
                            </>
                        )}
                        </>
                    )}
                </Box>
            </ModalBody>

            <ModalFooter>
              <Box display="flex" justifyContent="space-between" width="100%">
                <Button 
                  colorScheme="blue" 
                  onClick={() => setIsAlertOpen(true)}
                  isLoading={isLoading}
                  loadingText="Updating..."
                >
                  Update Role
                </Button>
                <Button colorScheme="red" onClick={switchToProfile}>
                  Cancel
                </Button>
              </Box>
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
                            Confirm Role Changes
                        </AlertDialogHeader>

                        <AlertDialogBody>
                            Are you sure you want to update your role information? Once updated, you can only update after 7 days.
                        </AlertDialogBody>

                        <AlertDialogFooter>
                            <Button ref={cancelRef} onClick={() => setIsAlertOpen(false)}>
                                Cancel
                            </Button>
                            <Button colorScheme="blue" ml={3} onClick={handleUpdateRoleSubmit}>
                                Confirm
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </ModalContent>
        </Modal>
    );
};

export default UpdateRoleForm;
