import { motion } from "framer-motion";
import { Box } from "@chakra-ui/react";

const LoadingSpinner = () => {
  return (
    <Box
      maxH="100vh"
      bgGradient="linear(to-br, gray.900, green.900, emerald.900)"
      display="flex"
      justifyContent="center"
      alignItems="center"
      position="relative"
      overflow="hidden"
    >
      {/* Loading Spinner */}
      <motion.div
        style={{
          width: "60px", // Matches increased width
          height: "60px", // Matches increased height
          borderWidth: "6px", // Adjusted for better visibility
          borderTopWidth: "6px", // Matches border width
          borderStyle: "solid",
          borderColor: "#A0AEC0", // Gray border (matching Chakra gray.400)
          borderTopColor: "#FFA500", // Orange border
          borderRadius: "50%", // Rounded circle
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
    </Box>
  );
};

export default LoadingSpinner;
