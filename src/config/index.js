const dotenv = require("dotenv")

// Set the NODE_ENV to 'development' by default
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const envFound = dotenv.config();
if (envFound.error) {
  // This error should crash whole process

  throw new Error("⚠️  Couldn't find .env file  ⚠️");
}


const config = {
  discord: {
    token: process.env.DISCORD_TOKEN,
    clientId: process.env.DISCORD_CLIENT_ID,
    guildId: process.env.DISCORD_GUILD_ID,
  },
  deepl: {
    key: process.env.DEEPL_KEY
  },
  channel: {
    officers: process.env.CHANNEL_OFFICERS,
    public: process.env.CHANNEL_PUBLIC
  }
}

module.exports = config