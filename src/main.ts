import * as Bob from '@bob-plug/core';
import { getSupportLanguages } from './lang';

import { _translate } from './translate';







// 使用 bob 实现的 require 方法加载本地库,
var formatString = require('./libs/human-string');


export function supportLanguages(): Bob.supportLanguages {
  return getSupportLanguages();
}


// https://ripperhe.gitee.io/bob/#/plugin/quickstart/translate
export function translate(query: Bob.TranslateQuery, completion: Bob.Completion) {
  const { text = '', detectFrom, detectTo } = query;
  const str = formatString(text);
  const params = { from: detectFrom, to: detectTo, cache: Bob.api.getOption('cache') };
  let res = _translate(str, params);

  res
    .then((result) => completion({ result }))
    .catch((error) => {
      Bob.api.$log.error(JSON.stringify(error));
      if (error?.type) return completion({ error });
      completion({ error: Bob.util.error('api', '插件出错', error) });
    });
}






