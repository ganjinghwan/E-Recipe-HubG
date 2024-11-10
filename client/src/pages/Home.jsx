// src/pages/Home.jsx

import React from 'react';
import {
  Box,
  Flex,
  Heading,
  Text,
  Button,
  Link,
  useBreakpointValue,
} from '@chakra-ui/react';
import homeBackground from '../pic/dine.jpg';
import { Link as RouterLink } from 'react-router-dom';

const Home = () => {
  return (
    <Flex
      direction="column"
      justify="center"
      align="center"
      h="100vh"
      bgImage={`url(${homeBackground})`}
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
          fontSize={useBreakpointValue({ base: '3xl', md: '4xl', lg: '5xl' })}
          color="white"
          textShadow="2px 2px 4px rgba(0, 0, 0, 0.8)"
          mb={4}
          fontFamily="'Poppins', sans-serif"
        >
          BE THE CHEF OF YOUR KITCHEN
        </Heading>

        <Text
          fontSize={useBreakpointValue({ base: 'md', md: 'lg' })}
          color="gray.300"
          textShadow="1px 1px 3px rgba(0, 0, 0, 0.7)"
          mb={6}
          fontFamily="'Poppins', sans-serif"
        >
          From Breakfast to Dinner, We Have You Covered
        </Text>

        <Button
          as={RouterLink}
          to="/recipes"
          size="lg"
          colorScheme="orange"
          borderRadius="full"
          boxShadow="md"
          _hover={{
            transform: 'scale(1.05)',
            boxShadow: 'lg',
          }}
          transition="all 0.3s"
        >
          Get Cooking Now
        </Button>
      </Flex>
    </Flex>
  );
};

export default Home;
