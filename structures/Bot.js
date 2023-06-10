
import fs from "node:fs";
import path from "node:path";

import Discord, {GatewayIntentBits, REST, Routes} from "discord.js";

export default class PostGraduatedBot extends Discord.Client {

    constructor() {
        const props = {
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent,
            ]
        }

        super(props);

        this.botconfig = {
            ID: process.env.DISCORD_BOT_ID,
            TOKEN: process.env.DISCORD_BOT_TOKEN,
            MAIN_GUILD: process.env.DISCORD_MAIN_GUILD_ID
        }

        if (this.botconfig.TOKEN === "" || this.botconfig.TOKEN === undefined) {
            console.error('System receive no Token!')
            return
        }

        this.commands = new Discord.Collection()
        this.rest = new REST({ version: '10' }).setToken(this.botconfig.TOKEN)

    }

    async prepare() {
        await this.loadCommands()
        await this.loadListeners()
        await this.registerSlashCommands()
    }

    async loadCommands() {
        const commandsPath = path.resolve('./commands');  // relative at runtime directory
        const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

        for (const file of commandFiles) {
            const command = (await import(`${commandsPath}/${file}`)).default
            if ('data' in command && 'execute' in command) {
                this.commands.set(command.data.name, command)
                console.log(`[INFO] Command ${command.data.name} is loaded`)
            } else {
                console.log(`[WARN] Command of ${commandFiles} is missing necessary fields`)
            }
        }
    }

    loadListeners() {
        // login event
        this.once(Discord.Events.ClientReady,  client => {
            console.log(`Bot is ready: ${client.user.tag}`);
        })

        // slash command listener
        this.on(Discord.Events.InteractionCreate, async interaction => {
            if (!interaction.isChatInputCommand()) return;

            const command = this.commands.get(interaction.commandName);

            try {
                await command?.execute(this, interaction);
            } catch (e) {
                if (interaction.replied || interaction.deferred) {
                    await interaction.followUp({ content: 'Runtime Error occurred!', ephemeral: true });
                } else {
                    await interaction.reply({ content: 'Runtime Error occurred!', ephemeral: true });
                }
            }
        })
    }

    async registerSlashCommands() {
        try {
            await this.rest.put(Routes.applicationCommands(this.botconfig.ID), {body: this.commands.map(value => value.data.toJSON())})
            // await this.rest.put(Routes.applicationGuildCommands(this.botconfig.ID, this.botconfig.MAIN_GUILD), {body: this.commands.map(value => value.data.toJSON())})
            // await this.rest.delete(Routes.applicationGuildCommand(this.botconfig.ID, this.botconfig.MAIN_GUILD), {body: []})
        } catch (e) {
            console.log('failed to register slash commands')
        }
    }

    run() {
        this.login(this.botconfig.TOKEN)
    }

}


