import React, { Component } from "react";
import HighlightBox from "./Summary/HighlightBox";

// Utility method to safely get nested properties
const safeGet = (obj, path, defaultValue = null) => {
  return path.reduce((acc, part) => (acc && acc[part] !== undefined) ? acc[part] : defaultValue, obj);
};

export default class ReportDashboard extends Component {

    // Calculates the health score even if some values missing
    calculateHealth = (reports, collection) => {
        let HT = safeGet(reports, ['HT_QofL2_SD', collection]) !== 999 ? safeGet(reports, ['HT_QofL2_SD', collection]) : null;
        let PH = safeGet(reports, ['PH_QofL2_SD', collection]) !== 999 ? safeGet(reports, ['PH_QofL2_SD', collection]) * 25 : null;
        let YH = safeGet(reports, ['YH_QofL3_SD', collection]) !== 999 ? safeGet(reports, ['YH_QofL3_SD', collection]) * 10 : null;

        let sum = 0;
        let count = 0;

        if (HT !== null) {
            sum += HT;
            count++;
        }

        if (PH !== null) {
            sum += PH;
            count++;
        }

        if (YH !== null) {
            sum += YH;
            count++;
        }

        let health = count > 0 ? Math.round(sum / count) : 999;
        return health;
    };

    // Calculates the mental health score even if some values missing
    calculateMentalHealth = (reports, collection) => {
        let MH = safeGet(reports, ['MH_QofL2_SD', collection]) !== 999 ? safeGet(reports, ['MH_QofL2_SD', collection]) * 25 : null;
        let AD = safeGet(reports, ['AD_QofL2_SD', collection]) !== 999 ? safeGet(reports, ['AD_QofL2_SD', collection]) * 25 : null;

        let sum = 0;
        let count = 0;

        if (MH !== null) {
            sum += MH;
            count++;
        }

        if (AD !== null) {
            sum += AD;
            count++;
        }

        let mentalHealth = count > 0 ? Math.round(sum / count) : 999;
        return mentalHealth;
    };

    findDashboardValues = (reports, collection) => {

        let health = this.calculateHealth(reports, collection);

        let mentalHealth = this.calculateMentalHealth(reports, collection);

        let wellBeing = safeGet(reports, ['PWI_QofL3_COMB', collection]);

        let lifeSatisfaction = safeGet(reports, ['LS_QofL3_SD', collection]) * 10;

        let loneliness = 0;

        if (Array.isArray(reports.PL_QofL1_COMB_often_count)) {
            if (loneliness !== 999) {
                if (safeGet(reports, ['PL_QofL1_COMB_often_count', collection]) >= 1) {
                    loneliness = 20; // red
                } else if (
                    loneliness >= 1.6 &&
                    Array.isArray(reports.PL_QofL1_COMB_sometimes_count) &&
                    safeGet(reports, ['PL_QofL1_COMB_sometimes_count', collection]) >= 1
                ) {
                    loneliness = 60; // yellow
                } else {
                    loneliness = 100; // green
                }
            }
        }

        // function
        let functionHealth = ((safeGet(reports, ['MH_QofL2_SD', collection]) * 25) + (safeGet(reports, ['PC_QofL2_SD', collection]) * 25) + (safeGet(reports, ['UA_QofL2_SD', collection]) * 25)) / 3;

        // community belonging
        let communityHealth = safeGet(reports, ['FPC_QofL3_SD', collection]) * 10

        // isolation
        let isolationHealth = 0;

        if (
            !safeGet(reports, ['household_size']) ||
            !safeGet(reports, ['frequency_of_contact_family']) ||
            !safeGet(reports, ['frequency_of_contact_friends', collection])
        ) {
            isolationHealth = null; // will suppress isolation box if null

        } else if (safeGet(reports, ['household_size', collection]) === 999 || safeGet(reports, ['frequency_of_contact_family', collection]) === 999 || safeGet(reports, ['frequency_of_contact_friends', collection]) === 999 || safeGet(reports, ['FCP_INT_COMB', collection]) === 999) {
            isolationHealth = 999;

        } else {

            if (safeGet(reports, ['household_size', collection]) === 0) {

                isolationHealth += 1;
            }
            if (safeGet(reports, ['frequency_of_contact_family', collection]) === '3-4 Times a year' || safeGet(reports, ['frequency_of_contact_family', collection]) === 'Yearly' || safeGet(reports, ['frequency_of_contact_family', collection]) === 'Never') {
                if (safeGet(reports, ['total_children', collection]) === 0) {
                    isolationHealth += 1;
                } else {
                    isolationHealth += 2;
                }
            }

            if (safeGet(reports, ['frequency_of_contact_friends', collection]) === '3-4 Times a year' || safeGet(reports, ['frequency_of_contact_friends', collection]) === 'Yearly' || safeGet(reports, ['frequency_of_contact_friends', collection]) === 'Never') {

                isolationHealth += 1;
            }

            if (Array.isArray(safeGet(reports, ['FCP_INT_COMB', collection]))) {
                let freq_participation_trigger = safeGet(reports, ['FCP_INT_COMB', collection]).every(item => item === 0 || item === 1);

                if (freq_participation_trigger) {
                    isolationHealth += 1;
                }
            }
        }

        // convert isolation (0-5) to percent according to calculation doc:
        if (isolationHealth !== 999 && isolationHealth !== null) {
            // Convert to reverse percentage
            isolationHealth = 100 - ((isolationHealth / 5) * 100);
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
