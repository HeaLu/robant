const config = require("./config/index")
const Discord = require("discord.js")
const command = require('./discord/commandControllers')
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

client.on('ready', async () => {
  console.log("AnT Reminder est dans la place !")
  command(client)
  translate(client)
  cron(client)
  //const test = await client.users.fetch('277817818815266827')
  //test.send('🪖')
})

client.login(config.discord.token)