import React from 'react';

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

export default function PaymentNoticePreview() {
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
            <p><span className="font-semibold">Aviso de Cobro N°:</span> {dummyData.invoiceNumber}</p>
            <p><span className="font-semibold">Periodo/Año:</span> {dummyData.period}</p>
            <p><span className="font-semibold">Propietario:</span> {dummyData.owner}</p>
            <p><span className="font-semibold">Dirección:</span> {dummyData.address}</p>
          </div>
          <div className="text-right">
            <p><span className="font-semibold">Fecha Emisión:</span> {dummyData.issueDate}</p>
            <p><span className="font-semibold">Fecha Vencimiento:</span> {dummyData.dueDate}</p>
            <p><span className="font-semibold">Último pago:</span> {dummyData.lastPaymentAmount}</p>
            <p><span className="font-semibold">Fecha último pago:</span> {dummyData.lastPaymentDate}</p>
          </div>
        </div>
        
        <div className="bg-gray-100 rounded-lg p-4 mb-6">
          <h2 className="text-lg font-bold mb-4">Detalle Gasto Común</h2>
          <div className="space-y-2">
            {[
              { label: 'Cobro Periodo', value: dummyData.periodCharge },
              { label: 'Gasto Común', value: dummyData.commonExpenses },
              { label: 'Fondo Reserva', value: dummyData.reserveFund },
              { label: 'Provisiones', value: dummyData.provisions },
              { label: 'Saldo Anterior', value: dummyData.previousBalance },
            ].map((item, index) => (
              <div key={index} className="flex justify-between">
                <span>{item.label}</span>
                <span>{item.value}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-2 border-t border-gray-300 flex justify-between font-bold">
            <span>Total a Pagar</span>
            <span>{dummyData.totalAmount}</span>
          </div>
        </div>
        
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
          <h3 className="font-bold text-blue-800 mb-2">Información:</h3>
          <p>{dummyData.information}</p>
        </div>
      </div>
    </div>
  );
}