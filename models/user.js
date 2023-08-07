/*
=====================================================
This sets the model for each user by mongoose

"Facility They Belong To, Enabled?, Email, Password,
Their Role, Personal Info, Research Type, timestamp"
=====================================================
*/

const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    sequence_id: {
        type: Number
    },
    facilityId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Facility',
        required: true
    },
    enabled: {
        type: Boolean,
        required: true
    },
    email: {
        type: String,
        // unique: true,
        // required: function() {
        //     return this.role != "Patient";
        // }
        required: false
    },
    password: {
        type: String
    },
    role: {
        type: String,
        enum: ["Admin", "Coordinator", "Volunteer", "Patient"],
        required: true,
    },
    patients: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'User',
    },
    workers: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'User'
    },
    projectList: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Project'
    },
    collectionList: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Collection'
    },
    memberCollectionList: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'MemberCollection'
    },
    memberSurveyList: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'MemberSurvey'
    },
    info: {
        name: {
            type: String,
            required: true
        },
        gender: {
            type: String,
            // required: true        
        },
        dateOfBirth: {
            type: Date,
            // required: true
        },
        phone: {
            type: String,
        },
        language: {
            type: String,
            // required: true
        },
        currentAddress: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Address'
        },
        pastAddresses: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: 'Address'
        },
        referral: {
            type: String,
        },
    },
    volInfo: {
        volType: {
            type: String,
        },
        startDate: {
            type: Date,
        },
        endDate: {
            type: Date,
        },
        fieldOfStudy: {
            type: String,
        },
        school: {
            type: String,
        },
    },
    memberStatusInfo: {
        activeType: {
            type: String,
        },
        statusHistory: {
            type: Array,
        },
        referralDate: {
            type: Date,
        },
        terminationReason: {
            type: String,
        },
        deceasedDate: {
            type: Date,
        },
    },
    research: {
        full: {
            type: String
        },
        prefix: {
            type: String
        },
        u_no: {
            type: Number
        },
        enabled: {
            type: Boolean,
            default: false
        }
    },
    status : {
        type: String,
        required: true
    }
},
    {
        timestamps: true
    });

module.exports = mongoose.model('User', userSchema);