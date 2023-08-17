import React, { useEffect, useState } from "react";
import { Box, Typography } from "@material-ui/core";

export default function OverallFrequencyOfCommunityParticipation({ source }) {
  const [avg, setAvg] = useState(0);
  const [text, setText] = useState("Excellent");

  /* 
    10 Questions

    5- Daily
    4- Weekly
    3- Monthly
    2- 3-4 Times an year
    1- Yearly
    0- Never
    */
  const calculateAvg = () => {
    let text = "Excellent";
    let sum = 0;
    for (let i = 0; i < source[0].length; i++) {
      sum = sum + source[0][i];
    }
    setAvg(sum / 10);

    if (sum / 10 > 4.5) {
      text = "Excellent";
    } else if (sum / 10 > 3.5) {
      text = "Good";
    } else if (sum / 10 >= 2) {
      text = "Normal";
    } else {
      text = "Poor";
    }
    setText(text);
  };
  useEffect(() => {
    calculateAvg();
  }, []);

  return (
    <>
      <Box m={1} mb={2}>
        <Typography
          variant="subtitle1"
          color="textSecondary"
          align="left"
          gutterBottom
        >
          {text} Community Connection
        </Typography>
        {/* avg is 0-5 */}
        Community Connection Score: {avg}
      </Box>
    </>
  );
}
