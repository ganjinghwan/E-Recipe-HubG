import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Image,
  Flex,
  Input,
  useToast,
  Tooltip,
  useBreakpointValue,
  IconButton,
  Stack,
  Text,
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
import { formatDate } from "../utils/date";
import { keyframes } from "@emotion/react";

import defaultAvatar from "../pic/avatar.png";
import UpdateProfileForm from "./UpdateProfileForm";
import UpdateRoleForm from "./UpdateRoleForm";
import { FaTrash, FaEdit, FaPencilAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const ProfileForm = ({ isOpen, onClose }) => {
  const { user, isUploadingPicture, uploadProfilePicture, deleteAccount} = useAuthStore();
  const [selectedImg, setSelectedImg] = useState(null);
  const { cook, getCookInfo } = useCookStore();
  const { eventOrganizer, getEventOrganizerInfo } = useEventOrgStore();

  // Alert dialog state
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const cancelRef = useRef();
  const navigate = useNavigate();

  const [activeView, setActiveView] = useState("profile"); // Tracks current view

  const toast = useToast();
  const colorAnimation = keyframes`
    0% { background-color: #FFF8E1; }
    10% { background-color: #FFECB3; }
    20% { background-color: #FFE0B2; }
    30% { background-color: #FFCCBC; }
    40% { background-color: #F8BBD0; }
    50% { background-color: #E1BEE7; }
    60% { background-color: #D1C4E9; }
    70% { background-color: #BBDEFB; }
    80% { background-color: #B2EBF2; }
    90% { background-color: #C8E6C9; }
    100% { background-color: #FFF8E1; }
  `;
  const iconButtonSize = useBreakpointValue({ base: "sm", md: "md" });

  useEffect(() => {
    if (!isOpen) {
      setActiveView("profile");
    }
  }, [isOpen]);

  useEffect(() => {
    if (user?.role === "cook") {
      getCookInfo();
    }
  }, [user, cook, getCookInfo]);

  useEffect(() => {
    if (user?.role === "event-organizer") {
      getEventOrganizerInfo();
    }
  }, [user, eventOrganizer, getEventOrganizerInfo]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

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
    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      try {
        await uploadProfilePicture({ profilePicture: base64Image });
        toast({
          position: "bottom",
          title: "Profile picture uploaded successfully",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      } catch (error) {
        toast({
          position: "bottom",
          title: "Failed to upload profile picture",
          description: error.message,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    };
  };

  if (!user) {
    return null;
  }

  const handleDeleteAccount = async () => {
    setIsAlertOpen(false);

    try {
      await deleteAccount();
      toast({
        position: "bottom",
        title: "User deleted successfully",
        description: "Thank you for using E-Recipe-Hub. Hope to see you again soon!",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      navigate("/");
      onClose();
    } catch (error) {
      toast({
        position: "bottom",
        title: "Failed to delete user",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  }
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent
        maxW={{ base: "100%", sm: "80%", md: "60%", lg: "50%" }}
        maxH={"90vh"}
        overflowY={"auto"}
        css={{
          animation: `${colorAnimation} 25s linear infinite`,
          backgroundSize: "200% 200%",
        }}
      >
        {activeView === "updateProfile" && (
          <UpdateProfileForm
            isOpen={isOpen}
            onClose={onClose}
            switchToProfile={() => setActiveView("profile")}
          />
        )}

        {activeView === "updateRole" && (
          <UpdateRoleForm
            isOpen={isOpen}
            onClose={onClose}
            switchToProfile={() => setActiveView("profile")}
          />
        )}

        {activeView === "profile" && (
          <>
            <ModalHeader>Profile</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Flex
                direction={{ base: "column", md: "row" }}
                align={"center"}
                gap={4}
                textAlign={"left"}
              >
                {/* Profile Picture Section */}
                <Box textAlign="center">
                  <Image
                    borderRadius="full"
                    position={"relative"}
                    boxSize="220px"
                    src={user.profilePicture || selectedImg || defaultAvatar}
                    alt={`${user.name}'s profile picture`}
                    border="2px solid"
                    borderColor="black.200"
                    mb={4}
                    mx={"auto"}
                  />
                  <Box position="relative" display="inline-block">
                    <Button
                      as="label"
                      htmlFor="avatar-upload"
                      colorScheme="purple"
                      size="sm"
                      isDisabled={isUploadingPicture}
                    >
                      {isUploadingPicture ? "Uploading..." : "Upload Profile Picture"}
                    </Button>
                    <Input
                      type="file"
                      id="avatar-upload"
                      accept="image/*"
                      onChange={handleImageUpload}
                      display="none"
                      isDisabled={isUploadingPicture}
                    />
                  </Box>
                  
                  <Stack mt={4} direction={"row"} justify={"center"} spacing={4}>
                    <Tooltip label="Delete Account">
                      <IconButton
                        size={iconButtonSize}
                        icon={<FaTrash />}
                        aria-label="Delete Account"
                        colorScheme="red"
                        ml={3}
                        mr={3}
                        onClick={() => setIsAlertOpen(true)}
                      />
                    </Tooltip>

                    <Tooltip label="Update Profile">
                      <IconButton
                        size={iconButtonSize}
                        icon={<FaEdit />}
                        aria-label="Update Profile"
                        colorScheme="green"
                        onClick={() => setActiveView("updateProfile")}
                        mr={3}
                      />
                    </Tooltip>
                    
                    {user && (user.role === "cook" || user.role === "event-organizer") && (
                    <>
                      <Tooltip label="Update Role Information">
                        <IconButton
                          size={iconButtonSize}
                          icon={<FaPencilAlt />}
                          aria-label="Update Role Information"
                          colorScheme="blue"
                          mr={3}
                          onClick={() => setActiveView("updateRole")}
                        />
                      </Tooltip>
                    </> 
                    )}
                  </Stack>
                </Box>

                {/* User Details Section */}
                <Box flex="1">
                  <Box
                    bg="purple.100"
                    p="4"
                    borderRadius="md"
                    fontWeight="bold"
                    fontSize="xl"
                    textAlign="center"
                  >
                    Welcome, {user.name}
                  </Box>
                  <Box bg="blue.100" p="4" borderRadius="md" mt="4">
                    <span style={{ fontWeight: "bold" }}>Username: </span>
                    {user.name} 
                    <br />
                    <span style={{ fontWeight: "bold" }}>Email: </span>
                    {user.email} <br />
                    <span style={{ fontWeight: "bold" }}>Role: </span> 
                    {user.role} <br />
                    <div>
                    {user.phoneNumber ? (
                      <div>
                        <span style={{ fontWeight: "bold" }}>Phone Number:</span> {user.phoneNumber}
                      </div>
                    ) : (
                      <div>
                        <span style={{ fontWeight: "bold" }}>Looks like you don't have a phone number yet!</span>
                      </div>
                    )}
                    </div>
                  </Box>
                  <Box bg="green.100" p="4" borderRadius="md" mt="4">
                    <Text as="span" fontWeight="bold" textDecoration={"underline"}>
                      Account activity:
                    </Text>
                    <br />
                    <span style={{ fontWeight: "bold" }}>Joined at: </span>
                    {new Date(user.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                    <br />
                    <span style={{ fontWeight: "bold" }}>Last login: </span>
                    {formatDate(user.lastLogin)}
                  </Box>
                  <Box bg="yellow.100" p="4" borderRadius="md" mt="4" mb="4" overflow={"auto"} maxWidth={{base: "400px", md: "500px"}}>
                    <Text as="span" fontWeight="bold" textDecoration={"underline"}>
                      Role information:
                    </Text>
                    <br />
                    <span style={{ fontWeight: "bold" }}>Role: </span>
                    {user.role}
                    <br />
                    {user.role === "cook" && (
                      <>
                        <span style={{ fontWeight: "bold" }}>Cooking specialty: </span>
                        {cook?.specialty || "No specialty yet!"}
                        <br />
                        <span style={{ fontWeight: "bold" }}>Cooking experience: </span>
                        {cook?.experience
                          ? `${cook.experience} years`
                          : "No experience yet!"}
                      </>
                    )}
                    {user.role === "event-organizer" && (
                      <>
                        <span style={{ fontWeight: "bold" }}> Organization name: </span>
                        {eventOrganizer?.organizationName || "No organization name yet!"}
                        <br />
                        <span style={{ fontWeight: "bold" }}>Organization description: </span>
                        {eventOrganizer?.organizationDescription || "No description yet!"}
                        <br />
                        <span style={{ fontWeight: "bold" }}>Organization Contact: </span>
                        {eventOrganizer?.organizationContact || "No contact yet!"}
                        <br />
                        <span style={{ fontWeight: "bold" }}>Organization Address: </span>
                        {eventOrganizer?.organizationLocation || "No address yet!"}
                      </>
                    )}
                  </Box>
                </Box>
              </Flex>
            </ModalBody>
          </>
        )}
      </ModalContent>

      {/* Alert Dialog for deleting account */}
      <AlertDialog
        isOpen= {isAlertOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => setIsAlertOpen(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader>
              Confirm Delete Account
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to delete your account? Once confirm, it is not reversible.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => setIsAlertOpen(false)}>
                Cancel
              </Button>
              <Button colorScheme="red" ml={3} onClick={handleDeleteAccount}>
                Confirm
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Modal>
  );
};

export default ProfileForm;
