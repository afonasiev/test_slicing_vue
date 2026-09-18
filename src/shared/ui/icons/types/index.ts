export const ICON_NAMES = [
  'mobileCheck',
  'mobileUpload',
  'mobilePen',
  'mobileCopy',
  'mobileShield',
  'mobileChevron',
  'mobileSimulation',
  'mobileCheckSmall',
  'mobileApproved',
  'mobileAccount',
  'mobileUploadLarge',
  'mobileArrow',
  'mobilePenLarge',
  'mobileArrowMuted',
  'check',
  'upload',
  'pen',
  'home',
  'documents',
  'profile',
  'chat',
  'copy',
  'shield',
  'chevron',
  'simulation',
  'checkSmall',
  'approved',
  'account',
  'uploadLarge',
  'arrow',
  'penLarge',
  'arrowMuted',
  'logoFull',
  'mobileLogoFull',
] as const;
export type IconName = (typeof ICON_NAMES)[number];
export interface IconProps {
  name: IconName;
  decorative?: boolean;
  ariaLabel?: string;
  title?: string;
}
