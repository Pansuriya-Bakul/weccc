import React, { useEffect } from 'react'

import axios from 'axios';

import Box from '@material-ui/core/Box';
import Typography from "@material-ui/core/Typography";
import { List, ListItem, ListItemText, ListItemIcon } from '@material-ui/core';

import CommunityVisual from './CommunityVisual'
import './../reports.css';

const CommunityCircle = (props) => {
    const { reports, collection } = props;

    return (
        <Box m={1}>
            <Typography
                variant="h5"
                color="textSecondary"
                align="left"
                gutterBottom
            >
                Community Circle
            </Typography>

            <Box>

                {/* Community Visual */}


                        <Box>
                            <CommunityVisual reports={reports} collection={collection} />
                        </Box>

                        <Box>
                            <Typography variant="h6" color="secondary" align="left" gutterBottom className='avoid-break'>
                                Primary Circle
                            </Typography>

                            <ul>

                                {reports.household_size[collection]>=0 && reports.household_size[collection] !== 999 &&
                                    <li>
                                        <Typography display="block" component="div" align="left" gutterBottom>
                                            <Typography display="inline" variant="body1" component="div" color="black" align="left" gutterBottom>
                                                {reports.household_size[collection] > 0 ? `I live with ${reports.household_size[collection]} others` : "I live alone."}
                                            </Typography>
                                        </Typography>
                                    </li>
                                }

                                {reports.marital_status[collection] && reports.marital_status[collection] !== 999 &&

                                    <li>
                                        <Typography display="block" component="div" align="left" gutterBottom>
                                            <Typography display="inline" variant="body1" component="div" color="black" align="left" gutterBottom>
                                                I am {reports.marital_status[collection]}
                                            </Typography>
                                        </Typography>
                                    </li>
                                }
                                {reports.total_children[collection] > 0 && reports.total_children[collection] !== 999 &&
                                    <li>
                                        <Typography display="block" component="div" align="left" gutterBottom>
                                            <Typography display="inline" variant="body1" component="div" color="black" align="left" gutterBottom>
                                                {reports.total_children[collection] > 1 ? `I have ${reports.total_children[collection]} children` : "I have 1 child"}
                                            </Typography>
                                        </Typography>
                                    </li>
                                }

                                {reports.meaningful_people[collection] && reports.meaningful_people[collection] !== 999 &&
                                    <li>
                                        <Typography display="block" component="div" align="left" gutterBottom>
                                            <Typography display="inline" variant="body1" component="div" color="black" align="left" gutterBottom>
                                                My most meaningful social relationships are with {reports.meaningful_people[collection]}
                                            </Typography>
                                        </Typography>
                                    </li>
                                }

                            </ul>
                        </Box>



                {/* 
                <Box>
                <Typography variant="h6" color="secondary" align="left" gutterBottom>
                    Caregiving Roles
                </Typography>
                </Box> */}

                <Box>
                    <Typography variant="h6" color="secondary" align="left" gutterBottom>
                        Social Activities - Opportunities
                    </Typography>

                    <ul>
                        {reports.meaningful_activities[collection] && reports.meaningful_activities[collection] !== 999 &&
                            <li>
                                <Typography display="block" component="div" align="left" gutterBottom>
                                    <Typography display="inline" variant="body1" component="div" color="black" align="left" gutterBottom>
                                        Activities that are most meaningful to me:
                                    </Typography>
                                </Typography>
                                <ul style={{ listStyleType: 'circle' }}>
                                    {reports.meaningful_activities[collection].map((item, index) =>
                                        <li key={`activities_${index}`}>
                                            <Typography display="inline" variant="body1" component="div" color="black" align="left" gutterBottom>
                                                {item}
                                            </Typography>
                                        </li>)}
                                </ul>
                            </li>
                        }

                        {reports.like_to_join[collection] && reports.like_to_join[collection] !== 999 &&
                            <li>
                                <Typography display="block" component="div" align="left" gutterBottom>
                                    <Typography display="inline" variant="body1" component="div" color="black" align="left" gutterBottom>
                                        Things I really enjoy doing, that I would like to do more of:
                                    </Typography>
                                </Typography>
                                <ul style={{ listStyleType: 'circle' }}>
                                    {reports.like_to_join[collection].map((item, index) =>
                                        <li key={`activities_${index}`}>
                                            <Typography display="inline" variant="body1" component="div" color="black" align="left" gutterBottom>
                                                {item}
                                            </Typography>
                                        </li>)}
                                </ul>
                            </li>
                        }

                        {reports.challenging_activities[collection] && reports.challenging_activities[collection] !== 999 &&
                            <li>
                                <Typography display="block" component="div" align="left" gutterBottom>
                                    <Typography display="inline" variant="body1" component="div" color="black" align="left" gutterBottom>
                                        Barriers I need to address:
                                    </Typography>
                                </Typography>
                                <ul style={{ listStyleType: 'circle' }}>
                                    {reports.challenging_activities[collection].map((item, index) =>
                                        <li key={`activities_${index}`}>
                                            <Typography display="inline" variant="body1" component="div" color="black" align="left" gutterBottom>
                                                {item}
                                            </Typography>
                                        </li>)}
                                </ul>
                            </li>
                        }

                    </ul>
                </Box>

            </Box>

        </Box >

    )
}

export default CommunityCircle