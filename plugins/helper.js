export function test(mes) {
  console.log(mes)
}

export async function objectSort(objects, key) {
  objects.sort(function(a, b) {
    if (a[key] > b[key]) {
      return 1;
    } else {
      return -1;
    }
  })
  return objects
}

export function setDigit(val, unitKey) {
  let res
  const units = [
    {1: ' KC', 2: ' MC', 3: ' GC'},   // for dietary energy
    {1: ' g', 2: ' kg', 3: ' t'},    // for protein
    {1: ' µg', 2: ' mg', 3: ' g'},    // for vit-A
    {1: ' mg', 2: ' g', 3: ' kt'},    // for iron
  ]
  const item = Number(val)
  switch (true) {
    case (item < 1000):
      res = String(Math.round(item)) + units[unitKey - 1]["1"]
      break;
    case (item >= 1000 && item < 1000000):
      res = String(Math.round(item / 1000)) + units[unitKey - 1]["2"]
      break;
    case (item >= 1000000):
      res = String(Math.round(item / 1000000)) + units[unitKey - 1]["3"]
      break;
    default:
      console.log('parameter not valid:setDigit')
      res = ''
      break;
  }
  return res
}

export function isObject(object) {
  return object != null && typeof object === 'object';
}

export function isEmpty(obj) {
  return Object.keys(obj).length === 0
}

export function isObjectDeepEqual(object1, object2) {
  const keys1 = Object.keys(object1);
  const keys2 = Object.keys(object2);
  if (keys1.length !== keys2.length) {
    return false;
  }
  for (const key of keys1) {
    const val1 = object1[key];
    const val2 = object2[key];
    const areObjects = isObject(val1) && isObject(val2);
    if (
      areObjects && !isObjectDeepEqual(val1, val2) ||
      !areObjects && val1 !== val2
    ) {
      console.log(val1)
      console.log(val2)
      return false;
    }
  }
  return true;
}

export function validateMyApp(dat){
  // Array
  function isArray (item) {
    return Object.prototype.toString.call(item) === '[object Array]';
  }

  // OBJECT
  function isObject (item) {
    return typeof item === 'object' && item !== null && !isArray(item);
  }

  //field in Object
  function isKeyContained(myObject, key){
    const keys = Object.keys(myObject)
    return (keys.indexOf(key) >= 0)
  }

  return isObject(dat) &&
    isKeyContained(dat, 'user') &&
  isKeyContained(dat, 'dataSet') &&
  isKeyContained(dat, 'sceneCount') &&
  isKeyContained(dat, 'scene') &&
  isKeyContained(dat, 'menuCases') &&
  isKeyContained(dat, 'feasibilityCases') &&
  isKeyContained(dat, 'saveDate')
}
