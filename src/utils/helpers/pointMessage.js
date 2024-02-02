const Points = require('../../models/staffPoints');
const { pointsChannel } = require('../../../configs/config.json');
const { EmbedBuilder } = require('discord.js');

/**
 * @param {import('discord.js').Client} client
 */
module.exports = async (client) => {
	const data = await Points.find();
	data.sort((a, b) => b.points - a.points);
	const dataShow = data.map(a => `- <@${a.staff}><:arrow:1170430004493033594>${a.points}`);
	const channelShow = client.channels.cache.get(pointsChannel);
	const embed = new EmbedBuilder()
		.setTitle('Staff Points System')
		.setDescription(dataShow.join(',\n'))
		.setThumbnail(channelShow.guild.iconURL())
		.setFooter({ text: 'Last Updated' })
		.setColor(client.color)
		.setTimestamp(Date.now());
	const messageShow = await channelShow.messages.fetch();
	if (messageShow.size == 0) channelShow.send({ embeds: [embed] });
	else messageShow.first().edit({ embeds: [embed] });
};
