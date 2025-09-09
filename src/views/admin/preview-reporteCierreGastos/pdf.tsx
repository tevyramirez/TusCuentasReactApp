import React from 'react';

interface PaymentNoticeData {
  numero_aviso: string;
  periodo: string;
  fecha_emision: string;
  fecha_vencimiento: string;
  propietario: {
    id: number;
    nombre: string;
    rut: string;
    email: string;
    telefono: string;
  };
  lotes: Array<{
    numero_unidad: string;
    saldo_pendiente: number;
    gastos_asignados: number;
  }>;
  resumen_gastos: {
    total_periodo: number;
    pagado: number;
    pendiente: number;
    gastos_comunes: number;
  };
  detalle_deudas: Array<{
    id: number;
    monto: number;
    pendiente: number;
    fecha_vencimiento: string;
    cuota: string;
  }>;
}

interface PaymentNoticePreviewProps {
  data?: PaymentNoticeData;
}

const dummyData = {
  invoiceNumber: '001234',
  period: 'Enero 2025',
  owner: 'Juan Pérez',
  address: 'Calle Principal 123',
  billingMonth: 'Enero',
  issueDate: '01/01/2025',
  dueDate: '15/01/2025',
  lastPaymentAmount: '$50.000',
  lastPaymentDate: '15/12/2024',
  periodCharge: '$45.000',
  commonExpenses: '$40.000',
  reserveFund: '$3.000',
  provisions: '$1.000',
  previousBalance: '$10.000',
  totalAmount: '$99.000',
  information: 'Se informa que la cuenta bancaria de pago es número de folio 3740'
};

export default function PaymentNoticePreview({ data }: PaymentNoticePreviewProps) {
  // Use real data if provided, otherwise fall back to dummy data
  const noticeData = data ? {
    invoiceNumber: data.numero_aviso,
    period: data.periodo,
    owner: data.propietario.nombre,
    address: `Unidad ${data.lotes.map(l => l.numero_unidad).join(', ')}`,
    billingMonth: data.periodo,
    issueDate: data.fecha_emision,
    dueDate: data.fecha_vencimiento,
    lastPaymentAmount: `$${data.resumen_gastos.pagado.toLocaleString()}`,
    lastPaymentDate: 'N/A', // This would need to be calculated from payment history
    periodCharge: `$${data.resumen_gastos.total_periodo.toLocaleString()}`,
    commonExpenses: `$${data.resumen_gastos.gastos_comunes.toLocaleString()}`,
    reserveFund: `$${(data.resumen_gastos.gastos_comunes * 0.1).toLocaleString()}`, // 10% estimate
    provisions: `$${(data.resumen_gastos.gastos_comunes * 0.05).toLocaleString()}`, // 5% estimate
    previousBalance: `$${(data.resumen_gastos.pendiente - data.resumen_gastos.gastos_comunes).toLocaleString()}`,
    totalAmount: `$${data.resumen_gastos.pendiente.toLocaleString()}`,
    information: 'Se informa que la cuenta bancaria de pago es número de folio 3740'
  } : dummyData;

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6">
        <div className="flex justify-between items-start">
          <div className="bg-white text-blue-800 p-2 rounded">
            <span className="font-bold">LOGO</span>
          </div>
          <div className="text-right">
            <h1 className="text-2xl font-bold">AVISO DE COBRO</h1>
            <p>Nombre Comunidad</p>
            <p>Dirección</p>
            <p>RUT: 12.345.678-9</p>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex justify-between mb-6">
          <div>
            <p><span className="font-semibold">Aviso de Cobro N°:</span> {noticeData.invoiceNumber}</p>
            <p><span className="font-semibold">Periodo/Año:</span> {noticeData.period}</p>
            <p><span className="font-semibold">Propietario:</span> {noticeData.owner}</p>
            <p><span className="font-semibold">Dirección:</span> {noticeData.address}</p>
          </div>
          <div className="text-right">
            <p><span className="font-semibold">Fecha Emisión:</span> {noticeData.issueDate}</p>
            <p><span className="font-semibold">Fecha Vencimiento:</span> {noticeData.dueDate}</p>
            <p><span className="font-semibold">Último pago:</span> {noticeData.lastPaymentAmount}</p>
            <p><span className="font-semibold">Fecha último pago:</span> {noticeData.lastPaymentDate}</p>
          </div>
        </div>
        
        <div className="bg-gray-100 rounded-lg p-4 mb-6">
          <h2 className="text-lg font-bold mb-4">Detalle Gasto Común</h2>
          <div className="space-y-2">
            {[
              { label: 'Cobro Periodo', value: noticeData.periodCharge },
              { label: 'Gasto Común', value: noticeData.commonExpenses },
              { label: 'Fondo Reserva', value: noticeData.reserveFund },
              { label: 'Provisiones', value: noticeData.provisions },
              { label: 'Saldo Anterior', value: noticeData.previousBalance },
            ].map((item, index) => (
              <div key={index} className="flex justify-between">
                <span>{item.label}</span>
                <span>{item.value}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-2 border-t border-gray-300 flex justify-between font-bold">
            <span>Total a Pagar</span>
            <span>{noticeData.totalAmount}</span>
          </div>
        </div>
        
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
          <h3 className="font-bold text-blue-800 mb-2">Información:</h3>
          <p>{noticeData.information}</p>
        </div>
      </div>
    </div>
  );
}