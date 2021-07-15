import _ from 'lodash';

export const stringToJSON = <T>(jsonString: string | undefined): T | undefined => {
  let jsObject: T | undefined;
  if (jsonString) {
    try {
      const camelCased = jsonString.replace(
        /"([\w-]+)":/g,
        (_match, offset) => `"${_.camelCase(offset)}":`,
      );
      jsObject = JSON.parse(camelCased) as T;
    } catch (e) {
      console.error('Failed to parse api string', e, jsonString);
    }
  } else {
    console.info('Empty api string received.');
  }

  return jsObject;
};

export const removeProtocolFromURL = (url = '') => url.replace(/^(http|https):\/\//, '');
