// ================================================
// Code associated with Templates Table Component.
// Displays all existing Templates created and allows
// user to delete, edit and preview the Templates
// survey questions.
// ================================================
import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';

// ===================== Extra Modules ======================



// ==================== Helpers ====================

// ==================== Components ==================
import AlertType from '../../../../../helpers/models/AlertType';

// ==================== MUI ====================
import Box from '@material-ui/core/Box';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TablePagination from '@material-ui/core/TablePagination';
import { TableHead } from '@material-ui/core';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';

import { makeStyles } from '@material-ui/core/styles';
// ==================== Icons ====================

// ==================== Static Helper Functions ====================

const useStyles = makeStyles((theme) =>    //Notice the hook useStyles
({
    root: {
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(1),
        marginTop: theme.spacing(2),
    },
    tableRow: {
        cursor: "pointer",
        padding: "0px",
    },
}));

// ==================== Static Variables ====================

//=================================================== TemplateTable Component ===================================================
export default function StatusHistoryTable(props) {

    const { data } = props;
    const reversedData = data.length > 0 ? [...data].reverse() : [];

    const classes = useStyles();

    const getStatusColor = (status) => {
        if (status === 'active') {
          return 'green'; // Apply green color
        } else if (status === 'waitlist') {
          return 'orange'; // Apply orange color
        } else {
          return 'red'; // Apply red color
        }
    };

    const formatDate = (dateString) => {
        return dateString.substring(0, 10); // Extract the yyyy-mm-dd part
      };

    // Render Section ===
    return (

        <div className={classes.root}>
            <Box mx={1} my={1}>
            <TableContainer component={Paper} elevation={0} style={{border: "1px solid #e0e0e0",}}>
                <Table>
                    <TableHead>
                        <TableRow className={classes.tableRow}>
                            <TableCell>Status</TableCell>
                            <TableCell>Active Type</TableCell>
                            <TableCell>Start Date</TableCell>
                            <TableCell>End Date</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {reversedData.length > 0 ? (
                            reversedData.map((row, index) => (
                                <TableRow key={index}>
                                    <TableCell>
                                    <Typography style={{ color: getStatusColor(row.status) }}>{row.status.charAt(0).toUpperCase() + row.status.slice(1)}</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography>{row.activeType}</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography>{formatDate(row.startDate)}</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography>{formatDate(row.endDate)}</Typography>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={4} align="center">
                                    <Typography>No data available</Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            </Box>

        </div>
    );

}

StatusHistoryTable.propTypes = {
    data: PropTypes.arrayOf(
        PropTypes.shape({
            status: PropTypes.string.isRequired,
            activeType: PropTypes.string,
            startDate: PropTypes.string.isRequired,
            endDate: PropTypes.string,
        })
    ),
};

StatusHistoryTable.defaultProps = {
    data: [],
};