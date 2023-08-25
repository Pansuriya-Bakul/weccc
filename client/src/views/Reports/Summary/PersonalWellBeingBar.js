import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const labels = [
    'Life Satisfaction',
    'Standard of Living',
    'Health',
    'Community',
    'Life Achievements',
    'Relationships',
    'Safety',
    'Future Security',
    'Spirituality'
];

const satisfactionLabels = [
    'No Satisfaction',
    'Very Low Satisfaction',
    'Low Satisfaction',
    'Below Average Satisfaction',
    'Average Satisfaction',
    'Above Average Satisfaction',
    'Moderate Satisfaction',
    'High Satisfaction',
    'Very High Satisfaction',
    'Extremely High Satisfaction',
    'Complete Satisfaction'
];

const getColorFromScore = (score) => {
    if (score === 0) return '#B22222'; // Red
    else if (score === 10) return '#27AE60'; // Green
    else {
        // Calculate gradient color between red and green based on score
        const r = Math.floor((10 - score) * 22.5);
        const g = Math.floor(score * 22.5);
        return `rgb(${r},${g},0)`;
    }
};

const PersonalWellBeingBar = ({
    life_satisfaction,
    your_standard_of_living,
    your_health,
    feeling_part_of_the_community,
    what_you_are_achieving_in_life,
    personal_relationships,
    how_safe_you_feel,
    future_security,
    your_spirituality_or_religion
}) => {
    const chartRef = useRef(null);

    const createChart = () => {
        const ctx = chartRef.current.getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    {
                        data: [
                            life_satisfaction,
                            your_standard_of_living,
                            your_health,
                            feeling_part_of_the_community,
                            what_you_are_achieving_in_life,
                            personal_relationships,
                            how_safe_you_feel,
                            future_security,
                            your_spirituality_or_religion
                        ],
                        backgroundColor: labels.map((label, index) => getColorFromScore(index)),
                        borderColor: 'rgba(0, 0, 0, 0)'
                    }
                ]
            },
            options: {
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                const yValue = context.parsed.y;
                                const yLabel = satisfactionLabels[yValue];
                                return `${labels[context.dataIndex]}: ${yLabel}`;
                            }
                        }
                    },
                    legend: {
                        display: false
                    },
                    title: {
                        display: true,
                        text: 'Personal Well-Being'
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            font: {
                                weight: 'bold'
                            },
                            maxRotation: 0,
                            autoSkip: false,
                            padding: 10
                        }
                    },
                    y: {
                        min: 0,
                        max: 10,
                        ticks: {
                            stepSize: 1,
                            font: {
                                weight: 'bold'
                            },
                            callback: (value) => {
                                switch (value) {
                                    case 0:
                                        return 'No Satisfaction';
                                    case 1:
                                        return 'Very Low Satisfaction';
                                    case 2:
                                        return 'Low Satisfaction';
                                    case 3:
                                        return 'Below Average Satisfaction';
                                    case 4:
                                        return 'Average Satisfaction';
                                    case 5:
                                        return 'Above Average Satisfaction';
                                    case 6:
                                        return 'Moderate Satisfaction';
                                    case 7:
                                        return 'High Satisfaction';
                                    case 8:
                                        return 'Very High Satisfaction';
                                    case 9:
                                        return 'Extremely High Satisfaction';
                                    case 10:
                                        return 'Complete Satisfaction';
                                    default:
                                        return '';
                                }
                            }
                        }
                    }
                }
            }
        });
    };

    useEffect(() => {
        if (chartRef.current) {
            createChart();
        }
    }, []);

    return (
        <div style={{ width: '100%', height: '400px' }}>
            <canvas ref={chartRef} style={{ width: '100%', height: '100%' }} />
        </div>
    );
};

export default PersonalWellBeingBar;
