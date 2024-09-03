import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PeriodoState {
  periodoActual: string;
}

const initialState: PeriodoState = {
  periodoActual: '',
};

const periodoSlice = createSlice({
  name: 'periodo',
  initialState,
  reducers: {
    setPeriodoActual: (state, action: PayloadAction<string>) => {
      state.periodoActual = action.payload;
    },
  },
});

export const { setPeriodoActual } = periodoSlice.actions;
export default periodoSlice.reducer;
