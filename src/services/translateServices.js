const config = require('../config')
const axios = require('axios')

const langs = [
  {short: 'BG', label: 'Bulgarian', flags: ['🇧🇬']},
  {short: 'CS', label: 'Czech', flags: ['🇨🇿']},
  {short: 'DA', label: 'Danish', flags: ['🇩🇰']},
  {short: 'DE', label: 'German', flags: ['🇩🇪']},
  {short: 'EL', label: 'Greek', flags: ['🇬🇷']},
  {short: 'EN', label: 'English', flags: ['🇺🇸', '🇬🇧']},
  {short: 'ES', label: 'Spanish', flags: ['🇪🇸']},
  {short: 'ET', label: 'Estonian', flags: ['🇪🇪']},
  {short: 'FI', label: 'Finnish', flags: ['🇫🇮']},
  {short: 'FR', label: 'French', flags: ['🇫🇷','🇨🇵']},
  {short: 'HU', label: 'Hungarian', flags: ['🇭🇺']},
  {short: 'IT', label: 'Italian', flags: ['🇮🇹']},
  {short: 'JA', label: 'Japanese', flags: ['🇯🇵']},
  {short: 'LT', label: 'Lithuanian', flags: ['🇱🇹']},
  {short: 'LV', label: 'Latvian', flags: ['🇱🇻']},
  {short: 'NL', label: 'Dutch', flags: ['🇳🇱']},
  {short: 'PL', label: 'Polish', flags: ['🇵🇱']},
  {short: 'PT', label: 'Portuguese', flags: ['🇵🇹', '🇧🇷']},
  {short: 'RO', label: 'Romanian', flags: ['🇷🇴']},
  {short: 'RU', label: 'Russian', flags: ['🇷🇺']},
  {short: 'SK', label: 'Slovak', flags: ['🇸🇰']},
  {short: 'SL', label: 'Slovenian', flags: ['🇸🇮']},
  {short: 'SV', label: 'Swedish', flags: ['🇸🇪']},
  {short: 'ZH', label: 'Chinese', flags: ['🇨🇳']}
]

//Prend un emoji ou une str, et renvoi la lang si l'emoji ou le short est connu
const getLang = (str) => {
  const targetLang = langs.find(lang => (lang.flags.indexOf(str) !== -1) || (lang.short === str))

  
  if (!targetLang) {
    return false
  } else {
    return targetLang
  }
}

const translate = async ({text, target_lang}) => {
  try {
    const translation = await axios.get('https://api-free.deepl.com/v2/translate', {
      params: {
        target_lang,
        text,
        auth_key: config.deepl.key
      }
    })
    return translation.data.translations[0]
  }
  catch (err) {
    throw err
  }
}

exports.getLang = getLang
exports.translate = translate