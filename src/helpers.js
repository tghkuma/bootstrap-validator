/**
 * 補助処理群
 */
export class Helpers {
  /**
   * フィールドから値を取得
   * @param {NodeList<HTMLElement>} ndValues NodeList
   * @return {string} 値
   */
  static getValue (ndValues) {
    const type = ndValues[0].attributes.type ? ndValues[0].attributes.type.value : null
    let val
    if (type === 'radio') {
      ndValues.forEach(el => {
        if (el.checked) {
          val = el.value
          return true
        }
      })
    } else if (type !== 'checkbox') {
      val = ndValues[0].value
    } else {
      val = []
      ndValues.forEach(el => {
        if (el.checked) {
          val.push(el.value)
        }
      })
    }
    return val
  }

  /**
   * 値が入力されているか？
   * @param {NodeList<HTMLElement>} ndValues NodeList
   * @return {boolean} true:入力, false:未入力
   */
  static existsValue (ndValues) {
    if (!ndValues || ndValues.length === 0) {
      return false
    }
    let ret
    const type = ndValues[0].attributes.type ? ndValues[0].attributes.type.value : null
    if (type === 'checkbox') {
      ret = false
      ndValues.forEach(el => {
        if (el.checked) {
          ret = true
          return true
        }
      })
    } else {
      ret = !!this.getValue(ndValues)
    }
    return ret
  }

  /**
   * エラー配列付加
   * @param {Array<Error>} arrErrors エラー情報配列
   * @param {Object} field    フィールド情報
   * @param {string|string[]} errors 追加エラー情報
   * @return {Array<Error>} エラー情報配列
   */
  static pushErrors (arrErrors, field, errors) {
    const label = field.label ? field.label : field.name
    if (typeof errors === 'string' && errors) {
      arrErrors.push({ name: field.name, label: label, message: errors })
    } else if (Array.isArray(errors)) {
      errors.forEach(error => {
        arrErrors.push({ name: field.name, label: label, message: error })
      })
    }
    return arrErrors
  }

  /**
   * エラーメッセージを返す
   * @param {Array<string|Object>} arrErrors エラー情報配列
   * @param {string} [delimiter] デリミタ
   * @returns {string} エラーメッセージ
   */
  static join (arrErrors, delimiter) {
    if (delimiter === undefined) delimiter = '\n'
    const arrErrorMessages = []
    arrErrors.forEach((error) => {
      if (typeof error === 'string' && error) {
        arrErrorMessages.push(error)
      } else {
        // -----------------------
        // エラー情報追加
        // error.name フィールド名
        // error.d_name フィールド表示名
        // error.message エラーメッセージ
        // -----------------------
        arrErrorMessages.push((error.label ? error.label : error.name) + ' : ' + error.message)
      }
    })
    return arrErrorMessages.join(delimiter)
  }

  /**
   * 文字列format
   * 文字列中の{0〜}に、2番目以降のパラメータ値を順次埋め込み
   * @param args[0] 文字列
   * @param args[1...] パラメータ値
   * @return {string} 加工文字列
   */
  static format (...args) {
    return args.reduce((previous, current, index) => {
      return previous.replace(new RegExp('\\{' + (index - 1) + '}', 'g'), current)
    })
  }

  /**
   * 半角英数字チェック
   * @param {string} _text  文字列
   * @return {boolean} true:OK, false:NG
   */
  static isHankaku (_text) {
    // 半角以外が存在する場合
    return !(/[^\x20-\x7E]/).test(_text)
  }

  /**
   * 全角チェック
   * @param {string} _text  文字列
   * @return {boolean} true:OK, false:NG
   */
  static isZenkaku (_text) {
    return !(/[\w\-.]/).test(_text)
  }

  /**
   * 電話番号チェック
   * @param {string} _text  文字列
   * @return {boolean} true:OK, false:NG
   */
  static isTel (_text) {
    // 「0～9」「-」「(」「)」以外があったらエラー
    return !(/[^0-9-()]/).test(_text)
  }

  /**
   * 整数チェック
   * @param {string} _value 値
   * @return {boolean} true:OK, false:NG
   */
  static isInteger (_value) {
    const test = /^(-\d+|\d*)$/.test('' + _value)
    return test && !isNaN(_value)
  }

  /**
   * 年月日整合性チェック
   * @param {string|?number} [_year]  年
   * @param {string|?number} [_month] 月
   * @param {string|?number} [_day] 日
   * @return {boolean} true:OK, false:NG
   */
  static isDate (_year, _month, _day) {
    //= =========================
    // 年範囲チェック
    //= =========================
    if (_year < 1900 || _year > 9999) {
      return false
    }
    //= =========================
    // 月範囲チェック
    //= =========================
    if (_month < 1 || _month > 12) {
      return false
    }
    //= =========================
    // 日範囲チェック
    //= =========================
    // 最小値
    if (_day < 1) {
      return false
    }
    // 最大値
    const arrMaxMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
    // 2月うるう年補正
    if ((_year % 4 === 0 && _year % 100 !== 0) || _year % 400 === 0) {
      arrMaxMonth[1] = 29
    }
    return !(arrMaxMonth[_month - 1] < _day)
  }

  /**
   * 時分整合性チェック
   * @param {string|number} _hour  時
   * @param {string|number} _minute  分
   * @param {string|?number} [_second]  秒(null=未チェック)
   * @return {boolean} true:OK, false:NG
   */
  static isTime (_hour, _minute, _second) {
    // ====================
    // 時範囲チェック
    // ====================
    if (_hour < 0 || _hour >= 24) {
      return false
    }
    // =====================
    // 分範囲チェック
    // =====================
    if (_minute < 0 || _minute >= 60) {
      return false
    }
    // =====================
    // 秒範囲チェック
    // =====================
    return !(_second !== null && (_second < 0 || _second >= 60))
  }

  /**
   * 全角カタカナチェック
   * @param {string} _text  文字列
   * @return {boolean} true:OK, false:NG
   */
  static isAllKana (_text) {
    for (let i = 0; i < _text.length; i++) {
      if (_text.charAt(i) < 'ァ' || _text.charAt(i) > 'ヶ') {
        if (_text.charAt(i) !== 'ー' && _text.charAt(i) !== ' ' && _text.charAt(i) !== '　') {
          return false
        }
      }
    }
    return true
  }

  /**
   * 全角ひらがなチェック
   * @param {string} _text  文字列
   * @return {boolean} true:OK, false:NG
   */
  static isAllHiragana (_text) {
    for (let i = 0; i < _text.length; i++) {
      if (_text.charAt(i) < 'ぁ' || _text.charAt(i) > 'ん') {
        if (_text.charAt(i) !== 'ー' && _text.charAt(i) !== ' ' && _text.charAt(i) !== '　') {
          return false
        }
      }
    }
    return true
  }

  /**
   * EMailチェック
   * @param {string} _strEmail  EMAIL
   * @return {string} '':エラー無し, ''以外:エラー
   */
  static isEmailEx (_strEmail) {
    const emailPat = /^(.+)@(.+)$/
    const specialChars = '\\(\\)<>@,;:\\\\\\"\\.\\[\\]'
    const validChars = '[^\\s' + specialChars + ']'
    const atom = validChars + '+'
    const domainPat = new RegExp('^' + atom + '(\\.' + atom + ')*$')

    // 最初の「@」で分割
    const matchArray = _strEmail.match(emailPat)

    // 「@」がない
    if (matchArray === null) {
      return this.settings.messages.MAIL_NO_AT
    }

    // ユーザーとドメインとして格納
    const domain = matchArray[2]

    // ドメイン名パターンチェック
    const domainArray = domain.match(domainPat)
    if (domainArray === null) {
      return this.settings.messages.MAIL_NO_DOMAIN
    }

    const atomPat = new RegExp(atom, 'g')
    const domArr = domain.match(atomPat)
    const len = domArr.length

    // 最後のドメインが2文字か3文字の以外のとき、エラー
    // ex) jp,comはOK
    if (domArr[domArr.length - 1].length < 2 || domArr[domArr.length - 1].length > 4) {
      return this.settings.messages.MAIL_INVALID_LOCALE
    }

    if (len < 2) {
      return this.settings.messages.MAIL_INVALID_LOCALE
    }
    return ''
  };
}
