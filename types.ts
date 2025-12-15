export interface TrackingFormData {
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  trackingCode: string;
  carrier: string;
  productName: string;
  trackingLink?: string;
  invoiceNumber?: string;
}

export interface GeneratedContent {
  subject: string;
  whatsappMessage: string;
  emailBody: string;
}

export enum CarrierType {
  CORREIOS = 'Correios',
  JADLOG = 'Jadlog',
  FEDEX = 'FedEx',
  DHL = 'DHL',
  OTHER = 'Outra'
}