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
  Flex,
  Text,
  IconButton,
  useToast,
  Tooltip,
  Textarea,
} from "@chakra-ui/react";
import { FaTrash, FaHistory  } from "react-icons/fa";
import { useAuthStore } from "../../store/authStore";
import { useModeratorStore } from "../../store/moderatorStore";
import UserHistoryListModal from "./userHistory";


const UserListModal = ({ isOpen, onClose }) => {
  const { CGEs, fetchCGE } = useAuthStore();
  const {deleteImproperUser, addDeletedUserHistory} = useModeratorStore();
  const toast = useToast();

  const [reason, setReason] = useState(""); // State for reason input
  const [selectedUserName, setSelectedUserName] = useState(null);
  const [selectedUserID, setSelectedUserID] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
  const [isReasonModalOpen, setIsReasonModalOpen] = useState(false); // Modal for reason

  const [isUserHistoryListOpen, setIsUserHistoryListOpen] = useState(false);
  

/***************************************Handle Delete Recipe*****************************************/
  const openReasonModal = (uid) => {
    const selectedUserName = CGEs.find((selectedUserName) => selectedUserName._id === uid)?.name  || "Unknown User";
    const selectedRole = CGEs.find((selectedUserName) => selectedUserName._id === uid)?.role || "Unknown Role";

    setSelectedUserID (uid);
    setSelectedUserName (selectedUserName);
    setSelectedRole (selectedRole);
    setIsReasonModalOpen(true);
    
  };

  // Close Reason Modal
  const closeReasonModal = () => {
    setSelectedUserID(null);
    setSelectedUserName(null);
    setSelectedRole(null);
    setReason("");
    setIsReasonModalOpen(false);
  };  

  const confirmDelete = async () => {
    if (!reason.trim()) {
      toast({
          title: "Error",
          description: "Please provide a reason for deletion.",
          status: "error",
          duration: 3000,
          isClosable: true,
      });
      return;
      }
    try {
      const { success, message} = await deleteImproperUser(selectedUserID);
      if (success) {
        // Add deleted user to history
        const historyData = {
          userID: selectedUserID,
          userName: selectedUserName,
          userRole: selectedRole,
          reason: reason,
          date: new Date().toLocaleString(),
        };
        const response = await addDeletedUserHistory(historyData);
        
        if (!response.success) {
        throw new Error(response.message);
        }

        toast({
          title: "User deleted.",
          description: message,
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        fetchCGE(); // Refresh the CGEs list after deletion
        } else {
          toast({
          title: "Error for deleteing user.",
          description: message,
          status: "error",
          duration: 3000,
          isClosable: true,
          });
        }
    } catch (error) {
      toast({
        title: "Error deleting user.",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
    closeReasonModal(); // Close the modal

  };
/**********************************************Handle History Display*********************************************/
const handleHistory = () => {
  setIsUserHistoryListOpen(true);
  onClose();
}

  const truncateSentences = (text, charLimit) => {
    if (!text) return ""; // Handle null or undefined text
  
    const words = text.split(" "); // Split the text into words
    const lines = []; // Array to store lines of text
    let currentLine = ""; // Current line being constructed
  
    for (const word of words) {
      if (word.length > charLimit) {
        // If a single word exceeds the limit, split it into chunks
        const chunks = word.match(new RegExp(`.{1,${charLimit}}`, "g"));
        if (currentLine.trim()) {
          lines.push(currentLine.trim()); // Push the current line before splitting the word
          currentLine = ""; // Clear the current line
        }
        lines.push(...chunks); // Add the word chunks as separate lines
      } else if ((currentLine + word).length > charLimit) {
        // If adding the word exceeds the line limit, push the current line
        lines.push(currentLine.trim());
        currentLine = word + " "; // Start a new line with the current word
      } else {
        currentLine += word + " "; // Add the word to the current line
      }
    }
  
    // Add the last line if it's not empty
    if (currentLine.trim()) {
      lines.push(currentLine.trim());
    }
  
    // Join the lines with a newline character
    return lines.join("\n");
  };

  return (
  <>
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
                    <Text fontWeight="bold">{truncateSentences(user.name,15)}</Text>
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
                    onClick={() => openReasonModal(user._id)}
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
        <ModalFooter gap={3}>
          <Tooltip label = "History">
            <IconButton
            icon={<FaHistory />}
            colorScheme="blue"
            size="md"
            onClick={handleHistory}
            aria-label="History"
            />
          </Tooltip>
          <Button colorScheme="blue" onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>

    {/* Reason Modal */}
    <Modal isOpen={isReasonModalOpen} onClose={closeReasonModal}>
    <ModalOverlay />
    <ModalContent>
        <ModalHeader>Reason for Deletion</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
        <Textarea
            placeholder="Enter the reason for deletion..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
        />
        </ModalBody>
        <ModalFooter gap={2}>
        <Button colorScheme="red" onClick={confirmDelete}>
            Submit
        </Button>
        <Button onClick={closeReasonModal}>Cancel</Button>
        </ModalFooter>
    </ModalContent>
    </Modal>

     {/* History Modal */}
     <UserHistoryListModal
      isOpen={isUserHistoryListOpen}
      onClose={() => setIsUserHistoryListOpen(false)}
    />
</>
  );
};

export default UserListModal;
