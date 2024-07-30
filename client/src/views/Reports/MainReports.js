import React, { useState, useEffect, useCallback, useRef } from "react";
import PropTypes from 'prop-types';
import CompletedSurveysTable from "../Administration/Users/Components/UserStatusTab/CompletedSurveysTable";

import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import { CircularProgress , Divider, LinearProgress} from "@material-ui/core";
import get from '../../helpers/common/get';
import AlertType from "../../helpers/models/AlertType";
import patch from "../../helpers/common/patch";




const MainReports= (props) => {
    // const appState = useRef(AppState.currentState);
    const { appState} = props;
    const [userID,setuserID] = useState(null)
    const [alert, setAlert] = useState(new AlertType());
    const [memberCollections, setMemberCollections] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const getMemberCollections = useCallback(() => {
        if (!userID) {
            setAlert(new AlertType('User ID is not defined.', "error"));
            return;
        }

        get("membercollections/client/" + userID, appState.token, (err, res) => {
            if (err) {
                setAlert(new AlertType('Unable to retrieve Member Series. Please refresh and try again.', "error"));
            } else {
                if (res.status === 200) {
                    setMemberCollections(res.data.memberCollections);
                    setIsLoading(false);
                } else {
                    setAlert(new AlertType('Unable to retrieve Member Series. Please refresh and try again.', "error"));
                }
            }
        });
    }, [userID, appState.token]);

    useEffect(() => {
        getMemberCollections();
        const userID = localStorage.getItem('_id');
        setuserID(userID)

        getMemberCollections();
      // stop loading
    //   setIsLoading(false);
    },[ getMemberCollections]);

    return (
        <>
            <div>
                
                <Typography>Completed Report</Typography>
                <Divider />
                {isLoading?<CircularProgress style={{position: 'absolute',
    top: '20%',
    left: '50%',
    }}/>:
                
                <CompletedSurveysTable
                    data={memberCollections ? memberCollections : []}
                    role={appState.role}
                />
}
            </div>
        </>
    );
};

MainReports.propTypes = {
    userID: PropTypes.string.isRequired,
    appState: PropTypes.object.isRequired,
    userOriginal: PropTypes.object,
    setParentAlert: PropTypes.func,
    getParentInfo: PropTypes.func,
};

MainReports.defaultProps = {
    appState: {},
    userID: null,
    userOriginal: {},
    setParentAlert: () => {},
    getParentInfo: () => {},
};

export default MainReports;


