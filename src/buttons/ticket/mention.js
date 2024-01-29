const tickets = require('../../models/tickets');

module.exports = {
	id: 't-mention',
	/**
	 * @param {import('discord.js').Client} client
	 * @param {import('discord.js').ButtonInteraction} interaction
	*/
	callback: async (client, interaction) => {
		if (interaction.user.id != (await tickets.findOne({ channelId: interaction.channelId })).member) return interaction.deferUpdate();
		if (client.mCoolDown.has(interaction.user.id)) return interaction.reply({ content: `**● يجب عليك الانتظار <t:${Math.floor(client.mCoolDown.get(interaction.user.id) / 1000)}:R> قبل عمل منشن لطاقم الإدارة**`, ephemeral: true });
		interaction.reply(`<@&${require('../../../configs/config.json').staffRole}>`);
		client.mCoolDown.set(interaction.user.id, Date.now() + 900000);
		setTimeout(() => client.mCoolDown.delete(interaction.user.id), 900000);
	},
};