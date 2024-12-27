import React, { useEffect, useState } from "react";
import { useAuthStore } from "../store/authStore";
import { useCookStore } from "../store/cookStore";
import cookSmiling from "../pic/cook-smiling.jpg";
import japaneseCook from "../pic/cook-japanese.jpg";
import cookCurlyhair from "../pic/cook-curlyhair.jpg";
import gordonRamsey from "../pic/gordon-ramsey.jpg";
import { useNavigate } from "react-router-dom";
import { Box, Flex, FormControl, FormLabel, Input, Button, Text, useToast } from "@chakra-ui/react";

const CookInfoFillPage = () => {
    const [cookSpecialty, setCookSpecialty] = useState("");
    const [cookExperience, setCookExperience] = useState("");
    const [hasSubmitted, setHasSubmitted] = useState(false);
    const { newCookInfo, isLoading } = useCookStore();

    const images = [
        { src: cookSmiling, position: "48%" },
        { src: japaneseCook, position: "52%" },
        { src: cookCurlyhair, position: "60%" },
        { src: gordonRamsey, position: "74%" },
    ];

    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFading, setIsFading] = useState(false);

    const toast = useToast();
    const navigate = useNavigate();


    useEffect(() => {
        const interval = setInterval(() => {
          setIsFading(true);
    
          setTimeout(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
            setIsFading(false);
          }, 500);
        }, 5000);
    
        return () => clearInterval(interval);
    }, [images.length]);


    const handleNewCook = async (e) => {
        e.preventDefault();
        setHasSubmitted(true);

        try {
            await newCookInfo(cookSpecialty, cookExperience);
            toast({
                position: "bottom",
                title: "New Cook Info added successfully",
                description: "Welcome Cook! Redirect to homepage...",
                status: "success",
                duration: 5000,
                isClosable: true,
            });
            navigate("/");
        } catch (error) {
            toast({
                position: "bottom",
                title: "Error adding new cook info",
                description: error.response?.data?.message,
                status: "error",
                duration: 5000,
                isClosable: true,
            });

            clearForm();
        }
    };

    const clearForm = () => {
        setCookSpecialty("");
        setCookExperience("");
        setHasSubmitted(false);
    };

    return (
        <Flex
            minH="100vh"
            minW="100vw"
            direction={{ base: "column", md: "row" }}
            overflow="hidden"
        >
            <Box flex={3} bg="white" p={{ base: 4, md: 8, lg: 16 }}>
                <Text fontSize="4xl" color="black" fontWeight="bold" mt={{ base: 0, md: -10 }}>
                    E-Recipes Hub
                </Text>
                <Box mt={3}>
                    <Text fontSize="xl" fontWeight="bold">
                        Welcome Cook! Before continuing, please fill in the information below.
                    </Text>
                </Box>
                <Box as="form" mt={4} onSubmit={handleNewCook}>
                    <FormControl mt={2}>
                        <FormLabel>Specialty:</FormLabel>
                        <Input
                            type="text"
                            borderColor={"black.500"}
                            placeholder="Enter your specialty here"
                            value={cookSpecialty}
                            onChange={(e) => setCookSpecialty(e.target.value)}
                        />
                    </FormControl>

                    <FormControl mt={2}>
                        <FormLabel>Experience:</FormLabel>
                        <Input
                            type="number"
                            borderColor={"black.500"}
                            placeholder="Enter your years of experience here"
                            value={cookExperience}
                            onChange={(e) => setCookExperience(e.target.value)}
                            min={0}
                        />
                    </FormControl>

                    <Box display="flex" justifyContent="space-between" width="100%" mt={4}>
                        <Button colorScheme="red" onClick={() => navigate("/")}>
                            Skip
                        </Button>
                        <Button
                            type="submit"
                            colorScheme="blue"
                            isLoading={isLoading}
                            loadingText="Submitting, please wait..."
                        >
                            Confirm
                        </Button>
                    </Box>
                </Box>
            </Box>

            {/* Right Content */}
            <Box flex={1} bg="orange" p={{ base: 2, md: 4, lg: 8 }} display={{ base: "none", md: "block" }} position="relative" overflow="hidden">
                {images.map((image, index) => (
                <Box
                    key={index}
                    bgImage={`url(${image.src})`}
                    bgRepeat="no-repeat"
                    bgSize="cover"
                    bgPosition={image.position}
                    position="absolute"
                    top={0}
                    left={0}
                    right={0}
                    bottom={0}
                    transition="opacity 1s ease-in-out"
                    opacity={currentIndex === index ? (isFading ? 0 : 1) : 0}
                    zIndex={currentIndex === index ? 1 : 0}
                />
                ))}
            </Box>
        </Flex>
    );
};

export default CookInfoFillPage;
