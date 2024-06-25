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
  Grid,
  GridItem,
  FormControl,
  FormLabel,
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
          <FormControl>
            {formData && (
              <VStack spacing={3} align="stretch">
                {Object.keys(formData).map((key) => (
                  <Grid templateColumns="150px 1fr" gap={4} alignItems="center" key={key}>
                    <GridItem>
                      <FormLabel htmlFor={key} mb="0">
                        {key}:
                      </FormLabel>
                    </GridItem>
                    <GridItem>
                      <Input
                        id={key}
                        name={key}
                        value={formData[key]}
                        onChange={handleChange}
                        placeholder={key}
                      />
                    </GridItem>
                  </Grid>
                ))}
              </VStack>
            )}
          </FormControl>
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
