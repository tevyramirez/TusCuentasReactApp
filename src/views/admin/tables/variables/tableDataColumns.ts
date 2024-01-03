type RowObj = {
  name: string;
  progress: string;
  quantity: number;
  date: string;
};

const tableDataCondominiumsColumns: RowObj[] = [
  {
    name: 'Condominio Central',
    quantity: 125,
    progress: '25.5%',
    date: '15 Abr 2023',
  },
  {
    name: 'Residencial Bella Vista',
    quantity: 78,
    progress: '18.2%',
    date: '10 Mar 2023',
  },
  {
    name: 'Torres del Parque',
    quantity: 45,
    progress: '12.8%',
    date: '5 Feb 2023',
  },
  {
    name: 'Vista Hermosa Condos',
    quantity: 60,
    progress: '31.1%',
    date: '20 Mar 2023',
  },
  {
    name: 'Condominio Pacifico',
    quantity: 30,
    progress: '8.5%',
    date: '2 Ene 2024',
  },
];

export default tableDataCondominiumsColumns;
