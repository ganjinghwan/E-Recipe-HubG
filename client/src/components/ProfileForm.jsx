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
} from "@chakra-ui/react";
import { useAuthStore } from "../store/authStore";
import { formatDate } from "../utils/date";
import { keyframes } from "@emotion/react";

import defaultAvatar from "../pic/avatar.png";
import UpdateProfileForm from "./UpdateProfileForm";


const ProfileForm = ({ isOpen, onClose }) => {
  console.log('isOpen: ', isOpen);
  console.log('onClose: ', onClose);
  const {user, isUploadingPicture, uploadProfilePicture} = useAuthStore();
  const [selectedImg, setSelectedImg] = useState(null);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

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
  
  useEffect(() => {
    if (!isOpen) {
      setIsUpdatingProfile(false);
    }
  }, [isOpen]);

  const handleImageUpload = async (e) => {

    const file = e.target.files[0];

    if (!file) {
      return;
    }

    //Validate image type
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
        })
      } catch (error) {
        toast({
          position: "bottom",
          title: "Fail to upload profile picture",
          description: error.message,
          status: "error",
          duration: 5000,
          isClosable: true,
        })
      }
    };
  };

  if (!user) {
    return null;
  }

  const handleSwitchToUpdateProfile = () => {
    setIsUpdatingProfile(true);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent
        maxW={{base: "100%", sm: "80%", md: "60%", lg: "50%"}}
        maxH={"90vh"}
        overflowY={"auto"}
        css={{
          animation: `${colorAnimation} 25s linear infinite`,
          backgroundSize: "200% 200%",
        }}
      >
        {isUpdatingProfile ? (
          <UpdateProfileForm
            isOpen={isOpen}
            onClose={onClose}
            switchToProfile={() => setIsUpdatingProfile(false)}
          />
        ) : (
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

                <Box textAlign="center">
                  {/* Profile Picture */}
                  <Image
                    borderRadius="full"
                    boxSize="220px"
                    src={user.profilePicture || selectedImg || defaultAvatar} // Default image fallback
                    alt={`${user.name}'s profile picture`}
                    border="2px solid"
                    borderColor="black.200"
                    mb={4} // Add margin-bottom for spacing
                  />
                  
                  {/* Upload Button */}
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
                </Box>

                {/* User Details */}
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
                    {user.phoneNumber ? `Phone Number: ${user.phoneNumber}` : "Looks like you don't have phone number yet!"}
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
                </Box>
              </Flex>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme ="red" mr={3}>
                Delete Account
              </Button>
              <Button colorScheme="green" mr={3} onClick={handleSwitchToUpdateProfile}>
                Update Profile
              </Button>
              <Button colorScheme="yellow" mr={3} onClick={onClose}>
                Close
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ProfileForm;
