'use strict';
var __createBinding =
  (this && this.__createBinding) ||
  (Object.create
    ? function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        Object.defineProperty(o, k2, {
          enumerable: true,
          get: function () {
            return m[k];
          },
        });
      }
    : function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
      });
var __setModuleDefault =
  (this && this.__setModuleDefault) ||
  (Object.create
    ? function (o, v) {
        Object.defineProperty(o, 'default', { enumerable: true, value: v });
      }
    : function (o, v) {
        o['default'] = v;
      });
var __importStar =
  (this && this.__importStar) ||
  function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null)
      for (var k in mod) if (k !== 'default' && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.insertAmplifyIgnore = void 0;
const fs = __importStar(require('fs-extra'));
const os = __importStar(require('os'));
const amplify_cli_logger_1 = require('amplify-cli-logger');
const amplifyMark = '#amplify';
const amplifyMarkRegExp = new RegExp(`^${amplifyMark}`);
function insertAmplifyIgnore(gitIgnoreFilePath) {
  if (fs.existsSync(gitIgnoreFilePath)) {
    removeAmplifyIgnore(gitIgnoreFilePath);
    fs.appendFileSync(gitIgnoreFilePath, getGitIgnoreAppendString());
  } else {
    fs.writeFileSync(gitIgnoreFilePath, getGitIgnoreAppendString().trim());
  }
}
exports.insertAmplifyIgnore = insertAmplifyIgnore;
function removeAmplifyIgnore(gitIgnoreFilePath) {
  if (fs.existsSync(gitIgnoreFilePath)) {
    let newGitIgnoreString = '';
    const gitIgnoreStringArray = fs.readFileSync(gitIgnoreFilePath, 'utf8').split(os.EOL);
    let isInRemoval = false;
    for (let i = 0; i < gitIgnoreStringArray.length; i++) {
      const newLine = gitIgnoreStringArray[i].trim();
      if (isInRemoval) {
        if (newLine.length === 0) {
          isInRemoval = false;
        }
      } else if (amplifyMarkRegExp.test(newLine)) {
        isInRemoval = true;
      } else {
        newGitIgnoreString += newLine + os.EOL;
      }
    }
    newGitIgnoreString = newGitIgnoreString.trim();
    fs.writeFileSync(gitIgnoreFilePath, newGitIgnoreString);
  }
}
function getGitIgnoreAppendString() {
  const ignoreList = [
    'amplify/\\#current-cloud-backend',
    'amplify/.config/local-*',
    `amplify/${amplify_cli_logger_1.LocalLogDirectory}`,
    'amplify/mock-data',
    'amplify/backend/amplify-meta.json',
    'amplify/backend/awscloudformation',
    'amplify/backend/.temp',
    'build/',
    'dist/',
    'node_modules/',
    'aws-exports.js',
    'awsconfiguration.json',
    'amplifyconfiguration.json',
    'amplifyconfiguration.dart',
    'amplify-build-config.json',
    'amplify-gradle-config.json',
    'amplifytools.xcconfig',
    '.secret-*',
  ];
  const toAppend = `${os.EOL + os.EOL + amplifyMark + os.EOL}${ignoreList.join(os.EOL)}`;
  return toAppend;
}
//# sourceMappingURL=git-manager.js.map
