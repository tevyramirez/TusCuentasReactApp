import React from 'react';
import { Box, Text } from '@chakra-ui/react';
import { FaRegSadCry } from "react-icons/fa";


const NoDataMessage: React.FC = () => {
    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            p={4}
            borderWidth={1}
            borderRadius="md"
            boxShadow="md"
            backgroundColor="white"
        >
            <FaRegSadCry size={50} color="blue" />
            <Text fontSize="2xl" fontWeight="bold">
                ¡Ups!   
            </Text>
            <Text mt={2} fontSize="lg">
                No hay datos disponibles
            </Text>
        </Box>
    );
};

export default NoDataMessage;