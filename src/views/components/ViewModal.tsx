import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
} from "@chakra-ui/react";

type ViewModalProps = {
  isOpen: boolean;
  onClose: () => void;
  data: any;
};

const ViewModal: React.FC<ViewModalProps> = ({ isOpen, onClose, data }) => {
    console.log(data)
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Detalle del Propietario</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
        {data ? (
                Object.keys(data).map((key) => (
                    <p key={key}>
                      {key}: {data[key]}
                    </p>
          ))) : (
            <p>Cargando datos...</p>
          )}
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" onClick={onClose}>
            Cerrar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ViewModal;
