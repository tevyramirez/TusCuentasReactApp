import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Input,
  VStack,
} from "@chakra-ui/react";

type EditModalProps = {
  isOpen: boolean;
  onClose: () => void;
  data: any | null;
  onSave: (updatedData: any) => void;
};

const EditModal: React.FC<EditModalProps> = ({ isOpen, onClose, data, onSave }) => {
  const [formData, setFormData] = useState<any>(data || {});

  useEffect(() => {
    if (data) {
      setFormData(data);
    }
  }, [data]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Editar Detalle</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {formData && (
            <VStack spacing={3}>
              {Object.keys(formData).map((key) => (
                <Input
                  key={key}
                  name={key}
                  value={formData[key]}
                  onChange={handleChange}
                  placeholder={key}
                />
              ))}
            </VStack>
          )}
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" onClick={handleSave}>
            Guardar
          </Button>
          <Button onClick={onClose}>Cancelar</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditModal;
