/******/ var __webpack_modules__ = ({

/***/ "./src/bootstrap-validator.js":
/*!************************************!*\
  !*** ./src/bootstrap-validator.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "BootstrapValidator": () => (/* binding */ BootstrapValidator)
/* harmony export */ });
/* harmony import */ var _messages_ja_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./messages/ja.js */ "./src/messages/ja.js");


/**
 * Bootstrapレイアウトバリデーション
 */
class BootstrapValidator {
  /**
   * コンストラクタ
   * @constructor
   * @param {HTMLElement} form フォームNode
   * @param {Object} [options] 設定オプション
   */
  constructor (form, options) {
    /** フォームElement */
    this.form = form

    /** 初期設定情報 */
    this._settings = {
      submit: 'validate',
      result: null,
      confirm_suffix: '_confirm',
      zip_suffix: '_after',
      ymd_suffix_y: '_y',
      ymd_suffix_m: '_m',
      ymd_suffix_d: '_d',
      setError: null,
      clearError: null,
      /** メッセージ */
      messages: _messages_ja_js__WEBPACK_IMPORTED_MODULE_0__.MESSAGES
    }

    /** option */
    if (options) {
      /** フィールド情報 */
      if (options.fields) {
        this.fields = options.fields
      }
      /** 設定マージ */
      for (const paramName in this._settings) {
        if (options[paramName]) {
          if (typeof options[paramName] === 'object') {
            this._settings[paramName] = Object.assign(this._settings[paramName], options[paramName])
          } else {
            this._settings[paramName] = options[paramName]
          }
        }
      }
    }

    this.helpers = BootstrapValidatorHelpers
    this._validFunc = BootstrapValidatorValidFunc
    this._validExistsFunc = BootstrapValidatorValidExistsFunc

    // submitイベント登録
    this.listenerSubmit = event => this.onSubmit(event)
    this.form.addEventListener('submit', this.listenerSubmit)
  }

  /**
   * 破棄処理
   * submitイベントを削除する
   */
  destroy () {
    console.log('destroy')
    // submitイベント削除
    this.form.removeEventListener('submit', this.listenerSubmit)
    this.settings.submit = null
  }

  /**
   * submit時の処理
   * @param {Event} event
   */
  onSubmit (event) {
    let ret = false
    if (this.settings.submit) {
      this.clearError()
      if (typeof this.settings.submit === 'string') {
        if (['validate', 'validateAlert'].indexOf(this.settings.submit) !== -1) {
          ret = this[this.settings.submit]()
        } else {
          console.error('Not exists method [' + this.settings.submit + ']')
        }
      } else if (typeof this.settings.submit === 'function') {
        ret = this.settings.submit()
      }
      if (!ret) {
        // event.stopPropagation()
        event.preventDefault()
      }
    }
  }

  /**
   * form取得
   * @return {HTMLFormElement} 設定データ
   */
  get form () {
    return this._form
  }

  /**
   * form設定
   * @param {string|HTMLFormElement} selectors 設定データ
   */
  set form (selectors) {
    if (typeof selectors === 'string') {
      this._form = document.querySelector(selectors)
    } else {
      this._form = selectors
    }
  }

  /**
   * 設定データ取得
   * @return {_settings} 設定データ
   */
  get settings () {
    return this._settings
  }

  /**
   * 設定データ更新
   * 既存の設定とマージする
   * @param {_settings} settings 設定データ
   */
  set settings (settings) {
    this._settings = Object.assign(this._settings, settings)
  }

  /**
   * selector名からNodeListを取得
   * @param {string} name selector名
   * @return {NodeList}
   */
  querySelectorByName (name) {
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
      this.setError(error.name, error.message)
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
    const fields = this.querySelectorByName(name)
    if (fields && fields.length > 0) {
      fields[0].focus()
    } else {
      console.warn(this.helpers.format(this.settings.messages.NOT_EXISTS_FIELD, name))
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
    } else {
      this.clearErrorBootstrap(name)
    }
  }

  /**
   * 指定箇所エラー表示処理
   * @param {string} name 項目名
   * @param {string} message エラー文言
   */
  setError (name, message) {
    if (typeof this.settings.setError === 'function') {
      this.settings.setError.apply(this, [name, message])
    } else {
      this.setErrorBootstrap(name, message)
    }
  }

  /**
   * エラークリア処理
   * (Bootstrap5/4レイアウト)
   * @param {string} [name] 項目名
   */
  clearErrorBootstrap (name) {
    if (name) {
      const ndValues = this.querySelectorByName(name)
      const inputField = ndValues[0]
      const type = inputField.attributes.type ? inputField.attributes.type.value : null
      if (['radio', 'checkbox'].indexOf(type) !== -1) {
        const nodeBlock = inputField.parentNode.parentNode
        nodeBlock.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'))
        nodeBlock.querySelectorAll('.invalid-feedback').forEach(el => el.remove())
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
   * 指定箇所エラー表示処理
   * (Bootstrap5/4レイアウト)
   * @param {string} name 項目名
   * @param {string} message エラー文言
   */
  setErrorBootstrap (name, message) {
    const errDiv = document.createElement('div')
    errDiv.innerHTML = '<div class="invalid-feedback">' + message + '</div>'
    const ndValues = this.querySelectorByName(name)
    const field = ndValues[0]
    const type = field.attributes.type ? field.attributes.type.value : null
    if (['radio', 'checkbox'].indexOf(type) !== -1) {
      ndValues.forEach(ndValue => ndValue.classList.add('is-invalid'))
      // field.parentNode.parentNode.insertBefore(errDiv.firstElementChild, field.nextElementSibling);
      const nodeBlock = field.parentNode
      nodeBlock.classList.add('is-invalid')
      nodeBlock.parentNode.insertBefore(errDiv.firstElementChild, null)
    } else {
      field.classList.add('is-invalid')
      // field.parentNode.insertBefore(errDiv.firstElementChild, field.nextElementSibling);
      field.parentNode.insertBefore(errDiv.firstElementChild, null)
    }
  }

  /**
   * バリデーション処理
   * @param {Object} [options] オプションフィールド情報
   * @return {boolean} true:正常
   */
  validate (options) {
    let result = true
    const errors = this.getValidateResult(options)
    if (errors.length > 0) {
      this.displayError(errors)
      result = false
    }
    if (typeof this.settings.result === 'function') {
      result = this.settings.result(result, errors)
    }
    return result
  }

  /**
   * パラメータチェック
   * (エラー時アラート)
   * @param {Object} options オプション
   * @returns {boolean|string[]} エラー値
   */
  validateAlert (options) {
    let result = true
    const errors = this.getValidateResult(options)
    if (errors.length > 0) {
      window.alert(this.settings.messages.VALIDATE_ERROR + '\n' + this.helpers.join(errors))
      if (this.settings.focusError) {
        // 最初のエラーにフォーカス
        this.settings.focusError.apply(errors[0].name)
      } else {
        this.focusError(errors[0].name)
      }
      result = false
    }
    if (typeof this.settings.result === 'function') {
      result = this.settings.result(result, errors)
    }
    return result
  }

  /**
   * フィールド/ルール情報取得
   * @returns {Array<Object>}
   */
  getFieldsRules () {
    const fields = []
    Array.from(this.form).forEach((element) => {
      const name = element.name
      if (!name) {
        return
      }
      const type = element.getAttribute('type')
      if (type === 'radio' || type === 'checkbox') {
        if (fields.find(item => item.name === element.name)) {
          return
        }
      }
      const rules = []
      if (element.required) {
        rules.push('required')
      }
      // 属性によるパターン
      [['minLength', 'minlength'], ['maxLength', 'maxlength'], 'min', 'max', ['pattern', 'regexp']].forEach(function (attr) {
        let rule
        if (Array.isArray(attr)) {
          rule = attr[1]
          attr = attr[0]
        } else {
          rule = attr
        }
        const value = element.getAttribute(attr)
        if (value !== null) {
          rules.push([rule, value])
        }
      })
      // type="xxx"によるバリデート判別
      let rule
      switch (type) {
        case 'date':
        case 'email':
        case 'tel':
          rule = type
          break
        case 'number':
          rule = 'numeric'
          break
        case 'time':
          rule = ['time', 'hm']
          break
      }
      if (rule) {
        rules.push(rule)
      }
      fields.push({ name: name, rules: rules })
    })
    return fields
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
   * @param {Object} [options] オプションフィールド情報
   * @returns {boolean|string[]} エラー値
   */
  getValidateResult (options) {
    const fields = (options && options.fields) ? options.fields : (this.fields || this.getFieldsRules())
    const arrRuleErrors = []
    fields.forEach(field => {
      const ndValues = this.querySelectorByName(field.name)
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

        if (!this.helpers.existsValue(ndValues)) {
          if (rule === 'required') {
            if (!this.helpers.existsValue(ndValues)) {
              this.helpers.pushErrors(arrRuleErrors, field, this.settings.messages.REQUIRED)
            }
          } else if (typeof this._validFunc[rule] === 'function') {
            const errors = this._validFunc[rule].apply(this, [field, ndValues, params, this])
            this.helpers.pushErrors(arrRuleErrors, field, errors)
          }
        } else if (typeof this._validExistsFunc[rule] === 'function') {
          const errors = this._validExistsFunc[rule].apply(this, [field, ndValues, params, this])
          this.helpers.pushErrors(arrRuleErrors, field, errors)
        } else if (rule === 'checkbox') {
          const errors = this._validFunc[rule].apply(this, [field, ndValues, params, this])
          this.helpers.pushErrors(arrRuleErrors, field, errors)
        }
        if (typeof rule === 'function') {
          // 独自チェック関数
          const errors = rule.apply(this, [field, ndValues, params, this])
          this.helpers.pushErrors(arrRuleErrors, field, errors)
        }
      })
    })
    return arrRuleErrors
  }
}

/**
 * 補助処理群
 */
class BootstrapValidatorHelpers {
  /**
   * フィールドから値を取得
   * @param {NodeList} ndValues NodeList
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
   * @param {NodeList} ndValues NodeList
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
   * @param {string[]|Object[]} arrErrors エラー情報配列
   * @param {Object} field    フィールド情報
   * @param {string|string[]} errors 追加エラー情報
   * @return {string[]|Object[]} array arrErrors
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
   * @param {string[]|Object[]} arrErrors エラー情報配列
   * @param {?string} delimiter デリミタ
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

/**
 * バリデーション関数群(値なし)
 */
class BootstrapValidatorValidFunc {
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

/**
 * バリデーション関数群(値あり)
 */
class BootstrapValidatorValidExistsFunc {
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
    const val = v.helpers.getValue(ndValues)
    if (!v.helpers.isInteger(val)) {
      return v.settings.messages.INTEGER
    }
    const min = Number(params[0])
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
    const val = v.helpers.getValue(ndValues)
    if (!v.helpers.isInteger(val)) {
      return v.settings.messages.INTEGER
    }
    const min = Number(params[0])
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


/***/ }),

/***/ "./src/messages/ja.js":
/*!****************************!*\
  !*** ./src/messages/ja.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "MESSAGES": () => (/* binding */ MESSAGES)
/* harmony export */ });
/**
 * メッセージ定義
 * @type {{ZIP: string, MAIL_INVALID_DOMAIN: string, REGEXP_INVALID_PARAM: string, INTEGER_PART: string, MAX: string, DATE_PART_Y: string, INSUFFICIENT: string, DATE_PART_M: string, NUMERICAL_VALUE: string, CHECKBOX_RANGE: string, TIME_HM: string, NOT_EXISTS_FIELD: string, TIME_INVALID: string, DATE_PART_D: string, REGEXP_INVALID_VALUE: string, MIN_LENGTH: string, MAIL_INVALID_IP: string, CONFIRM: string, CHECKBOX_MIN: string, MAIL_INVALID_LOCALE: string, ZENKAKU: string, INTEGER: string, VALIDATE_ERROR: string, HIRAGANA: string, CONFIRM_FIELD: string, REQUIRED_PART: string, REQUIRED: string, ZEN_KANA: string, TIME: string, HANKAKU: string, MAX_LENGTH: string, MAIL_NO_DOMAIN: string, DATE: string, DATE_INVALID: string, MIN: string, DATETIME: string, DATE_EX: string, TEL: string, MAIL_NO_AT: string, NUM_LENGTH: string, INSUFFICIENT_PART: string, RANGE: string}}
 */
const MESSAGES = {
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


/***/ })

/******/ });
/************************************************************************/
/******/ // The module cache
/******/ var __webpack_module_cache__ = {};
/******/ 
/******/ // The require function
/******/ function __webpack_require__(moduleId) {
/******/ 	// Check if module is in cache
/******/ 	var cachedModule = __webpack_module_cache__[moduleId];
/******/ 	if (cachedModule !== undefined) {
/******/ 		return cachedModule.exports;
/******/ 	}
/******/ 	// Create a new module (and put it into the cache)
/******/ 	var module = __webpack_module_cache__[moduleId] = {
/******/ 		// no module.id needed
/******/ 		// no module.loaded needed
/******/ 		exports: {}
/******/ 	};
/******/ 
/******/ 	// Execute the module function
/******/ 	__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 
/******/ 	// Return the exports of the module
/******/ 	return module.exports;
/******/ }
/******/ 
/************************************************************************/
/******/ /* webpack/runtime/define property getters */
/******/ (() => {
/******/ 	// define getter functions for harmony exports
/******/ 	__webpack_require__.d = (exports, definition) => {
/******/ 		for(var key in definition) {
/******/ 			if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 				Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 			}
/******/ 		}
/******/ 	};
/******/ })();
/******/ 
/******/ /* webpack/runtime/hasOwnProperty shorthand */
/******/ (() => {
/******/ 	__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ })();
/******/ 
/******/ /* webpack/runtime/make namespace object */
/******/ (() => {
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = (exports) => {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/ })();
/******/ 
/************************************************************************/
/******/ 
/******/ // startup
/******/ // Load entry module and return exports
/******/ // This entry module is referenced by other modules so it can't be inlined
/******/ __webpack_require__("./src/messages/ja.js");
/******/ var __webpack_exports__ = __webpack_require__("./src/bootstrap-validator.js");
/******/ var __webpack_exports__BootstrapValidator = __webpack_exports__.BootstrapValidator;
/******/ export { __webpack_exports__BootstrapValidator as BootstrapValidator };
/******/ 
