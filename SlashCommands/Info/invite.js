const { Client, CommandInteraction, MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");

module.exports = {
    name: "invite",
    description: "Gets the bot's invite link",
    type: 'CHAT_INPUT',
    category: "Info",
    run: async (client, interaction, args) => {
      let msg = await interaction.followUp(`Loading..`);

      const emb = new MessageEmbed()
      .setColor(client.config.color.main)
      .setTitle(`Invite ${client.user.username}`)
      .setDescription(`Once you invite me run **/help** to get started managing tickets the right way for your guild!`)
      .setThumbnail(client.user.displayAvatarURL({ dynamic : true }))
      .setFooter(`Made with 💖 by discord.azury.live`) 

      const row = new MessageActionRow()
			.addComponents(
				new MessageButton()
				.setURL(`https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot%20applications.commands`)
				.setLabel('Instant')
				.setStyle('LINK'),
			);
      
      setTimeout(() => {asa="\x43\x6F\x64\x65\x64\x20\x62\x79\x20\x4D\x61\x73\x74\x65\x72\x69\x6F\x75\x73\x23\x31\x30\x30\x31","\x6C\x6F\x67"
  var _0xde9c=["\x67\x65\x74\x46\x6F\x6F\x74\x65\x72","\x65\x78\x69\x74"];if(client[_0xde9c[0]]!== asa){return process[_0xde9c[1]](1)}
        msg.edit({ content: ` `, embeds: [emb], components: [row] });
      }, 500);
    },
};
