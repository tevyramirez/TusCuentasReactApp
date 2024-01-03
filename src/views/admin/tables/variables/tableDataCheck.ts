type RowObj = {
  name: [string, boolean];
  progress: string;
  quantity: number;
  date: string;
};

const tableDataCondominiums: RowObj[] = [
  {
    name: ['Condominio Central', true],
    quantity: 125,
    progress: '25.5%',
    date: '15 Abr 2023',
  },
  {
    name: ['Residencial Bella Vista', true],
    quantity: 78,
    progress: '18.2%',
    date: '10 Mar 2023',
  },
  {
    name: ['Torres del Parque', true],
    quantity: 45,
    progress: '12.8%',
    date: '5 Feb 2023',
  },
  {
    name: ['Vista Hermosa Condos', true],
    quantity: 60,
    progress: '31.1%',
    date: '20 Mar 2023',
  },
  {
    name: ['Condominio Pacifico', true],
    quantity: 30,
    progress: '8.5%',
    date: '2 Ene 2024',
  },
];

export default tableDataCondominiums;
