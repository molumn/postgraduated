import {SlashCommandBuilder} from "@discordjs/builders";

const ping = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('return client ping')
    ,
    execute: (client, interaction) => {
        interaction.reply({ content: 'Pong!', ephemeral: true })
    }
}

export default ping

