const { PermissionFlagsBits, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');

module.exports = {
	name: 'setup',
	description: 'send the panel to open tickets',
	permissions: PermissionFlagsBits.ManageGuild,

	/**
	 * @param {import('discord.js').Client} client
	 * @param {import('discord.js').ChatInputCommandInteraction} interaction
	 */
	callback: async (client, interaction) => {
		const embed = new EmbedBuilder()
			.setColor(client.color)
			.setTitle('Support Ticket')
			.setThumbnail(client.user.avatarURL())
			.setDescription('**● في حال واجهتك أي مشكلة في السيرفر, قم بفتح تذكرة عبر الضغط على الزر في الأسفل و انتظار الدعم الفني.**')
			.setFooter({ text: 'Revilians Systems.' });
		const button = new ButtonBuilder({ emoji: '🎫', customId: 't-open', label: ' | إفتح تذكرة', style: ButtonStyle.Success });
		interaction.channel.send({ embeds: [embed], components: [new ActionRowBuilder().addComponents(button)] });
		interaction.reply({ content: '**● Done.**', ephemeral: true });
	},
};