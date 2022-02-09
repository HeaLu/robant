const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const config = require('./config');

const commands = [
	new SlashCommandBuilder()
	.setName('daily')
	.setDescription('Shows The Daily AnT')
	.addStringOption(option => option
		.setName("weekday")
		.setDescription('The day you want to display The Daily AnT')
		.setRequired(true)
		.addChoice("today", "today")
		.addChoice("tomorrow", "tomorrow")
		.addChoice("monday", "monday")
		.addChoice("tuesday", "tuesday")
		.addChoice("wednesday", "wednesday")
		.addChoice("thursday", "thursday")
		.addChoice("friday", "friday")
		.addChoice("saturday", "saturday")
		.addChoice("sunday", "sunday")
	)
	.addBooleanOption(option => option
		.setName("ingame")
		.setDescription('if True will be displayed without emojis, ready to copy-paste ingame')
		.setRequired(false)
	),
	new SlashCommandBuilder()
		.setName('ca')
		.setDescription('Display colony action')
		.addSubcommand(subcommand => subcommand
			.setName('allday')
			.setDescription('Give the all day colony actions matching with SvS goals')
			.addStringOption(option => option
				.setName("weekday")
				.setDescription('The day you want to display colony actions matching with SvS goals')
				.setRequired(true)
				.addChoice("today", "today")
				.addChoice("tomorrow", "tomorrow")
				.addChoice("monday", "monday")
				.addChoice("tuesday", "tuesday")
				.addChoice("wednesday", "wednesday")
				.addChoice("thursday", "thursday")
				.addChoice("friday", "friday")
				.addChoice("saturday", "saturday")
				.addChoice("sunday", "sunday")
			)
		)
		.addSubcommand(subcommand => subcommand
			.setName('hour')
			.setDescription('Choose a day and hour to get its colony actions')
			.addIntegerOption(option => option
				.setName('hour')
				.setDescription('The UTC hour you want to display colony actions')
				.setRequired(true)
				.setMinValue(0)
				.setMaxValue(23)
			)
			.addStringOption(option => option
				.setName("weekday")
				.setDescription('The day you want to display colony actions. If omitted, today will be used')
				.setRequired(false)
				.addChoice("today", "today")
				.addChoice("tomorrow", "tomorrow")
				.addChoice("monday", "monday")
				.addChoice("tuesday", "tuesday")
				.addChoice("wednesday", "wednesday")
				.addChoice("thursday", "thursday")
				.addChoice("friday", "friday")
				.addChoice("saturday", "saturday")
				.addChoice("sunday", "sunday")
			)
		),
	new SlashCommandBuilder().setName('help').setDescription('Show all commands and functionnalities of RobAnT'),
	new SlashCommandBuilder()
		.setName('ae')
		.setDescription('Configures this week Alliance Expedition Time')
		.addStringOption(option => option
			.setName('hour')
			.setDescription('Set UTC hour')
			.setRequired(true)
			.addChoice('11h UTC', "11")
			.addChoice('12h UTC', "12")
			.addChoice('20h UTC', "13")
			.addChoice('23h UTC', "14")
		)
]
	.map(command => command.toJSON());

const rest = new REST({ version: '9' }).setToken(config.discord.token);

rest.put(Routes.applicationGuildCommands(config.discord.clientId, config.discord.guildId), { body: commands })
	.then(() => console.log('Successfully registered application commands.'))
	.catch(err => console.log(err))
