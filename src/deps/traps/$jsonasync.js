const regex = exports.regex = /^\$(?:to[._]*)?json(?:[._]*)?async$/i;
// We have separated this into its own trap because it is a custom implementation of $json instead of having to use a third party dependency.
exports.condition = ({ stringprop }) => regex.test(stringprop);
exports.dependencies = ['$readfilestream'];
let warned = false;
exports.value = function value() {
  if (!warned) {
    process.emitWarning('This JSON parser is more primitive in design and does not handle directly nested arrays (i.e., matrices).' +
    'You should only be using this as guide.');
  }
  const stream = this.proxy.$readfilestream;
  const parser = new AsyncParser(this._Promise);
  return new this._Promise(res => {
    stream.on('data', d => parser.parse(d.toString()).then(_ => _));
    stream.on('end', () => res(parser.result));
  });
};

class AsyncParser {
  constructor(Promise) {
    this.result = {};
    this.path = [];
    this.remaining = '';
    this._Promise = Promise;
  }

  parse(str) {
    const completeStr = this.remaining + str;
    const matches = completeStr.match(/[{}\[\]]|"[^"]*":?|true|false|\d+/ig);
    const last = matches[matches.length - 1];
    this.remaining = completeStr.substring(completeStr.lastIndexOf(last) + last.length);
    return this.process(matches);
  }

  set(v) {
    const last = this.path.length - 1;
    this.path.reduce((result, c, i) => {
      if (typeof result[c] !== 'object' || i === last) result[c] = i === last ? v : {};
      return result[c];
    }, this.result);
  }

  static processValue(v) {
    return isNaN(v) ? v === 'true' || v === 'false' ? v === 'true' : v.replace(/"/g, '') : +v;
  }

  process(matches) {
    return new this._Promise(res => {
      while (matches.length) {
        const m = matches.shift();
        if (m.endsWith(':')) {
          const prop = m.replace(/[":]/ig, '');
          const v = matches.shift();
          if (!v) {
            this.remaining = m + this.remaining;
            return res(true);
          }
          this.path.push(prop);
          if (v === '{') {
            this.set({});
          } else if (v === '[') {
            this.set([]);
            this.path.push(-1);
          } else {
            this.set(AsyncParser.processValue(v));
            this.path.pop();
          }
        } else if (m === ']') {
          this.path.splice(-2);
        } else if (typeof this.path[this.path.length - 1] === 'number') {
          // console.log("M is", m)
          if (m !== '}') {
            const idx = this.path.pop();
            this.path.push(idx + 1);
            this.set(m === '{' ? {} : AsyncParser.processValue(m));
          }
        } else if (m === '}') {
          this.path.pop();
        }
      }
      res(true);
    });
  }
}
