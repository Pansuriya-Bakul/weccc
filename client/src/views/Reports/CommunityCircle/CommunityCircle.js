import React from 'react';
import Box from '@material-ui/core/Box';
import Typography from "@material-ui/core/Typography";
import CommunityVisual from './CommunityVisual';
import './../reports.css';

const CommunityCircle = (props) => {
    const { reports, collection } = props;

    // Helper function to safely get values from arrays
    const getArrayValue = (arr, index) => {
        return arr && arr.length > index ? arr[index] : [];
    };

    // Convert string values to numbers where applicable
    const convertToNumber = (value) => {
        const num = Number(value);
        return isNaN(num) ? 0 : num;
    };

    // Extract values
    const householdSize = convertToNumber(getArrayValue(reports.household_size, collection));
    const maritalStatus = getArrayValue(reports.marital_status, collection);
    const totalChildren = convertToNumber(getArrayValue(reports.total_children, collection));
    const meaningfulPeople = getArrayValue(reports.meaningful_people, collection);
    const meaningfulActivities = getArrayValue(reports.meaningful_activities, 0);
    const likeToJoin = getArrayValue(reports.like_to_join, collection);
    const challengingActivities = getArrayValue(reports.challenging_activities, collection);

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
                        {householdSize > 0 && householdSize !== 999 &&
                            <li>
                                <Typography display="block" component="div" align="left" gutterBottom>
                                    <Typography display="inline" variant="body1" component="div" color="black" align="left" gutterBottom>
                                        {householdSize > 0 ? `I live with ${householdSize} others` : "I live alone."}
                                    </Typography>
                                </Typography>
                            </li>
                        }

                        {maritalStatus &&
                            <li>
                                <Typography display="block" component="div" align="left" gutterBottom>
                                    <Typography display="inline" variant="body1" component="div" color="black" align="left" gutterBottom>
                                        I am {maritalStatus}
                                    </Typography>
                                </Typography>
                            </li>
                        }

                        {totalChildren > 0 && totalChildren !== 999 &&
                            <li>
                                <Typography display="block" component="div" align="left" gutterBottom>
                                    <Typography display="inline" variant="body1" component="div" color="black" align="left" gutterBottom>
                                        {totalChildren > 1 ? `I have ${totalChildren} children` : "I have 1 child"}
                                    </Typography>
                                </Typography>
                            </li>
                        }

                        {meaningfulPeople &&
                            <li>
                                <Typography display="block" component="div" align="left" gutterBottom>
                                    <Typography display="inline" variant="body1" component="div" color="black" align="left" gutterBottom>
                                        My most meaningful social relationships are with {meaningfulPeople}
                                    </Typography>
                                </Typography>
                            </li>
                        }
                    </ul>
                </Box>

                <Box>
                    <Typography variant="h6" color="secondary" align="left" gutterBottom>
                        Social Activities - Opportunities
                    </Typography>

                    <ul>
                        {meaningfulActivities.length > 0 &&
                            <li>
                                <Typography display="block" component="div" align="left" gutterBottom>
                                    <Typography display="inline" variant="body1" component="div" color="black" align="left" gutterBottom>
                                        Activities that are most meaningful to me:
                                    </Typography>
                                </Typography>
                                <ul style={{ listStyleType: 'circle' }}>
                                    {meaningfulActivities.map((item, index) =>
                                        <li key={`activities_${index}`}>
                                            <Typography display="inline" variant="body1" component="div" color="black" align="left" gutterBottom>
                                                {item}
                                            </Typography>
                                        </li>
                                    )}
                                </ul>
                            </li>
                        }

                        {likeToJoin && likeToJoin.length > 0 &&
                            <li>
                                <Typography display="block" component="div" align="left" gutterBottom>
                                    <Typography display="inline" variant="body1" component="div" color="black" align="left" gutterBottom>
                                        Things I really enjoy doing, that I would like to do more of:
                                    </Typography>
                                </Typography>
                                <ul style={{ listStyleType: 'circle' }}>
                                    {likeToJoin.map((item, index) =>
                                        <li key={`likeToJoin_${index}`}>
                                            <Typography display="inline" variant="body1" component="div" color="black" align="left" gutterBottom>
                                                {item}
                                            </Typography>
                                        </li>
                                    )}
                                </ul>
                            </li>
                        }

                        {challengingActivities && challengingActivities.length > 0 &&
                            <li>
                                <Typography display="block" component="div" align="left" gutterBottom>
                                    <Typography display="inline" variant="body1" component="div" color="black" align="left" gutterBottom>
                                        Barriers I need to address:
                                    </Typography>
                                </Typography>
                                <ul style={{ listStyleType: 'circle' }}>
                                    {challengingActivities.map((item, index) =>
                                        <li key={`challengingActivities_${index}`}>
                                            <Typography display="inline" variant="body1" component="div" color="black" align="left" gutterBottom>
                                                {item}
                                            </Typography>
                                        </li>
                                    )}
                                </ul>
                            </li>
                        }
                    </ul>
                </Box>
            </Box>
        </Box>
    );
}

export default CommunityCircle;
