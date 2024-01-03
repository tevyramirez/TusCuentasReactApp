type RowObj = {
	name: string;
	status: string;
	date: string;
	progress: number;
  };
  
  const tableDataCondominiumsComplex: RowObj[] = [
	{
	  name: 'Condominio Central',
	  progress: 75.5,
	  status: 'Aprobado',
	  date: '15 Abr 2023',
	},
	{
	  name: 'Residencial Bella Vista',
	  progress: 25.5,
	  status: 'Desactivado',
	  date: '10 Mar 2023',
	},
	{
	  name: 'Torres del Parque',
	  progress: 90,
	  status: 'Error',
	  date: '5 Feb 2023',
	},
	{
	  name: 'Vista Hermosa Condos',
	  progress: 50.5,
	  status: 'Aprobado',
	  date: '20 Mar 2023',
	},
	{
	  name: 'Condominio Pacifico',
	  progress: 65,
	  status: 'En Revisión',
	  date: '2 Ene 2024',
	},
  ];
  
  export default tableDataCondominiumsComplex;
  