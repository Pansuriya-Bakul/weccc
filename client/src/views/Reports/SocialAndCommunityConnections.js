import React, { useEffect, useState } from "react";
import { Box, Typography } from "@material-ui/core";
import OverallFrequencyOfCommunityParticipation from "./OverallFrequencyOfCommunityParticipation";
import FrequencyByType from "./FrequencyByType";

export default function ({ reports, collection }) {
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
      <Box m={1}>
        <Typography variant="h6" color="secondary" align="left" gutterBottom>
          Overall Frequency of Community Participation
        </Typography>
        <OverallFrequencyOfCommunityParticipation
          source={reports.FCP_INT_COMB}
        />
        <Typography variant="h6" color="secondary" align="left" gutterBottom>
          Frequency by type of community activity
        </Typography>
        <Box m={1} mb={1}>
          <FrequencyByType source={reports.FCP_INT_COMB} />
        </Box>
        <Typography variant="h6" color="secondary" align="left" gutterBottom>
          Preferences for doing more activities
        </Typography>
        <Box m={1} mb={1}>
          {reports.FCP_STRINGS_COMB &&
            reports.FCP_STRINGS_COMB[0].map((words, index) => (
              <Typography
                display="initial"
                variant="body1"
                component="div"
                color="inherit"
                align="left"
                gutterBottom
              >
                {index + 1}. {words}
              </Typography>
            ))}
        </Box>
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
  );
}
