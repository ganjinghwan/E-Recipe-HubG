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
  Textarea,
  Tooltip,
} from "@chakra-ui/react";
import { useEventStore } from "../../store/eventStore";
import { useAuthStore } from "../../store/authStore";
import { useModeratorStore } from "../../store/moderatorStore";

// import EventHistoryListModal from "./eventHistory";
import { FaTrash, FaCalendarAlt } from "react-icons/fa";

import { useNavigate } from "react-router-dom";

const EventListModal = ({ isOpen, onClose }) => {
    const {getAllEvents, events} = useEventStore();
    const {fetchCGE, CGEs} = useAuthStore();
    // const {addDeletedEventHistory} = useModeratorStore();

    // const [reason, setReason] = useState(""); // State for reason input
    // const [selectedEventId, setSelectedREventId] = useState(null); // State for selected recipe
    // const [selectedEventTitle, setSelectedEventTitle] = useState(null);
    // const [selectedEventOrgName, setSelectedEventOrgName] = useState(null);
    // const [selectedRole, setSelectedRole] = useState(null);
    // const [isReasonModalOpen, setIsReasonModalOpen] = useState(false); // Modal for reason

    const [isEventHistoryListOpen, setIsEventHistoryListOpen] = useState(false);
    
    const toast = useToast();
    const nav = useNavigate();
    

    useEffect(() => {
        getAllEvents();
      }, [getAllEvents]);

/***************************************Handle Delete Event*****************************************/
    // Show Reason Modal
    // const openReasonModal = (recipeId) => {
    //     const selectedCookName = cooks.find((EOUsername) => EOUsername._id === recipes.find((recipe) => recipe._id === recipeId).eventBelongs_id)?.name || "Unknown User";
    //     const selectedRole = cooks.find((EOUsername) => EOUsername._id === recipes.find((recipe) => recipe._id === recipeId).eventBelongs_id)?.role || "Unknown Role";
    //     const selectedRecipeTitle = recipes.find((recipe) => recipe._id === recipeId)?.title || "Unknown Recipe Title";

    //     setSelectedRecipeId(recipeId);
    //     setSelectedCookName (selectedCookName);
    //     setSelectedRole (selectedRole);
    //     setSelectedRecipeTitle (selectedRecipeTitle);
    //     setIsReasonModalOpen(true);
        
    // };

    // // Close Reason Modal
    // const closeReasonModal = () => {
    //     setSelectedRecipeId(null);
    //     setSelectedRecipeTitle(null);
    //     setSelectedCookName(null);
    //     setSelectedRole(null);
    //     setReason("");
    //     setIsReasonModalOpen(false);
    // };

    // // Confirm Deletion
    // const confirmDelete = async () => {
    //     if (!reason.trim()) {
    //     toast({
    //         title: "Error",
    //         description: "Please provide a reason for deletion.",
    //         status: "error",
    //         duration: 3000,
    //         isClosable: true,
    //     });
    //     return;
    //     }

    //     try {
    //     const { success, message } = await deleteRecipes(selectedRecipeId); // Perform deletion
    //     if (success) {
    //         // Add deleted recipe to history
    //         const historyData = {
    //             userName: selectedCookName,
    //             userRole: selectedRole,
    //             recipeTitle: selectedRecipeTitle,
    //             recipeId: selectedRecipeId,
    //             reason: reason,
    //             date: new Date().toLocaleString(),
    //         };
    //         const response = await addDeletedRecipeHistory(historyData);
            
    //         if (!response.success) {
    //         throw new Error(response.message);
    //         }

    //         toast({
    //         title: "Recipe Deleted",
    //         description: message,
    //         status: "success",
    //         duration: 3000,
    //         isClosable: true,
    //         });

    //         // fetchRecipes(); // Refresh recipes
    //     } else {
    //         toast({
    //         title: "Error",
    //         description: message,
    //         status: "error",
    //         duration: 3000,
    //         isClosable: true,
    //         });
    //     }
    //     } catch (error) {
    //     toast({
    //         title: "Error",
    //         description: error.message,
    //         status: "error",
    //         duration: 3000,
    //         isClosable: true,
    //     });
    //     }

    //     closeReasonModal(); // Close the modal
    // };

/**********************************************Handle Event Display*********************************************/
    // const handleHistory = () => {
    //     setIsRecipeHistoryListOpen(true);
    //     onClose();
    // }
/***********************************************Handle Navigate to Event Page*********************************************/
    // const handleNavigateRecipePg = () => {
    //     nav("/visitors");
    // }


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
        {/* Event List Modal */}
        <Modal isOpen={isOpen} onClose={onClose} size="xl">
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>List of Events</ModalHeader>
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
                        <Text>Event Title</Text>
                        </Box>
                        <Box flex="2" minW="220px">
                        <Text>Event ID</Text>
                        </Box>
                    </Flex>
                    </Flex>
        
                    {/* Event Rows */}
                    {events?.length > 0 ? (
                    events.map((EachEvent) => (
                        <Flex
                        key={EachEvent._id}
                        alignItems="center"
                        justifyContent="space-between"
                        p={2}
                        mb={2}
                        borderBottom="1px solid lightgray"
                        bg="white" // Ensure background color applies even during horizontal scroll
                        >
                        {/* Event Data Columns */}
                        <Flex flex="1">
                            <Box flex="1" minW="160px" textOverflow="ellipsis" overflow="hidden">
                            <Text fontWeight="bold">{truncateSentences(
                                CGEs.find((EOUsername)=> EOUsername._id === EachEvent?.eventBelongs_id)?.name || "Unknown User",
                                15                                )}</Text>
                            </Box>
                            <Box flex="1" minW="140px" textOverflow="ellipsis" overflow="hidden">
                            <Text>{CGEs.find((EOUsername)=> EOUsername._id === EachEvent?.eventBelongs_id)?.role || "Unknown"}</Text>
                            </Box>
                            <Box flex="2" minW="235px" textOverflow="ellipsis" overflow="hidden">
                            <Text>{truncateSentences(EachEvent.event_name, 20)}</Text>
                            </Box>
                            <Box flex="2" minW="220px" textOverflow="ellipsis" overflow="hidden">
                            <Text>{EachEvent._id}</Text>
                            </Box>
                        </Flex>
        
                        {/* Trash/Delete Button */}
                        <Box flex="0" minW="50px" textAlign="center">
                            <IconButton
                            icon={<FaTrash />}
                            colorScheme="red"
                            size="sm"
                            // onClick={() => openReasonModal(EachEvent._id)}
                            aria-label="Delete Event"
                            />
                        </Box>
                        </Flex>
                    ))
                    ) : (
                    <Text>No events found.</Text>
                    )}
                 </Box>
                </Box>
                </ModalBody>
                <ModalFooter gap={3}>
                 <Tooltip label="Event Page">
                  <IconButton
                    aria-label="Event Page"
                    icon={<FaCalendarAlt />}
                    size="md"
                    // onClick={handleNavigateEventPg}
                    colorScheme="blue"
                 />
                 </Tooltip>
                  {/* <Button colorScheme="blue" onClick={handleHistory}>
                    History
                  </Button> */}
                  <Button colorScheme="red" onClick={onClose}>
                    Close
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>

            {/* Reason Modal */}
            {/* <Modal isOpen={isReasonModalOpen} onClose={closeReasonModal}>
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
            </Modal> */}

            {/* History Modal */}
            {/* <RecipeHistoryListModal
                    isOpen={isRecipeHistoryListOpen}
                    onClose={() => setIsRecipeHistoryListOpen(false)}
            /> */}
    </>
          );
        };

        

export default EventListModal;