import { environment } from '../../../environments/environment';

export const API_URL = environment.apiUrl;

export const API_ENDPOINTS = {
  auth: {
    register: `${API_URL}/auth/register`,
    login: `${API_URL}/auth/login`,
  },
  users: {
    me: `${API_URL}/users/me`,
  },
  associates: {
    base: `${API_URL}/associates`,
    byId: (id: number) => `${API_URL}/associates/${id}`,
  },
  items: {
    base: `${API_URL}/items`,
    byId: (id: number) => `${API_URL}/items/${id}`,
    properties: (itemId: number) => `${API_URL}/items/${itemId}/properties`,
    propertyById: (itemId: number, propId: number) =>
      `${API_URL}/items/${itemId}/properties/${propId}`,
  },
  invoices: {
    base: `${API_URL}/invoices`,
    byId: (id: number) => `${API_URL}/invoices/${id}`,
    pdf: (id: number) => `${API_URL}/invoices/${id}/pdf`,
    send: (id: number) => `${API_URL}/invoices/${id}/send`,
  },
  remissions: {
    base: `${API_URL}/remissions`,
    byId: (id: number) => `${API_URL}/remissions/${id}`,
    pdf: (id: number) => `${API_URL}/remissions/${id}/pdf`,
    send: (id: number) => `${API_URL}/remissions/${id}/send`,
  },
} as const;
