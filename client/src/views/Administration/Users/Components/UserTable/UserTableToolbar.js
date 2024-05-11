// ================================================
// Code associated with 
// ================================================
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';                // Used for link navigation to other areas on the website
import PropTypes from 'prop-types';                     //Development Package to validate prop types [Type Checking] passed down
import clsx from 'clsx';                                // Constructing className strings conditionally. Used for render logic

// ==================== Modules =====================

// ==================== Components ==================

// ==================== Helpers =====================
import get from '../../../../../helpers/common/get';
import AlertType from '../../../../../helpers/models/AlertType';

// ==================== MUI =========================
import { makeStyles } from '@material-ui/core/styles';  // withStyles can be used for classes and functional componenents but makeStyle is designed for new React with hooks

import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';

import { lighten } from '@material-ui/core/styles';

import Typography from '@material-ui/core/Typography';

// ==================== MUI Icons ====================
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import VisibilityIcon from '@material-ui/icons/Visibility';
import SystemUpdateAltIcon from '@material-ui/icons/SystemUpdateAlt';
import FilterListIcon from '@material-ui/icons/FilterList';
import Ballot from '@material-ui/icons/Ballot';
import ImageSearchIcon from '@material-ui/icons/ChromeReaderMode';
import PersonIcon from '@material-ui/icons/Person';
import { set } from 'joi/lib/types/lazy';
// ==================== MUI Styles ===================

const useStyles = makeStyles((theme) =>    //Notice the hook useStyles
({
    root: {
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(1),
    },
    highlight:
        theme.palette.type === 'light'
            ? {
                color: theme.palette.secondary.main,
                backgroundColor: lighten(theme.palette.secondary.light, 0.85),
            }
            : {
                color: theme.palette.text.primary,
                backgroundColor: theme.palette.secondary.dark,
            },
    title: {
        flex: '1 1 100%',
    }
}));


// ================= Static Variables ================
// const editChapterBaseLink = "/administration/booklets/";
const viewUserBaseLinkAdministration = "/administration/users/";
const viewUserBaseLinkStaff = "/staff/users/";
const viewUserDashboard = "/Dashboard/";

const viewBookletBaseLink = "/administration/booklets/user/";


// ================= Static Functions ================


// ======================== React Modern | Functional Component ========================

const UserTableToolbar = (props) => { // Notice the arrow function... regular function()  works too

    // Variables ===

    // Style variable declaration
    const classes = useStyles();

    // Declaration of Stateful Variables ===
    const { appState, setParentAlert, selectedDataItemsList, setParentDeleteUserDialog } = props;

    const [viewUrl, setViewUrl] = useState("");
    const [reportUrl, setReportUrl] = useState("");
    const [reportUrl1, setReportUrl1] = useState("");
    const [startProgramUrl, setStartProgramUrl] = useState("");
    const [completeProgramUrl, setCompleteProgramUrl] = useState("");
    const [viewReportsUrl, setViewReportsUrl] = useState("");

    const [tool, setTool] = useState(0);

    // Functions ===

    const toolHandler = useCallback(() => {
        setTool(selectedDataItemsList.length)
    }, [selectedDataItemsList, setTool, setParentAlert]);

    const deleteHandler = useCallback(() => {
        setParentDeleteUserDialog(true);
    }, [setParentDeleteUserDialog]);

    // const exportHandler = useCallback(() => {
    //     setParentExportChapterDialog(true);
    // }, [ setParentExportChapterDialog ]);

    // Hooks ===

    useEffect(() => {
        toolHandler();
    }, [selectedDataItemsList, toolHandler]);

    useEffect(() => {

        if (tool === 1) {
            if (appState.role === "Admin") {
                setViewUrl(viewUserBaseLinkAdministration + "view/" + selectedDataItemsList[0]._id);
                localStorage.setItem('_id', selectedDataItemsList[0]._id);
            }
            else if (appState.role === "Volunteer") {
                // localStorage.setItem('_id', selectedDataItemsList[0]._id);
                localStorage.setItem('_pid', selectedDataItemsList[0]._id);
                setViewUrl(viewUserBaseLinkAdministration + "view/" + selectedDataItemsList[0]._id);
            }
            else if (appState.role === "Coordinator") {
                setViewUrl(viewUserBaseLinkAdministration + "view/" + selectedDataItemsList[0]._id);
                localStorage.setItem('_id', selectedDataItemsList[0]._id);
            }
            setReportUrl('/reports/' + selectedDataItemsList[0]._id);
            setReportUrl1('/ScreenReports/' + selectedDataItemsList[0]._id);
            setStartProgramUrl(viewUserBaseLinkAdministration + 'start-program/' + selectedDataItemsList[0]._id);
            setCompleteProgramUrl(viewUserBaseLinkAdministration + 'complete-program/' + selectedDataItemsList[0]._id);
            setViewReportsUrl('/MainReports/' + selectedDataItemsList[0]._id);
        } else {
            setViewUrl("");
            setReportUrl("");
            setReportUrl1("");
            setStartProgramUrl("");
            setCompleteProgramUrl("");
            setViewReportsUrl("");
        }
    }, [tool, viewUrl]);

    // Render Section ===

    return (
        <Toolbar
            className={clsx(classes.root, { [classes.highlight]: selectedDataItemsList.length > 0 })}
        >
            {selectedDataItemsList.length > 0 ? (
                <Typography className={classes.title} color="inherit" variant="subtitle1" component="div">
                    <>
                        {selectedDataItemsList.length} Selected Item{selectedDataItemsList.length > 1 ? "s. In order to view/edit Patient's survey, please check 1 box" : null}
                        {viewUrl.length === 0 && selectedDataItemsList.length <= 1 ? " There are no survey for selected user" : null}
                    </>
                </Typography>
            ) : (
                <Typography className={classes.title} variant="h6" component="div">
                    {"User Results"}
                </Typography>
            )}

            {(tool === 0) ? (
                <>
                    <Tooltip title="Filter list">
                        <IconButton aria-label="filter list">
                            <FilterListIcon />
                        </IconButton>
                    </Tooltip>
                </>
            ) : (null)}

            {(tool === 1) ? (
                <div style={{display: "flex", flexDirection:"row", gap:"5px", alignItems: "center"}}>
                    <Tooltip title="View Profile">
                        <Button
                            aria-label="view profile"
                            component={Link}
                            to={viewUrl}
                            disabled={viewUrl.length === 0}
                            color="primary"
                            variant="contained"
                            size="small"
                            style={{ width: "150px", fontSize: "12px", height: "32px"}}
                        >
                            View Profile
                        </Button>
                    </Tooltip>

                   
                    <Tooltip title="View Reports">
                        <Button
                            aria-label="view reports"
                            component={Link}
                            to={viewReportsUrl}
                            disabled={viewReportsUrl.length === 0}
                            color="primary"
                            variant="contained"
                            size="small"
                            style={{display: "flex", fontSize: "12px", whiteSpace: "nowrap", width: "150px", height: "32px"}}
                        >
                            View Reports
                        </Button>
                    </Tooltip>

                    <Tooltip title="Start Program">
                        <Button
                            aria-label="start program"
                            component={Link}
                            to={startProgramUrl}
                            disabled={startProgramUrl.length === 0}
                            color="primary"
                            variant="contained"
                            size="small"
                            style={{display: "flex", fontSize: "12px", whiteSpace: "nowrap", width: "150px", height: "32px"}}
                        >
                            Start Program
                        </Button>
                    </Tooltip>


                    <Tooltip title="Complete Program">
                        <Button
                            aria-label="complete program"
                            component={Link}
                            to={completeProgramUrl}
                            disabled={completeProgramUrl.length === 0}
                            color="primary"
                            variant="contained"
                            size="small"
                            style={{display: "flex", fontSize: "12px", whiteSpace: "nowrap", width: "150px", height: "32px"}}
                        >
                            Complete Program
                        </Button>
                    </Tooltip>

                    {/* <Tooltip title="Export" onClick={() => exportHandler()}>
                            <IconButton aria-label="export">
                                <SystemUpdateAltIcon/>
                            </IconButton>
                        </Tooltip> */}

                    {/* <Tooltip title="Community Connections Report">
                        <IconButton aria-label="edit" component={Link} to={reportUrl} >
                            <Ballot />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Social Health Screener Report">
                        <IconButton aria-label="edit" component={Link} to={reportUrl1} >
                            <ImageSearchIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                        <IconButton aria-label="delete" onClick={() => deleteHandler()}>
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip> */}
                </div>
            ) : (null)}
            {(tool > 1) ? (
                <>
                    <Tooltip title="Delete">
                        <IconButton aria-label="delete" onClick={() => deleteHandler()}>
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>
                </>
            ) : (null)}
        </Toolbar>
    );
}

// ======================== Component PropType Check ========================
UserTableToolbar.propTypes =
{
    // You can specify the props types in object style with ___.PropTypes.string.isRequired etc...
    appState: PropTypes.object.isRequired,
    setParentAlert: PropTypes.func.isRequired,
    selectedDataItemsList: PropTypes.array.isRequired,
    setParentDeleteUserDialog: PropTypes.func.isRequired,
    // setParentExportChapterDialog: PropTypes.func.isRequired
}

UserTableToolbar.defaultProps =
{
    appState: {},
    setParentAlert: () => { },
    selectedDataItemsList: {},
    setParentDeleteUserDialog: () => { },
    // setParentExportChapterDialog: () => {}
}

export default UserTableToolbar;  // You can even shorthand this line by adding this at the function [Component] declaration stage