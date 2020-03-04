/**
 * determines whether the passed value is a specific type
 * @param mixed value
 * @return boolean
 */
export function isNumber(value) {
    return Object.prototype.toString.call(value) === '[object Number]';
}
export function isString(value) {
    return Object.prototype.toString.call(value) === '[object String]';
}
export function isArray(value) {
    return Object.prototype.toString.call(value) === '[object Array]';
}
export function isBoolean(value) {
    return Object.prototype.toString.call(value) === '[object Boolean]';
}
export function isUndefined(value) {
    return Object.prototype.toString.call(value) === '[object Undefined]';
}
export function isNull(value) {
    return Object.prototype.toString.call(value) === '[object Null]';
}
export function isSymbol(value) {
    return Object.prototype.toString.call(value) === '[object Symbol]';
}
export function isFunction(value) {
    return Object.prototype.toString.call(value) === '[object Function]';
}
export function isObject(value) {
    return (
        Object.prototype.toString.call(value) === '[object Object]' ||
        // if it isn't a primitive value, then it is a common object
        (!isNumber(value) &&
            !isString(value) &&
            !isBoolean(value) &&
            !isArray(value) &&
            !isNull(value) &&
            !isFunction(value) &&
            !isUndefined(value) &&
            !isSymbol(value)
        )
    );
}
/**
 * JSON stringify, support circular structure
 */
export function JSONStringify(stringObject, formatOption = '\t', replaceString = 'CIRCULAR_DEPENDECY_OBJECT') {
    let cache = [];
    const returnStringObject = JSON.stringify(stringObject, (key, value) => {
        if (typeof value === 'object' && value !== null) {
            if (cache.indexOf(value) !== -1) {
                return replaceString;
            }
            cache.push(value);
        }
        return value;
    }, formatOption);
    cache = null;
    return returnStringObject;
}
/**
 * get an object's prototype name
 */
export function getObjName(obj) {
    return Object.prototype.toString.call(obj).replace('[object ', '').replace(']', '');
}
