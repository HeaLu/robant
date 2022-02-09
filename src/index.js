const config = require("./config/index")
const Discord = require("discord.js")
const command = require('./discord/commandControllers')
const translate = require('./discord/translateControllers')
const cron = require('./discord/cronControllers')
const welcome = require("./discord/welcomeController")

const client = new Discord.Client({
  intents: [
    Discord.Intents.FLAGS.GUILDS,
    Discord.Intents.FLAGS.DIRECT_MESSAGES,
    Discord.Intents.FLAGS.GUILD_MESSAGES,
    Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    Discord.Intents.FLAGS.GUILD_MEMBERS
  ],
	partials: ['MESSAGE', 'CHANNEL', 'REACTION']
})

client.on('ready', async () => {
  const expedition = await client.channels.cache.get(config.channels.expedition)
  if (expedition.name !== "🌴-alliance-expedition") await client.channels.cache.get(config.channels.expedition).setName(`🌴-alliance-expedition`)

  //await client.channels.cache.get(config.channels.expedition).setName(`🌴-alliance-expedition`)
  client.user.setActivity('/help', {type: "WATCHING"});
  console.log("RobAnT is here !")
  
  command(client)
  cron(client)
  if (config.deepl) translate(client)
  if (config.channels.welcome && config.roles.guests && config.roles.admins ) welcome(client)
})

client.login(config.discord.token)