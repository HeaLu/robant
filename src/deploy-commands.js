const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const config = require('./config');

const commands = [
	new SlashCommandBuilder().setName('today').setDescription('Displays today Daily AnT'),
	new SlashCommandBuilder().setName('daily').setDescription('Displays today Daily AnT without emojis'),
	new SlashCommandBuilder().setName('tomorrow').setDescription('Displays tomorrow Daily AnT'),
	new SlashCommandBuilder().setName('monday').setDescription('Displays Monday Daily AnT'),
	new SlashCommandBuilder().setName('tuesday').setDescription('Displays Tuesday Daily AnT'),
	new SlashCommandBuilder().setName('wednesday').setDescription('Displays Wednesday Daily AnT'),
	new SlashCommandBuilder().setName('thursday').setDescription('Displays Thursday Daily AnT'),
	new SlashCommandBuilder().setName('friday').setDescription('Displays Friday Daily AnT'),
	new SlashCommandBuilder().setName('saturday').setDescription('Displays Saturday Daily AnT'),
	new SlashCommandBuilder().setName('sunday').setDescription('Displays next Sunday Daily AnT (groundhogs or war event)'),
	new SlashCommandBuilder().setName('ca').setDescription('Displays current Colony Actions'),
]
	.map(command => command.toJSON());

const rest = new REST({ version: '9' }).setToken(config.discord.token);

rest.put(Routes.applicationGuildCommands(config.discord.clientId, config.discord.guildId), { body: commands })
	.then(() => console.log('Successfully registered application commands.'))
	.catch(err => console.log(err))
