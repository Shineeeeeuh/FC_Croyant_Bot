const fs = require('fs');
const { log } = require('../helpers/log');

module.exports = async (message, client) => {
  const prefix = '!';
  if (!message.content.startsWith(prefix) || message.author.bot) {
    if (
      message.content.toLowerCase().includes('quoi') ||
      message.content.toLowerCase().includes('koi') ||
      message.content.toLowerCase().includes('kwa') ||
      message.content.toLowerCase().includes('qoi')
    ) message.reply('feur');
    if (
      message.content.toLowerCase().includes('pq') ||
      message.content.toLowerCase().includes('pk')
    ) message.reply('pour feur');
    return;
  }

  const args = message.content.slice(prefix.length).trim().split(' ');
  const command = args.shift().toLowerCase();

  fs.readdir(`${__dirname}/../commands`, (err, commands) => {
    if (err) log('error', err.message);

    commands.map(async file => {
      if (!file.endsWith('.js')) return;
      const commandName = file.replace('.js', '');
      const commandFile = require(`${__dirname}/../commands/${file}`);
      if (command === commandName) {
        if (commandFile.permission && !message.member.permissions.has(commandFile.permission)) {
          return await message.reply(`**${message.author.username}**, vous n'avez pas la permission d'utiliser cette commande`)
        }
        
        commandFile.run(message, client, args, true);
      }
    });
  });
}