const gpt = require('../../utils/helpers/gpt');

module.exports = {
	name: 'test',
	description: 'test',
	devOnly: true,
	/**
	 * @param {import('discord.js').Client} client
	 * @param {import('discord.js').ChatInputCommandInteraction} interaction
	 */
	callback: async (client, interaction) => {
		await interaction.deferReply();
		// await interaction.followUp({ content: '**● ' + await gpt(`a user named "${interaction.member.displayName}" opened a support ticket in the server, tell him to wait the staff and explain the problem he's facing in the meantime.`, `I want to act as a Discord bot, I'll write you a scenario that may happen in Discord server called "${interaction.guild.name}", you will send me the best message in arabic to reply to this scenario.`) + '**' });
		await interaction.followUp({ content: '**● ' + await gpt('ابي رسالة زي هذي بصيغتك ● مرحبًا RimiSkiller، شكرًا لفتحك تذكرة الدعم. يُرجى الانتظار قليلاً حتى يتمكن أحد أعضاء الفريق من الاطلاع على طلبك ومساعدتك. يُرجى توضيح المشكلة التي تواجهها بشكل مفصل ليتمكن الفريق من تقديم المساعدة بأفضل طريقة ممكنة. نشكرك على صبرك وتفهمك.') + '**' });
	},
};