import React, {Component} from 'react';
import Grid from '@material-ui/core/Grid';  // Normal Markup with MUI is layout -> Container -> Grid -> Paper etc...
import Item from '@material-ui/core/ListItem';
import Typography from '@material-ui/core/Typography';  //h1, p replacement Tag
import Box from '@material-ui/core/Box';

import CommunityParticipationAlert from './ConcernAlerts/CommunityParticipationAlert';
import HealthAlert from './ConcernAlerts/HealthAlert';
import LonelinessAlert from "./ConcernAlerts/LonelinessAlert";
import PersonalWellBeingAlert from './ConcernAlerts/PersonalWellBeingAlert';
import SocialContactAlert from './ConcernAlerts/SocialContactAlert';
import SupportAvailabilityAlert from './ConcernAlerts/SupportAvailabilityAlert';
import SocialHealthAlert from './ConcernAlerts/SocialHealthAlert';

export default class PossibleConcerns extends Component {

	render() {
		return (
            <>
                <Box m={1}>
                    <SocialHealthAlert reports = {this.props.reports} collection = {this.props.collection}/>
                </Box>
                
            </>
			)
	}
}