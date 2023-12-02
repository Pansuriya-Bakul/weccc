import React from 'react';
import jsPDF from 'jspdf';
// import 'jspdf-autotable';
import SocialHealthInfoImage from './socialHealthInfo.png';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Button } from '@material-ui/core';

const SocialHealthInfoPage = () => {

    const handleDownloadPDF = () => {
        const pdf = new jsPDF('p', 'pt', 'letter');

        var img = document.getElementById('socialHealthImage');
        
        var canvas = document.createElement('canvas'); // Create a new canvas element
        var ctx = canvas.getContext('2d');

        canvas.width = img.width;
        canvas.height = img.height;

        // Draw the image onto the canvas
        ctx.drawImage(img, 0, 0, img.width, img.height);

        // Convert the canvas content to a data URL (JPEG in this case)
        var imgData = canvas.toDataURL('image/jpeg');


        // First page: heading and image
        pdf.text("Social Health Information Sheet", 40, 40);
        pdf.addImage(imgData, 'jpeg', 40, 60, 327, 714);

        // Subsequent pages: table and "What Now?" section
        pdf.addPage();

        // Create an empty array to store table data
        const tableData = [["Watch out for", "What you can do"]];

        // Reference to your Material-UI table
        const materialUITable = document.getElementById('material-UI-table');

        // Loop through table rows and extract data
        const tableRows = materialUITable.querySelectorAll('tr');
        for (let i = 1; i < tableRows.length; i++) {
            const cells = tableRows[i].querySelectorAll('td');
            if (cells.length === 2) {
                const rowData = [cells[0].textContent, cells[1].textContent];
                tableData.push(rowData);
            }
        }

        pdf.autoTable({
            head: [tableData[0]], // First row as table header
            body: tableData.slice(1), // Rest of the rows as table body
            startY: 40,
            margin: { left: 40, right: 40 },
            theme: 'striped',
            headStyles: { fillColor: [221, 221, 221] },
        });

        const tableHeight = pdf.previousAutoTable.finalY + 30;
        // "What Now?" section
        // pdf.addPage();
        pdf.setFontSize(18);
        pdf.text("What Now?", 40, tableHeight);
        pdf.setFontSize(12);
        pdf.text("Maintaining good social health and addressing social health concerns will improve your well-being along with your physical and mental health. Having trouble figuring out next steps? CONTACT US at hwfc.lab@gmail.com to talk to a trained Community Connector – we can help you set goals and find activities and resources to promote your health and address social risks.", 40, tableHeight + 20, { maxWidth: 500 });

        pdf.save("SocialHealthInfo.pdf");
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleDownloadPDF}
                >
                    Download PDF
                </Button>
            </div>

            <div style={{ alignItems: 'center', justifyContent: 'center', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <Typography variant="h4">Social Health Information Sheet</Typography>
                <br />
                <img src={SocialHealthInfoImage} id="socialHealthImage" alt="Social Health Information Sheet" style={{ marginTop: '5px' }} />
                <br />
                <Typography variant="body1" style={{ marginTop: '10px' }}>Maintaining good social health is important to your overall health, well-being and quality of life. Here are <span style={{ fontWeight: "500" }}>common risks</span> many people experience… and what you can do to to <span style={{ fontWeight: "500" }}>protect yourself.</span></Typography>
                <br />
                <TableContainer>
                    <Table id="material-UI-table">
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    <Typography variant="h6">Watch out for</Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="h6">What you can do</Typography>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow style={{backgroundColor:"#faf7ff"}}>
                                <TableCell>
                                    <Typography variant="body1"><span style={{ fontWeight: "500" }}>Living Alone:</span> People who live alone have fewer opportunities for daily social interaction and support. Studies have shown that living alone, particularly for men, is hazardous to your health and increases risk of loneliness</Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body1" style={{ whiteSpace: "pre-line" }}>
                                        Make sure you are getting enough social interaction - one to three hours of social interaction per day is recommended. That’s between seven and 21 hours of social time per week.
                                        {'\n\n'}
                                        Social interactions can include a wide variety of activities: family dinners, chatting with people on your street, a phone call to a friend, or join an activity that involves others.
                                        {'\n\n'}
                                        Help build connected communities by reaching out to people who live alone.
                                    </Typography>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    <Typography variant="body1"><span style={{ fontWeight: "500" }}>Social and Community Participation:</span> Positive social relationships that come from connecting with people with shared interests are associated with health and well-being. Low social levels of social participation are linked to increased risk of early death. </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body1" style={{ whiteSpace: "pre-line" }}>
                                        Try to participate at least once a week in a group activity that’s meaningful to you and keep trying something new. If you are homebound or lack transportation, think about virtual groups that match your circumstances and interests.
                                        {'\n\n'}
                                        The key is finding the right level of activity that’s meaningful to you. It’s also ok to spend time alone – this can provide an opportunity to restore your social reserves and meet your own personal needs.
                                    </Typography>
                                </TableCell>
                            </TableRow>
                            <TableRow style={{backgroundColor:"#faf7ff"}}>
                                <TableCell>
                                    <Typography variant="body1"><span style={{ fontWeight: "500" }}>Life Satisfaction:</span>  Low life satisfaction more than doubles the risk of chronic disease and early death. Life satisfaction is strongly associated with sleep problems, pain, obesity, smoking, anxiety, physical activity, diagnosed mental disease, and with higher healthcare utilization and costs.  </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body1" style={{ whiteSpace: "pre-line" }}>
                                        Maintain and protect your health by staying involved in activities that bring joy, purpose, meaning, and a sense of achievement to your life. Think about life goals and how to achieve them.
                                        {'\n\n'}
                                        Feeling dissatisfied with your life is a sign that you may be experiencing some stressful challenges and may need extra support. Setting goals for what you would like to change, and what you can do to make this happen, can help. Each day, think about what you can do to achieve something that’s important, develop good personal relationships with others, and try to find meaning in what’s happening to you right now.

                                    </Typography>
                                </TableCell>
                            </TableRow>
                            <TableRow >
                                <TableCell>
                                    <Typography variant="body1"><span style={{ fontWeight: "500" }}>Community belonging</span> is strongly associated with physical health. A weak sense of belonging is linked to increased risk of chronic disease.</Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body1" style={{ whiteSpace: "pre-line" }}>
                                        Strengthen feelings of belonging through connecting with and giving back to communities that are important to you – these may be geographic or virtual. A great way to build belonging is to volunteer, to reach out to offer help to others, or even to do small random acts of kindness.
                                        {'\n\n'}
                                        Studies have shown that something as simple as talking to neighbours can build a sense of community and even talking to strangers can create a sense of safety and provide a meaningful source of connection.
                                    </Typography>
                                </TableCell>
                            </TableRow>
                            <TableRow style={{backgroundColor:"#faf7ff"}}>
                                <TableCell>
                                    <Typography variant="body1"><span style={{ fontWeight: "500" }}>Feeling lonely</span> (even if you are around other people) is worse for health than smoking 15 cigarettes a day or being obese – it is associated with higher risk of stress, anxiety; depression; heart disease; stroke; dementia; falls; use of long-term care; and early death. </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body1" style={{ whiteSpace: "pre-line" }}>
                                        It’s important to your health to have people to talk to and relate to in ways that are authentic and satisfying.
                                        Talking even briefly to many different people — even those you don’t have a close relationship with — also matters.
                                        {'\n\n'}
                                        To feel loved, acknowledged and validated, lean into close relationships– but avoid toxic ones. Reach out to old friends and don’t be afraid to make new ones. If you find yourself thinking about a friend or family members, give them a call just to say hi. Or set up a regularly scheduled call or video chat to talk about favourite shows or what’s happening around the world.
                                        {'\n\n'}
                                        If you’re having a hard time finding those people, consider getting involved in group activities or trusted virtual communities – such as faith, fitness, music, movies or sport – where you’re likely to meet people who share your interests. Think about the talents you have that you can share with others - invite others to join you in doing the activities you love best. Volunteering is also a good way to address loneliness, or to reach out informally to help others.
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
                <br />
                <br />
            </div>
            <div>
                <Typography variant="h6">What Now?</Typography>
                <Typography variant="body1">
                    Maintaining good social health and addressing social health concerns will improve your well-being along with your physical and mental health. Having trouble figuring out next steps? CONTACT US at <a href="mailto:hwfc.lab@gmail.com" target="_blank" rel="noopener noreferrer">hwfc.lab@gmail.com</a> to talk to a trained Community Connector – we can help you set goals and find activities and resources to promote your health and address social risks.
                </Typography>
            </div>
        </div>
    );
};


export default SocialHealthInfoPage;
