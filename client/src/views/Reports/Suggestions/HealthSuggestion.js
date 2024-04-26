import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';  //h1, p replacement Tag


export default class HealthSuggestion extends Component {

    render() {
        return (
            <div>
                {/* health today is a concern HT_QofL2_SD <= 65 ||
            mental health rating is poor or fair MH_QofL2_SD <= 1 ||
            multiple er visits HU_ED_QofL2_SD > 1 ||
            multiple hospitalizations HU_HNum_QofL2_SD > 1*/}
                {(
                    (this.props.reports.HT_QofL2_SD && this.props.reports.HT_QofL2_SD[this.props.collection] !== undefined && this.props.reports.HT_QofL2_SD[this.props.collection] <= 65 && this.props.reports.HT_QofL2_SD[this.props.collection] !== 999) ||
                    (this.props.reports.MH_QofL2_SD && this.props.reports.MH_QofL2_SD[this.props.collection] !== undefined && this.props.reports.MH_QofL2_SD[this.props.collection] <= 1 && this.props.reports.MH_QofL2_SD[this.props.collection] !== 999) ||
                    (this.props.reports.HU_ED_QofL2_SD && this.props.reports.HU_ED_QofL2_SD[this.props.collection] !== undefined && this.props.reports.HU_ED_QofL2_SD[this.props.collection] > 1 && this.props.reports.HU_ED_QofL2_SD[this.props.collection] !== 999) ||
                    (this.props.reports.HU_HNum_QofL2_SD && this.props.reports.HU_HNum_QofL2_SD[this.props.collection] !== undefined && this.props.reports.HU_HNum_QofL2_SD[this.props.collection] > 1 && this.props.reports.HU_HNum_QofL2_SD[this.props.collection] !== 999)
                ) &&
                    <>
                        <Typography variant="body1" color="inherit" align="left" gutterBottom>
                            <em><b>Your health.</b></em>
                        </Typography>
                        {/* # er visits */}
                        {this.props.reports.HU_ED_QofL2_SD && this.props.reports.HU_ED_QofL2_SD[this.props.collection] !== undefined && this.props.reports.HU_ED_QofL2_SD[this.props.collection] > 1 && this.props.reports.HU_ED_QofL2_SD[this.props.collection] !== 999 &&
                            <Typography variant="body1" color="inherit" align="left" gutterBottom>
                                You had  {this.props.reports.HU_ED_QofL2_SD[this.props.collection]} ER visits in the past year.
                            </Typography>
                        }
                        {/* # hospital visits */}
                        {this.props.reports.HU_HNum_QofL2_SD && this.props.reports.HU_HNum_QofL2_SD[this.props.collection] !== undefined && this.props.reports.HU_HNum_QofL2_SD[this.props.collection] > 1 && this.props.reports.HU_HNum_QofL2_SD[this.props.collection] !== 999 &&
                            <Typography variant="body1" color="inherit" align="left" gutterBottom>
                                You had {this.props.reports.HU_HNum_QofL2_SD[this.props.collection]} hospitalizations in the past year.
                            </Typography>
                        }

                        <Typography variant="body1" color="inherit" align="left" gutterBottom>
                            If you feel concerned about your health generally, you may benefit from developing a plan and building a network of care that is responsive to all aspects of your physical, mental, social and spiritual health.
                            Would you like us to help you develop a personalized plan that aims to improve your health?
                        </Typography>
                    </>
                }
                <br />
                {/* moderate or higher problems with pain <=2 */}
                {this.props.reports.problem_pain_discomfort && this.props.reports.problem_pain_discomfort[this.props.collection] !== undefined && this.props.reports.problem_pain_discomfort[this.props.collection] <= 2 && this.props.reports.HU_HNum_QofL2_SD[this.props.collection] !== 999 &&
                    <>
                        <Typography display="block" variant="body1" color="inherit" align="left" gutterBottom>
                            <em><b>Problems  with pain.</b></em>
                        </Typography>
                        <Typography display="block" variant="body1" color="inherit" align="left" gutterBottom>
                            Regularly monitor pain and discomfort symptoms, and the circumstances in which they are better and worse.
                            Share information about your symptoms with your trusted providers and your family and ask about pain management and comfort measures to help with deal with pain and symptoms. Make sure you keep track of what seems to help.
                        </Typography>
                    </>
                }
                <br />
                {/* moderate or higher problems with anxiety or depression <= 2 */}
                {this.props.reports.problem_anxious_depressed && this.props.reports.problem_anxious_depressed[this.props.collection] !== undefined && this.props.reports.problem_anxious_depressed[this.props.collection] <= 2 && this.props.reports.problem_anxious_depressed[this.props.collection] !== 999 &&
                    <>
                        <Typography display="block" variant="body1" color="inherit" align="left" gutterBottom>
                            <em><b>Problems with anxiety or depression.</b></em>
                        </Typography>
                        <Typography display="block" variant="body1" color="inherit" align="left" gutterBottom>
                            Regularly monitor your physical and psychological symptoms, and circumstances in which they are better and worse.
                            Share this information with your trusted providers and other supporters and ask for advice.
                            You may wish to explore options such as counselling, peer support groups, relaxation, meditation or other activities to reduce anxiety.
                            Make sure you keep track of what seems to help.
                        </Typography>
                    </>
                }
                <br />
                {/* moderate or higher problems with mobility <= 2
            moderate or higher problems with personal care <= 2
            usual activities <= 2*/}

                {(
                    (this.props.reports.problem_walking && this.props.reports.M_QofL2_SD[this.props.collection] !== undefined && this.props.reports.problem_walking[this.props.collection] <= 2 && this.props.reports.problem_walking[this.props.collection] !== 999) ||
                    (this.props.reports.problem_washing_dressing && this.props.reports.problem_washing_dressing[this.props.collection] !== undefined && this.props.reports.problem_washing_dressing[this.props.collection] <= 2 && this.props.reports.problem_washing_dressing[this.props.collection] !== 999) ||
                    (this.props.reports.problem_usual_activities && this.props.reports.problem_usual_activities[this.props.collection] !== undefined && this.props.reports.problem_usual_activities[this.props.collection] <= 2 && this.props.reports.problem_usual_activities[this.props.collection] !== 999)
                ) &&
                    <>
                        <Typography variant="body1" color="inherit" align="left" gutterBottom>
                            <em><b>Problems with </b></em>
                            {this.props.reports.problem_walking && this.props.reports.problem_walking[this.props.collection] !== undefined && this.props.reports.problem_walking[this.props.collection] <= 2 && this.props.reports.problem_walking[this.props.collection] !== 999 &&
                                <em><b> mobility</b></em>
                            }
                            {this.props.reports.problem_washing_dressing && this.props.reports.problem_washing_dressing[this.props.collection] !== undefined && this.props.reports.problem_washing_dressing[this.props.collection] <= 2 && this.props.reports.problem_washing_dressing[this.props.collection] !== 999 &&
                                <>
                                    {this.props.reports.problem_walking && this.props.reports.problem_walking[this.props.collection] !== undefined && this.props.reports.problem_walking[this.props.collection] <= 2 && this.props.reports.problem_walking[this.props.collection] !== 999 && ","}
                                    <em><b> personal care</b> </em>
                                </>
                            }
                            {this.props.reports.problem_usual_activities && this.props.reports.problem_usual_activities[this.props.collection] !== undefined && this.props.reports.problem_usual_activities[this.props.collection] <= 2 && this.props.reports.problem_usual_activities[this.props.collection] !== 999 &&
                                <>
                                    {(this.props.reports.problem_walking && this.props.reports.problem_walking[this.props.collection] !== undefined && this.props.reports.problem_walking[this.props.collection] <= 2 && this.props.reports.problem_walking[this.props.collection] !== 999) ||
                                        (this.props.reports.problem_washing_dressing && this.props.reports.problem_washing_dressing[this.props.collection] !== undefined && this.props.reports.problem_washing_dressing[this.props.collection] <= 2 && this.props.reports.problem_washing_dressing[this.props.collection] !== 999) ? "," : null}
                                    <em><b> usual activities</b></em>
                                </>
                            }.
                        </Typography>
                        <Typography variant="body1" color="inherit" align="left" gutterBottom>
                            You may want to speak to a trusted health care provider and bring this results report with you to ask if you are eligible for extra help, assistive aids, or if they have other suggestions to help you better deal with these challenges. If you don’t already have a trusted provider helping with your in-home or personal care, would you like us to connect you?
                        </Typography>
                    </>
                }
                <br />
                {/* No access to primary care provider access_to_family_doctor == "No" */}
                {this.props.reports.access_to_family_doctor && this.props.reports.access_to_family_doctor[this.props.collection] !== undefined && this.props.reports.access_to_family_doctor[this.props.collection] === "No" &&
                    <>
                    <Typography display="block" variant="body1" color="inherit" align="left" gutterBottom>
                        <em><b>Access to a primary care provider.</b></em>
                    </Typography>
                    <Typography display="block" variant="body1" color="inherit" align="left" gutterBottom>
                        Having your own family doctor is good for your health! Would you like us to help you connect with a primary care provider who is right for you?
                    </Typography>
                    </>
                }
                <br />
            </div>
        )
    }
}