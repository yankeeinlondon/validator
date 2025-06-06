# Schema.org to Normalized Data Converter

The `fromSchemaOrg()` function provides comprehensive conversion from Schema.org structured data into normalized internal data formats. This utility supports various Schema.org entity types and transforms them into standardized objects with consistent property naming and structure.

## Features

- ✅ **Multiple Entity Types**: Person, Organization, Product, Event, and supporting types
- ✅ **Robust Type Definitions**: Full TypeScript support for input and output schemas
- ✅ **Comprehensive Error Handling**: Detailed validation and warning system
- ✅ **Nested Object Support**: Handles complex Schema.org structures and arrays
- ✅ **Context Handling**: Supports multiple Schema.org contexts and vocabularies
- ✅ **Fallback Mechanisms**: Graceful handling of missing required properties
- ✅ **Data Integrity Validation**: Ensures data quality during conversion
- ✅ **URL Normalization**: Converts relative URLs to absolute URLs
- ✅ **Performance Optimized**: Efficient processing for large datasets
- ✅ **Extensible Design**: Easy to add support for additional Schema.org types

## Quick Start

```typescript
import { fromSchemaOrg, fromSchemaOrgSingle } from '@yankeeinlondon/validator';

// Convert a single Schema.org Person
const person = {
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "John Doe",
  "email": "john@example.com"
};

const result = fromSchemaOrgSingle(person);
if (result.success) {
  console.log('Converted person:', result.entity);
}

// Convert multiple entities
const entities = [person, organization, product];
const multiResult = fromSchemaOrg(entities);
if (multiResult.success) {
  console.log(`Converted ${multiResult.entities.length} entities`);
}
```

## Supported Schema.org Types

### Primary Entity Types

| Schema.org Type | Normalized Type | Description |
|-----------------|-----------------|-------------|
| `Person` | `NormalizedPerson` | Individual people with contact info, employment, etc. |
| `Organization` | `NormalizedOrganization` | Companies, institutions, and other organizations |
| `Product` | `NormalizedProduct` | Products with pricing, availability, and specifications |
| `Event` | `NormalizedEvent` | Events with dates, locations, and organizers |

### Supporting Types

| Schema.org Type | Purpose |
|-----------------|---------|
| `ImageObject` | Images with dimensions and captions |
| `PostalAddress` | Structured address information |
| `Place` | Locations with coordinates and addresses |
| `GeoCoordinates` | Latitude/longitude coordinates |
| `Brand` | Product brands and logos |
| `Offer` | Pricing and availability information |
| `QuantitativeValue` | Measurements with units |

## API Reference

### `fromSchemaOrg(input, options?)`

Converts Schema.org structured data into normalized format.

**Parameters:**
- `input: unknown` - Schema.org entity or array of entities
- `options?: ConversionOptions` - Conversion configuration

**Returns:** `Result<FromSchemaOrgResult>`

**Example:**
```typescript
const result = fromSchemaOrg(schemaOrgData, {
  validateRequired: true,
  normalizeUrls: true,
  baseUrl: 'https://example.com'
});
```

### `fromSchemaOrgSingle(input, options?)`

Convenience function for converting a single Schema.org entity.

**Parameters:**
- `input: SchemaOrgEntity` - Single Schema.org entity
- `options?: ConversionOptions` - Conversion configuration

**Returns:** `Result<FromSchemaOrgSingleResult>`

### `isNormalizedType<T>(entity, type)`

Type guard to check if a normalized entity is of a specific type.

**Parameters:**
- `entity: NormalizedEntityUnion` - Normalized entity to check
- `type: T` - Type to check against

**Returns:** `boolean`

**Example:**
```typescript
if (isNormalizedType(entity, "Person")) {
  // entity is now typed as NormalizedPerson
  console.log(entity.email);
}
```

## Conversion Options

```typescript
interface ConversionOptions {
  /** Whether to validate required fields for each entity type */
  validateRequired?: boolean; // default: true
  
  /** Whether to include fallback values for missing properties */
  includeFallbacks?: boolean; // default: true
  
  /** Whether to preserve unknown properties in the output */
  preserveUnknown?: boolean; // default: false
  
  /** Custom property mappings for specific types */
  propertyMappings?: Record<string, Record<string, string>>;
  
  /** Whether to normalize URLs to absolute URLs */
  normalizeUrls?: boolean; // default: true
  
  /** Base URL for relative URL normalization */
  baseUrl?: string;
}
```

## Error Handling

The converter provides comprehensive error handling and validation:

### Success Response
```typescript
{
  success: true,
  message: "Successfully converted 3 Schema.org entities",
  data: {
    entities: [...], // Normalized entities
    warnings: [...]  // Any validation warnings
  }
}
```

### Error Response
```typescript
{
  success: false,
  error: FailedValidation // Detailed error information
}
```

### Warning Types
```typescript
interface SchemaOrgValidationError {
  field: string;      // Field that caused the warning
  value: unknown;     // Original problematic value
  reason: string;     // Human-readable explanation
  path?: string[];    // Path to the field (for arrays)
}
```

## Examples

### Basic Person Conversion

```typescript
const personData = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": "https://example.com/person/1",
  "name": "Jane Smith",
  "givenName": "Jane",
  "familyName": "Smith",
  "email": "jane@example.com",
  "telephone": "+1-555-123-4567",
  "url": "https://janesmith.com",
  "jobTitle": "Software Engineer"
};

const result = fromSchemaOrgSingle(personData);
// Result: NormalizedPerson with consistent property names
```

### Complex Nested Data

```typescript
const eventData = {
  "@context": "https://schema.org",
  "@type": "Event",
  "name": "Tech Conference 2024",
  "startDate": "2024-06-15T09:00:00",
  "location": {
    "@type": "Place",
    "name": "Convention Center",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "123 Main St",
      "addressLocality": "San Francisco",
      "addressRegion": "CA",
      "postalCode": "94105"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 37.7749,
      "longitude": -122.4194
    }
  },
  "organizer": {
    "@type": "Organization",
    "name": "Tech Corp",
    "url": "https://techcorp.com"
  }
};

const result = fromSchemaOrg(eventData);
// Converts nested structures into normalized format
```

### URL Normalization

```typescript
const entityWithRelativeUrls = {
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Bob Wilson",
  "url": "/profile/bob",
  "image": "/images/bob.jpg"
};

const result = fromSchemaOrg(entityWithRelativeUrls, {
  normalizeUrls: true,
  baseUrl: "https://example.com"
});

// URLs are converted to:
// url: "https://example.com/profile/bob"
// image.url: "https://example.com/images/bob.jpg"
```

### Error Handling

```typescript
const mixedData = [
  { name: "Missing @type" },  // Invalid
  { "@type": "UnsupportedType" },  // Unsupported
  { "@context": "https://schema.org", "@type": "Person", "name": "Valid Person" }  // Valid
];

const result = fromSchemaOrg(mixedData, { validateRequired: true });

if (result.success) {
  console.log(`Converted ${result.entities.length} entities`);
  console.log(`Generated ${result.warnings.length} warnings`);
  
  result.warnings.forEach(warning => {
    console.log(`Warning: ${warning.reason} (field: ${warning.field})`);
  });
}
```

## Property Mappings

The converter maps Schema.org properties to normalized property names:

### Person Mappings
| Schema.org | Normalized |
|------------|------------|
| `givenName` | `firstName` |
| `familyName` | `lastName` |
| `telephone` | `phone` |
| `url` | `website` |
| `worksFor` | `employer` |

### Organization Mappings
| Schema.org | Normalized |
|------------|------------|
| `url` | `website` |
| `telephone` | `phone` |
| `numberOfEmployees` | `employeeCount` |

### Product Mappings
| Schema.org | Normalized |
|------------|------------|
| `image` | `images[]` |
| `price` + `priceCurrency` | `price: { amount, currency }` |

## Performance Considerations

- **Batch Processing**: Process multiple entities in a single call for better performance
- **Memory Efficient**: Processes large datasets without excessive memory usage
- **Type Safety**: Full TypeScript support prevents runtime errors
- **Validation Caching**: Reuses validation logic for similar entities

## Extension Guide

To add support for additional Schema.org types:

1. **Define Schema.org Interface**:
```typescript
export interface SchemaOrgNewType extends SchemaOrgThing {
  "@type": "NewType";
  // Add specific properties
}
```

2. **Define Normalized Interface**:
```typescript
export interface NormalizedNewType extends NormalizedEntity {
  type: "NewType";
  // Add normalized properties
}
```

3. **Add Converter Function**:
```typescript
function convertNewType(
  entity: SchemaOrgNewType,
  options: ConversionOptions
): ConversionResult<NormalizedNewType> {
  // Implementation
}
```

4. **Update Main Switch**:
Add case to the main conversion switch statement.

## Testing

Comprehensive test suite covers:
- ✅ All entity types and conversion scenarios
- ✅ Error handling and edge cases
- ✅ Performance with large datasets
- ✅ Type safety and validation
- ✅ URL normalization and context handling
- ✅ Nested object processing

Run tests with:
```bash
npm test tests/utils/fromSchemaOrg.test.ts
```

## TypeScript Support

Full TypeScript support with:
- Input type validation
- Output type inference
- Type guards for normalized entities
- Comprehensive interface definitions
- JSDoc documentation

```typescript
import { 
  fromSchemaOrg,
  type SchemaOrgPerson,
  type NormalizedPerson,
  isNormalizedType
} from '@yankeeinlondon/validator';

const person: SchemaOrgPerson = { /* ... */ };
const result = fromSchemaOrg(person);

if (result.success && isNormalizedType(result.entities[0], "Person")) {
  // Full type safety and autocompletion
  const email = result.entities[0].email;
}
