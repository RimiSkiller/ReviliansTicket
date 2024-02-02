const { highstaffRole } = require('../../../configs/config.json');
const tickets = require('../../models/tickets');

module.exports = {
	name: 'delete',
	description: 'delete a closed ticket',
	/**
	 * @param {import('discord.js').Client} client
	 * @param {import('discord.js').ChatInputCommandInteraction} interaction
	 */
	callback: async (client, interaction) => {
		if (!interaction.member.roles.cache.has(highstaffRole)) return interaction.deferUpdate();
		if (!(await tickets.findOne({ channelId: interaction.channelId, opened: false }))) return interaction.reply({ content: '**● Use this command in a closed ticket only.**', ephemeral: true });
		await interaction.reply('**● This ticket will be deleted in 5 seconds, send any message to cancel.**');
		const msg = await interaction.channel.awaitMessages({ time: 5_000, max: 1, filter: m => m.author.id == interaction.user.id }).catch(() => null);
		if (msg.size) {
			msg.first().delete();
			interaction.deleteReply();
			return;
		}
		interaction.channel.delete();
	},
};