import { describe, expect, it } from "vitest";
import { 
  fromSchemaOrg, 
  fromSchemaOrgSingle,
  isNormalizedType,
  type SchemaOrgPerson,
  type SchemaOrgOrganization,
  type SchemaOrgProduct,
  type SchemaOrgEvent,
  type NormalizedPerson,
  type NormalizedOrganization,
  type NormalizedProduct,
  type NormalizedEvent,
  type ConversionOptions,
} from "~/utils/fromSchemaOrg";
import { isValid } from "~/type-guards";

describe("fromSchemaOrg", () => {
  describe("Person conversion", () => {
    it("should convert a basic Schema.org Person", () => {
      const input: SchemaOrgPerson = {
        "@context": "https://schema.org",
        "@type": "Person",
        "@id": "https://example.com/person/1",
        name: "John Doe",
        givenName: "John",
        familyName: "Doe",
        email: "john@example.com",
        telephone: "+1-555-123-4567",
        url: "https://johndoe.com",
      };

      const result = fromSchemaOrg(input);

      expect(result.success).toBe(true);
      if (isValid(result)) {
        expect(result.entities).toHaveLength(1);
        const person = result.entities[0] as NormalizedPerson;
        expect(person.type).toBe("Person");
        expect(person.id).toBe("https://example.com/person/1");
        expect(person.name).toBe("John Doe");
        expect(person.firstName).toBe("John");
        expect(person.lastName).toBe("Doe");
        expect(person.email).toBe("john@example.com");
        expect(person.phone).toBe("+1-555-123-4567");
        expect(person.website).toBe("https://johndoe.com");
        expect(person.source).toBe("schema.org");
        expect(person.context).toBe("https://schema.org");
      }
    });

    it("should handle Person with complex nested objects", () => {
      const input: SchemaOrgPerson = {
        "@context": "https://schema.org",
        "@type": "Person",
        name: "Jane Smith",
        image: {
          "@type": "ImageObject",
          url: "https://example.com/jane.jpg",
          width: 400,
          height: 300,
          caption: "Jane's profile photo",
        },
        address: {
          "@type": "PostalAddress",
          streetAddress: "123 Main St",
          addressLocality: "San Francisco",
          addressRegion: "CA",
          postalCode: "94105",
          addressCountry: "US",
        },
        worksFor: {
          "@type": "Organization",
          name: "Tech Corp",
          url: "https://techcorp.com",
        },
      };

      const result = fromSchemaOrg(input);

      expect(result.success).toBe(true);
      if (isValid(result)) {
        const person = result.entities[0] as NormalizedPerson;
        expect(person.image).toEqual({
          url: "https://example.com/jane.jpg",
          width: 400,
          height: 300,
          caption: "Jane's profile photo",
        });
        expect(person.address).toEqual({
          street: "123 Main St",
          city: "San Francisco",
          region: "CA",
          postalCode: "94105",
          country: "US",
        });
        expect(person.employer).toEqual({
          id: undefined,
          type: "Organization",
          source: "schema.org",
          context: undefined,
          name: "Tech Corp",
          legalName: undefined,
          website: "https://techcorp.com",
          logo: undefined,
          address: undefined,
          phone: undefined,
          email: undefined,
          foundingDate: undefined,
          description: undefined,
          industry: undefined,
          employeeCount: undefined,
        });
      }
    });

    it("should handle Person with string-based nested fields", () => {
      const input: SchemaOrgPerson = {
        "@context": "https://schema.org",
        "@type": "Person",
        name: "Bob Wilson",
        image: "https://example.com/bob.jpg",
        address: "456 Oak Ave, Portland, OR 97201",
        worksFor: "Startup Inc",
      };

      const result = fromSchemaOrg(input);

      expect(result.success).toBe(true);
      if (isValid(result)) {
        const person = result.entities[0] as NormalizedPerson;
        expect(person.image).toEqual({
          url: "https://example.com/bob.jpg",
        });
        expect(person.address).toEqual({
          street: "456 Oak Ave, Portland, OR 97201",
        });
        expect(person.employer).toEqual({
          id: undefined,
          type: "Organization",
          source: "schema.org",
          name: "Startup Inc",
        });
      }
    });
  });

  describe("Organization conversion", () => {
    it("should convert a basic Schema.org Organization", () => {
      const input: SchemaOrgOrganization = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "@id": "https://example.com/org/1",
        name: "Example Corp",
        legalName: "Example Corporation Ltd.",
        url: "https://example.com",
        email: "info@example.com",
        telephone: "+1-555-987-6543",
        foundingDate: "2010-05-15",
        description: "A leading technology company",
        industry: "Technology",
        numberOfEmployees: 500,
      };

      const result = fromSchemaOrg(input);

      expect(result.success).toBe(true);
      if (isValid(result)) {
        expect(result.entities).toHaveLength(1);
        const org = result.entities[0] as NormalizedOrganization;
        expect(org.type).toBe("Organization");
        expect(org.id).toBe("https://example.com/org/1");
        expect(org.name).toBe("Example Corp");
        expect(org.legalName).toBe("Example Corporation Ltd.");
        expect(org.website).toBe("https://example.com");
        expect(org.email).toBe("info@example.com");
        expect(org.phone).toBe("+1-555-987-6543");
        expect(org.foundingDate).toBe("2010-05-15");
        expect(org.description).toBe("A leading technology company");
        expect(org.industry).toBe("Technology");
        expect(org.employeeCount).toBe(500);
      }
    });
  });

  describe("Product conversion", () => {
    it("should convert a basic Schema.org Product", () => {
      const input: SchemaOrgProduct = {
        "@context": "https://schema.org",
        "@type": "Product",
        "@id": "https://example.com/product/123",
        name: "Super Widget",
        description: "The best widget you can buy",
        image: ["https://example.com/widget1.jpg", "https://example.com/widget2.jpg"],
        brand: "WidgetCorp",
        model: "SW-2024",
        sku: "WC-SW-001",
        gtin: "1234567890123",
        price: 99.99,
        priceCurrency: "USD",
        availability: "InStock",
        category: "Electronics",
        color: "Blue",
      };

      const result = fromSchemaOrg(input);

      expect(result.success).toBe(true);
      if (isValid(result)) {
        expect(result.entities).toHaveLength(1);
        const product = result.entities[0] as NormalizedProduct;
        expect(product.type).toBe("Product");
        expect(product.name).toBe("Super Widget");
        expect(product.description).toBe("The best widget you can buy");
        expect(product.images).toEqual([
          { url: "https://example.com/widget1.jpg" },
          { url: "https://example.com/widget2.jpg" },
        ]);
        expect(product.brand).toBe("WidgetCorp");
        expect(product.model).toBe("SW-2024");
        expect(product.sku).toBe("WC-SW-001");
        expect(product.gtin).toBe("1234567890123");
        expect(product.price).toEqual({
          amount: 99.99,
          currency: "USD",
        });
        expect(product.availability).toBe("InStock");
        expect(product.category).toBe("Electronics");
        expect(product.color).toBe("Blue");
      }
    });

    it("should handle Product with complex brand and weight", () => {
      const input: SchemaOrgProduct = {
        "@context": "https://schema.org",
        "@type": "Product",
        name: "Heavy Gadget",
        brand: {
          "@type": "Brand",
          name: "GadgetBrand",
          logo: "https://example.com/brand-logo.png",
        },
        weight: {
          "@type": "QuantitativeValue",
          value: 2.5,
          unitCode: "KGM",
          unitText: "kg",
        },
      };

      const result = fromSchemaOrg(input);

      expect(result.success).toBe(true);
      if (isValid(result)) {
        const product = result.entities[0] as NormalizedProduct;
        expect(product.brand).toBe("GadgetBrand");
        expect(product.weight).toEqual({
          value: 2.5,
          unit: "KGM",
        });
      }
    });
  });

  describe("Event conversion", () => {
    it("should convert a basic Schema.org Event", () => {
      const input: SchemaOrgEvent = {
        "@context": "https://schema.org",
        "@type": "Event",
        "@id": "https://example.com/event/1",
        name: "Tech Conference 2024",
        description: "Annual technology conference",
        startDate: "2024-06-15T09:00:00",
        endDate: "2024-06-17T17:00:00",
        location: "San Francisco Convention Center",
        url: "https://techconf2024.com",
        eventStatus: "EventScheduled",
        eventAttendanceMode: "OfflineEventAttendanceMode",
      };

      const result = fromSchemaOrg(input);

      expect(result.success).toBe(true);
      if (isValid(result)) {
        expect(result.entities).toHaveLength(1);
        const event = result.entities[0] as NormalizedEvent;
        expect(event.type).toBe("Event");
        expect(event.name).toBe("Tech Conference 2024");
        expect(event.description).toBe("Annual technology conference");
        expect(event.startDate).toBe("2024-06-15T09:00:00");
        expect(event.endDate).toBe("2024-06-17T17:00:00");
        expect(event.location).toEqual({
          name: "San Francisco Convention Center",
        });
        expect(event.website).toBe("https://techconf2024.com");
        expect(event.status).toBe("EventScheduled");
        expect(event.attendanceMode).toBe("OfflineEventAttendanceMode");
      }
    });

    it("should handle Event with complex organizer and offers", () => {
      const input: SchemaOrgEvent = {
        "@context": "https://schema.org",
        "@type": "Event",
        name: "Workshop Series",
        organizer: {
          "@type": "Organization",
          name: "Learning Hub",
          url: "https://learninghub.com",
        },
        location: {
          "@type": "Place",
          name: "Main Auditorium",
          address: {
            "@type": "PostalAddress",
            streetAddress: "789 Education Blvd",
            addressLocality: "Boston",
            addressRegion: "MA",
            postalCode: "02115",
            addressCountry: "US",
          },
          geo: {
            "@type": "GeoCoordinates",
            latitude: 42.3601,
            longitude: -71.0589,
          },
        },
        offers: [
          {
            "@type": "Offer",
            price: 50,
            priceCurrency: "USD",
            availability: "InStock",
            validFrom: "2024-01-01",
            validThrough: "2024-06-01",
          },
          {
            "@type": "Offer",
            price: 75,
            priceCurrency: "USD",
            availability: "InStock",
            validFrom: "2024-06-02",
          },
        ],
      };

      const result = fromSchemaOrg(input);

      expect(result.success).toBe(true);
      if (isValid(result)) {
        const event = result.entities[0] as NormalizedEvent;
        expect(event.organizer).toEqual({
          id: undefined,
          type: "Organization",
          source: "schema.org",
          context: undefined,
          name: "Learning Hub",
          legalName: undefined,
          website: "https://learninghub.com",
          logo: undefined,
          address: undefined,
          phone: undefined,
          email: undefined,
          foundingDate: undefined,
          description: undefined,
          industry: undefined,
          employeeCount: undefined,
        });
        expect(event.location).toEqual({
          name: "Main Auditorium",
          website: undefined,
          address: {
            street: "789 Education Blvd",
            city: "Boston",
            region: "MA",
            postalCode: "02115",
            country: "US",
          },
          coordinates: {
            latitude: 42.3601,
            longitude: -71.0589,
          },
        });
        expect(event.offers).toEqual([
          {
            price: { amount: 50, currency: "USD" },
            availability: "InStock",
            website: undefined,
            validFrom: "2024-01-01",
            validThrough: "2024-06-01",
          },
          {
            price: { amount: 75, currency: "USD" },
            availability: "InStock",
            website: undefined,
            validFrom: "2024-06-02",
            validThrough: undefined,
          },
        ]);
      }
    });
  });

  describe("Array input handling", () => {
    it("should convert multiple entities in an array", () => {
      const input = [
        {
          "@context": "https://schema.org",
          "@type": "Person",
          name: "Alice Johnson",
        },
        {
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Tech Startup",
        },
        {
          "@context": "https://schema.org",
          "@type": "Product",
          name: "Innovation Device",
        },
      ];

      const result = fromSchemaOrg(input);

      expect(result.success).toBe(true);
      if (isValid(result)) {
        expect(result.entities).toHaveLength(3);
        expect(result.entities[0].type).toBe("Person");
        expect(result.entities[1].type).toBe("Organization");
        expect(result.entities[2].type).toBe("Product");
      }
    });

    it("should handle mixed valid and invalid entities", () => {
      const input = [
        {
          "@context": "https://schema.org",
          "@type": "Person",
          name: "Valid Person",
        },
        {
          // Missing @type
          name: "Invalid Entity",
        },
        {
          "@context": "https://schema.org",
          "@type": "UnsupportedType",
          name: "Unsupported",
        },
        {
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Valid Org",
        },
      ];

      const result = fromSchemaOrg(input);

      expect(result.success).toBe(true);
      if (isValid(result)) {
        expect(result.entities).toHaveLength(2);
        expect(result.warnings).toHaveLength(2);
        expect(result.warnings[0].reason).toBe("Invalid or missing @type field");
        expect(result.warnings[1].reason).toBe("Unsupported Schema.org type: UnsupportedType");
      }
    });
  });

  describe("Error handling", () => {
    it("should return error for null input", () => {
      const result = fromSchemaOrg(null);

      expect(result.success).toBe(false);
      if (!isValid(result)) {
        expect(result.error).toBeDefined();
      }
    });

    it("should return error for undefined input", () => {
      const result = fromSchemaOrg(undefined);

      expect(result.success).toBe(false);
      if (!isValid(result)) {
        expect(result.error).toBeDefined();
      }
    });

    it("should return error when no valid entities can be converted", () => {
      const input = [
        { name: "No type field" },
        { "@type": "UnsupportedType", name: "Unsupported" },
      ];

      const result = fromSchemaOrg(input);

      expect(result.success).toBe(false);
      if (!isValid(result)) {
        expect(result.error).toBeDefined();
      }
    });

    it("should handle malformed nested objects gracefully", () => {
      const input = {
        "@context": "https://schema.org",
        "@type": "Person",
        name: "Test Person",
        image: {
          // Missing @type, invalid structure
          malformed: true,
        },
        address: {
          // Partially valid address
          "@type": "PostalAddress",
          streetAddress: 123, // Wrong type
        },
      };

      const result = fromSchemaOrg(input);

      expect(result.success).toBe(true);
      if (isValid(result)) {
        const person = result.entities[0] as NormalizedPerson;
        expect(person.name).toBe("Test Person");
        expect(person.image).toBeUndefined();
        expect(person.address).toEqual({
          street: "123",
          city: undefined,
          region: undefined,
          postalCode: undefined,
          country: undefined,
        });
      }
    });
  });

  describe("Conversion options", () => {
    it("should validate required fields when option is enabled", () => {
      const input: SchemaOrgPerson = {
        "@context": "https://schema.org",
        "@type": "Person",
        // Missing required 'name' field
        email: "test@example.com",
      };

      const options: ConversionOptions = {
        validateRequired: true,
      };

      const result = fromSchemaOrg(input, options);

      expect(result.success).toBe(true);
      if (isValid(result)) {
        expect(result.warnings).toHaveLength(1);
        expect(result.warnings[0].field).toBe("name");
        expect(result.warnings[0].reason).toBe("Required field 'name' is missing or invalid");
      }
    });

    it("should skip required field validation when option is disabled", () => {
      const input: SchemaOrgPerson = {
        "@context": "https://schema.org",
        "@type": "Person",
        email: "test@example.com",
      };

      const options: ConversionOptions = {
        validateRequired: false,
      };

      const result = fromSchemaOrg(input, options);

      expect(result.success).toBe(true);
      if (isValid(result)) {
        expect(result.warnings).toHaveLength(0);
      }
    });

    it("should normalize relative URLs with base URL", () => {
      const input: SchemaOrgPerson = {
        "@context": "https://schema.org",
        "@type": "Person",
        name: "Test Person",
        url: "/profile",
        image: "/avatar.jpg",
      };

      const options: ConversionOptions = {
        normalizeUrls: true,
        baseUrl: "https://example.com",
      };

      const result = fromSchemaOrg(input, options);

      expect(result.success).toBe(true);
      if (isValid(result)) {
        const person = result.entities[0] as NormalizedPerson;
        expect(person.website).toBe("https://example.com/profile");
        expect(person.image?.url).toBe("https://example.com/avatar.jpg");
      }
    });

    it("should handle absolute URLs correctly", () => {
      const input: SchemaOrgPerson = {
        "@context": "https://schema.org",
        "@type": "Person",
        name: "Test Person",
        url: "https://johndoe.com",
      };

      const options: ConversionOptions = {
        normalizeUrls: true,
        baseUrl: "https://example.com",
      };

      const result = fromSchemaOrg(input, options);

      expect(result.success).toBe(true);
      if (isValid(result)) {
        const person = result.entities[0] as NormalizedPerson;
        expect(person.website).toBe("https://johndoe.com");
      }
    });
  });

  describe("Context handling", () => {
    it("should handle string context", () => {
      const input: SchemaOrgPerson = {
        "@context": "https://schema.org",
        "@type": "Person",
        name: "Test Person",
      };

      const result = fromSchemaOrg(input);

      expect(result.success).toBe(true);
      if (isValid(result)) {
        const person = result.entities[0] as NormalizedPerson;
        expect(person.context).toBe("https://schema.org");
      }
    });

    it("should handle array context", () => {
      const input: SchemaOrgPerson = {
        "@context": ["https://schema.org", "https://example.com/context"],
        "@type": "Person",
        name: "Test Person",
      };

      const result = fromSchemaOrg(input);

      expect(result.success).toBe(true);
      if (isValid(result)) {
        const person = result.entities[0] as NormalizedPerson;
        expect(person.context).toBe("https://schema.org, https://example.com/context");
      }
    });

    it("should handle object context", () => {
      const input: SchemaOrgPerson = {
        "@context": {
          "@vocab": "https://schema.org/",
          "custom": "https://example.com/vocab#",
        },
        "@type": "Person",
        name: "Test Person",
      };

      const result = fromSchemaOrg(input);

      expect(result.success).toBe(true);
      if (isValid(result)) {
        const person = result.entities[0] as NormalizedPerson;
        expect(person.context).toBe('{"@vocab":"https://schema.org/","custom":"https://example.com/vocab#"}');
      }
    });
  });

  describe("Type array handling", () => {
    it("should handle array @type field", () => {
      const input = {
        "@context": "https://schema.org",
        "@type": ["Person", "Author"],
        name: "Jane Author",
      };

      const result = fromSchemaOrg(input);

      expect(result.success).toBe(true);
      if (isValid(result)) {
        expect(result.entities).toHaveLength(1);
        expect(result.entities[0].type).toBe("Person");
      }
    });
  });

  describe("Data type conversion", () => {
    it("should handle numeric strings", () => {
      const input: SchemaOrgProduct = {
        "@context": "https://schema.org",
        "@type": "Product",
        name: "Test Product",
        price: "99.99",
      };

      const result = fromSchemaOrg(input);

      expect(result.success).toBe(true);
      if (isValid(result)) {
        const product = result.entities[0] as NormalizedProduct;
        expect(product.price?.amount).toBe(99.99);
      }
    });

    it("should handle invalid numeric values gracefully", () => {
      const input: SchemaOrgProduct = {
        "@context": "https://schema.org",
        "@type": "Product",
        name: "Test Product",
        price: "invalid-price",
      };

      const result = fromSchemaOrg(input);

      expect(result.success).toBe(true);
      if (isValid(result)) {
        const product = result.entities[0] as NormalizedProduct;
        expect(product.price?.amount).toBeUndefined();
      }
    });
  });
});

describe("fromSchemaOrgSingle", () => {
  it("should convert a single entity successfully", () => {
    const input: SchemaOrgPerson = {
      "@context": "https://schema.org",
      "@type": "Person",
      name: "Single Person",
    };

    const result = fromSchemaOrgSingle(input);

    expect(result.success).toBe(true);
    if (isValid(result)) {
      expect(result.entity.type).toBe("Person");
      expect((result.entity as NormalizedPerson).name).toBe("Single Person");
      expect(result.warnings).toEqual([]);
    }
  });

  it("should return error for invalid entity", () => {
    const input = {
      name: "No type field",
    } as any;

    const result = fromSchemaOrgSingle(input);

    expect(result.success).toBe(false);
  });
});

describe("isNormalizedType", () => {
  it("should correctly identify Person type", () => {
    const person: NormalizedPerson = {
      id: "1",
      type: "Person",
      source: "schema.org",
      name: "Test Person",
    };

    expect(isNormalizedType(person, "Person")).toBe(true);
    expect(isNormalizedType(person, "Organization")).toBe(false);
  });

  it("should correctly identify Organization type", () => {
    const org: NormalizedOrganization = {
      id: "1",
      type: "Organization",
      source: "schema.org",
      name: "Test Org",
    };

    expect(isNormalizedType(org, "Organization")).toBe(true);
    expect(isNormalizedType(org, "Person")).toBe(false);
  });
});

describe("Edge cases and performance", () => {
  it("should handle large arrays efficiently", () => {
    const largeInput = Array.from({ length: 100 }, (_, i) => ({
      "@context": "https://schema.org",
      "@type": "Person",
      name: `Person ${i}`,
    }));

    const startTime = Date.now();
    const result = fromSchemaOrg(largeInput);
    const duration = Date.now() - startTime;

    expect(result.success).toBe(true);
    if (isValid(result)) {
      expect(result.entities).toHaveLength(100);
    }
    expect(duration).toBeLessThan(1000); // Should complete within 1 second
  });

  it("should handle deeply nested objects", () => {
    const input: SchemaOrgEvent = {
      "@context": "https://schema.org",
      "@type": "Event",
      name: "Complex Event",
      organizer: {
        "@type": "Organization",
        name: "Complex Org",
        address: {
          "@type": "PostalAddress",
          streetAddress: "Deep Street",
          addressLocality: "Nested City",
        },
      },
      location: {
        "@type": "Place",
        name: "Deep Venue",
        address: {
          "@type": "PostalAddress",
          streetAddress: "Venue Street",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: 40.7128,
          longitude: -74.0060,
        },
      },
    };

    const result = fromSchemaOrg(input);

    expect(result.success).toBe(true);
    if (isValid(result)) {
      const event = result.entities[0] as NormalizedEvent;
      expect(event.organizer?.type).toBe("Organization");
      expect((event.organizer as NormalizedOrganization).address?.street).toBe("Deep Street");
      expect(event.location?.coordinates?.latitude).toBe(40.7128);
    }
  });

  it("should handle circular references gracefully", () => {
    const org: any = {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "Self-referencing Org",
    };
    
    // Create circular reference
    org.parentOrganization = org;

    const result = fromSchemaOrg(org);

    expect(result.success).toBe(true);
    if (isValid(result)) {
      expect(result.entities).toHaveLength(1);
      expect(result.entities[0].type).toBe("Organization");
    }
  });

  it("should handle empty arrays and objects", () => {
    const input = {
      "@context": "https://schema.org",
      "@type": "Product",
      name: "Empty Product",
      image: [],
      offers: [],
    };

    const result = fromSchemaOrg(input);

    expect(result.success).toBe(true);
    if (isValid(result)) {
      const product = result.entities[0] as NormalizedProduct;
      expect(product.images).toEqual([]);
    }
  });
});
