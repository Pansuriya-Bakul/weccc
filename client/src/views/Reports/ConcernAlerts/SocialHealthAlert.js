import React, {Component} from 'react';
import Typography from '@material-ui/core/Typography';  //h1, p replacement Tag
import Box from '@material-ui/core/Box';


let null_flag = 0;

export default class SocialHealthAlert extends Component {

    

	render() {
		return (
			
				<div>
				
				<Typography variant="h5" color="inherit" align="left" gutterBottom>
					{/* Social Health  */}
				</Typography>
                {this.props.reports.household2_size[this.props.collection] !== 999 && this.props.reports.household2_size[this.props.collection] == "Lives alone" ?
				(null_flag = null_flag + 1) &&
                <Typography>
                    <ul>
                        <li>Living alone is associated with lower social support and social interactions, increasing susceptibility to negative health outcomes. People who live alone may need to organize extra activities and spend more time with others outside of home.</li>
                    </ul>
                </Typography> : null 
                }
                {this.props.reports.community_activity_participate[this.props.collection] !== 999 && this.props.reports.community_activity_participate[this.props.collection] == "No" ?
				(null_flag = null_flag + 1) &&
                <Typography>
                    <ul>
                        <li>Not participating in community activities as much as you would like is a concern. Positive social relationships are associated with health and well-being. Low levels of social participation is associated with poorer physical health, depression, disease, low quality of life, and even risk of early death.</li>
                    </ul>
                </Typography> : null 
                }
                {this.props.reports.life_satisfaction2[this.props.collection] !== 999 && this.props.reports.life_satisfaction2[this.props.collection] <= 6 ?
				(null_flag = null_flag + 1) &&
                <Typography>
                    <ul>
                        <li>Life satisfaction is a concern. You should be aware that low life satisfaction more than doubles the risk of chronic disease and early death. Life satisfaction is strongly associated with sleep problems, pain, obesity, smoking, anxiety, physical activity, diagnosed mental disease, and with higher healthcare utilization and costs. People who are dissatisfied with some aspects of their lives may need to pay special attention to finding activities that bring joy, purpose, meaning to your life.</li>
                    </ul>
                </Typography>  : null
                }
                {(this.props.reports.local_community_belonging[this.props.collection] == "Somewhat weak" || this.props.reports.local_community_belonging[this.props.collection] == "Very weak") && this.props.reports.local_community_belonging[this.props.collection] !== 999 ?
				(null_flag = null_flag + 1) &&
                <Typography>
                    <ul>
                        <li>Community belonging is a concern. Community belonging is strongly associated with physical health and increased risk of chronic disease. People who lack a sense of community belonging may need to pay special attention to finding ways they can connect with others, and enjoy ways of give back to their community.</li>
                    </ul>
                </Typography> : null
                }
                {(((this.props.reports.lack_companionship[this.props.collection] == "Sometimes" && this.props.reports.feel_leftout[this.props.collection] == "Sometimes" ) ||
                (this.props.reports.lack_companionship[this.props.collection] == "Sometimes" && this.props.reports.feel_isolated[this.props.collection] == "Sometimes") ||
                (this.props.reports.feel_leftout[this.props.collection] == "Sometimes" && this.props.reports.feel_isolated[this.props.collection] == "Sometimes") ||
                (this.props.reports.lack_companionship[this.props.collection] == "Sometimes" && this.props.reports.feel_leftout[this.props.collection] == "Sometimes" && this.props.reports.feel_isolated[this.props.collection] == "Sometimes")) || 
                (this.props.reports.lack_companionship[this.props.collection] == "Often" || this.props.reports.feel_leftout[this.props.collection] == "Often" || this.props.reports.feel_isolated[this.props.collection] == "Often")) ?
				(null_flag = null_flag + 1) &&
                <Typography>
                    <ul>
                        <li>Loneliness is a concern. Loneliness is worse for health than smoking 15 cigarettes a day or being obese – it is associated with higher risk of stress, anxiety; depression; heart disease; stroke; dementia; falls; use of long-term care; and early death. People who are lonely need to find positive ways to connect with others in ways that are authentic and satisfying. </li>
                    </ul>
                </Typography>  : null
                }
                {this.props.null_flag == 0 ?
                <Typography>
                    Congratulations. Your responses do not indicate any social health concerns currently.  
                </Typography> : null
                }
                {sessionStorage.setItem("Null_Values", null_flag)}
                </div>
				
                
                
			
			)
            

	}
	
}					