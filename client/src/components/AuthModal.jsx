import React, { useState } from "react";
import { 
    Modal, 
    ModalOverlay, 
    ModalContent, 
    ModalHeader, 
    ModalCloseButton, 
    ModalBody 
} from '@chakra-ui/react';
import LoginForm from "./LoginForm";
import SignUpForm from "./SIgnUpForm";

const AuthModal = ({ isOpen, onClose }) => {
    const [isLogin, setIsLogin] = useState(true);

    const switchToSignUp = () => setIsLogin(false);
    const switchToLogin = () => setIsLogin(true);

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="lg">
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>{isLogin ? "Login": "Sign Up"}</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    {isLogin ? (
                        <LoginForm onClose={onClose} switchToSignUp={switchToSignUp} />
                    ) : (
                        <SignUpForm onClose={onClose} switchToLogin={switchToLogin} />
                    )}
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};