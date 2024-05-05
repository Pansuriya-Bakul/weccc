import React, { useState, useEffect, useCallback } from 'react';
import get from '../../../../helpers/common/get';

// ==================== MUI =========================
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';

const StartProgram = (props) => {
    const { appState, userID, ToggleDrawerClose, CheckAuthenticationValidity } = props;
    const [user, setUser] = useState({});

    const getUser = useCallback(async (userID) => {
        return new Promise((resolve, reject) => {
            get("users/" + userID, appState.token, (err, res) => {
                if (err) {
                    // Reject the promise with the error
                    reject(new Error('Unable to retrieve Member Series. Please refresh and try again.'));
                } else {
                    if (res.status === 200) {
                        // Resolve the promise with the data
                        resolve(res.data.user);
                    } else {
                        // Reject the promise with an error message
                        reject(new Error('Coud not retrieve user. Please refresh and try again.'));
                    }
                }
            });
        });
    }, [appState]);

    useEffect(() => {
        getUser(userID)
            .then((user) => {
                setUser(user);

            })
            .catch((err) => {
                console.log(err.message);
            });
    }, [getUser, userID]);

    return (
        <div>
            <Box mx={1} my={1}>
                <Typography variant="h5" color="inherit" align="left" gutterBottom>
                    Start Program
                </Typography>
            </Box>

            <Card raised={true} style={{padding:"12px", marginTop: "16px"}}>
                {user &&
                    <Typography variant="body1" color="inherit" align="left" gutterBottom style={{fontSize: "18px"}}>
                        <span style={{ fontWeight: "500" }}>Name:</span> {user.info ? user.info.name : ""}
                    </Typography>
                }

                <div style={{marginTop: "24px"}}>
                    <Typography variant="body1" color="inherit" align="left" gutterBottom style={{fontSize: "18px", fontWeight:"500"}}>
                        Assign Status
                    </Typography>
                </div>
            </Card>
        </div>
    )
}

export default StartProgram