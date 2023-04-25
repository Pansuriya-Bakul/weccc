
import React from "react";

//import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { BrowserRouter as Router, Route, Link, Switch }
    from "react-router-dom";

// Importing newly created components
import SecondComponent from "./ClientReports1";
import FirstComponent from "./ClientReports";
import FamilyFriendsNeighbours from "./Summary/FamilyFriendsNeighbours";
import NeighboursImg from "./Neighbours.jpg"
import SocialHealth from "./Social_Health.jpeg"
import Typography from "@material-ui/core/Typography"; //h1, p replacement Tag


import { makeStyles } from "@material-ui/core/styles"; // withStyles can be used for classes and functional componenents but makeStyle is designed for new React with hooks

import Grid from "@material-ui/core/Grid"; // Normal Markup with MUI is layout -> Container -> Grid -> Paper etc...
import Box from "@material-ui/core/Box"; // Padding and margins
import Card from "@material-ui/core/Card"; //Like the paper module, a visual sheet to place things
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";


// ==================== Modules =====================
import Pagination from "@material-ui/lab/Pagination";

import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import { colors } from "@material-ui/core";

// import { View, Image, StyleSheet, Text } from "react-native";

function MainReports() {
    // const screenerLink = '/ClientReports1';
    // const neighboursLink = '/ClientReports';

    return (
        // BrowserRouter to wrap all
        // the other components

        //     <Router>

        //         {/*switch used to render only the first
        // route that matches the location rather
        // than rendering all matching routes. */}
        //         <Switch>
        //             <Route exact path="/" component={MainReports} />
        //             <Route exact path="/ClientReports1" component={SecondComponent} />
        //             <Route exact path="/ClientReports" component={FirstComponent} />

        //         </Switch>
        //     </Router>
        <>
            <ul>
                <div>



                    {/* <li> */}

                    {/* Link component uses the to prop
                to describe the location where the
                links should navigate to. */}
                    {/* <Link to={"/ClientReports1"} >
                                Social Health
                            </Link> */}
                    {/* </li> */}


                    <br>
                    </br>
                    <br>
                    </br>
                    <br>
                    </br>
                    <br>
                    </br>
                    <br>
                    </br>


                    <table cellSpacing="2" bgcolor="#000000" align="center">
                        <tr bgcolor="#ffffff">
                            <th><Link to={"/ClientReports1"}>
                                <Typography style={{ padding: '5px' }}>
                                    Social Health Screener Report
                                </Typography>
                                <img height="200" width="200" src={SocialHealth} />
                            </Link></th>
                            <th><Link to={"/ClientReports"}>
                                <Typography style={{ padding: '5px' }}>
                                    Community Connections Report
                                </Typography>
                                <img height="200" width="200" src={NeighboursImg} />
                            </Link></th>
                        </tr>
                    </table>

                </div>
            </ul>
        </>
    );
}
export default MainReports;
