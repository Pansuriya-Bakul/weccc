import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

export default function HealthBar({ walking, washingDressing, usualActivities, painDiscomfort, anxiousDepressed }) {
    const findBackgroundColor = (score) => {
        if (score === 0) {
            console.log('washingDressing red')
            console.log(washingDressing)
            return "#B22222"; // Red
        } else if (score === 1) {
            console.log('walking orange')
            console.log(walking)
            return "#F39C12"; // Orange
        } else if (score === 2) {
            return "#F4D03F"; // Yellow
        } else if (score === 3) {
            return "#96b85d"; // Olive Green
        } else if (score === 4) {
            return "#27AE60"; // Green
        } else {
            return "transparent"; // No Color (Transparent)
        }
    };

    const chartRef = useRef(null);
    console.log(walking, washingDressing, usualActivities, painDiscomfort, anxiousDepressed)
    const createChart = () => {
        const ctx = chartRef.current.getContext('2d');
        new Chart(ctx, {
            type: 'bar', // Use 'bar' type for a bar graph
            data: {
                labels: ['Walk around', 'Washing or Dressing', 'Usual Activities', 'Level of Pain or Discomfort', ' Feeling Anxious or Depressed'],
                datasets: [
                    {
                        data: [walking, washingDressing, usualActivities, painDiscomfort, anxiousDepressed],
                        backgroundColor: [
                            findBackgroundColor(walking),
                            findBackgroundColor(washingDressing),
                            findBackgroundColor(usualActivities),
                            findBackgroundColor(painDiscomfort),
                            findBackgroundColor(anxiousDepressed),
                        ],
                        borderColor: 'rgba(0, 0, 0, 0)',
                    },
                ],
            },
            options: {
                plugins: {
                    legend: {
                        display: false,
                    },
                    title: {
                        display: true,
                        text: 'How does Health affect your activities?',
                    },
                    tooltip: {
                        enabled: true,
                        mode: 'index', // Display a single tooltip item on hover
                        intersect: false, // Prevent overlapping tooltips
                        callbacks: {
                            label: (context) => {
                                const value = context.parsed.y;
                                return value === 0 ? 'Inability' :
                                    value === 1 ? 'Severe Problem' :
                                        value === 2 ? 'Moderate Problem' :
                                            value === 3 ? 'Slight Problem' :
                                                value === 4 ? 'No Problem' : '';
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
                                weight: 'bold',
                            },
                        },
                    },
                    y: {
                        min: 0,
                        max: 4,
                        ticks: {
                            stepSize: 1, // Set the step size for y-axis labels
                            font: {
                                weight: 'bold',
                            },
                            callback: (value) => {
                                switch (value) {
                                    case 0:
                                        return 'Inability';
                                    case 1:
                                        return 'Severe Problem';
                                    case 2:
                                        return 'Moderate Problem';
                                    case 3:
                                        return 'Slight Problem';
                                    case 4:
                                        return 'No Problem';
                                    default:
                                        return '';
                                }
                            },
                        },
                    },
                },
            },
        });
    };

    useEffect(() => {
        if (chartRef.current) {
            createChart();
        }
    }, []);

    return (
        <div style={{ width: '100%', height: '400px' }}>
            <canvas id="myChart" ref={chartRef} style={{ width: '100%', height: '100%' }} />
        </div>
    );
}
