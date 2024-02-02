const { ModalBuilder, ActionRowBuilder, TextInputStyle, TextInputBuilder, ChannelType, EmbedBuilder, ButtonStyle, ButtonBuilder } = require('discord.js');
const Tickets = require('../../models/tickets');
const { newTickets } = require('../../../configs/config.json');
const gpt = require('../../utils/helpers/gpt');
const { ticketCategory, staffRole, highstaffRole } = require('../../../configs/config.json');

module.exports = {
	id: 't-open',
	/**
	 * @param {import('discord.js').Client} client
	 * @param {import('discord.js').ButtonInteraction} interaction
	*/
	callback: async (client, interaction) => {
		const oldOne = await Tickets.findOne({ member: interaction.user.id, opened: true });
		if (oldOne) {
			interaction.deferReply({ ephemeral: true });
			return interaction.editReply({ content: '**● ' + await gpt(`a member trying to open a support ticket but he already has an opened one, inform him about that and mention the member's ticket channel with the id: "${oldOne.channelId}", don't mention the member, the message must be in Arabic`, interaction.guild.name) + '**' });
		}
		const modal = new ModalBuilder({
			customId: `Ticket-${interaction.user.id}`,
			title: 'Support Ticket',
			components: [
				new ActionRowBuilder({
					components: [
						new TextInputBuilder({
							customId: 'reason',
							label: '● سبب الفتح:',
							placeholder: 'الرجاء ذكر سبب فتح تذكرة الدعم لتحصل على المساعدة في أسرع وقت',
							style: TextInputStyle.Short,
							required: true,
						}),
					],
				}),
				new ActionRowBuilder({
					components: [
						new TextInputBuilder({
							customId: 'ad-ex',
							label: '● شرح إضافي',
							placeholder: 'يمكنك شرح مشكلتك بالتفصيل, يساعد ذلك في حل مشكلتك بشكل أسرع (إختياري)',
							style: TextInputStyle.Paragraph,
							required: false,
						}),
					],
				}),
			],
		});
		interaction.showModal(modal);
		const modalInteraction = await interaction.awaitModalSubmit({ time: 120_000, filter: m => m.customId == `Ticket-${interaction.user.id}` }).catch(() => null);
		if (modalInteraction) {
			await modalInteraction.deferReply({ ephemeral: true });
			const ticketId = ((await Tickets.find()).length + 1).toString().padStart(4, '0');
			interaction.guild.channels.create({
				name: `ticket-${ticketId}`,
				type: ChannelType.GuildText,
				parent: ticketCategory,
				permissionOverwrites: [
					{
						id: interaction.guild.roles.everyone.id,
						deny: ['ViewChannel'],
					},
					{
						id: interaction.user.id,
						allow: ['ViewChannel', 'AttachFiles', 'SendMessages', 'UseApplicationCommands'],
					},
					{
						id: staffRole,
						allow: ['ViewChannel', 'AttachFiles', 'UseApplicationCommands', 'ManageMessages', 'MentionEveryone'],
						deny: ['SendMessages'],
					},
					{
						id: highstaffRole,
						allow: ['ViewChannel', 'AttachFiles', 'UseApplicationCommands', 'ManageMessages', 'SendMessages'],
					},
				],
				topic: `⨠ Ticket Id: ${ticketId},\n⨠ Member: <@${interaction.user.id}>,\n⨠ Reason: ${modalInteraction.fields.getField('reason').value},`,
				rateLimitPerUser: 3,
			}).then(async channel => {
				const embed = new EmbedBuilder()
					.setColor(client.color)
					.setTitle('Support Ticket')
					.setThumbnail(client.user.displayAvatarURL())
					.addFields({ name: modalInteraction.fields.getField('reason').value, value: modalInteraction.fields.getField('ad-ex')?.value || 'لا شرح إضافي' })
					.setFooter({ text: `Opened By: ${interaction.member.displayName}`, iconURL: interaction.member.displayAvatarURL() })
					.setTimestamp();
				channel.send({
					embeds: [embed], components: [new ActionRowBuilder()
						.addComponents(new ButtonBuilder({ customId: 't-mention', label: 'Mention Staff', style: ButtonStyle.Primary }))
						.addComponents(new ButtonBuilder({ customId: 't-claim', label: 'Claim Ticket (Staff)', style: ButtonStyle.Success }))],
				});
				modalInteraction.editReply('**● ' + await gpt(`a member opened a support ticket in the server, tell him to wait the staff and explain the problem he's facing in the meantime, mention the ticket channel with the id "${channel.id}" in a new line, don't mention the member, write the message in Arabic`, interaction.guild.name) + '**');
				client.channels.cache.get(newTickets).send({ content: `<@&1200477671071698944>\n**<@${interaction.user.id}> opened a ticket(#${ticketId}) with reason of:**\n\`\`\`${modalInteraction.fields.getField('reason').value}\`\`\``, components: [new ActionRowBuilder().addComponents(new ButtonBuilder({ label: 'Check', style: ButtonStyle.Link, url: channel.url }))] });
				await new Tickets({ member: interaction.user.id, channelId: channel.id, reason: modalInteraction.fields.getField('reason').value, ticketId: ticketId }).save();
				client.mCoolDown.set(interaction.user.id, Date.now() + 180000);
				setTimeout(() => client.mCoolDown.delete(interaction.user.id), 180000);
			});
		}
		// await new Tickets({ member: interaction.user.id, channelId: interaction.channelId }).save();
	},
};