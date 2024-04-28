import React from 'react';
import Typography from '@material-ui/core/Typography';  //h1, p replacement Tag
import Box from '@material-ui/core/Box';


const HealthSupportServices = ({ reports, collection }) => {

		return (
            
			<>
                <Typography variant="h6" color="secondary" align="left" gutterBottom>
                    Health Support Services 
				</Typography>
                
                
                <Box m={1} mb={2}>
                    {reports.support_wellness_program[collection] !== 999 &&
                    <Typography display="block" component="div" align="left" gutterBottom>
                        <Typography display="inline" variant="body1" component="div" color="primary" align="left" gutterBottom>
                            I attended wellness programs&nbsp;
                        </Typography>
                        <Typography display="inline" variant="body1" component="div" color="inherit" align="left" gutterBottom>
                            {reports.support_wellness_program[collection]}
                        </Typography>
                    </Typography>
                    }
                    {reports.support_healthcare[collection] !== 999 &&
                        <Typography display="block" component="div" align="left" gutterBottom>
                            <Typography display="inline" variant="body1" component="div" color="primary" align="left" gutterBottom>
                                I visited a health care provider&nbsp;
                            </Typography>
                            <Typography display="inline" variant="body1" component="div" color="inherit" align="left" gutterBottom>
                                {reports.support_healthcare[collection]}
                            </Typography>
                        </Typography>
                    }
                    {reports.support_home_healthcare[collection] !== 999 &&
                        <Typography display="block" component="div" align="left" gutterBottom>
                            <Typography display="inline" variant="body1" component="div" color="primary" align="left" gutterBottom>
                                I had home health care or personal support visits&nbsp;
                            </Typography>
                            <Typography display="inline" variant="body1" component="div" color="inherit" align="left" gutterBottom>
                            {reports.support_home_healthcare[collection]}
                            </Typography>
                        </Typography>
                    }
                    {reports.support_private_healthcare[collection] !== 999 &&
                    <Typography display="block" component="div" align="left" gutterBottom>
                        <Typography display="inline" variant="body1" component="div" color="primary" align="left" gutterBottom>
                            I paid privately for extra home health care or personal support visits&nbsp;
                        </Typography>
                        <Typography display="inline" variant="body1" component="div" color="inherit" align="left" gutterBottom>
                            {reports.support_private_healthcare[collection]}
                        </Typography>
                    </Typography>
                    }
                    {reports.support_informal[collection] !== 999 &&
                        <Typography display="block" component="div" align="left" gutterBottom>
                            <Typography display="inline" variant="body1" component="div" color="primary" align="left" gutterBottom>
                                I received informal support from friends, family, or a neighbour &nbsp;
                            </Typography>
                            <Typography display="inline" variant="body1" component="div" color="inherit" align="left" gutterBottom>
                                {reports.support_informal[collection]}
                            </Typography>
                        </Typography>
                    }
                    {reports.support_wellness_program[collection] == 999 &&
                        reports.support_healthcare[collection] == 999 &&
                        reports.support_home_healthcare[collection] == 999 &&
                        reports.support_private_healthcare[collection] == 999 &&
                        reports.support_informal[collection] == 999 &&
                        <Typography display="block" component="div" align="left" gutterBottom>
                            <Typography display="inline" variant="body1" component="div" color="primary" align="left" gutterBottom>
                                In the past year, I have not visited any health professionals, used health care programs or services, or attended health related wellness programs.
                            </Typography>
                        </Typography>
                    }
                </Box>
			</>
			);
}

export default HealthSupportServices;