const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const config = require('./config');
const { days, goals, next } = require('./tools/constants');

const commands = [
	new SlashCommandBuilder()
	.setName('daily')
	.setDescription('Shows The Daily AnT')
	.addStringOption(option => { option
		option.setName("weekday")
		option.setDescription('The day you want to display The Daily AnT')
		option.setRequired(true)
		for (const day of Object.keys(next)) {
			option.addChoice(day, day)
		}
		return option
	})
	.addBooleanOption(option => option
		.setName("ingame")
		.setDescription('if True will be displayed without emojis, ready to copy-paste ingame')
		.setRequired(false)
	),
	new SlashCommandBuilder()
		.setName('ca')
		.setDescription('Display colony action')
		.addSubcommand(subcommand => subcommand
			.setName('svs')
			.setDescription('Give the all day colony actions matching with SvS goals')
			.addStringOption(option => { option
				.setName("weekday")
				.setDescription('The day you want to display colony actions matching with SvS goals')
				.setRequired(true)
				for (const day of Object.keys(next)) {
					option.addChoice(day, day)
				}
				return option
			})
		)
		.addSubcommand(subcommand => subcommand
			.setName('allday')
			.setDescription('Give the all day colony actions')
			.addStringOption(option => { option
				.setName("weekday")
				.setDescription('The day you want to display colony actions')
				.setRequired(true)
				for (const day of Object.keys(next)) {
					option.addChoice(day, day)
				}
				return option
			})
		)
		.addSubcommand(subcommand => subcommand
			.setName('search')
			.setDescription('Search for a matching goal in all colony actions of a day')
			.addStringOption(option => { option
				.setName("weekday")
				.setDescription('The day you want to search matching colony actions matching in')
				.setRequired(true)
				for (const day of Object.keys(next)) {
					option.addChoice(day, day)
				}
				return option
			})
			.addStringOption(option => { option
				.setName("goal")
				.setDescription('The goal you purchase')
				.setRequired(true)
				for (const [key, value] of Object.entries(goals)) {
					option.addChoice(value.pic+" - "+value.label, key)
				}
				return option
			})
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
			.addStringOption(option => { option
				.setName("weekday")
				.setDescription('The day you want to display colony actions. If omitted, today will be used')
				.setRequired(false)
				for (const day of Object.keys(next)) {
					option.addChoice(day, day)
				}
				return option
			})
		),
	new SlashCommandBuilder().setName('help').setDescription('Show all commands and functionnalities of RobAnT'),
	new SlashCommandBuilder()
		.setName('ae')
		.setDescription('Configures this week Alliance Expedition Time')
		.addSubcommand(subcommand => subcommand
			.setName('start')
			.setDescription('Start the countdown to Alliance Expedition')	
			.addStringOption(option => option
				.setName('hour')
				.setDescription('Set UTC hour')
				.setRequired(true)
				.addChoice('11h UTC', "11")
				.addChoice('12h UTC', "12")
				.addChoice('20h UTC', "13")
				.addChoice('23h UTC', "14")		
			)
		)
		.addSubcommand(subcommand => subcommand
			.setName("stop")
			.setDescription('Stop the countdown to Alliance Expedition')
		)
		.addSubcommand(subcommand => subcommand
			.setName("restart")
			.setDescription('Restart the countdown to Alliance Expedition with a new delay')	
			.addStringOption(option => option
				.setName('hour')
				.setDescription('Set UTC hour')
				.setRequired(true)
				.addChoice('11h UTC', "11")
				.addChoice('12h UTC', "12")
				.addChoice('20h UTC', "13")
				.addChoice('23h UTC', "14")		
			)
		)
]
	.map(command => command.toJSON());

const rest = new REST({ version: '9' }).setToken(config.discord.token);

rest.put(Routes.applicationGuildCommands(config.discord.clientId, config.discord.guildId), { body: commands })
	.then(() => console.log('Successfully registered application commands.'))
	.catch(err => console.log(err))
