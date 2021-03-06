const { MessageEmbed } = require('discord.js');
const Command = require('../../structures/command');
const { getImageUrl } = require('../../utils/HTTPrequests');

module.exports = class CryCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'cry',
      aliases: ['chorar'],
      clientPermissions: ['EMBED_LINKS'],
      category: 'ações',
    });
  }

  async run(ctx) {
    const avatar = ctx.message.author.displayAvatarURL({ format: 'png', dynamic: true });

    const rand = await getImageUrl('cry');
    const user = ctx.message.mentions.users.first();

    if (user && user.bot) return ctx.replyT('error', 'commands:cry.bot');

    if (!user || user === ctx.message.author) {
      const embed = new MessageEmbed()
        .setTitle(ctx.locale('commands:cry.no-mention.embed_title'))
        .setColor('#000000')
        .setDescription(`${ctx.message.author} ${ctx.locale('commands:cry.no-mention.embed_description')}`)
        .setThumbnail(avatar)
        .setImage(rand)
        .setAuthor(ctx.message.author.tag, avatar);

      ctx.send(embed);
      return;
    }

    const embed = new MessageEmbed()
      .setTitle(ctx.locale('commands:cry.embed_title'))
      .setColor('#000000')
      .setDescription(`${user} ${ctx.locale('commands:cry.embed_description_start')} ${ctx.message.author} ${ctx.locale('commands:cry.embed_description_end')}`)
      .setImage(rand)
      .setThumbnail(avatar)
      .setAuthor(ctx.message.author.tag, avatar);

    await ctx.send(embed);
  }
};
