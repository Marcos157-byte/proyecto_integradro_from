import { useContext } from "react";
import { VentaContext } from "../../context/VentaContext";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function VentasPorDiaChart() {
  const { ventasDia } = useContext(VentaContext);

  const data = {
    labels: ventasDia.map((v) => new Date(v.periodo).toLocaleDateString()),
    datasets: [
      {
        label: "Ventas por Día",
        data: ventasDia.map((v) => parseFloat(v.totalVentas)),
        borderColor: "rgba(75,192,192,1)",
        backgroundColor: "rgba(75,192,192,0.2)",
        fill: true,
      },
    ],
  };

  return <Line data={data} />;
}