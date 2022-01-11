const config = require("./config/index")
const Discord = require("discord.js")
const daily = require('./discord/dailyControllers')
const translate = require('./discord/translateControllers')
const cron = require('./discord/cronControllers')

const client = new Discord.Client({
  intents: [
    Discord.Intents.FLAGS.GUILDS,
    Discord.Intents.FLAGS.GUILD_MESSAGES,
    Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS
  ],
	partials: ['MESSAGE', 'CHANNEL', 'REACTION']
})

client.on('ready', () => {
  console.log("AnT Reminder est dans la place !")
  daily(client)
  translate(client)
  cron(client)
})

client.login(config.discord.token)