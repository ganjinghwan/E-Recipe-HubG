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
  Badge,
} from "@chakra-ui/react";
import { CheckIcon } from "@chakra-ui/icons";
import { useAuthStore } from "../store/authStore";

const InboxModal = ({ isOpen, onClose }) => {
  const { fetchUserInbox, userInbox = [] } = useAuthStore(); // Access inbox from the store
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch inbox messages when the modal opens
  useEffect(() => {
    if (isOpen) {
      fetchUserInbox();
    }
  }, [isOpen, fetchUserInbox]);

  // Calculate unread count dynamically
  useEffect(() => {
    setUnreadCount(userInbox.filter((msg) => !msg.read).length);
  }, [userInbox]);

  // Mark a message as read
  const handleMarkAsRead = (index) => {
    const updatedInbox = [...userInbox];
    updatedInbox[index].read = true;
    setUnreadCount(updatedInbox.filter((msg) => !msg.read).length);
  };

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    return new Intl.DateTimeFormat("en-US", {
      dateStyle: "short",
      timeStyle: "medium",
    }).format(date);
  };

  return (
    <>
      {/* Unread Count Badge */}
      {unreadCount > 0 && (
        <Box position="absolute" top="10px" right="10px">
          <Badge colorScheme="red" fontSize="lg" p={2}>
            {unreadCount} Unread
          </Badge>
        </Box>
      )}

      {/* Inbox Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
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
                    bg={msg.read ? "gray.200" : "blue.100"} // Different background for read/unread
                    justifyContent="space-between"
                    alignItems="center"
                    _hover={!msg.read ? { bg: "blue.200" } : {}}
                  >
                    <Box>
                      <Text fontWeight="bold">{msg.messageTitle}</Text> {/* Title */}
                      <Text>{msg.messageContent}</Text> {/* Content */}
                      <Text fontSize="sm" color="gray.600">
                        {formatDate(msg.date)}
                      </Text>
                      <Text fontSize="sm" color="gray.400">
                        Sent by: {msg.senderName} ({msg.senderRole})
                      </Text>
                    </Box>
                    {!msg.read && (
                      <IconButton
                        aria-label="Mark as read"
                        icon={<CheckIcon />}
                        colorScheme="green"
                        size="sm"
                        onClick={() => handleMarkAsRead(index)}
                      />
                    )}
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
