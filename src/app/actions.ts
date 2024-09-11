export const SET_PERIODO = 'SET_PERIODO';

export interface Periodo {
    id_periodo: number;
    fecha_inicio: string;
    fecha_fin: string;
    estado: string;
}

export const setPeriodo = (nuevoPeriodo: Periodo) => {
  return {
    type: SET_PERIODO,
    payload: nuevoPeriodo,
  };
}