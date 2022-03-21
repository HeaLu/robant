const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const config = require('./config');
const { goals, next } = require('./tools');

const formatDaysProposals = (option) => {
	for (const day of Object.keys(next)) {
		option.addChoice(day[0].toUpperCase() + day.substring(1), day)
	}
}

const commands = [
	new SlashCommandBuilder()
	.setName('dailymail')
	.setDescription('You want a daily mail ?')
	.addBooleanOption(option => option
		.setName("subscribe")
		.setDescription('if True will be send you a daily mail with colony actions')
		.setRequired(true)
	),
	new SlashCommandBuilder()
	.setName('daily')
	.setDescription('Shows The Daily AnT')
	.addStringOption(option => { option
		option.setName("weekday")
		option.setDescription('The day you want to display The Daily AnT')
		option.setRequired(true)
		formatDaysProposals(option)
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
				formatDaysProposals(option)
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
				formatDaysProposals(option)
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
				formatDaysProposals(option)
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
			.addStringOption(option => { option
				.setName("weekday")
				.setDescription('The day you want to display colony actions. If omitted, today will be used')
				.setRequired(true)
				formatDaysProposals(option)
				return option
			})
			.addIntegerOption(option => option
				.setName('hours')
				.setDescription('The hour you want to display colony actions')
				.setRequired(true)
				.setMinValue(0)
				.setMaxValue(23)
			)
		),
	new SlashCommandBuilder()
	.setName('timezone')
	.setDescription('Show or set your current timezone')
	.addStringOption(option =>option
		.setName("set")
		.setDescription('Set your timezone to make commands giving answers in your own time (example: "Europe/Paris")')
		.setRequired(false)
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
			.addChoice('20h UTC', "20")
			.addChoice('23h UTC', "23")		
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
			.addChoice('20h UTC', "20")
			.addChoice('23h UTC', "23")		
		)
	),
	new SlashCommandBuilder()
	.setName('birthdate')
	.setDescription('Set your birthdate')
	.addIntegerOption(option => option
		.setName('year')
		.setDescription('Year of your birth')
		.setRequired(true)
		.setMinValue(1900)
		.setMaxValue(2020)
	)
	.addIntegerOption(option => option
		.setName('month')
		.setDescription('Month of your birth')
		.setRequired(true)
		.addChoice('01-January', 0)
		.addChoice('02-February', 1)
		.addChoice('03-March', 2)
		.addChoice('04-April', 3)
		.addChoice('05-May', 4)
		.addChoice('06-June', 5)
		.addChoice('07-July', 6)
		.addChoice('08-August', 7)
		.addChoice('09-September', 8)
		.addChoice('10-October', 9)
		.addChoice('11-November', 10)
		.addChoice('12-December', 11)
	)
	.addIntegerOption(option => option
		.setName('day')
		.setDescription('Day of your birth')
		.setRequired(true)
		.setMinValue(1)
		.setMaxValue(31)
	),
	new SlashCommandBuilder()
	.setName('duel')
	.setDescription('Find the hidden army and give your battle order')
	.addNumberOption(option => option
		.setName('total')
		.setDescription('Total power of army value in M')
		.setRequired(true)
		.setMinValue(0)
		.setMaxValue(20)
	)
	.addNumberOption(option => option
		.setName('first')
		.setDescription('Power of 1st army in M (set 0 if hidden)')
		.setRequired(true)
		.setMinValue(0)
		.setMaxValue(8)
	)
	.addNumberOption(option => option
		.setName('second')
		.setDescription('Power of 2nd army in M (set 0 if hidden)')
		.setRequired(true)
		.setMinValue(0)
		.setMaxValue(8)
	)
	.addNumberOption(option => option
		.setName('third')
		.setDescription('Power of 3rd army in M (set 0 if hidden)')
		.setRequired(true)
		.setMinValue(0)
		.setMaxValue(8)
	)
]
	.map(command => command.toJSON());

const rest = new REST({ version: '9' }).setToken(config.discord.token);

rest.put(Routes.applicationGuildCommands(config.discord.clientId, config.discord.guildId), { body: commands })
	.then(() => console.log('Successfully registered application commands.'))
	.catch(err => console.log(err))
