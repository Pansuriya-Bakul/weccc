import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';  //h1, p replacement Tag
import Box from '@material-ui/core/Box';

//===================== Icons ========================
import LocalFloristIcon from '@material-ui/icons/LocalFlorist';
import LocalDiningIcon from '@material-ui/icons/LocalDining';
import LocalDrinkIcon from '@material-ui/icons/LocalDrink';
import AccessibilityIcon from '@material-ui/icons/Accessibility';
import DirectionsWalkIcon from '@material-ui/icons/DirectionsWalk';
import PhoneInTalkIcon from '@material-ui/icons/PhoneInTalk';
import MusicNoteIcon from '@material-ui/icons/MusicNote';
import BookIcon from '@material-ui/icons/Book';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import SportsEsportsIcon from '@material-ui/icons/SportsEsports';
import EmojiPeopleIcon from '@material-ui/icons/EmojiPeople';
import DriveEtaIcon from '@material-ui/icons/DriveEta';
import FavoriteIcon from '@material-ui/icons/Favorite';
import PaletteIcon from '@material-ui/icons/Palette';
import TheatersIcon from '@material-ui/icons/Theaters';
import FitnessCenterIcon from '@material-ui/icons/FitnessCenter';
import SpaIcon from '@material-ui/icons/Spa';
import ToysIcon from '@material-ui/icons/Toys';
import LocalActivityIcon from '@material-ui/icons/LocalActivity';
import ComputerIcon from '@material-ui/icons/Computer';
import LiveTvIcon from '@material-ui/icons/LiveTv';
import PetsIcon from '@material-ui/icons/Pets';
import ForumIcon from '@material-ui/icons/Forum';


export default class Interests extends Component {

	render() {

		const activityIcons = {
			Gardening: <LocalFloristIcon />,
			Repairing: <LocalDrinkIcon />,
			Cooking: <LocalDiningIcon />,
			Worshipping: <AccessibilityIcon />,
			Education: <MenuBookIcon />,
			'Taking a Walk': <DirectionsWalkIcon />,
			'Calling': <PhoneInTalkIcon />,
			'Listening to Music': <MusicNoteIcon />,
			'Reading': <BookIcon />,
			'Playing Games': <SportsEsportsIcon />,
			'Dancing': <EmojiPeopleIcon />,
			'Day Trips': <DriveEtaIcon />,
			'Volunteering': <FavoriteIcon />,
			'Art/Painting': <PaletteIcon />,
			'Going to the Movies': <TheatersIcon />,
			'Exercising': <FitnessCenterIcon />,
			'Meditation': <SpaIcon />,
			'Performing': <ToysIcon />,
			'Concerts/Shows': <LocalActivityIcon />,
			'Computer Time': <ComputerIcon />,
			'Watching TV': <LiveTvIcon />,
			'Playing with Pets': <PetsIcon />,
			'Sitting and Talking': <ForumIcon />
	};

	return(
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