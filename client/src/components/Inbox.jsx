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
  useBreakpointValue,
  Tooltip,
} from "@chakra-ui/react";
import { CheckIcon, CloseIcon, ViewIcon } from "@chakra-ui/icons";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";
import { useEventStore } from "../store/eventStore";

const InboxModal = ({ isOpen, onClose }) => {
  const { fetchUserInbox, userInbox = [], setInboxRead, checkAcceptInviteStatus, checkDeclineInviteStatus } = useAuthStore(); // Access inbox from the store
  const { rejectEventInviteReq } = useEventStore();
  const [unreadCount, setUnreadCount] = useState(0);
  const [eventAcceptMap, setEventAcceptMap] = useState({});
  const [eventRejectMap, setEventRejectMap] = useState({});
  const [eventExpiredMap, setExpiredEventMap] = useState({});

  const navigate = useNavigate();

  // Fetch inbox messages when the modal opens
  useEffect(() => {
    if (isOpen) {
      fetchUserInbox();

      console.log("Fetched inbox messages: ", userInbox);
    }
  }, [isOpen, fetchUserInbox]);

  // Calculate unread count dynamically
  useEffect(() => {
    setUnreadCount(userInbox.filter((msg) => !msg.readStatus).length);
  }, [userInbox]);


  useEffect(() => {
    const fetchEventInviteStatus = async () => {
      const accept = {}
      const decline = {}
      const expired = {}

      const fromOrganizerInbox = userInbox.filter((msg) => msg.senderRole === "event-organizer");

      // Map over the filtered message and fetch accept/decline status
      const statusResult = fromOrganizerInbox.map(async (msg) => {
        try {
          const isAccepted = await checkAcceptInviteStatus(msg.additionalInformation);
          const isRejected = await checkDeclineInviteStatus(msg.additionalInformation);
  
          if (isAccepted.expired && isRejected.expired) {
            expired[msg._id] = true;
          } else {
            accept[msg._id] = isAccepted.alreadyJoined;
            decline[msg._id] = isRejected.alreadyRejected;
          }
        } catch (error) {
          console.error("Error fetching accept status:", error);
        }
      });

      await Promise.all(statusResult);

      // Update accept map with the results
      setEventAcceptMap(accept);
      setEventRejectMap(decline);
      setExpiredEventMap(expired);
      //console.log("Accept map updated:", eventAcceptMap);
      //console.log("Decline map updated:", eventRejectMap);
      //console.log("Expired map updated:", eventExpiredMap);
    }

    if (userInbox.length > 0) {
      fetchEventInviteStatus();
    }
  }, [userInbox, checkAcceptInviteStatus, checkDeclineInviteStatus]);

  // Mark a message as read
  const handleMarkAsRead = async (index) => {
    const updatedInbox = [...userInbox];
    updatedInbox[index].readStatus = true;

    await setInboxRead(index);
    // console.log("Message marked as read");

    fetchUserInbox();
    // Update the store with the updated inbox
    //setUnreadCount(updatedInbox.filter((msg) => !msg.read).length);
  };

  const handleAcceptInvite = (msg, index) => {
    handleMarkAsRead(index);
    navigate(`/events/${msg.additionalInformation}`);
    onClose();
  };

  const handleRejectInvite = (msg, index) => {
    handleMarkAsRead(index);
    rejectEventInviteReq(msg.additionalInformation);
  }

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    return new Intl.DateTimeFormat("en-US", {
      dateStyle: "short",
      timeStyle: "medium",
    }).format(date);
  };

  return (
    <>
      {/* Unread Count Badge 
      {unreadCount > 0 && (
        <Box position="absolute" top="10px" right="10px">
          <Badge colorScheme="red" fontSize="lg" p={2}>
            {unreadCount} Unread
          </Badge>
        </Box>
      )}*/}

      {/* Inbox Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent bg="linear-gradient(to top left, #ffecd2, #fcb69f)" border={"2px solid black"}>
          <ModalHeader>Inbox</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box
              maxH="400px"
              border="1px solid lightgray"
              borderRadius="md"
              p={2}
              boxShadow="sm"
              overflowY="auto"
              borderColor={"black"}
              sx={{
                "&::-webkit-scrollbar": {
                  height: "8px",
                  width: "8px",
                },
                "&::-webkit-scrollbar-thumb": {
                  background: "gray.500",
                  borderRadius: "10px",
                },
                "&::-webkit-scrollbar-thumb:hover": {
                  background: "gray.700",
                },
                "&::-webkit-scrollbar-track": {
                  background: "gray.100",
                  borderRadius: "10px",
                },
              }}
            >
              {userInbox.length > 0 ? (
                userInbox.map((msg, index) => (
                  <Flex
                    key={index}
                    p={4}
                    mb={2}
                    border="1px solid lightgray"
                    borderRadius="md"
                    bg={msg.readStatus ? "gray.200" : "blue.100"} // Different background for read/unread
                    justifyContent="space-between"
                    alignItems="center"
                    _hover={!msg.readStatus ? { bg: "blue.200" } : {}}
                    position={"relative"}
                  >
                    <Box 
                      maxWidth={{base: "500px", md: "600px"}}
                      overflow={"hidden"}
                      textOverflow={"ellipsis"}
                    >
                      <Text fontWeight="bold">{msg.messageTitle}</Text> {/* Title */}
                      <Text>{msg.messageContent}</Text> {/* Content */}
                      <Text fontSize="sm" color="gray.600">
                        {formatDate(msg.date)}
                      </Text>
                      <Text fontSize="sm" color="gray.400">
                        Sent by: {msg.senderName} ({msg.senderRole})
                      </Text>
                    </Box>
                    <Flex position={"absolute"} bottom={"5px"} right={"8px"} alignItems={"center"}>
                      {msg.senderRole === "event-organizer" && (
                        <>
                          {eventAcceptMap[msg._id] === true ? (
                            <Text color="green.500" fontWeight={"bold"}>Invite Accepted</Text>
                          ) : eventRejectMap[msg._id] === true ? (
                            <Text color="red.500" fontWeight={"bold"}>Invite Declined</Text>
                          ) : eventExpiredMap[msg._id] === true ? (
                            <Text color="orange.500" fontWeight={"bold"}>Event Expired</Text>
                          ) : (
                            <>
                              <Tooltip label="Reject Invite" aria-label="Reject Invite tooltip">
                                <IconButton
                                  size="sm"
                                  icon={<CloseIcon />}
                                  aria-label="Reject Invite"
                                  colorScheme="red"
                                  ml={2}
                                  onClick={() => handleRejectInvite(msg, index)}
                                />
                              </Tooltip>
                              <Tooltip label="Accept Invite" aria-label="Accept Invite tooltip">
                                <IconButton
                                  size="sm"
                                  icon={<CheckIcon />}
                                  aria-label="Accept Invite"
                                  colorScheme="green"
                                  ml={2}
                                  onClick={() => handleAcceptInvite(msg, index)}
                                />
                              </Tooltip>
                            </>
                          )}
                        </>
                      )}
                      {!msg.readStatus && (
                        <Tooltip label="Mark as read" aria-label="Mark as read tooltip">
                          <IconButton
                            aria-label="Mark as read"
                            icon={<ViewIcon />}
                            colorScheme="blue"
                            size="sm"
                            onClick={() => handleMarkAsRead(index)}
                            ml={2}
                          />
                        </Tooltip>
                      )}
                    </Flex>
                  </Flex>
                ))
              ) : (
                <Text>No messages found.</Text>
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
    </>
  );
};

export default InboxModal;
