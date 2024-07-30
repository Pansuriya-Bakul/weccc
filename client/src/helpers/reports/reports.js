import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@material-ui/core';

export const calculateCompleteness = (survey) => {
  if (!survey || typeof survey.getAllQuestions !== 'function') {
    return 0;
  }

  let totalSurveyItems = survey.getAllQuestions().length;
  let totalQuestions = 0;
  let finishedQuestions = 0;
  let partiallyFinishedQuestions = 0;
  let dMatrixpercent = 0;

  survey.getAllQuestions().forEach((question) => {
    if (question.getType() !== 'html' && !question.isReadOnly) {
      totalQuestions += 1;

      if (question.getType() === 'matrix') {
        if (
          question.hasOwnProperty('propertyHash') && 
          question.propertyHash && 
          question.propertyHash.hasOwnProperty('rows') && 
          Array.isArray(question.propertyHash.rows) && 
          question.propertyHash.hasOwnProperty('value')
        ) {
          let subQuestionsLength = question.propertyHash.rows.length;
          let answeredSubQuestions = Object.keys(question.propertyHash.value).length;

          if (answeredSubQuestions < subQuestionsLength) {
            partiallyFinishedQuestions += 1;
          } else if (answeredSubQuestions === subQuestionsLength) {
            finishedQuestions += 1;
          }
        }
      } else if (question.getType() === 'matrixdynamic') {
        if (
          question.hasOwnProperty('propertyHash') && 
          question.propertyHash && 
          question.propertyHash.hasOwnProperty('rows') && 
          Array.isArray(question.propertyHash.rows) && 
          question.propertyHash.hasOwnProperty('value') && 
          question.propertyHash.hasOwnProperty('columns')
        ) {
          let subQuestionCellLength = question.propertyHash.columns.length;
          let totalCells =
            (question.propertyHash.rowCount ? question.propertyHash.rowCount : question.initialRowCount) *
            subQuestionCellLength;
          let answeredCells = 0;

          if (totalCells > 0) {
            question.propertyHash.value.forEach((row) => {
              if (Object.keys(row).length >= 1) answeredCells += Object.keys(row).length;
            });

            if (answeredCells < totalCells) {
              dMatrixpercent = (answeredCells / totalCells) * 100;
            } else if (answeredCells === totalCells) {
              finishedQuestions += 1;
              dMatrixpercent = 0;
            }
          } else {
            finishedQuestions += 1;
            dMatrixpercent = 0;
          }
        }
      } else if (question.getType() === 'multipletext') {
        if (
          question.hasOwnProperty('propertyHash') && 
          question.propertyHash && 
          question.propertyHash.hasOwnProperty('items') && 
          Array.isArray(question.propertyHash.items) && 
          question.propertyHash.hasOwnProperty('value')
        ) {
          let subQuestionsLength = question.propertyHash.items.length;
          let answeredSubQuestions = Object.keys(question.propertyHash.value).length;

          if (answeredSubQuestions < subQuestionsLength) {
            partiallyFinishedQuestions += 1;
          } else if (answeredSubQuestions === subQuestionsLength) {
            finishedQuestions += 1;
          }
        }
      } else if (question.getType() === 'checkbox') {
        if (
          question.hasOwnProperty('propertyHash') && 
          question.propertyHash && 
          question.propertyHash.hasOwnProperty('value') && 
          Array.isArray(question.propertyHash.value)
        ) {
          if (question.propertyHash.value.length > 0) {
            finishedQuestions += 1;
          }
        }
      } else if (question.getType() === 'text') {
        if (
          question.hasOwnProperty('propertyHash') && 
          question.propertyHash && 
          question.propertyHash.hasOwnProperty('value') && 
          /\S/.test(String(question.propertyHash.value))
        ) {
          finishedQuestions += 1;
        }
      } else if (question.getType() === 'radiogroup') {
        if (
          question.hasOwnProperty('propertyHash') && 
          question.propertyHash && 
          question.propertyHash.hasOwnProperty('value') && 
          String(question.propertyHash.value)
        ) {
          finishedQuestions += 1;
        }
      } else if (question.getType() === 'rating') {
        if (
          question.hasOwnProperty('propertyHash') && 
          question.propertyHash && 
          question.propertyHash.hasOwnProperty('value') && 
          parseInt(question.propertyHash.value)
        ) {
          finishedQuestions += 1;
        }
      } else if (question.getType() === 'nouislider') {
        if (
          question.hasOwnProperty('propertyHash') && 
          question.propertyHash && 
          question.propertyHash.hasOwnProperty('value') && 
          parseInt(question.propertyHash.value)
        ) {
          finishedQuestions += 1;
        }
      }
    }
  });

  let completePercentage = Math.round(((finishedQuestions / totalQuestions) * 100) * 100) / 100;
  completePercentage += dMatrixpercent;

  if (!completePercentage) return 0;
  else return completePercentage;
};

const SurveyCompleteness = () => {
  const [surveyData, setSurveyData] = useState(null);
  const [completeness, setCompleteness] = useState(0);

  useEffect(() => {
    const fetchSurveyData = async () => {
      try {
        const response = await fetch('/api/surveys'); // Replace with your actual endpoint
        const data = await response.json();
        console.log(data); // Added logging for debugging
        setSurveyData(data);
        const completenessPercentage = calculateCompleteness(data);
        setCompleteness(completenessPercentage);
      } catch (error) {
        console.error('Error fetching survey data:', error);
      }
    };

    fetchSurveyData();
  }, []);

  return (
    <div>
      <Typography variant="h4">Survey Completeness</Typography>
      <Typography variant="h6">Completeness: {completeness}%</Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Question</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Answer</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {surveyData && surveyData.getAllQuestions && surveyData.getAllQuestions().length > 0 ? (
            surveyData.getAllQuestions().map((question, index) => (
              <TableRow key={index}>
                <TableCell>{question.title}</TableCell>
                <TableCell>{question.getType()}</TableCell>
                <TableCell>{question.value ? question.value.toString() : 'No Answer'}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={3} align="center">
                <Typography>No questions available</Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default SurveyCompleteness;
