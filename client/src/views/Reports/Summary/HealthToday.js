import React, { Component } from 'react';
import Chart from 'chart.js/auto';

export default class HealthToday extends Component {
    chartRef = React.createRef();

    constructor(props) {
        super(props);

        this.state = {
            score: this.props.data,
            label: '',
        };
    }

    componentDidUpdate() {
        const ctx = this.chartRef.current.getContext('2d');

        new Chart(ctx, {
            type: 'doughnut',
            options: {
                rotation: 270,
                circumference: 180,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top',
                        labels: {
                            font: {
                                size: 12,
                            },
                        },
                    },
                    title: {
                        display: true,
                        text: 'Health Today',
                    },
                    tooltip: {
                        enabled: false,
                    },
                },
            },
            data: {
                labels: [this.state.label],
                datasets: [
                    {
                        data: [this.state.score, 100 - this.state.score],
                        borderColor: '#0',
                        backgroundColor: [
                            this.findColour(this.state.score),
                            '#FFFFFF',
                        ],
                        fill: false,
                    },
                ],
            },
        });
    }

    componentDidMount() {
        const { score } = this.state;
        const label = this.findLabel(score);

        this.setState({ label });
    }

    findColour = (score) => {
        if (score < 25) {
            return '#E74C3C'; // red
        } else if (score < 50) {
            return '#F4D03F'; // orange
        } else if (score < 75) {
            return '#F39C12'; // yellow
        } else if (score < 101) {
            return '#27AE60'; // green
        } else {
            return '#7D3C98'; // purple / incomplete / missing
        }
    };

    findLabel = (score) => {
        if (score < 25) {
            return 'Poor';
        } else if (score < 50) {
            return 'Fair';
        } else if (score < 75) {
            return 'Good';
        } else if (score < 101) {
            return 'Excellent';
        } else {
            return '';
        }
    };

    render() {
        return (
            <div>
                <canvas id="myChart" ref={this.chartRef} />
            </div>
        );
    }
}