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
            border="1px solid lightgray"
            borderRadius="md"
            p={2}
            boxShadow="sm"
            overflow="auto" // Enable horizontal scrolling
            sx={{
              '&::-webkit-scrollbar': {
                height: '8px',
                width: '8px',
              },
              '&::-webkit-scrollbar-thumb': {
                background: 'gray.500',
                borderRadius: '10px',
              },
              '&::-webkit-scrollbar-thumb:hover': {
                background: 'gray.700',
              },
              '&::-webkit-scrollbar-track': {
                background: 'gray.100',
                borderRadius: '10px',
              },
            }}

          >
            <Box minW="830px"> {/* Ensure content is wide enough for horizontal scrolling */}
            {/* Header Row */}
            <Flex
            alignItems="center"
            bg="gray.100"
            fontWeight="bold"
            borderBottom="1px solid lightgray"
            position="sticky"
            top="0" // Keeps the header row fixed during vertical scrolling
            zIndex="1"
            >
            <Flex flex="1">
                <Box flex="1" minW="170px">
                <Text>Username</Text>
                </Box>
                <Box flex="1" minW="140px">
                <Text>Role</Text>
                </Box>
                <Box flex="2" minW="235px">
                <Text>Email</Text>
                </Box>
                <Box flex="2" minW="220px">
                <Text>ID</Text>
                </Box>
            </Flex>
            </Flex>

            {/* User Rows */}
            {CGEs?.length > 0 ? (
            CGEs.map((user) => (
                <Flex
                key={user._id}
                alignItems="center"
                justifyContent="space-between"
                p={2}
                mb={2}
                borderBottom="1px solid lightgray"
                bg="white" // Ensure background color applies even during horizontal scroll
                >
                {/* User Data Columns */}
                <Flex flex="1">
                    <Box flex="1" minW="160px" textOverflow="ellipsis" overflow="hidden">
                    <Text fontWeight="bold">{user.name}</Text>
                    </Box>
                    <Box flex="1" minW="140px" textOverflow="ellipsis" overflow="hidden">
                    <Text>{user.role}</Text>
                    </Box>
                    <Box flex="2" minW="235px" textOverflow="ellipsis" overflow="hidden">
                    <Text>{user.email}</Text>
                    </Box>
                    <Box flex="2" minW="220px" textOverflow="ellipsis" overflow="hidden">
                    <Text>{user._id}</Text>
                    </Box>
                </Flex>

                {/* Trash/Delete Button */}
                <Box flex="0" minW="50px" textAlign="center">
                    <IconButton
                    icon={<FaTrash />}
                    colorScheme="red"
                    size="sm"
                    onClick={() => handleDelete(user._id)}
                    aria-label="Delete user"
                    />
                </Box>
                </Flex>
            ))
            ) : (
            <Text>No users found.</Text>
            )}
         </Box>
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
