import React from "react";
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
  Flex,
  Text,
  IconButton,
  useToast,
} from "@chakra-ui/react";
import { FaTrash } from "react-icons/fa";
import { useAuthStore } from "../../store/authStore";


const UserListModal = ({ isOpen, onClose }) => {
  const { CGEs, fetchCGE } = useAuthStore();
  const toast = useToast();

  // Handle user deletion
  const handleDelete = async (userId) => {
    try {
      //await fetch(}); // 
      toast({
        title: "User deleted.",
        description: `User with ID ${userId} has been removed.`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      fetchCGE(); // Refresh the CGEs list after deletion
    } catch (error) {
      toast({
        title: "Error deleting user.",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>List of Users</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box
            maxH="400px"
            overflowX="auto"
            overflowY="auto"
            whiteSpace="nowrap"
            border="1px solid lightgray"
            borderRadius="md"
            p={2}
          >
            {CGEs?.length > 0 ? (
              CGEs.map((user) => (
                <Flex
                  key={user._id}
                  alignItems="center"
                  justifyContent="space-between"
                  p={2}
                  mb={2}
                  borderBottom="1px solid lightgray"
                >
                  <Box
                    minW="100px"
                    textOverflow="ellipsis"
                    overflow="hidden"
                    whiteSpace="nowrap"
                  >
                    <Text fontWeight="bold">{user.name}</Text>
                    <Text fontSize="sm">{user.role}</Text>
                  </Box>
                  <Box
                    minW="200px"
                    textOverflow="ellipsis"
                    overflow="hidden"
                    whiteSpace="nowrap"
                  >
                    <Text>{user.email}</Text>
                  </Box>
                  <Text fontSize="xs">{user._id}</Text>
                  <IconButton
                    icon={<FaTrash />}
                    colorScheme="red"
                    size="sm"
                    onClick={() => handleDelete(user._id)}
                    aria-label="Delete user"
                  />
                </Flex>
              ))
            ) : (
              <Text>No users found.</Text>
            )}
          </Box>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default UserListModal;
