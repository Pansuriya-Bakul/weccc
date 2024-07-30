import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';

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

const styles = (theme) => ({
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.primary,
        backgroundColor: theme.palette.background.paper,
        margin: theme.spacing(1),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
            transform: 'scale(1.05)',
            boxShadow: theme.shadows[4],
        },
    },
    icon: {
        marginRight: theme.spacing(1),
    },
    header: {
        marginBottom: theme.spacing(3),
        color: theme.palette.primary.main,
        fontFamily: "'Roboto', sans-serif",
        fontWeight: 700,
    },
    subheader: {
        marginBottom: theme.spacing(2),
        color: theme.palette.secondary.main,
        fontFamily: "'Roboto', sans-serif",
        fontWeight: 500,
    },
    container: {
        backgroundColor: theme.palette.background.default,
        padding: theme.spacing(3),
        borderRadius: theme.shape.borderRadius,
    },
    listItemText: {
        fontFamily: "'Roboto', sans-serif",
        fontSize: '1rem',
    },
});

class Interests extends Component {
    render() {
        const { classes } = this.props;

        const activityIcons = {
            Gardening: <LocalFloristIcon className={classes.icon} />,
            Repairing: <LocalDrinkIcon className={classes.icon} />,
            Cooking: <LocalDiningIcon className={classes.icon} />,
            Worshipping: <AccessibilityIcon className={classes.icon} />,
            Education: <MenuBookIcon className={classes.icon} />,
            'Taking a Walk': <DirectionsWalkIcon className={classes.icon} />,
            'Calling': <PhoneInTalkIcon className={classes.icon} />,
            'Listening to Music': <MusicNoteIcon className={classes.icon} />,
            'Reading': <BookIcon className={classes.icon} />,
            'Playing Games': <SportsEsportsIcon className={classes.icon} />,
            'Dancing': <EmojiPeopleIcon className={classes.icon} />,
            'Day Trips': <DriveEtaIcon className={classes.icon} />,
            'Volunteering': <FavoriteIcon className={classes.icon} />,
            'Art/Painting': <PaletteIcon className={classes.icon} />,
            'Going to the Movies': <TheatersIcon className={classes.icon} />,
            'Exercising': <FitnessCenterIcon className={classes.icon} />,
            'Meditation': <SpaIcon className={classes.icon} />,
            'Performing': <ToysIcon className={classes.icon} />,
            'Concerts/Shows': <LocalActivityIcon className={classes.icon} />,
            'Computer Time': <ComputerIcon className={classes.icon} />,
            'Watching TV': <LiveTvIcon className={classes.icon} />,
            'Playing with Pets': <PetsIcon className={classes.icon} />,
            'Sitting and Talking': <ForumIcon className={classes.icon} />,
        };

        const renderGridItems = (items) => (
            items.map((item, index) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={`activity_${index}`}>
                    <Paper className={classes.paper}>
                        {activityIcons[item]} {item}
                    </Paper>
                </Grid>
            ))
        );

        return (
            <Box className={classes.container}>
                <Typography variant="h6" className={classes.header} align="left" gutterBottom>
                    Interests
                </Typography>
                <Box m={2}>
                    {this.props.reports.activities[this.props.collection] !== 999 && (
                        <Box mb={3}>
                            <Typography variant="subtitle1" className={classes.subheader} align="left" gutterBottom>
                                Enjoys the following activities:
                            </Typography>
                            <Grid container spacing={3}>
                                {renderGridItems(this.props.reports.activities[this.props.collection])}
                            </Grid>
                        </Box>
                    )}
                    {this.props.reports.meaningful_activities[this.props.collection] !== 999 && (
                        <Box mb={3}>
                            <Typography variant="subtitle1" className={classes.subheader} align="left" gutterBottom>
                                Most meaningful activities:
                            </Typography>
                            <Grid container spacing={3}>
                                {renderGridItems(this.props.reports.meaningful_activities[this.props.collection])}
                            </Grid>
                        </Box>
                    )}
                    {this.props.reports.FCP_STRINGS_COMB[this.props.collection] !== 999 && (
                        <Box mb={3}>
                            <Typography variant="subtitle1" className={classes.subheader} align="left" gutterBottom>
                                I would like to do more:
                            </Typography>
                            <Grid container spacing={3}>
                                {this.props.reports.FCP_STRINGS_COMB[this.props.collection].map((item, index) => (
                                    <Grid item xs={12} sm={6} md={4} lg={3} key={`activities_do_more_${index}`}>
                                        <Paper className={classes.paper}>
                                            {item}
                                        </Paper>
                                    </Grid>
                                ))}
                            </Grid>
                        </Box>
                    )}
                    {this.props.reports.challenging_activities[this.props.collection] !== 999 && (
                        <Box mb={3}>
                            <Typography variant="subtitle1" className={classes.subheader} align="left" gutterBottom>
                                Challenges include:
                            </Typography>
                            <Grid container spacing={3}>
                                {this.props.reports.challenging_activities[this.props.collection].map((item, index) => (
                                    <Grid item xs={12} sm={6} md={4} lg={3} key={`activities_challenges_${index}`}>
                                        <Paper className={classes.paper}>
                                            {item}
                                        </Paper>
                                    </Grid>
                                ))}
                            </Grid>
                        </Box>
                    )}
                </Box>
            </Box>
        );
    }
}

export default withStyles(styles)(Interests);
