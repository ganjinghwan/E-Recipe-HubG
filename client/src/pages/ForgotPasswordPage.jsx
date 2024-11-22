import { motion } from "framer-motion";
import { useState } from "react";
import { Box, Button, Flex, Input, Text, useToast } from "@chakra-ui/react";
import { FiMail as Mail } from "react-icons/fi";
import { useAuthStore } from "../store/authStore";
import { Link } from "react-router-dom";
import kitchen from "../pic/kitchen-benchtop-materials.jpg";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const toast = useToast();
  const { isLoading, forgotPassword } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await forgotPassword(email);
      setIsSubmitted(true);
      toast({
        title: "Success",
        description: `If an account exists for ${email}, you will receive a password reset link shortly.`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Something went wrong. Please try again later.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Flex
      direction="column"
      justify="center"
      align="center"
      h="100vh"
      bgImage={`url(${kitchen})`}
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
        maxW="md"
        w="full"
        bg="rgba(255, 255, 255, 0.8)" // Light semi-transparent background
        boxShadow="lg"
        borderRadius="xl"
        p="8"
        textAlign="center"
        color="black"
        zIndex="1"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Text
            fontSize="3xl"
            fontWeight="bold"
            mb="6"
            bgGradient="linear(to-r, teal.500, blue.600)"
            bgClip="text"
          >
            Forgot Password
          </Text>

          {!isSubmitted ? (
            <form onSubmit={handleSubmit}>
              <Text fontSize="sm" color="gray.600" mb="6">
                Enter your email address, and we'll send you a link to reset your password.
              </Text>
              <Flex
                align="center"
                gap="2"
                bg="white"
                p="2"
                borderRadius="md"
                mb="6"
                border="1px solid"
                borderColor="gray.400"
              >
                <Mail className="w-5 h-5 text-gray.400" />
                <Input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  fontSize="md"
                  fontWeight="bold"
                  bg="transparent"
                  border="none"
                  _focus={{
                    outline: "none",
                    borderColor: "blue.400",
                    boxShadow: "0 0 0 2px blue.400",
                  }}
                  required
                />
              </Flex>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  type="submit"
                  w="full"
                  h="12"
                  bgGradient="linear(to-r, blue.400, teal.500)"
                  color="white"
                  fontWeight="bold"
                  _hover={{
                    bgGradient: "linear(to-r, blue.500, teal.600)",
                  }}
                  isLoading={isLoading}
                >
                  Send Reset Password Email
                </Button>
              </motion.div>
            </form>
          ) : (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
              <Flex
                w="16"
                h="16"
                bg="green.500"
                rounded="full"
                align="center"
                justify="center"
                mx="auto"
                mb="4"
              >
                <Mail className="w-8 h-8 text-white" />
              </Flex>
              <Text fontSize="sm" color="gray.600">
                If an account exists for {email}, you will receive a password reset link shortly.
              </Text>
            </motion.div>
          )}
        </motion.div>
      </Box>

      <Box mt="4" zIndex={"1"}>
        <Link to="/">
          <Flex
            align="center"
            color="teal.300"
            fontSize="sm"
            fontWeight="bold"
            _hover={{ textDecoration: "underline" }}
            cursor={"pointer"}
          >
            Back to Homepage
          </Flex>
        </Link>
      </Box>
    </Flex>
  );
};

export default ForgotPasswordPage;
