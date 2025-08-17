import axios from 'axios';
import { Proveedor } from 'types/proveedores';

export const obtenerProveedores = async () => {
  try {
    const data = await axios.get("http://localhost:8000/api/proveedores/");
    const dataMapped = data.data.map((item:Proveedor) => ({
      nombre: item.nombre,
      apellido: item.apellido,
      email: item.email,
      numero_telefono: item.numero_telefono,
      razon_social: item.razon_social,
    }));
    console.log("API Connected Proveedores")
    return dataMapped;
  } catch (error) {
    console.error("Error al obtener los propietarios:", error);
    throw error;
  }
};

export const guardarProveedores = async (proveedor: Proveedor) => {
  try {
    let token = localStorage.getItem('token');
    console.log("Token:", token);
    const response = await axios.post("http://localhost:8000/api/proveedores/", proveedor, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      }
    });
    console.log("Proveedor guardado:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error al guardar el proveedor:", error);
    throw error;
  }
}