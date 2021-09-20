/**
 * メッセージ定義
 * @type {{ZIP: string, MAIL_INVALID_DOMAIN: string, REGEXP_INVALID_PARAM: string, INTEGER_PART: string, MAX: string, DATE_PART_Y: string, INSUFFICIENT: string, DATE_PART_M: string, NUMERICAL_VALUE: string, CHECKBOX_RANGE: string, TIME_HM: string, NOT_EXISTS_FIELD: string, TIME_INVALID: string, DATE_PART_D: string, REGEXP_INVALID_VALUE: string, MIN_LENGTH: string, MAIL_INVALID_IP: string, CONFIRM: string, CHECKBOX_MIN: string, MAIL_INVALID_LOCALE: string, ZENKAKU: string, INTEGER: string, VALIDATE_ERROR: string, HIRAGANA: string, CONFIRM_FIELD: string, REQUIRED_PART: string, REQUIRED: string, ZEN_KANA: string, TIME: string, HANKAKU: string, MAX_LENGTH: string, MAIL_NO_DOMAIN: string, DATE: string, DATE_INVALID: string, MIN: string, DATETIME: string, DATE_EX: string, TEL: string, MAIL_NO_AT: string, NUM_LENGTH: string, INSUFFICIENT_PART: string, RANGE: string}}
 */
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
