export const ABILITIES = {
  ORDERS_MANAGE: "orders_manage",
  CUSTOMERS_MANAGE: "customers_manage",
  CUSTOMERS_MERGE: "customers_merge",
  USERS_MANAGE: "users_manage",
  USERS_ROLES_PERMISSIONS_MANAGE: "users_roles_permissions_manage",
  BILLING_VIEW: "billing_view",
  BILLING_BALANCE_ADJUST: "billing_balance_adjust",
  QUICK_ORDERS_MANAGE: "quick_orders_manage",
  DICTIONARIES_MANAGE: "dictionaries_manage",
  DICTIONARIES_LOCATIONS_MANAGE: "dictionaries_locations_manage",
  DICTIONARIES_BANK_CARDS_MANAGE: "dictionaries_bank_cards_manage",
  DICTIONARIES_PRICE_LIST_MANAGE: "dictionaries_price_list_manage",
  LANDING_WORKS_MANAGE: "landing_works_manage",
  INTEGRATIONS_SMS_VIEW: "integrations_sms_view",
  REFERRALS_MANAGE: "referrals_manage",
  STATISTICS_VIEW: "statistics_view",
} as const;

export type Ability = (typeof ABILITIES)[keyof typeof ABILITIES];
