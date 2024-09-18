import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  useToast,
} from '@chakra-ui/react';
import DatePicker from 'react-datepicker';
import axios from 'axios';
import { API_ADDRESS } from 'variables/apiSettings';

interface AddRecaudacionModalProps {
  isOpen: boolean;
  onClose: () => void;
  saldoId: number;
  onRecaudacionAdded: () => void;
}

const AddRecaudacionModal: React.FC<AddRecaudacionModalProps> = ({ isOpen, onClose, saldoId, onRecaudacionAdded }) => {
  const [recaudacion, setRecaudacion] = useState({
    fecha: new Date(),
    monto: 0,
    metodo_pago: '',
    descripcion: '',
  });
  const toast = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setRecaudacion(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date: Date) => {
    setRecaudacion(prev => ({ ...prev, fecha: date }));
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post(
        `${API_ADDRESS}recaudaciones/`,
        {
          ...recaudacion,
          id_saldo: saldoId,
          fecha: recaudacion.fecha.toISOString().split('T')[0],
        },
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("access_token")}`
          }
        }
      );
      toast({
        title: 'Recaudación agregada',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onRecaudacionAdded();
      onClose();
    } catch (error) {
      console.error('Error al agregar recaudación:', error);
      toast({
        title: 'Error al agregar recaudación',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Agregar Recaudación</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl>
            <FormLabel>Fecha</FormLabel>
            <DatePicker
              selected={recaudacion.fecha}
              onChange={handleDateChange}
              dateFormat='dd-MM-yyyy'
              customInput={<Input />}
            />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Monto</FormLabel>
            <Input
              type="number"
              name="monto"
              value={recaudacion.monto}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Método de Pago</FormLabel>
            <Select
              name="metodo_pago"
              value={recaudacion.metodo_pago}
              onChange={handleChange}
            >
              <option value="contado">Contado</option>
              <option value="credito">Crédito</option>
            </Select>
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Descripción</FormLabel>
            <Input
              name="descripcion"
              value={recaudacion.descripcion}
              onChange={handleChange}
            />
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
            Guardar
          </Button>
          <Button onClick={onClose}>Cancelar</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AddRecaudacionModal;