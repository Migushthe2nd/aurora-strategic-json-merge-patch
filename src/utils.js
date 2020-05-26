const customReduce = (arr, func, start, extra) => {
  for (const val of arr) {
    start = func(start, val, extra);
  }
  return start;
};
module.exports.customReduce = customReduce;

const identifier = (obj, keys) => {
  return Array.isArray(keys) ?
    keys.filter((id) => Object.keys(obj).includes(id)) :
    keys
}

const reducer = (a, c, keys) => {
  const singleKey = identifier(c, keys)
  const k = c[singleKey];
  if (k === undefined) {
    console.error(c);
    throw new Error(`Did not find the key ${singleKey}`);
  }
  a[k] = c;
  return a;
};

module.exports.createItr = (obj, keys) => {
  if (Array.isArray(obj)) {
    return customReduce(obj, reducer, {}, singleKey);
  }
  const singleKey = identifier(obj, keys)
  if (obj[singleKey] === undefined) {
    return obj;
  }
  return {
    [obj[singleKey]]: obj
  };
};

const simpleReducer = (a, c) => {
  a[c] = 0;
  return a;
};

module.exports.uniqueEntriesForObjects = (a, b) => {
  const r = customReduce(
    Object.keys(a),
    simpleReducer,
    customReduce(Object.keys(b), simpleReducer, {})
  );
  return Object.keys(r);
};

module.exports.clone = obj => JSON.parse(JSON.stringify(obj));
