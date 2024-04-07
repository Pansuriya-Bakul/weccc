import React, { Component } from "react";
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import DashboardPie from "./Summary/DashbordPie";
import DashboardCombo from "./Summary/DashboardCombo";
import DashboardBarGraph from "./Summary/DashboardBarGraph";
import HighlightBox from "./Summary/HighlightBox";
// import CircleGraphic from "./Summary/CircleGraphic";



export default class ReportDashboard extends Component {
    findDashboardValues = (reports, collection) => {
        console.log(reports);
        var health = (reports.HT_QofL2_SD[collection] + (reports.PH_QofL2_SD[collection] * 25) + (reports.YH_QofL3_SD[collection] * 10)) / 3;

        health = health > 100 ? 0 : health;

        var mentalHealth = ((reports.MH_QofL2_SD[collection] * 25) + (reports.AD_QofL2_SD[collection] * 25)) / 2;

        mentalHealth = mentalHealth > 100 ? 0 : mentalHealth;

        var wellBeing = reports.PWI_QofL3_COMB[collection];

        wellBeing = wellBeing > 100 ? 0 : wellBeing;

        var lifeSatisfaction = reports.LS_QofL3_SD[collection] * 10;

        lifeSatisfaction = lifeSatisfaction > 100 ? 0 : lifeSatisfaction;

        var loneliness = reports.PL_QofL1_COMB[collection]; // average score

        if (reports.PL_QofL1_COMB_often_count[collection] >= 1) { // if atleast one often --> red
            loneliness = 20;
        }
        else if (loneliness >= 1.6 && reports.PL_QofL1_COMB_sometimes_count[collection] >= 1) { // score >= 1.66 and sometimes_count >= 1 --> Yellow
            loneliness = 60;
        }
        else { // score <= 1.33 --> Green
            loneliness = 100;
        }

        //function
        var functionHealth = ((reports.MH_QofL2_SD[collection] * 25) + (reports.PC_QofL2_SD[collection] * 25) + (reports.UA_QofL2_SD[collection] * 25)) / 3;

        functionHealth = functionHealth > 100 ? 0 : functionHealth

        //community belonging
        var communityHealth = reports.FPC_QofL3_SD[collection] * 10
        communityHealth = communityHealth > 100 ? 0 : communityHealth;

        //isolation
        var isolationHealth = 0;

        if (reports.household_size[collection] == 0) {
            isolationHealth += 1;
        }
        if (reports.frequency_of_contact_family[collection] == '3-4 Times a year' || reports.frequency_of_contact_family[collection] == 'Yearly' || reports.frequency_of_contact_family[collection] == 'Never') {
            if (reports.total_children[collection] == 0) {
                isolationHealth += 1;
            } else {
                isolationHealth += 2;
            }
        }

        if (reports.frequency_of_contact_friends[collection] == '3-4 Times a year' || reports.frequency_of_contact_friends[collection] == 'Yearly' || reports.frequency_of_contact_friends[collection] == 'Never') {

            isolationHealth += 1;
        }

        if (reports.FCP_INT_COMB[collection] && Array.isArray(reports.FCP_INT_COMB[collection])) {
            let freq_participation_trigger = reports.FCP_INT_COMB[collection].every(item => item === null || item === 0 || item === 1 || item === 2);

            if (freq_participation_trigger) {
                isolationHealth += 1;
            }
        }


        //convert isolation (0-5) to percent according to calculation doc:
        if (isolationHealth >= 4) {
            isolationHealth = 0;
        }
        else if (isolationHealth == 3) {
            isolationHealth = 20;
        }
        else if (isolationHealth == 2) {
            isolationHealth = 40;
        }
        else if (isolationHealth <= 1) {
            isolationHealth = 95;
        }

        return [health, mentalHealth, wellBeing, lifeSatisfaction, loneliness, functionHealth, communityHealth, isolationHealth];
    }

    render() {

        return (
            <>
                {/* <Typography variant="h4" color="inherit" align="left" gutterBottom>
                    Dashboard
                </Typography> */}
                <div className="dashboard-flex">
                    <div className="dashboard-item">
                        {/* <DashboardPie data={this.findDashboardValues(this.props.reports, this.props.collection)}></DashboardPie> */}
                        {/* <DashboardBarGraph data={this.findDashboardValues(this.props.reports, this.props.collection)}></DashboardBarGraph> */}
                        <HighlightBox data={this.findDashboardValues(this.props.reports, this.props.collection)}></HighlightBox>
                        {/* <CircleGraphic /> */}
                    </div>
                    {/* <div className="dashboard-item">
                        <DashboardCombo data={this.findDashboardValues(this.props.reports, this.props.collection)}></DashboardCombo>
                    </div> */}
                </div>
            </>
        )
    }
}



