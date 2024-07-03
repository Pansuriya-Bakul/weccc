const mongoose = require('mongoose');

const noteSchema = mongoose.Schema(
	{
		_id: mongoose.Schema.Types.ObjectId,
		senderId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true
		},
		receiverId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true
		},
		message: {
			type: String,
			required: true
		},
		status: {
			type: String,
			description: 'Note status',
			enum: ['read', 'unread'],
			default: 'unread'
		},
		pdf: {
			url: {
				type: String,
				required: false
			},
			fileName: {
				type: String,
				required: false
			},
			fileSize: {
				type: Number,
				required: false
			}
		}
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Note', noteSchema);
