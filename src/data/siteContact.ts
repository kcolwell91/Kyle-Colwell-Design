export const SITE_CONTACT = {
  email: 'kyle@elevatedglobe.com',
  phone: '+18082929604',
  phoneDisplay: '(808) 292-9604',
  location: 'Austin, Texas',
} as const;

export const SITE_CONTACT_MAILTO = `mailto:${SITE_CONTACT.email}` as const;

export const SITE_CONTACT_TEL = `tel:${SITE_CONTACT.phone}` as const;
