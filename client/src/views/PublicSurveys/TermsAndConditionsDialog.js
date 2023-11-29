import React from "react";
import { Dialog, Typography } from "@material-ui/core";

const TermsAndConditionsDialog = ({ open, onClose }) => {
    return (
        <Dialog open={open} onClose={onClose}>
            <div style={{ padding: '16px' }}>
                <Typography variant="h6" gutterBottom style={{ textAlign: 'center', fontWeight: '500', whiteSpace: 'pre-line' }}>
                    HWFC SOCIAL HEALTH SCREENER
                </Typography>

                <Typography variant="subtitle2" gutterBottom style={{ textAlign: 'left', fontWeight: '400', whiteSpace: 'pre-line' }}>
                    This Policy outlines how personal information is collected, used, and stored through our platform and websites.
                    <br></br>
                    <br></br>
                    <b>What is the HWFC Social Health Screener?</b>
                    <br></br>
                    This free, personalized 2-minute web-based survey helps you understand social health risk factors generally, what specific risks you might currently be experiencing, and what steps you can take.
                    <br></br>
                    <br></br>
                    <b>Collection and Use of Personal Data</b>
                    <br></br>
                    Types of data collected and stored includes contact information and your answers to screener questions. Your data in this system belongs to you. It is collected and stored for your benefit. Stored data is used to keep you informed about our initiatives, identify ways you can reduce flagged risks, track changes in your outcomes over time, and to produce summary reports containing non-identifying data only. If contact information (text or email) was provided, we will periodically contact you about information and events that may be of interest to you. You will have the option to unsubscribe at any time.
                    <br></br>
                    <br></br>
                    <b>Confidentiality</b>
                    <br></br>
                    We treat your information with the privacy you deserve. The platform is protected, safe, secure and confidential. Our website has no advertisements and no third-party access. We will never sell or trade your personal data. Standards, procedures, and personnel are in place to keep the digital information in this application secure and protect your privacy from unauthorized disclosure. Information will never be used or disclosed without your consent in full compliance with personal information and protection of privacy laws in Canada. We protect your data using industry-standard security measures and state-of-the-art data centers.
                    <br></br>
                    <br></br>
                    <b> Storage Period and Location</b>
                    <br></br>
                    We retain data for your benefit until you terminate use. Data is stored and processed in Canada only.
                    <br></br>
                    <br></br>
                    <b>Who Manages this system?</b>
                    <br></br>
                    This website is operated by the Health and Wellness Friendly Community (HWFC) Action Learning Lab for use by individuals such as yourself for self-care, and for communities and organizations concerned about population health and well-being. This platform was developed by computer science experts at the University of Windsor, Ontario.
                    <br></br>
                    <br></br>
                    <b>Your Rights</b>
                    <br></br>
                    You have rights over your personal information, including the right to access, correct, and delete your data. You have the option of requesting full removal of all your previous personal data from the survey platform. You can also lodge complaints with supervisory authorities. Please contact hwfc.lab@gmail.com about your rights
                    <br></br>
                    <br></br>
                    In terms of group reporting, as per our strict privacy policy, your responses to survey and other questions are combined with those of other participants and are tabulated only in the aggregate. Your answers will therefore remain entirely confidential, and your identity will always remain anonymous.  Any reports, publications or presentations resulting from this program will NEVER include your name or anything that reveals who you are.
                </Typography>
            </div>
        </Dialog>
    );
}

export default TermsAndConditionsDialog;