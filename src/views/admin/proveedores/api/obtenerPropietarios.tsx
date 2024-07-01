import axios from 'axios';

export const obtenerPropietarios = async () => {
  try {
    const data = await axios.get("http://localhost:8000/api/propietarios/");
    const dataMapped = data.data.map((item:any) => ({
      nombre: item.nombre,
      apellido: item.apellido,
      email: item.email,
      numero_telefono: item.numero_telefono,
      razon_social: item.razon_social,
      alicuota: item.alicuota
    }));
    console.log("API Connected Propietarios")
    return dataMapped;
  } catch (error) {
    console.error("Error al obtener los propietarios:", error);
    throw error;
  }
};
