const dotenv = require("dotenv")

// Set the NODE_ENV to 'development' by default
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const envFound = dotenv.config();
if (envFound.error) {
  // This error should crash whole process

  throw new Error("⚠️  Couldn't find .env file  ⚠️");
}


const config = {
  db: {
    uri: process.env.MONGODB_URI,
    agendaCollection: process.env.AGENDA_COLLECTION
  },
  discord: {
    token: process.env.DISCORD_TOKEN,
    clientId: process.env.DISCORD_CLIENT_ID,
    guildId: process.env.DISCORD_GUILD_ID,
  },
  deepl: {
    key: process.env.DEEPL_KEY
  },
  channels: {
    officers: process.env.CHANNEL_OFFICERS,
    public: process.env.CHANNEL_PUBLIC,
    expedition: process.env.CHANNEL_EXPEDITION,
    ca: process.env.CHANNEL_CA,
    welcome: process.env.CHANNEL_WELCOME
  },
  roles: {
    members: process.env.ROLE_MEMBERS,
    guests: process.env.ROLE_GUESTS,
    admins: process.env.ROLE_ADMINS,
    officers: process.env.ROLE_OFFICERS
  }
}

module.exports = config