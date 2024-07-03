const mongoose = require('mongoose');

const workbookSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {
        type: String, 
        required: true,
        unique: true
    },
    collections: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'Collection' }
    ],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    modifiedBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
},
{
    timestamps: true
});

module.exports = mongoose.model('Workbook', workbookSchema);
