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
} from "@chakra-ui/react";
import { useAuthStore } from "../store/authStore";
import { formatDate } from "../utils/date";

const ProfileForm = ({ isOpen, onClose }) => {
  const {user} = useAuthStore();

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent
        maxW={{base: "90%", sm: "80%", md: "60%", lg: "50%"}}
        maxH={"90vh"}
        overflowY={"auto"}
      >
        <ModalHeader>Profile</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
        <Flex
            direction={{ base: "column", md: "row" }}
            align="center"
            gap={4}
          >
            {/* Profile Picture */}
            <Image
              borderRadius="full"
              boxSize="150px"
              src={user.profilePicture || "/default-avatar.png"} // Default image fallback
              alt={`${user.name}'s profile picture`}
              border="2px solid"
              borderColor="purple.200"
            />

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
                This is your Username: {user.name} <br />
                This is your Email: {user.email}
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
          <Button colorScheme="blue" mr={3} onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ProfileForm;
