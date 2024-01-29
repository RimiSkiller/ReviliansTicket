const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const Points = require('../../models/staffPoints');
const { pointsChannel } = require('../../../configs/config.json');
const getMessage = require('../../utils/awaitInterraction/getMessage');

module.exports = {
	id: 'ticketApprove',
	/**
	 * @param {import('discord.js').Client} client
	 * @param {import('discord.js').ButtonInteraction} interaction
	 */
	callback: async (client, interaction) => {
		if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) return interaction.reply({ content: '**🚫 - Only highstaff can press this button.**', ephemeral: true });
		const user = interaction.message.mentions.users.first();
		const embed = EmbedBuilder.from(interaction.message.embeds[0]).setColor(0x00ff00);
		const data = await Points.findOne({ staff: user.id }) || new Points({ staff: user.id });
		await interaction.deferReply({ ephemeral: true });
		const addedPoints = await getMessage(interaction.user.id, interaction.channel, 30000);
		if (addedPoints == 'no-res' || isNaN(addedPoints)) return;
		if (addedPoints > 3 || addedPoints < 1) return interaction.reply({ content: '**● Added points must be between 1 and 3.**', ephemeral: true });
		data.points += Number(addedPoints);
		await data.save();
		client.channels.cache.get(pointsChannel).send({ embeds: [new EmbedBuilder().setDescription(`- **Added \`${addedPoints}\` points for staff <@${user.id}> for registering a ticket.**`).setColor(0x00ff00)] });
		interaction.message.edit({ embeds: [embed], components: [] });
		require('../../utils/helpers/pointMessage')(client);
	},
};