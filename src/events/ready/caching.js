const config = require('../../../configs/config.json');

/**
 * @param {import('discord.js').Client} client
 */
module.exports = async (client) => {
	// channels
	client.log = async (m) => (await client.channels.fetch(config.mainlog, { cache: true })).send(m);

	// servers
	client.mainServer = await client.guilds.fetch(config.mainserver);
	client.staffServer = await client.guilds.fetch(config.testServer);

	// roles

	// messages

	// members

	// client variables
	client.color = 0xd2aaf8;
};