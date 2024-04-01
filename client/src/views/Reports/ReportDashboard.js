import React, { Component } from "react";
import HighlightBox from "./Summary/HighlightBox";
import { iso } from "joi/lib/types/date";
// import CircleGraphic from "./Summary/CircleGraphic";



export default class ReportDashboard extends Component {
    findDashboardValues = (reports, collection) => {
        let health = (reports.HT_QofL2_SD[collection] + (reports.PH_QofL2_SD[collection] * 25) + (reports.YH_QofL3_SD[collection] * 10)) / 3;

        // health = health > 100 ? 0 : health;

        let mentalHealth = ((reports.MH_QofL2_SD[collection] * 25) + (reports.AD_QofL2_SD[collection] * 25)) / 2;

        // mentalHealth = mentalHealth > 100 ? 0 : mentalHealth;

        let wellBeing = reports.PWI_QofL3_COMB[collection];

        // wellBeing = wellBeing > 100 ? 0 : wellBeing;

        let lifeSatisfaction = reports.LS_QofL3_SD[collection] * 10;

        // lifeSatisfaction = lifeSatisfaction > 100 ? 0 : lifeSatisfaction;

        let loneliness = reports.PL_QofL1_COMB[collection]; // average score

        if (loneliness !== 999) {

            if (reports.PL_QofL1_COMB_often_count[collection] >= 1) { // if atleast one often --> red
                loneliness = 20;
            }
            else if (loneliness >= 1.6 && reports.PL_QofL1_COMB_sometimes_count[collection] >= 1) { // score >= 1.66 and sometimes_count >= 1 --> Yellow
                loneliness = 60;
            }
            else { // score <= 1.33 --> Green
                loneliness = 100;
            }
        }

        //function
        let functionHealth = ((reports.MH_QofL2_SD[collection] * 25) + (reports.PC_QofL2_SD[collection] * 25) + (reports.UA_QofL2_SD[collection] * 25)) / 3;

        // functionHealth = functionHealth > 100 ? 0 : functionHealth

        //community belonging
        let communityHealth = reports.FPC_QofL3_SD[collection] * 10
        // communityHealth = communityHealth > 100 ? 0 : communityHealth;

        //isolation
        let isolationHealth = 0;

        if (reports.household_size[collection] === 999 || reports.frequency_of_contact_family[collection] === '999' || reports.frequency_of_contact_friends[collection] === '999' || reports.FCP_INT_COMB[collection] === '999') {
            isolationHealth = 999;
        } else {

            if (reports.household_size[collection] === 0) {
                isolationHealth += 1;
            }
            if (reports.frequency_of_contact_family[collection] === '3-4 Times a year' || reports.frequency_of_contact_family[collection] === 'Yearly' || reports.frequency_of_contact_family[collection] === 'Never') {
                if (reports.total_children[collection] === 0) {
                    isolationHealth += 1;
                } else {
                    isolationHealth += 2;
                }
            }

            if (reports.frequency_of_contact_friends[collection] === '3-4 Times a year' || reports.frequency_of_contact_friends[collection] === 'Yearly' || reports.frequency_of_contact_friends[collection] === 'Never') {

                isolationHealth += 1;
            }

            if (reports.FCP_INT_COMB[collection] && Array.isArray(reports.FCP_INT_COMB[collection])) {
                let freq_participation_trigger = reports.FCP_INT_COMB[collection].every(item => item === null || item === 0 || item === 1 || item === 2);

                if (freq_participation_trigger) {
                    isolationHealth += 1;
                }
            }
        }

        //convert isolation (0-5) to percent according to calculation doc:
        if (isolationHealth !== 999) {
            if (isolationHealth >= 4) {
                isolationHealth = 0;
            }
            else if (isolationHealth === 3) {
                isolationHealth = 20;
            }
            else if (isolationHealth === 2) {
                isolationHealth = 40;
            }
            else if (isolationHealth <= 1) {
                isolationHealth = 95;
            }
        }

        return [health, mentalHealth, wellBeing, lifeSatisfaction, loneliness, functionHealth, communityHealth, isolationHealth];
    }

    render() {

        return (
            <>
                <div className="dashboard-flex">
                    <div className="dashboard-item">
                        <HighlightBox data={this.findDashboardValues(this.props.reports, this.props.collection)}></HighlightBox>

                    </div>

                </div>
            </>
        )
    }
}



