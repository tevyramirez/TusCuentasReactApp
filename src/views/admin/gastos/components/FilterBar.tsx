import React, { useState } from "react";
import {
  Box,
  Button,
  Input,
  InputGroup,
  InputLeftElement,
  Stack,
  useColorModeValue,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import { AddIcon, SearchIcon, ChevronDownIcon } from "@chakra-ui/icons";

interface FilterBarProps {
  onAddPropietario: () => void;
  onFilterChange: (filters: any) => void;
  onExport: () => void; // Añade esta prop
}

const FilterBar: React.FC<FilterBarProps> = ({ onAddPropietario, onFilterChange, onExport }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("Todos los campos");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    onFilterChange({ search: e.target.value, filterType });
  };

  const handleFilterTypeChange = (type: string) => {
    setFilterType(type);
    onFilterChange({ search: searchTerm, filterType: type });
  };

  return (
    <Box mb={4}>
      <Stack direction={{ base: "column", md: "row" }} spacing={4}>
        <InputGroup>
          <InputLeftElement pointerEvents="none">
            <SearchIcon color="gray.300" />
          </InputLeftElement>
          <Input
            type="text"
            placeholder={`Buscar por ${filterType.toLowerCase()}`}
            value={searchTerm}
            onChange={handleSearchChange}
            borderRadius="md"
            bg={useColorModeValue("white", "gray.700")}
          />
          <Menu>
            <MenuButton
              as={Button}
              rightIcon={<ChevronDownIcon />}
              ml={2}
              borderRadius="md"
              bg={useColorModeValue("white", "gray.700")}
            >
              {filterType}
            </MenuButton>
            <MenuList>
              <MenuItem onClick={() => handleFilterTypeChange("Nombre o Rut")}>
                Nombre o Rut
              </MenuItem>
              <MenuItem onClick={() => handleFilterTypeChange("Email")}>
                Email
              </MenuItem>
            </MenuList>
          </Menu>
        </InputGroup>
        <Button
          leftIcon={<AddIcon />}
          colorScheme="blue"
          onClick={onAddPropietario}
        >
          Gasto
        </Button>
        <Button onClick={onExport} colorScheme="green">Exportar</Button>
      </Stack>
    </Box>
  );
};

export default FilterBar;
