const { MessageCollector } = require('discord.js');

/**
 * returns the function when the first argument is not
 * @param {any} fn
 * @returns {Function}
 */
const func = (fn) => (typeof fn === 'function' ? fn : () => fn);

class PagesCollector extends MessageCollector {
  constructor(channel, { message, t, sent }, collectorOptions = { max: 5 }) {
    super(channel, (m) => m.author.id === message.author.id, collectorOptions);
    this.t = t;
    this.message = message;
    this.sent = sent;
    this.invalidOption = null;
    this.findOption = null;
    this.handler = null;
  }

  start() {
    this.on('collect', (msg) => this.onCollect(msg));
    return this;
  }

  setFindOption(fn) {
    this.findOption = fn;
    return this;
  }

  setInvalidOption(fn) {
    this.invalidOption = fn;
    return this;
  }

  setHandle(fn) {
    this.collected.clear();
    this.handler = fn;
    return this;
  }

  /**
   * Send a new page message or edit the current
   * @param  {...any} args arguments of #TextChannel.send or #Message.edit
   */
  async send(...args) {
    if (!this.sent || this.sent.deleted) {
      this.sent = await this.channel.send(...args);
    } else {
      this.sent = await this.sent.edit(...args);
    }

    return this.sent;
  }

  delete(...args) {
    const original = this.sent;
    if (original && !original.deleted) {
      original.delete(...args);
    }
  }

  async menheraReply(...args) {
    const sent = await this.message.menheraReply(...args);
    this.delete();
    this.sent = sent;
    return this.sent;
  }

  async onCollect(message) {
    const option = await func(this.findOption)(message.content);

    if (!option) {
      return func(this.invalidOption)(message, this);
    }

    const res = await func(this.handler)(message, option, this);

    if (res?.type === 'DONE') {
      this.finish();
    }
  }

  /**
   * Stop collector listener
   */
  finish() {
    return this.stop('finish');
  }

  static arrFindHandle(arr) {
    return (str) => arr.find((o, i) => o === str || (i + 1) === Number(str));
  }

  static done() {
    return { type: 'DONE' };
  }
}

module.exports = PagesCollector;
