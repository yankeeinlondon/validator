import type { JSONSchemaType } from "ajv";
import type { Result, Valid, Invalid } from "~/types";
import { FailedValidation, InvalidSchema } from "~/errors";

// =============================================================================
// SCHEMA.ORG INPUT TYPES
// =============================================================================

/**
 * Base Schema.org Thing interface - all Schema.org entities extend from Thing
 */
export interface SchemaOrgThing {
  "@context"?: string | string[] | Record<string, unknown>;
  "@type": string | string[];
  "@id"?: string;
  [key: string]: unknown;
}

/**
 * Schema.org Person interface
 */
export interface SchemaOrgPerson extends SchemaOrgThing {
  "@type": "Person";
  name?: string;
  givenName?: string;
  familyName?: string;
  email?: string;
  telephone?: string;
  url?: string;
  image?: string | SchemaOrgImageObject;
  address?: string | SchemaOrgPostalAddress;
  jobTitle?: string;
  worksFor?: string | SchemaOrgOrganization;
  birthDate?: string;
  gender?: string;
}

/**
 * Schema.org Organization interface
 */
export interface SchemaOrgOrganization extends SchemaOrgThing {
  "@type": "Organization";
  name?: string;
  legalName?: string;
  url?: string;
  logo?: string | SchemaOrgImageObject;
  address?: string | SchemaOrgPostalAddress;
  telephone?: string;
  email?: string;
  foundingDate?: string;
  description?: string;
  industry?: string;
  numberOfEmployees?: number | string;
}

/**
 * Schema.org Product interface
 */
export interface SchemaOrgProduct extends SchemaOrgThing {
  "@type": "Product";
  name?: string;
  description?: string;
  image?: string | SchemaOrgImageObject | Array<string | SchemaOrgImageObject>;
  brand?: string | SchemaOrgBrand;
  manufacturer?: string | SchemaOrgOrganization;
  model?: string;
  sku?: string;
  gtin?: string;
  price?: string | number;
  priceCurrency?: string;
  availability?: string;
  category?: string;
  weight?: string | SchemaOrgQuantitativeValue;
  color?: string;
}

/**
 * Schema.org Event interface
 */
export interface SchemaOrgEvent extends SchemaOrgThing {
  "@type": "Event";
  name?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  location?: string | SchemaOrgPlace;
  organizer?: string | SchemaOrgPerson | SchemaOrgOrganization;
  performer?: string | SchemaOrgPerson | SchemaOrgOrganization;
  url?: string;
  image?: string | SchemaOrgImageObject;
  offers?: SchemaOrgOffer | SchemaOrgOffer[];
  eventStatus?: string;
  eventAttendanceMode?: string;
}

/**
 * Supporting Schema.org interfaces
 */
export interface SchemaOrgImageObject extends SchemaOrgThing {
  "@type": "ImageObject";
  url?: string;
  contentUrl?: string;
  width?: number | string;
  height?: number | string;
  caption?: string;
}

export interface SchemaOrgPostalAddress extends SchemaOrgThing {
  "@type": "PostalAddress";
  streetAddress?: string;
  addressLocality?: string;
  addressRegion?: string;
  postalCode?: string;
  addressCountry?: string;
}

export interface SchemaOrgPlace extends SchemaOrgThing {
  "@type": "Place";
  name?: string;
  address?: string | SchemaOrgPostalAddress;
  geo?: SchemaOrgGeoCoordinates;
  url?: string;
}

export interface SchemaOrgGeoCoordinates extends SchemaOrgThing {
  "@type": "GeoCoordinates";
  latitude?: number | string;
  longitude?: number | string;
}

export interface SchemaOrgBrand extends SchemaOrgThing {
  "@type": "Brand";
  name?: string;
  logo?: string | SchemaOrgImageObject;
}

export interface SchemaOrgOffer extends SchemaOrgThing {
  "@type": "Offer";
  price?: string | number;
  priceCurrency?: string;
  availability?: string;
  url?: string;
  validFrom?: string;
  validThrough?: string;
}

export interface SchemaOrgQuantitativeValue extends SchemaOrgThing {
  "@type": "QuantitativeValue";
  value?: number | string;
  unitCode?: string;
  unitText?: string;
}

/**
 * Union type for all supported Schema.org entities
 */
export type SchemaOrgEntity = 
  | SchemaOrgPerson
  | SchemaOrgOrganization
  | SchemaOrgProduct
  | SchemaOrgEvent
  | SchemaOrgImageObject
  | SchemaOrgPostalAddress
  | SchemaOrgPlace
  | SchemaOrgGeoCoordinates
  | SchemaOrgBrand
  | SchemaOrgOffer
  | SchemaOrgQuantitativeValue;

// =============================================================================
// NORMALIZED OUTPUT TYPES
// =============================================================================

/**
 * Base normalized entity interface
 */
export interface NormalizedEntity {
  id?: string;
  type: string;
  source: "schema.org";
  context?: string;
  [key: string]: unknown;
}

/**
 * Normalized Person entity
 */
export interface NormalizedPerson extends NormalizedEntity {
  type: "Person";
  name?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  website?: string;
  image?: NormalizedImage;
  address?: NormalizedAddress;
  jobTitle?: string;
  employer?: NormalizedOrganization;
  birthDate?: string;
  gender?: string;
}

/**
 * Normalized Organization entity
 */
export interface NormalizedOrganization extends NormalizedEntity {
  type: "Organization";
  name?: string;
  legalName?: string;
  website?: string;
  logo?: NormalizedImage;
  address?: NormalizedAddress;
  phone?: string;
  email?: string;
  foundingDate?: string;
  description?: string;
  industry?: string;
  employeeCount?: number;
}

/**
 * Normalized Product entity
 */
export interface NormalizedProduct extends NormalizedEntity {
  type: "Product";
  name?: string;
  description?: string;
  images?: NormalizedImage[];
  brand?: string;
  manufacturer?: string;
  model?: string;
  sku?: string;
  gtin?: string;
  price?: {
    amount?: number;
    currency?: string;
  };
  availability?: string;
  category?: string;
  weight?: {
    value?: number;
    unit?: string;
  };
  color?: string;
}

/**
 * Normalized Event entity
 */
export interface NormalizedEvent extends NormalizedEntity {
  type: "Event";
  name?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  location?: NormalizedPlace;
  organizer?: NormalizedPerson | NormalizedOrganization;
  performers?: Array<NormalizedPerson | NormalizedOrganization>;
  website?: string;
  image?: NormalizedImage;
  offers?: NormalizedOffer[];
  status?: string;
  attendanceMode?: string;
}

/**
 * Supporting normalized interfaces
 */
export interface NormalizedImage {
  url?: string;
  width?: number;
  height?: number;
  caption?: string;
}

export interface NormalizedAddress {
  street?: string;
  city?: string;
  region?: string;
  postalCode?: string;
  country?: string;
}

export interface NormalizedPlace {
  name?: string;
  address?: NormalizedAddress;
  coordinates?: {
    latitude?: number;
    longitude?: number;
  };
  website?: string;
}

export interface NormalizedOffer {
  price?: {
    amount?: number;
    currency?: string;
  };
  availability?: string;
  website?: string;
  validFrom?: string;
  validThrough?: string;
}

/**
 * Union type for all normalized entities
 */
export type NormalizedEntityUnion = 
  | NormalizedPerson
  | NormalizedOrganization
  | NormalizedProduct
  | NormalizedEvent;

// =============================================================================
// CONVERSION OPTIONS
// =============================================================================

/**
 * Options for controlling the conversion process
 */
export interface ConversionOptions {
  /** Whether to validate required fields for each entity type */
  validateRequired?: boolean;
  /** Whether to include fallback values for missing properties */
  includeFallbacks?: boolean;
  /** Whether to preserve unknown properties in the output */
  preserveUnknown?: boolean;
  /** Custom property mappings for specific types */
  propertyMappings?: Record<string, Record<string, string>>;
  /** Whether to normalize URLs to absolute URLs */
  normalizeUrls?: boolean;
  /** Base URL for relative URL normalization */
  baseUrl?: string;
}

// =============================================================================
// ERROR TYPES
// =============================================================================

export interface SchemaOrgValidationError {
  field: string;
  value: unknown;
  reason: string;
  path?: string[];
}

export interface ConversionResult<T = NormalizedEntityUnion> {
  entity: T;
  warnings: SchemaOrgValidationError[];
}

// =============================================================================
// VALIDATION HELPERS
// =============================================================================

/**
 * Validates if input is a valid Schema.org entity
 */
function isValidSchemaOrgEntity(input: unknown): input is SchemaOrgEntity {
  if (!input || typeof input !== "object") {
    return false;
  }
  
  const obj = input as Record<string, unknown>;
  return typeof obj["@type"] === "string" || Array.isArray(obj["@type"]);
}

/**
 * Extracts the primary type from @type field
 */
function extractPrimaryType(typeField: string | string[]): string {
  if (Array.isArray(typeField)) {
    return typeField[0] || "";
  }
  return typeField;
}

/**
 * Validates and normalizes a URL
 */
function normalizeUrl(url: unknown, baseUrl?: string): string | undefined {
  if (typeof url !== "string") {
    return undefined;
  }
  
  try {
    let normalizedUrl: string;
    if (baseUrl && !url.startsWith("http")) {
      normalizedUrl = new URL(url, baseUrl).toString();
    } else {
      normalizedUrl = new URL(url).toString();
    }
    
    // Remove trailing slash for consistency, except for root URLs
    if (normalizedUrl.endsWith('/') && normalizedUrl !== 'https://' && normalizedUrl !== 'http://') {
      const urlObj = new URL(normalizedUrl);
      if (urlObj.pathname === '/') {
        normalizedUrl = normalizedUrl.slice(0, -1);
      }
    }
    
    return normalizedUrl;
  } catch {
    return url; // Return as-is if URL construction fails
  }
}

/**
 * Safely converts a value to a number
 */
function toNumber(value: unknown): number | undefined {
  if (typeof value === "number" && !isNaN(value)) {
    return value;
  }
  if (typeof value === "string") {
    const parsed = parseFloat(value);
    return isNaN(parsed) ? undefined : parsed;
  }
  return undefined;
}

/**
 * Safely extracts a string value
 */
function toString(value: unknown): string | undefined {
  if (typeof value === "string") {
    return value;
  }
  if (typeof value === "number") {
    return value.toString();
  }
  return undefined;
}

/**
 * Safely converts context to string
 */
function contextToString(context: string | string[] | Record<string, unknown> | undefined): string | undefined {
  if (typeof context === "string") {
    return context;
  }
  if (Array.isArray(context)) {
    return context.join(", ");
  }
  if (context && typeof context === "object") {
    return JSON.stringify(context);
  }
  return undefined;
}

// =============================================================================
// ENTITY CONVERTERS
// =============================================================================

/**
 * Converts Schema.org Person to normalized format
 */
function convertPerson(
  person: SchemaOrgPerson, 
  options: ConversionOptions
): ConversionResult<NormalizedPerson> {
  const warnings: SchemaOrgValidationError[] = [];
  
  const normalized: NormalizedPerson = {
    id: toString(person["@id"]),
    type: "Person",
    source: "schema.org",
    context: contextToString(person["@context"]),
    name: toString(person.name),
    firstName: toString(person.givenName),
    lastName: toString(person.familyName),
    email: toString(person.email),
    phone: toString(person.telephone),
    website: normalizeUrl(person.url, options.baseUrl),
    jobTitle: toString(person.jobTitle),
    birthDate: toString(person.birthDate),
    gender: toString(person.gender),
  };

  // Handle image
  if (person.image) {
    if (typeof person.image === "string") {
      normalized.image = { url: normalizeUrl(person.image, options.baseUrl) };
    } else if (typeof person.image === "object" && person.image["@type"] === "ImageObject") {
      normalized.image = convertImageObject(person.image as SchemaOrgImageObject, options);
    }
  }

  // Handle address
  if (person.address) {
    if (typeof person.address === "string") {
      normalized.address = { street: person.address };
    } else if (typeof person.address === "object") {
      normalized.address = convertPostalAddress(person.address as SchemaOrgPostalAddress, options);
    }
  }

  // Handle employer
  if (person.worksFor) {
    if (typeof person.worksFor === "string") {
      normalized.employer = {
        id: undefined,
        type: "Organization",
        source: "schema.org",
        name: person.worksFor,
      };
    } else if (typeof person.worksFor === "object") {
      const orgResult = convertOrganization(person.worksFor as SchemaOrgOrganization, options);
      normalized.employer = orgResult.entity;
      warnings.push(...orgResult.warnings);
    }
  }

  // Validate required fields
  if (options.validateRequired && !normalized.name) {
    warnings.push({
      field: "name",
      value: person.name,
      reason: "Required field 'name' is missing or invalid",
    });
  }

  return { entity: normalized, warnings };
}

/**
 * Converts Schema.org Organization to normalized format
 */
function convertOrganization(
  org: SchemaOrgOrganization, 
  options: ConversionOptions
): ConversionResult<NormalizedOrganization> {
  const warnings: SchemaOrgValidationError[] = [];
  
  const normalized: NormalizedOrganization = {
    id: toString(org["@id"]),
    type: "Organization",
    source: "schema.org",
    context: contextToString(org["@context"]),
    name: toString(org.name),
    legalName: toString(org.legalName),
    website: normalizeUrl(org.url, options.baseUrl),
    phone: toString(org.telephone),
    email: toString(org.email),
    foundingDate: toString(org.foundingDate),
    description: toString(org.description),
    industry: toString(org.industry),
    employeeCount: toNumber(org.numberOfEmployees),
  };

  // Handle logo
  if (org.logo) {
    if (typeof org.logo === "string") {
      normalized.logo = { url: normalizeUrl(org.logo, options.baseUrl) };
    } else if (typeof org.logo === "object" && org.logo["@type"] === "ImageObject") {
      normalized.logo = convertImageObject(org.logo as SchemaOrgImageObject, options);
    }
  }

  // Handle address
  if (org.address) {
    if (typeof org.address === "string") {
      normalized.address = { street: org.address };
    } else if (typeof org.address === "object") {
      normalized.address = convertPostalAddress(org.address as SchemaOrgPostalAddress, options);
    }
  }

  // Validate required fields
  if (options.validateRequired && !normalized.name) {
    warnings.push({
      field: "name",
      value: org.name,
      reason: "Required field 'name' is missing or invalid",
    });
  }

  return { entity: normalized, warnings };
}

/**
 * Converts Schema.org Product to normalized format
 */
function convertProduct(
  product: SchemaOrgProduct, 
  options: ConversionOptions
): ConversionResult<NormalizedProduct> {
  const warnings: SchemaOrgValidationError[] = [];
  
  const normalized: NormalizedProduct = {
    id: toString(product["@id"]),
    type: "Product",
    source: "schema.org",
    context: contextToString(product["@context"]),
    name: toString(product.name),
    description: toString(product.description),
    model: toString(product.model),
    sku: toString(product.sku),
    gtin: toString(product.gtin),
    availability: toString(product.availability),
    category: toString(product.category),
    color: toString(product.color),
  };

  // Handle images
  if (product.image) {
    const images: NormalizedImage[] = [];
    const imageArray = Array.isArray(product.image) ? product.image : [product.image];
    
    for (const img of imageArray) {
      if (typeof img === "string") {
        images.push({ url: normalizeUrl(img, options.baseUrl) });
      } else if (typeof img === "object" && img["@type"] === "ImageObject") {
        images.push(convertImageObject(img as SchemaOrgImageObject, options));
      }
    }
    
    normalized.images = images;
  }

  // Handle brand
  if (product.brand) {
    if (typeof product.brand === "string") {
      normalized.brand = product.brand;
    } else if (typeof product.brand === "object") {
      normalized.brand = toString((product.brand as SchemaOrgBrand).name);
    }
  }

  // Handle manufacturer
  if (product.manufacturer) {
    if (typeof product.manufacturer === "string") {
      normalized.manufacturer = product.manufacturer;
    } else if (typeof product.manufacturer === "object") {
      normalized.manufacturer = toString((product.manufacturer as SchemaOrgOrganization).name);
    }
  }

  // Handle price
  if (product.price !== undefined) {
    normalized.price = {
      amount: toNumber(product.price),
      currency: toString(product.priceCurrency),
    };
  }

  // Handle weight
  if (product.weight) {
    if (typeof product.weight === "string") {
      normalized.weight = { value: toNumber(product.weight) };
    } else if (typeof product.weight === "object") {
      const weightObj = product.weight as SchemaOrgQuantitativeValue;
      normalized.weight = {
        value: toNumber(weightObj.value),
        unit: toString(weightObj.unitCode) || toString(weightObj.unitText),
      };
    }
  }

  // Validate required fields
  if (options.validateRequired && !normalized.name) {
    warnings.push({
      field: "name",
      value: product.name,
      reason: "Required field 'name' is missing or invalid",
    });
  }

  return { entity: normalized, warnings };
}

/**
 * Converts Schema.org Event to normalized format
 */
function convertEvent(
  event: SchemaOrgEvent, 
  options: ConversionOptions
): ConversionResult<NormalizedEvent> {
  const warnings: SchemaOrgValidationError[] = [];
  
  const normalized: NormalizedEvent = {
    id: toString(event["@id"]),
    type: "Event",
    source: "schema.org",
    context: contextToString(event["@context"]),
    name: toString(event.name),
    description: toString(event.description),
    startDate: toString(event.startDate),
    endDate: toString(event.endDate),
    website: normalizeUrl(event.url, options.baseUrl),
    status: toString(event.eventStatus),
    attendanceMode: toString(event.eventAttendanceMode),
  };

  // Handle image
  if (event.image) {
    if (typeof event.image === "string") {
      normalized.image = { url: normalizeUrl(event.image, options.baseUrl) };
    } else if (typeof event.image === "object" && event.image["@type"] === "ImageObject") {
      normalized.image = convertImageObject(event.image as SchemaOrgImageObject, options);
    }
  }

  // Handle location
  if (event.location) {
    if (typeof event.location === "string") {
      normalized.location = { name: event.location };
    } else if (typeof event.location === "object") {
      normalized.location = convertPlace(event.location as SchemaOrgPlace, options);
    }
  }

  // Handle organizer
  if (event.organizer) {
    if (typeof event.organizer === "string") {
      normalized.organizer = {
        id: undefined,
        type: "Organization",
        source: "schema.org",
        name: event.organizer,
      };
    } else if (typeof event.organizer === "object") {
      const orgType = extractPrimaryType((event.organizer as SchemaOrgEntity)["@type"]);
      if (orgType === "Person") {
        const personResult = convertPerson(event.organizer as SchemaOrgPerson, options);
        normalized.organizer = personResult.entity;
        warnings.push(...personResult.warnings);
      } else {
        const orgResult = convertOrganization(event.organizer as SchemaOrgOrganization, options);
        normalized.organizer = orgResult.entity;
        warnings.push(...orgResult.warnings);
      }
    }
  }

  // Handle performers
  if (event.performer) {
    const performers: Array<NormalizedPerson | NormalizedOrganization> = [];
    const performerArray = Array.isArray(event.performer) ? event.performer : [event.performer];
    
    for (const performer of performerArray) {
      if (typeof performer === "string") {
        performers.push({
          id: undefined,
          type: "Person",
          source: "schema.org",
          name: performer,
        });
      } else if (typeof performer === "object") {
        const performerType = extractPrimaryType((performer as SchemaOrgEntity)["@type"]);
        if (performerType === "Person") {
          const personResult = convertPerson(performer as SchemaOrgPerson, options);
          performers.push(personResult.entity);
          warnings.push(...personResult.warnings);
        } else {
          const orgResult = convertOrganization(performer as SchemaOrgOrganization, options);
          performers.push(orgResult.entity);
          warnings.push(...orgResult.warnings);
        }
      }
    }
    
    normalized.performers = performers;
  }

  // Handle offers
  if (event.offers) {
    const offers: NormalizedOffer[] = [];
    const offerArray = Array.isArray(event.offers) ? event.offers : [event.offers];
    
    for (const offer of offerArray) {
      offers.push(convertOffer(offer, options));
    }
    
    normalized.offers = offers;
  }

  // Validate required fields
  if (options.validateRequired) {
    if (!normalized.name) {
      warnings.push({
        field: "name",
        value: event.name,
        reason: "Required field 'name' is missing or invalid",
      });
    }
    if (!normalized.startDate) {
      warnings.push({
        field: "startDate",
        value: event.startDate,
        reason: "Required field 'startDate' is missing or invalid",
      });
    }
  }

  return { entity: normalized, warnings };
}

// =============================================================================
// HELPER CONVERTERS
// =============================================================================

/**
 * Converts Schema.org ImageObject to normalized format
 */
function convertImageObject(
  image: SchemaOrgImageObject, 
  options: ConversionOptions
): NormalizedImage {
  return {
    url: normalizeUrl(image.url || image.contentUrl, options.baseUrl),
    width: toNumber(image.width),
    height: toNumber(image.height),
    caption: toString(image.caption),
  };
}

/**
 * Converts Schema.org PostalAddress to normalized format
 */
function convertPostalAddress(
  address: SchemaOrgPostalAddress,
  _options: ConversionOptions
): NormalizedAddress {
  return {
    street: toString(address.streetAddress),
    city: toString(address.addressLocality),
    region: toString(address.addressRegion),
    postalCode: toString(address.postalCode),
    country: toString(address.addressCountry),
  };
}

/**
 * Converts Schema.org Place to normalized format
 */
function convertPlace(
  place: SchemaOrgPlace, 
  options: ConversionOptions
): NormalizedPlace {
  const normalized: NormalizedPlace = {
    name: toString(place.name),
    website: normalizeUrl(place.url, options.baseUrl),
  };

  // Handle address
  if (place.address) {
    if (typeof place.address === "string") {
      normalized.address = { street: place.address };
    } else if (typeof place.address === "object") {
      normalized.address = convertPostalAddress(place.address as SchemaOrgPostalAddress, options);
    }
  }

  // Handle coordinates
  if (place.geo && typeof place.geo === "object") {
    const geo = place.geo as SchemaOrgGeoCoordinates;
    normalized.coordinates = {
      latitude: toNumber(geo.latitude),
      longitude: toNumber(geo.longitude),
    };
  }

  return normalized;
}

/**
 * Converts Schema.org Offer to normalized format
 */
function convertOffer(
  offer: SchemaOrgOffer, 
  options: ConversionOptions
): NormalizedOffer {
  return {
    price: {
      amount: toNumber(offer.price),
      currency: toString(offer.priceCurrency),
    },
    availability: toString(offer.availability),
    website: normalizeUrl(offer.url, options.baseUrl),
    validFrom: toString(offer.validFrom),
    validThrough: toString(offer.validThrough),
  };
}

// =============================================================================
// MAIN CONVERSION FUNCTION
// =============================================================================

/**
 * Return type for fromSchemaOrg function
 */
export interface FromSchemaOrgResult extends Record<string, unknown> {
  entities: NormalizedEntityUnion[];
  warnings: SchemaOrgValidationError[];
}

/**
 * Converts Schema.org structured data into normalized internal format
 *
 * @param input - Schema.org entity or array of entities
 * @param options - Conversion options
 * @returns Result containing normalized entities or error information
 */
export function fromSchemaOrg(
  input: unknown,
  options: ConversionOptions = {}
): Result<FromSchemaOrgResult> {
  try {
    // Set default options
    const defaultOptions: ConversionOptions = {
      validateRequired: true,
      includeFallbacks: true,
      preserveUnknown: false,
      normalizeUrls: true,
      ...options,
    };

    // Validate input
    if (!input) {
      return {
        success: false,
        error: FailedValidation("Input is null or undefined"),
      };
    }

    // Handle array input
    const inputArray = Array.isArray(input) ? input : [input];
    const entities: NormalizedEntityUnion[] = [];
    const allWarnings: SchemaOrgValidationError[] = [];

    for (const [index, item] of inputArray.entries()) {
      // Validate Schema.org entity
      if (!isValidSchemaOrgEntity(item)) {
        allWarnings.push({
          field: "@type",
          value: (item as any)?.["@type"],
          reason: "Invalid or missing @type field",
          path: [index.toString()],
        });
        continue;
      }

      const schemaOrgEntity = item as SchemaOrgEntity;
      const primaryType = extractPrimaryType(schemaOrgEntity["@type"]);

      // Convert based on type
      let conversionResult: ConversionResult;
      
      switch (primaryType) {
        case "Person":
          conversionResult = convertPerson(schemaOrgEntity as SchemaOrgPerson, defaultOptions);
          break;
        case "Organization":
          conversionResult = convertOrganization(schemaOrgEntity as SchemaOrgOrganization, defaultOptions);
          break;
        case "Product":
          conversionResult = convertProduct(schemaOrgEntity as SchemaOrgProduct, defaultOptions);
          break;
        case "Event":
          conversionResult = convertEvent(schemaOrgEntity as SchemaOrgEvent, defaultOptions);
          break;
        default:
          allWarnings.push({
            field: "@type",
            value: primaryType,
            reason: `Unsupported Schema.org type: ${primaryType}`,
            path: [index.toString()],
          });
          continue;
      }

      entities.push(conversionResult.entity);
      
      // Add path information to warnings
      const warningsWithPath = conversionResult.warnings.map(warning => ({
        ...warning,
        path: [index.toString(), ...(warning.path || [])],
      }));
      
      allWarnings.push(...warningsWithPath);
    }

    // Check if any entities were successfully converted
    if (entities.length === 0) {
      return {
        success: false,
        error: FailedValidation("No valid Schema.org entities could be converted", {
          warnings: allWarnings,
        }),
      };
    }

    return {
      success: true,
      message: `Successfully converted ${entities.length} Schema.org ${entities.length === 1 ? "entity" : "entities"}`,
      data: {
        entities,
        warnings: allWarnings,
      },
      entities,
      warnings: allWarnings,
    };

  } catch (error) {
    return {
      success: false,
      error: FailedValidation("Unexpected error during Schema.org conversion", {
        originalError: error instanceof Error ? error.message : String(error),
      }),
    };
  }
}

/**
 * Return type for fromSchemaOrgSingle function
 */
export interface FromSchemaOrgSingleResult extends Record<string, unknown> {
  entity: NormalizedEntityUnion;
  warnings: SchemaOrgValidationError[];
}

/**
 * Convenience function for converting a single Schema.org entity
 */
export function fromSchemaOrgSingle(
  input: SchemaOrgEntity,
  options: ConversionOptions = {}
): Result<FromSchemaOrgSingleResult> {
  const result = fromSchemaOrg(input, options);
  
  if (!result.success) {
    return result;
  }

  if (result.success && result.entities.length === 0) {
    return {
      success: false,
      error: FailedValidation("No entity could be converted"),
    };
  }

  if (!result.success) {
    return result;
  }

  return {
    success: true,
    message: result.message,
    data: {
      entity: result.entities[0],
      warnings: result.warnings,
    },
    entity: result.entities[0],
    warnings: result.warnings,
  };
}

/**
 * Type guard to check if a normalized entity is of a specific type
 */
export function isNormalizedType<T extends NormalizedEntityUnion["type"]>(
  entity: NormalizedEntityUnion,
  type: T
): entity is Extract<NormalizedEntityUnion, { type: T }> {
  return entity.type === type;
}
