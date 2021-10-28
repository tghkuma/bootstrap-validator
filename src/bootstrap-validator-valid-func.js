/**
 * バリデーション関数群(値なし)
 */
export class BootstrapValidatorValidFunc {
  /**
   * 数値チェック(値なし)
   * @param {object} field フィールド
   * @param {NodeList<HTMLInputElement>} ndValues 値NodeList
   * @param {array} [params] ルールパラメータ
   * @param {BootstrapValidator} [v] validatorインスタンス
   * @returns {string|null} エラーメッセージ(正常時null)
   */
  static numeric (field, ndValues, params, v) {
    // type="number"時の仮対策
    if (ndValues && ndValues[0].validity && ndValues[0].validity.badInput) {
      return ndValues[0].validationMessage
    }
    return null
  }

  /**
   * チェックボックス
   * @param {object} field フィールド
   * @param {NodeList} ndValues 値NodeList
   * @param {Array<string|number>} params ルールパラメータ
   * @param {string|number} params.0 最小選択数
   * @param {string|number} params.1 最大選択数
   * @param {BootstrapValidator} [v] validatorインスタンス
   * @returns {string|null} エラーメッセージ(正常時null)
   */
  static checkbox (field, ndValues, params, v) {
    const check = v.helpers.getValue(ndValues).length
    const min = Number(params[0])
    if (params.length >= 2) {
      const max = Number(params[1])
      if (check < min || max < check) {
        return v.helpers.format(v.settings.messages.CHECKBOX_RANGE, min, max)
      }
    } else {
      if (check < min) {
        return v.helpers.format(v.settings.messages.CHECKBOX_MIN, min)
      }
    }
  }

  /**
   * 郵便番号の4桁部分が入力された場合
   * 3桁部が入力必須になるチェック
   * @param {object} field フィールド
   * @param {NodeList} ndValues 値NodeList
   * @param {array} [params] ルールパラメータ
   * @param {BootstrapValidator} [v] validatorインスタンス
   * @returns {string|null} エラーメッセージ(正常時null)
   */
  // eslint-disable-next-line camelcase
  static zip_ex (field, ndValues, params, v) {
    const zipAfter = v.querySelectorByName(field.name + v.settings.zip_suffix)
    if (!v.helpers.existsValue(ndValues) && v.helpers.existsValue(zipAfter)) {
      return v.settings.messages.INSUFFICIENT
    }
    return null
  }

  /**
   * 年月日チェック
   * フォーム name+"_y", name+"_m", name+"_d"のチェックを行う
   * 3桁部が入力必須になるチェック
   * @param {object} field フィールド
   * @param {NodeList} ndValues 値NodeList
   * @param {array} params ルールパラメータ
   * @param {string} params.0 'required':必須チェック
   * @param {BootstrapValidator} [v] validatorインスタンス
   * @returns {string[]|null} エラーメッセージ(正常時null)
   */
  static ymd (field, ndValues, params, v) {
    // 変数宣言
    const arrErrors = []

    // 日付オブジェクト取得
    let year = null
    let month = null
    let day = null
    let isYear = false
    let isMonth = false
    let isDay = false
    const objY = v.querySelectorByName(field.name + v.settings.ymd_suffix_y)
    const objM = v.querySelectorByName(field.name + v.settings.ymd_suffix_m)
    const objD = v.querySelectorByName(field.name + v.settings.ymd_suffix_d)
    if (v.helpers.existsValue(objY)) {
      isYear = true
      year = v.helpers.getValue(objY)
    }
    if (v.helpers.existsValue(objM)) {
      isMonth = true
      month = v.helpers.getValue(objM)
    }
    if (v.helpers.existsValue(objD)) {
      isDay = true
      day = v.helpers.getValue(objD)
    }

    // 日付必須チェック
    if (params[0] === 'required') {
      if (!isYear) {
        arrErrors.push(v.helpers.format(v.settings.messages.REQUIRED_PART, v.settings.messages.DATE_PART_Y))
      }
      if (!isMonth) {
        arrErrors.push(v.helpers.format(v.settings.messages.REQUIRED_PART, v.settings.messages.DATE_PART_M))
      }
      if (!isDay) {
        arrErrors.push(v.helpers.format(v.settings.messages.REQUIRED_PART, v.settings.messages.DATE_PART_D))
      }
    } else {
      // 日付の年月日が一部のみ入力されているとき
      if ((isYear || isMonth || isDay) && !(isYear && isMonth && isDay)) {
        if (!isYear) {
          arrErrors.push(v.helpers.format(v.settings.messages.INSUFFICIENT_PART, v.settings.messages.DATE_PART_Y))
        }
        if (!isMonth) {
          arrErrors.push(v.helpers.format(v.settings.messages.INSUFFICIENT_PART, v.settings.messages.DATE_PART_M))
        }
        if (!isDay) {
          arrErrors.push(v.helpers.format(v.settings.messages.INSUFFICIENT_PART, v.settings.messages.DATE_PART_D))
        }
      }
    }
    // 年数値チェック
    if (isYear && !v.helpers.isInteger(year)) {
      arrErrors.push(v.helpers.format(v.settings.messages.INTEGER_PART, v.settings.messages.DATE_PART_Y))
    }
    // 月数値チェック
    if (isMonth && !v.helpers.isInteger(month)) {
      arrErrors.push(v.helpers.format(v.settings.messages.INTEGER_PART, v.settings.messages.DATE_PART_M))
    }
    // 日数値チェック
    if (isDay && !v.helpers.isInteger(day)) {
      arrErrors.push(v.helpers.format(v.settings.messages.INTEGER_PART, v.settings.messages.DATE_PART_D))
    }

    // 年月日チェック
    if (arrErrors.length === 0 && !v.helpers.isDate(year, month, day)) {
      arrErrors.push(v.helpers.format(v.settings.messages.DATE_INVALID))
    }

    return arrErrors
  }
}
