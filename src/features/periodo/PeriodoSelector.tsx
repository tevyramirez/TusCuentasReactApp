import React from 'react';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { setPeriodoActual } from './periodoSlice';

const PeriodoSelector = () => {
  const periodoActual = useAppSelector((state) => state.periodo.periodoActual);
  const dispatch = useAppDispatch();

  const cambiarPeriodo = (nuevoPeriodo: string) => {
    dispatch(setPeriodoActual());
  };

  return (
    <div>
      <h2>Periodo Actual: {periodoActual}</h2>
      <button onClick={() => cambiarPeriodo('2024-10')}>Cambiar a Octubre 2024</button>
    </div>
  );
};

export default PeriodoSelector;
