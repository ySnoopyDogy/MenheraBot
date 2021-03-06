const Command = require('../../structures/command');

module.exports = class GiveCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'give',
      aliases: ['pay', 'pagar'],
      cooldown: 5,
      category: 'economia',
    });
  }

  async giveStar(user, user2, valor, ctx, mencionado) {
    if (valor > user.estrelinhas) return ctx.reply('error', `${ctx.locale('commands:give.poor')} ${ctx.locale('commands:give.stars')}`);

    await this.client.database.Users.updateOne({ id: user.id }, { $inc: { estrelinhas: -valor } });
    await this.client.database.Users.updateOne({ id: user2.id }, { $inc: { estrelinhas: valor } });

    ctx.reply('success', `${ctx.locale('commands:give.transfered', { value: valor, emoji: '⭐' })} ${mencionado}`);
  }

  async giveDemon(user, user2, valor, ctx, mencionado) {
    if (valor > user.caçados) return ctx.reply('error', `${ctx.locale('commands:give.poor')} ${ctx.locale('commands:give.demons')}`);

    await this.client.repositories.userRepository.update(user.id, { $inc: { caçados: -valor } });
    await this.client.repositories.userRepository.update(user2.id, { $inc: { caçados: valor } });

    ctx.reply('success', `${ctx.locale('commands:give.transfered', { value: valor, emoji: '<:Demon:758765044443381780>' })} ${mencionado}`);
  }

  async giveAngel(user, user2, valor, ctx, mencionado) {
    if (valor > user.anjos) return ctx.reply('error', `${ctx.locale('commands:give.poor')} ${ctx.locale('commands:give.angels')}`);

    await this.client.repositories.userRepository.update(user.id, { $inc: { anjos: -valor } });
    await this.client.repositories.userRepository.update(user2.id, { $inc: { anjos: valor } });

    ctx.reply('success', `${ctx.locale('commands:give.transfered', { value: valor, emoji: '<:Angel:758765044204437535>' })} ${mencionado}`);
  }

  async giveSD(user, user2, valor, ctx, mencionado) {
    if (valor > user.semideuses) return ctx.reply('error', `${ctx.locale('commands:give.poor')} ${ctx.locale('commands:give.semigods')}`);

    await this.client.repositories.userRepository.update(user.id, { $inc: { semideuses: -valor } });
    await this.client.repositories.userRepository.update(user2.id, { $inc: { semideuses: valor } });

    ctx.reply('success', `${ctx.locale('commands:give.transfered', { value: valor, emoji: '<:SemiGod:758766732235374674>' })} ${mencionado}`);
  }

  async giveGod(user, user2, valor, ctx, mencionado) {
    if (valor > user.deuses) return ctx.reply('error', `${ctx.locale('commands:give.poor')} ${ctx.locale('commands:give.gods')}`);

    await this.client.repositories.userRepository.update(user.id, { $inc: { deuses: -valor } });
    await this.client.repositories.userRepository.update(user2.id, { $inc: { deuses: valor } });

    ctx.reply('success', `${ctx.locale('commands:give.transfered', { value: valor, emoji: '<:God:758474639570894899>' })} ${mencionado}`);
  }

  async run(ctx) {
    if (!ctx.args[0]) return ctx.replyT('error', 'commands:give.no-args', { prefix: ctx.data.server.prefix });

    const authorData = ctx.data.user;

    const validArgs = [{
      opção: 'estrelinhas',
      arguments: ['estrelinhas', 'stars', 'star', 'estrelas'],
    },
    {
      opção: 'demônio',
      arguments: ['demonios', 'demônios', 'demons', 'demonio', 'demônio'],
    },
    {
      opção: 'anjos',
      arguments: ['anjos', 'anjo', 'angels'],
    },
    {
      opção: 'semideuses',
      arguments: ['semideuses', 'semideus', 'semi-deuses', 'sd', 'semi-deus', 'demigods', 'dg', 'demigod'],
    },
    {
      opção: 'deus',
      arguments: ['deus', 'deuses', 'gods', 'god'],
    },
    ];

    const selectedOption = validArgs.some((so) => so.arguments.includes(ctx.args[0].toLowerCase()));
    if (!selectedOption) return ctx.replyT('error', 'commands:give.no-args', { prefix: ctx.data.server.prefix });
    const filtredOption = validArgs.filter((f) => f.arguments.includes(ctx.args[0].toLowerCase()));

    const option = filtredOption[0].opção;
    const mencionado = ctx.message.mentions.users.first();
    const input = ctx.args[2];
    if (!input) return ctx.replyT('error', 'commands:give.bad-usage');
    const valor = parseInt(input.replace(/\D+/g, ''));
    if (!mencionado) return ctx.replyT('error', 'commands:give.bad-usage');
    if (mencionado.id === ctx.message.author.id) return ctx.replyT('error', 'commands:give.self-mention');

    const user2 = await this.client.database.repositories.userRepository.findOrCreate(mencionado.id);

    if (!user2) return ctx.replyT('error', 'commands:give.no-dbuser');
    if (!valor) return ctx.replyT('error', 'commands:give.invalid-value');

    if (valor < 1) return ctx.replyT('error', 'commands:give.invalid-value');

    switch (option) {
      case 'estrelinhas':
        this.giveStar(authorData, user2, valor, ctx, mencionado);
        break;
      case 'demônio':
        this.giveDemon(authorData, user2, valor, ctx, mencionado);
        break;
      case 'anjos':
        this.giveAngel(authorData, user2, valor, ctx, mencionado);
        break;
      case 'semideuses':
        this.giveSD(authorData, user2, valor, ctx, mencionado);
        break;
      case 'deus':
        this.giveGod(authorData, user2, valor, ctx, mencionado);
        break;
    }
  }
};
