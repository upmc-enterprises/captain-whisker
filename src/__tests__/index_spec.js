jest.mock('fs');
jest.mock('glob');
jest.mock('handlebars');

describe('JsonView', () => {
  const CaptainWhisker = require('../index');
  const Handlebars = require('handlebars');
  const fs = require('fs');
  const glob = require('glob');

  describe('initialize', () => {
    const templateFiles = {
      src: {
        seinfeld: {
          '_kramer.hbs': 'kramer handlebars',
          '_costanza.hbs': 'costanza handlebars',
          'search.hbs': 'seinfeld search handlebars'
        },
        newman: {
          'create.hbs': 'Hello newman handlebars'
        }
      }
    };

    beforeEach(() => {
      fs.__setMockFiles(templateFiles);
      glob.__setMockFiles([
        './src/seinfeld/_kramer.hbs',
        './src/seinfeld/_costanza.hbs',
        './src/seinfeld/search.hbs',
        './src/newman/create.hbs'
      ]);
      Handlebars.compile.mockClear();
      Handlebars.registerPartial.mockClear();
      CaptainWhisker.initialize('./src');
    });

    it('compiles the templates', () => {
      expect(Handlebars.compile.mock.calls).toEqual([
        [templateFiles.src.seinfeld['search.hbs']],
        [templateFiles.src.newman['create.hbs']]
      ]);
    });

    it('registers partials', () => {
      expect(Handlebars.registerPartial.mock.calls).toEqual([
        ['_kramer', 'kramer handlebars'],
        ['_costanza', 'costanza handlebars']
      ]);
    });

    it('stores the templates', () => {
      expect(CaptainWhisker._templates['/seinfeld/search.hbs']).toEqual(
        templateFiles.src.seinfeld['search.hbs']
      );
    });

    describe('json', () => {
      let json;

      beforeEach(() => {
        json = Handlebars.__helper('json');
      });

      describe('when the value is a string', () => {
        const expected = '"Bookman"';
        let actual;

        beforeEach(() => {
          actual = json('Bookman');
        });

        it('double quotes the string', () => {
          expect(actual.string).toEqual(expected);
        });
      });

      describe('when the value is a boolean', () => {
        const expected = false;
        let actual;

        beforeEach(() => {
          actual = json(expected);
        });

        it('returns the boolean', () => {
          expect(actual.string).toBe(expected);
        });
      });

      describe('when the value is a number', () => {
        const expected = 1.2;
        let actual;

        beforeEach(() => {
          actual = json(expected);
        });

        it('returns the number', () => {
          expect(actual.string).toBe(expected);
        });
      });

      describe('when the value is null', () => {
        const expected = null;
        let actual;

        beforeEach(() => {
          actual = json(expected);
        });

        it('returns null', () => {
          expect(actual.string).toBe(expected);
        });
      });

      describe('when the value is undefined', () => {
        const expected = null;
        let actual;

        beforeEach(() => {
          actual = json(undefined);
        });

        it('returns null', () => {
          expect(actual.string).toBe(expected);
        });
      });
    });

    describe('jsonList', () => {
      const input = [{ name: 'Jerry' }, { name: 'Elaine' }];
      const expected = '[{"name":"Jerry"},{"name":"Elaine"}]';
      let actual;

      beforeEach(() => {
        actual = Handlebars.__helper('jsonList')(input, {
          fn: item => JSON.stringify(item)
        });
      });

      it('returns a JSON list', () => {
        expect(actual).toBe(expected);
      });
    });
  });

  describe('build', () => {
    describe('when the template is not found', () => {
      it('throws an error', () => {
        expect(() => CaptainWhisker.build('missing.hbs', {})).toThrowError(
          /missing\.hbs/
        );
      });
    });

    describe('when the template is found', () => {
      const expected = 'newman template';
      let actual;

      describe('when a leading slash is provided', () => {
        beforeEach(() => {
          CaptainWhisker._templates = { '/newman': () => expected };
          actual = CaptainWhisker.build('/newman', {});
        });

        it('renders the template as a string', () => {
          expect(actual).toEqual(expected);
        });
      });

      describe('when no leading slash is provided', () => {
        beforeEach(() => {
          CaptainWhisker._templates = { '/newman': () => expected };
          actual = CaptainWhisker.build('newman', {});
        });

        it('renders the template as a string', () => {
          expect(actual).toEqual(expected);
        });
      });
    });
  });
});
