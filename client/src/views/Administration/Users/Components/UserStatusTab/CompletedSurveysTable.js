import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Paper, Button, makeStyles } from '@material-ui/core';
import axios from 'axios';
const useStyles = makeStyles((theme) => ({
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

export default function CompletedSurveysTable({ data, role }) {
    const classes = useStyles();
    const reversedData = data.length > 0 ? [...data].reverse() : [];

    const formatDate = (dateString) => {
        return dateString.substring(0, 10); // Extract the yyyy-mm-dd part
    };

    const nameToLink = { 
        "Community Connections": "/history/ccReport/",
        "Social Health Screener - NEW": "/history/screenerReport/",
        "Quality of Life - Short": "/history/qoflReport/",
        "Quality Life Series": "/QLReport/",
    };


    return (
        <div className={classes.root}>
            <Box mx={1} my={1}>
                <TableContainer component={Paper} elevation={0} style={{ border: "1px solid #e0e0e0" }}>
                    <Table>
                        <TableHead>
                            <TableRow className={classes.tableRow} style={{ cursor: 'default', backgroundColor: '#f0f0f0' }}>
                                <TableCell>Series</TableCell>
                                <TableCell>Date Generated</TableCell>
                                <TableCell>Download</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {reversedData.length > 0 ? (
                                reversedData.map((row, index) => (
                                    <TableRow key={index}>
                                        <TableCell>
                                            <Typography component={Link} to={nameToLink[row.collectionTemplate.name] + row._id}>
                                                {row.collectionTemplate.name.charAt(0).toUpperCase() + row.collectionTemplate.name.slice(1)} {role !== 'Patient' ? '- Self Care' : ''}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography>{formatDate(row.updatedAt)}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                //onClick={() => handleDownloadPDF(row._id)} // Implement this handler
                                                style={{ width: "130px", height: "30px" }}
                                            >
                                                Download
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={3} align="center">
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

CompletedSurveysTable.propTypes = {
    data: PropTypes.arrayOf(
        PropTypes.shape({
            _id: PropTypes.string.isRequired,
            collectionTemplate: PropTypes.shape({
                name: PropTypes.string.isRequired,
            }).isRequired,
            updatedAt: PropTypes.string.isRequired,
        })
    ),
    role: PropTypes.string.isRequired,
};

CompletedSurveysTable.defaultProps = {
    data: [],
};
