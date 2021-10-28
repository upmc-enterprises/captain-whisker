const fs = require('fs');
const glob = require('glob');
const Handlebars = require('handlebars');

// Store the compiled templates so they only need to be compiled once.  The
// templates will be stored using the relative path to the template as the
// object key and the compiled template as the value.
const CaptainWhisker = { _templates: {} };

/**
 * Find all Handlebars templates in the project and compile them.  Also,
 * register custom helpers.
 *
 * @param {string} rootDir the root directory to search for templates.
 */
CaptainWhisker.initialize = (rootDir) => {
  _registerHelpers();
  _compileTemplates(rootDir);
};

/**
 * Build a JSON string from a template name and context object.
 *
 * @param {string} template the path to the template file, relative to the root
 * provided to CaptainWhisker.initialize()
 * @param {Object} context the context object to provide to the template
 * @returns {string} the rendered JSON string
 */
CaptainWhisker.build = (template, context) => {
  function prependLeadingSlashIfMissing(template) {
    if (!template.match(/^\//)) {
      template = `/${template}`;
    }

    return template;
  }

  template = prependLeadingSlashIfMissing(template);

  if (!CaptainWhisker._templates[template]) {
    throw `Template not found [${template}]`;
  }

  return CaptainWhisker._templates[template](context);
};

/**
 * Find all Handlebars templates in the project and compile them.  If a template
 * file name begins with an underscore, it will register the template as a
 * partial.
 *
 * @param {string} rootDir the root directory to search for templates.
 */
function _compileTemplates(rootDir) {
  rootDir = rootDir.replace(/\/+$/, '');
  const templates = glob.sync(`${rootDir}/**/*.hbs`);
  for (let template of templates) {
    const fileParts = template.split('/');
    const fileName = fileParts[fileParts.length - 1];
    const templateContent = fs.readFileSync(template, 'utf-8');
    if (fileName.startsWith('_')) {
      Handlebars.registerPartial(fileName.split('.')[0], templateContent);
    } else {
      CaptainWhisker._templates[template.replace(rootDir, '')] =
        Handlebars.compile(templateContent);
    }
  }
}

/**
 * Register Handlebars helper functions.
 */
function _registerHelpers() {
  Handlebars.registerHelper('json', (value) => {
    if (value === undefined || value === null) {
      return new Handlebars.SafeString(null);
    } else if (_notAJsonString(value)) {
      return new Handlebars.SafeString(value);
    } else {
      return new Handlebars.SafeString(`${JSON.stringify(value)}`);
    }
  });

  Handlebars.registerHelper('jsonList', (items, options) => {
    return `[${items.map((item) => options.fn(item).trim()).join(',')}]`;
  });
}

/**
 * @param {string} value the value to check
 * @returns {boolean} true if the value is not something that should be
 * surrounded by double quotes in JSON.
 */
function _notAJsonString(value) {
  return typeof value === 'boolean' || typeof value === 'number';
}

module.exports = CaptainWhisker;
