const { ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const discordTranscripts = require('discord-html-transcripts');
const tickets = require('../../models/tickets');
const gpt = require('../../utils/helpers/gpt');

module.exports = {
	name: 'close',
	description: 'close an opened ticket',
	options: [
		{
			type: ApplicationCommandOptionType.Boolean,
			name: 'instant',
			description: 'if set to true, the command will close the ticket immediately',
			required: false,
		},
	],

	/**
	 * @param {import('discord.js').Client} client
	 * @param {import('discord.js').ChatInputCommandInteraction} interaction
	 */
	callback: async (client, interaction) => {
		const instant = interaction.options.get('instant')?.value;
		const ticket = await tickets.findOne({ channelId: interaction.channelId, opened: true });
		await interaction.deferReply();
		if (!ticket) return interaction.editReply({ content: '**● This command only works in opened tickets.**', ephemeral: true });
		if (!instant) {
			await interaction.editReply({ embeds: [new EmbedBuilder().setDescription(await gpt(`a member finished talking with a staff named "${(await interaction.guild.members.fetch(ticket.staff)).displayName}" in a ticket support, send a message to the member hopping that his problem (${ticket.reason}) got solved and the staff did well in his work, don't mention the member name.`)).setColor(client.color)] });
			const msg = await interaction.channel.awaitMessages({ time: 10_000, max: 1, filter: m => m.author.id == interaction.user.id }).catch(() => null);
			if (msg.size) {
				msg.first().delete();
				interaction.deleteReply();
				return;
			}
		}
		interaction.channel.permissionOverwrites.edit(ticket.member, { ViewChannel: false });
		interaction.channel.send({ embeds: [new EmbedBuilder().setColor(client.color).setDescription('**● Ticket Closed.**')] });
		const attachment = await discordTranscripts.createTranscript(interaction.channel, {
			filename: `ticket-${ticket.ticketId.toString().padStart(4, '0')}.html`,
			saveImages: true,
			footerText: '● Revilians custom tickets system.',
			poweredBy: false,
		});
		ticket.opened = 'false';
		await ticket.save();
		const msgs = await interaction.channel.messages.fetch();
		const addIds = [...new Set(msgs.map(msg => msg.author.id))].filter(id => id != client.user.id || id != ticket.staff || id != ticket.member);
		require('./ticketRegister/register')(client, {
			id: ticket.ticketId,
			member: ticket.member,
			staff: ticket.staff,
			openTime: interaction.channel.createdTimestamp,
			closeTime: Date.now(),
			transcript: attachment,
			reason: ticket.reason,
			addIds: addIds,
		});
	},
};