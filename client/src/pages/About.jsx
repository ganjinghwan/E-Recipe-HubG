// src/pages/About.jsx

import React from 'react';
import { Box, Flex, Heading, Text } from '@chakra-ui/react';
import aboutBackground from '../pic/smallwall.jpg'; // Replace with your actual image path

const About = () => {
  return (
    <Flex
      direction="column"
      justify="center"
      align="center"
      h="100vh"
      bgImage={`url(${aboutBackground})`}
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
        bg="blackAlpha.600" // Semi-transparent overlay
        zIndex="0"
      />

      {/* Content */}
      <Flex
        direction="column"
        align="center"
        zIndex="1"
        px={4}
      >
        <Heading
          as="h1"
          fontSize={{ base: '3xl', md: '4xl', lg: '5xl' }}
          color="white"
          textShadow="2px 2px 4px rgba(0, 0, 0, 0.8)"
          mb={4}
          fontFamily="'Poppins', sans-serif"
        >
          About Us
        </Heading>

        <Text
          fontSize={{ base: 'md', md: 'lg' }}
          color="gray.300"
          textShadow="1px 1px 3px rgba(0, 0, 0, 0.7)"
          mb={6}
          fontFamily="'Poppins', sans-serif"
          maxW="600px"
        >
          Welcome to E-Recipes Hub! Here, we empower you to create delicious meals
          with ease. Explore our curated collection of recipes, designed to inspire 
          chefs of all skill levels. Let’s cook something amazing together!
        </Text>
      </Flex>
    </Flex>
  );
};

export default About;
