import React, { Component } from 'react';
import Box from '@material-ui/core/Box';
import { Grid, Typography, Divider } from "@material-ui/core";
import purple from '@material-ui/core/colors/purple'
import redflag from '../Reports/redflag.png';
import smiley from '../Reports/smiley.png'
import { useState } from 'react';
import { get } from 'jquery';


const ScreenerResults = ({ reports, collection }) => {

    const answerValueToText = {
        household2_size: {
            0: "Lives alone",
            1: "1 person",
            2: "2 people",
            3: "3 people",
            4: "4 or more people"
        },
        community_activity_participate: {
            0: "No",
            1: "Yes"
        },
        local_community_belonging: {
            0: "Very weak",
            1: "Somewhat weak",
            2: "Somewhat strong",
            3: "Very strong"
        },
        lack_companionship: {
            0: "Hardly ever",
            1: "Sometimes",
            2: "Often"
        },
        feel_isolated: {
            0: "Hardly ever",
            1: "Sometimes",
            2: "Often"
        },
        feel_leftout: {
            0: "Hardly ever",
            1: "Sometimes",
            2: "Often"
        },
    }


const RedFlagIcon = () => {
    return (
        <img
            src={redflag}
            alt="red flag"
            width="64px"
            height="64px"
        />
    );
};

const GreenSmileyIcon = () => {
    return (
        <img
            src={smiley}
            alt="green smiley"
            width="64px"
            height="64px"
        />
    );
};

const checkConcern = () => {
    if ((reports.lack_companionship == '2' || reports.feel_isolated == '2' || reports.feel_leftout == '2') ||
        (reports.lack_companionship == '1' && reports.feel_isolated == '1') ||
        (reports.feel_leftout == '1' && reports.feel_isolated == '1') ||
        (reports.lack_companionship == '1' && reports.feel_leftout == '1')) {
        return "Loneliness is a concern.\n\nIt's important to your health to feel like you have people to talk to and relate to in ways that are authentic and satisfying. Consider reaching out to friends, family, or support groups for assistance, and explore resources that can help you combat the effects of loneliness.\n\nKeeping and maintaining relationships can be hard — especially in today's fast-paced world. Education and skills workshops can help.\n\nTo feel loved, acknowledged and validated, lean into close relationships- but avoid toxic ones. Reach out to old friends and don't be afraid to make new ones. If you find yourself thinking about a friend or family members, give them a call just to say hi. Or set up a regularly scheduled call or video chat to talk about favourite shows or what's happening around the world. Diversity is important too. Talking to people — even those you don't have a close relationship with — also matters. Different relationships provide different types of support.\n\nIf you're having a hard time finding those people, consider getting involved in group activities or trusted virtual communities - such as faith, fitness, music, movies or sport - where you're likely to meet people who share your interests. Think about the talents you have that you can share with others - invite others to join you in doing the activities you love best. Volunteering is also a good way to address loneliness, or to reach out informally to help others"

    } else {
        return "No concerns flagged.\n\nHowever, it's important to keep working to maintain social connections and engage in activities that promote well-being.\n\nTo feel loved, acknowledged and validated, lean into close relationships- but avoid toxic ones. Reach out to old friends and don't be afraid to make new ones. If you find yourself thinking about a friend or family members, give them a call just to say hi. Or set up a regularly"
    }
}

const getAnswerText = (key) => {
    return answerValueToText[key][reports[key]];
};

return (
    <Grid container >
        <Grid container spacing={1} >
            <Grid item xs={12} sm={6} md={4} lg={3}>
                <Typography variant="h6" color="textSecondary">
                    Your Answers
                </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={4} style={{ paddingLeft: '40px' }}>
                <Typography variant="h6" color="textSecondary">
                    Why This is a Concern
                </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={5} style={{ paddingLeft: '40px' }}>
                <Typography variant="h6" color="textSecondary">
                    Recommendations - Steps You Can Take
                </Typography>
            </Grid>
            <Grid item xs={12}>
                <Divider light />
            </Grid>
        </Grid>


        <Grid container spacing={2}>
            {reports.household2_size && reports.household2_size !== 999 &&
                <>
                    <Grid item xs={12} sm={6} md={4} lg={3} style={{ paddingTop: "24px", backgroundColor:"#faf7ff"}}>
                        <Typography variant="subtitle1">
                            How many people do you live with?
                        </Typography>
                        <Typography variant="subtitle1" style={{ fontWeight: '500', paddingBottom: "24px", color:"purple" }}>
                            {getAnswerText('household2_size')}
                        </Typography>
                        {reports.household2_size === '0' ? <RedFlagIcon /> : <GreenSmileyIcon/>}
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={4} style={{ paddingLeft: '40px', paddingTop: "24px",backgroundColor:"#faf7ff"  }}>
                        <Typography variant="body1" style={{ paddingBottom: "24px" }}>

                            People who live alone have fewer opportunities for daily social interaction and support and are at increased risk of loneliness. Studies have shown that living alone, particularly for men, is hazardous to your health

                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={5} style={{ paddingLeft: '40px', paddingTop: "24px" , backgroundColor:"#faf7ff"}}>
                        <Typography variant="body1" style={{ paddingBottom: "24px", whiteSpace: "pre-line" }}>
                            {reports.household2_size === '0' ?
                                "Recognize the risks of living alone by prioritizing social relationships to make sure you are getting enough social interaction. One to three hours of social interaction per day is recommended - or between seven and 21 hours of social time per week. \n\n Social interactions can include a wide variety of activities: chatting with people on your street, a phone call to a friend, or join an activity that involves others."
                                :
                                "Even if you live with others, make sure you are getting enough social interaction - one to three hours of social interaction per day is recommended. That's between seven and 21 hours of social time per week.\n\nSocial interactions can include a wide variety of activities: family dinners, chatting with people on your street, a phone call to a friend, or join an activity that involves others.\n\nHelp build connected communities by reaching out to people who live alone."
                            }
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        {/* <Divider light /> */}
                    </Grid>
                </>
            }

            {reports.community_activity_participate && reports.community_activity_participate !== 999 &&
                <>
                    <Grid item xs={12} sm={6} md={4} lg={3} style={{ paddingTop: "24px" }}>
                        <Typography variant="subtitle1" >
                            Do you participate in community activities as much as you would like?
                        </Typography>
                        <Typography variant="body1" style={{ fontWeight: '500', paddingBottom: "24px", color:"purple"}}>
                            {getAnswerText('community_activity_participate')}
                        </Typography>
                        {reports.community_activity_participate === "0" ? <RedFlagIcon /> : <GreenSmileyIcon/>}
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={4} style={{ paddingLeft: '40px', paddingTop: "24px" }}>
                        <Typography variant="body1" style={{ paddingBottom: "24px" }}>
                            Low social levels of social participation are linked to increased risk of early death. Positive social relationships that come from connecting with people with shared interests are associated with health and well-being
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={5} style={{ paddingLeft: '40px', paddingTop: "24px" }}>
                        <Typography variant="body1" style={{ paddingBottom: "24px", whiteSpace: "pre-line" }}>
                            {reports.community_activity_participate === "0" ?
                                "Participating in social activities less than you would like is a concern.\n\nTry to participate at least once a week in a group activity or hobby that's meaningful to you or try something new. If you are homebound or lack transportation, think about virtual groups that match your circumstances and interests. Don't know where to look? Community connectors can help.\n\nThe key is finding the right level of activity that's meaningful to you. It's also ok to spend time alone - this can provide an opportunity to restore your social reserves and meet your own personal needs."
                                :
                                "No concern flagged.\n\nRemember, it's important to stay involved with activities and hobbies that interest you. Try to participate at least once a week in a group activity that's meaningful to you and keep trying something new.\n\nThe key is finding the right level of activity that's meaningful to you. It's also ok to spend time alone - this can provide an opportunity to restore your social reserves and meet your own personal needs"
                            }
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        {/* <Divider light /> */}
                    </Grid>
                </>
            }

            {reports.life_satisfaction2 && reports.life_satisfaction2 !== 999 &&
                <>
                    <Grid item xs={12} sm={6} md={4} lg={3} style={{ paddingTop: "24px" , backgroundColor:"#faf7ff"}}>
                        <Typography variant="subtitle1">
                            Using a scale of 1 to 10 where 1 means "Very dissatisfied" and 10 means "Very satisfied", how do you feel about your life as a whole right now?
                        </Typography>
                        <Typography variant="body1" style={{ fontWeight: '500', paddingBottom: "24px", color:"purple" }}>
                            {reports.life_satisfaction2}
                        </Typography>
                        {reports.life_satisfaction2 <= 6 ? <RedFlagIcon /> : <GreenSmileyIcon/>}
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={4} style={{ paddingLeft: '40px', paddingTop: "24px" , backgroundColor:"#faf7ff"}}>
                        <Typography variant="body1" style={{ paddingBottom: "24px" }}>

                            Low life satisfaction more than doubles the risk of chronic disease and early death. Life satisfaction is strongly associated with sleep problems, pain, obesity, smoking, anxiety, physical activity, diagnosed mental disease, and with higher healthcare utilization and costs.

                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={5} style={{ paddingLeft: '40px', paddingTop: "24px" , backgroundColor:"#faf7ff"}}>
                        <Typography variant="body1" style={{ paddingBottom: "24px", whiteSpace: "pre-line" }}>
                            {reports.life_satisfaction2 <= 6 ?
                                "Life satisfaction is a concern.\n\nFeeling dissatisfied with your life is a sign that you may be experiencing some stressful challenges and may need extra support. Setting goals for what you would like to change, and what you can do to make this happen, can help. Each day, think about what you can do to achieve something that's important, develop good personal relationships with others, and try to find meaning in what's happening to you right now.\n\nYou may benefit from developing a plan and building a network of care that is responsive to all aspects of your physical, emotional, social and spiritual health"
                                :
                                "No concern flagged.\n\nMaintain and protect your health by staying involved in activities that bring joy, purpose, meaning, and a sense of achievement to your life. Think about life goals and how to achieve them."
                            }
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        {/* <Divider light /> */}
                    </Grid>
                </>
            }

            {reports.local_community_belonging && reports.local_community_belonging !== 999 &&
                <>
                    <Grid item xs={12} sm={6} md={4} lg={3} style={{ paddingTop: "24px" }}>
                        <Typography variant="subtitle1">
                            How would you describe your sense of belonging to your local community?
                        </Typography>
                        <Typography variant="body1" style={{ fontWeight: '500', paddingBottom: "24px", color:"purple" }}>
                            {getAnswerText('local_community_belonging')}
                        </Typography>
                        {(reports.local_community_belonging === "1" || reports.local_community_belonging === "0") ? <RedFlagIcon /> : <GreenSmileyIcon/>}
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={4} style={{ paddingLeft: '40px', paddingTop: "24px" }}>
                        <Typography variant="body1" style={{ paddingBottom: "24px" }}>
                            Community belonging is strongly associated with physical health and increased risk of chronic disease.
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={5} style={{ paddingLeft: '40px', paddingTop: "24px" }}>
                        <Typography variant="body1" style={{ paddingBottom: "24px", whiteSpace: "pre-line" }}>
                            {reports.local_community_belonging === "1" || reports.local_community_belonging === "0" ?
                                "Community belonging is a concern.\n\nThink about different ways to connect with and give back to communities that are important to you – these may be geographic or virtual. A great way to build belonging is to volunteer, to reach out to offer help to others, or even to do small random acts of kindness.\n\nStudies have shown that something as simple as talking to neighbours can build a sense of community and even talking to strangers can create a sense of safety and provide a meaningful source of connection."

                                : "No concern flagged.\n\nA great way to maintain and build belonging is to volunteer, to reach out to offer help to others, or even random acts of kindness.\n\nStudies have shown that something as simple as talking to neighbours can build a sense of community and even talking to strangers can create a sense of safety and provide a meaningful source of connection."
                            }
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        {/* <Divider light /> */}
                    </Grid>
                </>
            }
            <Grid item xs={12} sm={6} md={4} lg={3} style={{ paddingTop: "24px", backgroundColor:"#faf7ff" }}>
                {reports.lack_companionship && reports.lack_companionship !== 999 &&
                    <>
                        <Grid item xs={12}>
                            <Typography variant="subtitle1">
                                How often do you feel that you lack companionship?
                            </Typography>
                            <Typography variant="body1" style={{ fontWeight: '500', paddingBottom: "24px", color:"purple" }}>
                                {getAnswerText('lack_companionship')}
                            </Typography>
                        </Grid>
                    </>
                }

                {reports.feel_leftout && reports.feel_leftout !== 999 &&
                    <>
                        <Grid item xs={12}>
                            <Typography variant="subtitle1">
                                How often do you feel left out?
                            </Typography>
                            <Typography variant="body1" style={{ fontWeight: '500', paddingBottom: "24px", color:"purple" }}>
                                {getAnswerText('feel_leftout')}
                            </Typography>
                        </Grid>
                    </>
                }

                {reports.feel_isolated && reports.feel_isolated !== 999 &&
                    <>
                        <Grid item xs={12}>
                            <Typography variant="subtitle1">
                                How often do you feel isolated from others?
                            </Typography>
                            <Typography variant="body1" style={{ fontWeight: '500', paddingBottom: "24px", color:"purple" }}>
                                {getAnswerText('feel_isolated')}
                            </Typography>
                        </Grid>
                    </>
                }
                {((reports.lack_companionship == '2' || reports.feel_isolated == '2' || reports.feel_leftout == '2') ||
                    (reports.lack_companionship == '1' && reports.feel_isolated == '1') ||
                    (reports.feel_leftout == '1' && reports.feel_isolated == '1') ||
                    (reports.lack_companionship == '1' && reports.feel_leftout == '1')) ? <RedFlagIcon /> : <GreenSmileyIcon/>}
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={4} style={{ paddingLeft: '40px', paddingTop: "24px", backgroundColor:"#faf7ff" }}>
                <Typography variant="body1" style={{ paddingBottom: "24px" }}>
                    Perceived loneliness (even if you are around other people) is worse for health than smoking 15 cigarettes a day or being obese - it is associated with higher risk of stress, anxiety; depression; heart disease; stroke; dementia; falls; use of long-term care; and early death.
                </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={5} style={{ paddingLeft: '40px', paddingTop: "24px", backgroundColor:"#faf7ff" }}>
                <Typography variant="body1" style={{ paddingBottom: "24px", whiteSpace: "pre-line" }}>
                    {checkConcern()}
                </Typography>
            </Grid>
            <Grid item xs={12}>
                {/* <Divider light /> */}
            </Grid>
        </Grid>

    </Grid>
);
};

export default ScreenerResults;