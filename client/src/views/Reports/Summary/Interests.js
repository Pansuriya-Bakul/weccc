import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';  //h1, p replacement Tag
import Box from '@material-ui/core/Box';
import LocalFloristIcon from '@material-ui/icons/LocalFlorist';
import LocalDiningIcon from '@material-ui/icons/LocalDining';
import LocalDrinkIcon from '@material-ui/icons/LocalDrink';
import AccessibilityIcon from '@material-ui/icons/Accessibility';
import MenuBookIcon from '@material-ui/icons/MenuBook';


export default class Interests extends Component {

	render() {

		const activityIcons = {
			Gardening: <LocalFloristIcon />,
			Repairing: <LocalDrinkIcon />,
			Cooking: <LocalDiningIcon />,
			Worshipping: <AccessibilityIcon />,
			Education: <MenuBookIcon />
			// Add more activity icons here based on their names
		};

		return (
			<>
				<Typography variant="h6" color="secondary" align="left" gutterBottom>
					Interests
				</Typography>
				<Box m={1} mb={2}>
					{this.props.reports.activities[this.props.collection] !== 999 &&
						<>
							<Typography variant="subtitle1" color="textSecondary" align="left" gutterBottom>
								Enjoys the following activities:
							</Typography>
							<Typography display="initial" variant="body1" component="div" color="inherit" align="left" gutterBottom>
								<ol>
									{this.props.reports.activities[this.props.collection].map((item, index) =>
										<li key={`activities_${index}`} style={{ display: 'flex', alignItems: 'center' }}>
											{activityIcons[item]} {item}
										</li>)}
								</ol>
							</Typography>
						</>
					}
					{this.props.reports.meaningful_activities[this.props.collection] !== 999 &&
						<>
							<Typography variant="subtitle1" color="textSecondary" align="left" gutterBottom>
								Most meaningful activities:
							</Typography>
							<Typography display="initial" variant="body1" component="div" color="inherit" align="left" gutterBottom>
								<ol>
									{this.props.reports.meaningful_activities[this.props.collection].map((item, index) =>
										<li key={`activities_meaningful${index}`} style={{ display: 'flex', alignItems: 'center' }}>
											{activityIcons[item]} {item}
										</li>)}
								</ol>
							</Typography>
						</>
					}
					{this.props.reports.FCP_STRINGS_COMB[this.props.collection] !== 999 &&
						<>
							<Typography variant="subtitle1" color="textSecondary" align="left" gutterBottom>
								I would like to do more:
							</Typography>
							<Typography display="initial" variant="body1" component="div" color="inherit" align="left" gutterBottom>

								<ol>
									{this.props.reports.FCP_STRINGS_COMB[this.props.collection].map((item, index) =>
										<li key={`activities_do_more_${index}`}>
											{item}
										</li>)}
								</ol>
							</Typography>
						</>
					}
					{this.props.reports.challenging_activities[this.props.collection] !== 999 &&
						<>
							<Typography variant="subtitle1" color="textSecondary" align="left" gutterBottom>
								Challenges include:
							</Typography>
							<Typography display="initial" variant="body1" component="div" color="inherit" align="left" gutterBottom>
								<ol>
									{this.props.reports.challenging_activities[this.props.collection].map((item, index) =>
										<li key={`activities_challenges_${index}`}>
											{item}
										</li>)}
								</ol>
							</Typography>
						</>
					}
				</Box>
			</>
		)
	}
}