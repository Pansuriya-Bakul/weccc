import React, { useEffect, useState } from "react";
import { Box, Typography } from "@material-ui/core";
import OverallFrequencyOfCommunityParticipation from "./OverallFrequencyOfCommunityParticipation";
import FrequencyByType from "./FrequencyByType";
import HealthStatus from './Summary/HealthStatus';
import HealthSupportServices from './Summary/HealthSupportServices';
import PersonalWellBeing from './Summary/PersonalWellBeing';
import './reports.css';


export default function ({ reports, collection }) {
  return (
    <>
      <Box m={1} className="avoid-break">
        {reports.FCP_INT_COMB && (
          <>
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
          </>
        )}
        {reports.FCP_STRINGS_COMB && (
          <>
            <Typography variant="h6" color="secondary" align="left" gutterBottom>
              Preferences for doing more activities
            </Typography>
            <Box m={1} mb={1}>
              {reports.FCP_STRINGS_COMB &&
                Array.isArray(reports.FCP_STRINGS_COMB[0]) &&
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
          </>
        )}
      </Box>
      <div className="avoid-break">
      <HealthStatus reports={reports} collection={collection} />
      <HealthSupportServices reports={reports} collection={collection} />
      <PersonalWellBeing reports={reports} collection={collection} />
      </div>
    </>
  );
}
