const Handlebars = jest.genMockFromModule('handlebars');

const helpers = {};

Handlebars.compile = jest.fn((template) => template);

Handlebars.registerHelper = jest.fn((name, fn) => {
  helpers[name] = fn;
});

Handlebars.__helper = (name) => {
  return helpers[name];
};

Handlebars.SafeString = class SafeString {
  constructor(string) {
    this.string = string;
  }
};

module.exports = Handlebars;
