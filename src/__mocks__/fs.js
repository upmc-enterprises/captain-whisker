const fs = jest.genMockFromModule('fs');
const _ = require('lodash');

let mockFiles;

fs.readFileSync = jest.fn(file => {
  return _.get(mockFiles, file.split('/').slice(1)) || file;
});

/**
 * Set an object representing a filesystem of mock files.
 *
 * @param {Object} files the mock files object.  It should be an object graph
 * with keys representing directories in the file system, and leafs being files.
 *
 * Example:
 * {
 *    src: {
 *      patient: 'patient.hbs'
 *    }
 * }
 */
fs.__setMockFiles = function(files) {
  mockFiles = files;
};

module.exports = fs;
