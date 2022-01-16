const { MessageEmbed } = require("discord.js");
const config = require("../config");

module.exports = client => {
  client.on('guildMemberAdd', async member => {
    const welcome = await client.channels.fetch(config.channels.welcome)
    let deleted
    do {
      deleted = await welcome.bulkDelete(100, true)
    } while (deleted.size != 0)

    if (member.guild.id !== config.discord.guildId) return

    await member.roles.add(config.roles.guests)

    const message = new MessageEmbed()
    .setColor('#ff0000')
    .setTitle("Welcome in AnT Family Discord")
    .setDescription(`Hello <@!${member.id}>, sit down and let's get acquainted !`)
    .addFields({
      name: "And now...",
      value: `While waiting ⏳ for one of our <@&${config.roles.admins}> to assign you a role, take this time to introduce yourself here ⌨️ and change your nickname to be recognized more easily 👨‍💻.`
    },
    {
      name: "Our tools",
      value: `Type "**/help**" to see our Robot habilities`
    })
    setTimeout(() => { client.channels.cache.get(config.channels.welcome).send({embeds: [message]}) }, 2000);
});
}