export const normalizeMessage = (message: any) => {
  try {
    if (message?.type) {
      return message;
    }
    const matches: any = message?.message?.matchAll(/\[\w+\]/g);
    // eslint-disable-next-line no-restricted-syntax,no-unreachable-loop
    for (const match of matches) {
      const messageObj = JSON.parse(message?.message?.replaceAll(match[0], ''));
      return {
        content: messageObj,
        type: match[0]?.replaceAll(/\[|\]/g, '')
      };
    }
    return {
      type: 'text',
      content: message?.message
    };
  } catch (e) {
    return {
      type: 'text',
      content: message?.message
    };
  }
};
