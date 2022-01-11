const translate = require("../services/translateServices")

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
  
    const message = `Your translation of **${reaction.message.author.username}**'s message, from ${originLang.flags[0]} **${originLang.label}** (detected):  
    \`\`\`${translation.text}\`\`\`
    
    **Original text:**  
    >>> *${reaction.message.content}*`
    
    user.send(message)
    reaction.remove()
  })
}
