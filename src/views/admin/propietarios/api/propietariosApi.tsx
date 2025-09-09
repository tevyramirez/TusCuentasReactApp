import api from '../../../../services/api';

export const obtenerPropietarios = async () => {
  try {
    const response = await api.get('propietarios/');
    const data = response.data;
    const dataMapped = data.map((item: any) => ({
      nombre: item.nombre,
      apellido: item.apellido,
      email: item.email,
      numero_telefono: item.numero_telefono,
      razon_social: item.razon_social,
      alicuota: item.alicuota,
    }));
    console.log('API Connected Propietarios');
    return dataMapped;
  } catch (error) {
    console.error('Error al obtener los propietarios:', error);
    throw error;
  }
};

export const guardarPropietario = async (propietario: any) => {
  try {
    const response = await api.post('propietarios/', propietario);
    console.log('Propietario guardado:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error al guardar el propietario:', error);
    throw error;
  }
};
