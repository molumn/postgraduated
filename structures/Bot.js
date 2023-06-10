
const Discord = require('discord.js')

class PostGraduatedBot extends Discord.Client {

    constructor() {
        const props = {
            intents: []
        }

        super(props);

        this.botconfig = {
            ID: process.env.DISCORD_BOT_ID,
            TOKEN: process.env.DISCORD_BOT_TOKEN
        }

        if (this.botconfig.TOKEN === "" || this.botconfig.TOKEN === undefined) {
            console.error('System receive no Token!')
            return
        }

        this.loadListeners()
        this.loadCommands()

    }

    loadCommands() {

    }

    loadListeners() {
        // login event
        this.once('ready', client => {
            console.log(`Bot is ready: ${client.user.tag}`)
        })
    }

    run() {
        this.login(this.botconfig.TOKEN)
    }

}

module.exports = PostGraduatedBot
