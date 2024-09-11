import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PeriodoState {
  periodoActual: number;
}

const initialState: PeriodoState = {
  periodoActual: 0,
};

const periodoSlice = createSlice({
  name: 'periodo',
  initialState,
  reducers: {
    setPeriodoActual: (state, action: PayloadAction<number>) => {
      state.periodoActual = action.payload;
    },
  },
});

export const { setPeriodoActual } = periodoSlice.actions;
export default periodoSlice.reducer;
