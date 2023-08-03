const mongoose = require('mongoose');

const publicSurveySchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    surveyTemplate: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Survey',
        required: true
    },
    memberInfo: {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            default: ""
        },
        phone: {
            type: String,
            default: ""
        },
        postalCode: {
            type: String,
            default: ""
        },
    },
    source: {   // How did you hear about us?
        type: String,
        default: ""
    },
    responseJSON: {
        type: String,
        default: ""
    },

},
{
    timestamps: true
});

module.exports = mongoose.model('PublicSurvey', publicSurveySchema);