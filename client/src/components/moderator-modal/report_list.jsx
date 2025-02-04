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
import { useReportStore } from "../../store/reportStore";
import { useAuthStore } from "../../store/authStore";
import { useModeratorStore } from "../../store/moderatorStore";

import ReportHistoryListModal from "./reportHistory";
import WarningListModal from "./warning_list";
import { FaUserCheck, FaExclamationTriangle, FaList, FaHistory,   } from "react-icons/fa";

const ReportListModal = ({ isOpen, onClose }) => {
    const {fetchAllReports, deleteReport, reports, } = useReportStore();
    const {addInbox, CGEs} = useAuthStore();
   
    const {addPassedReport, deleteImproperUser, addWarning} = useModeratorStore();

    const [reason, setReason] = useState(""); // State for reason input
    const [selectedReportId, setSelectedRReportId] = useState(null); // State for selected report
    const [isReasonModalOpen, setIsReasonModalOpen] = useState(false); // Modal for reason

    const [isReportHistoryListOpen, setIsReportHistoryListOpen] = useState(false);
    const [isWarningListOpen, setIsWarningListOpen] = useState(false);

    const [isDeleteUserModalOpen, setIsDeleteUserModalOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);


    const toast = useToast();
    

    useEffect(() => {
        fetchAllReports();
      }, [fetchAllReports]);

/****************************************Handle Exceed Threshold**************************************** */
      const openDeleteUserModal = (userId) => {
        setUserToDelete(userId);
        setIsDeleteUserModalOpen(true);
      };

      const closeDeleteUserModal = () => {
        setUserToDelete(null);
        setIsDeleteUserModalOpen(false);
      };

      const handleDeleteUser = async () => {
        // Call the delete user API
        await deleteImproperUser(userToDelete); // Implement this in your moderatorStore
        toast({
          title: "User Deleted",
          description: `User with ID ${userToDelete} has been removed.`,
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        closeDeleteUserModal();
      };

/****************************************Handle PAss for Report**************************************** */

    const handlePassReport = async (reportId) => {
        try {
            const { success, message } = await deleteReport(reportId);
            if (success) {
              const historyData = {
                reporterName: reports.find((report) => report._id === reportId)?.reporter_name,
                reporterRole: reports.find((report) => report._id === reportId)?.reporter_role,
                reportTitle: reports.find((report) => report._id === reportId)?.reportTitle,
                reportReason: reports.find((report) => report._id === reportId)?.reportReason,
                reportedRecipe: reports.find((report) => report._id === reportId)?.reportedRecipeName || "---",
                reportedUserName: reports.find((report) => report._id === reportId)?.reportedUserName,
                reportedUserRole: CGEs.find((EOUsername) => EOUsername._id === reports.find((report) => report._id === reportId)?.reportedUserId)?.role || "No record found",
                date: new Date().toLocaleString(),
              };
              const response = await addPassedReport(historyData);
            
              if (!response.success) {
                throw new Error(response.message);
              }
            }else {
                throw new Error(message);
            }
            toast({
                title: "Report Passed",
                description: "The report has been passed successfully.",
                status: "success",
                duration: 3000,
                isClosable: true,
            });
        } catch (error) {
            toast({
                title: "Error passing report",
                description: error.message,
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        }
    };

/***************************************Handle Warning for Report*****************************************/
    // Show Reason Modal
    const openReasonModal = (reportId) => {

        setSelectedRReportId(reportId);
        setIsReasonModalOpen(true);
        
    };

    // Close Reason Modal
    const closeReasonModal = () => {
        setSelectedRReportId(null);
        setReason("");
        setIsReasonModalOpen(false);
    };

    // Confirm Deletion
    const confirmWarning = async () => {
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
        const { success, message  } = await deleteReport(selectedReportId); // Perform deletion
        if (success) {
            const warnedUserID = reports.find((report) => report._id === selectedReportId)?.reportedUserId;
            const warnedUserName = reports.find((report) => report._id === selectedReportId)?.reportedUserName;
            const warnedUserRole = CGEs.find((EOUsername) => EOUsername._id === warnedUserID)?.role || "No record found";
      
            const historyData = {
                warnedUserID,
                warnedUserName,
                warnedUserRole,
                warnedReason: reason,
                date: new Date().toLocaleString(),
            };
            const response = await addWarning(historyData);
            
            if (!response.success) {
            throw new Error(response.message);
            }

            // Add Inbox Message
            const warnedUser = CGEs.find((user) => user._id === warnedUserID);
            if (warnedUser) {
              let messageTitle = "";
              switch (response.currentWarningCount) {
                case 1:
                  messageTitle = "First Warning";
                  break;
                case 2:
                  messageTitle = "Second Warning";
                  break;
                case 3:
                  messageTitle = "Last Warning";
                  break;
                default:
                  messageTitle = "Warning";
                  break;
              }

              const messageContent = `Dear ${warnedUserName},\n\nYou have received a ${messageTitle.toLowerCase()} for the following reason:\n\n${reason}\n\nPlease adhere to the platform's rules to avoid further actions.`;
              const inboxResponse = await addInbox(
                warnedUserID,
                "Moderator",
                "System",
                messageTitle,
                messageContent
              );
              
            }

            toast({
            title: "Warnign Sent",
            description: message,
            status: "success",
            duration: 3000,
            isClosable: true,
            });

            if (response.warningThresholdExceeded) {
              openDeleteUserModal(historyData.warnedUserID); // Implement this function
            }

            fetchAllReports(); // Refresh 
        } else {
            toast({
            title: "Error",
            description: message,
            status: "error",
            duration: 3000,
            isClosable: true,
            });
        }
        } catch (error) {
        toast({
            title: "Error",
            description: error.message,
            status: "error",
            duration: 3000,
            isClosable: true,
        });
        }

        closeReasonModal(); // Close the modal
    };

/**********************************************Handle Report History Display*********************************************/
    const handleHistory = () => {
        setIsReportHistoryListOpen(true);
        onClose();
    }

/**********************************************Handle Warning Display*********************************************/
    const handleWarningList = () => {
        setIsWarningListOpen(true);
        onClose();
    }

/***********************************************Others*********************************************/



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
        {/* Report List Modal */}
        <Modal isOpen={isOpen} onClose={onClose} size="xl">
              <ModalOverlay />
              <ModalContent bg="linear-gradient(to top left, #ffecd2, #fcb69f)" border={"2px solid black"}>
                <ModalHeader>List of Reports</ModalHeader>
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
                      },
                    }}
        
                  >
                    <Box minW="1590px"> {/* Ensure content is wide enough for horizontal scrolling */}
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
                        <Box flex="2" minW="210px">
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
                        <Box flex="2" minW="220px">
                        <Text>Report ID</Text>
                        </Box>
                        <Box flex="1" minW="100px">
                        <Text>Action</Text>
                        </Box>
                    </Flex>
                    </Flex>
        
                    {/* Report Rows */}
                    {reports?.length > 0 ? (
                    reports.map((EachReport) => (
                        <Flex
                        key={EachReport._id}
                        alignItems="center"
                        justifyContent="space-between"
                        p={2}
                        mb={2}
                        borderBottom="1px solid black"
                        bg="transparent" // Make the row transparent
                        >
                        {/* Event Data Columns */}
                        <Flex flex="1">
                            <Box flex="1" minW="160px" textOverflow="ellipsis" overflow="hidden">
                            <Text fontWeight="bold">{truncateSentences(EachReport.reporter_name, 15) || "No record" }</Text>
                            </Box>
                            <Box flex="1" minW="140px" textOverflow="ellipsis" overflow="hidden">
                            <Text>{EachReport.reporter_role} </Text>
                            </Box>
                            <Box flex="2" minW="235px" textOverflow="ellipsis" overflow="hidden">
                            <Text>{truncateSentences(EachReport.reportTitle, 20)}</Text>
                            </Box>
                            <Box flex="2" minW="230px" textOverflow="ellipsis" overflow="hidden">
                            <Text>{truncateSentences(EachReport.reportReason, 20)}</Text>
                            </Box>
                            <Box flex="1" minW="170px" textOverflow="ellipsis" overflow="hidden">
                            <Text fontWeight="bold">{truncateSentences(EachReport.reportedUserName, 15) || "No record" }</Text>
                            </Box>
                            <Box flex="1" minW="140px" textOverflow="ellipsis" overflow="hidden">
                            <Text>{CGEs.find((EOUsername)=> EOUsername._id === EachReport?.reportedUserId)?.role || "Unknown"}</Text>
                            </Box>
                            <Box flex="1" minW="170px" textOverflow="ellipsis" overflow="hidden">
                            <Text fontWeight="bold">{truncateSentences(EachReport.reportedRecipeName, 15) || "---" }</Text>
                            </Box>
                            <Box flex="2" minW="210px" textOverflow="ellipsis" overflow="hidden">
                            <Text>{EachReport._id}</Text>
                            </Box>
                        </Flex>
        
                        {/* Assess Report Button */}
                        <Tooltip label="Pass Report">
                        <Box flex="0" minW="50px" textAlign="center">
                            <IconButton
                            aria-label="Pass Report"
                            icon={<FaUserCheck />}
                            size="sm"
                            onClick={() => handlePassReport(EachReport._id)}
                            colorScheme="blue"
                            />
                        </Box>
                        </Tooltip>
                        
                        {/* Warning User Button */}
                        <Tooltip label="Warn User">
                        <Box flex="1" minW="50px" textAlign="center">
                            <IconButton
                            icon={<FaExclamationTriangle />}
                            colorScheme="orange"
                            size="sm"
                            onClick={() => openReasonModal(EachReport._id)}
                            aria-label="Warning User"
                            />
                        </Box>
                        </Tooltip>
                        </Flex>
                    ))
                    ) : (
                    <Text>No reports found.</Text>
                    )}
                 </Box>
                </Box>
                </ModalBody>
                <ModalFooter gap={3}>
                  <Tooltip label = "Warning List">
                  <IconButton
                  icon={<FaList  />}
                  colorScheme="orange"
                  size="md"
                  onClick={handleWarningList}
                  aria-label="Warning List"
                  />
                </Tooltip>
                  <Tooltip label = "History">
                  <IconButton
                  icon={<FaHistory />}
                  colorScheme="blue"
                  size="md"
                  onClick={handleHistory}
                  aria-label="History"
                  />
                </Tooltip>
                  <Button colorScheme="red" onClick={onClose}>
                    Close
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>

            {/* Reason Modal */}
            <Modal isOpen={isReasonModalOpen} onClose={closeReasonModal}>
            <ModalOverlay />
            <ModalContent bg="linear-gradient(to top left, #ffecd2, #fcb69f)" border={"2px solid black"}>
                <ModalHeader>Reason for Warning</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                <Textarea
                    placeholder="Enter the reason for warning this user..."
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    border={"1px solid black"}
                />
                </ModalBody>
                <ModalFooter gap={2}>
                <Button colorScheme="red" onClick={confirmWarning}>
                    Submit
                </Button>
                <Button onClick={closeReasonModal}>Cancel</Button>
                </ModalFooter>
            </ModalContent>
            </Modal>

            {/* History Modal */}
            <ReportHistoryListModal
                    isOpen={isReportHistoryListOpen}
                    onClose={() => setIsReportHistoryListOpen(false)}
            />

            {/* Warning List Modal */}
            <WarningListModal
                    isOpen={isWarningListOpen}
                    onClose={() => setIsWarningListOpen(false)}
            />

            {/* Delete User Modal */}
            <Modal isOpen={isDeleteUserModalOpen} onClose={closeDeleteUserModal}>
            <ModalOverlay />
            <ModalContent bg="linear-gradient(to top left, #ffecd2, #fcb69f)" border={"2px solid black"}>
              <ModalHeader>Confirm User Deletion</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Text>
                  The user has exceeded the warning threshold. Do you want to delete this user?
                </Text>
              </ModalBody>
              <ModalFooter>
                <Button
                  colorScheme="red"
                  onClick={handleDeleteUser}
                >
                  Delete
                </Button>
                <Button onClick={closeDeleteUserModal}>Cancel</Button>
              </ModalFooter>
            </ModalContent>
          </Modal>

    </>
          );
        };

        

export default ReportListModal;