const { staffRole, highstaffRole } = require('../../../configs/config.json');
const tickets = require('../../models/tickets');

module.exports = {
	id: 't-claim',
	/**
	 * @param {import('discord.js').Client} client
	 * @param {import('discord.js').ButtonInteraction} interaction
	*/
	callback: async (client, interaction) => {
		if (!interaction.member.roles.cache.has(staffRole) && !interaction.member.roles.cache.has(highstaffRole)) return interaction.deferUpdate();
		const ticket = await tickets.findOne({ channelId: interaction.channelId });
		if (!ticket.staff) ticket.staff = interaction.user.id;
		interaction.channel.permissionOverwrites.create(interaction.user.id, { SendMessages: true });
		await interaction.reply(`**● سيكون <@${interaction.user.id}> هو مساعدك من طاقم الإدارة في هذه التذكرة.**`);
		await interaction.channel.setTopic(`${interaction.channel.topic}\n⨠ Staff: <@${interaction.user.id}>`);
		interaction.message.edit({ components: [] });
		await ticket.save();
	},
};