import { MESSAGES } from './messages/ja.js'
import { BootstrapValidatorHelpers } from './bootstrap-validator-helpers.js'
import { BootstrapValidatorValidExistsFunc } from './bootstrap-validator-valid-exists-func.js'
import { BootstrapValidatorValidFunc } from './bootstrap-validator-valid-func.js'

/**
 * 設定パラメータ
 * @typedef {Object} BootstrapValidator_Settings
 * @property {null|string|function} submit Submit時に行う処理
 * @property {null|function} result バリデーション後に行う処理
 * @property {string} confirm_suffix confirmルールの確認フィールドの接尾語
 * @property {string} zip_suffix zip_exルールの4桁フィールドの接尾語
 * @property {string} ymd_suffix_y ymdルールの年フィールドの接尾語
 * @property {string} ymd_suffix_m ymdルールの月フィールドの接尾語
 * @property {string} ymd_suffix_d ymdルールの日フィールドの接尾語
 * @property {null|function} setError エラー設定関数を指定
 * @property {null|function} setError エラークリア関数を指定
 * @property {boolean} focusError true=エラー時に最初のエラーにフォーカスする
 * @property {MESSAGES} messages メッセージ情報配列
 */

/**
 * errorパラメータ
 * @typedef {Object} BootstrapValidator_Error
 * @property {string} name 項目名
 * @property {string} label 項目ラベル名
 * @property {string|string[]} message エラーメッセージ
 */

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

    /**
     * 初期設定情報
     * @var {BootstrapValidator_Settings}
     */
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
      focusError: false,
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
        if (['validate', 'validateAlert', 'asyncValidate', 'asyncValidateAlert'].indexOf(this.settings.submit) !== -1) {
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
   * @return {BootstrapValidator_Settings} 設定データ
   */
  get settings () {
    return this._settings
  }

  /**
   * 設定データ更新
   * 既存の設定とマージする
   * @param {BootstrapValidator_Settings} settings 設定データ
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
   * バリデーション共通処理
   * @param {Array<string|Object>} errors エラー情報配列
   * @return {boolean} true:エラー
   * @private
   */
  _validateCommon (errors) {
    let result = true
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
   * バリデーション処理
   * @param {Object} [options] オプションフィールド情報
   * @return {boolean} true:正常
   */
  validate (options) {
    this.clearError()
    return this._validateCommon(this.getValidateResult(options))
  }

  /**
   * バリデーション処理(async版)
   * @param {Object} [options] オプションフィールド情報
   * @returns {Promise<boolean>} true:正常
   */
  async asyncValidate (options) {
    this.clearError()
    return this.asyncGetValidateResult(options).then(errors =>
      this._validateCommon(errors)
    )
  }

  /**
   * バリデーション共通処理(エラー時アラート)
   * @param {Array<string|Object>} errors エラー情報配列
   * @return {boolean} true:エラー
   * @private
   */
  _validateAlertCommon (errors) {
    let result = true
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
   * パラメータチェック
   * (エラー時アラート)
   * @param {Object} [options] オプション
   * @returns {boolean} true:正常
   */
  validateAlert (options) {
    return this._validateAlertCommon(this.getValidateResult(options))
  }

  /**
   * パラメータチェック(async版)
   * (エラー時アラート)
   * @param {Object} [options] オプション
   * @returns {Promise<boolean>} true:正常
   */
  async asyncValidateAlert (options) {
    return await this.asyncGetValidateResult(options).then(errors => {
      return this._validateAlertCommon(errors)
    })
  }

  /**
   * フィールド/ルール情報取得
   * @returns {Object[]}
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

  /**
   * ルールをルールとパラメータに分解
   * @param {Object|Array|string} rule ルール
   * @return {Array<string, Array<string|number|*>>|null} ルール,パラメータ
   * @private
   */
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
        return null
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
        return null
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
   * 指定ルールでバリデート
   * @param {function|string} rule バリデーションルール
   * @param {object} field フィールド
   * @param {NodeList<HTMLInputElement>} ndValues 値NodeList
   * @param {Array<string|number>} [params] ルールパラメータ
   * @return {null|string|string[]|Promise<null|string|string[]>} エラー情報
   * @private
   */
  _validateRule (rule, field, ndValues, params) {
    let errors
    if (typeof rule === 'function') {
      // 独自チェック関数
      errors = rule.apply(this, [field, ndValues, params, this])
    } else if (!this.helpers.existsValue(ndValues)) {
      if (rule === 'required') {
        if (!this.helpers.existsValue(ndValues)) {
          errors = this.settings.messages.REQUIRED
        }
      } else if (typeof this._validFunc[rule] === 'function') {
        errors = this._validFunc[rule].apply(this, [field, ndValues, params, this])
      }
    } else if (typeof this._validExistsFunc[rule] === 'function') {
      errors = this._validExistsFunc[rule].apply(this, [field, ndValues, params, this])
    } else if (rule === 'checkbox') {
      errors = this._validFunc[rule].apply(this, [field, ndValues, params, this])
    }
    return errors
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
      /* jscpd:ignore-start */
      const ndValues = this.querySelectorByName(field.name)
      if (!field.rules) {
        return
      }
      let rules = field.rules
      if (!Array.isArray(rules)) {
        rules = [rules]
      }
      rules.forEach(rule => {
        let params
        [rule, params] = this._parseRule(rule)

        const errors = this._validateRule(rule, field, ndValues, params)
        this.helpers.pushErrors(arrRuleErrors, field, errors)
      })
      /* jscpd:ignore-end */
    })
    return arrRuleErrors
  }

  /**
   * バリデーション結果取得(async版)
   * @param {Object} [options] オプションフィールド情報
   * @returns {Promise<boolean>|Promise<string[]>} エラー値
   */
  async asyncGetValidateResult (options) {
    const fields = (options && options.fields) ? options.fields : (this.fields || this.getFieldsRules())
    const promises = []
    const errorFields = []
    for (const field of fields) {
      const ndValues = this.querySelectorByName(field.name)
      if (!field.rules) {
        break
      }
      let rules = field.rules
      if (!Array.isArray(rules)) {
        rules = [rules]
      }

      rules.forEach(rule => {
        let params
        [rule, params] = this._parseRule(rule)

        const errors = this._validateRule(rule, field, ndValues, params)
        if (errors !== undefined && errors !== null) {
          promises.push(typeof errors.then === 'function'
            ? errors
            : Promise.resolve(errors)
          )
          errorFields.push(field)
        }
      })
    }

    return await Promise.all(promises).then(errorsList => {
      const arrRuleErrors = []
      for (const i in errorsList) {
        this.helpers.pushErrors(arrRuleErrors, errorFields[i], errorsList[i])
      }
      return arrRuleErrors
    })
  }
}
