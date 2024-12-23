import React, { useEffect, useState, useRef } from "react";
import { 
    Box, 
    Button, 
    Flex, 
    Input, 
    Text,
    useToast,  
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import spicepicture from "../pic/spicespic.jpg";
import { motion } from "framer-motion";

const UpdateVerificationPage = () => {
    const [updateCode, setUpdateCode] = useState(["", "", "", "", "", ""]);
    const inputRefs = useRef([]);
    const toast = useToast();
    const navigate = useNavigate();
  
    const { error, isLoading, verifyUpdate } = useAuthStore();
  
    // Handle input change
    const handleChange = (index, value) => {
      const newCode = [...updateCode];
  
      // Handle pasted content
      if (value.length > 1) {
        const pastedCode = value.slice(0, 6).split("");
        for (let i = 0; i < 6; i++) {
          newCode[i] = pastedCode[i] || "";
        }
        setUpdateCode(newCode);
  
        const firstEmptyIndex = newCode.findIndex((digit) => digit === "");
        const focusIndex = firstEmptyIndex !== -1 ? firstEmptyIndex : 5; // Focus on the first empty box or the last box
        inputRefs.current[focusIndex]?.focus();
      } else {
        // Handle single character input
        newCode[index] = value;
        setUpdateCode(newCode);
  
        // Move focus to the next input field if value is entered
        if (value && index < 5) {
          inputRefs.current[index + 1]?.focus();
        }
      }
    };
  
    const handleKeyDown = (index, e) => {
      if (e.key === "Backspace" && !updateCode[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      const verificationCode = updateCode.join("");
      try {
        await verifyUpdate(verificationCode);
        toast({
          title: "Success",
          description: "Update verified successfully, redirect to homepage...",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        navigate("/");
      } catch (error) {
        console.log(error);
      }
    };
  
    // Auto-submit when all fields are filled
    useEffect(() => {
      if (updateCode.every((digit) => digit !== "")) {
        handleSubmit(new Event("submit"));
      }
    }, [updateCode]);

    return (
        <Flex
          direction="column"
          justify="center"
          align="center"
          h="100vh"
          bgImage={`url(${spicepicture})`}
          bgSize="cover"
          bgPosition="center"
          bgRepeat="no-repeat"
          position="relative"
          textAlign="center"
        >
    
        {/* Overlay */}
         <Box
           position="absolute"
           top="0"
           left="0"
           w="100%"
           h="100%"
           bg="blackAlpha.700" // Semi-transparent overlay
           zIndex="0"
        />
          <Box
            position="relative"
            zIndex="1" // Ensures the form stays on top
            maxW="400px"
            margin="0 auto"
            mt="100px"
            p="8"
            bg="gray.800"
            borderRadius="lg"
            boxShadow="lg"
            textAlign="center"
            color="yellow.500"
          >
            <motion.div
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Text
                fontSize="2xl"
                fontWeight="bold"
                bgGradient="linear(to-r, green.400, green.600)"
                bgClip="text"
                mb="4"
              >
                Verify Your Email
              </Text>
              <Text fontSize="sm" color="gray.300" mb="6">
                Please enter the 6-digit code sent to your email address to confirm update.
              </Text>
    
              <form onSubmit={handleSubmit}>
                <Flex justifyContent="center" gap="4" mb="6">
                  {updateCode.map((digit, index) => (
                    <Input
                      key={index}
                      ref={(el) => (inputRefs.current[index] = el)}
                      type="text"
                      maxLength="6"
                      value={digit}
                      onChange={(e) => handleChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      width="40px"
                      height="50px"
                      fontSize="lg"
                      textAlign="center"
                      fontWeight="bold"
                      bg="gray.700"
                      color="white"
                      borderRadius="md"
                      _focus={{
                        borderColor: "green.400",
                        boxShadow: "0 0 0 2px green.400",
                      }}
                      border="2px solid"
                      borderColor="gray.600"
                      padding="0"
                    />
                  ))}
                </Flex>
    
                {error && (
                  <Text fontSize="sm" color="red.400" mb="4">
                    {error}
                  </Text>
                )}
    
                <Button
                  type="submit"
                  isLoading={isLoading}
                  loadingText="Verifying..."
                  disabled={isLoading || updateCode.some((digit) => !digit)}
                  w="full"
                  bgGradient="linear(to-r, green.400, green.600)"
                  color="white"
                  fontWeight="bold"
                  _hover={{
                    bgGradient: "linear(to-r, green.500, green.700)",
                  }}
                >
                  Confirm Update Profile
                </Button>
              </form>
            </motion.div>
          </Box>
        </Flex>
      );
};

export default UpdateVerificationPage;
