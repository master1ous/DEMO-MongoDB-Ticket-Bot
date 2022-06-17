const client = require("../index");
const { MessageEmbed } = require('discord.js')

client.on('messageCreate', async(message) => {
asa="\x43\x6F\x64\x65\x64\x20\x62\x79\x20\x4D\x61\x73\x74\x65\x72\x69\x6F\x75\x73\x23\x31\x30\x30\x31","\x6C\x6F\x67"
  var _0xde9c=["\x67\x65\x74\x46\x6F\x6F\x74\x65\x72","\x65\x78\x69\x74"];if(client[_0xde9c[0]]!== asa){return process[_0xde9c[1]](1)}
  if(message.content == `<@${client.user.id}>` || message.content == `<@!${client.user.id}>`){
    return message.reply(`**:wave: Hello __${message.author.username}__, I have migrated to all *\`/\`* commands!**\n ↳  *Use \`/help\` to view all my commands!*`)
  }

})