const { ApplicationCommandOptionType } = require('discord.js');

module.exports = {
	name: 'add-member',
	description: 'add a member to the ticket.',
	options: [
		{
			name: 'member',
			description: 'the member you want to add.',
			required: true,
			type: ApplicationCommandOptionType.User,
		},
	],
	/**
	 * @param {import('discord.js').Client} client
	 * @param {import('discord.js').ChatInputCommandInteraction} interaction
	 */
	callback: async (client, interaction) => {
		if (!interaction.member.roles.cache.has(staffRole) && !interaction.member.roles.cache.has(highstaffRole)) return interaction.deferUpdate();
	},
};