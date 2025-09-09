export interface Proveedor {
  rut?: string;
  razon_social?: string;
  numero_telefono?: string;
  id?: number;
  email?: string;
  apellido?: string;
  nombre: string;
  servicio?: string;
  telefono?: string;
  id_proveedor?: number;
  pk?: number;
}

export type ProveedorCreate = Omit<Proveedor, 'id' | 'id_proveedor' | 'pk'>;

export interface ProveedorResponse {
  results?: Proveedor[];
  count?: number;
}
