/*
 * @Author: roojay
 * @Description: 生成最终以 .bobplugin 结尾的安装包文件
 */

const path = require('path');
const AdmZip = require('adm-zip');
const initAppcast = require('./init-appcast');
const plugInfo = require('../src/info.json');
const config = require('./config');

const pkg = `${config.pkgName}-v${plugInfo.version}.bobplugin`;
const pkgPath = path.resolve(__dirname, `../release/${pkg}`);

const zip = new AdmZip();
zip.addLocalFolder(path.resolve(__dirname, `../dist/${config.pkgName}.bobplugin`));
zip.writeZip(pkgPath);

initAppcast();
