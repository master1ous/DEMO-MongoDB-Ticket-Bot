/* | TICKET CODE - PREMIUM ACCESS | */
/* |    TicketerCrasher - Source Code   | */
/* |      Coded by discord.gg/azury     | */
/* |  Advanced Ticket Bot using MongoDB | */
/* | TICKET CODE - PREMIUM ACCESS | */
const {
  MessageEmbed,
  Collection
} = require("discord.js")
const {
  MessageButton,
  MessageActionRow,
  MessageSelectMenu,
  Permissions
} = require(`discord.js`);
const {
  Modal,
  TextInputComponent,
  showModal
} = require('discord-modals')
const client = require("../index.js");
const discordTranscripts = require('discord-html-transcripts');
const colors = require("colors");
const moment = require("moment");
const dayjs = require("dayjs");
const cooldowns = new Map();


/* | DATABASE - MONGO DB - TICKETS SAVING DB - DEFINING | */
const db1 = require("../models/ticket"); /*             | */
const db2 = require("../models/ticket_claim"); /*       | */
const db3 = require("../models/ticket_log"); /*         | */
const db = require("../models/ticket_open"); /*         | */
/* | DATABASE - MONGO DB - TICKETS SAVING DB - DEFINING | */

const wait = require('util').promisify(setTimeout);

/* | GLOBAL VARIABLE - DEFINING | */
let logs; /*                     | */
/* | GLOBAL VARIABLE - DEFINING | */

client.on("interactionCreate", async(interaction) => {
  if (interaction.isCommand()) return;
  let systemnum = interaction.customId;
  let s = systemnum.match(/\d/g)
  if (s == null) return;
  s = s.join("")

  function msToTime(duration) {
      var milliseconds = parseInt((duration % 500) / 100),
          seconds = Math.floor((duration / 500) % 60),
          minutes = Math.floor((duration / (500 * 60)) % 60),
          hours = Math.floor((duration / (500 * 60 * 60)) % 24);

      hours = (hours < 10) ? "0" + hours : hours;
      minutes = (minutes < 10) ? "0" + minutes : minutes;
      seconds = (seconds < 10) ? "0" + seconds : seconds;

      return seconds + "s";
  }


  if (!cooldowns.has(`ticket_usage`)) {
      cooldowns.set(`ticket_usage`, new Collection());
  }
  let currentDate = Date.now();
  let userCooldowns = cooldowns.get(`ticket_usage`);
  let cooldownAmount = 2000;




  db3.findOne({
      Guild: interaction.guild.id,
      System: s
  }, async(err, data) => {
      if (!data) return;
      logs = data.Logging || null;
  })


  if (interaction.customId == `create_ticket${s}`) {
      if (userCooldowns.has(interaction.user.id)) {
          let expirationDate = userCooldowns.get(interaction.user.id) + cooldownAmount;
          if (currentDate < expirationDate) {
              let timeLeft = Math.round((expirationDate - currentDate));
              return interaction.reply({
                  content: `🕒 Not too fast, please wait **${msToTime(timeLeft.toString())}** before interacting!`,
                  ephemeral: true
              })
          } else {
              userCooldowns.set(interaction.user.id, currentDate);
          }
      } else {
          userCooldowns.set(interaction.user.id, currentDate);
      }
      opener = interaction.user.id;
      let x = dayjs(new Date()).unix()
      db1.findOne({
          Guild: interaction.guild.id,
          System: s
      }, async(err, data) => {
          if (!data) return;

          interaction.reply({
              content: `<a:Foading:920516789883002880> **Creating your ticket...** _could take a few seconds._`,
              ephemeral: true
          })



          interaction.guild.channels.create(`ticket-${interaction.user.username}`, {
                  permissionOverwrites: [{
                      id: interaction.user.id,
                      allow: ["SEND_MESSAGES", "VIEW_CHANNEL"]
                  }, {
                      id: data.Admin,
                      allow: ["SEND_MESSAGES", "VIEW_CHANNEL"]
                  }, {
                      id: interaction.guild.roles.everyone,
                      deny: ["VIEW_CHANNEL"]
                  }],
                  type: 'text',
                  parent: data.Category,
                  topic: `📨 Ticket for: \`${interaction.user.tag}\` / *\`(${interaction.user.id})\`*`
              }).catch(async(e) => {

              console.log(e)
              return interaction.editReply({
                  content: `${client.emoji.wrong} **An Error Occured While Creating Your Ticket!**\n> \`\`\`${e}\`\`\``,
                  ephemeral: true
              })
          }).then(async function(channel) {

              db.findOne({
                  Guild: interaction.guild.id,
                  Opener: interaction.user.id,
                  Type: data.Type || `General`
              }, async(err, data_) => {


                  if (data_) {
                      const check = await interaction.guild.channels.cache.get(data_.Channel);
                      if (!check) {
                          data_.delete();
                          interaction.editReply({
                              content: `👀 Seems your channel was deleted manually... *clearing your Database*\n _Click the button again to open your ticket_`,
                              ephemeral: true
                          });
                      } else {
                          interaction.editReply({
                              content: `${client.emoji.wrong} You already have a Ticket opened at <#${data_.Channel}>!`,
                              ephemeral: true
                          });
                      }
                      channel.delete()
                  } else {
                      db1.findOne({
                          Guild: interaction.guild.id,
                          System: s
                      }, async(err, data_1) => {
                          if (!data_1) return;
                          interaction.editReply({
                              content: `${client.emoji.correct} **Successfuly Created your ticket in <#${channel.id}>**`,
                              ephemeral: true
                          })

                          const embed = new MessageEmbed()
                              .setColor(`WHITE`)
                              .setAuthor(`Ticket created for: ${interaction.user.tag}`, interaction.user.displayAvatarURL())
                              .setThumbnail(interaction.user.displayAvatarURL())
                              .setDescription(`${data.OpenMsg || `Welcome to your support ticket! Please describe what you need!`}`)
                              .setFooter(`${client.user.username} | ${client.getFooter}`, client.user.displayAvatarURL())

                          const row = new MessageActionRow()
                              .addComponents([
                                  new MessageButton()
                                  .setLabel(`Delete`)
                                  .setStyle(`DANGER`)
                                  .setCustomId(`tc_close${s}`),
                                  new MessageButton()
                                  .setLabel(`Claim`)
                                  .setStyle(`SUCCESS`)
                                  .setCustomId(`tc_claim${s}`)
                              ])

                          channel.send({
                              content: `:wave: <@${interaction.user.id}> | <@&${data.Admin}>`,
                              embeds: [embed],
                              components: [row]
                          })


                          new db({
                              Guild: interaction.guild.id,
                              Opener: interaction.user.id,
                              Channel: channel.id,
                              Date: `<t:${x}:R> *(<t:${x}:F>)*`,
                              System: s,
                              Type: data.Type || `General`
                          }).save()
                      })
                  }
              })
          })
      })
  }
  if (interaction.customId == `tc_close${s}`) {
      if (userCooldowns.has(interaction.user.id)) {
          let expirationDate = userCooldowns.get(interaction.user.id) + cooldownAmount;
          if (currentDate < expirationDate) {
              let timeLeft = Math.round((expirationDate - currentDate));
              return interaction.reply({
                  content: `🕒 Not too fast, please wait **${msToTime(timeLeft.toString())}** before interacting!`,
                  ephemeral: true
              })
          } else {
              userCooldowns.set(interaction.user.id, currentDate);
          }
      } else {
          userCooldowns.set(interaction.user.id, currentDate);
      }
      db.findOne({
          Guild: interaction.guild.id,
          Channel: interaction.channel.id,
          System: s
      }, async(err, data_) => {
          if (!data_) return interaction.reply({
              content: `${client.emoji.wrong} I cant find this ticket in Database! Please contact the developers!`,
              ephemeral: true
          })
          const opener = await client.users.cache.get(data_.Opener);


          db1.findOne({
              Guild: interaction.guild.id,
              System: s
          }, async(err, data) => {
              if (!data) return;

              if (!interaction.member.roles.cache.has(data.Admin)) return interaction.reply({
                  content: `${client.emoji.wrong} You need the <@&${data.Admin}> role to manage this ticket!`,
                  ephemeral: true
              })




              const f = await discordTranscripts.createTranscript(interaction.channel,{
              returnType: 'attachment', // Valid options: 'buffer' | 'string' | 'attachment' Default: 'attachment'
              fileName: `${interaction.channel.name}-transcript.html`, // Only valid with returnBuffer false. Name of attachment. 
              minify: true, // Minify the result? Uses html-minifier
              });



              const embed = new MessageEmbed()
                  .setColor(`GREEN`)
                  .setAuthor(`${interaction.user.tag} - Deleting Ticket`, interaction.user.displayAvatarURL())
                  .setDescription(`*Deleting the ticket in 3 seconds...*`)
                  .addField(`**Ticket Opener:**`, `<@${opener.id}> | \`${opener.id}\` / *\`${opener.id}\`*`)
                  .addField(`**Action Taken:**`, `Deleted Ticket | \`${interaction.user.tag}\` / *\`(${interaction.user.id})\`*`)
                  .addField(`**Ticket Creation:**`, `${data_.Date}`)
                  .addField(`**Ticket Type:**`, `${data.Type || `General`}`)
                  .setFooter(`${client.user.username} | ${client.getFooter}`, client.user.displayAvatarURL())

              const embed_user = new MessageEmbed()
                  .setColor(`GREEN`)
                  .setAuthor(`${interaction.user.tag} - Deleted Ticket`, interaction.user.displayAvatarURL())
                  .addField(`**Ticket Opener:**`, `<@${opener.id}> | \`${opener.id}\` / *\`${opener.tag}\`*`)
                  .addField(`**Action Taken:**`, `Deleted Ticket | \`${interaction.user.tag}\` / *\`(${interaction.user.id})\`*`)
                  .addField(`**Ticket Creation:**`, `${data_.Date}`)
                  .addField(`**Ticket Type:**`, `${data.Type || `General`}`)
                  .setFooter(`${client.user.username} | ${client.getFooter}`, client.user.displayAvatarURL())




              interaction.reply({
                  embeds: [embed]
              })
              opener.send({
                  embeds: [embed_user],
                  files: [f]
              }).catch((e) => {})

              data_.delete()

              await wait(3000)
              interaction.channel.delete()

              if (logs) {
                  const ch = await interaction.guild.channels.cache.get(logs);
                  if (!ch) return;
                  ch.send({
                      content: `:lock: Ticket Closed!`,
                      embeds: [embed_user],
                      files: [f]
                  })
              }
          })
      })

  }
  if (interaction.customId == `tc_claim${s}`) {
      if (userCooldowns.has(interaction.user.id)) {
          let expirationDate = userCooldowns.get(interaction.user.id) + cooldownAmount;
          if (currentDate < expirationDate) {
              let timeLeft = Math.round((expirationDate - currentDate));
              return interaction.reply({
                  content: `🕒 Not too fast, please wait **${msToTime(timeLeft.toString())}** before interacting!`,
                  ephemeral: true
              })
          } else {
              userCooldowns.set(interaction.user.id, currentDate);
          }
      } else {
          userCooldowns.set(interaction.user.id, currentDate);
      }
      db.findOne({
          Guild: interaction.guild.id,
          Channel: interaction.channel.id,
          System: s
      }, async(err, data_) => {
          if (!data_) return interaction.reply({
              content: `${client.emoji.wrong} I cant find this ticket in Database! Please contact the developers!`,
              ephemeral: true
          })
          const opener = await client.users.cache.get(data_.Opener);


          db1.findOne({
              Guild: interaction.guild.id,
              System: s
          }, async(err, data) => {
              if (!data) return;

              if (!interaction.member.roles.cache.has(data.Admin)) return interaction.reply({
                  content: `${client.emoji.wrong} You need the <@&${data.Admin}> role to manage this ticket!`,
                  ephemeral: true
              })
              db2.findOne({
                  Guild: interaction.guild.id,
                  Channel: interaction.channel.id,
                  Claimer: interaction.user.id
              }, async(err, data_1) => {
                  if (!data_1) {
                      new db2({
                          Guild: interaction.guild.id,
                          Claimer: interaction.user.id,
                          Channel: interaction.channel.id
                      }).save()
                      const embed = new MessageEmbed()
                          .setColor(`WHITE`)
                          .setAuthor(`${interaction.user.tag} - Claimed Ticket`, interaction.user.displayAvatarURL())
                          .setDescription(`<@${interaction.user.id}> *Claimed this ticket!*`)
                          .setFooter(`${client.user.username} | ${client.getFooter}`, client.user.displayAvatarURL())


                      interaction.reply({
                          embeds: [embed]
                      })
                  } else {

                      claimer = data_1.Claimer || null;
                      if (interaction.user.id == claimer) return interaction.reply({
                          content: `${client.emoji.wrong} You already claimed this ticket before!`,
                          ephemeral: true
                      })

                  }
              })
          })
      })
  }
})