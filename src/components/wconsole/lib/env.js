export const isWeb = typeof window !== 'undefined' && typeof document !== 'undefined';
export const isWeex = typeof weex !== 'undefined' && typeof weex.document === 'object';
export const isWeexWeb = isWeb && isWeex;
export const isNative = !isWeb;
export const isAndroid = isNative && /Android/i.test(weex.config.env.platform);
export const isIOS = isNative && /iOS/i.test(weex.config.env.platform);
