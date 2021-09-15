export class BootstrapValidator {
  /**
   * コンストラクタ
   * @param form
   * @param [options]
   */
  constructor (form, options) {
    /** フォームElement */
    this.form = form
    /** フィールド情報 */
    if (options && options.fields) {
      this.fields = options.fields
    }
    /** 初期設定情報 */
    this._settings = {
      submit: 'validate',
      fields: null,
      confirm_suffix: '_confirm',
      zip_suffix: '_after',
      ymd_suffix_y: '_y',
      ymd_suffix_m: '_m',
      ymd_suffix_d: '_d',
      errorType: null,
      setError: null,
      clearError: null,
      /** メッセージ */
      messages: MESSAGES
    }
    this._helpers = BootstrapValidatorHelpers
    this._validFunc = BootstrapValidatorValidFunc
    this._validExistsFunc = BootstrapValidatorValidExistsFunc
  }

  /**
   * 設定データ取得
   * @return {settings} 設定データ
   */
  get settings () {
    return this._settings
  }

  /**
   * 設定データ更新
   * 既存の設定とマージする
   * @param {settings} settings 設定データ
   */
  set settings (settings) {
    this._settings = Object.assign(this._settings, settings)
  }

  /**
   * @param {string} name
   * @return {NodeList}
   */
  querySelectorAllByName (name) {
    const el = this.form.querySelectorAll('*[name="' + name + '"]')
    if (!el) {
      console.error('Not found element ' + name + '.')
    }
    return el
  }

  /**
   * エラー表示処理
   * @param {Object[]} arrErrors エラー一覧
   * @param {string} arrErrors[].name フィールド名
   * @param {string} arrErrors[].messages エラーメッセージ
   */
  displayError (arrErrors) {
    arrErrors.forEach(error => {
      this.setError(error.name, error.messages)
    })
    if (arrErrors.length > 0) {
      // 最初のエラーにフォーカス
      this.focusError(arrErrors[0].name)
    }
  }

  /**
   * 指定のエラーにフォーカス
   * @param {string} name
   */
  focusError (name) {
    const fields = this.querySelectorAllByName(name)
    if (fields && fields.length > 0) {
      fields[0].focus()
    } else {
      console.warn(this._helpers.format(this.settings.messages.NOT_EXISTS_FIELD, name))
    }
  }

  /**
   * 指定箇所エラー表示処理
   * @param {string} name 項目名
   * @param {string} messages エラー文言
   */
  setError (name, messages) {
    if (typeof this.settings.setError === 'function') {
      this.settings.setError.apply(this, [name, messages])
      // } else if (this.settings.errorType === 'bs5') {
      //   this.setErrorBootstrap5.apply(this, [name, messages]);
    } else {
      this.setErrorBootstrap(name, messages)
    }
  }

  /**
   * 指定箇所エラー表示処理
   * (Bootstrap5レイアウト)
   * @param {string} name 項目名
   * @param {string} messages エラー文言
   */
  setErrorBootstrap (name, messages) {
    const errDiv = document.createElement('div')
    errDiv.innerHTML = '<div class="invalid-feedback">' + messages + '</div>'
    const nodeList = this.querySelectorAllByName(name)
    const field = nodeList[0]
    const type = field.attributes.type ? field.attributes.type.value : null
    if (['radio', 'checkbox'].indexOf(type) !== -1) {
      nodeList.forEach(field2 => {
        field2.classList.add('is-invalid')
      })
      // field.parentNode.parentNode.insertBefore(errDiv.firstElementChild, field.nextElementSibling);
      const nodeBlock = field.parentNode.parentNode
      nodeBlock.classList.add('is-invalid')
      nodeBlock.parentNode.insertBefore(errDiv.firstElementChild, null)
    } else {
      field.classList.add('is-invalid')
      // field.parentNode.insertBefore(errDiv.firstElementChild, field.nextElementSibling);
      field.parentNode.insertBefore(errDiv.firstElementChild, null)
    }
  }

  /**
   * エラークリア処理
   * (Bootstrap5レイアウト)
   * @param {string} [name] 項目名
   */
  clearError (name) {
    if (typeof this.settings.clearError === 'function') {
      this.settings.clearError(name)
      // } else if (this.settings.errorType === 'bs5') {
      //   this.clearErrorBootstrap5.apply(this, [name]);
    } else {
      this.clearErrorBootstrap(name)
    }
  }

  /**
   * エラークリア処理
   * (Bootstrap5レイアウト)
   * @param {string} [name] 項目名
   */
  clearErrorBootstrap (name) {
    if (name) {
      const nodeList = this.querySelectorAllByName(name)
      const field = nodeList[0]
      const type = field.attributes.type ? field.attributes.type.value : null
      if (['radio', 'checkbox'].indexOf(type) !== -1) {
        const nodeBlock = field.parentNode.parentNode
        nodeBlock.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'))
        nodeBlock.parentNode.querySelectorAll('.invalid-feedback').forEach(el => el.remove())
      } else {
        this.form.querySelectorAll("*[name='" + name + "'].is-invalid").forEach(el => el.classList.remove('is-invalid'))
        this.form.querySelectorAll("*[name='" + name + "'] ~ .invalid-feedback").forEach(el => el.remove())
      }
    } else {
      this.form.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'))
      this.form.querySelectorAll('.invalid-feedback').forEach(el => el.remove())
    }
  }

  /**
   * バリデーション処理
   * @param {Object} [options] オプションフィールド情報
   * @return {boolean} true:正常
   */
  validate (options) {
    const fields = (options && options.fields) ? options.fields : this.fields
    let result = true
    const errors = this.getValidateResult(fields)
    if (errors.length > 0) {
      this.displayError(errors)
      result = false
    }
    // if (typeof settings.result === 'function') {
    //   result = settings.result.apply(this, [result, arrErrors]);
    // }
    return result
  }

  _parseRule (rule) {
    let params
    // ------------------
    // ルール分岐
    // ------------------
    // ルールが配列
    // [ 'ルール名', [<パラメータ配列>]]
    // [ 'ルール名', <パラメータ1>, <パラメータ2>..., <パラメータn> ]
    if (Array.isArray(rule)) {
      if (rule.length === 0) {
        return [null, null]
      } else if (rule.length === 2) {
        params = rule[1]
        if (!Array.isArray(params)) {
          params = [params]
        }
      } else if (rule.length >= 3) {
        params = rule.slice(1)
      }
      rule = rule[0]
    } else if (typeof rule === 'object') {
      // ルールがObject
      // { rule:'ルール名', params:[<パラメータ配列>]}
      if (!rule.rule) {
        return
      }
      if (rule.params) {
        params = rule.params
        if (!Array.isArray(params)) {
          params = [params]
        }
      }
      rule = rule.rule
    } else if (typeof rule === 'string') {
      // ルールが文字列(旧仕様)
      // パラメータ解析処理
      params = rule.split(':', 2)
      if (params[0]) {
        rule = params[0]
      }
      if (params[1]) {
        try {
          params = JSON.parse(params[1])
        } catch (e) {
          params = params[1].split(',')
        }
        if (!Array.isArray(params)) {
          params = [params]
        }
      } else {
        params = []
      }
    }
    return [rule, params]
  }

  /**
   * バリデーション結果取得
   * @returns {boolean|string[]} エラー値
   */
  getValidateResult (options) {
    const fields = (options && options.fields) ? options.fields : this.fields
    const arrRuleErrors = []
    fields.forEach(field => {
      const nodeList = this.querySelectorAllByName(field.name)
      if (!field.rules) {
        return
      }
      let rules = field.rules
      if (!Array.isArray(rules)) {
        rules = [rules]
      }
      rules.forEach(rule => {
        let params;
        [rule, params] = this._parseRule(rule)

        if (!this._helpers.existsValue(nodeList)) {
          if (rule === 'required') {
            if (!this._helpers.existsValue(nodeList)) {
              this._helpers.pushErrors(arrRuleErrors, field, this.settings.messages.REQUIRED)
            }
          } else if (typeof this._validFunc[rule] === 'function') {
            const errors = this._validFunc[rule].apply(this, [field, nodeList, params, this])
            this._helpers.pushErrors(arrRuleErrors, field, errors)
          }
        } else if (typeof this._validExistsFunc[rule] === 'function') {
          const errors = this._validExistsFunc[rule].apply(this, [field, nodeList, params, this])
          this._helpers.pushErrors(arrRuleErrors, field, errors)
        }
        if (typeof rule === 'function') {
          // 独自チェック関数
          const errors = rule.apply(this, [field, nodeList, params, this])
          this._helpers.pushErrors(arrRuleErrors, field, errors)
        }
      })
    })
    return arrRuleErrors
  }
}

class BootstrapValidatorHelpers {
  /**
   * フィールドから値を取得
   * @param {NodeList} nodeList NodeList
   * @return {string} 値
   */
  static getValue (nodeList) {
    const type = nodeList[0].attributes.type ? nodeList[0].attributes.type.value : null
    let val
    if (type === 'radio') {
      nodeList.forEach(el => {
        if (el.checked) {
          val = el.value
          return true
        }
      })
    } else if (type !== 'checkbox') {
      val = nodeList[0].value
    } else {
      val = []
      nodeList.forEach(el => {
        if (el.checked) {
          val.push(el.value)
        }
      })
    }
    return val
  }

  /**
   * 値が入力されているか？
   * @param {NodeList} nodeList NodeList
   * @return {boolean} true:入力, false:未入力
   */
  static existsValue (nodeList) {
    let ret
    if (!nodeList || nodeList.length === 0) {
      ret = false
    }
    const type = nodeList[0].attributes.type ? nodeList[0].attributes.type.value : null
    if (type === 'checkbox') {
      ret = false
      nodeList.forEach(el => {
        if (el.checked) {
          ret = true
          return true
        }
      })
    } else {
      ret = !!this.getValue(nodeList)
    }
    return ret
  }

  /**
   * エラー配列付加
   * @param {string[]|Object[]} arrErrors エラー情報配列
   * @param {Object} field    フィールド情報
   * @param {string|string[]} errors 追加エラー情報
   * @return {string[]|Object[]} array arrErrors
   */
  static pushErrors (arrErrors, field, errors) {
    const label = field.label ? field.label : field.name
    if (typeof errors === 'string' && errors) {
      arrErrors.push({ name: field.name, label: label, messages: errors })
    } else if (Array.isArray(errors)) {
      errors.forEach(error => arrErrors.push({ name: field.name, label: label, messages: error }))
    }
    return arrErrors
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
   * @param {?string} _value 値
   * @return {boolean} true:OK, false:NG
   */
  static isInteger (_value) {
    const test = /^(-\d+|\d*)$/.test('' + _value)
    return test && !isNaN(_value)
  }

  /**
   * 年月日整合性チェック
   * @param {?string|?number} _year  年
   * @param {?string|?number} _month 月
   * @param {?string|?number} _day 日
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
   * @param {?string|?number} _second  秒(null=未チェック)
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

class BootstrapValidatorValidFunc {
  /**
   * 数値チェック(値なし)
   * @param {object} field フィールド
   * @param {NodeList} nodeList セレクタNodeList
   * @param {array} [params] ルールパラメータ
   * @param {BootstrapValidator} [v] validatorインスタンス
   * @returns {string|null} エラーメッセージ(正常時null)
   */
  static numeric (field, nodeList, params, v) {
    // type="number"時の仮対策
    if (nodeList && nodeList[0].validity && nodeList[0].validity.badInput) {
      return nodeList[0].validationMessage
    }
    return null
  }
}

class BootstrapValidatorValidExistsFunc {
  /**
   * 確認項目
   * @param {object} field フィールド
   * @param {NodeList} nodeList セレクタNodeList
   * @param {array} [params] ルールパラメータ
   * @param {BootstrapValidator} [v] validatorインスタンス
   * @returns {string|null} エラーメッセージ(正常時null)
   */
  static confirm (field, nodeList, params, v) {
    const confirmVal = v.querySelectorAllByName(field.name + v.settings.confirm_suffix)
    if (!nodeList || !confirmVal ||
      v._helpers.getValue(nodeList) !== v._helpers.getValue(confirmVal)) {
      return v._helpers.format(
        v.settings.messages.CONFIRM,
        (field.label ? field.label : v.settings.messages.CONFIRM_FIELD))
    }
    return null
  }

  /**
   * E-Mailチェック
   * @param {object} field フィールド
   * @param {NodeList} nodeList セレクタNodeList
   * @param {array} [params] ルールパラメータ
   * @param {BootstrapValidator} [v] validatorインスタンス
   * @returns {string|null} エラーメッセージ(正常時null)
   */
  static email (field, nodeList, params, v) {
    const val = v._helpers.getValue(nodeList)
    if (val) {
      const errorEmail = v._helpers.isEmailEx.apply(v, [val])
      if (errorEmail !== '') {
        return errorEmail
      }
    }
    return null
  }

  /**
   * 全角
   * @param {object} field フィールド
   * @param {NodeList} nodeList セレクタNodeList
   * @param {array} [params] ルールパラメータ
   * @param {BootstrapValidator} [v] validatorインスタンス
   * @returns {string|null} エラーメッセージ(正常時null)
   */
  static zenkaku (field, nodeList, params, v) {
    if (!v._helpers.isZenkaku(v._helpers.getValue(nodeList))) {
      return v.settings.messages.ZENKAKU
    }
    return null
  }

  /**
   * 半角
   * @param {object} field フィールド
   * @param {NodeList} nodeList セレクタNodeList
   * @param {array} [params] ルールパラメータ
   * @param {BootstrapValidator} [v] validatorインスタンス
   * @returns {string|null} エラーメッセージ(正常時null)
   */
  static hankaku (field, nodeList, params, v) {
    if (!v._helpers.isHankaku(v._helpers.getValue(nodeList))) {
      return v.settings.messages.HANKAKU
    }
    return null
  }

  /**
   * 全角カタカナ
   * @param {object} field フィールド
   * @param {NodeList} nodeList セレクタNodeList
   * @param {array} [params] ルールパラメータ
   * @param {BootstrapValidator} [v] validatorインスタンス
   * @returns {string|null} エラーメッセージ(正常時null)
   */
  // eslint-disable-next-line camelcase
  static zen_katakana (field, nodeList, params, v) {
    if (!v._helpers.isAllKana(v._helpers.getValue(nodeList))) {
      return v.settings.messages.ZEN_KANA
    }
    return null
  }

  /**
   * 全角ひらがな
   * @param {object} field フィールド
   * @param {NodeList} nodeList セレクタNodeList
   * @param {array} [params] ルールパラメータ
   * @param {BootstrapValidator} [v] validatorインスタンス
   * @returns {string|null} エラーメッセージ(正常時null)
   */
  static hiragana (field, nodeList, params, v) {
    if (!v._helpers.isAllHiragana(v._helpers.getValue(nodeList))) {
      return v.settings.messages.HIRAGANA
    }
    return null
  }

  /**
   * 電話番号
   * @param {object} field フィールド
   * @param {NodeList} nodeList セレクタNodeList
   * @param {array} [params] ルールパラメータ
   * @param {BootstrapValidator} [v] validatorインスタンス
   * @returns {string|null} エラーメッセージ(正常時null)
   */
  static tel (field, nodeList, params, v) {
    if (!v._helpers.isTel(v._helpers.getValue(nodeList))) {
      return v.settings.messages.TEL
    }
    return null
  }

  /**
   * 数値チェック
   * @param {object} field フィールド
   * @param {NodeList} nodeList セレクタNodeList
   * @param {array} [params] ルールパラメータ
   * @param {BootstrapValidator} [v] validatorインスタンス
   * @returns {string|null} エラーメッセージ(正常時null)
   */
  static numeric (field, nodeList, params, v) {
    // type="text"の時
    const val = v._helpers.getValue(nodeList)
    if (!isFinite(val) || val.indexOf(' ') !== -1 || val.indexOf('0x') !== -1) {
      return v.settings.messages.NUMERICAL_VALUE
    }
    return null
  }

  /**
   * 最小文字数
   * @param {object} field フィールド
   * @param {NodeList} nodeList セレクタNodeList
   * @param {Array<string|number>} params ルールパラメータ
   * @param {string|number} params[0] 文字数
   * @param {BootstrapValidator} [v] validatorインスタンス
   * @returns {string|null} エラーメッセージ(正常時null)
   */
  static minlength (field, nodeList, params, v) {
    const min = Number(params[0])
    if (v._helpers.getValue(nodeList).length < min) { return v._helpers.format(v.settings.messages.MIN_LENGTH, min) }
    return null
  }

  /**
   * 最大文字数
   * @param {object} field フィールド
   * @param {NodeList} nodeList セレクタNodeList
   * @param {Array<string|number>} params ルールパラメータ
   * @param {string|number} params[0] 文字数
   * @param {BootstrapValidator} [v] validatorインスタンス
   * @returns {string|null} エラーメッセージ(正常時null)
   */
  static maxlength (field, nodeList, params, v) {
    const max = Number(params[0])
    if (max < v._helpers.getValue(nodeList).length) { return v._helpers.format(v.settings.messages.MAX_LENGTH, max) }
    return null
  }

  /**
   * 数値桁数チェック
   * @param {object} field フィールド
   * @param {NodeList} nodeList セレクタNodeList
   * @param {Array<string|number>} params ルールパラメータ
   * @param {string|number} params[0] 最小桁数
   * @param {string|number} params[1] 最大桁数
   * @param {BootstrapValidator} [v] validatorインスタンス
   * @returns {string|null} エラーメッセージ(正常時null)
   */
  static numlength (field, nodeList, params, v) {
    const val = v._helpers.getValue(nodeList)
    let tmpReg = params[0]
    let tmpErrorMessage = params[0]
    if (params[1]) {
      tmpReg += ',' + params[1]
      tmpErrorMessage += '～' + params[1]
    }
    const reg = new RegExp('^\\d{' + tmpReg + '}$')
    if (!reg.test(val)) {
      return v._helpers.format(v.settings.messages.NUM_LENGTH, tmpErrorMessage)
    }
    return null
  }

  /**
   * 最小値
   * @param {object} field フィールド
   * @param {NodeList} nodeList セレクタNodeList
   * @param {Array<string|number>} params ルールパラメータ
   * @param {string|number} params[0] 最小値
   * @param {BootstrapValidator} [v] validatorインスタンス
   * @returns {string|null} エラーメッセージ(正常時null)
   */
  static min (field, nodeList, params, v) {
    const val = v._helpers.getValue(nodeList)
    if (!v._helpers.isInteger(val)) {
      return v.settings.messages.INTEGER
    }
    const min = Number(params[0])
    if (val < min) { return v._helpers.format(v.settings.messages.MIN, min) }
    return null
  }

  /**
   * 最大値
   * @param {object} field フィールド
   * @param {NodeList} nodeList セレクタNodeList
   * @param {Array<string|number>} params ルールパラメータ
   * @param {string|number} params[0] 最大値
   * @param {BootstrapValidator} [v] validatorインスタンス
   * @returns {string|null} エラーメッセージ(正常時null)
   */
  static max (field, nodeList, params, v) {
    const val = v._helpers.getValue(nodeList)
    if (!v._helpers.isInteger(val)) {
      return v.settings.messages.INTEGER
    }
    const max = Number(params[0])
    if (max < val) { return v._helpers.format(v.settings.messages.MIN, max) }
    return null
  }

  /**
   * 数値範囲
   * @param {object} field フィールド
   * @param {NodeList} nodeList セレクタNodeList
   * @param {Array<string|number>} params ルールパラメータ
   * @param {string|number} params[0] 最小値
   * @param {string|number} params[1] 最大値
   * @param {BootstrapValidator} [v] validatorインスタンス
   * @returns {string|null} エラーメッセージ(正常時null)
   */
  static range (field, nodeList, params, v) {
    const val = v._helpers.getValue(nodeList)
    if (!v._helpers.isInteger(val)) {
      return v.settings.messages.INTEGER
    }
    const min = Number(params[0])
    const max = Number(params[1])
    if (val < min || max < val) { return v._helpers.format(v.settings.messages.RANGE, min, max) }
    return null
  }

  /**
   * 日付
   * @param {object} field フィールド
   * @param {NodeList} nodeList セレクタNodeList
   * @param {Array<string|number>} params ルールパラメータ
   * @param {BootstrapValidator} [v] validatorインスタンス
   * @returns {string|null} エラーメッセージ(正常時null)
   */
  static date (field, nodeList, params, v) {
    const val = v._helpers.getValue(nodeList)
    // 1980/1/2
    //      ↓
    // 1980/1/2,1980/1/2,1980,1,2
    if (!val.match(/^((\d{1,4})[/-](\d{1,2})[/-](\d{1,2}))$/g)) {
      return v.settings.messages.DATE
    }
    // 年月日チェック
    if (!v._helpers.isDate(RegExp.$2, RegExp.$3, RegExp.$4)) {
      return v.settings.messages.DATE_INVALID
    }
    return null
  }

  /**
   * 日時チェック
   * [YYYY-MM-DD hh:mm:ss]または[YYYY/MM/DD]の書式でチェックする
   * @param {object} field フィールド
   * @param {NodeList} nodeList セレクタNodeList
   * @param {Array<string|number>} params ルールパラメータ
   * @param {BootstrapValidator} [v] validatorインスタンス
   * @returns {string|null} エラーメッセージ(正常時null)
   */
  static datetime (field, nodeList, params, v) {
    const val = v._helpers.getValue(nodeList)
    // 1980/1/2 24:12:11
    //      ↓
    // 1980/1/2 23:12:11,1980/1/2,1980,1,2, 24:12:11,23:12:11,23,12,11
    if (!val.match(/^((\d{1,4})[/-](\d{1,2})[/-](\d{1,2}))( ((\d{1,2}):(\d{1,2})(:(\d{1,2}))?))?$/g)) {
      return v.settings.messages.DATETIME
    }
    // 年月日チェック
    if (!v._helpers.isDate(RegExp.$2, RegExp.$3, RegExp.$4)) {
      return v.settings.messages.DATE_INVALID
    }
    if (RegExp.$6 && !v._helpers.isTime(RegExp.$7, RegExp.$8, RegExp.$10)) {
      return v.settings.messages.TIME_INVALID
    }
    return null
  }

  /**
   * 日付チェック
   * [YYYY/MM/DD] or [YYYY/MM] or [YYYY]の書式でチェックする
   * @param {object} field フィールド
   * @param {NodeList} nodeList セレクタNodeList
   * @param {Array<string|number>} params ルールパラメータ
   * @param {BootstrapValidator} [v] validatorインスタンス
   * @returns {string|null} エラーメッセージ(正常時null)
   */
  // eslint-disable-next-line camelcase
  static date_ex (field, nodeList, params, v) {
    const val = v._helpers.getValue(nodeList)
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
    if (!v._helpers.isDate(y, m, d)) {
      return v.settings.messages.DATE_INVALID
    }
    return null
  }

  /**
   * 時間チェック
   * [hh:mm:ss]の書式でチェックする
   * @param {object} field フィールド
   * @param {NodeList} nodeList セレクタNodeList
   * @param {Array<string|number>} params ルールパラメータ
   * @param {BootstrapValidator} [v] validatorインスタンス
   * @returns {string|null} エラーメッセージ(正常時null)
   */
  static time (field, nodeList, params, v) {
    const val = v._helpers.getValue(nodeList)
    if (params[0] === 'hm') {
      if (!val.match(/^(\d{1,2}):(\d{1,2})$/g)) {
        return v.settings.messages.TIME_HM
      }
      if (!v._helpers.isTime(RegExp.$1, RegExp.$2, 0)) {
        return v.settings.messages.TIME_INVALID
      }
    } else {
      if (!val.match(/^(\d{1,2}):(\d{1,2}):(\d{1,2})$/g)) {
        return v.settings.messages.TIME
      }
      if (!v._helpers.isTime(RegExp.$1, RegExp.$2, RegExp.$3)) {
        return v.settings.messages.TIME_INVALID
      }
    }
    return null
  }

  /**
   * 郵便番号
   * @param {object} field フィールド
   * @param {NodeList} nodeList セレクタNodeList
   * @param {Array<string|number>} params ルールパラメータ
   * @param {BootstrapValidator} [v] validatorインスタンス
   * @returns {string|null} エラーメッセージ(正常時null)
   */
  static zip (field, nodeList, params, v) {
    const val = v._helpers.getValue(nodeList)
    if (!val.match(/^\d{1,3}-\d{1,4}$/g)) {
      return v.settings.messages.ZIP
    }
    return null
  }

  /**
   * チェックボックス
   * @param {object} field フィールド
   * @param {NodeList} nodeList セレクタNodeList
   * @param {Array<string|number>} params ルールパラメータ
   * @param {BootstrapValidator} [v] validatorインスタンス
   * @returns {string|null} エラーメッセージ(正常時null)
   */
  static checkbox (field, nodeList, params, v) {
    const check = v._helpers.getValue(nodeList).length
    const min = Number(params[0])
    if (params.length >= 2) {
      const max = Number(params[1])
      if (check < min || max < check) { return v._helpers.format(v.settings.messages.CHECKBOX_RANGE, min, max) }
    } else {
      if (check < min) { return v._helpers.format(v.settings.messages.CHECKBOX_MIN, min) }
    }
  }

  /**
   * 正規表現チェック
   * @param {object} field フィールド
   * @param {NodeList} nodeList セレクタNodeList
   * @param {Array<string|number>} params ルールパラメータ
   * @param {string|RegExp} params[0] 正規表現(文字列 or 正規表現クラス)
   * @param {string} params[1] 正規表現フラグ(オプション)
   * @param {string} params.{1|2} エラーメッセージ(オプション)
   * @param {BootstrapValidator} [v] validatorインスタンス
   * @returns {string|null} エラーメッセージ(正常時null)
   */
  static regexp (field, nodeList, params, v) {
    const val = v._helpers.getValue(nodeList)
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

export const MESSAGES = {
  VALIDATE_ERROR: '入力に誤りがあります.',
  // Required
  REQUIRED: '必須項目です.',
  REQUIRED_PART: '{0} は必須項目です.',
  INSUFFICIENT: '不足しています.',
  INSUFFICIENT_PART: '{0} が不足しています.',
  CONFIRM: '確認{0}と異なっています.',
  CONFIRM_FIELD: '項目',
  // input a numerical value
  NUMERICAL_VALUE: '数値を入力して下さい.',
  INTEGER: '整数値を入力して下さい.',
  INTEGER_PART: '{0} は整数値を入力して下さい.',
  MIN: '{0} ～ の数値を入力してください.',
  MAX: '～ {0} の数値を入力してください.',
  RANGE: '{0} ～ {1} の数値を入力してください.',
  MIN_LENGTH: '{0}文字以上で入力して下さい.',
  MAX_LENGTH: '{0}文字以下で入力して下さい.',
  NUM_LENGTH: '{0}桁の数値を入力してください.',
  CHECKBOX_MIN: '{0} 個チェックしてください.',
  CHECKBOX_RANGE: '{0}～{1} 個の間でチェックしてください.',
  ZENKAKU: '全角で入力してください.',
  HANKAKU: '半角で入力してください.',
  ZEN_KANA: '全角カタカナで入力してください.',
  HIRAGANA: 'ひらがなで入力してください.',
  TEL: '数値-()で入力してください.',
  ZIP: '[nnn-nnnn]書式で記述してください.',
  // 日付系
  DATE: '[YYYY/MM/DD]書式で記述してください.',
  DATE_EX: '[YYYY/MM/DD] or [YYYY/MM] or [YYYY]書式で記述してください.',
  DATETIME: '[YYYY/MM/DD hh:mm:ss]書式で記述してください.',
  TIME: '[hh:mm:ss]書式で記述してください.',
  TIME_HM: '[hh:mm:ss]書式で記述してください.',
  DATE_INVALID: '日付が間違っています.',
  TIME_INVALID: '時間が間違っています.',
  DATE_PART_Y: '(年)',
  DATE_PART_M: '(月)',
  DATE_PART_D: '(日)',
  // 正規表現系
  REGEXP_INVALID_PARAM: '正規表現が間違っています.',
  REGEXP_INVALID_VALUE: '書式が間違っています.',
  // メール系
  MAIL_NO_AT: '正しくありません(@).',
  MAIL_INVALID_IP: '正しくありません(IP).',
  MAIL_NO_DOMAIN: 'ドメイン名がありません(DOMAIN).',
  MAIL_INVALID_LOCALE: '正しくありません(LOCALE).',
  MAIL_INVALID_DOMAIN: 'ドメイン名の書式が誤っています.',
  // その他
  NOT_EXISTS_FIELD: 'フィールド名[{0}]が存在しません.'
}
