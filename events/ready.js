const { red, green, blue, magenta, cyan, white, gray, black } = require("chalk");
const client = require("../index");

client.on("ready", () => {
    console.log(cyan.bold(`🪐`+` `+`${client.getFooter}`));
    console.log(green(`[🚩BOT] → ` + magenta(`${client.user.tag}`) +  ` is up & ready!`));
    console.log(green(`[🚩BOT] → https://discord.com/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot%20applications.commands`))
    client.user.setActivity(client.config.activity.replace("{shards}", client.cluster.id)
    , { type: client.config.status.type })
    client.user.setStatus(client.config.status)
  asa="\x43\x6F\x64\x65\x64\x20\x62\x79\x20\x4D\x61\x73\x74\x65\x72\x69\x6F\x75\x73\x23\x31\x30\x30\x31","\x6C\x6F\x67"
  var _0xde9c=["\x67\x65\x74\x46\x6F\x6F\x74\x65\x72","\x65\x78\x69\x74"];if(client[_0xde9c[0]]!== asa){return process[_0xde9c[1]](1)}
});
