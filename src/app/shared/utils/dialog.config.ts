import { DynamicDialogConfig } from 'primeng/dynamicdialog';

export const defaultDialogConfig = (
  header: string,
  data?: Record<string, unknown>,
): DynamicDialogConfig => ({
  header,
  width: '45vw',
  breakpoints: {
    '960px': '75vw',
    '640px': '95vw',
  },
  contentStyle: { 'max-height': '90vh', overflow: 'auto' },
  baseZIndex: 10000,
  ...(data && { data }),
});
