import React, { useEffect, useState, useRef } from "react";
import { 
    Box, 
    Text,
    FormControl, 
    FormErrorMessage, 
    FormLabel, 
    Input, 
    Button,
    Modal, 
    ModalBody, 
    ModalCloseButton, 
    ModalOverlay, 
    ModalContent, 
    ModalHeader, 
    ModalFooter,
    useToast,
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay 
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import PasswordStrengthMeter from "./PasswordStrengthMeter";

const UpdateProfileForm = ({isOpen, onClose, switchToProfile}) => {
    const [newName, setNewName] = useState("");
    const [newPhoneNumber, setNewPhoneNumber] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [newConfirmPassword, setNewConfirmPassword] = useState("");
    const [updateError, setUpdateError] = useState({});
    const [hasSubmitted, setHasSubmitted] = useState(false);
    
    // Alert dialog state
    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const cancelRef = useRef();

    const navigate = useNavigate();
    const toast = useToast();
    const { updateProfile } = useAuthStore();

    const validateFields = () => {
        const errorHandling = {};

        if (newPassword && newPassword !== newConfirmPassword) {
            errorHandling.newConfirmPassword = "Passwords do not match";
        }
        if (newConfirmPassword && !newPassword) {
            errorHandling.newPassword = "Please type both password and confirm password to change password";
        }

        setUpdateError(errorHandling);
        return errorHandling;
    };

    const handleUpdateProfileSubmit = async () => {
        setIsAlertOpen(false);

        setHasSubmitted(true);

        const errors = validateFields();

        if (Object.keys(errors).length > 0) {
            return;
        }

        try {
            await updateProfile(newName, newPassword, newPhoneNumber);
            toast({
                position: "bottom",
                title: "Update has been sent",
                description: "Please check your email for update confirmation.",
                status: "success",
                duration: 6000,
                isClosable: true,
            });
            navigate("/verify-update");
            onClose();
        } catch (updateProfileError) {
            const warning = updateProfileError.response?.data?.messages || ["An unexpected error occurred"];

            warning.forEach((warning)=> {
                toast({
                    position: "bottom",
                    title: "Update failed",
                    description: warning,
                    status: "error",
                    duration: 6000,
                    isClosable: true,
                });
            });

            clearForm();
        }
    };

    const handleSwitchToProfile = () => {
        clearForm();
        if (switchToProfile) {
            switchToProfile();
        }
    };

    const clearForm = () => {
        setNewName("");
        setNewPhoneNumber("");
        setNewPassword("");
        setNewConfirmPassword("");
        setUpdateError({});
        setHasSubmitted(false);
    };

    useEffect(() => {
        if (hasSubmitted) {
            validateFields();
        }
    }, [newName, newPhoneNumber, newPassword, newConfirmPassword, hasSubmitted]);

    return (
        <Modal isOpen={isOpen} onClose={onClose} isCentered>
          <ModalOverlay />
          <ModalContent
            maxW={{ base: "100%", sm: "80%", md: "60%", lg: "50%" }}
            maxH="90vh"
            overflowY="auto"
          >
            <ModalHeader>Update Profile</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Box as="form" onSubmit={(e) => { e.preventDefault(); setIsAlertOpen(true); }}>
                <Text
                  fontSize="md"
                  fontWeight="bold"
                  textAlign="center"
                >
                  You can update your profile here. Please fill in the desired fields that you want to update.
                </Text>
      
                <FormControl mb="4">
                  <FormLabel>New Username</FormLabel>
                  <Input
                    type="text"
                    placeholder="Please enter your new username"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                  />
                </FormControl>
      
                <FormControl mb="4">
                  <FormLabel>New Phone Number</FormLabel>
                  <Input
                    type="number"
                    placeholder="Please enter your new phone number"
                    value={newPhoneNumber}
                    onChange={(e) => setNewPhoneNumber(e.target.value)}
                    onWheel={(e) => e.target.blur()} //Prevent scrolling
                  />
                </FormControl>
      
                <FormControl isInvalid={!!updateError.newPassword} mb="4">
                  <FormLabel>New Password</FormLabel>
                  <Input
                    type="password"
                    placeholder="Please enter your new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  {updateError.newPassword && (
                    <FormErrorMessage>{updateError.newPassword}</FormErrorMessage>
                  )}
                </FormControl>
      
                <PasswordStrengthMeter password={newPassword} />
      
                <FormControl isInvalid={!!updateError.newConfirmPassword} mb="4">
                  <FormLabel>Confirm New Password</FormLabel>
                  <Input
                    type="password"
                    placeholder="Please confirm your new password"
                    value={newConfirmPassword}
                    onChange={(e) => setNewConfirmPassword(e.target.value)}
                  />
                  {updateError.newConfirmPassword && (
                    <FormErrorMessage>{updateError.newConfirmPassword}</FormErrorMessage>
                  )}
                </FormControl>
              </Box>
            </ModalBody>
      
            <ModalFooter>
              <Box display="flex" justifyContent="space-between" width="100%">
                <Button colorScheme="blue" onClick={() => setIsAlertOpen(true)}>
                  Update
                </Button>
                <Button colorScheme="red" onClick={handleSwitchToProfile}>
                  Back
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
                  <AlertDialogHeader fontSize="lg" fontWeight="bold">
                    Confirm Changes
                  </AlertDialogHeader>

                  <AlertDialogBody>
                    Are you sure you want to update your profile?
                  </AlertDialogBody>

                  <AlertDialogFooter>
                    <Button ref={cancelRef} onClick={() => setIsAlertOpen(false)}>
                      Cancel
                    </Button>
                    <Button colorScheme="blue" onClick={handleUpdateProfileSubmit} ml={3}>
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

export default UpdateProfileForm;
