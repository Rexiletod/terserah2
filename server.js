const { Client, Collection } = require("discord.js");
const { config } = require("dotenv");
const {prefix, token } = require("./config.json")

const client = new Client({
    disableEveryone: true
})

// Koleksi
client.commands = new Collection();
client.aliases = new Collection();

// Jalankan pemuat perintah
["command"].forEach(handler => {
    require(`./handlers/${handler}`)(client);
});



client.on("ready", () => { // Saat bot sudah siap
  console.log("Siap di gass");
  client.user.setPresence("I am Devil") // Ini akan mengatur status :)
})

client.on("message", async message => {
   
    if (message.author.bot) return;
    if (!message.guild) return;
    if (!message.content.startsWith(prefix)) return;
    // Jika message.member tidak di-cache, simpan dalam cache!.
    if (!message.member) message.member = await message.guild.fetchMember(message);

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();
    
    if (cmd.length === 0) return;
    
    // Dapatkan perintahnya
    let command = client.commands.get(cmd);
    // Jika tidak ada yang ditemukan, coba cari dengan alias
    if (!command) command = client.commands.get(client.aliases.get(cmd));

    // Jika perintah akhirnya ditemukan, jalankan perintah
    if (command) 
        command.run(client, message, args);
});

client.login(token);
