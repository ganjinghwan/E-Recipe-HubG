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
} from "@chakra-ui/react";
import { useModeratorStore } from "../../store/moderatorStore";


const UserHistoryListModal = ({ isOpen, onClose }) => {
    const { fetchDeletedUsers, deletedUsers } = useModeratorStore();

    useEffect(() => {
        fetchDeletedUsers();
    }, [fetchDeletedUsers, deletedUsers]);

    const formatDate = (isoDate) => {
        if (!isoDate) return "Unknown Date";
    
        const date = new Date(isoDate);
    
        return new Intl.DateTimeFormat("en-US", {
          dateStyle: "short",
          timeStyle: "medium",
        }).format(date);
      };
  
    
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
        <Modal isOpen={isOpen} onClose={onClose} size="xl">
              <ModalOverlay />
              <ModalContent bg="linear-gradient(to top left, #ffecd2, #fcb69f)" border={"2px solid black"}>
                <ModalHeader>History of Deleted Users</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <Box
                    maxH="400px"
                    border="1px solid black"
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
                      }
                    }}
        
                  >
                    <Box minW="910px"> {/* Ensure content is wide enough for horizontal scrolling */}
                    {/* Header Row */}
                    <Flex
                    alignItems="center"
                    bg="linear-gradient(to top left, #ffecd2, #fcb69f)"
                    fontWeight="bold"
                    borderBottom="1px solid black"
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
                        <Box flex="2" minW="220px">
                        <Text>Reason</Text>
                        </Box>
                        <Box flex="2" minW="220px">
                        <Text>User ID</Text>
                        </Box>
                        <Box flex="1" minW="160px">
                        <Text>Deleted Date</Text>
                        </Box>
                    </Flex>
                    </Flex>
        
                    {/* User Rows */}
                    {deletedUsers?.length > 0 ? (
                    deletedUsers.map((EachUser) => (
                        <Flex
                        key={EachUser._id}
                        alignItems="center"
                        justifyContent="space-between"
                        p={2}
                        mb={2}
                        borderBottom="1px solid black"
                        bg="transparent" // Ensure background color applies even during horizontal scroll
                        >
                        {/* Recipe Data Columns */}
                        <Flex flex="1">
                            <Box flex="1" minW="160px" textOverflow="ellipsis" overflow="hidden">
                            <Text fontWeight="bold">{truncateSentences( EachUser.userName, 15)}</Text>
                            </Box>
                            <Box flex="1" minW="140px" textOverflow="ellipsis" overflow="hidden">
                            <Text>{EachUser?.userRole}</Text>
                            </Box>
                            <Box flex="2" minW="220px" textOverflow="ellipsis" overflow="hidden">
                            <Text>{truncateSentences(EachUser.reason, 15)}</Text>
                            </Box>
                            <Box flex="2" minW="220px" textOverflow="ellipsis" overflow="hidden">
                            <Text>{EachUser.userID}</Text>
                            </Box>
                            <Box flex="1" minW="160px" textOverflow="ellipsis" overflow="hidden">
                            <Text>{formatDate(EachUser.date)}</Text>
                            </Box>
                        </Flex>
                        </Flex>
                    ))
                    ) : (
                    <Text>No history of deleted users found.</Text>
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

export default UserHistoryListModal;