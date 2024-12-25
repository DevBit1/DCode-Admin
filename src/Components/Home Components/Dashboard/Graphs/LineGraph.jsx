import { Line } from "react-chartjs-2"
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    scales,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
        y: {
            min: 0,
        }
    }
}

export const LineGraph = ({ data = [] }) => {
    return <Line
        data={{
            labels: data.map((ele) => ele.label),
            datasets: [
                {
                    label: "Attempts",
                    data: data.map((ele) => ele.count),
                    backgroundColor: "blue",
                    borderColor: "yellow"
                }
            ]
        }}

        options={options}
    />
}