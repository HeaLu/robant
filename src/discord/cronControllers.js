const CronJob = require('cron').CronJob
const daily = require('../services/dailyServices')
const ca = require('../services/caServices')
const { nextFriday, format } = require('date-fns')
const config = require('../config')
const { MessageEmbed } = require('discord.js')


module.exports = client => {
  const dailyAnt = new CronJob('00 00 00 * * *', function() {
    const today = new Date()
    client.channels.cache.get(config.channels.officers).send(daily.getGameDaily(today))
    client.channels.cache.get(config.channels.public).send({embeds: [daily.getDiscordDaily(today)]})
    console.log('Running a job at 01:00')
  }, null, true, 'UTC');
  
  dailyAnt.start();

  const expedition = new CronJob('00 00 00 * * SAT', async function () {
    const today = new Date()
    const friday = format(nextFriday(today), "EEEE, MMMM d")

    const message = new MessageEmbed()
    .setColor('#0099ff')
    .setTitle("Alliance expedition of " + friday)
    .setDescription(`<@&${config.roles.members}> please indicate when you are available. You can react to any time you think you can be ready`)
    .addFields(
      {name: "11h UTC", value: "1️⃣", inline: true},
      {name: "13h UTC", value: "2️⃣", inline: true},
      {name: '\u200b', value: '\u200b'},
      {name: "20h UTC", value: "3️⃣", inline: true}, 
      {name: "23h UTC", value: "4️⃣", inline: true}
    )
    .setFooter({text: "Please come back here next week !"})

    const display = await client.channels.cache.get(config.channels.expedition).send({embeds: [message]})
    await display.react('1️⃣')
    await display.react('2️⃣')
    await display.react('3️⃣')
    await display.react('4️⃣')
  }, null, true, 'UTC')

  expedition.start()

  const colonyactions = new CronJob('00 05 * * * *', function () {
    client.channels.cache.get(config.channels.ca).send({embeds: [ca.getDiscordColonyActions()]})
  }, null, true, 'UTC')

  colonyactions.start()
}