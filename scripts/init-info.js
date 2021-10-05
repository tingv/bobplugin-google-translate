/*
 * @Author: roojay
 * @Description: 使用 package.json 里面的部分字段(version, author, homepage, description)覆盖 info.json 里面的数据
 */
const path = require('path');
const fs = require('fs-extra');

const config = require('./config');
const info = require('../src/info.json');
const packageJson = require('../package.json');

const appcast = `https://raw.githubusercontent.com/${config.github.username}/${config.github.repository}/master/src/appcast.json`;

const { version, author = '', homepage = '', description = '' } = packageJson;
const infoData = { ...info, version, author, homepage, summary: description, appcast };
const infoPath = path.join(__dirname, '../src/info.json');

fs.outputJSONSync(infoPath, infoData, { spaces: 2 });
