/*
==============================================
COMMUNITY CONNECTIONS AND QUALITY OF LIFE - SHORT
----------------------------------------------
Methods:
- Personalized Neighbours
==============================================
*/

const mongoose = require("mongoose");
const fs = require("fs");
const NodeRSA = require("node-rsa");

const User = require("../models/user");
const Collection = require("../models/collection");
const MemberCollection = require("../models/memberCollection");

const config = require("../config/config");
const { reports } = require("../config/logging");
const log = reports;

const userFunctions = require("../utils/userFunctions");
const neighbourFunctions = require("../utils/neighboursFunctions");
const { error } = require("joi/lib/types/lazy");
const { errors } = require("joi/lib/language");
const memberCollection = require("../models/memberCollection");

// ====================================================
// Encryption routes for keys and extracting keys
// ====================================================

let key_private = new NodeRSA();
let key_public = new NodeRSA();

var public = fs.readFileSync("./Keys/public.pem", "utf8");
var private = fs.readFileSync("./Keys/private.pem", "utf8");

key_private.importKey(private);
key_public.importKey(public);

// ======================================================

exports.standardAccountId = async (req, res) => {
  logUser.info("Incoming read for user with id: " + req.params.userId);

  User.findById(req.params.userId)
    .exec()
    .then((user) => {
      if (user) {
        const standard_id = userFunctions.getStandardAccountId(
          user.role,
          user.facilityId,
          user.sequence_id
        );

        if (!standard_id) {
          return res.status(404).json({
            message: "Error generating standard Id.",
          });
        }

        return res.status(200).json({
          standard_id: standard_id,
          request: {
            type: "GET",
            url:
              config.server.protocol +
              "://" +
              config.server.hostname +
              ":" +
              config.server.port +
              config.server.extension +
              "/user/" +
              user._id,
          },
        });
      } else {
        return res.status(404).json({
          message: "User Information not found.",
        });
      }
    })
    .catch((error) => {
      logUser.error(error.message);

      return res.status(500).json({
        message: error.message,
      });
    });
};

exports.Neighbour = async (req, res) => {
  log.info(
    "Incoming request for Neighbour's Report on the Collections of user with id: " +
    req.params.userId
  );

  // member: req.params.userId
  let flag1 = 1;

  // get user input collection (for example neighbours or screen)
  // if user input == neighbour => Neighbours
  // else social health
  Collection.find({ name: "Community Connections" })
    .then((verifiedCollection) => {
      if (verifiedCollection.length == 0) {
        flag1 = 0;
      }
      if (flag1 == 1) {
        MemberCollection.find({
          collectionTemplate: verifiedCollection,
          member: req.params.userId,
        })
          .sort({ createdAt: 1 })
          .populate({
            path: "member",
            options: { limit: 1 },
            select: "-password",
            populate: { path: "info.currentAddress", model: "Address" },
          })
          .populate({
            path: "memberSurveyList",
            populate: { path: "surveyTemplate", model: "Survey" },
          })
          .exec()
          .then((memberCollectionList) => {
            if (memberCollectionList) {
              // START - Account info step ==================================================

              let account_id = userFunctions.getStandardAccountId(
                memberCollectionList[0].member.role || "",
                memberCollectionList[0].member.facilityId || "",
                memberCollectionList[0].member.sequence_id || ""
              );

              let account_involvement = neighbourFunctions.formatInvolvement(
                memberCollectionList[0].member.role || ""
              );

              let collection_last_updated = new Date(memberCollectionList[0].updatedAt).toISOString().split('T')[0];

              let account_dob = neighbourFunctions.formatDate(memberCollectionList[0].member.info.dateOfBirth || "");

              let account_postalCode = neighbourFunctions.formatPostalCode(memberCollectionList[0].member?.info?.currentAddress?.code || '');

              let account_name = memberCollectionList[0].member.info.name || "";
              account_name =
                account_name.length >= 60
                  ? key_private.decrypt(account_name, "utf8")
                  : account_name;

              let account_gender = neighbourFunctions.formatGender(
                memberCollectionList[0].member.info.gender || ""
              );


              // let account_dob = neighbourFunctions.formatDate(
              //   memberCollectionList[0].member.info.dateOfBirth || ""
              // );

              // let account_postalCode = neighbourFunctions.formatPostalCode(
              //   memberCollectionList[0].member.info.currentAddress.code || ""
              // );

              let account_language = neighbourFunctions.formatLanguage(
                memberCollectionList[0].member.info.language || ""
              );

              // END - Account info step ==================================================

              // START - Collection : Survey info step ==================================================

              let collection_ids =
                neighbourFunctions.collectionIds(memberCollectionList);

              let collection_dates =
                neighbourFunctions.collectionDates(memberCollectionList);

              let neighboursChapter_ids =
                neighbourFunctions.neighbourChapterIds(memberCollectionList);

              let neighboursChapter_dates =
                neighbourFunctions.neighbourChapterDates(memberCollectionList);

              // END - Collection : Survey Info Step ==================================================

              // START - Neighbour Report info step ==================================================

              // FREQUENCY COMMUNITY PARTICIPATION
              let FCP_INT_COMB = new Array();

              // INFREQUENT PARTICIPATION IN SOCIAL ACTIVITIES
              let ISA_INT = new Array();

              // SOCIAL ISOLATION INDEX
              let SII_QofL1 = new Array();

              // SIZE OF PERSONAL NETWORK
              let PN_QofL1_COMB = new Array();

              // FREQUENCY OF SOCIAL CONTACTS
              let FSC_QofL1_COMB = new Array();

              // SATISFACTION WITH SOCIAL CONTACT
              let SSC_QofL1_COMB = new Array();

              // QUALITY OF SOCIAL CONTACT
              let QSC_QofL1_COMB = new Array();

              // PERCEIVED SOCIAL SUPPORT
              let PSS_QofL1_COMB = new Array();

              // PERCEIVED LONELINESS
              let PL_QofL1_COMB = new Array();

              // ASKING FOR HELP
              let AFH_QofL1_SD = new Array();

              // PROGRESS ACHIEVING GOALS
              let PAG_QofL1_SD = new Array();

              // HEALTH TODAY
              let HT_QofL2_SD = new Array();

              // PHYSICAL HEALTH
              let PH_QofL2_SD = new Array();

              // PHYSICAL HEALTH STRING
              let PH_QofL2_SD_STRING = new Array();

              // MENTAL HEALTH
              let MH_QofL2_SD = new Array();

              // MENTAL HEALTH STRING
              let MH_QofL2_SD_STRING = new Array();

              // MOBILITY
              let M_QofL2_SD = new Array();

              // PERSONAL CARE
              let PC_QofL2_SD = new Array();

              // USUAL ACTIVITIES
              let UA_QofL2_SD = new Array();

              // PAIN/DISCOMFORT
              let PD_QofL2_SD = new Array();

              // ANXIETY/DEPRESSION
              let AD_QofL2_SD = new Array();

              // ED VISIT
              let HU_ED_QofL2_SD = new Array();

              // HOSPITALIZATION
              let HU_HNum_QofL2_SD = new Array();

              // DAYS IN HOSPITAL
              let HU_HD_QofL2_SD = new Array();

              // EMS
              let HU_EMS_QofL2_SD = new Array();

              // URGENT CARE
              let HU_UC_QofL2_SD = new Array();

              // SOUGHT TREATEMENT
              let HU_ST_QofL2_SD = new Array();

              // ACCIDENT
              let HU_A_QofL2_SD = new Array();

              // LIFE SATISFACTION
              let LS_QofL3_SD = new Array();

              // YOUR STANDARD OF LIVING
              let SL_QofL3_SD = new Array();

              // YOUR HEALTH
              let YH_QofL3_SD = new Array();

              // FEELING PART OF THE COMMUNITY
              let FPC_QofL3_SD = new Array();

              // WHAT YOU ARE ACHIEVING IN LIFE
              let AL_QofL3_SD = new Array();

              // PERSONAL RELATIONSHIPS
              let PR_QofL3_SD = new Array();

              // HOW SAFE YOU FEEL
              let HSF_QofL3_SD = new Array();

              // FUTURE SECURITY
              let FS_QofL3_SD = new Array();

              // YOUR SPIRITUALITY OR RELIGION
              let SR_QofL3_SD = new Array();

              // PWI OVERALL SCORE
              let PWI_QofL3_COMB = new Array();

              // ACTIVITIES
              let activities = new Array();

              // MEANINGFUL ACTIVITIES
              let meaningful_activities = new Array();

              // CHALLENGING ACTIVITIES
              let challenging_activities = new Array();

              //LIKE TO JOIN
              let like_to_join = new Array();

              // FREQUENCY OF COMMUNITY CARE PARTICIPATION [ STRINGS ]
              let FCP_STRINGS_COMB = new Array();

              // FREQUENCY OF COMMUNITY CARE PARTICIPATION DO MORE [ STRINGS ]
              let ISA_DM_STRINGS = new Array();

              // HOUSEHOLD SIZE
              let household_size = new Array();

              // MARITAL STATUS
              let marital_status = new Array();

              // TOTAL CHILDREN
              let total_children = new Array();

              // MEANINGFUL PEOPLE
              let meaningful_people = new Array();

              // TOTAL RELATIVES
              let total_relatives = new Array();

              // TOTAL CLOSE FRIENDS
              let total_close_friends = new Array();

              // TOTAL WELL KNOWN NEIGHBOURS
              let total_well_known_neighbours = new Array();

              // TRUSTED PEOPLE
              let trusted_people = new Array();

              // FREQUENCY OF CONTACT FAMILY
              let frequency_of_contact_family = new Array();

              // FREQUENCY OF CONTACT FRIENDS
              let frequency_of_contact_friends = new Array();

              // FREQUENCY OF CONTACT NEIGHBOURS
              let frequency_of_contact_neighbours = new Array();

              // FREQUENCY OF PARTICIPATION RELIGION
              let frequency_of_participation_religion = new Array();

              // FREQUENCY OF PARTICIPATION RECREATION / HOBBIES
              let frequency_of_participation_recreation = new Array();

              // FREQUENCY OF PARTICIPATION EDUCATION / CULTURES
              let frequency_of_participation_education = new Array();

              // FREQUENCY OF PARTICIPATION ASSOCIATIONS / CLUBS
              let frequency_of_participation_associations = new Array();

              // FREQUENCY OF PARTICIPATION VOLUNTEERING
              let frequency_of_participation_volunteering = new Array();

              // FREQUENCY OF PARTICIPATION INFORMAL HELP
              let frequency_of_participation_informal_help = new Array();

              // FREQUENCY OF PARTICIPATION MUSIC
              let frequency_of_participation_music = new Array();

              // FREQUENCY OF PARTICIPATION SPORTS
              let frequency_of_participation_sports = new Array();

              // FREQUENCY OF PARTICIPATION OTHER ACTIVITIES
              let frequency_of_participation_other_activities = new Array();

              // FREQUENCY OF PARTICIPATION COMPUTER
              let frequency_of_participation_computer = new Array();

              // HEALTH PROBLEM WALKING
              let problem_walking = new Array();

              // HEALTH PROBLEM WASHING / DRESSING
              let problem_washing_dressing = new Array();

              // HEALTH PROBLEM USUAL ACTIVITIES
              let problem_usual_activities = new Array();

              // HEALTH PROBLEM PAIN / DISCOMFORT
              let problem_pain_discomfort = new Array();

              // HEALTH PROBLEM ANXIOUS / DEPRESSED
              let problem_anxious_depressed = new Array();

              // SUPPORT HEALTH ATTEND WELLNESS PROGRAM
              let support_wellness_program = new Array();

              // SUPPORT HEALTHCARE
              let support_healthcare = new Array();

              // SUPPORT HOME HEALTHCARE
              let support_home_healthcare = new Array();

              // SUPPORT PRIVATE HEALTHCARE
              let support_private_healthcare = new Array();

              // SUPPORT INFORMAL
              let support_informal = new Array();

              // GOALS
              let goals = new Array();

              // ACCESS TO FAMILY DOCTOR
              let access_to_family_doctor = new Array();

              // FREQUENCY GET TOGETHER FAMILY
              let frequency_get_together_family = new Array();

              // FREQUENCY GET TOGETHER FRIENDS
              let frequency_get_together_friends = new Array();

              // FREQUENCY GET TOGETHER NEIGHBOURS
              let frequency_get_together_neighbours = new Array();

              // FREQUENCY OF REGULAR CONTACT THROUGH TELEPHONE
              let frequency_of_social_contacts_phone =
                new Array();

              // FREQUENCY OF REGULAR CONTACT THROUGH COMPUTER
              let frequency_of_social_contacts_computer =
                new Array();

              // PERCIEVED LONELINESS SOMETIMES COUNT
              let PL_QofL1_COMB_sometimes_count = new Array();

              // PERCIEVED LONELINESS OFTEN COUNT
              let PL_QofL1_COMB_often_count = new Array();

              // Number of people living with the person
              let household2_size = new Array();

              // Participating in community activities
              let community_activity_participate = new Array();

              // Satisfaction rate 1 to 10
              let life_satisfaction2 = new Array();

              // Community belonging rate
              let local_community_belonging = new Array();

              // Feeling lack of companionship
              let lack_companionship = new Array();

              // Feeling leftout
              let feel_leftout = new Array();

              // Feeling isolated
              let feel_isolated = new Array();

              memberCollectionList.forEach((memberCollection) => {
                if (memberCollection.memberSurveyList) {
                  const neighboursArray = Array.from(
                    memberCollection.memberSurveyList
                  );

                  let chapter1Values = null;
                  let chapter2Values = null;
                  let chapter3Values = null;
                  let chapter4Values = null;
                  let chapter5Values = null;
                  let chapter6Values = null;
                  let chapter7Values = null;
                  let chapter8Values = null;
                  let chapter9Values = null;
                  let chapter10Values = null;

                  let chapter1Results = neighboursArray.find(
                    (survey) =>
                      survey.surveyTemplate.name ==
                      "Community_Connections: [1] Help Request Tracker"
                  );

                  let chapter2Results = neighboursArray.find(
                    (survey) =>
                      survey.surveyTemplate.name ==
                      "Community_Connections: [2] My Story"
                  );

                  let chapter3Results = neighboursArray.find(
                    (survey) =>
                      survey.surveyTemplate.name ==
                      "Community_Connections: [3] Who's in My Circle"
                  );

                  let chapter4Results = neighboursArray.find(
                    (survey) =>
                      survey.surveyTemplate.name ==
                      "Community_Connections: [4] Activities and Interests"
                  );

                  let chapter5Results = neighboursArray.find(
                    (survey) =>
                      survey.surveyTemplate.name ==
                      "Community_Connections: [5] Goals"
                  );

                  let chapter6Results = neighboursArray.find(
                    (survey) =>
                      survey.surveyTemplate.name ==
                      "Community_Connections: [6] Health"
                  );

                  let chapter7Results = neighboursArray.find(
                    (survey) =>
                      survey.surveyTemplate.name ==
                      "Community_Connections: [7] Wellness"
                  );

                  let chapter8Results = neighboursArray.find(
                    (survey) =>
                      survey.surveyTemplate.name ==
                      "Community_Connections: [8] Action Tracker"
                  );

                  let chapter9Results = neighboursArray.find(
                    (survey) =>
                      survey.surveyTemplate.name ==
                      "Community_Connections: [9] Meeting Expectations - Your Experience"
                  );

                  let chapter10Results = neighboursArray.find(
                    (survey) =>
                      survey.surveyTemplate.name ==
                      "Community_Connections: [10] Post Survey: Health, Wellness and Social Outcomes Survey"
                  );

                  // let chapter7Results = neighboursArray.find(survey =>
                  //     survey.surveyTemplate.name == "Social Health"
                  // );

                  chapter1Values = JSON.parse(chapter1Results.responseJSON);
                  chapter2Values = JSON.parse(chapter2Results.responseJSON);
                  chapter3Values = JSON.parse(chapter3Results.responseJSON);
                  chapter4Values = JSON.parse(chapter4Results.responseJSON);
                  chapter5Values = JSON.parse(chapter5Results.responseJSON);
                  chapter6Values = JSON.parse(chapter6Results.responseJSON);
                  chapter7Values = JSON.parse(chapter7Results.responseJSON);
                  chapter8Values = JSON.parse(chapter8Results.responseJSON);
                  chapter9Values = JSON.parse(chapter9Results.responseJSON);
                  chapter10Values = JSON.parse(chapter10Results.responseJSON);

                  // if(chapter7Results !==undefined)

                  //     chapter7Values = JSON.parse(chapter7Results.responseJSON);

                  // if(chapter1Values)  // ===  Results Checked  ===
                  // {
                  //     activities.push(neighbourFunctions.activities(chapter1Values.activities_A, chapter1Values.activities_B));
                  //     meaningful_activities.push(neighbourFunctions.meaningful_activities(chapter1Values.meaningful_activities));
                  //     challenging_activities.push(neighbourFunctions.challenging_activities(chapter1Values.challenging_activities));
                  //     FCP_INT_COMB.push(neighbourFunctions.frequency_of_community_participation(chapter1Values.FCP_INT_COMB_A));
                  //     FCP_STRINGS_COMB.push(neighbourFunctions.FCP_STRINGS_COMB(chapter1Values.FCP_INT_COMB_B));

                  //     //  NOT USED SURVEY QUESTION: activities_interests_join
                  // }

                  if (chapter3Values) {
                    // Who's in my circle
                    //  NOT USED SURVEY QUESTION: animals


                    PN_QofL1_COMB.push(
                      neighbourFunctions.size_of_personal_network(
                        chapter3Values.PN_QofL1_COMB
                      )
                    );

                    meaningful_people.push(
                      chapter3Values.meaningful_people
                    );

                    total_children.push(
                      neighbourFunctions.total_children(
                        chapter3Values.total_children
                      )
                    );

                    total_relatives.push(
                      neighbourFunctions.total_relatives(
                        chapter3Values.total_relatives
                      )
                    );

                    total_close_friends.push(
                      neighbourFunctions.total_close_friends(
                        chapter3Values.total_close_friends
                      )
                    );

                    total_well_known_neighbours.push(
                      neighbourFunctions.total_well_known_neighbours(
                        chapter3Values.well_known_neighbours
                      )
                    );

                    trusted_people.push(
                      neighbourFunctions.trusted_people(
                        chapter3Values.trusted_people
                      )
                    );

                    marital_status.push(
                      chapter3Values.marital_status
                    );

                    household_size.push(
                      neighbourFunctions.household_size(
                        chapter3Values.household_size
                      )
                    );
     
                    QSC_QofL1_COMB.push(
                      neighbourFunctions.quality_of_social_contact(
                        chapter3Values
                      )
                    );
                    

                    // NOT USED SURVEY QUESTION: important_discussion_number_of_people_A
                    // NOT USED SURVEY QUESTION: important_discussion_number_of_people_B
                    // NOT USED SURVEY QUESTION: important_discussion_people_type_A
                    // NOT USED SURVEY QUESTION: important_discussion_people_type_B

                    PSS_QofL1_COMB.push(
                      neighbourFunctions.perceived_social_support(
                        chapter3Values.PSS_QofL1_COMB
                      )
                    );
                    PL_QofL1_COMB.push(
                      neighbourFunctions.perceived_loneliness(
                        chapter3Values.PL_QofL1_COMB
                      )
                    );
                    PL_QofL1_COMB_sometimes_count.push(
                      neighbourFunctions.perceived_loneliness_sometimes_count(
                        chapter3Values.PL_QofL1_COMB
                      )
                    );
                    PL_QofL1_COMB_often_count.push(
                      neighbourFunctions.perceived_loneliness_often_count(
                        chapter3Values.PL_QofL1_COMB
                      )
                    );
                    // AFH_QofL1_SD.push(neighbourFunctions.asking_for_help(chapter2Values.AFH_QofL1_SD));

                    frequency_of_contact_family.push(
                      neighbourFunctions.frequency_of_contact_family(
                        chapter3Values.FSC_QofL1_COMB_A
                      )
                    );

                    frequency_of_social_contacts_phone.push(
                      neighbourFunctions.frequency_of_social_contacts_phone(
                        chapter3Values.FSC_QofL1_COMB_A
                      )
                    );

                    frequency_of_social_contacts_computer.push(
                      neighbourFunctions.frequency_of_social_contacts_computer(
                        chapter3Values.FSC_QofL1_COMB_A
                      )
                    );
                 
                    frequency_of_contact_friends.push(
                      neighbourFunctions.frequency_of_contact_friends(
                        chapter3Values.FSC_QofL1_COMB_A
                      )
                    );
                    frequency_of_contact_neighbours.push(
                      neighbourFunctions.frequency_of_contact_neighbours(
                        chapter3Values.FSC_QofL1_COMB_A
                      )
                    );

                    frequency_get_together_family.push(
                      neighbourFunctions.frequency_get_together_family(
                        chapter3Values.FSC_QofL1_COMB_A
                      )
                    );
                    frequency_get_together_friends.push(
                      neighbourFunctions.frequency_get_together_friends(
                        chapter3Values.FSC_QofL1_COMB_A
                      )
                    );
                    frequency_get_together_neighbours.push(
                      neighbourFunctions.frequency_get_together_neighbours(
                        chapter3Values.FSC_QofL1_COMB_A
                      )
                    );
                  }

                  if (chapter4Values) {
                    // Activities and interests
                    activities.push(
                      neighbourFunctions.activities(
                        chapter4Values.activities_A,
                        chapter4Values.activities_B
                      )
                    );
                    meaningful_activities.push(
                      neighbourFunctions.meaningful_activities(
                        chapter4Values.meaningful_activities
                      )
                    );
                    challenging_activities.push(
                      neighbourFunctions.challenging_activities(
                        chapter4Values.challenging_activities
                      )
                    );
                    like_to_join.push(
                      neighbourFunctions.like_to_join(
                        chapter4Values.like_to_join
                      )
                    );
                    FCP_INT_COMB.push(
                      neighbourFunctions.frequency_of_community_participation(
                        chapter4Values.FCP_INT_COMB_A
                      )
                    );
                    // FCP_STRINGS_COMB.push(neighbourFunctions.FCP_STRINGS_COMB(chapter4Values.FCP_INT_COMB_B));
                    FCP_STRINGS_COMB.push(
                      neighbourFunctions.FCP_STRINGS_COMB(
                        chapter4Values.FCP_INT_COMB_A
                      )
                    );

                    frequency_of_participation_music.push(
                      neighbourFunctions.frequency_of_participation_music(
                        chapter4Values.FCP_INT_COMB_A
                      )
                    );

                    frequency_of_participation_religion.push(
                      neighbourFunctions.frequency_of_participation_religion(
                        chapter4Values.FCP_INT_COMB_A
                      )
                    );

                    frequency_of_participation_sports.push(
                      neighbourFunctions.frequency_of_participation_sports(
                        chapter4Values.FCP_INT_COMB_A
                      )
                    );

                    frequency_of_participation_recreation.push(
                      neighbourFunctions.frequency_of_participation_recreation(
                        chapter4Values.FCP_INT_COMB_A
                      )
                    );

                    frequency_of_participation_education.push(
                      neighbourFunctions.frequency_of_participation_education(
                        chapter4Values.FCP_INT_COMB_A
                      )
                    );

                    frequency_of_participation_associations.push(
                      neighbourFunctions.frequency_of_participation_associations(
                        chapter4Values.FCP_INT_COMB_A
                      )
                    );

                    frequency_of_participation_other_activities.push(
                      neighbourFunctions.frequency_of_participation_other_activities(
                        chapter4Values.FCP_INT_COMB_A
                      )
                    );



                    //  NOT USED SURVEY QUESTION: activities_interests
                  }

                  if (chapter5Values) {
                    //Goals
                    goals.push(neighbourFunctions.goals(chapter5Values.goals));
                    PAG_QofL1_SD.push(
                      neighbourFunctions.progress_achieving_goals(
                        chapter5Values.PAG_QofL1_SD
                      )
                    );
                  }

                  if (chapter6Values) {
                    // Health
                    PH_QofL2_SD.push(
                      neighbourFunctions.physical_health(
                        chapter6Values.PH_QofL2_SD
                      )
                    );
                    PH_QofL2_SD_STRING.push(
                      neighbourFunctions.physical_health_string(
                        chapter6Values.PH_QofL2_SD
                      )
                    );
                    MH_QofL2_SD.push(
                      neighbourFunctions.mental_health(
                        chapter6Values.MH_QofL2_SD
                      )
                    );
                    MH_QofL2_SD_STRING.push(
                      neighbourFunctions.mental_health_string(
                        chapter6Values.MH_QofL2_SD
                      )
                    );
                    HT_QofL2_SD.push(
                      neighbourFunctions.health_today(
                        chapter6Values.HT_QofL2_SD
                      )
                    );

                    M_QofL2_SD.push(
                      neighbourFunctions.mobility(chapter6Values.mobility_today)
                    );
                    PC_QofL2_SD.push(
                      neighbourFunctions.personal_care(
                        chapter6Values.self_care_today
                      )
                    );
                    UA_QofL2_SD.push(
                      neighbourFunctions.usual_activities(
                        chapter6Values.usual_activities_today
                      )
                    );
                    PD_QofL2_SD.push(
                      neighbourFunctions.pain_discomfort(
                        chapter6Values.pain_discomfort_today
                      )
                    );
                    AD_QofL2_SD.push(
                      neighbourFunctions.anxiety_depression(
                        chapter6Values.anxiety_depression_today
                      )
                    );

                    problem_walking.push(
                      neighbourFunctions.problem_walking(
                        chapter6Values.mobility_today
                      )
                    );
                    problem_washing_dressing.push(
                      neighbourFunctions.problem_washing_dressing(
                        chapter6Values.self_care_today
                      )
                    );
                    problem_usual_activities.push(
                      neighbourFunctions.problem_usual_activities(
                        chapter6Values.usual_activities_today
                      )
                    );
                    problem_pain_discomfort.push(
                      neighbourFunctions.problem_pain_discomfort(
                        chapter6Values.pain_discomfort_today
                      )
                    );
                    problem_anxious_depressed.push(
                      neighbourFunctions.problem_anxious_depressed(
                        chapter6Values.anxiety_depression_today
                      )
                    );

                    support_wellness_program.push(
                      neighbourFunctions.support_wellness_program(
                        chapter6Values.FC_3C_COMB
                      )
                    );
                    support_healthcare.push(
                      neighbourFunctions.support_healthcare(
                        chapter6Values.FC_3C_COMB
                      )
                    );
                    support_home_healthcare.push(
                      neighbourFunctions.support_home_healthcare(
                        chapter6Values.FC_3C_COMB
                      )
                    );
                    support_private_healthcare.push(
                      neighbourFunctions.support_private_healthcare(
                        chapter6Values.FC_3C_COMB
                      )
                    );
                    support_informal.push(
                      neighbourFunctions.support_informal(
                        chapter6Values.FC_3C_COMB
                      )
                    );
                    HU_ED_QofL2_SD.push(
                      neighbourFunctions.ed_visit(chapter6Values.question1['Row 1'])
                    );

                    HU_HNum_QofL2_SD.push(
                      neighbourFunctions.hospitalization(
                        chapter6Values.question1['Row 2']
                      )
                    );
                    HU_HD_QofL2_SD.push(
                      neighbourFunctions.days_in_hospital(
                        chapter6Values.HU_HD_QofL2_SD
                      )
                    );
                    HU_EMS_QofL2_SD.push(
                      neighbourFunctions.ems(chapter6Values.HU_EMS_QofL2_SD)
                    );
                    HU_UC_QofL2_SD.push(
                      neighbourFunctions.urgent_care(
                        chapter6Values.HU_UC_QofL2_SD
                      )
                    );
                    HU_ST_QofL2_SD.push(
                      neighbourFunctions.sought_treatment(
                        chapter6Values.HU_ST_QofL2_SD
                      )
                    );
                    HU_A_QofL2_SD.push(
                      neighbourFunctions.accident(chapter6Values.HU_A_QofL2_SD)
                    );
                    access_to_family_doctor.push(
                      neighbourFunctions.access_to_family_doctor(
                        chapter6Values.access_to_family_doctor
                      )
                    );

                    // NOT USED SURVEY QUESTION: care_plan
                    // NOT USED SURVEY QUESTION: care_plan_name
                    // NOT USED SURVEY QUESTION: care_plan_location
                    // NOT USED SURVEY QUESTION: prescription_medication_num
                    // NOT USED SURVEY QUESTION: prescription_medication_location
                    // NOT USED SURVEY QUESTION: health_awareness_knowledge
                    // NOT USED SURVEY QUESTION: consumption
                    // NOT USED SURVEY QUESTION: intense_physical_activity_minutes
                    // NOT USED SURVEY QUESTION: moderate_physical_activity_minutes
                    // NOT USED SURVEY QUESTION: light_physical_activity_minutes
                  }

                  if (chapter7Values) {
                    // Wellness
                    // household2_size.push(neighbourFunctions.household2_size(chapter7Values.household2_size));
                    // community_activity_participate.push(neighbourFunctions.community_activity_participate(chapter7Values.community_activity_participate));
                    // life_satisfaction2.push(neighbourFunctions.life_satisfaction2(chapter7Values.life_satisfaction2));
                    // local_community_belonging.push(neighbourFunctions.local_community_belonging(chapter7Values.local_community_belonging));
                    // lack_companionship.push(neighbourFunctions.lack_companionship(chapter7Values.lack_companionship));
                    // feel_leftout.push(neighbourFunctions.feel_isolated(chapter7Values.feel_isolated));
                    // feel_isolated.push(neighbourFunctions.feel_isolated(chapter7Values.feel_leftout));
                    // log.info(neighbourFunctions.feel_isolated(chapter7Values.feel_leftout));

                    LS_QofL3_SD.push(
                      neighbourFunctions.life_satisfaction(
                        chapter7Values.LS_QofL3_SD
                      )
                    );
                    SL_QofL3_SD.push(
                      neighbourFunctions.your_standard_of_living(
                        chapter7Values.SL_QofL3_SD
                      )
                    );
                    YH_QofL3_SD.push(
                      neighbourFunctions.your_health(chapter7Values.YH_QofL3_SD)
                    );
                    FPC_QofL3_SD.push(
                      neighbourFunctions.feeling_part_of_the_community(
                        chapter7Values.FPC_QofL3_SD
                      )
                    );
                    AL_QofL3_SD.push(
                      neighbourFunctions.what_you_are_achieving_in_life(
                        chapter7Values.AL_QofL3_SD
                      )
                    );
                    PR_QofL3_SD.push(
                      neighbourFunctions.personal_relationships(
                        chapter7Values.PR_QofL3_SD
                      )
                    );
                    HSF_QofL3_SD.push(
                      neighbourFunctions.how_safe_you_feel(
                        chapter7Values.HSF_QofL3_SD
                      )
                    );
                    FS_QofL3_SD.push(
                      neighbourFunctions.future_security(
                        chapter7Values.FS_QofL3_SD
                      )
                    );
                    SR_QofL3_SD.push(
                      neighbourFunctions.your_spirituality_or_religion(
                        chapter7Values.SR_QofL3_SD
                      )
                    );

                    PWI_QofL3_COMB.push(
                      neighbourFunctions.pwi_overall_score(
                        chapter7Values.LS_QofL3_SD,
                        chapter7Values.SL_QofL3_SD,
                        chapter7Values.YH_QofL3_SD,
                        chapter7Values.FPC_QofL3_SD,
                        chapter7Values.AL_QofL3_SD,
                        chapter7Values.PR_QofL3_SD,
                        chapter7Values.HSF_QofL3_SD,
                        chapter7Values.FS_QofL3_SD,
                        chapter7Values.SR_QofL3_SD
                      )
                    );
                  }

                  // log.info(life_satisfaction2);
                }
              });

              // END - Neighbour Report info step ==================================================

              //Start Screen report

              //End Screen report
              return res.status(200).json({
                // ID_PRF_SD: account_id,
                // SRVNum_PRF_SD: neighboursChapter_ids,
                // SRVD_PRF_SD: neighboursChapter_dates,
                // TINV_PRF_SD: account_involvement,
                // GEN_PRF_SD: account_gender,
                // DOB_PRF_SD: account_dob,
                // PC_PRF_SD: account_postalCode,
                // L_PRF_SD: account_language,
                collection_last_updated: collection_last_updated,
                FCP_INT_COMB: FCP_INT_COMB,
                // ISA_INT: ISA_INT,
                // SII_QofL1: SII_QofL1,
                PN_QofL1_COMB: PN_QofL1_COMB,
                // FSC_QofL1_COMB: FSC_QofL1_COMB,
                // SSC_QofL1_COMB: SSC_QofL1_COMB,
                QSC_QofL1_COMB: QSC_QofL1_COMB,
                PSS_QofL1_COMB: PSS_QofL1_COMB,
                PL_QofL1_COMB: PL_QofL1_COMB,
                // AFH_QofL1_SD: AFH_QofL1_SD,
                PAG_QofL1_SD: PAG_QofL1_SD,
                HT_QofL2_SD: HT_QofL2_SD,
                PH_QofL2_SD: PH_QofL2_SD,
                PH_QofL2_SD_STRING: PH_QofL2_SD_STRING,
                MH_QofL2_SD: MH_QofL2_SD,
                MH_QofL2_SD_STRING: MH_QofL2_SD_STRING,
                M_QofL2_SD: M_QofL2_SD,
                PC_QofL2_SD: PC_QofL2_SD,
                UA_QofL2_SD: UA_QofL2_SD,
                PD_QofL2_SD: PD_QofL2_SD,
                AD_QofL2_SD: AD_QofL2_SD,
                HU_ED_QofL2_SD: HU_ED_QofL2_SD,
                HU_HNum_QofL2_SD: HU_HNum_QofL2_SD,
                HU_HD_QofL2_SD: HU_HD_QofL2_SD,
                HU_EMS_QofL2_SD: HU_EMS_QofL2_SD,
                HU_UC_QofL2_SD: HU_UC_QofL2_SD,
                HU_ST_QofL2_SD: HU_ST_QofL2_SD,
                HU_A_QofL2_SD: HU_A_QofL2_SD,
                LS_QofL3_SD: LS_QofL3_SD,
                SL_QofL3_SD: SL_QofL3_SD,
                YH_QofL3_SD: YH_QofL3_SD,
                FPC_QofL3_SD: FPC_QofL3_SD,
                AL_QofL3_SD: AL_QofL3_SD,
                PR_QofL3_SD: PR_QofL3_SD,
                HSF_QofL3_SD: HSF_QofL3_SD,
                FS_QofL3_SD: FS_QofL3_SD,
                SR_QofL3_SD: SR_QofL3_SD,
                PWI_QofL3_COMB: PWI_QofL3_COMB,
                activities: activities,
                meaningful_activities: meaningful_activities,
                like_to_join: like_to_join,
                challenging_activities: challenging_activities,
                FCP_STRINGS_COMB: FCP_STRINGS_COMB,
                // ISA_DM_STRINGS: ISA_DM_STRINGS,
                household_size: household_size,
                marital_status: marital_status,
                total_children: total_children,
                meaningful_people: meaningful_people,
                total_relatives: total_relatives,
                total_close_friends: total_close_friends,
                total_well_known_neighbours: total_well_known_neighbours,
                trusted_people: trusted_people,
                frequency_of_contact_family: frequency_of_contact_family,
                frequency_of_contact_friends: frequency_of_contact_friends,
                frequency_of_contact_neighbours:
                  frequency_of_contact_neighbours,
                frequency_of_participation_religion: frequency_of_participation_religion,
                frequency_of_participation_recreation: frequency_of_participation_recreation,
                frequency_of_participation_education: frequency_of_participation_education,
                frequency_of_participation_associations: frequency_of_participation_associations,
                frequency_of_participation_other_activities: frequency_of_participation_other_activities,
                // frequency_of_participation_volunteering: frequency_of_participation_volunteering,
                // frequency_of_participation_informal_help: frequency_of_participation_informal_help,
                frequency_of_participation_music: frequency_of_participation_music,
                frequency_of_participation_sports: frequency_of_participation_sports,
                // frequency_of_participation_computer: frequency_of_participation_computer,
                problem_walking: problem_walking,
                problem_washing_dressing: problem_washing_dressing,
                problem_usual_activities: problem_usual_activities,
                problem_pain_discomfort: problem_pain_discomfort,
                problem_anxious_depressed: problem_anxious_depressed,
                support_wellness_program: support_wellness_program,
                support_healthcare: support_healthcare,
                support_home_healthcare: support_home_healthcare,
                support_private_healthcare: support_private_healthcare,
                support_informal: support_informal,
                goals: goals,
                access_to_family_doctor: access_to_family_doctor,
                frequency_get_together_family: frequency_get_together_family,
                frequency_get_together_friends: frequency_get_together_friends,
                frequency_get_together_neighbours:
                  frequency_get_together_neighbours,
                frequency_of_social_contacts_phone: frequency_of_social_contacts_phone,
                frequency_of_social_contacts_computer: frequency_of_social_contacts_computer,
                PL_QofL1_COMB_sometimes_count: PL_QofL1_COMB_sometimes_count,
                PL_QofL1_COMB_often_count: PL_QofL1_COMB_often_count,
                // feel_isolated: feel_isolated,
                // feel_leftout: feel_leftout,
                // lack_companionship: lack_companionship,
                // local_community_belonging: local_community_belonging,
                // life_satisfaction2: life_satisfaction2,
                // community_activity_participate: community_activity_participate,
                // household2_size: household2_size,
                memberName: account_name,
                request: {
                  type: "GET",
                  url:
                    config.server.protocol +
                    "://" +
                    config.server.hostname +
                    ":" +
                    config.server.port +
                    "/api/reports/neighbours/user/" +
                    req.params.userId,
                },
              });
            } else {
              return res.status(404).json({
                message: "Collection information for user not found.",
              });
            }
          })
          .catch((error) => {
            log.error(error.message);

            return res.status(500).json({
              message: error.message,
            });
          });
      } else {
        return res.status(404).json({});
      }
    })
    .catch((error) => {
      log.error(error.message);

      return res.status(500).json({
        message: error.message,
      });
    });
};


exports.QualityofLife = async (req, res) => {
  log.info(
    "Incoming request for Quality of life - short Report on the Collections of user with id: " +
    req.params.userId
  );

  let flag1 = 1;

  Collection.find({ name: "Quality of Life - Short" })
    .then((verifiedCollection) => {
      if (verifiedCollection.length == 0) {
        flag1 = 0;
      }

      if (flag1 == 1) {
      MemberCollection.find({
        collectionTemplate: verifiedCollection,
        member: req.params.userId,
      })
        .sort({ createdAt: -1 })
        .populate({
          path: "member",
          options: { limit: 1 },
          select: "-password",
          populate: {
            path: "info.currentAddress",
            model: "Address",
          }
        })
        .populate({
          path: "member",
          options: { limit: 1 },
          select: "-password",
          populate: { path: "info.currentAddress", model: "Address" },
        })
        .populate({
          path: "memberSurveyList",
          populate: { path: "surveyTemplate", model: "Survey" },
        })
        .exec()
        .then((memberCollectionList) => {
          if (memberCollectionList) {

            let collection_last_updated = new Date(memberCollectionList[0].updatedAt).toISOString().split('T')[0];

            let account_name = memberCollectionList[0].member.info.name || "";
            account_name =
              account_name.length >= 60
                ? key_private.decrypt(account_name, "utf8")
                : account_name;

            // BASIC NEEDS
            let basic_needs = new Array();

            // PHYSICAL HEALTH
            let PH_QofL2_SD = new Array();

            // PHYSICAL HEALTH STRING
            let PH_QofL2_SD_STRING = new Array();

            // MENTAL HEALTH
            let MH_QofL2_SD = new Array();

            // MENTAL HEALTH STRING
            let MH_QofL2_SD_STRING = new Array();

            // MOBILITY
            let problem_walking = new Array();

            // PERSONAL CARE
            let problem_washing_dressing = new Array();

            // USUAL ACTIVITIES
            let problem_usual_activities = new Array();

            // PAIN/DISCOMFORT
            let problem_pain_discomfort  = new Array();

            // ANXIETY/DEPRESSION
            let problem_anxious_depressed = new Array();

            // SUPPORT HEALTH ATTEND WELLNESS PROGRAM
            let support_wellness_program = new Array();

            // SUPPORT HEALTHCARE
            let support_healthcare = new Array();

            // SUPPORT HOME HEALTHCARE
            let support_home_healthcare = new Array();

            // SUPPORT PRIVATE HEALTHCARE
            let support_private_healthcare = new Array();

            // SUPPORT INFORMAL
            let support_informal = new Array();

            // ED VISIT
            let HU_ED_QofL2_SD = new Array();

            // HOSPITALIZATION
            let HU_HNum_QofL2_SD = new Array();

            // DAYS IN HOSPITAL
            let HU_HD_QofL2_SD = new Array();

            // EMS
            let HU_EMS_QofL2_SD = new Array();

            // URGENT CARE
            let HU_UC_QofL2_SD = new Array();

            // SOUGHT TREATEMENT
            let HU_ST_QofL2_SD = new Array();

            // ACCIDENT
            let HU_A_QofL2_SD = new Array();

            // PERCEIVED SOCIAL SUPPORT
            let PSS_QofL1_COMB = new Array();

            // PERCEIVED LONELINESS
            let PL_QofL1_COMB = new Array();

            // PERCIEVED LONELINESS SOMETIMES COUNT
            let PL_QofL1_COMB_sometimes_count = new Array();

            // PERCIEVED LONELINESS OFTEN COUNT
            let PL_QofL1_COMB_often_count = new Array();

            // LIFE SATISFACTION
            let LS_QofL3_SD = new Array();

            // YOUR STANDARD OF LIVING
            let SL_QofL3_SD = new Array();

            // YOUR HEALTH
            let YH_QofL3_SD = new Array();

            // WHAT YOU ARE ACHIEVING IN LIFE
            let AL_QofL3_SD = new Array();

            // PERSONAL RELATIONSHIPS
            let PR_QofL3_SD = new Array();

            // HOW SAFE YOU FEEL
            let HSF_QofL3_SD = new Array();


            // FEELING PART OF THE COMMUNITY
            let FPC_QofL3_SD = new Array();

            // FUTURE SECURITY
            let FS_QofL3_SD = new Array();

            // YOUR SPIRITUALITY OR RELIGION
            let SR_QofL3_SD = new Array();

            // PWI OVERALL SCORE
            let PWI_QofL3_COMB = new Array();



            memberCollectionList.forEach((memberCollection) => {
              if (memberCollection.memberSurveyList) {
                const neighboursArray = Array.from(
                  memberCollection.memberSurveyList
                );

                let chapter1Values = null;

                let chapter1Results = neighboursArray.find(
                  (survey) =>
                    survey.surveyTemplate.name ==
                    "Quality of Life Reflection - Short"
                );

                chapter1Values = JSON.parse(chapter1Results.responseJSON);

                if (chapter1Values) {

                  basic_needs.push(
                    chapter1Values.basic_needs
                  );

                  // PHYSICAL HEALTH
                  PH_QofL2_SD.push(
                    neighbourFunctions.physical_health(
                      chapter1Values.PH_QofL2_SD
                    )
                  );

                  // PHYSICAL HEALTH STRING
                  PH_QofL2_SD_STRING.push(
                    neighbourFunctions.physical_health_string(
                      chapter1Values.PH_QofL2_SD
                    )
                  );

                  // MENTAL HEALTH
                  MH_QofL2_SD.push(
                    neighbourFunctions.mental_health(
                      chapter1Values.MH_QofL2_SD
                    )
                  );

                  // MENTAL HEALTH STRING
                  MH_QofL2_SD_STRING.push(
                    neighbourFunctions.mental_health_string(
                      chapter1Values.MH_QofL2_SD
                    )
                  );

                  // MOBILITY
                  problem_walking.push(
                    neighbourFunctions.mobility(chapter1Values.mobility_today)
                  );

                  // PERSONAL CARE
                  problem_washing_dressing.push(
                    neighbourFunctions.personal_care(
                      chapter1Values.self_care_today
                    )
                  );

                  // USUAL ACTIVITIES
                  problem_usual_activities.push(
                    neighbourFunctions.usual_activities(
                      chapter1Values.usual_activities_today
                    )
                  );

                  // PAIN/DISCOMFORT
                  problem_pain_discomfort.push(
                    neighbourFunctions.pain_discomfort(
                      chapter1Values.pain_discomfort_today
                    )
                  );

                  // ANXIETY/DEPRESSION
                  problem_anxious_depressed.push(
                    neighbourFunctions.anxiety_depression(
                      chapter1Values.anxiety_depression_today
                    )
                  );

                  // SUPPORT HEALTH ATTEND WELLNESS PROGRAM
                  support_wellness_program.push(
                    neighbourFunctions.support_wellness_program(
                      chapter1Values.FC_3C_COMB
                    )
                  );

                  // SUPPORT HEALTHCARE
                  support_healthcare.push(
                    neighbourFunctions.support_healthcare(
                      chapter1Values.FC_3C_COMB
                    )
                  );

                  // SUPPORT HOME HEALTHCARE
                  support_home_healthcare.push(
                    neighbourFunctions.support_home_healthcare(
                      chapter1Values.FC_3C_COMB
                    )
                  );

                  // SUPPORT PRIVATE HEALTHCARE
                  support_private_healthcare.push(
                    neighbourFunctions.support_private_healthcare(
                      chapter1Values.FC_3C_COMB
                    )
                  );

                  // SUPPORT INFORMAL
                  support_informal.push(
                    neighbourFunctions.support_informal(
                      chapter1Values.FC_3C_COMB
                    )
                  );

                  // ED VISIT
                  HU_ED_QofL2_SD.push(
                    neighbourFunctions.ed_visit(chapter1Values.HU_ED_QofL2_SD)
                  );

                  // HOSPITALIZATION
                  HU_HNum_QofL2_SD.push(
                    neighbourFunctions.hospitalization(
                      chapter1Values.HU_HNum_QofL2_SD
                    )
                  );

                  // DAYS IN HOSPITAL
                  HU_HD_QofL2_SD.push(
                    neighbourFunctions.days_in_hospital(
                      chapter1Values.HU_HD_QofL2_SD
                    )
                  );

                  // EMS
                  HU_EMS_QofL2_SD.push(
                    neighbourFunctions.ems(chapter1Values.HU_EMS_QofL2_SD)
                  );

                  // URGENT CARE
                  HU_UC_QofL2_SD.push(
                    neighbourFunctions.urgent_care(
                      chapter1Values.HU_UC_QofL2_SD
                    )
                  );

                  // SOUGHT TREATEMENT
                  HU_ST_QofL2_SD.push(
                    neighbourFunctions.sought_treatment(
                      chapter1Values.HU_ST_QofL2_SD
                    )
                  );

                  // ACCIDENT
                  HU_A_QofL2_SD.push(
                    neighbourFunctions.accident(chapter1Values.HU_A_QofL2_SD)
                  );

                  // PERCEIVED SOCIAL SUPPORT
                  PSS_QofL1_COMB.push(
                    neighbourFunctions.perceived_social_support(
                      chapter1Values.PSS_QofL1_COMB
                    )
                  );

                  // PERCEIVED LONELINESS
                  PL_QofL1_COMB.push(
                    neighbourFunctions.perceived_loneliness(
                      chapter1Values.PL_QofL1_COMB
                    )
                  );

                  // PERCIEVED LONELINESS SOMETIMES COUNT
                  PL_QofL1_COMB_sometimes_count.push(
                    neighbourFunctions.perceived_loneliness_sometimes_count(
                      chapter1Values.PL_QofL1_COMB
                    )
                  );

                  // PERCIEVED LONELINESS OFTEN COUNT
                  PL_QofL1_COMB_often_count.push(
                    neighbourFunctions.perceived_loneliness_often_count(
                      chapter1Values.PL_QofL1_COMB
                    )
                  );

                  ///////// WELLNESS/////////////
                  // LIFE SATISFACTION
                  LS_QofL3_SD.push(
                    neighbourFunctions.life_satisfaction(
                      chapter1Values.LS_QofL3_SD
                    )
                  );

                  // YOUR STANDARD OF LIVING
                  SL_QofL3_SD.push(
                    neighbourFunctions.your_standard_of_living(
                      chapter1Values.SL_QofL3_SD
                    )
                  );

                  // YOUR HEALTH
                  YH_QofL3_SD.push(
                    neighbourFunctions.your_health(chapter1Values.YH_QofL3_SD)
                  );

                  // WHAT YOU ARE ACHIEVING IN LIFE
                  AL_QofL3_SD.push(
                    neighbourFunctions.what_you_are_achieving_in_life(
                      chapter1Values.AL_QofL3_SD
                    )
                  );

                  // PERSONAL RELATIONSHIPS
                  PR_QofL3_SD.push(
                    neighbourFunctions.personal_relationships(
                      chapter1Values.PR_QofL3_SD
                    )
                  );

                  // HOW SAFE YOU FEEL
                  HSF_QofL3_SD.push(
                    neighbourFunctions.how_safe_you_feel(
                      chapter1Values.HSF_QofL3_SD
                    )
                  );

                  // FEELING PART OF THE COMMUNITY
                  FPC_QofL3_SD.push(
                    neighbourFunctions.feeling_part_of_the_community(
                      chapter1Values.FPC_QofL3_SD
                    )
                  );

                  // FUTURE SECURITY
                  FS_QofL3_SD.push(
                    neighbourFunctions.future_security(
                      chapter1Values.FS_QofL3_SD
                    )
                  );

                  // YOUR SPIRITUALITY OR RELIGION
                  SR_QofL3_SD.push(
                    neighbourFunctions.your_spirituality_or_religion(
                      chapter1Values.SR_QofL3_SD
                    )
                  );

                  // PWI OVERALL SCORE
                  PWI_QofL3_COMB.push(
                    neighbourFunctions.pwi_overall_score(
                      chapter1Values.LS_QofL3_SD,
                      chapter1Values.SL_QofL3_SD,
                      chapter1Values.YH_QofL3_SD,
                      chapter1Values.FPC_QofL3_SD,
                      chapter1Values.AL_QofL3_SD,
                      chapter1Values.PR_QofL3_SD,
                      chapter1Values.HSF_QofL3_SD,
                      chapter1Values.FS_QofL3_SD,
                      chapter1Values.SR_QofL3_SD
                    )
                  );
                }

              }
            });

            return res.status(200).json({
              collection_last_updated: collection_last_updated,
              basic_needs: basic_needs,
              PH_QofL2_SD: PH_QofL2_SD,
              PH_QofL2_SD_STRING: PH_QofL2_SD_STRING,
              MH_QofL2_SD: MH_QofL2_SD,
              MH_QofL2_SD_STRING: MH_QofL2_SD_STRING,
              M_QofL2_SD: problem_walking,
              PC_QofL2_SD: problem_washing_dressing,
              UA_QofL2_SD: problem_usual_activities,
              PD_QofL2_SD: problem_pain_discomfort,
              AD_QofL2_SD: problem_anxious_depressed,
              problem_walking: problem_walking,
              problem_washing_dressing: problem_washing_dressing,
              problem_usual_activities: problem_usual_activities,
              problem_pain_discomfort: problem_pain_discomfort,
              problem_anxious_depressed: problem_anxious_depressed,
              support_wellness_program: support_wellness_program,
              support_healthcare: support_healthcare,
              support_home_healthcare: support_home_healthcare,
              support_private_healthcare: support_private_healthcare,
              support_informal: support_informal,
              HU_ED_QofL2_SD: HU_ED_QofL2_SD,
              HU_HNum_QofL2_SD: HU_HNum_QofL2_SD,
              HU_HD_QofL2_SD: HU_HD_QofL2_SD,
              HU_EMS_QofL2_SD: HU_EMS_QofL2_SD,
              HU_UC_QofL2_SD: HU_UC_QofL2_SD,
              HU_ST_QofL2_SD: HU_ST_QofL2_SD,
              HU_A_QofL2_SD: HU_A_QofL2_SD,
              PSS_QofL1_COMB: PSS_QofL1_COMB,
              PL_QofL1_COMB: PL_QofL1_COMB,
              PL_QofL1_COMB_sometimes_count: PL_QofL1_COMB_sometimes_count,
              PL_QofL1_COMB_often_count: PL_QofL1_COMB_often_count,
              LS_QofL3_SD: LS_QofL3_SD,
              SL_QofL3_SD: SL_QofL3_SD,
              YH_QofL3_SD: YH_QofL3_SD,
              AL_QofL3_SD: AL_QofL3_SD,
              PR_QofL3_SD: PR_QofL3_SD,
              HSF_QofL3_SD: HSF_QofL3_SD,
              FPC_QofL3_SD: FPC_QofL3_SD,
              FS_QofL3_SD: FS_QofL3_SD,
              SR_QofL3_SD: SR_QofL3_SD,
              PWI_QofL3_COMB: PWI_QofL3_COMB,
              memberName: account_name,
              // request: {
              //   type: "GET",
              //   url:
              //     config.server.protocol +
              //     "://" +
              //     config.server.hostname +
              //     ":" +
              //     config.server.port +
              //     "/api/reports/neighbours/user/" +
              //     req.params.userId,
              // },
            });
          } else {
            return res.status(404).json({
              message: "Collection information for user not found.",
            });
          }
        })
        .catch((error) => {
          log.error(error.message);

          return res.status(500).json({
            message: error.message,
          });
        });
      } else {
        return res.status(404).json({});
      }
        
    })
    .catch((error) => {
      log.error(error.message);

      return res.status(500).json({
        message: error.message,
      });
    });
};
