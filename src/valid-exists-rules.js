/**
 * バリデーション関数群(値あり)
 */
export class ValidExistsRules {
  /**
   * 確認項目
   * @param {object} field フィールド
   * @param {NodeList} ndValues 値NodeList
   * @param {Array<string|number>} [params] ルールパラメータ
   * @param {BootstrapValidator} [v] validatorインスタンス
   * @returns {string|null} エラーメッセージ(正常時null)
   */
  static confirm (field, ndValues, params, v) {
    const ndConfirmValues = v.querySelectorByName(field.name + v.settings.confirm_suffix)
    if (!ndValues || (!ndConfirmValues || ndConfirmValues.length === 0) ||
      v.helpers.getValue(ndValues) !== v.helpers.getValue(ndConfirmValues)) {
      return v.helpers.format(
        v.settings.messages.CONFIRM,
        (field.label ? field.label : v.settings.messages.CONFIRM_FIELD))
    }
    return null
  }

  /**
   * E-Mailチェック
   * @param {object} field フィールド
   * @param {NodeList} ndValues 値NodeList
   * @param {Array<string|number>} [params] ルールパラメータ
   * @param {BootstrapValidator} [v] validatorインスタンス
   * @returns {string|null} エラーメッセージ(正常時null)
   */
  static email (field, ndValues, params, v) {
    const val = v.helpers.getValue(ndValues)
    if (val) {
      const errorEmail = v.helpers.isEmailEx.apply(v, [val])
      if (errorEmail !== '') {
        return errorEmail
      }
    }
    return null
  }

  /**
   * 全角
   * @param {object} field フィールド
   * @param {NodeList} ndValues 値NodeList
   * @param {Array<string|number>} [params] ルールパラメータ
   * @param {BootstrapValidator} [v] validatorインスタンス
   * @returns {string|null} エラーメッセージ(正常時null)
   */
  static zenkaku (field, ndValues, params, v) {
    if (!v.helpers.isZenkaku(v.helpers.getValue(ndValues))) {
      return v.settings.messages.ZENKAKU
    }
    return null
  }

  /**
   * 半角
   * @param {object} field フィールド
   * @param {NodeList} ndValues 値NodeList
   * @param {Array<string|number>} [params] ルールパラメータ
   * @param {BootstrapValidator} [v] validatorインスタンス
   * @returns {string|null} エラーメッセージ(正常時null)
   */
  static hankaku (field, ndValues, params, v) {
    if (!v.helpers.isHankaku(v.helpers.getValue(ndValues))) {
      return v.settings.messages.HANKAKU
    }
    return null
  }

  /**
   * 全角カタカナ
   * @param {object} field フィールド
   * @param {NodeList} ndValues 値NodeList
   * @param {Array<string|number>} [params] ルールパラメータ
   * @param {BootstrapValidator} [v] validatorインスタンス
   * @returns {string|null} エラーメッセージ(正常時null)
   */
  // eslint-disable-next-line camelcase
  static zen_katakana (field, ndValues, params, v) {
    if (!v.helpers.isAllKana(v.helpers.getValue(ndValues))) {
      return v.settings.messages.ZEN_KANA
    }
    return null
  }

  /**
   * 全角ひらがな
   * @param {object} field フィールド
   * @param {NodeList} ndValues 値NodeList
   * @param {Array<string|number>} [params] ルールパラメータ
   * @param {BootstrapValidator} [v] validatorインスタンス
   * @returns {string|null} エラーメッセージ(正常時null)
   */
  static hiragana (field, ndValues, params, v) {
    if (!v.helpers.isAllHiragana(v.helpers.getValue(ndValues))) {
      return v.settings.messages.HIRAGANA
    }
    return null
  }

  /**
   * 電話番号
   * @param {object} field フィールド
   * @param {NodeList} ndValues 値NodeList
   * @param {Array<string|number>} [params] ルールパラメータ
   * @param {BootstrapValidator} [v] validatorインスタンス
   * @returns {string|null} エラーメッセージ(正常時null)
   */
  static tel (field, ndValues, params, v) {
    if (!v.helpers.isTel(v.helpers.getValue(ndValues))) {
      return v.settings.messages.TEL
    }
    return null
  }

  /**
   * 数値チェック
   * @param {object} field フィールド
   * @param {NodeList} ndValues 値NodeList
   * @param {Array<string|number>} [params] ルールパラメータ
   * @param {BootstrapValidator} [v] validatorインスタンス
   * @returns {string|null} エラーメッセージ(正常時null)
   */
  static numeric (field, ndValues, params, v) {
    // type="text"の時
    const val = v.helpers.getValue(ndValues)
    if (!isFinite(val) || val.indexOf(' ') !== -1 || val.indexOf('0x') !== -1) {
      return v.settings.messages.NUMERICAL_VALUE
    }
    return null
  }

  /**
   * 最小文字数
   * @param {object} field フィールド
   * @param {NodeList} ndValues 値NodeList
   * @param {Array<string|number>} params ルールパラメータ
   * @param {string|number} params.0 文字数
   * @param {BootstrapValidator} [v] validatorインスタンス
   * @returns {string|null} エラーメッセージ(正常時null)
   */
  static minlength (field, ndValues, params, v) {
    const min = Number(params[0])
    if (v.helpers.getValue(ndValues).length < min) { return v.helpers.format(v.settings.messages.MIN_LENGTH, min) }
    return null
  }

  /**
   * 最大文字数
   * @param {object} field フィールド
   * @param {NodeList} ndValues 値NodeList
   * @param {Array<string|number>} params ルールパラメータ
   * @param {string|number} params.0 文字数
   * @param {BootstrapValidator} [v] validatorインスタンス
   * @returns {string|null} エラーメッセージ(正常時null)
   */
  static maxlength (field, ndValues, params, v) {
    const max = Number(params[0])
    if (max < v.helpers.getValue(ndValues).length) { return v.helpers.format(v.settings.messages.MAX_LENGTH, max) }
    return null
  }

  /**
   * 数値桁数チェック
   * @param {object} field フィールド
   * @param {NodeList} ndValues 値NodeList
   * @param {Array<string|number>} params ルールパラメータ
   * @param {string|number} params.0 最小桁数
   * @param {string|number} params.1 最大桁数
   * @param {BootstrapValidator} [v] validatorインスタンス
   * @returns {string|null} エラーメッセージ(正常時null)
   */
  static numlength (field, ndValues, params, v) {
    const val = v.helpers.getValue(ndValues)
    let tmpReg = params[0]
    let tmpErrorMessage = params[0]
    if (params[1]) {
      tmpReg += ',' + params[1]
      tmpErrorMessage += '～' + params[1]
    }
    const reg = new RegExp('^\\d{' + tmpReg + '}$')
    if (!reg.test(val)) {
      return v.helpers.format(v.settings.messages.NUM_LENGTH, tmpErrorMessage)
    }
    return null
  }

  /**
   * 最小値
   * @param {object} field フィールド
   * @param {NodeList} ndValues 値NodeList
   * @param {Array<string|number>} params ルールパラメータ
   * @param {string|number} params.0 最小値
   * @param {BootstrapValidator} [v] validatorインスタンス
   * @returns {string|null} エラーメッセージ(正常時null)
   */
  static min (field, ndValues, params, v) {
    /* jscpd:ignore-start */
    const val = v.helpers.getValue(ndValues)
    if (!v.helpers.isInteger(val)) {
      return v.settings.messages.INTEGER
    }
    const min = Number(params[0])
    /* jscpd:ignore-end */
    if (val < min) { return v.helpers.format(v.settings.messages.MIN, min) }
    return null
  }

  /**
   * 最大値
   * @param {object} field フィールド
   * @param {NodeList} ndValues 値NodeList
   * @param {Array<string|number>} params ルールパラメータ
   * @param {string|number} params.0 最大値
   * @param {BootstrapValidator} [v] validatorインスタンス
   * @returns {string|null} エラーメッセージ(正常時null)
   */
  static max (field, ndValues, params, v) {
    const val = v.helpers.getValue(ndValues)
    if (!v.helpers.isInteger(val)) {
      return v.settings.messages.INTEGER
    }
    const max = Number(params[0])
    if (max < val) { return v.helpers.format(v.settings.messages.MIN, max) }
    return null
  }

  /**
   * 数値範囲
   * @param {object} field フィールド
   * @param {NodeList} ndValues 値NodeList
   * @param {Array<string|number>} params ルールパラメータ
   * @param {string|number} params.0 最小値
   * @param {string|number} params.1 最大値
   * @param {BootstrapValidator} [v] validatorインスタンス
   * @returns {string|null} エラーメッセージ(正常時null)
   */
  static range (field, ndValues, params, v) {
    /* jscpd:ignore-start */
    const val = v.helpers.getValue(ndValues)
    if (!v.helpers.isInteger(val)) {
      return v.settings.messages.INTEGER
    }
    const min = Number(params[0])
    /* jscpd:ignore-end */
    const max = Number(params[1])
    if (val < min || max < val) { return v.helpers.format(v.settings.messages.RANGE, min, max) }
    return null
  }

  /**
   * 日付
   * @param {object} field フィールド
   * @param {NodeList} ndValues 値NodeList
   * @param {Array<string|number>} [params] ルールパラメータ
   * @param {BootstrapValidator} [v] validatorインスタンス
   * @returns {string|null} エラーメッセージ(正常時null)
   */
  static date (field, ndValues, params, v) {
    const val = v.helpers.getValue(ndValues)
    // 1980/1/2
    //      ↓
    // 1980/1/2,1980/1/2,1980,1,2
    if (!val.match(/^((\d{1,4})[/-](\d{1,2})[/-](\d{1,2}))$/g)) {
      return v.settings.messages.DATE
    }
    // 年月日チェック
    if (!v.helpers.isDate(RegExp.$2, RegExp.$3, RegExp.$4)) {
      return v.settings.messages.DATE_INVALID
    }
    return null
  }

  /**
   * 日時チェック
   * [YYYY-MM-DD hh:mm:ss]または[YYYY/MM/DD]の書式でチェックする
   * @param {object} field フィールド
   * @param {NodeList} ndValues 値NodeList
   * @param {Array<string|number>} [params] ルールパラメータ
   * @param {BootstrapValidator} [v] validatorインスタンス
   * @returns {string|null} エラーメッセージ(正常時null)
   */
  static datetime (field, ndValues, params, v) {
    const val = v.helpers.getValue(ndValues)
    // 1980/1/2 24:12:11
    //      ↓
    // 1980/1/2 23:12:11,1980/1/2,1980,1,2, 24:12:11,23:12:11,23,12,11
    if (!val.match(/^((\d{1,4})[/-](\d{1,2})[/-](\d{1,2}))( ((\d{1,2}):(\d{1,2})(:(\d{1,2}))?))?$/g)) {
      return v.settings.messages.DATETIME
    }
    // 年月日チェック
    if (!v.helpers.isDate(RegExp.$2, RegExp.$3, RegExp.$4)) {
      return v.settings.messages.DATE_INVALID
    }
    if (RegExp.$6 && !v.helpers.isTime(RegExp.$7, RegExp.$8, RegExp.$10)) {
      return v.settings.messages.TIME_INVALID
    }
    return null
  }

  /**
   * 日付チェック
   * [YYYY/MM/DD] or [YYYY/MM] or [YYYY]の書式でチェックする
   * @param {object} field フィールド
   * @param {NodeList} ndValues 値NodeList
   * @param {Array<string|number>} [params] ルールパラメータ
   * @param {BootstrapValidator} [v] validatorインスタンス
   * @returns {string|null} エラーメッセージ(正常時null)
   */
  // eslint-disable-next-line camelcase
  static date_ex (field, ndValues, params, v) {
    const val = v.helpers.getValue(ndValues)
    // 1980/1/2
    //      ↓
    // 1980/1/2,1980/1/2,1980,1,2
    if (!val.match(/^(\d{1,4})([/-](\d{1,2})([/-](\d{1,2}))?)?$/)) {
      return v.settings.messages.DATE_EX
    }
    // 年月日チェック
    const y = RegExp.$1
    const m = RegExp.$3 ? RegExp.$3 : 1
    const d = RegExp.$5 ? RegExp.$5 : 1
    if (!v.helpers.isDate(y, m, d)) {
      return v.settings.messages.DATE_INVALID
    }
    return null
  }

  /**
   * 時間チェック
   * [hh:mm:ss]の書式でチェックする
   * @param {object} field フィールド
   * @param {NodeList} ndValues 値NodeList
   * @param {Array<string|number>} params ルールパラメータ
   * @param {string} params.0 'hm' [hh:mm]の書式でチェックする
   * @param {BootstrapValidator} [v] validatorインスタンス
   * @returns {string|null} エラーメッセージ(正常時null)
   */
  static time (field, ndValues, params, v) {
    const val = v.helpers.getValue(ndValues)
    if (params[0] === 'hm') {
      if (!val.match(/^(\d{1,2}):(\d{1,2})$/g)) {
        return v.settings.messages.TIME_HM
      }
      if (!v.helpers.isTime(RegExp.$1, RegExp.$2, 0)) {
        return v.settings.messages.TIME_INVALID
      }
    } else {
      if (!val.match(/^(\d{1,2}):(\d{1,2}):(\d{1,2})$/g)) {
        return v.settings.messages.TIME
      }
      if (!v.helpers.isTime(RegExp.$1, RegExp.$2, RegExp.$3)) {
        return v.settings.messages.TIME_INVALID
      }
    }
    return null
  }

  /**
   * 郵便番号
   * @param {object} field フィールド
   * @param {NodeList} ndValues 値NodeList
   * @param {Array<string|number>} [params] ルールパラメータ
   * @param {BootstrapValidator} [v] validatorインスタンス
   * @returns {string|null} エラーメッセージ(正常時null)
   */
  static zip (field, ndValues, params, v) {
    const val = v.helpers.getValue(ndValues)
    if (!val.match(/^\d{1,3}-\d{1,4}$/g)) {
      return v.settings.messages.ZIP
    }
    return null
  }

  /**
   * 正規表現チェック
   * @param {object} field フィールド
   * @param {NodeList} ndValues 値NodeList
   * @param {Array<string|number>} params ルールパラメータ
   * @param {string|RegExp} params.0 正規表現(文字列 or 正規表現クラス)
   * @param {string} params.1 正規表現フラグ(オプション)
   * @param {string} params.{1|2} エラーメッセージ(オプション)
   * @param {BootstrapValidator} [v] validatorインスタンス
   * @returns {string|null} エラーメッセージ(正常時null)
   */
  static regexp (field, ndValues, params, v) {
    const val = v.helpers.getValue(ndValues)
    let reg, errorMessage
    if (!Array.isArray(params)) {
      params = [params]
    }
    try {
      if (typeof params[0] === 'string') {
        reg = new RegExp(params[0], params[1] ? params[1] : undefined)
        errorMessage = params[2]
      } else {
        reg = params[0]
        errorMessage = params[1]
      }
      if (!reg.test(val)) { return (errorMessage || v.settings.messages.REGEXP_INVALID_VALUE) }
    } catch (e) {
      return v.settings.messages.REGEXP_INVALID_PARAM
    }
    return null
  }
}
