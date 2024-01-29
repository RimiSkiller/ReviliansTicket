const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const { ticketRegister } = require('../../../../configs/config.json');
const tickets = require('../../../models/tickets');
/**
 * @param {import('discord.js').Client} client
 */
module.exports = async (client, ticketData) => {
	const channel = client.channels.cache.get(ticketRegister);
	const memberTickets = (await tickets.find({ member: ticketData.member })).length;
	const staffTickets = (await tickets.find({ staff: ticketData.staff })).length;
	const member = await client.users.fetch(ticketData.member, { cache: false });
	const ticketEmbed = new EmbedBuilder()
		.setAuthor({ name: `[${member.username}] Ticket #${memberTickets}`, iconURL: member.avatarURL() })
		.setColor(client.color)
		.addFields(
			{ name: '● Id:', value: ticketData.id.toString().padStart(4, '0') },
			{ name: '● Member:', value: `<@${ticketData.member}> (${ticketData.member})` },
			{ name: '● Staff:', value: `<@${ticketData.staff}> (${ticketData.staff})` },
			{ name: '● Opened:', value: `<t:${Math.floor(ticketData.openTime / 1000)}:f>` },
			{ name: '● Closed:', value: `<t:${Math.floor(ticketData.closeTime / 1000)}:f>` },
			{ name: '● Additional staff:', value: ticketData.addIds.length ? ticketData.addIds.map(id => `<@${id}>`).join(', ') : 'No additional staff' },
		)
		.setFooter({ text: client.mainServer.name, iconURL: client.mainServer.iconURL() });
	const b1 = new ButtonBuilder({ customId: 'ticketApprove', label: 'Approve', style: ButtonStyle.Success });
	const b2 = new ButtonBuilder({ customId: 'ticketRefuse', label: 'Refuse', style: ButtonStyle.Danger });
	await channel.send({ content: `## <@${ticketData.staff}> **\`#${staffTickets}\`**`, embeds: [ticketEmbed], files: [ticketData.transcript], components: [new ActionRowBuilder().addComponents(b1, b2)] });
};