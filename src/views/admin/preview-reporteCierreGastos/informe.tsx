import React, { useState, useEffect } from 'react';
import {
  Box,
  Select,
  Input,
  VStack,
  Text,
  Flex,
  Heading,
} from '@chakra-ui/react';
import PaymentNoticePreview from './pdf';
import { API_ADDRESS } from '../../../variables/apiSettings'

interface Owner {
  id: number;
  nombre: string;
  apellido: string;
  rut: string;
  razon_social: string;
  email: string;
  numero_telefono: string;
  estado: number;
}

function OwnerSelector({ onOwnerSelect }: { onOwnerSelect: (owner: Owner) => void }) {
  const [owners, setOwners] = useState<Owner[]>([]);
  const [filteredOwners, setFilteredOwners] = useState<Owner[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Fetch owners from API
    const fetchOwners = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const response = await fetch(`${API_ADDRESS}todos-los-propietarios/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
        });
        const data = await response.json();
        setOwners(data);
        setFilteredOwners(data);
      } catch (error) {
        console.error("Error fetching owners:", error);
      }
    };

    fetchOwners();
  }, []);

  useEffect(() => {
    const filtered = owners.filter(owner => 
      owner.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      owner.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
      owner.rut.includes(searchTerm)
    );
    setFilteredOwners(filtered);
  }, [searchTerm, owners]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOwner = owners.find(owner => owner.id === parseInt(event.target.value));
    if (selectedOwner) {
      onOwnerSelect(selectedOwner);
    }
  };

  return (
    <VStack spacing={4} align="stretch">
      <Input
        placeholder="Buscar por nombre o RUT"
        value={searchTerm}
        onChange={handleSearch}
      />
      <Select placeholder="Seleccionar propietario" onChange={handleSelect}>
        {filteredOwners.map(owner => (
          <option key={owner.id} value={owner.id}>
            {`${owner.nombre} ${owner.apellido} - ${owner.rut}`}
          </option>
        ))}
      </Select>
    </VStack>
  );
}

export default function Component() {
  const [selectedOwner, setSelectedOwner] = useState<Owner | null>(null);

  const handleOwnerSelect = (owner: Owner) => {
    setSelectedOwner(owner);
    // Here you would typically fetch the payment notice data for the selected owner
    // and update the PaymentNoticePreview component
  };

  return (
    <Box>
      <Heading size="md" mb={4}>Informe de Cierre de Período</Heading>
      <OwnerSelector onOwnerSelect={handleOwnerSelect} />
      {selectedOwner && (
        <Flex direction="column" mt={4} p={4} bg="gray.100" borderRadius="md">
          <Text><strong>Nombre:</strong> {selectedOwner.nombre} {selectedOwner.apellido}</Text>
          <Text><strong>RUT:</strong> {selectedOwner.rut}</Text>
          <Text><strong>Email:</strong> {selectedOwner.email}</Text>
          <Text><strong>Teléfono:</strong> {selectedOwner.numero_telefono}</Text>
        </Flex>
      )}
      <Box mt={6}>
        <PaymentNoticePreview />
      </Box>
    </Box>
  );
}