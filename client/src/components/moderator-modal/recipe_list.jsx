import React from "react";
import {
  Box,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Flex,
  Text,
  IconButton,
  useToast,
} from "@chakra-ui/react";


const RecipeListModal = ({ isOpen, onClose }) => {

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="xl">
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Recipe List</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <RecipeList />
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default RecipeListModal;