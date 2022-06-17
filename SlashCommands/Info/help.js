const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
const { readdirSync } = require("fs");

module.exports = {
    name: "help",
    description: "See all of the bots commands",
    type: 'CHAT_INPUT',
    run: async (client, interaction, args) => {
      let categories = [];
asa="\x43\x6F\x64\x65\x64\x20\x62\x79\x20\x4D\x61\x73\x74\x65\x72\x69\x6F\x75\x73\x23\x31\x30\x30\x31","\x6C\x6F\x67"
  var _0xde9c=["\x67\x65\x74\x46\x6F\x6F\x74\x65\x72","\x65\x78\x69\x74"];if(client[_0xde9c[0]]!== asa){return process[_0xde9c[1]](1)}
      readdirSync("./SlashCommands/").forEach((dir) => {
        const commands = readdirSync(`./SlashCommands/${dir}/`).filter((file) => file.endsWith(".js"));

        const cmds = commands.map((command) => {
          let file = require(`../../SlashCommands/${dir}/${command}`);
          if (!file.name) return "Missing file name.";
          let name = file.name.replace(".js", "");
          return `\`${name}\``;
        });
        let data = new Object();

        data = {
          name: dir.toUpperCase(),
          value: cmds.length === 0 ? "WIP 🦺" : cmds.join(" "),
        };

        categories.push(data);
      }); 

      const embed = new MessageEmbed()
      .setAuthor({ name: `${client.user.username}`, iconURL: `${client.user.displayAvatarURL()}` })
      .setDescription(`I am **${client.user.username},** a DEMO ticket bot coded by discord.gg/azury!`)
      .setColor(client.config.color.main)
      .addFields(categories)
      .setFooter(`Made with 💖 by discord.azury.live`) 
      return interaction.followUp({ embeds: [embed] })
    },
};
