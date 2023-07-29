import React from 'react';

const ConsentStatement = () => {
    const statement = `
<div style="text-align: justify;">    
<strong><center>LETTER OF INFORMATION </center><br>
USE OF CATALYST DATA FOR RESULTS TRACKING AND RESEARCH</strong><br><br>

CATALYST <i>(Caring to be healthy system)</i> is a survey and data system operated by the Health and Wellness Friendly Community (HWFC) Action Learning Lab for use by individuals such as yourself for self-care, and for communities and organizations concerned about population health.  This Letter of Information outlines important information about your data and information.  Please ask as many questions as you like before deciding whether to participate.  Volunteers can explain the information to you verbally if you request.<br><br>

<strong>Purpose</strong><br>
The HWFC initiative is bringing community, volunteers and teams together to help people achieve their goals; address physical, mental, social and spiritual needs; create opportunities; and track health and well-being.  This initiative is also part a long-term, voluntary research program to improve population health and quality of life in communities.<br><br>

<strong>Collection of Personal Data</strong><br>
Your data in the system belongs to you. It is collected and stored for your benefit. You may be asked to provide demographic information about yourself, complete a social health screener, reflect on your quality of life, or share information about your experiences through a survey or an interview. This personal information is being collected to inform you about your self-rated quality of life, to find support and resources you might be interested in. Your data is stored in the platform to identify improvement opportunities, to track changes in your outcomes over time, and to produce summary reports containing non-identifying data only.  The CATALYST platform was developed by computer science experts at the University of Windsor, Ontario.<br><br>

<strong>Benefits of Participation</strong><br>
You will receive information and support that may help improve your health, happiness, connection to others. You will also be guided to reflect on your quality of life, to set goals and take action to help achieve what’s most important to you. Aggregated data will be used to advocate for community resources and create new opportunities for groups of people.  Your involvement will help build stronger, more connected, more resilient communities for everyone.<br><br>

<strong>Possible Risks</strong><br>
There are no known risks to you as a participant. If you get tired during an activity, survey or interview, you can stop and resume at a later time.<br><br>

<strong>Confidentiality</strong><br>
The platform is protected, safe, secure and confidential. Standards, procedures, and personnel are in place to keep the digital information in this application secure and protect your privacy from unauthorized disclosure. Information will never be used or disclosed without your consent in full compliance with personal information and protection of privacy laws in Canada.<br><br>

<strong>Will I Be Paid To Participate?</strong><br>
You will not be paid to participate in the program.<br><br>

<strong>Will There Be Any Costs?</strong><br>
Your participation will not involve any additional costs to you.<br><br>

<strong>Use of De-identified Information</strong><br>
Our team will use your de-identified information (that is, data with your name, address, phone number and any other identifying information removed) for the following purposes:<br>
<ul>
<li>To measure outcomes and key performance indicators</li>
<li>To produce case studies and examples of how the program works in practice</li>
<li>To track and report on longer-term changes in group and population health, including comparisons with other health and community data sources and linking data sets</li>
<li>To identify new opportunities</li>
<li>To advocate for community resources</li>
</ul><br><br>

In terms of group reporting, as per our strict privacy policy, your responses to survey and other questions are combined with those of other participants and are tabulated only in the aggregate. Your answers will therefore remain entirely confidential, and your identity will always remain anonymous.  Any reports, publications or presentations resulting from this program will <strong>NEVER</strong> include your name or anything that reveals who you are.<br><br> 

<strong>Questions about the Project</strong><br>
Feel free to contact us at any time by email if you have any questions at <a href="mailto:hwfc.lab@gmail.com">hwfc.lab@gmail.com</a><br><br> 

<strong>Early Termination of Participation</strong><br>
You may stop your participation at any time, and for any reason. You also have the option of requesting full removal of all your previous personal data from the survey platform. Should you wish to withdraw from the survey platform, please contact: <a href="mailto:hwfc.lab@gmail.com">hwfc.lab@gmail.com</a><br><br>

<strong>Confirmation – Use of non-identifying data for research</strong><br>
By clicking the “I agree” button below, you are providing permission for use of your data to create personalized reports for yourself, and for results tracking and research.  Note however that your permission is not a requirement for participation in most HWFC programs. You are always free to participate in the Virtual Community Centre, and many HWFC programs on a drop-in basis, without sharing any personal information.<br><br>
</div>

`;

    return <div dangerouslySetInnerHTML={{ __html: statement }} />;
};

export default ConsentStatement;