import React, { useEffect, useState } from "react";
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

const ProfileForm = ({ isOpen, onClose }) => {
  const { user, isUploadingPicture, uploadProfilePicture } = useAuthStore();
  const [selectedImg, setSelectedImg] = useState(null);
  const { cook, getCookInfo } = useCookStore();
  const { eventOrganizer, getEventOrganizerInfo } = useEventOrgStore();

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

  if (!user) return null;

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
                textAlign={"center"}
              >
                {/* Profile Picture Section */}
                <Box textAlign="center">
                  <Image
                    borderRadius="full"
                    boxSize="220px"
                    src={user.profilePicture || selectedImg || defaultAvatar}
                    alt={`${user.name}'s profile picture`}
                    border="2px solid"
                    borderColor="black.200"
                    mb={4}
                    ml={6}
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
                  
                  <Tooltip label="Delete Account">
                    <IconButton
                      size={iconButtonSize}
                      icon={<FaTrash />}
                      aria-label="Delete Account"
                      colorScheme="red"
                      ml={3}
                      mr={3}
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
                    Username: {user.name} <br />
                    Email: {user.email} <br />
                    Role: {user.role} <br />
                    {user.phoneNumber
                      ? `Phone Number: ${user.phoneNumber}`
                      : "Looks like you don't have a phone number yet!"}
                  </Box>
                  <Box bg="green.100" p="4" borderRadius="md" mt="4">
                    Account activity:
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
                  <Box bg="yellow.100" p="4" borderRadius="md" mt="4" mb="4">
                    Role information:
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
    </Modal>
  );
};

export default ProfileForm;
