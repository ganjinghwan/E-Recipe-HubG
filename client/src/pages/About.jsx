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
          maxW="900px"
        >
          Welcome to E-Recipe Hub! Whether you're a passionate cook, an eager guest, a dedicated event organizer, or a vigilant moderator, we bring the culinary community together. 
          Discover and share recipes, engage with fellow food enthusiasts, and participate in exciting cooking events. 
          With our curated collection of recipes and interactive features, creating delicious meals has never been easier. 
          Let's cook, share, and celebrate flavors together!
          <br />
          <br />
          E-Recipe Hub is a dynamic platform designed for culinary enthusiasts to create, 
          share, and explore diverse recipes. It brings together by four roles:
          Moderators, who ensure a safe and engaging community by managing reports and maintaining platform standards.
          Cooks, who craft and share their recipes with multimedia elements while engaging with users through feedback and ratings.
          Event Organizers, who create and manage cooking-related events, inviting participants to showcase their culinary talents.
          Guests, who explore recipes, rate dishes, and participate in discussions, making the platform interactive and engaging for all.
        </Text>
      </Flex>
    </Flex>
  );
};

export default About;
