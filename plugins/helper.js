/**
 * Objectをkeyでsortして返す
 * @param objects sort対象のObject
 * @param key sortするkey
 * @returns {Promise<*>}
 */
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

/**
 * 数字の桁数を３桁に自動調整し、単位を追記して返す
 * @param val
 * @param unitKey
 * @returns {string}
 */
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

/**
 * 2つのObjectが同じ内容であるかチェック（再起的）
 * @param object1 検査対象1
 * @param object2 検査対象2
 * @returns {boolean}
 */
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


/**
 * object validation
 * Objectが特定のkeyを持つかどうかチェック
 * @param myObject 検査対象の変数
 * @param key チェックするkey(String表記)
 * @returns {boolean}
 */
export function isKeyContained(myObject, key){
  const keys = Object.keys(myObject)
  return (keys.indexOf(key) >= 0)
}

/**
 * Array validation
 *     Arrayであるかどうかチェック
 * @param item 検査対象の変数
 * @returns {boolean}
 */
export function isArray (item) {
  return Object.prototype.toString.call(item) === '[object Array]';
}

/**
 * Object validation
 *     Objectであるかどうかチェック
 * @param item 検査対象の変数
 * @returns {boolean}
 */
export function isObject (item) {
  return typeof item === 'object' && item !== null && !isArray(item);
}


/**
 * Validator for complex object
 * ネストしたObjectに必要なKeyが含まれているかを検証
 * @param data 検査対象のObject
 *     （例：
 *         const obj = {
 *             "type":"typeName","firstName":"Steven",
 *             "lastName":"Smith","address":{"primary":{"city":"abc",
 *             "street":{"name":{"subName":"someName"}}}}
 *                 };）
 * @param types validaterを指定（必要なkeyを配列で指定する
 *     例：const typeName = ['firstName', 'lastName', 'address', '
 *     address.primary', 'address.primary.city',
 *     'address.primary.street'];
 *     ）
 * @returns {*[]} dataに存在しないkeyを抽出
 */
export function validateObject(data, types){
  let errors = [];
  types.forEach(type => {
    const keys = type.split('.');
    let datum = {
      ...data
    };
    // Loop through the keys
    for (let [index, key] of keys.entries()) {
      // Check if the key is not available in the data
      // then push the corresponding key to the errors array
      // and break the loop
      //以下の行を、if (!datum[key]) { とすればkeyの存在＋値の有無をチェックする
      if (datum[key] === undefined) {
        errors.push(keys.slice(0, index + 1).join('.'));
        break;
      }
      datum = datum[key];
    }
  })
  return errors;
}

/**
 * myAppのバリデーション
 * @param dat 検証するmyApp
 * @returns {false|boolean}
 */
export function validateMyApp(dat){
  //myAppの型設計
  const typeName = [
    'user', 'dataSet', 'sceneCount', 'scene', 'menuCases',
    'feasibilityCases', 'saveDate',
    'user.displayName', 'user.email', 'user.country',
    'user.subnational1', 'user.subnational2', 'user.subnational3',
    'user.organization', 'user.title', 'user.uid', 'user.phoneNumber',
    'dataSet.fctId', 'dataSet.driId', 'dataSet.regionId',
    'dataSet.fct', 'dataSet.dri'
  ]
  let res = true
  const myError = validateObject(dat, typeName)
  if (myError.length > 0){
    console.log(myError)
    res = false
  }

  return isObject(dat) && res
}
/**
 * FCTのバリデーション
 * @param dat 検証するFCT
 * @returns {false|boolean}
 */
export function validateFct(dat){
  //FCTの型設計
  const typeName = [
    'Carbohydrate',
    'Energy',
    'FE',
    'Fat',
    'Food_name',
    'Protein',
    'VITA_RAE',
    'food_group_unicef',
    'food_grp_id',
    'FCT_id'
  ]
  let res = true
  const myError = validateObject(dat, typeName)
  if (myError.length > 0){
    console.log(myError)
    res = false
  }

  return isObject(dat) && res
}
/**
 * portionUnitのバリデーション
 * @param dat 検証するportionUnit
 * @returns {false|boolean}
 */
export function validatePortionUnit(dat){
  //portionUnitの型設計
  const typeName = [
    'id',
    'FCT_id',
    'unit_weight',
    'count_method'
  ]
  let res = true
  const myError = validateObject(dat, typeName)
  if (myError.length > 0){
    console.log(myError)
    res = false
  }

  return isObject(dat) && res
}

export function validateMacroNutrient(dat){
  const check1 = (dat.length === 3)
  let check2 = false
  const typeName = [
    'val',
    'color'
  ]
  if (check1){
    check2 = true
    dat.forEach((item)=>{
      const myError = validateObject(item, typeName)
      if (myError.length > 0){
        console.log(myError)
        check2 = false
      }
      if (!(item.val >= 0)) {
        console.log('Param Error: validateMacroNutrient')
        check2 = false
      }
    })
  }
  return check2
}

/**
 * ターゲットグループの構成とdri一蘭から栄養需要を計算する
 * @param target ターゲット構成[id, count]
 * @param dri
 * @returns {*}
 */
export function getNutritionDemand(target, dri) {
    return target.reduce((accumulator, item, index) => {
      const count = item.count
      accumulator.En += Number(count) * Number(dri[index].En)
      accumulator.Pr += Number(count) * Number(dri[index].Pr)
      accumulator.Va += Number(count) * Number(dri[index].Va)
      accumulator.Fe += Number(count) * Number(dri[index].Fe)
      return accumulator
    }, {'En':0, 'Pr':0, 'Va':0, 'Fe':0})
}

/**
 * 選択された作物一蘭から栄養供給量を計算
 * @param datArray [En, Pr, Va, Fe, Wt]
 * @returns {T}
 */
export function getNutritionSupply(datArray){
  return datArray.reduce((accumulator, item) => {
    accumulator.En = (accumulator.En || 0) + Number(item.En)
    accumulator.Pr = (accumulator.Pr || 0) + Number(item.Pr)
    accumulator.Va = (accumulator.Va || 0) + Number(item.Va)
    accumulator.Fe = (accumulator.Fe || 0) + Number(item.Fe)
    accumulator.Wt = (accumulator.Wt || 0) + Number(item.Wt)
    return accumulator
  }, {})
}
