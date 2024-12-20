/*import { Flex, Text, useToast } from "@chakra-ui/react";
import { useState } from "react";
import { useCookStore } from "../store/cookStore";
import { useNavigate } from "react-router-dom";

const CreateCookInfoPage = () => {
    const [specialty, setSpecialty] = useState("");
    const [experience, setExperience] = useState("");
    const toast = useToast();
    const navigate = useNavigate();
    const [isSubmitted, setIsSubmitted] = useState(false);
    const { newInfo, isLoading, error } = useCookStore();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitted(true);
        try {
            await newInfo(specialty, experience);
            setIsSubmitted(true);
            toast({
                title: "Success",
                description: "Cook information added successfully.",
                status: "success",
                duration: 5000,
                isClosable: true,
            });
            navigate("/");
        } catch (cookInfoError) {
            const messages = cookInfoError.response?.data?.messages || ["An unexpected error occured"];

            messages.forEach((message) => {
                toast({
                    position: "bottom",
                    title: "Fail to add new cook info",
                    description: message,
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                });
            });

            clearForm();
        }
    };

    const clearForm = () => {
        setSpecialty(""); // Clear specialty field
        setExperience(""); // Clear experience field
    };

    return (
       <Flex 
        align="center"
        justify="center"
        height="100vh"
        bgColor={"yellow.50"}
       >
        <Text>
            Testing purpose
        </Text>
       </Flex> 
    )
}*/