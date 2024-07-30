import React, { Component } from 'react';
import { Typography, Grid, Paper } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import CommunityParticipationSuggestion from './Suggestions/CommunityParticipationSuggestion';
import HealthSuggestion from './Suggestions/HealthSuggestion';
import LonelinessSuggesiton from './Suggestions/LonelinessSuggesiton';
import SocialContactSuggesiton from './Suggestions/SocialContactSuggestion';
import SocialSupportSuggesiton from './Suggestions/SocialSupportSuggesiton';
import WellBeingSuggestion from './Suggestions/WellBeingSuggestion';

const styles = theme => ({
    root: {
        padding: theme.spacing(3),
    },
    heading: {
        marginBottom: theme.spacing(2),
        color: theme.palette.primary.main,
    },
    section: {
        marginBottom: theme.spacing(4),
        padding: theme.spacing(2),
        backgroundColor: theme.palette.background.paper,
        borderRadius: theme.shape.borderRadius,
        '&:hover': {
            boxShadow: theme.shadows[4],
        },
    },
    text: {
        marginBottom: theme.spacing(2),
    },
});

class Suggestions extends Component {
    render() {
        const { classes, reports, collection } = this.props;

        return (
            <Grid container spacing={3} className={classes.root}>
                <Grid item xs={12}>
                    <Paper className={classes.section}>
                        <Typography variant="h6" className={classes.heading}>
                            Goals
                        </Typography>
                        <Typography variant="body1" className={classes.text}>
                            It’s important to take steps now to achieve your wishes and hopes for the future.
                            Thinking about what you would like to see different in your life 1 month, 3 months and 6 months from now, and what you can do to make this happen, can help.
                            Remember, a wish written down with a date becomes a goal.
                            A goal broken down into steps becomes a plan. A plan backed by action becomes reality. Is there anything the community could help you with to make your wishes happen?
                        </Typography>
                        <HealthSuggestion reports={reports} collection={collection} />
                        <WellBeingSuggestion reports={reports} collection={collection} />
                        <SocialSupportSuggesiton reports={reports} collection={collection} />
                        <LonelinessSuggesiton reports={reports} collection={collection} />
                        {/* <CommunityParticipationSuggestion reports={reports} collection={collection} /> */}
                        <SocialContactSuggesiton reports={reports} collection={collection} />
                    </Paper>
                </Grid>
                <Grid item xs={12}>
                    <Paper className={classes.section}>
                        <Typography variant="h6" className={classes.heading}>
                            Helping Others
                        </Typography>
                        <Typography variant="body1" className={classes.text}>
                            It’s human nature to both get help and to help others, at every age and stage. Do you know anyone who is lonely or could use some extra help?
                            Try reaching out and sharing your time and talent with them.
                        </Typography>
                        <Typography variant="body1" className={classes.text}>
                            Remember – Being involved in meaningful activities and maintaining close relationships is important.
                            Staying active and helping others is good for your health and good for the community!
                        </Typography>
                    </Paper>
                </Grid>
            </Grid>
        );
    }
}

export default withStyles(styles)(Suggestions);
