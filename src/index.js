const config = require("./config/index")
const Discord = require("discord.js")
const command = require('./discord/commandControllers')
const translate = require('./discord/translateControllers')
const cron = require('./discord/cronControllers')
const welcome = require("./discord/welcomeController")
const Agenda = require("agenda");
const mongoose = require('mongoose')
const Ae = require("./services/aeServices")

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

mongoose.connect(config.db.uri, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => {
    console.log("Connecté à MongoDB");
})
.catch((e) => {
    console.log("Erreur lors de la connection à MongoDB");
    console.log(e);
})

const agenda = new Agenda({db: {address: config.db.uri, collection: config.db.agendaCollection}});

client.on('ready', () => {
  const AeInstance = new Ae(client)
  AeInstance.resetName()
  client.user.setActivity('/help', {type: "WATCHING"});
  console.log("RobAnT is here !")
  
  command(client, AeInstance)
  cron(client, AeInstance)
  if (config.deepl) translate(client)
  if (config.channels.welcome && config.roles.guests && config.roles.admins ) welcome(client)
})

client.login(config.discord.token)