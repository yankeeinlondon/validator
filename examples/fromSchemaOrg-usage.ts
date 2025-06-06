import { fromSchemaOrg, fromSchemaOrgSingle, isNormalizedType } from "../src/utils/fromSchemaOrg";
import type { 
  SchemaOrgPerson, 
  SchemaOrgOrganization, 
  SchemaOrgProduct, 
  SchemaOrgEvent,
  NormalizedPerson,
  ConversionOptions 
} from "../src/utils/fromSchemaOrg";

// Example 1: Converting a single Person entity
const personExample: SchemaOrgPerson = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": "https://example.com/person/john-doe",
  name: "John Doe",
  givenName: "John",
  familyName: "Doe",
  email: "john.doe@example.com",
  telephone: "+1-555-123-4567",
  url: "https://johndoe.com",
  jobTitle: "Software Engineer",
  image: {
    "@type": "ImageObject",
    url: "https://example.com/john-doe.jpg",
    width: 400,
    height: 300,
    caption: "John Doe's profile picture"
  },
  address: {
    "@type": "PostalAddress",
    streetAddress: "123 Main Street",
    addressLocality: "San Francisco",
    addressRegion: "CA",
    postalCode: "94105",
    addressCountry: "US"
  },
  worksFor: {
    "@type": "Organization",
    name: "Tech Corp",
    url: "https://techcorp.com",
    logo: "https://techcorp.com/logo.png"
  }
};

console.log("=== Single Person Conversion ===");
const personResult = fromSchemaOrgSingle(personExample);

if (personResult.success) {
  console.log("✓ Successfully converted person:");
  console.log(`  Name: ${(personResult.entity as NormalizedPerson).name}`);
  console.log(`  Email: ${(personResult.entity as NormalizedPerson).email}`);
  console.log(`  Website: ${(personResult.entity as NormalizedPerson).website}`);
  console.log(`  Employer: ${(personResult.entity as NormalizedPerson).employer?.name}`);
  
  if (personResult.warnings.length > 0) {
    console.log("⚠ Warnings:", personResult.warnings);
  }
} else {
  console.log("✗ Failed to convert person:", personResult.error);
}

// Example 2: Converting multiple entities at once
const multipleEntities = [
  {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Alice Johnson",
    email: "alice@example.com",
    jobTitle: "Product Manager"
  },
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Startup Inc",
    url: "https://startup.example.com",
    foundingDate: "2020-01-15",
    numberOfEmployees: 50
  },
  {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "Amazing Widget",
    description: "The most amazing widget you'll ever use",
    price: 99.99,
    priceCurrency: "USD",
    brand: "WidgetCorp",
    availability: "InStock"
  },
  {
    "@context": "https://schema.org",
    "@type": "Event",
    name: "Tech Conference 2024",
    description: "Annual technology conference",
    startDate: "2024-06-15T09:00:00",
    endDate: "2024-06-17T17:00:00",
    location: "San Francisco Convention Center",
    url: "https://techconf2024.com"
  }
];

console.log("\n=== Multiple Entities Conversion ===");
const multipleResult = fromSchemaOrg(multipleEntities);

if (multipleResult.success) {
  console.log(`✓ Successfully converted ${multipleResult.entities.length} entities:`);
  
  multipleResult.entities.forEach((entity, index) => {
    console.log(`  ${index + 1}. ${entity.type}: ${entity.name || 'Unnamed'}`);
    
    // Type-specific handling using type guards
    if (isNormalizedType(entity, "Person")) {
      console.log(`     Email: ${entity.email || 'Not provided'}`);
    } else if (isNormalizedType(entity, "Organization")) {
      console.log(`     Website: ${entity.website || 'Not provided'}`);
    } else if (isNormalizedType(entity, "Product")) {
      console.log(`     Price: $${entity.price?.amount || 'Not specified'}`);
    } else if (isNormalizedType(entity, "Event")) {
      console.log(`     Date: ${entity.startDate || 'Not specified'}`);
    }
  });
  
  if (multipleResult.warnings.length > 0) {
    console.log("⚠ Warnings:", multipleResult.warnings);
  }
} else {
  console.log("✗ Failed to convert entities:", multipleResult.error);
}

// Example 3: Using conversion options
const optionsExample: ConversionOptions = {
  validateRequired: true,
  normalizeUrls: true,
  baseUrl: "https://example.com"
};

const entityWithRelativeUrl = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Bob Wilson",
  url: "/profile/bob",  // Relative URL
  image: "/images/bob.jpg"  // Relative URL
};

console.log("\n=== Conversion with Options ===");
const optionsResult = fromSchemaOrg(entityWithRelativeUrl, optionsExample);

if (optionsResult.success) {
  const person = optionsResult.entities[0] as NormalizedPerson;
  console.log("✓ Successfully converted with URL normalization:");
  console.log(`  Website: ${person.website}`);  // Should be absolute URL
  console.log(`  Image URL: ${person.image?.url}`);  // Should be absolute URL
} else {
  console.log("✗ Failed to convert with options:", optionsResult.error);
}

// Example 4: Error handling for invalid data
const invalidData = [
  {
    // Missing @type field
    name: "Invalid Entity"
  },
  {
    "@type": "UnsupportedType",
    name: "Unsupported Entity"
  },
  {
    "@context": "https://schema.org",
    "@type": "Person",
    // Missing required name field (when validation enabled)
    email: "noname@example.com"
  }
];

console.log("\n=== Error Handling Example ===");
const errorResult = fromSchemaOrg(invalidData, { validateRequired: true });

if (errorResult.success) {
  console.log(`✓ Converted ${errorResult.entities.length} valid entities`);
  console.log(`⚠ ${errorResult.warnings.length} warnings generated:`);
  
  errorResult.warnings.forEach((warning, index) => {
    console.log(`  ${index + 1}. ${warning.reason} (field: ${warning.field})`);
  });
} else {
  console.log("✗ No valid entities could be converted:", errorResult.error);
}

// Example 5: Complex nested data
const complexEvent: SchemaOrgEvent = {
  "@context": "https://schema.org",
  "@type": "Event",
  name: "Advanced Workshop Series",
  description: "Comprehensive training workshop",
  startDate: "2024-07-01T09:00:00",
  endDate: "2024-07-03T17:00:00",
  organizer: {
    "@type": "Organization",
    name: "Learning Hub",
    url: "https://learninghub.com",
    address: {
      "@type": "PostalAddress",
      streetAddress: "456 Education Ave",
      addressLocality: "Boston",
      addressRegion: "MA",
      postalCode: "02115",
      addressCountry: "US"
    }
  },
  location: {
    "@type": "Place",
    name: "Main Conference Hall",
    address: {
      "@type": "PostalAddress",
      streetAddress: "789 Conference Blvd",
      addressLocality: "Boston",
      addressRegion: "MA",
      postalCode: "02116",
      addressCountry: "US"
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 42.3601,
      longitude: -71.0589
    }
  },
  offers: [
    {
      "@type": "Offer",
      price: 150,
      priceCurrency: "USD",
      availability: "InStock",
      validFrom: "2024-01-01",
      validThrough: "2024-06-30"
    },
    {
      "@type": "Offer",
      price: 200,
      priceCurrency: "USD",
      availability: "InStock",
      validFrom: "2024-07-01"
    }
  ]
};

console.log("\n=== Complex Nested Data Example ===");
const complexResult = fromSchemaOrg(complexEvent);

if (complexResult.success) {
  const event = complexResult.entities[0];
  if (isNormalizedType(event, "Event")) {
    console.log("✓ Successfully converted complex event:");
    console.log(`  Event: ${event.name}`);
    console.log(`  Organizer: ${event.organizer?.name}`);
    console.log(`  Location: ${event.location?.name}`);
    console.log(`  Coordinates: ${event.location?.coordinates?.latitude}, ${event.location?.coordinates?.longitude}`);
    console.log(`  Offers: ${event.offers?.length || 0} pricing options`);
  }
} else {
  console.log("✗ Failed to convert complex event:", complexResult.error);
}

export {
  personExample,
  multipleEntities,
  complexEvent
};
