export default function checkAlerts(reports, collection) {
        if(reports.HT_QofL2_SD[collection] <= 50 ||
			reports.PH_QofL2_SD[collection] === 0 ||
			reports.MH_QofL2_SD[collection] === 0 ||
			reports.M_QofL2_SD[collection] === 3 ||
			reports.M_QofL2_SD[collection] === 4 ||
			reports.PC_QofL2_SD[collection] === 3 ||
			reports.PC_QofL2_SD[collection] === 4 ||
			reports.UA_QofL2_SD[collection] === 3 ||
			reports.UA_QofL2_SD[collection] === 4 ||
			reports.PD_QofL2_SD[collection] === 3 ||
			reports.PD_QofL2_SD[collection] === 4 ||
			reports.AD_QofL2_SD[collection] === 3 ||
			reports.AD_QofL2_SD[collection] === 4 ||

            (50 < reports.HT_QofL2_SD[collection] && reports.HT_QofL2_SD[collection] <= 65) ||
			reports.PH_QofL2_SD[collection] === 1 || reports.MH_QofL2_SD[collection] === 1 || reports.M_QofL2_SD[collection] === 2 || reports.PC_QofL2_SD[collection] === 2 || reports.UA_QofL2_SD[collection] === 2 || reports.PD_QofL2_SD[0] === 2 || reports.AD_QofL2_SD[collection] === 2 ||
			(999 > reports.HU_ED_QofL2_SD[collection] && reports.HU_ED_QofL2_SD[collection] > 0) ||
			(999 > reports.HU_HNum_QofL2_SD[collection] && reports.HU_HNum_QofL2_SD[collection] > 0) ||
			(999 > reports.HU_EMS_QofL2_SD[collection] && reports.HU_EMS_QofL2_SD[collection] > 0) ||
			(999 > reports.HU_UC_QofL2_SD[collection] && reports.HU_UC_QofL2_SD[collection] > 0) ||
			reports.access_to_family_doctor[collection] == "No" ||
			(
				reports.support_wellness_program[collection] &&
				(reports.problem_walking[collection] > 1 && reports.problem_walking[collection] < 999) &&
				(reports.problem_washing_dressing[collection] > 1 && reports.problem_walking[collection] < 999) &&
				(reports.problem_usual_activities[collection] > 1 && reports.problem_walking[collection] < 999) &&
				(reports.problem_walking[collection] > 1 && reports.problem_walking[collection] < 999) &&
				(reports.problem_pain_discomfort[collection] > 1 && reports.problem_walking[collection] < 999) &&
				(reports.problem_anxious_depressed[collection] > 1 && reports.problem_walking[collection] < 999)
			) ||
			(
				reports.support_informal[collection] &&
				(reports.problem_walking[collection] > 1 && reports.problem_walking[collection] < 999) &&
				(reports.problem_washing_dressing[collection] > 1 && reports.problem_walking[collection] < 999) &&
				(reports.problem_usual_activities[collection] > 1 && reports.problem_walking[collection] < 999) &&
				(reports.problem_walking[collection] > 1 && reports.problem_walking[collection] < 999) &&
				(reports.problem_pain_discomfort[collection] > 1 && reports.problem_walking[collection] < 999) &&
				(reports.problem_anxious_depressed[collection] > 1 && reports.problem_walking[collection] < 999)
			) ||

            reports.PWI_QofL3_COMB[collection] <= 60 ||
		  reports.SL_QofL3_SD[collection] <= 5 ||
		  reports.YH_QofL3_SD[collection] <= 5 ||
		  reports.AL_QofL3_SD[collection] <= 5 ||
		  reports.PR_QofL3_SD[collection] <= 5 ||
		  reports.HSF_QofL3_SD[collection] <= 5 ||
		  reports.FPC_QofL3_SD[collection] <= 5 ||
		  reports.FS_QofL3_SD[collection] <= 5 ||
		  reports.SR_QofL3_SD[collection] <= 5 ||
		  reports.PAG_QofL1_SD[collection] === 3 ||

          reports.SL_QofL3_SD[collection] === 6 ||
		  reports.YH_QofL3_SD[collection] === 6 ||
		  reports.AL_QofL3_SD[collection] === 6 ||
		  reports.PR_QofL3_SD[collection] === 6 ||
		  reports.HSF_QofL3_SD[collection] === 6 ||
		  reports.FPC_QofL3_SD[collection] === 6 ||
		  reports.FS_QofL3_SD[collection] === 6 ||
		  reports.SR_QofL3_SD[collection] === 6 ||
		  reports.PAG_QofL1_SD[collection] === 2 ||

          (reports.PSS_QofL1_COMB[collection] >= 2.5 && reports.PSS_QofL1_COMB[collection] <= 3) ||

          (reports.PSS_QofL1_COMB[collection] >= 1.6 && reports.PSS_QofL1_COMB[collection] <= 2.4) ||
        
          (reports.PL_QofL1_COMB_often_count[collection] > 0 && reports.PL_QofL1_COMB_often_count[collection] !== 999) ||
          (reports.PL_QofL1_COMB_sometimes_count[collection] > 0 &&
			reports.PL_QofL1_COMB_sometimes_count[collection] !== 999 &&
			reports.PL_QofL1_COMB[collection] >= 1.6 &&
			reports.PL_QofL1_COMB[collection] !== 999)
            ){
                return true;
        } else {
            return false;
        }

}