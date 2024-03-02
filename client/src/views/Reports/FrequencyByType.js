import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

export default function FrequencyByType({ source }) {
  const chartRef = useRef(null);

  let data = Array.isArray(source[0]) ? source[0].map((value) => (value == null ? 0 : value)) : [];

  const labels = [
    "Religion",
    "Recreation/ hobbies",
    "Education/ culture",
    "Associations/ clubs",
    "Volunteer",
    "Informal help",
    "Music",
    "Sports",
    "Kindness",
    "Other",
  ];
  const getFrequency = (value) => {
    switch (value) {
      case 5:
        return "Daily";
      case 4:
        return "Weekly";
      case 3:
        return "Monthly";
      case 2:
        return "3-4 Times Per Year";
      case 1:
        return "Yearly";
      case 0:
        return "Never";
      default:
        return "Never";
    }
  };
  const createChart = () => {
    const ctx = chartRef.current.getContext("2d");
    new Chart(ctx, {
      type: "bar",
      options: {
        indexAxis: "x",
        plugins: {
          title: {
            display: false,
            text: "",
          },
          legend: {
            display: false,
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const value = context.raw;
                const label = getFrequency(value);
                return `${label}`;
              },
            },
          },
        },
        scales: {
          x: {
            grid: {
              display: false,
            },
            ticks: {
              font: {
                weight: "bold", // Set the font weight to bold
              },
            },
          },
          y: {
            // beginAtZero: true, // Start the y-axis from zero
            min: 0,
            max: 5,
            ticks: {
              callback: (value) => getFrequency(value), // Format y-axis labels as percentages
              font: {
                weight: "bold",
              },
            },
          },
        },
      },
      data: {
        labels: labels,
        datasets: [
          {
            data: data,
            borderColor: "#3e95cd",
            backgroundColor: "#e91e62",
            fill: false,
            barPercentage: 0.7,
            categoryPercentage: 0.7,
          },
        ],
      },
    });
  };
  useEffect(() => {
    if (chartRef.current) {
      createChart();
    }
  }, []);

  return (
    <div>
      <canvas
        id="myChart"
        ref={chartRef}
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
}
