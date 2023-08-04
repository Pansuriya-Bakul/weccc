const mongoose = require("mongoose");

const NodeRSA = require('node-rsa');
const fs = require('fs');
const bcrypt = require('bcryptjs');

const Survey = require("../models/survey");
const config = require("../config/config");
const PublicSurvey = require("../models/publicSurvey");

// ====================================================
// Encryption routes for keys and extracting keys
// ====================================================

let key_private = new NodeRSA();
let key_public = new NodeRSA();

var public = fs.readFileSync('./Keys/public.pem', 'utf8');
var private = fs.readFileSync('./Keys/private.pem', 'utf8');

key_private.importKey(private);
key_public.importKey(public);

// ====================================================
// Create a new Record
// ====================================================
exports.create = (req, res, next) => {
    console.log(req.body);
    const memberInfo = {
        name: key_public.encrypt(req.body.memberInfo.name, 'base64'),
        email: req.body.memberInfo.email,
        phone: req.body.memberInfo.phone,
        postalCode: req.body.memberInfo.postalCode,
    };

    const publicSurvey = new PublicSurvey({
        _id: new mongoose.Types.ObjectId(),
        surveyTemplate: req.body.surveyTemplate,
        memberInfo: memberInfo,
        source: req.body.source,
        responseJSON: JSON.stringify(req.body.responseJSON),
    });
    publicSurvey.save()
        .then(result => {
            res.status(201).json({
                message: 'PublicSurvey created successfully',
                createdPublicSurvey: {
                    _id: result._id,
                    surveyTemplate: result.surveyTemplate,
                    memberInfo: result.memberInfo,
                    responseJSON: result.responseJSON,
                    request: {
                        type: 'GET',
                        url: config.url + '/publicSurvey/' + result._id
                    }
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err,
                message: 'PublicSurvey creation failed'
            });
        });
};