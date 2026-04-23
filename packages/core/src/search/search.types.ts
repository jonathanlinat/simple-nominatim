// SPDX-License-Identifier: MIT

export interface FreeFormSearchParams {
  query: string;
}

export interface StructuredSearchParams {
  amenity?: string;
  city?: string;
  country?: string;
  county?: string;
  postalcode?: string;
  state?: string;
  street?: string;
}
