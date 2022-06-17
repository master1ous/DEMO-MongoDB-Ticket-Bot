const { Client, CommandInteraction, MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const mongoose = require('mongoose');
const { swap_pages2 } = require(`${process.cwd()}/handler/functions`);
let cpuStat = require("cpu-stat");
let os = require("os");
const Discord = require(`discord.js`);

module.exports = {
    name: "stats",
    category: "Info",
    description: "Gathers the bot's statistics",
    type: "bot",
    run: async (client, interaction, args) => {

      const version = "1.8";

      embeds = [];
      let totalguilds;

      let date = new Date();
      let timestamp = date.getTime() - Math.floor(client.uptime);

      const data = await client.cluster.broadcastEval(c => { 
        let date = new Date();
      
      let timestamp = date.getTime() - Math.floor(c.uptime);
        return { guilds: c.guilds.cache.size, members: c.guilds.cache.map(g => g.memberCount).reduce((a,b)=>a+b,0), cluster: c.cluster.id, shards: c.cluster.ids.map(d => `#${d.id}`).join(", "), uptime: timestamp, ping: c.ws.ping, ram: (process.memoryUsage().heapUsed/1024/1024).toFixed(0) } })


      await data.forEach((d) => {
      
        const { cluster, shards, guilds, members, ping, uptime, ram } = d;

        let ifGuild;

        if(cluster == client.cluster.id) {
          ifGuild = `from **__This Guild__**`
        } else {
          ifGuild = "__NOT__ from **__This Guild__**"
        }
        embeds.push(
          new MessageEmbed()
          .setAuthor(`Bot Stats of: ${client.user.tag}`, client.user.displayAvatarURL())
          .addField(`__\`Cluster #${cluster}\`__ has been up since: <t:${Math.floor(uptime / 1000)}:R>\n⟫ This cluster is: ${ifGuild||`N/A`}`, `\`\`\`yml\nMemory Usage: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}/ ${(os.totalmem() / 1024 / 1024).toFixed(2)}MB\nDiscord.js: v${Discord.version}\nNode.js: ${process.version}\nCPU: ${os.cpus().map((i) => `${i.model}`)[0]}\nRam: ${ram}\nArch: ${os.arch()}\`\`\`\n\`\`\`yml\nCluster: #${cluster}\nShards: ${shards}\nGuilds ${guilds}\nMembers: ${members}\nPing: ${Math.round(ping)}ms\n\`\`\`\n\`\`\`yml\nDeveloper: Masterious#1001\nBot-Version: ${version}\n\`\`\``)
          .setThumbnail(interaction.guild.iconURL())
      .setColor(`GREEN`)
          .setFooter(`${client.user.username}︲.gg/azury︲You're cluster: #${client.cluster.id} & shard: ${client.cluster.ids.map(d => `#${d.id}`).join(", ")}\n`+client.getFooter, interaction.guild.iconURL())
          )
      })

      

      return swap_pages2(client, interaction, embeds);
      
    },
};

