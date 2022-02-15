const config = require("./config/index")
const Discord = require("discord.js")
const command = require('./discord/commandControllers')
const translate = require('./discord/translateControllers')
const cron = require('./discord/cronControllers')
const welcome = require("./discord/welcomeController")
const Agenda = require("agenda");
const mongoose = require('mongoose')
/* const { utcToZonedTime, zonedTimeToUtc, formatInTimeZone, getTimezoneOffset } = require("date-fns-tz")
const enGB = require('date-fns/locale/en-GB')
const { getDay, parseISO } = require("date-fns")

const date = formatInTimeZone(new Date(), 'Australia/Hobart', 'yyyy-MM-dd HH:mm:ss z', { locale: enGB })
const test = new Date(date)
const dayFr = getDay(new Date())
const dayAus = getDay(test)
const offset = getTimezoneOffset('Australia/Hobart')
let test2 = test*1 + offset*1
test2 = new Date(test2)
console.log(dayFr, dayAus);
console.log(date);
console.log(test);
console.log(test2); */

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
  const expedition = client.channels.cache.get(config.channels.expedition)
  if (expedition.name !== "🌴-alliance-expedition") client.channels.cache.get(config.channels.expedition).setName(`🌴-alliance-expedition`)

  //await client.channels.cache.get(config.channels.expedition).setName(`🌴-alliance-expedition`)
  client.user.setActivity('/help', {type: "WATCHING"});
  console.log("RobAnT is here !")
  
  command(client)
  cron(client)
  if (config.deepl) translate(client)
  if (config.channels.welcome && config.roles.guests && config.roles.admins ) welcome(client)
})

client.login(config.discord.token)