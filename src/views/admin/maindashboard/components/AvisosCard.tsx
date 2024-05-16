import CardMenu from "components/card/CardMenu";
import { MdDragIndicator } from "react-icons/md";
import Card from "components/card";
import { AiOutlineNotification } from "react-icons/ai";

const AvisosCard = () => {
  const avisosData = [
    {
      id: 1,
      title: "Reunión mensual de condominio",
      description: "La reunión se llevará a cabo el 10 de febrero a las 18:00 hrs.",
    },
    {
      id: 2,
      title: "Mantenimiento de áreas comunes",
      description: "Se realizará el mantenimiento el próximo sábado. Por favor, desalojen las áreas comunes.",
    },
    {
      id: 3,
      title: "Pago de cuotas",
      description: "Recuerden realizar el pago de cuotas antes del 15 de febrero para evitar cargos adicionales.",
    },
    {
      id: 4,
      title: "Notificación de corte de agua",
      description: "Habrá un corte de agua programado el jueves de la próxima semana de 10:00 a 14:00 hrs.",
    },
  ];

  return (
    <Card extra="pb-7 p-[20px]">
      <div className="relative flex flex-row justify-between">
        <div className="flex items-center">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-100 dark:bg-white/5">
            <AiOutlineNotification className="h-6 w-6 text-brand-500 dark:text-white" />
          </div>
          <h4 className="ml-4 text-xl font-bold text-navy-700 dark:text-white">Avisos</h4>
        </div>
        <CardMenu />
      </div>

      <div className="h-full w-full">
        {avisosData.map((aviso) => (
          <div key={aviso.id} className="mt-2 flex items-center justify-between p-2">
            <div className="flex flex-col items-start">
              <p className="text-base font-bold text-navy-700 dark:text-white">{aviso.title}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{aviso.description}</p>
            </div>
            <div>
              <MdDragIndicator className="h-6 w-6 text-navy-700 dark:text-white" />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default AvisosCard;
