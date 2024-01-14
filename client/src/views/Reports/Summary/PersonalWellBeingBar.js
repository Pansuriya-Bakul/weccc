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
    if (score >= 0 && score <= 2) return '#E74C3C'; // Red
    else if (score >= 3 && score <= 4) return '#F4D03F'; // Orange
    else if (score >= 5 && score <= 6) return '#F39C12'; // Yellow
    else if (score >= 7 && score <= 8) return '#a9c517'; // olive
    else if (score >= 9 && score <= 10) return '#27AE60'; // Green
    else {
        throw new Error('Invalid score range. Score should be between 0 and 10.');
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
                        backgroundColor: [
                            getColorFromScore(life_satisfaction),
                            getColorFromScore(your_standard_of_living),
                            getColorFromScore(your_health),
                            getColorFromScore(feeling_part_of_the_community),
                            getColorFromScore(what_you_are_achieving_in_life),
                            getColorFromScore(personal_relationships),
                            getColorFromScore(how_safe_you_feel),
                            getColorFromScore(future_security),
                            getColorFromScore(your_spirituality_or_religion)
                        ],
                        borderColor: 'rgba(0, 0, 0, 0)',
                        barPercentage: 0.7,
                        categoryPercentage: 0.7,
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
                                return `${labels[context.dataIndex]}: ${yValue}`;
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
                                    case 5:
                                        return 'Average Satisfaction';
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
        <div style={{ width: '100%', height: '300px' }}>
            <canvas ref={chartRef} style={{ width: '100%', height: '100%' }} />
        </div>
    );
};

export default PersonalWellBeingBar;
