/*
==============================================
MemberSurvey Controller
----------------------------------------------
Methods:
- Personalized Neighbours
==============================================
*/

const mongoose = require("mongoose");

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
const e = require("express");

exports.standardAccountId = async (req, res) =>
{
    logUser.info("Incoming read for user with id: " + req.params.userId);

    User.findById(req.params.userId)
    .exec()
    .then(user => {
        if(user)
        {
            const standard_id = userFunctions.getStandardAccountId(user.role, user.facilityId, user.sequence_id);

            if(!standard_id)
            {
                return res.status(404).json({
                    message: "Error generating standard Id."
                });
            }

            return res.status(200).json({
                standard_id: standard_id,
                request: { 
                    type: 'GET',
                    url: config.server.protocol + '://' + config.server.hostname +':' + config.server.port + config.server.extension + '/user/' + user._id
                }
            });
        }  
        else
        {
            return res.status(404).json({
                message: "User Information not found."
            });
        }
    })
    .catch(error => {
        logUser.error(error.message);

        return res.status(500).json({
            message: error.message
        });

    });
    
}

//Screen
exports.Screen = async (req, res) =>
{
    log.info("Incoming request for Screen's Report on the Collections of user with id: " + req.params.userId);
    
    flag1 = 1;
    Collection.find({ name: "Test_Screen"}) //Test_screen_neighbours
        .then(verifiedCollection => {
            // log.info("VERRRRRRRRRRRRRRRRRRIFEI", verifiedCollection);
            if(verifiedCollection.length == 0){
                

                log.info("ERRROOOOOR");
                flag1 = 0;
            }
            if( flag1 == 1){
                
                // log.info("Hellooooo SCREEN");
                // log.info(verifiedCollection.length, "\n");
                // log.info(verifiedCollection);
                
                // log.info("REEEEEEEEEEEEEEEEEEEEEQ",req.params.userId);
                MemberCollection.find( { collectionTemplate: verifiedCollection, member: req.params.userId }).sort( { createdAt: 1 })
                .populate( { path: 'member', options: { limit: 1 }, select: '-password', populate: { path: 'info.currentAddress', model: "Address" } })
                .populate( { path: 'memberSurveyList', populate: { path: 'surveyTemplate', model: "Survey" } } )
                .exec()
                .then(memberCollectionList => {                
                    if(memberCollectionList)
                    {

                        if(memberCollectionList.length === 0){
                            log.info("0");
                        }

                        log.info("NEWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWwwww HIIIIIIIIIIIIIIII");
                        //log.info(memberCollection).find().;
                        
                        log.info(memberCollectionList.length);

                        
                            // log.info("HEEEEEEEEEEEELLO");
                        
                        // START - Account info step ==================================================

                            let account_id = userFunctions.getStandardAccountId(memberCollectionList[0].member.role || "",
                            memberCollectionList[0].member.facilityId || "", memberCollectionList[0].member.sequence_id || "");

                            log.info("AAAAAAAAAAAAAAAAAA", account_id);

                            let account_involvement = neighbourFunctions.formatInvolvement(memberCollectionList[0].member.role || "");
                            
                            let account_name = memberCollectionList[0].member.info.name || "";
                            
                            let account_gender = neighbourFunctions.formatGender(memberCollectionList[0].member.info.gender || "");

                            let account_dob = neighbourFunctions.formatDate(memberCollectionList[0].member.info.dateOfBirth || "");

                            let account_postalCode = neighbourFunctions.formatPostalCode(memberCollectionList[0].member.info.currentAddress.code || "");

                            let account_language = neighbourFunctions.formatLanguage(memberCollectionList[0].member.info.language || "");

                        // // END - Account info step ==================================================
                           
                        // // START - Collection : Survey info step ==================================================

                            let collection_ids = neighbourFunctions.collectionIds(memberCollectionList);

                            let collection_dates = neighbourFunctions.collectionDates(memberCollectionList);

                            let neighboursChapter_ids = neighbourFunctions.neighbourChapterIds(memberCollectionList);

                            log.info("EEEEEEEEEEEe",neighboursChapter_ids);

                            let neighboursChapter_dates = neighbourFunctions.neighbourChapterDates(memberCollectionList);

                        // END - Collection : Survey Info Step ==================================================

                        // START - Neighbour Report info step ==================================================

                            
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

                            // let con_que = new Array();

                            
                            // log.info(memberCollectionList);
                            

                            memberCollectionList.forEach(memberCollection => {
                                
                                // if( memberCollection.collectionTemplate == '62017ad39894374f8451348e'){
                                    // log.info('%' , "MEMBERRRRRRRR COLLECTIOOOOOOOOOON" ,memberCollectionList , "EEEEEEEEEEEEEEEEEND");

                                

                                

                                
                                // if( collectio name == )
                                
                                
                                if(memberCollection.memberSurveyList)
                                {
                                    
                                    // log.info(memberCollection.memberSurveyList);
                                    

                                    const screenArray = Array.from(memberCollection.memberSurveyList);

                                
                                    let chapter7Values = null;

                                    
                                    
                                    

                                    let chapter7Results = screenArray.find(survey => 
                                        survey.surveyTemplate.name == "Social Health"
                                    );

                                    // log.info(chapter7Results);

                                    
                                    

                                    if(chapter7Results !==undefined)
                                    
                                        chapter7Values = JSON.parse(chapter7Results.responseJSON);

                                    
                                    

                                

                                    if(chapter7Values){

                                        
                                        household2_size.push(neighbourFunctions.household2_size(chapter7Values.household2_size));
                                        community_activity_participate.push(neighbourFunctions.community_activity_participate(chapter7Values.community_activity_participate));
                                        life_satisfaction2.push(neighbourFunctions.life_satisfaction2(chapter7Values.life_satisfaction2));
                                        local_community_belonging.push(neighbourFunctions.local_community_belonging(chapter7Values.local_community_belonging));
                                        lack_companionship.push(neighbourFunctions.lack_companionship(chapter7Values.lack_companionship));
                                        feel_leftout.push(neighbourFunctions.feel_leftout(chapter7Values.feel_leftout));
                                        feel_isolated.push(neighbourFunctions.feel_isolated(chapter7Values.feel_isolated));
                                        // Con_que.push(neighbourFunctions.Con_que(chapter7Values.Con_que));
                                        // log.info(neighbourFunctions.feel_isolated(chapter7Values.feel_leftout));

                                    }
                                    
                                    // log.info(life_satisfaction2);
                                    
                                }
                            
                            
                                
                            });
                    // log.info(neighboursChapter_ids);  
    
                    return res.status(200).json({
                        ID_PRF_SD: account_id,
                        SRVNum_PRF_SD: neighboursChapter_ids,
                        SRVD_PRF_SD: neighboursChapter_dates,
                        TINV_PRF_SD: account_involvement,
                        GEN_PRF_SD: account_gender,
                        DOB_PRF_SD: account_dob,
                        PC_PRF_SD: account_postalCode,
                        L_PRF_SD: account_language,
                        feel_isolated: feel_isolated,
                        feel_leftout: feel_leftout,
                        lack_companionship: lack_companionship,
                        local_community_belonging: local_community_belonging,
                        life_satisfaction2: life_satisfaction2,
                        community_activity_participate: community_activity_participate,
                        household2_size: household2_size,
                        // con_que: con_que,
                        // request: { 
                        //     type: 'GET',
                        //     url: config.server.protocol + '://' + config.server.hostname +':' + config.server.port + '/api/reports/Screen/user/' + req.params.userId
                        // }
                    
                        
                    });
                    
                
                }

                else
                {
                    return res.status(404).json({
                        message: "Collection information for user not found."
                    });
                }
                })
                .catch(error => {

                log.error(error.message);

                return res.status(500).json({
                    message: error.message
                });

                });
                }
                else
                {
                return res.status(404).json({
                });
                }

                })
                .catch(error => {

                log.error(error.message);

                return res.status(500).json({
                message: error.message
                });

    });                   

}
