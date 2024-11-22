import React from "react";
import { Flex, Box, Text, List, ListItem, Icon } from "@chakra-ui/react";
import { CheckIcon, CloseIcon } from "@chakra-ui/icons";

const PasswordCriteria = ({ password }) => {
  const criteria = [
    { label: "At least 6 characters", met: password.length >= 6 },
    { label: "At least one uppercase letter", met: /[A-Z]/.test(password) },
    { label: "At least one lowercase letter", met: /[a-z]/.test(password) },
    { label: "At least one number", met: /\d/.test(password) },
    { label: "At least one special character", met: /[^A-Za-z0-9]/.test(password) },
  ];

  return (
    <List spacing={2} mt={2}>
      {criteria.map((item) => (
        <ListItem key={item.label} display="flex" alignItems="center" fontSize="sm">
          <Icon
            as={item.met ? CheckIcon : CloseIcon}
            color={item.met ? "green.500" : "gray.500"}
            mr={2}
          />
          <Text color={item.met ? "green.500" : "gray.500"}>{item.label}</Text>
        </ListItem>
      ))}
    </List>
  );
};

const PasswordStrengthMeter = ({ password }) => {
  const getStrength = (pass) => {
    let strength = 0;
    if (pass.length >= 6) strength++;
    if (pass.match(/[A-Z]/) && pass.match(/[a-z]/)) strength++;
    if (pass.match(/\d/)) strength++;
    if (pass.match(/[^A-Za-z0-9]/)) strength++;
    return strength;
  };

  const strength = getStrength(password);

  const getColor = (strength) => {
    if (strength === 0) return "red.500";
    if (strength === 1) return "orange.500";
    if (strength === 2) return "yellow.500";
    if (strength === 3) return "green.500";
    return "green.500";
  };

  const getStrengthText = () => {
    switch (strength) {
      case 0:
        return "Very Weak";
      case 1:
        return "Weak";
      case 2:
        return "Medium";
      case 3:
        return "Strong";
      default:
        return "Very Strong";
    }
  };

  return (
    <Box mt={4}>
      {/* Strength Label */}
      <Flex justify="space-between" align="center" mb={2}>
        <Text fontSize="sm" color="black.400">
          Password Strength:  {getStrengthText()}
        </Text>
      </Flex>

      {/* Single Full Strength Meter Bar */}
      <Box
        h="8px" // Adjust height for better visibility
        w="100%" // Full width
        bg={getColor(strength)} // Color changes based on strength
        borderRadius="md" // Rounded edges
        transition="background-color 0.3s ease" // Smooth color transition
      />

      {/* Criteria Checklist */}
      <PasswordCriteria password={password} />
    </Box>
  );
};

export default PasswordStrengthMeter;
