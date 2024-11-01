// const { off } = require("../models/collection");

module.exports = {
  collectionIds,
  collectionDates,
  neighbourChapterIds,
  neighbourChapterDates,
  formatDate,
  formatPostalCode,
  formatInvolvement,
  formatGender,
  formatLanguage,
  frequency_of_community_participation,
  infrequent_participation_in_social_activities,
  social_isolation_index,
  size_of_personal_network,
  frequency_of_social_contacts,
  satisfaction_with_social_contact,
  quality_of_social_contact,
  perceived_social_support,
  perceived_loneliness,
  asking_for_help,
  progress_achieving_goals,
  health_today,
  physical_health,
  physical_health_string,
  mental_health,
  mental_health_string,
  mobility,
  personal_care,
  usual_activities,
  pain_discomfort,
  anxiety_depression,
  ed_visit,
  hospitalization,
  days_in_hospital,
  ems,
  urgent_care,
  sought_treatment,
  accident,
  life_satisfaction,
  your_standard_of_living,
  your_health,
  feeling_part_of_the_community,
  what_you_are_achieving_in_life,
  personal_relationships,
  how_safe_you_feel,
  future_security,
  your_spirituality_or_religion,
  pwi_overall_score,
  activities,
  meaningful_activities,
  like_to_join,
  challenging_activities,
  FCP_STRINGS_COMB,
  ISA_DM_STRINGS,
  household_size,
  total_children,
  total_relatives,
  total_close_friends,
  total_well_known_neighbours,
  frequency_of_contact_family,
  frequency_of_contact_friends,
  frequency_of_contact_neighbours,
  frequency_of_participation_religion,
  frequency_of_participation_sports,
  frequency_of_participation_recreation,
  frequency_of_participation_education,
  frequency_of_participation_associations,
  frequency_of_participation_volunteering,
  frequency_of_participation_informal_help,
  frequency_of_participation_music,
  frequency_of_participation_other_activities,
  frequency_of_participation_computer,
  problem_walking,
  problem_washing_dressing,
  problem_usual_activities,
  problem_pain_discomfort,
  problem_anxious_depressed,
  support_wellness_program,
  support_healthcare,
  support_home_healthcare,
  support_private_healthcare,
  support_informal,
  goals,
  access_to_family_doctor,
  frequency_get_together_family,
  frequency_get_together_friends,
  frequency_get_together_neighbours,
  frequency_of_social_contacts_phone,
  frequency_of_social_contacts_computer,
  perceived_loneliness_sometimes_count,
  perceived_loneliness_often_count,
  feel_isolated,
  feel_leftout,
  lack_companionship,
  local_community_belonging,
  life_satisfaction2,
  community_activity_participate,
  household2_size,
  con_que,
  trusted_people,
};


function collectionIds(list) {
  let newList = new Array();

  list.map((collection) => {
    newList.push(collection._id) || newList.push("");
  });

  return newList;
}

function collectionDates(list) {
  let newList = new Array();

  list.map((collection) => {
    let date = new Date(collection.createdAt);
    let yyyy = date.getFullYear();
    let mm = String(date.getMonth() + 1).padStart(2, "0");
    let dd = String(date.getDate()).padStart(2, "0");
    newList.push(`${dd}/${mm}/${yyyy}`) || newList.push("");
  });

  return newList;
}

function neighbourChapterIds(collection_list) {
  let newList = new Array();

  collection_list.map((collection) => {
    collection.memberSurveyList.forEach((chapter) => {
      newList.push(chapter._id) || newList.push("");
    });
  });

  return newList;
}

function neighbourChapterDates(collection_list) {
  let newList = new Array();

  collection_list.map((collection) => {
    collection.memberSurveyList.forEach((chapter) => {
      let date = new Date(chapter.createdAt);
      let yyyy = date.getFullYear();
      let mm = String(date.getMonth() + 1).padStart(2, "0");
      let dd = String(date.getDate()).padStart(2, "0");
      newList.push(`${dd}/${mm}/${yyyy}`) || newList.push("");
    });
  });

  return newList;
}

function formatDate(date) {
  if (!date) return "";
  let newDate = new Date(date);
  let yyyy = date.getFullYear();
  let mm = String(date.getMonth() + 1).padStart(2, "0");
  let dd = String(date.getDate()).padStart(2, "0");

  if (!newDate || !yyyy || !mm || !dd) return "";
  else return `${dd}/${mm}/${yyyy}`;
}

function formatPostalCode(postalCode) {
  let newPostalCode = postalCode.substring(0, 3) || "";
  return newPostalCode;
}

function formatInvolvement(role) {
  // 1. - Student intern
  // 2. - Volunteer
  // 3. - Community partner
  // 4. - Community Connections - Member
  // 5. - CCC group or education program

  switch (role) {
    case "Admin":
      return 999;
    case "Coordinator":
      return 999;
    case "Volunteer":
      return 2;
    case "Patient":
      return 999;
    default:
      // Missing
      return 999;
  }
}

function formatGender(gender) {
  // 1 = Male
  // 2 = Female
  // 3 = (Non-Binary) / Other

  switch (gender) {
    case "Male":
      return 1;
    case "Female":
      return 2;
    case "Other":
      return 3;
    default:
      // Missing
      return 999;
  }
}

function formatLanguage(language) {
  // 1 = English
  // 2 = [Text]
  // 99 = Missing

  if (language == "English") {
    return 1;
  } else if (language == "" || !language) {
    return 999;
  } else {
    return 2;
  }
}

function frequency_of_community_participation(question) {
  //Unavailable Question
  if (!question) return 999;


  let DF1 = parseInt(question.DF1);
  let DF2 = parseInt(question.DF2);
  let DF3 = parseInt(question.DF3);
  let DF4 = parseInt(question.DF4);
  let DF5 = parseInt(question.DF5);
  let DF6 = parseInt(question.DF6);
  let DF7 = parseInt(question.DF7);
  let DF8 = parseInt(question.DF8);
  let DF9 = parseInt(question.DF9);
  let DF10 = parseInt(question.DF10);

  let DF_array = [DF1, DF2, DF3, DF4, DF5, DF6, DF7, DF8, DF9, DF10].filter(value => !isNaN(value) && value !== '');

  return DF_array;

}

function infrequent_participation_in_social_activities(question) {
  // Value Chart per sub question
  // 999  Total invalid or blank answer
  // 300  Daily
  // 50   Weekly
  // 12   Monthly
  // 4    3-4 Times a Year
  // 1    Yearly
  // 0    Never

  //Unavailable Question
  if (!question) return 999;

  let DF1 = parseInt(question.DF1);
  let DF2 = parseInt(question.DF2);
  let DF3 = parseInt(question.DF3);
  let DF4 = parseInt(question.DF4);
  let DF5 = parseInt(question.DF5);
  let DF6 = parseInt(question.DF6);
  let DF7 = parseInt(question.DF7);
  let DF8 = parseInt(question.DF8);

  // Three different criteria sections ordered from 1-3
  let availableSections = [true, true, true];
  let infrequentResults = [false, false, false];

  //Criteria 1 NO if: Weekly / Daily participation for one of DF1-3
  let section1 = [DF1, DF2, DF3];
  let criteria1 = [];

  section1.forEach((item) => {
    if (!isNaN(item) && item != 999) {
      criteria1.push(item);
    }
  });

  if (criteria1.length != 0) {
    criteria1.forEach((item) => {
      if (infrequentResults[0] == false) {
        if (item == 12 || item == 4 || item == 1 || item == 0) {
          infrequentResults[0] = true;
        }
      }
    });
  } else {
    availableSections[0] = false;
  }

  //Criteria 2 NO if: Monthly / Weekly / Daily participation for one of DF4-7
  let section2 = [DF4, DF5, DF6, DF7];
  let criteria2 = [];

  section2.forEach((item) => {
    if (!isNaN(item) && item != 999) {
      criteria2.push(item);
    }
  });

  if (criteria2.length != 0) {
    criteria2.forEach((item) => {
      if (infrequentResults[1] == false) {
        if (item == 4 || item == 1 || item == 0) {
          infrequentResults[1] = true;
        }
      }
    });
  } else {
    availableSections[1] = false;
  }

  //Criteria 3 NO if: Weekly / Daily participation for DF8
  let section3 = [DF8];
  let criteria3 = [];

  section3.forEach((item) => {
    if (!isNaN(item) && item != 999) {
      criteria3.push(item);
    }
  });

  if (criteria3.length != 0) {
    criteria3.forEach((item) => {
      if (infrequentResults[2] == false) {
        if (item == 12 || item == 4 || item == 1 || item == 0) {
          infrequentResults[2] = true;
        }
      }
    });
  } else {
    availableSections[2] = false;
  }

  if (availableSections.findIndex((item) => item == true) == -1) {
    //  If there are no available sections
    return 999;
  }

  let infrequent_participation = true;

  for (let i = 0; i < infrequentResults.length; i++) {
    if (availableSections[i]) {
      infrequent_participation =
        infrequent_participation && infrequentResults[i];
    }
  }

  if (infrequent_participation) {
    // Result is infrequent participation
    return 2;
  } else {
    // Result is not infrequent participation
    return 1;
  }
}

function social_isolation_index(question) {
  // Value Chart per sub question
  // 1    Yes
  // 0    No

  //Unavailable Question
  if (!question) return 999;

  let DF1 = parseInt(question.DF1);
  let DF2 = parseInt(question.DF2);
  let DF3 = parseInt(question.DF3);
  let DF4 = parseInt(question.DF4);
  let DF5 = parseInt(question.DF5);

  DF_array = [DF1, DF2, DF3, DF4, DF5];
  sum_array = new Array();

  DF_array.forEach((item) => {
    if (!isNaN(item)) {
      sum_array.push(item);
    }
  });

  if (sum_array.length == 0) {
    return 999;
  }

  let sum = sum_array.reduce((a, b) => a + b, 0);

  if (sum >= 2) {
    // Socially Isolated
    return 2;
  } else {
    // Not Socially Isolated
    return 1;
  }
}

function size_of_personal_network(question) {
  // Value Chart per sub question
  // Any range of numbers >= 0

  //Unavailable Question
  if (!question) return 999;

  let DF1 = parseInt(question[0].DF1);
  let DF2 = parseInt(question[0].DF2);
  let DF3 = parseInt(question[0].DF3);
  let DF4 = parseInt(question[0].DF4);
  let DF5 = parseInt(question[0].DF5);

  DF_array = [DF1, DF2, DF3, DF4, DF5];
  sum_array = new Array();

  DF_array.forEach((item) => {
    if (!isNaN(item) && item >= 0) {
      sum_array.push(item);
    }
  });

  let sum = sum_array.reduce((a, b) => a + b, 0);

  return sum;
}

function trusted_people(question) {
  if (!question) return 999;

  let contacts = [];

  const getRelation = (item) => {
    switch (item) {
      case '1':
        return "Friend";
      case '2':
        return "Spouse";
      case '3':
        return "Co-Worker";
      case '4':
        return "Therapist";
      case '5':
        return "Advisor";
      case '6':
        return "Other";
      default:
        return "";
    }
  };

  const getFrequency = (item) => {
    switch (item) {
      case '300':
        return "Daily";
      case '50':
        return "Weekly";
      case '12':
        return "Monthly";
      case '4':
        return "3-4 Times a Year";
      case '1':
        return "Yearly";
      default:
        return "";
    }
  };

  question.forEach((item) => {
    const contact = {
      name: item['Column 1'] ? item['Column 1'] : "",
      living_with: item['Column 2'] ? item['Column 2'] : "",
      relation: item['Column 3'] ? getRelation(item['Column 3']) : "",
      frequency: item['Column 4'] ? getFrequency(item['Column 4']) : "",
    }

    contacts.push(contact);
  });

  return contacts;
}

function frequency_of_social_contacts(
  support_question_A,
  support_question_B,
  support_question_C
) {
  // Value Chart per sub question of Question
  // 999  Total invalid or blank answer
  // 300  Daily
  // 50   Weekly
  // 12   Monthly
  // 4    3-4 Times a Year
  // 1    Yearly
  // 0    Never

  // Value Chart of support_question_B
  // Any range of numbers

  // Value Chart of support_question_C
  // 1 Yes
  // 0 No

  //Unavailable Question
  if (!support_question_A || !support_question_B || !support_question_C)
    return 999;

  let DF1 = parseInt(support_question_A.DF1);
  let DF2 = parseInt(support_question_A.DF2);
  let DF3 = parseInt(support_question_A.DF3);
  let DF4 = parseInt(support_question_A.DF4);
  let DF5 = parseInt(support_question_A.DF5);
  let DF6 = parseInt(support_question_B);

  if (!isNaN(DF6) && DF6 != 999 && DF6 >= 0 && DF6 <= 7) {
    DF6 *= 52;
  } else {
    DF6 = NaN;
  }

  let DF7 = parseInt(support_question_C);

  if (!isNaN(DF6) && DF6 > 0) {
    // If DF6 is a postive result, disregard DF7
    DF7 = NaN;
  }

  DF_array = [DF1, DF2, DF3, DF4, DF5, DF6, DF7];
  sum_array = new Array();

  DF_array.forEach((item) => {
    if (!isNaN(item) && item != 999) {
      sum_array.push(item);
    }
  });

  let sum = sum_array.reduce((a, b) => a + b, 0);

  return sum;
}

function satisfaction_with_social_contact(question) {
  // Value Chart of question
  // 1 Yes
  // 0 No

  if (!question) return 999;

  let DF1 = parseInt(question.DF1);
  let DF2 = parseInt(question.DF2);
  let DF3 = parseInt(question.DF3);

  DF_array = [DF1, DF2, DF3];
  sum_array = new Array();

  DF_array.forEach((item) => {
    if (!isNaN(item)) {
      sum_array.push(item);
    }
  });

  if (sum_array.length == 0) {
    return 999;
  }

  let sum = sum_array.reduce((a, b) => a + b, 0);

  if (sum >= 2) {
    return 2;
  } else if (sum >= 0 && sum < 2) {
    return 1;
  }
}

function quality_of_social_contact(question) {
  // Value Chart of question
  // 1 Yes
  // 0 No


  if (!question) return 0;

  if (question.DF1 === '' || question.DF2 === '' || question.DF3 === '') {
    return 999;
  }

  let DF6 = question.DF6 === 'item1' ? 1 : 0;
  let DF7 = question.DF7 === 'item1' ? 1 : 0;
  let DF8 = question.DF8 === 'item1' ? 1 : 0;

  DF_array = [DF6, DF7, DF8];
  sum_array = new Array();

  DF_array.forEach((item) => {
    if (!isNaN(item)) {
      sum_array.push(item);
    }
  });
  
  if (sum_array.length == 0) {
    return 999;
  }

  let sum = sum_array.reduce((a, b) => a + b, 0);
  return sum;
}

function perceived_social_support(question) {
  // Value Chart of question
  // 1 Often
  // 2 Sometimes
  // 3 Hardly Ever
  // 999 Not applicable

  if (!question) return 999;

  let DF1 = parseInt(question.DF1);
  let DF2 = parseInt(question.DF2);
  let DF3 = parseInt(question.DF3);
  let DF4 = parseInt(question.DF4);
  let DF5 = parseInt(question.DF5);
  let DF6 = parseInt(question.DF6);

  DF_array = [DF1, DF2, DF3, DF4, DF5, DF6];
  sum_array = new Array();

  DF_array.forEach((item) => {
    if (!isNaN(item) && item != 999) {
      sum_array.push(item);
    }
  });

  let average = sum_array.reduce((a, b) => a + b, 0) / sum_array.length;

  if (average <= 0) {
    return 999;
  } else {
    return parseFloat(parseFloat(average).toFixed(4));
  }
}

function perceived_loneliness(question) {
  // Value Chart of question
  // 3 Often
  // 2 Sometimes
  // 1 Hardly Ever
  // 999 Can't Answer

  if (!question) return 999;

  let DF1 = parseInt(question.DF1);
  let DF2 = parseInt(question.DF2);
  let DF3 = parseInt(question.DF3);

  DF_array = [DF1, DF2, DF3];
  sum_array = new Array();

  DF_array.forEach((item) => {
    if (!isNaN(item) && item != 999) {
      sum_array.push(item);
    }
  });

  let average = sum_array.reduce((a, b) => a + b, 0) / sum_array.length;

  if (average <= 0) {
    return 999;
  } else {
    return parseFloat(parseFloat(average).toFixed(2));
  }
}

function asking_for_help(question) {
  // Value Chart of question
  // 1 Often
  // 2 Sometimes
  // 3 Hardly Ever
  // 999 Not applicable

  if (!question) return 999;

  let DF = parseInt(question);

  if (isNaN(question)) return 999;

  if (DF >= 1 && DF <= 3) {
    return DF;
  } else {
    return 999;
  }
}

function progress_achieving_goals(question) {
  // Value Chart of question
  // 1 Often
  // 2 Sometimes
  // 3 Hardly Ever
  // 999 Not applicable

  if (!question) return 999;

  let DF = parseInt(question);

  if (isNaN(question)) return 999;

  if (DF >= 1 && DF <= 3) {
    return DF;
  } else {
    return 999;
  }
}

function health_today(question) {
  // Value Chart of question
  // [0 , 100] range

  if (!question) return 999;

  let DF = parseInt(question);

  if (isNaN(question)) return 999;

  if (DF >= 0 && DF <= 100) {
    return DF;
  } else {
    return 999;
  }
}

function physical_health(question) {
  // Value Chart of question
  // 0 Poor
  // 1 Fair
  // 2 Good
  // 3 Very Good
  // 4 Excellent

  if (!question && !Array.isArray(question)) return 999;

  let DF = parseInt(question[0]);

  if (isNaN(question)) return 999;

  if (DF >= 0 && DF <= 4) {
    return DF;
  } else {
    return 999;
  }
}

function physical_health_string(question) {
  // Value Chart of question
  // 0 Poor
  // 1 Fair
  // 2 Good
  // 3 Very Good
  // 4 Excellent

  if (!question && !Array.isArray(question)) return 999;

  let DF = parseInt(question[0]);

  if (isNaN(question)) {
    return 999;
  }

  if (DF == 0) {
    DF = "Poor";
  } else if (DF == 1) {
    DF = "Fair";
  } else if (DF == 2) {
    DF = "Good";
  } else if (DF == 3) {
    DF = "Very Good";
  } else if (DF == 4) {
    DF = "Excellent";
  } else {
    DF = 999;
  }

  return DF;
}

function mental_health(question) {
  // Value Chart of question
  // 0 Poor
  // 1 Fair
  // 2 Good
  // 3 Very Good
  // 4 Excellent

  if (!question && !Array.isArray(question)) return 999;

  let DF = parseInt(question[0]);

  if (isNaN(question)) return 999;

  if (DF >= 0 && DF <= 4) {
    return DF;
  } else {
    return 999;
  }
}

function mental_health_string(question) {
  // Value Chart of question
  // 0 Poor
  // 1 Fair
  // 2 Good
  // 3 Very Good
  // 4 Excellent

  if (!question && !Array.isArray(question)) return 999;

  let DF = parseInt(question[0]);

  if (isNaN(question)) {
    return 999;
  }

  if (DF == 0) {
    DF = "Poor";
  } else if (DF == 1) {
    DF = "Fair";
  } else if (DF == 2) {
    DF = "Good";
  } else if (DF == 3) {
    DF = "Very Good";
  } else if (DF == 4) {
    DF = "Excellent";
  } else {
    DF = 999;
  }

  return DF;
}

function mobility(question) {
  // Value Chart of question
  // 0 No Problem
  // 1 Slight Problem
  // 2 Moderate Problem
  // 3 Severe Problem
  // 4 Inability

  if (!question) return 999;

  let DF = parseInt(question);

  if (isNaN(question)) return 999;

  if (DF >= 0 && DF <= 4) {
    return DF;
  } else {
    return 999;
  }
}

function personal_care(question) {
  // Value Chart of question
  // 0 No Problem
  // 1 Slight Problem
  // 2 Moderate Problem
  // 3 Severe Problem
  // 4 Inability

  if (!question) return 999;

  let DF = parseInt(question);

  if (isNaN(question)) return 999;

  if (DF >= 0 && DF <= 4) {
    return DF;
  } else {
    return 999;
  }
}

function usual_activities(question) {
  // Value Chart of question
  // 0 No Problem
  // 1 Slight Problem
  // 2 Moderate Problem
  // 3 Severe Problem
  // 4 Inability

  if (!question) return 999;

  let DF = parseInt(question);

  if (isNaN(question)) return 999;

  if (DF >= 0 && DF <= 4) {
    return DF;
  } else {
    return 999;
  }
}

function pain_discomfort(question) {
  // Value Chart of question
  // 0 No Problem
  // 1 Slight Problem
  // 2 Moderate Problem
  // 3 Severe Problem
  // 4 Extreme Problem

  if (!question) return 999;

  let DF = parseInt(question);

  if (isNaN(question)) return 999;

  if (DF >= 0 && DF <= 4) {
    return DF;
  } else {
    return 999;
  }
}

function anxiety_depression(question) {
  // Value Chart of question
  // 0 No Problem
  // 1 Slight Problem
  // 2 Moderate Problem
  // 3 Severe Problem
  // 4 Extreme Problem

  if (!question) return 999;

  let DF = parseInt(question);

  if (isNaN(question)) return 999;

  if (DF >= 0 && DF <= 4) {
    return DF;
  } else {
    return 999;
  }
}

function ed_visit(question) {
  // Value Chart of question
  // [0 -> )  || It is fairly resonable to assume max 999 in one year || already accounts for twice a day

  if (!question || question['Column 2'] === '') return 999;

  let DF = parseInt(question['Column 2'].trim());

  if (isNaN(DF)) return 999;

  if (DF >= 0 && DF < 999) {
    return DF;
  } else {
    return 999;
  }
}

function hospitalization(question) {
  // Value Chart of question
  // [0 -> )  || It is fairly resonable to assume max 999 in one year || already accounts for twice a day

  if (!question || question['Column 2'] === '') return 999;

  let DF = parseInt(question['Column 2'].trim());

  if (isNaN(DF)) return 999;

  if (DF >= 0 && DF < 999) {
    return DF;
  } else {
    return 999;
  }
}

function days_in_hospital(question) {
  // Value Chart of question
  // [0 -> )

  if (question == null || question == undefined) return 999;

  let DF = parseInt(question);

  if (isNaN(DF)) return 999;

  if (DF >= 0 && DF <= 365) {
    return DF;
  } else {
    return 999;
  }
}

function ems(question) {
  // Value Chart of question
  // [0 -> )

  if (question == null || question == undefined) return 999;

  let DF = parseInt(question);

  if (isNaN(DF)) return 999;

  if (DF >= 0 && DF < 999) {
    return DF;
  } else {
    return 999;
  }
}

function urgent_care(question) {
  // Value Chart of question
  // [0 -> )

  if (question == null || question == undefined) return 999;

  let DF = parseInt(question);

  if (isNaN(DF)) return 999;

  if (DF >= 0 && DF < 999) {
    return DF;
  } else {
    return 999;
  }
}

function sought_treatment(question) {
  // Value Chart of question
  // [0 -> )

  if (question == null || question == undefined) return 999;

  let DF = parseInt(question);

  if (isNaN(DF)) return 999;

  if (DF >= 0 && DF < 999) {
    return DF;
  } else {
    return 999;
  }
}

function accident(question) {
  // Value Chart of question
  // [0 -> )

  if (question == null || question == undefined) return 999;

  let DF = parseInt(question);

  if (isNaN(DF)) return 999;

  if (DF >= 0 && DF < 999) {
    return DF;
  } else {
    return 999;
  }
}

function life_satisfaction(question) {
  // Value Chart of question
  // [0 -> 10]

  if (question == null || question == undefined) return 999;

  let DF = parseInt(question);

  if (isNaN(DF)) return 999;

  if (DF >= 0 && DF <= 10) {
    return DF;
  } else {
    return 999;
  }
}

function your_standard_of_living(question) {
  // Value Chart of question
  // [0 -> 10]

  if (question == null || question == undefined) return 999;

  let DF = parseInt(question);

  if (isNaN(DF)) return 999;

  if (DF >= 0 && DF <= 10) {
    return DF;
  } else {
    return 999;
  }
}

function your_health(question) {
  // Value Chart of question
  // [0 -> 10]

  if (question == null || question == undefined) return 999;

  let DF = parseInt(question);

  if (isNaN(DF)) return 999;

  if (DF >= 0 && DF <= 10) {
    return DF;
  } else {
    return 999;
  }
}

function feeling_part_of_the_community(question) {
  // Value Chart of question
  // [0 -> 10]

  if (question == null || question == undefined) return 999;

  let DF = parseInt(question);

  if (isNaN(DF)) return 999;

  if (DF >= 0 && DF <= 10) {
    return DF;
  } else {
    return 999;
  }
}

function what_you_are_achieving_in_life(question) {
  // Value Chart of question
  // [0 -> 10]

  if (question == null || question == undefined) return 999;

  let DF = parseInt(question);

  if (isNaN(DF)) return 999;

  if (DF >= 0 && DF <= 10) {
    return DF;
  } else {
    return 999;
  }
}

function personal_relationships(question) {
  // Value Chart of question
  // [0 -> 10]

  if (question == null || question == undefined) return 999;

  let DF = parseInt(question);

  if (isNaN(DF)) return 999;

  if (DF >= 0 && DF <= 10) {
    return DF;
  } else {
    return 999;
  }
}

function how_safe_you_feel(question) {
  // Value Chart of question
  // [0 -> 10]

  if (question == null || question == undefined) return 999;

  let DF = parseInt(question);

  if (isNaN(DF)) return 999;

  if (DF >= 0 && DF <= 10) {
    return DF;
  } else {
    return 999;
  }
}

function future_security(question) {
  // Value Chart of question
  // [0 -> 10]

  if (question == null || question == undefined) return 999;

  let DF = parseInt(question);

  if (isNaN(DF)) return 999;

  if (DF >= 0 && DF <= 10) {
    return DF;
  } else {
    return 999;
  }
}

function your_spirituality_or_religion(question) {
  // Value Chart of question
  // [0 -> 10]

  if (question == null || question == undefined) return 999;

  let DF = parseInt(question);

  if (isNaN(DF)) return 999;

  if (DF >= 0 && DF <= 10) {
    return DF;
  } else {
    return 999;
  }
}

function pwi_overall_score(
  question_LS_QofL3_SD,
  question_SL_QofL3_SD,
  question_YH_QofL3_SD,
  question_FPC_QofL3_SD,
  question_AL_QofL3_SD,
  question_PR_QofL3_SD,
  question_HSF_QofL3_SD,
  question_FS_QofL3_SD,
  question_SR_QofL3_SD
) {

  let sum = 0;
  let count = 0;

  const questions = [
    question_LS_QofL3_SD,
    question_SL_QofL3_SD,
    question_YH_QofL3_SD,
    question_FPC_QofL3_SD,
    question_AL_QofL3_SD,
    question_PR_QofL3_SD,
    question_HSF_QofL3_SD,
    question_FS_QofL3_SD,
    question_SR_QofL3_SD,
  ];

  for (let i = 0; i < questions.length; i++) {
    if (questions[i] != null && questions[i] !== '') {
      sum += parseInt(questions[i]);
      count++;
    }
  }

  return count > 0 ? Math.round((sum / count)*10) : 999;

}

function activities(question_activities, question_activities_others) {
  if (!question_activities && !question_activities_others) return 999;

  let answer_array = new Array();

  // Checkbox containing Array of Objects

  if (question_activities && Array.isArray(question_activities)) {
    question_activities.forEach((item) => {
      answer_array.push(String(item).trim());
    });
  }

  // Dynamic Matrix containing Array of Objects

  if (question_activities_others && Array.isArray(question_activities_others)) {
    question_activities_others.forEach((item) => {
      if (item.hasOwnProperty("column1")) {
        answer_array.push(String(item.column1).trim());
      }
    });
  }

  if (answer_array.length == 0) {
    return 999;
  } else {
    return answer_array;
  }
}

function meaningful_activities(question) {
  if (!question) return 999;

  let answer_array = new Array();

  // Dynamic Matrix containing Array of Objects

  if (question && Array.isArray(question)) {
    question.forEach((item) => {
      if (item.hasOwnProperty("column1")) {
        // answer_array.push(String(item.column1).toLowerCase().trim());
        answer_array.push(
          item.column1.charAt(0).toUpperCase() +
          item.column1.slice(1).toLowerCase().trim()
        );
      }
    });
  }

  if (answer_array.length == 0) {
    return 999;
  } else {
    return answer_array;
  }
}

function like_to_join(question) {
  if (!question) return 999;

  let answer_array = new Array();

  // Dynamic Matrix containing Array of Objects

  if (question && Array.isArray(question)) {
    question.forEach((item) => {
      if (item.hasOwnProperty("column1")) {
        // answer_array.push(String(item.column1).toLowerCase().trim());
        answer_array.push(
          item.column1.charAt(0).toUpperCase() +
          item.column1.slice(1).toLowerCase().trim()
        );
      }
    });
  }

  if (answer_array.length == 0) {
    return 999;
  } else {
    return answer_array;
  }
}

function challenging_activities(question) {
  if (!question) return 999;

  let answer_array = new Array();

  // Dynamic Matrix containing Array of Objects

  if (question && Array.isArray(question)) {
    question.forEach((item) => {
      if (item.hasOwnProperty("column1")) {
        // answer_array.push(String(item.column1).toLowerCase().trim());
        answer_array.push(
          item.column1.charAt(0).toUpperCase() +
          item.column1.slice(1).toLowerCase().trim()
        );
      }
    });
  }

  if (answer_array.length == 0) {
    return 999;
  }

  return answer_array;
}

function FCP_STRINGS_COMB(question) {
  if (!question) return 999;

  let DF1 = parseInt(question.DF1);
  let DF2 = parseInt(question.DF2);
  let DF3 = parseInt(question.DF3);
  let DF4 = parseInt(question.DF4);
  let DF5 = parseInt(question.DF5);
  let DF6 = parseInt(question.DF6);
  let DF7 = parseInt(question.DF7);
  let DF8 = parseInt(question.DF8);
  let DF9 = parseInt(question.DF9);

  let DF1String = "";
  let DF2String = "";
  let DF3String = "";
  let DF4String = "";
  let DF5String = "";
  let DF6String = "";
  let DF7String = "";
  let DF8String = "";
  let DF9String = "";

  if (!isNaN(DF1) && DF1 != 999 && DF1 == 1) {
    DF1String = "Religious activities";
  }
  if (!isNaN(DF2) && DF2 != 999 && DF2 == 1) {
    DF2String =
      "Recreational activities (e.g. hobbies, games, bingo, gardening, reading club)";
  }
  if (!isNaN(DF3) && DF3 != 999 && DF3 == 1) {
    DF3String =
      "Education or cultural activities (e.g. attending classes, concerts, plays, visiting museums, watching movies)";
  }
  if (!isNaN(DF4) && DF4 != 999 && DF4 == 1) {
    DF4String =
      "Formal or informal neighbourhood, community or professional associations, or service clubs (in person)";
  }
  if (!isNaN(DF5) && DF5 != 999 && DF5 == 1) {
    DF5String = "Volunteer or charity work for a group or organization";
  }
  if (!isNaN(DF6) && DF6 != 999 && DF6 == 1) {
    DF6String =
      "Without being paid, providing informal support for friends, family or neighbours (e.g. cooking, shopping, errands, home help, visits, emotional care)";
  }
  if (!isNaN(DF7) && DF7 != 999 && DF7 == 1) {
    DF7String = "Playing a musical instrument or singing";
  }
  if (!isNaN(DF8) && DF8 != 999 && DF8 == 1) {
    DF8String = "Sports, exercise, or physical activities";
  }
  if (!isNaN(DF9) && DF9 != 999 && DF9 == 1) {
    DF9String =
      "Small, random but purposeful acts of kindness – (e.g. bring a coffee to a friend, pay for a coffee for a stranger, smile and talk to people on the street or in the grocery line, give food or socks to someone who is homeless etc)";
  }

  DF_StringArray = [
    DF1String,
    DF2String,
    DF3String,
    DF4String,
    DF5String,
    DF6String,
    DF7String,
    DF8String,
    DF9String,
  ];
  answer_array = new Array();

  DF_StringArray.forEach((item) => {
    if (typeof item == "string" && item != "") {
      answer_array.push(item);
    }
  });

  if (answer_array.length == 0) {
    return 999;
  } else {
    return answer_array;
  }
}

function ISA_DM_STRINGS(question) {
  if (!question) return 999;

  let DF1 = parseInt(question.DF1);
  let DF2 = parseInt(question.DF2);
  let DF3 = parseInt(question.DF3);
  let DF4 = parseInt(question.DF4);
  let DF5 = parseInt(question.DF5);
  let DF6 = parseInt(question.DF6);
  let DF7 = parseInt(question.DF7);
  let DF8 = parseInt(question.DF8);
  let DF9 = parseInt(question.DF9);
  let DF10 = parseInt(question.DF10);
  let DF11 = parseInt(question.DF11);

  let DF1String = "";
  let DF2String = "";
  let DF3String = "";
  let DF4String = "";
  let DF5String = "";
  let DF6String = "";
  let DF7String = "";
  let DF8String = "";
  let DF9String = "";
  let DF10String = "";
  let DF11String = "";

  if (!isNaN(DF1) && DF1 != 999 && DF1 == 1) {
    DF1String =
      "Church or religious activities such as services, committees or choirs";
  }
  if (!isNaN(DF2) && DF2 != 999 && DF2 == 1) {
    DF2String = "Sports or physical activities with other people";
  }
  if (!isNaN(DF3) && DF3 != 999 && DF3 == 1) {
    DF3String =
      "Other recreational activities involving other people, including hobbies, bingo and other games";
  }
  if (!isNaN(DF4) && DF4 != 999 && DF4 == 1) {
    DF4String =
      "Educational and cultural activities involving other people such as attending courses, concerts or visiting museums";
  }
  if (!isNaN(DF5) && DF5 != 999 && DF5 == 1) {
    DF5String = "Service club or fraternal organization activities";
  }
  if (!isNaN(DF6) && DF6 != 999 && DF6 == 1) {
    DF6String =
      "Neighbourhood, community or professional association activities";
  }
  if (!isNaN(DF7) && DF7 != 999 && DF7 == 1) {
    DF7String = "Volunteer or charity work";
  }
  if (!isNaN(DF8) && DF8 != 999 && DF8 == 1) {
    DF8String =
      "Seeing family or friends (not including people in your household)";
  }
  if (!isNaN(DF9) && DF9 != 999 && DF9 == 1) {
    DF9String =
      "Using the computer or internet to connect with other people socially";
  }
  if (!isNaN(DF10) && DF10 != 999 && DF10 == 1) {
    DF10String =
      "Providing informal support for friends, family or neighbours (e.g. cooking, shopping, errands, home help, visits, emotional care) without being paid";
  }
  if (!isNaN(DF11) && DF11 != 999 && DF11 == 1) {
    DF11String = "Musical activites (e.g. playing, singing, listening)";
  }

  DF_StringArray = [
    DF1String,
    DF2String,
    DF3String,
    DF4String,
    DF5String,
    DF6String,
    DF7String,
    DF8String,
    DF9String,
    DF10String,
    DF11String,
  ];
  answer_array = new Array();

  DF_StringArray.forEach((item) => {
    if (typeof item == "string" && item != "") {
      answer_array.push(item);
    }
  });

  if (answer_array.length == 0) {
    return 999;
  } else {
    return answer_array;
  }
}

function household_size(question) {

  if (!question) return 999;

  let DF = parseInt(question);

  if (isNaN(DF)) return 999;

  if (DF >= 0) {
    return DF;
  } else {
    return 999;
  }
}

function total_children(question) {
  if (!question) return 999;

  let DF = parseInt(question);

  if (isNaN(DF)) return 999;

  if (DF >= 0) {
    return DF;
  } else {
    return 999;
  }
}

function total_relatives(question) {
  if (!question) return 999;

  let DF = parseInt(question);

  if (isNaN(DF)) return 999;

  if (DF >= 0) {
    return DF;
  } else {
    return 999;
  }
}

function total_close_friends(question) {
  if (!question) return 999;

  let DF = parseInt(question);

  if (isNaN(DF)) return 999;

  if (DF >= 0) {
    return DF;
  } else {
    return 999;
  }
}

function total_well_known_neighbours(question) {
  if (!question) return 999;

  let DF = parseInt(question);

  if (isNaN(DF)) return 999;

  if (DF >= 0) {
    return DF;
  } else {
    return 999;
  }
}

function frequency_of_contact_family(question) {
  // Value Chart per sub question of Question
  // 999  Total invalid or blank answer
  // 300  Daily
  // 50   Weekly
  // 12   Monthly
  // 4    3-4 Times a Year
  // 1    Yearly
  // 0    Never

  if (!question) return 999;

  let DF = parseInt(question.DF1);

  if (isNaN(DF)) return 999;

  if (DF == 300) {
    DF = "Daily";
  } else if (DF == 50) {
    DF = "Weekly";
  } else if (DF == 12) {
    DF = "Monthly";
  } else if (DF == 4) {
    DF = "3-4 Times a Year";
  } else if (DF == 1) {
    DF = "Yearly";
  } else if (DF == 0) {
    DF = "Never";
  } else {
    DF = 999;
  }

  return DF;
}

function frequency_of_contact_friends(question) {
  // Value Chart per sub question of Question
  // 999  Total invalid or blank answer
  // 300  Daily
  // 50   Weekly
  // 12   Monthly
  // 4    3-4 Times a Year
  // 1    Yearly
  // 0    Never

  if (!question) return 999;

  let DF = parseInt(question.DF2);

  if (isNaN(DF)) return 999;

  if (DF == 300) {
    DF = "Daily";
  } else if (DF == 50) {
    DF = "Weekly";
  } else if (DF == 12) {
    DF = "Monthly";
  } else if (DF == 4) {
    DF = "3-4 Times a Year";
  } else if (DF == 1) {
    DF = "Yearly";
  } else if (DF == 0) {
    DF = "Never";
  } else {
    DF = 999;
  }

  return DF;
}

function frequency_of_contact_neighbours(question) {
  // Value Chart per sub question of Question
  // 999  Total invalid or blank answer
  // 300  Daily
  // 50   Weekly
  // 12   Monthly
  // 4    3-4 Times a Year
  // 1    Yearly
  // 0    Never

  if (!question) return 999;

  let DF = parseInt(question.DF3);

  if (isNaN(DF)) return 999;

  if (DF == 300) {
    DF = "Daily";
  } else if (DF == 50) {
    DF = "Weekly";
  } else if (DF == 12) {
    DF = "Monthly";
  } else if (DF == 4) {
    DF = "3-4 Times a Year";
  } else if (DF == 1) {
    DF = "Yearly";
  } else if (DF == 0) {
    DF = "Never";
  } else {
    DF = 999;
  }

  return DF;
}

function frequency_of_participation_religion(question) {
  // Value Chart per sub question of Question
  // 999  Total invalid or blank answer
  // 300  Daily
  // 50   Weekly
  // 12   Monthly
  // 4    3-4 Times a Year
  // 1    Yearly
  // 0    Never

  if (!question) return 999;

  let DF = parseInt(question.DF1);

  if (isNaN(DF)) return 999;

  if (DF == 5) {
    DF = "Daily";
  } else if (DF == 4) {
    DF = "Weekly";
  } else if (DF == 3) {
    DF = "Monthly";
  } else if (DF == 2) {
    DF = "3-4 Times a Year";
  } else if (DF == 1) {
    DF = "Yearly";
  } else if (DF == 0) {
    DF = "Never";
  } else {
    DF = 999;
  }

  return DF;
}

function frequency_of_participation_recreation(question) {
  // Value Chart per sub question of Question
  // 999  Total invalid or blank answer
  // 300  Daily
  // 50   Weekly
  // 12   Monthly
  // 4    3-4 Times a Year
  // 1    Yearly
  // 0    Never

  if (!question) return 999;

  let DF = parseInt(question.DF2);

  if (isNaN(DF)) return 999;

  if (DF == 5) {
    DF = "Daily";
  } else if (DF == 4) {
    DF = "Weekly";
  } else if (DF == 3) {
    DF = "Monthly";
  } else if (DF == 2) {
    DF = "3-4 Times a Year";
  } else if (DF == 1) {
    DF = "Yearly";
  } else if (DF == 0) {
    DF = "Never";
  } else {
    DF = 999;
  }

  return DF;
}

function frequency_of_participation_education(question) {
  // Value Chart per sub question of Question
  // 999  Total invalid or blank answer
  // 300  Daily
  // 50   Weekly
  // 12   Monthly
  // 4    3-4 Times a Year
  // 1    Yearly
  // 0    Never

  if (!question) return 999;

  let DF = parseInt(question.DF3);

  if (isNaN(DF)) return 999;

  if (DF == 5) {
    DF = "Daily";
  } else if (DF == 4) {
    DF = "Weekly";
  } else if (DF == 3) {
    DF = "Monthly";
  } else if (DF == 2) {
    DF = "3-4 Times a Year";
  } else if (DF == 1) {
    DF = "Yearly";
  } else if (DF == 0) {
    DF = "Never";
  } else {
    DF = 999;
  }

  return DF;
}

function frequency_of_participation_associations(question) {
  // Value Chart per sub question of Question
  // 999  Total invalid or blank answer
  // 300  Daily
  // 50   Weekly
  // 12   Monthly
  // 4    3-4 Times a Year
  // 1    Yearly
  // 0    Never

  if (!question) return 999;

  let DF = parseInt(question.DF4);

  if (isNaN(DF)) return 999;

  if (DF == 5) {
    DF = "Daily";
  } else if (DF == 4) {
    DF = "Weekly";
  } else if (DF == 3) {
    DF = "Monthly";
  } else if (DF == 2) {
    DF = "3-4 Times a Year";
  } else if (DF == 1) {
    DF = "Yearly";
  } else if (DF == 0) {
    DF = "Never";
  } else {
    DF = 999;
  }

  return DF;
}

function frequency_of_participation_volunteering(question) {
  // Value Chart per sub question of Question
  // 999  Total invalid or blank answer
  // 300  Daily
  // 50   Weekly
  // 12   Monthly
  // 4    3-4 Times a Year
  // 1    Yearly
  // 0    Never

  if (!question) return 999;

  let DF = parseInt(question.DF7);

  if (isNaN(DF)) return 999;

  if (DF == 300) {
    DF = "Daily";
  } else if (DF == 50) {
    DF = "Weekly";
  } else if (DF == 12) {
    DF = "Monthly";
  } else if (DF == 4) {
    DF = "3-4 Times a Year";
  } else if (DF == 1) {
    DF = "Yearly";
  } else if (DF == 0) {
    DF = "Never";
  } else {
    DF = 999;
  }

  return DF;
}

function frequency_of_participation_informal_help(question) {
  // Value Chart per sub question of Question
  // 999  Total invalid or blank answer
  // 300  Daily
  // 50   Weekly
  // 12   Monthly
  // 4    3-4 Times a Year
  // 1    Yearly
  // 0    Never

  if (!question) return 999;

  let DF = parseInt(question.DF10);

  if (isNaN(DF)) return 999;

  if (DF == 300) {
    DF = "Daily";
  } else if (DF == 50) {
    DF = "Weekly";
  } else if (DF == 12) {
    DF = "Monthly";
  } else if (DF == 4) {
    DF = "3-4 Times a Year";
  } else if (DF == 1) {
    DF = "Yearly";
  } else if (DF == 0) {
    DF = "Never";
  } else {
    DF = 999;
  }

  return DF;
}

function frequency_of_participation_music(question) {
  // Value Chart per sub question of Question
  // 999  Total invalid or blank answer
  // 300  Daily
  // 50   Weekly
  // 12   Monthly
  // 4    3-4 Times a Year
  // 1    Yearly
  // 0    Never

  if (!question) return 999;

  let DF = parseInt(question.DF7);

  if (isNaN(DF)) return 999;

  if (DF == 5) {
    DF = "Daily";
  } else if (DF == 4) {
    DF = "Weekly";
  } else if (DF == 3) {
    DF = "Monthly";
  } else if (DF == 2) {
    DF = "3-4 Times a Year";
  } else if (DF == 1) {
    DF = "Yearly";
  } else if (DF == 0) {
    DF = "Never";
  } else {
    DF = 999;
  }

  return DF;
}

function frequency_of_participation_sports(question) {
  // Value Chart per sub question of Question
  // 999  Total invalid or blank answer
  // 300  Daily
  // 50   Weekly
  // 12   Monthly
  // 4    3-4 Times a Year
  // 1    Yearly
  // 0    Never

  if (!question) return 999;

  let DF = parseInt(question.DF8);

  if (isNaN(DF)) return 999;

  if (DF == 5) {
    DF = "Daily";
  } else if (DF == 4) {
    DF = "Weekly";
  } else if (DF == 3) {
    DF = "Monthly";
  } else if (DF == 2) {
    DF = "3-4 Times a Year";
  } else if (DF == 1) {
    DF = "Yearly";
  } else if (DF == 0) {
    DF = "Never";
  } else {
    DF = 999;
  }

  return DF;
}

// other activities
function frequency_of_participation_other_activities(question) {
  // Value Chart per sub question of Question
  // 999  Total invalid or blank answer
  // 300  Daily
  // 50   Weekly
  // 12   Monthly
  // 4    3-4 Times a Year
  // 1    Yearly
  // 0    Never

  if (!question) return 999;

  let DF = parseInt(question.DF10);

  if (isNaN(DF)) return 999;

  if (DF == 5) {
    DF = "Daily";
  } else if (DF == 4) {
    DF = "Weekly";
  } else if (DF == 3) {
    DF = "Monthly";
  } else if (DF == 2) {
    DF = "3-4 Times a Year";
  } else if (DF == 1) {
    DF = "Yearly";
  } else if (DF == 0) {
    DF = "Never";
  } else {
    DF = 999;
  }

  return DF;
}

function frequency_of_participation_computer(question) {
  // Value Chart per sub question of Question
  // 999  Total invalid or blank answer
  // 300  Daily
  // 50   Weekly
  // 12   Monthly
  // 4    3-4 Times a Year
  // 1    Yearly
  // 0    Never

  if (!question) return 999;

  let DF = parseInt(question.DF9);

  if (isNaN(DF)) return 999;

  if (DF == 300) {
    DF = "Daily";
  } else if (DF == 50) {
    DF = "Weekly";
  } else if (DF == 12) {
    DF = "Monthly";
  } else if (DF == 4) {
    DF = "3-4 Times a Year";
  } else if (DF == 1) {
    DF = "Yearly";
  } else if (DF == 0) {
    DF = "Never";
  } else {
    DF = 999;
  }

  return DF;
}

function problem_walking(question) {
  // Value Chart of question
  // 0 No Problem
  // 1 Slight Problem
  // 2 Moderate Problem
  // 3 Severe Problem
  // 4 Inability

  if (!question) return 999;

  let DF = parseInt(question);

  if (isNaN(DF)) return 999;

  // if (DF == 0) {
  //   DF = "Inability";
  // } else if (DF == 1) {
  //   DF = "Severe Problem";
  // } else if (DF == 2) {
  //   DF = "Moderate Problem";
  // } else if (DF == 3) {
  //   DF = "Slight Problem";
  // } else if (DF == 4) {
  //   DF = "No Problem";
  // } else {
  //   DF = 999;
  // }

  return DF;
}

function problem_washing_dressing(question) {
  // Value Chart of question
  // 0 No Problem
  // 1 Slight Problem
  // 2 Moderate Problem
  // 3 Severe Problem
  // 4 Inability

  if (!question) return 999;

  let DF = parseInt(question);

  if (isNaN(DF)) return 999;

  // if (DF == 0) {
  //   DF = "Inability";
  // } else if (DF == 1) {
  //   DF = "Severe Problem";
  // } else if (DF == 2) {
  //   DF = "Moderate Problem";
  // } else if (DF == 3) {
  //   DF = "Slight Problem";
  // } else if (DF == 4) {
  //   DF = "No Problem";
  // } else {
  //   DF = 999;
  // }

  return DF;
}

function problem_usual_activities(question) {
  // Value Chart of question
  // 0 No Problem
  // 1 Slight Problem
  // 2 Moderate Problem
  // 3 Severe Problem
  // 4 Inability

  if (!question) return 999;

  let DF = parseInt(question);

  if (isNaN(DF)) return 999;

  // if (DF == 0) {
  //   DF = "Inability";
  // } else if (DF == 1) {
  //   DF = "Severe Problem";
  // } else if (DF == 2) {
  //   DF = "Moderate Problem";
  // } else if (DF == 3) {
  //   DF = "Slight Problem";
  // } else if (DF == 4) {
  //   DF = "No Problem";
  // } else {
  //   DF = 999;
  // }

  return DF;
}

function problem_pain_discomfort(question) {
  // Value Chart of question
  // 0 No Problem
  // 1 Slight Problem
  // 2 Moderate Problem
  // 3 Severe Problem
  // 4 Inability

  if (!question) return 999;

  let DF = parseInt(question);

  if (isNaN(DF)) return 999;

  // if (DF == 0) {
  //   DF = "Inability";
  // } else if (DF == 1) {
  //   DF = "Severe Problem";
  // } else if (DF == 2) {
  //   DF = "Moderate Problem";
  // } else if (DF == 3) {
  //   DF = "Slight Problem";
  // } else if (DF == 4) {
  //   DF = "No Problem";
  // } else {
  //   DF = 999;
  // }

  return DF;
}

function problem_anxious_depressed(question) {
  // Value Chart of question
  // 0 No Problem
  // 1 Slight Problem
  // 2 Moderate Problem
  // 3 Severe Problem
  // 4 Inability

  if (!question) return 999;

  let DF = parseInt(question);

  if (isNaN(DF)) return 999;

  // if (DF == 0) {
  //   DF = "Inability";
  // } else if (DF == 1) {
  //   DF = "Severe Problem";
  // } else if (DF == 2) {
  //   DF = "Moderate Problem";
  // } else if (DF == 3) {
  //   DF = "Slight Problem";
  // } else if (DF == 4) {
  //   DF = "No Problem";
  // } else {
  //   DF = 999;
  // }

  return DF;
}

function support_wellness_program(question) {
  // Value Chart per sub question of Question
  // 999  Total invalid or blank answer
  // 5  Daily
  // 4   Weekly
  // 3   Monthly
  // 2    3-4 Times a Year
  // 1    Yearly
  // 0    Never

  if (!question) return 999;

  let DF = parseInt(question.E);

  if (isNaN(DF)) return 999;

  if (DF == 5) {
    DF = "Daily";
  } else if (DF == 4) {
    DF = "Weekly";
  } else if (DF == 3) {
    DF = "Monthly";
  } else if (DF == 2) {
    DF = "3-4 Times a Year";
  } else if (DF == 1) {
    DF = "Yearly";
  } else if (DF == 0) {
    DF = "Never";
  } else {
    DF = 999;
  }

  return DF;
}

function support_healthcare(question) {
  // Value Chart per sub question of Question
  // 999  Total invalid or blank answer
  // 5  Daily
  // 4   Weekly
  // 3   Monthly
  // 2    3-4 Times a Year
  // 1    Yearly
  // 0    Never

  if (!question) return 999;

  let DF = parseInt(question.A);

  if (isNaN(DF)) return 999;

  if (DF == 5) {
    DF = "Daily";
  } else if (DF == 4) {
    DF = "Weekly";
  } else if (DF == 3) {
    DF = "Monthly";
  } else if (DF == 2) {
    DF = "3-4 Times a Year";
  } else if (DF == 1) {
    DF = "Yearly";
  } else if (DF == 0) {
    DF = "Never";
  } else {
    DF = 999;
  }

  return DF;
}

function support_home_healthcare(question) {
  // Value Chart per sub question of Question
  // 999  Total invalid or blank answer
  // 5  Daily
  // 4   Weekly
  // 3   Monthly
  // 2    3-4 Times a Year
  // 1    Yearly
  // 0    Never

  if (!question) return 999;

  let DF = parseInt(question.B);

  if (isNaN(DF)) return 999;

  if (DF == 5) {
    DF = "Daily";
  } else if (DF == 4) {
    DF = "Weekly";
  } else if (DF == 3) {
    DF = "Monthly";
  } else if (DF == 2) {
    DF = "3-4 Times a Year";
  } else if (DF == 1) {
    DF = "Yearly";
  } else if (DF == 0) {
    DF = "Never";
  } else {
    DF = 999;
  }

  return DF;
}

function support_private_healthcare(question) {
  // Value Chart per sub question of Question
  // 999  Total invalid or blank answer
  // 5  Daily
  // 4   Weekly
  // 3   Monthly
  // 2    3-4 Times a Year
  // 1    Yearly
  // 0    Never

  if (!question) return 999;

  let DF = parseInt(question.C);

  if (isNaN(DF)) return 999;

  if (DF == 5) {
    DF = "Daily";
  } else if (DF == 4) {
    DF = "Weekly";
  } else if (DF == 3) {
    DF = "Monthly";
  } else if (DF == 2) {
    DF = "3-4 Times a Year";
  } else if (DF == 1) {
    DF = "Yearly";
  } else if (DF == 0) {
    DF = "Never";
  } else {
    DF = 999;
  }

  return DF;
}

function support_informal(question) {
  // Value Chart per sub question of Question
  // 999  Total invalid or blank answer
  // 5  Daily
  // 4   Weekly
  // 3   Monthly
  // 2    3-4 Times a Year
  // 1    Yearly
  // 0    Never

  if (!question) return 999;

  let DF = parseInt(question.D);

  if (isNaN(DF)) return 999;

  if (DF == 5) {
    DF = "Daily";
  } else if (DF == 4) {
    DF = "Weekly";
  } else if (DF == 3) {
    DF = "Monthly";
  } else if (DF == 2) {
    DF = "3-4 Times a Year";
  } else if (DF == 1) {
    DF = "Yearly";
  } else if (DF == 0) {
    DF = "Never";
  } else {
    DF = 999;
  }

  return DF;
}

function goals(question) {
  if (!question && !Array.isArray(question)) return 999;

  let answer_array = new Array();

  question.forEach((item) => {
    if (item.hasOwnProperty("goal") && item.hasOwnProperty("first_step")) {
      // answer_array.push(String(item.goal).toLowerCase().trim());
      answer_array.push(item.goal.charAt(0).toUpperCase() + item.goal.slice(1).toLowerCase().trim());
    }
  });

  if (answer_array.length == 0) {
    return 999;
  } else {
    return answer_array;
  }
}

function access_to_family_doctor(question) {
  if (!question) return 999;


  if (question == 'item1') {
    return "Yes";
  } else if (question == 'item2') {
    return "No";
  } else {
    return 999;
  }
}

function frequency_get_together_family(question) {
  // Value Chart per sub question of Question
  // 999  Total invalid or blank answer
  // 300  Daily
  // 50   Weekly
  // 12   Monthly
  // 4    3-4 Times a Year
  // 1    Yearly
  // 0    Never

  if (!question) return 999;

  let DF = parseInt(question.DF1);

  if (isNaN(DF)) return 999;

  if (DF == 300) {
    DF = "Daily";
  } else if (DF == 50) {
    DF = "Weekly";
  } else if (DF == 12) {
    DF = "Monthly";
  } else if (DF == 4) {
    DF = "3-4 Times a Year";
  } else if (DF == 1) {
    DF = "Yearly";
  } else if (DF == 0) {
    DF = "Never";
  } else {
    DF = 999;
  }

  return DF;
}

function frequency_get_together_friends(question) {
  // Value Chart per sub question of Question
  // 999  Total invalid or blank answer
  // 300  Daily
  // 50   Weekly
  // 12   Monthly
  // 4    3-4 Times a Year
  // 1    Yearly
  // 0    Never

  if (!question) return 999;

  let DF = parseInt(question.DF2);

  if (isNaN(DF)) return 999;

  if (DF == 300) {
    DF = "Daily";
  } else if (DF == 50) {
    DF = "Weekly";
  } else if (DF == 12) {
    DF = "Monthly";
  } else if (DF == 4) {
    DF = "3-4 Times a Year";
  } else if (DF == 1) {
    DF = "Yearly";
  } else if (DF == 0) {
    DF = "Never";
  } else {
    DF = 999;
  }

  return DF;
}

function frequency_get_together_neighbours(question) {
  // Value Chart per sub question of Question
  // 999  Total invalid or blank answer
  // 300  Daily
  // 50   Weekly
  // 12   Monthly
  // 4    3-4 Times a Year
  // 1    Yearly
  // 0    Never

  if (!question) return 999;

  let DF = parseInt(question.DF3);

  if (isNaN(DF)) return 999;

  if (DF == 300) {
    DF = "Daily";
  } else if (DF == 50) {
    DF = "Weekly";
  } else if (DF == 12) {
    DF = "Monthly";
  } else if (DF == 4) {
    DF = "3-4 Times a Year";
  } else if (DF == 1) {
    DF = "Yearly";
  } else if (DF == 0) {
    DF = "Never";
  } else {
    DF = 999;
  }

  return DF;
}

function frequency_of_social_contacts_phone(question) {
   // Value Chart per sub question of Question
  // 999  Total invalid or blank answer
  // 300  Daily
  // 50   Weekly
  // 12   Monthly
  // 4    3-4 Times a Year
  // 1    Yearly
  // 0    Never

  if (!question) return 999;

  let DF = parseInt(question.DF4);

  if (isNaN(DF)) return 999;

  if (DF == 300) {
    DF = "Daily";
  } else if (DF == 50) {
    DF = "Weekly";
  } else if (DF == 12) {
    DF = "Monthly";
  } else if (DF == 4) {
    DF = "3-4 Times a Year";
  } else if (DF == 1) {
    DF = "Yearly";
  } else if (DF == 0) {
    DF = "Never";
  } else {
    DF = 999;
  }

  return DF;
}

function frequency_of_social_contacts_computer(question) {
   // Value Chart per sub question of Question
  // 999  Total invalid or blank answer
  // 300  Daily
  // 50   Weekly
  // 12   Monthly
  // 4    3-4 Times a Year
  // 1    Yearly
  // 0    Never

  if (!question) return 999;

  let DF = parseInt(question.DF5);

  if (isNaN(DF)) return 999;

  if (DF == 300) {
    DF = "Daily";
  } else if (DF == 50) {
    DF = "Weekly";
  } else if (DF == 12) {
    DF = "Monthly";
  } else if (DF == 4) {
    DF = "3-4 Times a Year";
  } else if (DF == 1) {
    DF = "Yearly";
  } else if (DF == 0) {
    DF = "Never";
  } else {
    DF = 999;
  }

  return DF;
}

function perceived_loneliness_sometimes_count(question) {
  // Value Chart
  // 1 = Hardly ever
  // 2 = Sometimes
  // 3 = Often

  if (!question) return 999;

  let sum = 0;

  for (const [key, value] of Object.entries(question)) {
    let number = parseInt(value);

    if (!isNaN(number) && number == 2) {
      sum += 1;
    }
  }

  return sum;
}

function perceived_loneliness_often_count(question) {
  // Value Chart
  // 1 = Hardly ever
  // 2 = Sometimes
  // 3 = Often

  if (!question) return 999;

  let sum = 0;

  for (const [key, value] of Object.entries(question)) {
    let number = parseInt(value);

    if (!isNaN(number) && number == 3) {
      sum += 1;
    }
  }

  return sum;
}

function household2_size(question) {
  // Value Chart of question
  // 0 Lives alone
  // 1 1 person
  // 2 2 people
  // 3 3 people
  // 4 4 or more people

  if (!question && !Array.isArray(question)) return 999;

  let DF = parseInt(question[0]);

  if (isNaN(question)) return 999;

  if (DF == 0) {
    DF = "Lives alone";
  } else if (DF == 1) {
    DF = "1 person";
  } else if (DF == 2) {
    DF = "2 people";
  } else if (DF == 3) {
    DF = "3 people";
  } else if (DF == 4) {
    DF = "4 or more people";
  } else {
    DF = 999;
  }

  return DF;
}

function community_activity_participate(question) {
  // Value Chart of question
  // 0 Yes
  // 1 No

  if (!question && !Array.isArray(question)) return 999;

  let DF = parseInt(question[0]);

  if (isNaN(question)) return 999;

  if (DF == 0) {
    DF = "No";
  } else if (DF == 1) {
    DF = "Yes";
  } else {
    DF = 999;
  }

  return DF;
}

function life_satisfaction2(question) {
  // Value Chart of question
  // satisfaction ranges from 1 to 10

  if (!question && !Array.isArray(question)) return 999;

  let DF = parseInt(question[0]);

  if (isNaN(question)) return 999;

  if (DF > 0 && DF <= 10) {
    return DF;
  } else {
    return 999;
  }
  // if(DF == 10)
  // {
  //     DF = "1";
  // }
  // else if(DF == 20){
  //     DF = "2";
  // }
  // else if(DF == 30){
  //     DF = "3";
  // }
  // else if(DF == 40){
  //     DF = "4";
  // }
  // else if(DF == 50){
  //     DF = "5";
  // }
  // else if(DF == 60){
  //     DF = "6";
  // }
  // else if(DF == 70){
  //     DF = "7";
  // }
  // else if(DF == 80){
  //     DF = "8";
  // }
  // else if(DF == 90){
  //     DF = "9";
  // }
  // else if(DF == 100){
  //     DF = "10";
  // }
  // else
  // {
  //     DF = 999;
  // }

  // return DF;
}

function local_community_belonging(question) {
  // Value Chart of question
  // 3 very strong
  // 2 somewhat strong
  // 1 somewhat weak
  // 0 very weak

  if (!question && !Array.isArray(question)) return 999;

  let DF = parseInt(question[0]);

  if (isNaN(question)) return 999;

  if (DF == 0) {
    DF = "Very weak";
  } else if (DF == 1) {
    DF = "Somewhat weak";
  } else if (DF == 2) {
    DF = "Somewhat strong";
  } else if (DF == 3) {
    DF = "Very strong";
  } else {
    DF = 999;
  }

  return DF;
}

function lack_companionship(question) {
  // Value Chart of question
  // 0 Hardly Ever
  // 1 Sometimes
  // 2 Often

  if (!question && !Array.isArray(question)) return 999;

  let DF = parseInt(question[0]);

  if (isNaN(question)) return 999;

  if (DF == 2) {
    DF = "Often";
  } else if (DF == 1) {
    DF = "Sometimes";
  } else if (DF == 0) {
    DF = "Hardly Ever";
  } else {
    DF = 999;
  }

  return DF;
}

function feel_leftout(question) {
  // Value Chart of question
  // 0 Hardly Ever
  // 1 Sometimes
  // 2 Often

  if (!question && !Array.isArray(question)) return 999;

  let DF = parseInt(question[0]);

  if (isNaN(question)) return 999;

  if (DF == 2) {
    DF = "Often";
  } else if (DF == 1) {
    DF = "Sometimes";
  } else if (DF == 0) {
    DF = "Hardly Ever";
  } else {
    DF = 999;
  }

  return DF;
}

function feel_isolated(question) {
  // Value Chart of question
  // 0 Hardly Ever
  // 1 Sometimes
  // 2 Often

  if (!question && !Array.isArray(question)) return 999;

  let DF = parseInt(question[0]);

  if (isNaN(question)) return 999;

  if (DF == 2) {
    DF = "Often";
  } else if (DF == 1) {
    DF = "Sometimes";
  } else if (DF == 0) {
    DF = "Hardly Ever";
  } else {
    DF = 999;
  }

  return DF;
}

function con_que(question) {
  // Value Chart of question
  // 0 Yes
  // 1 No

  if (!question && !Array.isArray(question)) return 999;

  let DF = parseInt(question[0]);

  if (isNaN(question)) return 999;

  if (DF == 0) {
    DF = "No";
  } else if (DF == 1) {
    DF = "Yes";
  } else {
    DF = 999;
  }

  return DF;
}
