const translate = require("../services/translateServices")
const { MessageEmbed } = require('discord.js')

module.exports = client => {
  client.on('messageReactionAdd', async (reaction, user) => {
    if (reaction.partial) {
      try {
        await reaction.fetch();
      } catch (error) {
        console.error('Something went wrong when fetching the message:', error);
        return;
      }
    }  
    
    const targetLang = translate.getLang(reaction._emoji.name)
    if (!targetLang) return false
  
    const translation = await translate.translate({text: reaction.message.content, target_lang: targetLang.short})

    
    const originLang = translate.getLang(translation.detected_source_language)

    const message = new MessageEmbed()
    .setColor('#0099ff')
    .setTitle('Your translation')
    .setAuthor({ name: `${reaction.message.author.username}`, iconURL: `${reaction.message.author.displayAvatarURL()}` })
    .setDescription(`[🔗 **Jump to message**](${reaction.message.url})`)
    .addFields(
      { name: '\n\u200b', value: '\n\u200b' },
      { name: `From ${originLang.flags[0]} **${originLang.label}** (detected)`, value: `\`\`\`${translation.text}\`\`\`` },
      { name: '\u200b', value: '\u200b' },
      { name: '**Original text:**', value: `>>> *${reaction.message.content}*`}
    )

    user.send({ embeds: [message] })    
    reaction.remove()
  })
}
