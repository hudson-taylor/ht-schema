function merge () {
  // Merge objects passed as arguments, left to right precidence.
  let result = {};
  for (let i = 0; i < arguments.length; i++) {
    let keys = Object.keys(arguments[i]);
    for (let k = 0; k < keys.length; k++) {
      let key = keys[k];
      if (!result.hasOwnProperty(key)) {
        result[key] = arguments[i][key];
      }
    }
  }
  return result;
}

export default merge;
