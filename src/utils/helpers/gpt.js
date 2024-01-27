const { OpenAI } = require('openai');
const openai = new OpenAI({ apiKey: process.env.OPEN_AI });
/**
 * @param {String} promote
 * @param {String} guildName
 */
module.exports = async (promote, guildName) => {
	const res = await openai.chat.completions.create({
		model: 'gpt-3.5-turbo',
		messages: [
			{
				role: 'system',
				content: `I want you to act as a Discord bot, I'll write you a scenario that may happen in Discord server called "${guildName}", you will send me a short message to reply to this scenario, users names must be in English. if you been given a channel id to mention you type "<#channel-id>" to mention the channel, the message must be in Arabic.`,
			},
			{
				role: 'user',
				content: promote,
			},
		],
	});
	return res.choices[0].message.content;
};