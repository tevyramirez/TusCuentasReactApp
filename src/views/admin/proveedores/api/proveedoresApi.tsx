import api from 'services/api';
import { Proveedor, ProveedorCreate, ProveedorResponse } from 'types/proveedores';

export const obtenerProveedores = async (): Promise<Proveedor[]> => {
  try {
    const response = await api.get<ProveedorResponse | Proveedor[]>('proveedores/');
    const data = Array.isArray(response.data) ? response.data : response.data.results ?? [];
    const dataMapped: Proveedor[] = data.map((item: Proveedor) => ({
      nombre: item.nombre,
      apellido: item.apellido,
      email: item.email,
      numero_telefono: item.numero_telefono,
      razon_social: item.razon_social,
      rut: item.rut,
      servicio: item.servicio,
      id: item.id ?? item.id_proveedor ?? item.pk,
    }));
    console.log('API Connected Proveedores');
    return dataMapped;
  } catch (error) {
    console.error('Error al obtener los propietarios:', error);
    throw error;
  }
};

export const guardarProveedores = async (proveedor: ProveedorCreate) => {
  try {
    const response = await api.post('proveedores/', proveedor, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log('Proveedor guardado:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error al guardar el proveedor:', error);
    throw error;
  }
};