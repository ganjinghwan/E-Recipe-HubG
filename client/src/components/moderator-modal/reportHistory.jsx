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


const ReportHistoryListModal = ({ isOpen, onClose }) => {
    const {fetchPassedReports , passedReports  } = useModeratorStore();

    useEffect(() => {
        fetchPassedReports();
    }, [fetchPassedReports, passedReports]);

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
                <ModalHeader>History of Reports</ModalHeader>
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
                    <Box minW="1400px"> {/* Ensure content is wide enough for horizontal scrolling */}
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
                        <Text>Reporter Name</Text>
                        </Box>
                        <Box flex="1" minW="140px">
                        <Text>Reporter Role</Text>
                        </Box>
                        <Box flex="2" minW="235px">
                        <Text>Report Title</Text>
                        </Box>
                        <Box flex="2" minW="220px">
                        <Text>Report Reason</Text>
                        </Box>
                        <Box flex="1" minW="170px">
                        <Text>Reported Name</Text>
                        </Box>
                        <Box flex="1" minW="140px">
                        <Text>Reported Role</Text>
                        </Box>
                        <Box flex="1" minW="170px">
                        <Text>Reported Recipe</Text>
                        </Box>
                        <Box flex="1" minW="160px">
                        <Text>Deleted Date</Text>
                        </Box>
                    </Flex>
                    </Flex>
        
                    {/* Report Rows */}
                    {passedReports?.length > 0 ? (
                    passedReports.map((EachReport) => (
                        <Flex
                        key={EachReport._id}
                        alignItems="center"
                        justifyContent="space-between"
                        p={2}
                        mb={2}
                        borderBottom="1px solid black"
                        bg="transparent" // Ensure background color applies even during horizontal scroll
                        >
                        {/* Report Data Columns */}
                        <Flex flex="1">
                            <Box flex="1" minW="160px" textOverflow="ellipsis" overflow="hidden">
                            <Text fontWeight="bold">{truncateSentences(EachReport.reporterName, 15)}</Text>
                            </Box>
                            <Box flex="1" minW="140px" textOverflow="ellipsis" overflow="hidden">
                            <Text>{EachReport.reporterRole} </Text>
                            </Box>
                            <Box flex="2" minW="235px" textOverflow="ellipsis" overflow="hidden">
                            <Text>{truncateSentences(EachReport.reportTitle, 20)}</Text>
                            </Box>
                            <Box flex="2" minW="220px" textOverflow="ellipsis" overflow="hidden" marginRight={"5px"}>
                            <Text>{truncateSentences(EachReport.reportReason, 20)}</Text>
                            </Box>
                            <Box flex="1" minW="170px" textOverflow="ellipsis" overflow="hidden">
                            <Text fontWeight="bold">{truncateSentences(EachReport.reportedUserName, 15)}</Text>
                            </Box>
                            <Box flex="1" minW="140px" textOverflow="ellipsis" overflow="hidden">
                            <Text>{EachReport.reportedUserRole}</Text>
                            </Box>
                            <Box flex="1" minW="170px" textOverflow="ellipsis" overflow="hidden">
                            <Text fontWeight="bold">{truncateSentences(EachReport.reportedRecipe, 15)}</Text>
                            </Box>
                            <Box flex="1" minW="160px" textOverflow="ellipsis" overflow="hidden">
                            <Text>{formatDate(EachReport.date)}</Text>
                            </Box>
                        </Flex>
                        </Flex>
                    ))
                    ) : (
                    <Text>No history of reports found.</Text>
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

export default ReportHistoryListModal;