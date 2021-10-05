import querystring from 'querystring';
import * as Bob from '@bob-plug/core';
import { userAgent } from './util';

interface QueryOption {
  to?: Bob.Language;
  from?: Bob.Language;
  cache?: string;
  tld?: string;
  timeout?: number;
}

var resultCache = new Bob.CacheResult('translate-result');

/**
 * @description 翻译
 * @param {string} text 需要翻译的文字内容
 * @param {object} [options={}]
 * @return {object} 一个符合 bob 识别的翻译结果对象
 */
async function _translate(text: string, options: QueryOption = {}): Promise<Bob.TranslateResult> {
  const { from = 'auto', to = 'auto', cache = 'enable', tld = 'com', timeout = 10000 } = options;
  const cacheKey = `${text}${from}${to}`;
  if (cache === 'enable') {
    const _cacheData = resultCache.get(cacheKey);
    if (_cacheData) return _cacheData;
  } else {
    resultCache.clear();
  }

  const result: Bob.TranslateResult = { from, to, toParagraphs: [] };

  try {
    // 在此处实现翻译的具体处理逻辑

    // 查询参数
    const data = {
      sl: from,
      tl: to,
      hl: to,
      q: text,
    };
  
    // 查询
    const [err, res] = await Bob.util.asyncTo<Bob.HttpResponse>(
      Bob.api.$http.get({
        url: `https://translate.google.${tld}/m?${querystring.stringify(data)}`,
        timeout,
        header: { 'User-Agent': userAgent },
      }),
    );
  
    if (res?.response.statusCode !== 200) throw Bob.util.error('api', '接口响应状态错误', err);
    if (err) throw Bob.util.error('api', '接口网络错误', err);
  
    const html = res?.data;   // 获取 HTML
  
    if (!Bob.util.isString(html)) throw Bob.util.error('api', '接口返回数据类型出错', res);
    if (html.indexOf('"result-container"') == -1 ) throw Bob.util.error('api', '接口返回数据不存在', res);
    
    const matchResults = html.match(/"result-container">([\s\S]*)<\/div><div class="links-container"/)  // 提取结果
    
    if (!matchResults) throw Bob.util.error('api', '接口返回数据出错', res);
    if(typeof matchResults[1] === "undefined") throw Bob.util.error('api', '接口返回数据异常', res);
  
    const translateResult = matchResults[1].split("\n")  // 最终结果

    result.toParagraphs = translateResult;
    result.fromParagraphs = [];
    // result.toDict = { parts: [], phonetics: [] };
  } catch (error) {
    throw Bob.util.error('api', '数据解析错误出错', error);
  }

  if (cache === 'enable') {
    resultCache.set(cacheKey, result);
  }
  return result;
}

export { _translate };
