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
  let res = ''
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


