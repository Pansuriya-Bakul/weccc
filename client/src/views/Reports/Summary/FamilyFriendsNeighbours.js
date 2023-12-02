import React, { useEffect, useState } from "react";
import { Box, Typography } from "@material-ui/core";

export default function FamilyFriendsNeighbours({ reports, collection }) {

	const [wellnessSupportFeedback, setwellnessSupportFeedback] =
		useState("Excellent 😍");
	const [
		qualityOfSocialRelationshipsFeedback,
		setqualityOfSocialRelationshipsFeedback,
	] = useState("Excellent 😍");
	const sizeOfPersonalNetwork =
		reports.household_size[0] + reports.total_close_friends[0];
	const NoOfSocialContacts =
		reports.household_size[0] +
		reports.total_close_friends[0] +
		reports.total_relatives[0] +
		reports.total_well_known_neighbours[0];

	// quality of social relationships
	const qualityOfSocialRelationships = reports.QSC_QofL1_COMB.reduce(
		(accumulator, currentValue) => accumulator + currentValue,
		0
	);
	const getQualityOfSocialRelationshipFeedBack = () => {
		let text = "Excellent 😍";
		if (qualityOfSocialRelationships == 3) {
			text = "Excellent 😍";
		} else if (qualityOfSocialRelationships == 2) {
			text = "Good 😃";
		} else if (qualityOfSocialRelationships == 1) {
			text = "Neutral 🙂";
		} else if (qualityOfSocialRelationships == 0) {
			text = "Poor 😔";
		}
		setqualityOfSocialRelationshipsFeedback(text);
	};

	// Wellness support
	const wellnessSupport =
		reports.support_private_healthcare[0] + reports.support_wellness_program[0];
	const getWellnessSupportFeedback = () => {
		let text = "Excellent 😍";
		if (wellnessSupport >= 10) {
			text = "Excellent 😍";
		} else if (wellnessSupport >= 8) {
			text = "Good 😃";
		} else if (wellnessSupport >= 6) {
			text = "Neutral 🙂";
		} else if (wellnessSupport >= 4) {
			text = "Poor 😔";
		} else {
			text = "Very Poor 😭";
		}
		setwellnessSupportFeedback(text);
	};
	useEffect(() => {
		getQualityOfSocialRelationshipFeedBack();
		getWellnessSupportFeedback();
	}, []);

	return (
		<>
			<Typography variant="h6" color="secondary" align="left" gutterBottom>
				Who's in my circle
			</Typography>
			<Box m={1} mb={2}>
				{reports.household_size[collection] !== 999 &&
					<>
						<Typography display="block" component="div" align="left" gutterBottom>
							<Typography display="inline" variant="body1" component="div" color="primary" align="left" gutterBottom>
								Household size:&nbsp;
							</Typography>
							<Typography display="inline" variant="body1" component="div" color="inherit" align="left" gutterBottom>
								{reports.household_size[collection]}
							</Typography>
						</Typography>
					</>
				}
				{reports.total_children[collection] !== 999 && reports.total_relatives[collection] !== 999 && reports.total_close_friends[collection] !== 999 &&
					<>
						<Typography display="block" component="div" align="left" gutterBottom>
							<Typography display="inline" variant="body1" component="div" color="primary" align="left" gutterBottom>
								I have:&nbsp;
							</Typography>
							<Typography display="inline" variant="body1" component="div" color="inherit" align="left" gutterBottom>
								{reports.total_children[collection]}
							</Typography>
							<Typography display="inline" variant="body2" component="div" color="textSecondary" align="left" gutterBottom>
								&nbsp;children,&nbsp;
							</Typography>
							<Typography display="inline" variant="body1" component="div" color="inherit" align="left" gutterBottom>
								{reports.total_relatives[collection]}
							</Typography>
							<Typography display="inline" variant="body2" component="div" color="textSecondary" align="left" gutterBottom>
								&nbsp;relatives, and&nbsp;
							</Typography>
							<Typography display="inline" variant="body1" component="div" color="inherit" align="left" gutterBottom>
								{reports.total_close_friends[collection]}
							</Typography>
							<Typography display="inline" variant="body2" component="div" color="textSecondary" align="left" gutterBottom>
								&nbsp;close friends
							</Typography>
						</Typography>
					</>
				}
				{reports.total_well_known_neighbours[collection] !== 999 &&
					<>
						<Typography display="block" component="div" align="left" gutterBottom>
							<Typography display="inline" variant="body1" component="div" color="primary" align="left" gutterBottom>
								I know:&nbsp;
							</Typography>
							<Typography display="inline" variant="body1" component="div" color="inherit" align="left" gutterBottom>
								{reports.total_well_known_neighbours[collection]}
							</Typography>
							<Typography display="inline" variant="body2" component="div" color="textSecondary" align="left" gutterBottom>
								&nbsp;neighbours well
							</Typography>
						</Typography>
					</>
				}
				{reports.frequency_of_contact_family[collection] !== 999 &&
					<>
						<Typography display="block" component="div" align="left" gutterBottom>
							<Typography display="inline" variant="body1" component="div" color="primary" align="left" gutterBottom>
								👪 I see my family&nbsp;
							</Typography>
							<Typography display="inline" variant="body1" component="div" color="inherit" align="left" gutterBottom>
								{reports.frequency_of_contact_family[collection]}
							</Typography>
						</Typography>
					</>
				}
				{reports.frequency_of_contact_friends[collection] !== 999 &&
					<>
						<Typography display="block" component="div" align="left" gutterBottom>
							<Typography display="inline" variant="body1" component="div" color="primary" align="left" gutterBottom>
								🧓 I see my friends&nbsp;
							</Typography>
							<Typography display="inline" variant="body1" component="div" color="inherit" align="left" gutterBottom>
								{reports.frequency_of_contact_friends[collection]}
							</Typography>
						</Typography>
					</>
				}
				{reports.frequency_of_contact_neighbours[collection] !== 999 &&
					<>
						<Typography display="block" component="div" align="left" gutterBottom>
							<Typography display="inline" variant="body1" component="div" color="primary" align="left" gutterBottom>
								🏡 I see my neighbours&nbsp;
							</Typography>
							<Typography display="inline" variant="body1" component="div" color="inherit" align="left" gutterBottom>
								{reports.frequency_of_contact_neighbours[collection]}
							</Typography>
						</Typography>
					</>
				}
				<Typography variant="h6" color="secondary" align="left" gutterBottom>
					Size of personal network
				</Typography>
				<Box m={1} mb={1}>
					Score: {sizeOfPersonalNetwork}
				</Box>
				<Typography variant="h6" color="secondary" align="left" gutterBottom>
					Number of friends
				</Typography>
				<Box m={1} mb={1}>
					Score: {reports.total_close_friends[0]}
				</Box>
				<Typography variant="h6" color="secondary" align="left" gutterBottom>
					Number of social Contacts
				</Typography>
				<Box m={1} mb={1}>
					Score: {NoOfSocialContacts}
				</Box>
				<Typography variant="h6" color="secondary" align="left" gutterBottom>
					Quality of social relationships
				</Typography>
				<Box m={1} mb={1}>
					<Typography
						display="inline"
						variant="body1"
						component="div"
						color="primary"
						align="left"
						gutterBottom
					>
						{qualityOfSocialRelationshipsFeedback}
					</Typography>
					Score: {qualityOfSocialRelationships}
				</Box>
				<Typography variant="h6" color="secondary" align="left" gutterBottom>
					Wellness Support
				</Typography>
				<Box m={1} mb={1}>
					<Typography
						display="inline"
						variant="body1"
						component="div"
						color="primary"
						align="left"
						gutterBottom
					>
						{wellnessSupportFeedback}
					</Typography>
					Score: {wellnessSupport}
				</Box>
			</Box>
		</>
	)
}