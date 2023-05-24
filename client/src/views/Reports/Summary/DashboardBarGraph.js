import React, { Component } from 'react';
import Chart from 'chart.js/auto';

export default class DashboardBarGraph extends Component {

	chartRef = React.createRef();

	findColour = (score) => {
		if (score < 0) {	//identity and handle reverse scoring reflected in colour gauge
			score = score * - 1;
			score = 100 - score;
		}

		if (score == 0) {
			return ("#7D3C98"); //purple / incomplete / missing
		}
		else if (score < 25) {
			return ("#E74C3C"); //red
		}
		else if (score < 50) {
			return ("#F4D03F"); //orange
		}
		else if (score < 75) {
			return ("#F39C12"); //yellow
		}
		else if (score < 101) {
			return ("#27AE60"); //green 
		}
		else {
			return ("#7D3C98"); //purple / incomplete / missing
		}
	}

	isComplete = (score) => {
		if (score < -100 || score > 100) return false;
		return true;
	}

	constructor(props) {
		super(props);

		this.state = {
			//find colour: reverse scoring integrated
			health_colour: this.findColour(this.props.data[0]),
			mentalHealth_colour: this.findColour(this.props.data[1]),
			wellBeing_colour: this.findColour(this.props.data[2]),
			lifeSatisfaction_colour: this.findColour(this.props.data[3]),
			loneliness_colour: this.findColour(this.props.data[4]),

			//set score numeric value or incomplete
			health_zero: this.isComplete(this.props.data[0]) ? this.props.data[0] : "Incomplete",
			mentalHealth: this.isComplete((this.props.data[1])) ? this.props.data[1] : "Incomplete",
			wellBeing: this.isComplete(this.props.data[2]) ? this.props.data[2] : "Incomplete",
			lifeSatisfaction: this.isComplete(this.props.data[3]) ? this.props.data[3] : "Incomplete",
			loneliness: this.props.data[4],
		}
	}


	componentDidMount() {
		const ctx = this.chartRef.current.getContext("2d");

		new Chart(ctx, {
			type: "bar", // Set the chart type to "bar"
			options: {
				plugins: {
					legend: {
						display: false,
						position: 'top',
						labels: {
							font: {
								size: 12
							}
						}
					},
					title: {
						display: true,
						text: "At a glance"
					}
				},
				scales: {
					x: {
						grid: {
							display: false
						},
						ticks: {
							font: {
							  weight: 'bold' // Set the font weight to bold
							}
						}
					},
					y: {
						beginAtZero: true, // Start the y-axis from zero
						ticks: {
							stepSize: 20, // Set the step size for y-axis labels
							callback: (value) => `${value}%`, // Format y-axis labels as percentages
							font: {
								weight: 'bold'
							}
						}
					}
				},
				labels: {
					color: 'black'
				}
			},
			data: {
				labels: [
					"Health",
					"Mental health",
					"Well-being",
					"Life satisfaction",
					"Loneliness"
				],
				datasets: [{
					data: [
						this.props.data[0],
						this.props.data[1],
						this.props.data[2],
						this.props.data[3],
						this.props.data[4]
					],
					backgroundColor: [
						this.findColour(this.props.data[0]),
						this.findColour(this.props.data[1]),
						this.findColour(this.props.data[2]),
						this.findColour(this.props.data[3]),
						this.findColour(this.props.data[4])
					],
					borderWidth: 1,
					barThickness: 80
				}]
			}
		});
	}

	render() {
		return (
			<div style={{ width: '100%', height: '400px' }}>
				<canvas id="myChart" ref={this.chartRef} style={{ width: '100%', height: '100%' }}/>
			</div>
		);
	}
}