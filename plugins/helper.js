/**
 * Objectをkeyでsortして返す
 * @param objects sort対象のObject
 * @param key sortするkey
 * @returns {Promise<*>}
 */
export async function objectSort(objects, key) {
  objects.sort(function (a, b) {
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
  const item = Number(val ? val : 0)
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
export function isKeyContained(myObject, key) {
  const keys = Object.keys(myObject)
  return (keys.indexOf(key) >= 0)
}

/**
 * Array validation
 *     Arrayであるかどうかチェック
 * @param item 検査対象の変数
 * @returns {boolean}
 */
export function isArray(item) {
  return Object.prototype.toString.call(item) === '[object Array]';
}

/**
 * Object validation
 *     Objectであるかどうかチェック
 * @param item 検査対象の変数
 * @returns {boolean}
 */
export function isObject(item) {
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
export function validateObject(data, types) {
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
export function validateMyApp(dat) {
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
  if (myError.length > 0) {
    console.log(myError)
    res = false
  }

  return isObject(dat) && res
}

export function validateMyFamily(dat) {
  //myFamilyの型設計
  const typeName = [
    'name', 'member', 'menuCases', 'feasibilityCases',
  ]
  let res = true
  const myError = validateObject(dat, typeName)
  if (myError.length > 0) {
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
export function validateFct(dat) {
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
  if (myError.length > 0) {
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
export function validatePortionUnit(dat) {
  //portionUnitの型設計
  const typeName = [
    'id',
    'FCT_id',
    'unit_weight',
    'count_method'
  ]
  let res = true
  const myError = validateObject(dat, typeName)
  if (myError.length > 0) {
    console.log(myError)
    res = false
  }

  return isObject(dat) && res
}

export function validateMacroNutrient(dat) {
  const check1 = (dat.length === 3 || dat.length === 4)
  let check2 = false
  const typeName = [
    'val',
    'color'
  ]
  if (check1) {
    check2 = true
    dat.forEach((item) => {
      const myError = validateObject(item, typeName)
      if (myError.length > 0) {
        console.log(myError)
        check2 = false
      }
      if (!(item.val >= 0)) {
        console.log('Param Error: validateMacroNutrient')
        console.log(dat)
        console.log(item)
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
  console.log('getNutritionDemand')
  const initObj = {
    'En': 0,
    'Pr': 0,
    'Va': 0,
    'Fe': 0,
    'Wt': 0,
  }
  if (!target || (target.length === 0)) {
    return initObj
  }
  return target.reduce((accumulator, currentItem, index) => {
    const count = Number(currentItem.count)
    accumulator.En += count * Number(dri[index].En)
    accumulator.Pr += count * Number(dri[index].Pr)
    accumulator.Va += count * Number(dri[index].Va)
    accumulator.Fe += count * Number(dri[index].Fe)
    accumulator.Wt += count * Number(dri[index].Wt)
    return accumulator
  }, initObj)
}
/**
 * targetグループから栄養摂取目標を計算
 * @param targetGroup
 * @param dri
 * @returns {*}
 */
export function getNutritionDemandList(targetGroup, dri) {
  return targetGroup.map(function (target) {
    return getNutritionDemand(target, dri)
  })
}



/**
 * 選択された作物一蘭から栄養供給量を計算
 * @param datArray
 * @param stapleCheck
 * @returns {*}
 */
export function getNutritionSupply(datArray, stapleCheck = 0) {
  return datArray.reduce((accumulator, item) => {
    //Pr, Fe, Fatについて、別変数を用意
    let myPr = item.Pr ? item.Pr : 0
    let myFe = item.Fe ? item.Fe : 0
    let myFat = item.Fat ? item.Fat : 0

    // stapleCheck=1, かつ食品群がstapleであった場合、Pr、Fe の値を無視
    if (stapleCheck === 1 && Number(item.food_grp_id) === 1) {
      myPr = 0
      myFe = 0
      myFat = 0
    }

    accumulator.En += Number(item.En ? item.En : 0) * Number(item.Wt) / 100
    accumulator.Pr += Number(myPr) * Number(item.Wt) / 100
    accumulator.Va += Number(item.Va ? item.Va : 0) * Number(item.Wt) / 100
    accumulator.Fe += Number(myFe) * Number(item.Wt) / 100
    accumulator.Carbohydrate += Number(item.Carbohydrate ? item.Carbohydrate : 0) * Number(item.Wt) / 100
    accumulator.Fat += Number(myFat) * Number(item.Wt) / 100
    accumulator.Wt += Number(item.Wt)
    return accumulator
  }, {
    'En': 0,
    'Pr': 0,
    'Va': 0,
    'Fe': 0,
    'Wt': 0,
    'Carbohydrate': 0,
    'Fat': 0
  })
}

/**
 * 栄養必要量、栄養供給量, 目標充足率から必要な作物位の生産量を計算する
 * @param nutrientsDemand
 * @param nutrientsSupply
 * @param keyNutrient
 * @param share
 * @returns {number|number}
 */
export function getProductionTarget(nutrientsDemand, nutrientsSupply, keyNutrient, share) {
  const rep1 = nutrientsDemand[keyNutrient] ? nutrientsDemand[keyNutrient] : 0
  const rep2 = nutrientsSupply ? nutrientsSupply[keyNutrient] : 0
  return rep2 ? Math.round((rep1 * 100 / rep2) * share / 100) : 0
}

/**
 * 選択された作物から栄養供給量を計算
 * @param crops
 * @param count
 * @returns {{Pr: number, Fat: number, En: number, Carbohydrate: number, Va: number, Wt: number, Fe: number}[]|*}
 */
export function getNutritionSupplyList(crops, count) {
  console.log('getNutritionSupplyList')
  console.log(crops)
  const initObj = {
    'En': 0,
    'Pr': 0,
    'Va': 0,
    'Fe': 0,
    'Wt': 0,
    'Carbohydrate': 0,
    'Fat': 0
  }
  if (crops.length === 0) {
    return [...Array(count)].map(() => initObj)
  }
  return crops.map((datArray) => {
    console.log(datArray)
    let res = initObj
    if (datArray.length !== 0) {
      if (datArray.menu.length > 0) {
        res = getNutritionSupply(datArray.menu)
      }
    }
    return res
  })
}
