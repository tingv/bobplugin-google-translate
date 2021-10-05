import { Language } from '@bob-plug/core';

type ILang = [Language, string];

// https://ripperhe.gitee.io/bob/#/plugin/addtion/language
// Bob 语种标识和第三方语种标识符映射关系 [['bob语种, '第三方接口语种']]
var languageList: ILang[] = [
  ['auto', 'auto'],
  ['zh-Hans', 'zh-CN'],
  ['zh-Hant', 'zh-TW'],
  ['en', 'en'],
];

// Bob 语种标识符
var standardLangMap = new Map(languageList);
// 第三方语种标识符
var noStandardLangMap = new Map(languageList.map(([standardLang, lang]) => [lang, standardLang]));

// Bob 语种标识符转服务商语种标识符
function standardToNoStandard(lang: Language) {
  return standardLangMap.get(lang);
}

// 服务商语种标识符转 Bob 语种标识符
function noStandardToStandard(lang: string) {
  return noStandardLangMap.get(lang);
}

// 获取支持的语种
function getSupportLanguages() {
  return languageList.map(([standardLang]) => standardLang);
}

export { getSupportLanguages, standardToNoStandard, noStandardToStandard };
