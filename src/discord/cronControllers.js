const CronJob = require('cron').CronJob
const daily = require('../services/dailyServices')
const ca = require('../services/caServices')
const { nextFriday, format, addHours } = require('date-fns')
const config = require('../config')
const { MessageEmbed } = require('discord.js')


module.exports = client => {
  const dailyAnt = new CronJob('00 00 00 * * *', async function() {
    const today = new Date()
    if (config.channels.officers) client.channels.cache.get(config.channels.officers).send(daily.getGameDaily(today))
    if (config.channels.public) client.channels.cache.get(config.channels.public).send({embeds: [daily.getDiscordDaily(today)]})
  }, null, true, 'UTC');
  
  dailyAnt.start();
  
  if (config.channels.expedition && config.roles.members) {
    const expedition = new CronJob('00 00 00 * * SAT', async function () {
      const channel = await client.channels.fetch(config.channels.expedition)
      let deleted;
      do {
        deleted = await channel.bulkDelete(100);
      } while (deleted.size != 0);
  
      const today = new Date()
      const friday = format(nextFriday(today), "EEEE, MMMM d")
  
      const message = new MessageEmbed()
      .setColor('#ff0000')
      .setTitle("Alliance expedition of " + friday)
      .setDescription(`<@&${config.roles.members}> please indicate all your availability for the event. You can put several`)
      .setThumbnail('https://e7.pngegg.com/pngimages/44/527/png-clipart-tropical-tree-tree-tropical-tree.png')
      .setImage('https://scontent-cdt1-1.xx.fbcdn.net/v/t39.30808-6/242891060_262968579017194_8813702083471812699_n.jpg?_nc_cat=105&ccb=1-5&_nc_sid=973b4a&_nc_ohc=mWdLAMtf9L0AX-Xj1uD&_nc_ht=scontent-cdt1-1.xx&oh=00_AT9sUf-uA-UQ3Qno1kkJqQCnwUvGRg87_h9A2amRoTrONA&oe=62072416')
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

    const remind = new CronJob('00 00 00 * * WED', async function () {
      const message = new MessageEmbed()
      .setColor('#ff0000')
      .setTitle("Reminder")
      .setDescription(`<@&${config.roles.members}> please don't forget to give your availabilities !`)
      client.channels.cache.get(config.channels.expedition).send({embeds: [message]})
    }, null, true, 'UTC')

    remind.start()

    const checking = new CronJob('00 00 21 * * WED', async function () {
      const message = new MessageEmbed()
      .setColor('#ff0000')
      .setTitle("Checking")
      .setDescription(`<@&${config.roles.officers}> please check the correct registration for the event`)
      client.channels.cache.get(config.channels.expedition).send({embeds: [message]})
    }, null, true, 'UTC')

    checking.start()
  }  
  
  if (config.channels.ca) {
    const colonyactions = new CronJob('00 05 * * * *', async function () {
      const today = new Date()
      const channel = await client.channels.fetch(config.channels.ca)
      let deleted;
      do {
        deleted = await channel.bulkDelete(100);
      } while (deleted.size != 0);
  
      const currentCa = ca.getHourColonyActions()
      const dayCa = ca.getDayColonyActions()
      const nextCa = ca.getHourColonyActions(addHours(today, 1))
      const overnextCa = ca.getHourColonyActions(addHours(today, 2))
      nextCa.setTitle("Next hour colony actions")
      overnextCa.setTitle("In two hours colony actions")
      
      client.channels.cache.get(config.channels.ca).send({embeds: [currentCa, nextCa, overnextCa, dayCa]})
    }, null, true, 'UTC')
  
    colonyactions.start()
  }
}