/*
 * @Author: roojay
 * @Description: 根据配置文件(config.js,info.json) 生成 appcast.json 版本更新文件
 */

const path = require('path');
const fs = require('fs-extra');
const crypto = require('crypto');

const config = require('./config');
const plugInfo = require('../src/info.json');
const plugAppcast = require('../src/appcast.json');

const pkg = `${config.pkgName}-v${plugInfo.version}.bobplugin`;
const repositoryUrl = `https://github.com/${config.github.username}/${config.github.repository}`;
const releaseUrl = `${repositoryUrl}/releases/download`;

module.exports = () => {
  const pkgPath = path.resolve(__dirname, `../release/${pkg}`);
  const appcastPath = path.join(__dirname, '../src/appcast.json');

  const fileBuffer = fs.readFileSync(pkgPath);
  const sum = crypto.createHash('sha256');
  sum.update(fileBuffer);
  const hex = sum.digest('hex');

  const version = {
    version: plugInfo.version,
    desc: `${repositoryUrl}/blob/master/CHANGELOG.md`,
    sha256: hex,
    url: `${releaseUrl}/v${plugInfo.version}/${pkg}`,
    minBobVersion: plugInfo.minBobVersion,
  };

  let versions = (plugAppcast && plugAppcast.versions) || [];
  if (!Array.isArray(versions)) versions = [];
  const index = versions.findIndex((v) => v.version === plugInfo.version);
  if (index === -1) {
    versions.splice(0, 0, version);
  } else {
    versions.splice(index, 1, version);
  }
  const appcastData = { identifier: plugInfo.identifier, versions };
  fs.outputJSONSync(appcastPath, appcastData, { spaces: 2 });
};
