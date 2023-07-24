import React, { Component } from 'react';
import Box from '@material-ui/core/Box';
import { Grid, Typography, Divider } from "@material-ui/core";


const ScreenerResults = ({ reports, collection }) => {

    const checkConcern = () => {
        if ((reports.lack_companionship == 'Often' || reports.feel_isolated == 'Often' || reports.feel_leftout == 'Often') ||
            (reports.lack_companionship == 'Sometimes' && reports.feel_isolated == 'Sometimes') ||
            (reports.feel_leftout == 'Sometimes' && reports.feel_isolated == 'Sometimes') ||
            (reports.lack_companionship == 'Sometimes' && reports.feel_leftout == 'Sometimes')) {
            return "Loneliness is a concern. Loneliness is worse for health than smoking 15 cigarettes a day or being obese – it is associated with higher risk of stress, anxiety; depression; heart disease; stroke; dementia; falls; use of long-term care; and early death. People who are lonely need to find positive ways to connect with others in ways that are authentic and satisfying."

        }
        return "No specific concerns identified for this question"
    }
    return (
        <Grid container >
            <Grid container spacing={2} >
                <Grid item xs={12} sm={6} md={4} lg={3}>
                    <Typography variant="h6" color="textSecondary">
                        Your Answers
                    </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={8} lg={9} style={{ paddingLeft: '40px' }}>
                    <Typography variant="h6" color="textSecondary">
                        Possible Concerns
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <Divider light />
                </Grid>
            </Grid>


            <Grid container spacing={2}>
                {reports.household2_size[collection] && reports.household2_size[collection] !== 999 &&
                    <>
                        <Grid item xs={12} sm={6} md={4} lg={3} style={{ paddingTop: "24px" }}>
                            <Typography variant="subtitle1">
                                How many people do you live with?
                            </Typography>
                            <Typography variant="subtitle1" color="secondary" style={{ fontWeight: '500', paddingBottom: "24px" }}>
                                {reports.household2_size[collection]}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} md={8} lg={9} style={{ paddingLeft: '40px', paddingTop: "24px" }}>
                            <Typography variant="body1" style={{ paddingBottom: "24px" }}>
                                {reports.household2_size[collection] === 'Lives alone' ?
                                    "Living alone is associated with lower social support and social interactions, increasing susceptibility to negative health outcomes. People who live alone may need to organize extra activities and spend more time with others outside of home." :
                                    "No specific concerns identified for this question"
                                }
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Divider light />
                        </Grid>
                    </>
                }

                {reports.community_activity_participate[collection] && reports.community_activity_participate[collection] !== 999 &&
                    <>
                        <Grid item xs={12} sm={6} md={4} lg={3} style={{ paddingTop: "24px" }}>
                            <Typography variant="subtitle1" >
                                Do you participate in community activities as much as you would like?
                            </Typography>
                            <Typography variant="body1" color="secondary" style={{ fontWeight: '500', paddingBottom: "24px" }}>
                                {reports.community_activity_participate[collection]}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} md={8} lg={9} style={{ paddingLeft: '40px', paddingTop: "24px" }}>
                            <Typography variant="body1" style={{ paddingBottom: "24px" }}>
                                {reports.community_activity_participate[collection] === "No" ?
                                    "Not participating in community activities as much as you would like is a concern. Positive social relationships are associated with health and well-being. Low social levels of social participation is linked to increased risk of early death." :
                                    "No specific concerns identified for this question"
                                }
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Divider light />
                        </Grid>
                    </>
                }

                {reports.life_satisfaction2[collection] && reports.life_satisfaction2[collection] !== 999 &&
                    <>
                        <Grid item xs={12} sm={6} md={4} lg={3} style={{ paddingTop: "24px" }}>
                            <Typography variant="subtitle1">
                                Using a scale of 1 to 10 where 1 means "Very dissatisfied" and 10 means "Very satisfied", how do you feel about your life as a whole right now?
                            </Typography>
                            <Typography variant="body1" color="secondary" style={{ fontWeight: '500', paddingBottom: "24px" }}>
                                {reports.life_satisfaction2[collection]}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} md={8} lg={9} style={{ paddingLeft: '40px', paddingTop: "24px" }}>
                            <Typography variant="body1" style={{ paddingBottom: "24px" }}>
                                {reports.life_satisfaction2[collection] <= 6 ?
                                    "Life satisfaction is a concern. You should be aware that low life satisfaction more than doubles the risk of chronic disease and early death. Life satisfaction is strongly associated with sleep problems, pain, obesity, smoking, anxiety, physical activity, diagnosed mental disease, and with higher healthcare utilization and costs. People who are dissatisfied with some aspects of their lives may need to pay special attention to finding activities that bring joy, purpose, meaning to your life." :
                                    "No specific concerns identified for this question"
                                }
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Divider light />
                        </Grid>
                    </>
                }

                {reports.local_community_belonging[collection] && reports.local_community_belonging[collection] !== 999 &&
                    <>
                        <Grid item xs={12} sm={6} md={4} lg={3} style={{ paddingTop: "24px" }}>
                            <Typography variant="subtitle1">
                                How would you describe your sense of belonging to your local community?
                            </Typography>
                            <Typography variant="body1" color="secondary" style={{ fontWeight: '500', paddingBottom: "24px" }}>
                                {reports.local_community_belonging[collection]}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} md={8} lg={9} style={{ paddingLeft: '40px', paddingTop: "24px" }}>
                            <Typography variant="body1" style={{ paddingBottom: "24px" }}>
                                {reports.local_community_belonging[collection] === "Somewhat weak" || reports.local_community_belonging[collection] === "Very weak" ?
                                    "Community belonging is a concern. Community belonging is strongly associated with physical health and increased risk of chronic disease. People who lack a sense of community belonging may need to pay special attention to finding ways they can connect with others, and enjoy ways of give back to their community." 
                                    
                                    : "No specific concerns identified for this question"
                                }
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Divider light />
                        </Grid>
                    </>
                }
                <Grid item xs={12} sm={6} md={4} lg={3} style={{ paddingTop: "24px" }}>
                    {reports.lack_companionship[collection] && reports.lack_companionship[collection] !== 999 &&
                        <>
                            <Grid item xs={12}>
                                <Typography variant="subtitle1">
                                    How often do you feel that you lack companionship?
                                </Typography>
                                <Typography variant="body1" color="secondary" style={{ fontWeight: '500', paddingBottom: "24px" }}>
                                    {reports.lack_companionship[collection]}
                                </Typography>
                            </Grid>
                        </>
                    }

                    {reports.feel_leftout[collection] && reports.feel_leftout[collection] !== 999 &&
                        <>
                            <Grid item xs={12}>
                                <Typography variant="subtitle1">
                                    How often do you feel left out?
                                </Typography>
                                <Typography variant="body1" color="secondary" style={{ fontWeight: '500', paddingBottom: "24px" }}>
                                    {reports.feel_leftout[collection]}
                                </Typography>
                            </Grid>
                        </>
                    }

                    {reports.feel_isolated[collection] && reports.feel_isolated[collection] !== 999 &&
                        <>
                            <Grid item xs={12}>
                                <Typography variant="subtitle1">
                                    How often do you feel isolated from others?
                                </Typography>
                                <Typography variant="body1" color="secondary" style={{ fontWeight: '500', paddingBottom: "24px" }}>
                                    {reports.feel_isolated[collection]}
                                </Typography>
                            </Grid>
                        </>
                    }
                </Grid>
                <Grid item xs={12} sm={6} md={8} lg={9} style={{ paddingLeft: '40px', paddingTop: "24px" }}>
                    <Typography variant="body1" style={{ paddingBottom: "24px" }}>
                        {checkConcern()}
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <Divider light />
                </Grid>
            </Grid>

        </Grid>
    );
};

export default ScreenerResults;