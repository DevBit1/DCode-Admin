import React from 'react'
import { Pie } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend, plugins } from 'chart.js';


ChartJS.register(ArcElement, Tooltip, Legend);

const options = {
    responsive:true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
          display: true, // Show the legend
          position: 'bottom', // Position the legend at the bottom
          labels: {
            boxWidth: 20, // Size of the colored box
            padding: 10, // Padding between legend items
            usePointStyle: true, // Use circular or other shapes instead of boxes
          },
        },
      },
}


const PieGraph = ({data = [], label}) => {


  return (
    <Pie
        data={
            {
                labels: data.map((ele) => ele.label),
                datasets: [
                    {
                        label:label,
                        data:data.map((ele) => ele.count),
                        backgroundColor: data.map((ele) => ele.color)
                    }
                ]
            }
        }
        options={options}
    />
  )
}

export default PieGraph