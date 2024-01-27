const { Schema, model } = require('mongoose');

const ticketSchema = new Schema({
	ticketId: {
		type: Number,
		required: true,
	},
	member: {
		type: String,
		required: true,
	},
	channelId: {
		type: String,
		required: true,
	},
	opened: {
		type: Boolean,
		default: true,
	},
	reason: {
		type: String,
		required: true,
	},
});

module.exports = model('ticket', ticketSchema);