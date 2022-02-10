const CronJob = require('cron').CronJob
const formatDistance = require('date-fns/formatDistance')
const config = require('../config')

module.exports = class Ae {
  constructor(client) {
    this._client = client
    this._date = new Date()
    this._job = new CronJob('0 */5 * * * *', this.tick, null, false, 'UTC', this)
  }

  get running() {
    return this._job.running
  }

  async tick() {
    if (new Date() > this._date) {
      this.stop()
      return
    }
    const diff = formatDistance(new Date(), this._date)
    const channel = await this.getChannel()
    if (channel.name !== `🌴-ae-in-${diff}`) channel.setName(`🌴-ae-in-${diff}`)
  }

  async getChannel() {
    const channel = await this._client.channels.cache.get(config.channels.expedition)
    return channel
  }

  start(date) {
    if (!this.running) {
      this._date = date
      this._job.start()
      return true
    } else {
      return false
    }
  }  

  async stop() {
    if (this.running) {
      this._job.stop()
      this._client.channels.cache.get(config.channels.expedition).setName("🌴-alliance-expedition")
      return true
    } else {
      return false
    }
  }  

  async restart(newdate) {
    await this.stop()
    this.start(newdate)
  }
}