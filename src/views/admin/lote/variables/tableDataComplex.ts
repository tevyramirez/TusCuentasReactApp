type RowObj = {
	unidad: string;
	residente: string;
	cobrado: number;
	pagado: number;
	saldo: number;
  };
  
  const tableDataComplex: RowObj[] = [
	{
	  unidad: 'Departamento 101',
	  pagado: 75000,
	  residente: 'Juan Pérez',
	  cobrado: 120000,
	  saldo: 45000,
	},
	{
	  unidad: 'Departamento 202',
	  pagado: 25500,
	  residente: 'Ana González',
	  cobrado: 50000,
	  saldo: 24500,
	},
	{
	  unidad: 'Casa A-01',
	  pagado: 90000,
	  residente: 'Pedro Ramírez',
	  cobrado: 120000,
	  saldo: 30000,
	},
	{
	  unidad: 'Oficina 301',
	  pagado: 50500,
	  residente: 'María Rodríguez',
	  cobrado: 75000,
	  saldo: 24500,
	},
  ];
  
  export default tableDataComplex;
  