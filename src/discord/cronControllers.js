const CronJob = require('cron').CronJob
const daily = require('../services/dailyServices')
const Ca = require('../services/caServices')
const addHours = require('date-fns/addHours')
const config = require('../config')
const { MessageEmbed } = require('discord.js')


module.exports = (client, AeInstance) => {
  const dailyAnt = new CronJob('00 00 00 * * *', async function() {
    const today = new Date()
    if (config.channels.officers) client.channels.cache.get(config.channels.officers).send(daily.getGameDaily(today))
    if (config.channels.public) client.channels.cache.get(config.channels.public).send({embeds: [daily.getDiscordDaily(today)]})
  }, null, true, 'UTC');
  
  dailyAnt.start();
  
  if (config.channels.expedition && config.roles.members) {
    const expedition = new CronJob('00 00 00 * * SAT', async function () {
      await AeInstance.empty()
      AeInstance.poll()
    }, null, true, 'UTC')
  
    expedition.start()

    const remind = new CronJob('00 00 00 * * WED', async function () {
      const message = new MessageEmbed()
      .setColor('BLUE')
      .setTitle("Reminder")
      .setThumbnail("https://www.clipartmax.com/png/full/18-185824_bell-icon-bell-icon.png")
      .setDescription(`<@&${config.roles.members}> please don't forget to give your availabilities !`)
      client.channels.cache.get(config.channels.expedition).send({embeds: [message]})
    }, null, true, 'UTC')

    remind.start()

    const checking = new CronJob('00 00 21 * * WED', async function () {
      const message = new MessageEmbed()
      .setColor('BLUE')
      .setTitle("Checking")
      .setThumbnail("https://www.clipartmax.com/png/full/1-11037_green-check-mark-transparent.png")
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
  
      const currentCa = new Ca().getHourColonyActions()
      const dayCa = new Ca().getDayColonyActions()
      const nextCa = new Ca(addHours(today, 1)).getHourColonyActions()
      const overnextCa = new Ca(addHours(today, 2)).getHourColonyActions()
      currentCa.setTitle("Current colony actions")
      nextCa.setTitle("Next hour colony actions")
      overnextCa.setTitle("In two hours colony actions")
      
      client.channels.cache.get(config.channels.ca).send({embeds: [currentCa, nextCa, overnextCa, dayCa]})
    }, null, true, 'UTC')
  
    colonyactions.start()
  }
}