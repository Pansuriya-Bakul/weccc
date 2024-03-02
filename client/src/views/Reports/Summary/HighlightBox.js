import React, { useState, useEffect } from 'react';
import Chart from 'chart.js/auto';
import GaugeChart from "react-gauge-chart";
import "./gauge-chart.css";

import { Grid, Typography, Box } from '@material-ui/core';
import LocalHospitalOutlinedIcon from '@material-ui/icons/LocalHospitalOutlined';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeartPulse, faBrain, faSpa, faFaceSmile, faUsers, faPersonCane, faHandshake, faPerson } from '@fortawesome/free-solid-svg-icons'
import { lightBlue } from '@material-ui/core/colors';
import { set } from 'joi/lib/types/lazy';


const HighlightBox = (props) =>{
    const chartRef = React.createRef();

    const [health_colour, setHealth_colour] = useState('');
    const [mentalHealth_colour, setMentalHealth_colour] = useState('');
    const [wellBeing_colour, setWellBeing_colour] = useState('');
    const [lifeSatisfaction_colour, setLifeSatisfaction_colour] = useState('');
    const [loneliness_colour, setLoneliness_colour] = useState('');
    const [funtionHealth_color,setFunctionHealthColor]=useState('')
    const [communityHealth_color,setCommunityHealthColor]=useState('')
    const [isolationHealth_color,setIsolationHealthColor]=useState('')
    const [overallScore, setOverallScore] = useState(0);

    const [health_zero, setHealth_zero] = useState('');
    const [mentalHealth, setMentalHealth] = useState('');
    const [wellBeing, setWellBeing] = useState('');
    const [lifeSatisfaction, setLifeSatisfaction] = useState('');
    const [loneliness, setLoneliness] = useState('');
    
    const [funtionHealth,setFunctionHealth]=useState('')
    const [communityHealth,setCommunityHealth]=useState('')
    const [isolationHealth,setIsolationHealth]=useState('') 


	// maps score to appropriate colors
	const findColour = (score) => {
		if (score < 0) {	//identity and handle reverse scoring reflected in colour gauge
			score = score * - 1;
			score = 100 - score;
		}

		if (score == 0) {
			return ("#CC3333"); //red
		}
		else if (score <= 25) {
			return ("#FF8E3D"); //orange
		}
		else if (score <= 50) {
			return ("#FFC82C"); //yellow
		}
		else if (score <= 75) {
			return ("#C8D344"); //green-yellow
		}
		else if (score <= 101) {
			return ("#A0CC27"); //green 
		}
		else {
			return ("#7D3C98"); //purple / incomplete / missing
		}
	}

	// Map percentages to labels to diplay in the chart
	const getPercentageLabel = (value) => {
		if (value <= 0) return 'Poor';
		else if (value <= 25) return 'Fair';
		else if (value <= 50) return 'Good';
		else if (value <= 75) return 'Very Good';
		else if (value <= 100) return 'Excellent';
		else return '';
	};

	const getLonelinessLabel = (value) => {
		if (value <= 0) return 'Vey High';
		else if (value <= 25) return 'High';
		else if (value <= 50) return 'Moderate';
		else if (value <= 75) return 'Low';
		else if (value <= 100) return 'Very Low';
		else return '';
	};
	
    const getOverallScore = () => {
        const sum = props.data.reduce((a, b) => a + b, 0);
        const avg = (sum / props.data.length).toFixed(1);
        setOverallScore(avg);
    }


	
	const isComplete = (score) => {
		if (score < -100 || score > 100) return false;
		return true;
	}

    useEffect(() => {
        setHealth_colour(findColour(props.data[0]));
        setMentalHealth_colour(findColour(props.data[1]));
        setWellBeing_colour(findColour(props.data[2]));
        setLifeSatisfaction_colour(findColour(props.data[3]));
        setLoneliness_colour(findColour(props.data[4]));
        setFunctionHealthColor(findColour(props.data[5]))
        setCommunityHealthColor(findColour(props.data[6]))
        setIsolationHealthColor(findColour(props.data[7]))
        getOverallScore();
        
        setHealth_zero(isComplete(props.data[0]) ? props.data[0] : "Incomplete");
        setMentalHealth(isComplete((props.data[1])) ? props.data[1] : "Incomplete");
        setWellBeing(isComplete(props.data[2]) ? props.data[2] : "Incomplete");
        setLifeSatisfaction(isComplete(props.data[3]) ? props.data[3] : "Incomplete");
        setLoneliness(props.data[4]);
        setFunctionHealth(isComplete(props.data[5]) ? props.data[5] : "Incomplete");
        setCommunityHealth(isComplete(props.data[6]) ? props.data[6] : "Incomplete");
        setIsolationHealth(isComplete(props.data[7]) ? props.data[7] : "Incomplete");
    }, []);


    return (
        <Grid container spacing={3} style={{display:'flex', marginTop:'12px', gap:'16px', justifyContent:'space-around', alignItems:'center'}}>
            {/* <div className="gauge-chart" style={{display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center'}}> */}
                <Box item xs={12} sm={6} md={4} lg={3}
                style={{        
                    padding: '32px',
                    borderRadius: '16px',
                    backgroundColor: '#0a2238',
                    display:'flex', 
                    flexDirection:'column', 
                    alignItems:'center', 
                    justifyContent:'center',
                    height:'100%',
                    width:'100%',
                    // gap:'16px',
                    maxWidth:'300px',
                    maxHeight:'300px'
                }}
                >
                    <Typography variant="h4" align="left" style={{fontWeight:'500', color:'white'}}>Your Wellness Score</Typography>
                    <GaugeChart
                            className=""
                            nrOfLevels={8}
                            percent={overallScore/100}
                            // colors={["red", "green"]}
                            arcWidth={0.5}
                            style={{ width: "100%" }}
                            hideText={true}
                            colors={["#CC3333", "#4EDB5A"]}
                        />
                    <div style={{ width:'70%', display:'flex', alignItems:'center', justifyContent:'center', borderRadius:'50px'}}>
                        <Typography variant="h3" color="white" align="left" style={{fontWeight:'500', color:'white'}}>{overallScore}</Typography>
                    </div>
                </Box>
            {/* </div> */}
            <div className="boxes" style={{display:'flex', flexDirection:'column', gap:'16px',"max-width":'74%'}}> 
                <div style={{display:'flex', gap:'8px'}}>
                    <Box item xs={12} sm={6} md={12} lg={12} bgcolor={health_colour} style={{display:'flex', color:'white', padding:'14px', borderRadius:'8px', alignItems:'center', justifyContent:'center', gap:'16px', width:'50%', maxHeight:'200px'}}>
                        <FontAwesomeIcon icon={faHeartPulse} style={{fontSize:'52px'}}/>
                        <div style={{display:'flex', flexDirection:'column'}}>
                        <Typography variant="h5" color="inherit" align="left" style={{fontWeight:'500'}}>
                            Health
                        </Typography>
                        <Typography variant="h6" color="inherit" align="left" style={{fontWeight:'400'}}>
                            {getPercentageLabel(props.data[0])} ({Math.round(props.data[0])}%)
                        </Typography>
                        </div>
                    </Box>
                    <Box item xs={12} sm={6} md={4} lg={3} bgcolor={mentalHealth_colour} style={{display:'flex', color:'white', padding:'14px', borderRadius:'8px', alignItems:'center', justifyContent:'center', gap:'16px', width:'50%', maxHeight:'180px'}}>
                        <FontAwesomeIcon icon={faBrain} style={{fontSize:'52px'}}/>
                        <div style={{display:'flex', flexDirection:'column'}}>
                        <Typography variant="h5" color="inherit" align="left" style={{fontWeight:'500'}}>
                            Mental Health
                        </Typography>
                        <Typography variant="h6" color="inherit" align="left" style={{fontWeight:'400'}}>
                            {getPercentageLabel(props.data[1])} ({Math.round(props.data[1])}%)
                        </Typography>
                        </div>
                    </Box>
                    <Box item xs={12} sm={6} md={4} lg={3} bgcolor={wellBeing_colour} style={{display:'flex', color:'white', padding:'14px', borderRadius:'8px', alignItems:'center', justifyContent:'center', gap:'16px', width:'50%', maxHeight:'180px'}}>
                    <FontAwesomeIcon icon={faSpa} style={{fontSize:'52px'}}/>
                        <div style={{display:'flex', flexDirection:'column'}}>
                        <Typography variant="h5" color="inherit" align="left" style={{fontWeight:'500'}}>
                            Well Being
                        </Typography>
                        <Typography variant="h6" color="inherit" align="left" style={{fontWeight:'400'}}>
                            {getPercentageLabel(props.data[2])} ({Math.round(props.data[2])}%)
                        </Typography>
                        </div>
                    </Box>
                    <Box item xs={12} sm={6} md={4} lg={3} bgcolor={funtionHealth_color} style={{display:'flex', color:'white', padding:'14px', borderRadius:'8px', alignItems:'center', justifyContent:'center', gap:'16px', width:'50%', maxHeight:'180px'}}>
                    <FontAwesomeIcon icon={faPersonCane} style={{fontSize:'52px'}}/>
                        <div style={{display:'flex', flexDirection:'column'}}>
                        <Typography variant="h5" color="inherit" align="left" style={{fontWeight:'500'}}>
                            Function
                        </Typography>
                        <Typography variant="h6" color="inherit" align="left" style={{fontWeight:'400'}}>
                            {getPercentageLabel(props.data[5])} ({Math.round(props.data[5])}%)
                        </Typography>
                        </div>
                    </Box>
                </div>

                <div style={{display:'flex',gap:'8px'}}>
                <Box item xs={12} sm={6} md={4} lg={3} bgcolor={communityHealth_color} style={{display:'flex', color:'white', padding:'10px', borderRadius:'8px', alignItems:'center', justifyContent:'center', gap:'16px', width:'50%', maxHeight:'180px'}}>
                <FontAwesomeIcon icon={faHandshake} style={{fontSize:'52px'}}/>
                    <div style={{display:'flex', flexDirection:'column'}}>
                    <Typography variant="h5" color="inherit" align="left" style={{fontWeight:'500'}}>
                        Community Belonging
                    </Typography>
                    <Typography variant="h6" color="inherit" align="left" style={{fontWeight:'400'}}>
                        {getPercentageLabel(props.data[6])} ({Math.round(props.data[6])}%)
                    </Typography>
                    </div>
                </Box>
                <Box item xs={12} sm={6} md={4} lg={3} bgcolor={isolationHealth_color} style={{display:'flex', color:'white', padding:'10px', borderRadius:'8px', alignItems:'center', justifyContent:'center', gap:'16px', width:'50%', maxHeight:'180px'}}>
                <FontAwesomeIcon icon={faPerson} style={{fontSize:'52px'}}/>
                    <div style={{display:'flex', flexDirection:'column'}}>
                    <Typography variant="h5" color="inherit" align="left" style={{fontWeight:'500'}}>
                        Isolation
                    </Typography>
                    <Typography variant="h6" color="inherit" align="left" style={{fontWeight:'400'}}>
                        {getLonelinessLabel(props.data[7])} ({Math.round(props.data[7])}%)
                    </Typography>
                    </div>
                </Box>
                <Box item xs={12} sm={6} md={4} lg={3} bgcolor={lifeSatisfaction_colour} style={{display:'flex', color:'white', padding:'10px', borderRadius:'8px', alignItems:'center', justifyContent:'center', gap:'16px', width:'50%', maxHeight:'180px'}}>
                <FontAwesomeIcon icon={faFaceSmile} style={{fontSize:'52px'}}/>
                    <div style={{display:'flex', flexDirection:'column'}}>
                    <Typography variant="h5" color="inherit" align="left" style={{fontWeight:'500'}}>
                        Life satisfaction
                    </Typography>
                    <Typography variant="h6" color="inherit" align="left" style={{fontWeight:'400'}}>
                        {getPercentageLabel(props.data[3])} ({Math.round(props.data[3])}%)
                    </Typography>
                    </div>
                </Box>
                <Box item xs={12} sm={6} md={4} lg={3} bgcolor={loneliness_colour} style={{display:'flex', color:'white', padding:'10px', borderRadius:'8px', alignItems:'center', justifyContent:'center', gap:'16px', width:'50%', maxHeight:'180px'}}>
                <FontAwesomeIcon icon={faUsers} style={{fontSize:'52px'}}/>
                    <div style={{display:'flex', flexDirection:'column'}}>
                    <Typography variant="h5" color="inherit" align="left" style={{fontWeight:'500'}}>
                        Loneliness
                    </Typography>
                    <Typography variant="h6" color="inherit" align="left" style={{fontWeight:'400'}}>
                        {getLonelinessLabel(props.data[4])} ({Math.round(props.data[4])}%)
                    </Typography>
                    </div>
                </Box>
                </div>
            </div>
        </Grid>
    );

}

export default HighlightBox;

// export default class HighlightBox extends Component {

	




// 	componentDidMount() {
// 		const ctx = this.chartRef.current.getContext("2d");

// 		new Chart(ctx, {
// 			type: "bar", // Set the chart type to "bar"
// 			options: {
// 				plugins: {
// 					legend: {
// 						display: false,
// 						position: 'top',
// 						labels: {
// 							font: {
// 								size: 12
// 							}
// 						}
// 					},
// 					title: {
// 						display: true,
// 						text: "At a glance"
// 					},
// 					tooltip: {
// 						callbacks: {
// 						  label: (context) => {
// 							const value = context.raw;
// 							const label = this.getPercentageLabel(value);
// 							return `${label}`;
// 						  },
// 						},
// 					  },
// 				},
// 				scales: {
// 					x: {
// 						grid: {
// 							display: false
// 						},
// 						ticks: {
// 							font: {
// 							  weight: 'bold' // Set the font weight to bold
// 							}
// 						}
// 					},
// 					y: {
// 						// beginAtZero: true, // Start the y-axis from zero
// 						min: 0,
// 						max: 100,
// 						ticks: {
// 							stepSize: 25, // Set the step size for y-axis labels
// 							callback: (value) => this.getPercentageLabel(value), // Format y-axis labels as percentages
// 							font: {
// 								weight: 'bold'
// 							}
// 						}
// 					}
// 				},
// 				labels: {
// 					color: 'black'
// 				}
// 			},
// 			data: {
// 				labels: [
// 					"Health",
// 					"Mental health",
// 					"Well-being",
// 					"Life satisfaction",
// 					"Loneliness"
// 				],
// 				datasets: [{
// 					data: [
// 						this.props.data[0],
// 						this.props.data[1],
// 						this.props.data[2],
// 						this.props.data[3],
// 						this.props.data[4]
// 					],
// 					backgroundColor: [
// 						this.findColour(this.props.data[0]),
// 						this.findColour(this.props.data[1]),
// 						this.findColour(this.props.data[2]),
// 						this.findColour(this.props.data[3]),
// 						this.findColour(this.props.data[4])
// 					],
// 					borderWidth: 1,
// 					barThickness: 80
// 				}]
// 			}
// 		});
// 	}

// 	render() {
// 		return (
// 			<div style={{ width: '100%', height: '400px' }}>
// 				<canvas id="myChart" ref={this.chartRef} style={{ width: '100%', height: '100%' }}/>
// 			</div>
// 		);
// 	}
// }