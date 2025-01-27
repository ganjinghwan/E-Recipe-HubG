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


const WarningListModal = ({ isOpen, onClose }) => {
    const {fetchWarnings , warnings  } = useModeratorStore();

    useEffect(() => {
        fetchWarnings();
    }, [fetchWarnings, warnings, isOpen]);

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
              <ModalContent>
                <ModalHeader>Warnings List</ModalHeader>
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
                      }
                    }}
        
                  >
                    <Box minW="790px"> {/* Ensure content is wide enough for horizontal scrolling */}
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
                        <Text>User Role</Text>
                        </Box>
                        <Box flex="1" minW="100px">
                        <Text>Warning Count</Text>
                        </Box>
                        <Box flex="2" minW="220px">
                        <Text>Warning Reason</Text>
                        </Box>
                        <Box flex="1" minW="160px">
                        <Text>Deleted Date</Text>
                        </Box>
                    </Flex>
                    </Flex>
        
                    {/* Report Rows */}
                    {warnings?.length > 0 ? (
                    warnings.map((EachWarning) => (
                        <Flex
                        key={EachWarning._id}
                        alignItems="center"
                        justifyContent="space-between"
                        p={2}
                        mb={2}
                        borderBottom="1px solid lightgray"
                        bg="white" // Ensure background color applies even during horizontal scroll
                        >
                        {/* Report Data Columns */}
                        <Flex flex="1">
                            <Box flex="1" minW="160px" textOverflow="ellipsis" overflow="hidden">
                            <Text fontWeight="bold">{truncateSentences(EachWarning.warnedUserName, 15)}</Text>
                            </Box>
                            <Box flex="1" minW="140px" textOverflow="ellipsis" overflow="hidden">
                            <Text>{EachWarning.warnedUserRole} </Text>
                            </Box>
                            <Box flex="1" minW="100px" textOverflow="ellipsis" overflow="hidden">
                            <Text>{EachWarning.warningCount}</Text>
                            </Box>
                            <Box flex="2" minW="220px" textOverflow="ellipsis" overflow="hidden" marginRight={"5px"}>
                            <Text whiteSpace="pre-wrap">{EachWarning.warnedReason}</Text> {/* Display newlines */}
                            </Box>
                            <Box flex="1" minW="160px" textOverflow="ellipsis" overflow="hidden">
                            <Text>{formatDate(EachWarning.date)}</Text>
                            </Box>
                        </Flex>
                        </Flex>
                    ))
                    ) : (
                    <Text>No history of warnings found.</Text>
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

export default WarningListModal;