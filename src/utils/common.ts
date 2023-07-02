import qs from 'qs';
import map from 'lodash/map';
import forEach from 'lodash/forEach';
import replace from 'lodash/replace';
import split from 'lodash/split';
import entries from 'lodash/entries';
import keysLodash from 'lodash/keys';
import flatten from 'lodash/flatten';
import get from 'lodash/get';
import toString from 'lodash/toString';
import reduce from 'lodash/reduce';
import flattenDeep from 'lodash/flattenDeep';
import filter from 'lodash/filter';
import includes from 'lodash/includes';
import isString from 'lodash/isString';
import isArray from 'lodash/isArray';
import isUndefined from 'lodash/isUndefined';

export const isEnLocale = (): boolean => {
  const lang = new URL(window.location.href).searchParams.get('lang');
  return Boolean(lang && lang?.toString() === 'en');
};

export const isURL = (str: string): boolean => {
  const urlRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
  return urlRegex.test(str);
};

export const validURL = (link: string) => {
  const pattern = new RegExp(
    '^(https?:\\/\\/)?' + // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$',
    'i'
  ); // fragment locator
  return pattern.test(link);
};

export const wordCounter = (text: string) => {
  let wordCount: number = 0;
  for (let i = 0; i <= text?.length; i++) {
    if (text.charAt(i) === ' ') {
      wordCount++;
    }
  }
  return wordCount;
};

export const allocateParamToString = (str: string, params?: object): string => {
  if (!params) return str;
  forEach(entries(params), ([key, value]: [string, string | number]) => {
    str = replace(str, `{${key}}`, toString(value));
  });
  return str;
};

export const queryStringToObject = (query: string): any => {
  try {
    query = query.substring(1);
    return qs.parse(query);
  } catch (e) {
    return undefined;
  }
};

export const hashToArray = (hash: string): string[] => {
  hash = hash.substring(1);
  return split(hash, '#');
};

export const renderLabel = (item: object, key: string | string[][] | string[] = ''): string => {
  let output: string = '';
  if (item) {
    if (isArray(key) && isArray(get(key, 0))) {
      forEach(key, (priorityKey: any) => {
        if (get(item, priorityKey) && !output) {
          output = get(item, priorityKey);
        }
      });
    } else if (!output) output = get(item, isString(key) ? key : flatten(key));
  }
  return output;
};

export const renderKey = (item: object, key: string | string[] = '') => get(item, key) || get(item, 'id');

export const renderImage = (item: object, key: string | string[] = '') => get(item, key) || get(item, 'image');

export const FlatLanguageData = (languageData: any[]) =>
  filter(
    flattenDeep(
      map(entries(languageData), ([key, keyValue]) =>
        map(entries(keyValue), ([language, value]) => ({
          key,
          language,
          value
        }))
      )
    ),
    (item) => item?.value
  );

export const reorderList = <T>(list: T[], startIndex: number, endIndex?: number): T[] => {
  if (!isUndefined(endIndex) && !isUndefined(list)) {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  }
  return list;
};

export const filterObject = (obj: any, keys?: string[] | string): object => {
  if (keys)
    return reduce(
      filter(
        keysLodash(obj),
        (key: string) => (includes(keys, key) && isArray(keys)) || (isString(keys) && key === keys)
      ),
      (outPut: any, key: string) => {
        outPut[key] = obj[key];
        return outPut;
      },
      {}
    );
  return obj;
};

export const flatObject = (obj: any): any => {
  if (keysLodash(obj)?.length === 1) return get(obj, keysLodash(obj));
  return obj;
};
