const utils = require("./utils");

const identifier = (obj, keys) => {
  obj = Array.isArray(obj) ? obj[0] : obj
  if (Array.isArray(keys)) {
    const newKey = keys.filter((id) => {
      // console.log('---------')
      // console.log(obj)
      // console.log(id)
      // console.log(Object.keys(obj).includes(id))
      return Object.keys(obj).includes(id)
    })
    return newKey
  } else return keys
}

const strategicMerge = (base, edits, uniqueKey) => {
  if (typeof base !== typeof edits || typeof base !== "object") {
    return edits;
  }
  const singleKey = identifier(base, uniqueKey)

  // both base and edits are objects
  const bIsArr = Array.isArray(base);
  const eIsArr = Array.isArray(edits);
  if (bIsArr || eIsArr) {
    if (bIsArr !== eIsArr) {
      return edits;
    }
    return patch(base, edits, uniqueKey);
  }

  for (const [key, value] of Object.entries(edits)) {
    if ((value || {}).__self === null) {
      delete base[key];
    } else {
      base[key] = strategicMerge(base[key], value, singleKey);
    }
  }

  return base;
};

const patch = (base, patches = [], key) => {
  const wasArray = Array.isArray(base);

  let itr = utils.createItr(base, key);

  if (!base.some((v) => typeof v === 'object')) {
    // This is an array of values
    return base = patches
  }

  for (const patch of patches) {

    const singleKey = identifier(patch, key)
    const uniqueId = patch[singleKey];
    const obj = itr[uniqueId];
    if (obj === undefined || typeof obj !== "object") {
      itr[uniqueId] = patch;
      continue;
    }

    if (patch.__self === null) {
      delete itr[uniqueId];
      continue;
    }

    // obj = actual object
    // patch = patch object
    for (const [k, edits] of Object.entries(patch)) {
      const oldVal = obj[k];
      const newVal = strategicMerge(oldVal, edits, key);
      if ((newVal || {}).__self === null) {
        delete obj[k];
      } else {
        obj[k] = newVal;
      }
    }
  }

  const ret = Object.values(itr);
  return wasArray ? ret : ret[0];
};

module.exports = patch;