const glob = jest.genMockFromModule('glob');

let mockFiles;

glob.sync = jest.fn(() => {
  return mockFiles;
});

glob.__setMockFiles = function(files) {
  mockFiles = files;
};

module.exports = glob;
