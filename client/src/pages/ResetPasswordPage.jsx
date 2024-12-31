import { useState } from "react";
import { motion } from "framer-motion";
import { Box, Button, Flex, Input, Text, useToast } from "@chakra-ui/react";
import { useAuthStore } from "../store/authStore";
import { useParams } from "react-router-dom";
import { TbPasswordUser as PasswordIcon } from "react-icons/tb";
import kitchen from "../pic/kitchen-benchtop-materials.jpg";

const ResetPasswordPage = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { resetPassword, isLoading } = useAuthStore();

  const { token } = useParams();
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      setIsSubmitted(false);
      return;
    }

    try {
      await resetPassword(token, password);
      toast({
        title: "Success",
        description: "Password reset successfully. You can now close this page.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Error resetting password.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });

      setIsSubmitted(false);
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
            Reset Password
          </Text>

          {!isSubmitted ? (
            <form onSubmit={handleSubmit}>
              <Flex direction="column" gap="4" mb="6">
                <Input
                  type="password"
                  placeholder="New Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  fontSize="md"
                  fontWeight="bold"
                  bg="white"
                  border="none"
                  borderRadius="md"
                  _focus={{
                    outline: "none",
                    borderColor: "blue.400",
                    boxShadow: "0 0 0 2px green.400",
                  }}
                  required
                />

                <Input
                  type="password"
                  placeholder="Confirm New Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  fontSize="md"
                  fontWeight="bold"
                  bg="white"
                  border="none"
                  borderRadius={"md"}
                  _focus={{
                    outline: "none",
                    borderColor: "blue.400",
                    boxShadow: "0 0 0 2px green.400",
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
                  Reset Password
                </Button>
              </motion.div>
            </form>
          ) : (
            <motion.div
              initial={{ scale: 0}}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
              <Flex
                width="16"
                height="16"
                bg="green.500"
                rounded={"full"}
                align={"center"}
                justify={"center"}
                alignItems={"center"}
                mx={"auto"}
                mb={"4"}
              >
                <PasswordIcon size={"36"} />
              </Flex>
              <Text fontSize={"sm"} color={"green.500"}>
                Password Reset Successful, you can now close this page and return to log in.
              </Text>
            </motion.div>
          )}
        </motion.div>
      </Box>
    </Flex>
  );
};

export default ResetPasswordPage;
