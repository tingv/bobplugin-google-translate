import * as Bob from '@bob-plug/core';

interface QueryOption {
  to?: Bob.Language;
  from?: Bob.Language;
  cache?: string;
}

var resultCache = new Bob.CacheResult('translate-result');

/**
 * @description 翻译
 * @param {string} text 需要翻译的文字内容
 * @param {object} [options={}]
 * @return {object} 一个符合 bob 识别的翻译结果对象
 */
async function _translate(text: string, options: QueryOption = {}): Promise<Bob.TranslateResult> {
  const { from = 'auto', to = 'auto', cache = 'enable' } = options;
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
    result.toParagraphs = ['测试文字'];
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
