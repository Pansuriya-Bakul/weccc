// ================================================
// Code associated with MarkCompleteChapterDialog
// ================================================
import React, { useCallback } from 'react';
import PropTypes from 'prop-types';                     //Development Package to validate prop types [Type Checking] passed down

// ==================== Modules =====================

// ==================== Components ==================

// ==================== Helpers =====================
import AlertType from '../../../../helpers/models/AlertType';

import patch from '../../../../helpers/common/patch';

// ==================== MUI =========================
import { makeStyles } from '@material-ui/core/styles';  // withStyles can be used for classes and functional componenents but makeStyle is designed for new React with hooks

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import Button from '@material-ui/core/Button';

import CircularProgress from '@material-ui/core/CircularProgress';

// ==================== MUI Icons ====================
import DoneIcon from '@material-ui/icons/Done';

// ==================== MUI Styles ===================

const useStyles = makeStyles((theme) =>    //Notice the hook useStyles
({
    root: {
        flexGrow: 1,     // CSS determined this way, flexbox properties
        height: '100%'
    },
    rootGrid: {
        height: '100%'
    }
}));


// ================= Static Variables ================

// ================= Static Functions ================


// ======================== React Modern | Functional Component ========================

const MarkCompleteChapterDialog = (props) => { // Notice the arrow function... regular function()  works too

    // Variables ===

    // Style variable declaration
    const classes = useStyles();

    // Declaration of Stateful Variables ===
    const { appState, setParentAlert, isTemplate, chapter, chapterID,
        markCompleteChapterDialog, setMarkCompleteChapterDialog,
        markCompleteChapterDialogExecuting, setMarkCompleteChapterDialogExecuting, setEditable } = props;

    // Functions ===

    // Mark the Module as complete and updates it in the database
    const markCompleteChapter = useCallback(() => {

        if (chapter) {
            let updateBody;

            if (isTemplate) {
                updateBody =
                {
                    name: chapter.name,
                    surveyJSON: chapter.surveyJSON
                }
            }
            else {
                updateBody =
                {
                    completeness: 100,
                    responseJSON: chapter.responseJSON,
                    // memberCollection: chapter.memberCollection
                }
            }

            patch((isTemplate ? "surveys/" : "membersurveys/") + chapterID, appState.token, updateBody, (error, response) => {
                if (error) {
                    setMarkCompleteChapterDialog(false);
                    setParentAlert(new AlertType('Unable to mark the Module as complete. Please try again.', "error"));
                }
                else {
                    if (response.status === 200) {
                        
                    }
                    else {
                        setMarkCompleteChapterDialog(false);
                        setParentAlert(new AlertType('Unable to mark the Module as complete. Please try again.', "error"));
                    }
                }
            });
        }
        else {
            setMarkCompleteChapterDialog(false);
            setParentAlert(new AlertType('Unable to mark the Module as complete. Please try again.', "error"));
        }

    }, [setMarkCompleteChapterDialog, setParentAlert, chapter, chapterID, appState, isTemplate]);


    const closeHandler = useCallback(() => {
        setMarkCompleteChapterDialog(false);
    }, [setMarkCompleteChapterDialog]);


    const markCompleteHandler = useCallback(() => {
        try {
            setMarkCompleteChapterDialogExecuting(true);
            markCompleteChapter();
            setMarkCompleteChapterDialogExecuting(false);
            setMarkCompleteChapterDialog(false);
            setEditable(false);
            setParentAlert(new AlertType('Successfully the chapter is marked complete.', "success"));
        }
        catch {

        }
    }, [setMarkCompleteChapterDialogExecuting, markCompleteChapter, setMarkCompleteChapterDialog, setParentAlert, setEditable]);


    // Hooks ===


    // Render Section ===

    return (
        <>
            {chapter ? (
                <Dialog id="markComplete-chapter-dialog"
                    fullWidth
                    maxWidth="md"
                    open={markCompleteChapterDialog}
                    onClose={() => { closeHandler(); }}
                >
                    <DialogTitle>
                        Mark Complete {chapter.name ? `"${chapter.name}"` : null}
                    </DialogTitle>
                    <DialogContent>
                        {markCompleteChapterDialogExecuting ? (
                            <CircularProgress />
                        ) : (
                            <DialogContentText>
                                Are you sure you would like to mark the chapter complete?
                            </DialogContentText>
                        )}

                    </DialogContent>
                    <DialogActions>
                        <Button color="primary" variant="contained" onClick={() => { closeHandler(); }} disabled={markCompleteChapterDialogExecuting}>
                            Cancel
                        </Button>
                        <Button color="primary" variant="contained" startIcon={<DoneIcon />} onClick={() => { markCompleteHandler(); }} disabled={markCompleteChapterDialogExecuting}>
                            Mark Complete
                        </Button>
                    </DialogActions>
                </Dialog>
            ) : (
                null
            )}
        </>

    );
}

// ======================== Component PropType Check ========================
MarkCompleteChapterDialog.propTypes =
{
    // You can specify the props types in object style with ___.PropTypes.string.isRequired etc...
    appState: PropTypes.object.isRequired,
    setParentAlert: PropTypes.func.isRequired,
    isTemplate: PropTypes.bool.isRequired,
    chapter: PropTypes.object,
    chapterID: PropTypes.string.isRequired,
    markCompleteChapterDialog: PropTypes.bool.isRequired,
    setMarkCompleteChapterDialog: PropTypes.func.isRequired,
    markCompleteChapterDialogExecuting: PropTypes.bool.isRequired,
    setMarkCompleteChapterDialogExecuting: PropTypes.func.isRequired,
    setEditable: PropTypes.func.isRequired

}

MarkCompleteChapterDialog.defaultProps =
{
    appState: {},
    setParentAlert: () => { },
    isTemplate: {},
    chapter: {},
    chapterID: {},
    markCompleteChapterDialog: {},
    setMarkCompleteChapterDialog: () => { },
    markCompleteChapterDialogExecuting: {},
    setMarkCompleteChapterDialogExecuting: () => { },
    setEditable: {}
}

export default MarkCompleteChapterDialog;  // You can even shorthand this line by adding this at the function [Component] declaration stage