import React, { Component } from "react";
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import DashboardPie from "./Summary/DashbordPie";
import DashboardCombo from "./Summary/DashboardCombo";
import DashboardBarGraph from "./Summary/DashboardBarGraph";
import HighlightBox from "./Summary/HighlightBox";
import CircleGraphic from "./Summary/CircleGraphic";



export default class ReportDashboard extends Component {
    findDashboardValues = (reports, collection) => {
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

        return [health, mentalHealth, wellBeing, lifeSatisfaction, loneliness];
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
                        {/* <HighlightBox data={this.findDashboardValues(this.props.reports, this.props.collection)}></HighlightBox> */}
                        <CircleGraphic />
                    </div>
                    {/* <div className="dashboard-item">
                        <DashboardCombo data={this.findDashboardValues(this.props.reports, this.props.collection)}></DashboardCombo>
                    </div> */}
                </div>
            </>
        )
    }
}



