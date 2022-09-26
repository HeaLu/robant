const CronJob = require("cron").CronJob;
const daily = require("../services/dailyServices");
const Ca = require("../services/caServices");
const subHours = require("date-fns/subHours");
const addHours = require("date-fns/addHours");
const getTimezoneOffset = require("date-fns-tz/getTimezoneOffset");
const config = require("../config");
const { MessageEmbed } = require("discord.js");
const Member = require("../models/memberModel");
const getMonth = require("date-fns/getMonth");
const getDate = require("date-fns/getDate");
const getYear = require("date-fns/getYear");

module.exports = (client, AeInstance) => {
  /* const birthday = new CronJob('00 00 00 * * *', async function() {
    const today = new Date()
    const concerned = await Member.find({'birthdate.day': getDate(today), 'birthdate.month': getMonth(today)})
    if (concerned.length > 0) {
      const message = new MessageEmbed()
      .setColor('BLUE')
      .setTitle(`🎂 ${concerned.length} member${concerned.length > 1 ? 's celebrate their' : ' celebrate her/his'} birthday today`)
      .setDescription('Happy birthday to you 🎉🥂🤜')
      for (const member of concerned) {
        message.addField(`${getYear(today) - member.birthdate.year} years`, `👏 <@!${member.discordId}>`)
      }
      message.setFooter({text: `Register your birthdate by typing /birthdate and don't forget !borek to offer ${concerned.length > 1 ? 'her/him' : 'them'} a drink !`})
      if (config.channels.public) client.channels.cache.get(config.channels.public).send({embeds: [message]})
    }
  }, null, true, 'UTC');
  
  birthday.start(); */

  /* const dailyAnt = new CronJob('00 00 00 * * *', async function() {
    const today = new Date()
    if (config.channels.officers) client.channels.cache.get(config.channels.officers).send(daily.getGameDaily(today))
    if (config.channels.public) client.channels.cache.get(config.channels.public).send({embeds: [daily.getDiscordDaily(today)]})
  }, null, true, 'UTC');
  
  dailyAnt.start(); */

  if (config.channels.expedition && config.roles.members) {
    const expedition = new CronJob(
      "00 00 00 * * SAT",
      async function () {
        await AeInstance.empty();
        AeInstance.poll();
      },
      null,
      true,
      "UTC"
    );

    expedition.start();

    const remind = new CronJob(
      "00 00 00 * * WED",
      async function () {
        const message = new MessageEmbed()
          .setColor("BLUE")
          .setTitle("Reminder")
          .setThumbnail(
            "https://www.clipartmax.com/png/full/18-185824_bell-icon-bell-icon.png"
          )
          .setDescription(
            `<@&${config.roles.members}> please don't forget to give your availabilities !`
          );
        client.channels.cache
          .get(config.channels.expedition)
          .send({ embeds: [message] });
      },
      null,
      true,
      "UTC"
    );

    remind.start();

    const checking = new CronJob(
      "00 00 21 * * WED",
      async function () {
        const message = new MessageEmbed()
          .setColor("BLUE")
          .setTitle("Checking")
          .setThumbnail(
            "https://www.clipartmax.com/png/full/1-11037_green-check-mark-transparent.png"
          )
          .setDescription(
            `<@&${config.roles.officers}> please check the correct registration for the event`
          );
        client.channels.cache
          .get(config.channels.expedition)
          .send({ embeds: [message] });
      },
      null,
      true,
      "UTC"
    );

    checking.start();
  }

  if (config.channels.ca) {
    const colonyactions = new CronJob(
      "00 05 * * * *",
      async function () {
        const offset =
          getTimezoneOffset("Europe/Paris", new Date()) / 60 / 60 / 1000;
        const today = subHours(new Date(), offset);
        const channel = await client.channels.fetch(config.channels.ca);
        let deleted;
        do {
          deleted = await channel.bulkDelete(100);
        } while (deleted.size != 0);

        const svsCa = new Ca().getSvsdayColonyActions();
        const currentCa = new Ca(today).getHourColonyActions();
        const nextCa = new Ca(addHours(today, 1)).getHourColonyActions();
        const overnextCa = new Ca(addHours(today, 2)).getHourColonyActions();
        currentCa.setTitle("Current colony actions");
        nextCa.setTitle("Next hour colony actions");
        overnextCa.setTitle("In two hours colony actions");

        client.channels.cache
          .get(config.channels.ca)
          .send({ embeds: [currentCa, nextCa, overnextCa, svsCa] });
      },
      null,
      true,
      "UTC"
    );

    colonyactions.start();
  }

  const colonyactions = new CronJob(
    "00 30 00 * * *",
    async function () {
      const today = new Date();
      const members = await Member.find({ dailyMail: true });
      for (const member of members) {
        const svsCa = new Ca(today, member.timezone).getSvsdayColonyActions();
        const dayCa = new Ca(today, member.timezone).getAlldayColonyActions();
        const user = await client.users.fetch(member.discordId);
        user.send({ embeds: [svsCa, dayCa] });
      }
    },
    null,
    true,
    "UTC"
  );

  colonyactions.start();
};
