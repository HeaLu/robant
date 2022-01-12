const CronJob = require('cron').CronJob
const daily = require('../services/dailyServices')
const config = require('../config')


module.exports = client => {
  const job = new CronJob('00 00 00 * * *', function() {
    const today = new Date()
    client.channels.cache.get(config.channel.officers).send(daily.getGameDaily(today))
    client.channels.cache.get(config.channel.public).send({embeds: [daily.getDiscordDaily(today)]})
    console.log('Running a job at 01:00')
  }, null, true, 'UTC');
  
  job.start();
}