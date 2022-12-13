import React, {Component} from 'react';
import Typography from '@material-ui/core/Typography';  //h1, p replacement Tag
import SocialHealthAlert from "../ConcernAlerts/SocialHealthAlert"

var Null_Values = sessionStorage.getItem("Null_Values");

export default class SocialHealthSuggestion extends Component {

	

	render() {
		return (	
			<div>
			{Null_Values !== 0 ?
                <Typography variant="body1" color="inherit" align="left" gutterBottom>
					<em>Maintaining good social health and addressing social health concerns will improve your physical and mental health in both the short and the long-term. Please schedule a call with one of our trained community connectors to help you set goals and find resources and information to address these social health concerns. </em> 
				</Typography> : null
            }
            </div>
			
			)
	}
}