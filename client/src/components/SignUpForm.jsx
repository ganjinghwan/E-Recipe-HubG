import React, { useEffect, useState } from "react";
import {
  Box,
  Text,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Button,
  HStack,
  useToast,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import cookbook from "../pic/cookbook.png";
import cupcake from "../pic/cupcake.png";
import sandwich from "../pic/sandwich.png";
import PasswordStrengthMeter from "./PasswordStrengthMeter";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import toast from "react-hot-toast";

const MotionImage = motion(Box);

const SignUpForm = ({ onClose, switchToLogin }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("");
  const [localError, setLocalError] = useState({});
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const navigate = useNavigate();
  const toast = useToast();
  const { signup, error: authError, resetState } = useAuthStore();

  const validateFields = () => {
    const errorHandling = {};
    if (!name) {
      errorHandling.name = "Username is required";
    }
    if (!email) {
      errorHandling.email = "Email is required";
    }
    if (!password) {
      errorHandling.password = "Password is required";
    }
    if (!confirmPassword) {
      errorHandling.confirmPassword = "Confirm password is required";
    }
    if (password !== confirmPassword && password !== "") {
      errorHandling.confirmPassword = "Passwords do not match";
    }
    if (!role) {
      errorHandling.role = "Please choose a role";
    }
    
    setLocalError(errorHandling);
    return errorHandling;
  };


  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    setHasSubmitted(true);
    const errors = validateFields();

    if (Object.keys(errors).length > 0) {
      return;
    }

    try {
      await signup(email, password, name, role);
      toast({
        position: "bottom",
        title: "Sign-up successful",
        description: "Please check your email for verification instructions.",
        status: "success",
        duration: 5000,
        isClosable: true,
      })
      navigate("/verify-email");
      onClose();
    } catch (signupError) {
      const messages = signupError.response?.data?.messages || ["An unexpected error occured"];
  
      messages.forEach((message) => {
        toast({
          position: "bottom",
          title: "Sign-up failed",
          description: message,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      });
  
      clearForm();
    }
  };

  const handleSwitchToLogin = () => {
    resetState();
    switchToLogin();
  }

  const clearForm = () => {
    setName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setRole("");
    setLocalError({});
    setHasSubmitted(false);
  };

  useEffect(() => {
    if (hasSubmitted) {
      validateFields();
    }
  }, [name, email, password, confirmPassword, role, hasSubmitted]);

  const roleOptions = [
    { label: "Guest", value: "guest" },
    { label: "User", value: "user" },
    { label: "Event Organizer", value: "event-organizer" },
  ]

  return (
    <Box position="relative" mt="120px" p="4" zIndex="2">
          <MotionImage
            as="img"
            src={cookbook}
            alt="Cookbook"
            position="absolute"
            top={{ base: "-194px", md: "-192px" }}
            width={{ base: "78%", md: "82%" }}
            left={{ base: "4%", md: "0%" }}
            initial={{ opacity: 0, x: 34, y: 70 }}
            animate={{ opacity: 1, x: 34, y: -40 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          />
          <MotionImage
            as="img"
            src={sandwich}
            alt="Sandwich"
            position="absolute"
            top={{ base: "-12px", md: "-24px" }}
            left={{ base: "-30px", md: "-60px" }}
            width={{ base: "100px", md: "116px" }}
            initial={{ opacity: 0, x: 120, y: 100, rotate: -180 }}
            animate={{ opacity: 1, x: 0, y: -70, rotate: -20 }}
            transition={{ duration: 1, delay: 0.4 }}
          />
          <MotionImage
            as="img"
            src={cupcake}
            alt="Cupcake"
            position="absolute"
            bottom={{ base: "600px", md: "600px" }}
            right={{ base: "-70px", md: "-70px" }}
            width={{ base: "108px", md: "120px" }}
            initial={{ opacity: 0, x: -200, y: 100, rotate: -140 }}
            animate={{ opacity: 1, x: 0, y: -206, rotate: 10 }}
            transition={{ duration: 1, delay: 0.4 }}
          />
      
      <Box as="form" onSubmit={handleSignUpSubmit}>
        <Text fontSize="lg" textAlign="center" mb="4">
          Welcome to our E-Recipe Hub! <br />
          Sign up here to get started.
        </Text>
        <FormControl isInvalid={!!localError.name} mb="4">
          <FormLabel>Username</FormLabel>
          <Input
            type="text"
            placeholder="Enter your username"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {localError.name && <FormErrorMessage>{localError.name}</FormErrorMessage>}
        </FormControl>
        
        <FormControl isInvalid={!!localError.email} mb="4">
          <FormLabel>Email</FormLabel>
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {localError.email && <FormErrorMessage>{localError.email}</FormErrorMessage>}
        </FormControl>

        <FormControl isInvalid={!!localError.password} mb="4">
          <FormLabel>Password</FormLabel>
          <Input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {localError.password && <FormErrorMessage>{localError.password}</FormErrorMessage>}
        </FormControl>

        <PasswordStrengthMeter password={password} />

        <FormControl isInvalid={!!localError.confirmPassword} mb="4">
          <FormLabel>Confirm Password</FormLabel>
          <Input
            type="password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {localError.confirmPassword && <FormErrorMessage>{localError.confirmPassword}</FormErrorMessage>}
          {authError && <FormErrorMessage>{authError}</FormErrorMessage>}
        </FormControl>

        <FormControl isInvalid={!!localError.role} mb="4" mt="4">
          <FormLabel>Select Your Role</FormLabel>
          <HStack justifyContent={"center"}>
            {roleOptions.map((option) => (
              <Button
                key={option.value}
                onClick={() => setRole(option.value)}
                variant={role === option.value ? "solid" : "outline"}
                colorScheme={role === option.value ? "teal" : "gray"}
              >
                {option.label}
              </Button>
            ))}
          </HStack>
          {localError.role && <FormErrorMessage>{localError.role}</FormErrorMessage>}
        </FormControl>
        
        <Button type="submit" colorScheme="blue" width="100%">
          Sign Up
        </Button>


        <Text 
         mt = {4}
         fontSize={"sm"}
         textAlign={"center"}
        >
          <Text as="span" color={"red.500"}>
            Already have an account?{" "} 
          </Text>
          <Box 
            as="span" 
            color="teal.500" 
            fontWeight="bold" 
            cursor="pointer" 
            _hover={{ textDecoration: "underline" }}
          > 
            <Link onClick={handleSwitchToLogin}> 
              Login here 
            </Link>
          </Box>
        </Text>
      </Box>
    </Box>
  );
};

export default SignUpForm;
