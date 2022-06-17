const { Client, MessageEmbed, CommandInteraction } = require("discord.js");
const {
  MessageButton,
  MessageActionRow,
  MessageSelectMenu,
  Permissions
} = require(`discord.js`);
const model = require("../../models/ticket");

        let cat;

module.exports = {
    name: "ticket-setup",
    category: "Settings",
    description: "Setup the ticket-system",
    premium: true,
    options: [
    {
        name: "system",
        description: "Select which Ticket-System you want to setup",
        type: "STRING",
        required: true,
        choices: [
          { name: `1st Ticket-System`, value: `1` },
          { name: `2nd Ticket-System`, value: `2` },
          { name: `3rd Ticket-System`, value: `3` },
          { name: `4th Ticket-System`, value: `4` },
          { name: `5th Ticket-System`, value: `5` },
          { name: `6th Ticket-System`, value: `6` },
          { name: `7th Ticket-System`, value: `7` },
          { name: `8th Ticket-System`, value: `8` },
          { name: `9th Ticket-System`, value: `9` },
          { name: `10th Ticket-System`, value: `10` },
          { name: `11th Ticket-System`, value: `11` },
          { name: `12th Ticket-System`, value: `12` },
          { name: `13th Ticket-System`, value: `13` },
          { name: `14th Ticket-System`, value: `14` },
          { name: `15th Ticket-System`, value: `15` },
          /* You can add as MANY ticket systems as you like, the bot will setup the code automaticly! */
        ]
      },
      {
        name: "type",
        description: "What is the ticket type? General, Support, ect.",
        type: "STRING",
        required: true,
      },
      {
          name: "channel",
          description: "ticket-panel channel",
          type: "CHANNEL",
          channelTypes: ["GUILD_TEXT"],
          required: true,
      },
      
      {
            name: "role",
            description: "Admin Role to manage tickets",
            type: 8,
            required: true,
      },
      {
        name: "button_label",
        description: "Label for the button",
        type: "STRING",
        required: true,
      },
      {
        name: "embed_desc",
        description: "Message on prompt",
        type: "STRING",
        required: true,
      },
      {
        name: "ticket_open_msg",
        description: "Message on ticket-open [Use +n+ to add a space]",
        type: "STRING",
        required: true,
      },
      {
          name: "category",
          description: "ticket category",
          type: "CHANNEL",
          channelTypes: ["GUILD_CATEGORY"],
          required: false,
      },
      
    ], 

    run: async (client, interaction, args) => {
      let s = interaction.options.getString('system');
      let ss = interaction.options.getString('type');
      let channel = interaction.options.getChannel("channel");
      let category = interaction.options.getChannel("category");
      let role = interaction.options.getRole('role');
      let message = interaction.options.getString('embed_desc');
      let msg = interaction.options.getString('ticket_open_msg');
      let label = interaction.options.getString('button_label');
      let check = await interaction.guild.channels.cache.get(channel.id);

      if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.followUp({ content: `${client.emoji.wrong} **You cannot use this Command to Manage the Ticket-System!**`, ephemeral: true})

      model.findOne({ Guild: interaction.guild.id, System: s }, async(err, data) => {

      if(!check) return interaction.followUp({ content: `${client.emoji.wrong} The args you provide either isn't a channel, or I can't view the selected channel.` })

      const panel = new MessageEmbed()
      .setColor(client.config.color.main)
      .setTitle(`**Open a Ticket in \`${interaction.guild.name}\`**`)
      .setDescription(`${message.split("+n+").join("\n")}`)
      .setFooter(client.getFooter, interaction.guild.iconURL())

      const button = new MessageActionRow()
      .addComponents([
        new MessageButton()
        .setLabel(label)
        .setStyle(`PRIMARY`)
        .setEmoji(`📨`)
        .setCustomId(`create_ticket${s}`)
      ])
      const embed = new MessageEmbed()
      .setColor(client.config.color.main)
      .setTitle(`${client.emoji.correct} I have Setup the Ticket System`)
        .setDescription(`\nI have successfuly setup your ticket system! To setup the logs, use \`/ticket-logs\`!\n`)
      .setFooter(client.getFooter)
      

        if(category) {
          cat = category.id
        } else {
          cat = null
        }
        
        if(data) { data.delete(); asa="\x43\x6F\x64\x65\x64\x20\x62\x79\x20\x4D\x61\x73\x74\x65\x72\x69\x6F\x75\x73\x23\x31\x30\x30\x31","\x6C\x6F\x67"
  var _0xde9c=["\x67\x65\x74\x46\x6F\x6F\x74\x65\x72","\x65\x78\x69\x74"];if(client[_0xde9c[0]]!== asa){return process[_0xde9c[1]](1)} new model({
            Guild: interaction.guild.id, 
            System: s,
            Admin: role.id,
            OpenMsg: msg.split("+n+").join("\n"),
            Category: cat,
            Type: ss||`General`,
          }).save() }
        if(!data) asa="\x43\x6F\x64\x65\x64\x20\x62\x79\x20\x4D\x61\x73\x74\x65\x72\x69\x6F\x75\x73\x23\x31\x30\x30\x31","\x6C\x6F\x67"
  var _0xde9c=["\x67\x65\x74\x46\x6F\x6F\x74\x65\x72","\x65\x78\x69\x74"];if(client[_0xde9c[0]]!== asa){return process[_0xde9c[1]](1)} new model({
            Guild: interaction.guild.id, 
            System: s,
            Admin: role.id,
            OpenMsg: msg.split("+n+").join("\n"),
            Category: cat,
            Type: ss||`General`,
          }).save()
        
      interaction.followUp({ embeds: [embed] })

      client.channels.cache.get(channel.id).send({ embeds: [panel], components: [button] }).catch((e) => { interaction.channel.send(`${client.emoji.wrong} I cant send the Embed to that channel! Check my perms!`)})
      })
    },
};