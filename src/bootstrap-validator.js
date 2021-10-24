import { MESSAGES } from './messages/ja.js'
import { BootstrapValidatorValidExistsFunc } from './bootstrap-validator-valid-exists-func.js'
import { BootstrapValidatorValidFunc } from './bootstrap-validator-valid-func.js'

/**
 * Bootstrapレイアウトバリデーション
 */
export class BootstrapValidator {
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
      confirm_suffix: '_confirm',
      zip_suffix: '_after',
      ymd_suffix_y: '_y',
      ymd_suffix_m: '_m',
      ymd_suffix_d: '_d',
      setError: null,
      clearError: null,
      /** メッセージ */
      messages: MESSAGES
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
    this.clearError()
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
