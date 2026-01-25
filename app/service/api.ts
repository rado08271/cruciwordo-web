import { Identity as SpacetimeIdentity, Timestamp, type Infer } from "spacetimedb";
import type { BoardDatabaseModel } from "~/spacetime_bridge";

type Identity = {
  identity: SpacetimeIdentity;
  token: string;
};

type SatsJsonResponse = {
  schema: {
    elements: Array<{
      name: { some: string } | { none: null };
      algebraic_type: any;
    }>;
  };
  rows: any[][];
  total_duration_micros: number;
  stats: {
    rows_inserted: number;
    rows_deleted: number;
    rows_updated: number;
  };
}[];

const generateTempIdentity = async (): Promise<Identity> => {
  const tokenRespone = await fetch(`http://localhost:3000/v1/identity`, { method: "POST" });

  if (!tokenRespone.ok || tokenRespone.status < 200 || tokenRespone.status >= 300) {
    throw Error("Could not generate identity");
  }

  const tokenJson: { identity: string; token: string } = await tokenRespone.json();

  return {
    identity: SpacetimeIdentity.fromString(tokenJson.identity),
    token: tokenJson.token,
  };
};

/**
 * Parse SATS-JSON response to JavaScript objects
 * Maps the schema and rows from SpacetimeDB's response format
 */
function parseSatsJsonResponse<T = any>(response: SatsJsonResponse): T[] {
  if (!response || response.length === 0) {
    return [];
  }

  const queryResult = response[0];
  const schema = queryResult.schema.elements;
  const rows = queryResult.rows;

  return rows.map(rowValues => {
    const obj: any = {};

    schema.forEach((field, index) => {
      // Get the field name from the schema
      const fieldName = "some" in field.name ? field.name.some : null;
      if (!fieldName) return;

      const value = rowValues[index];

      // Parse the value based on its type
      obj[fieldName] = parseValue(value, field.algebraic_type);
    });

    return obj as T;
  });
}

/**
 * Parse individual values based on their algebraic type
 */
function parseValue(value: any, algebraicType: any): any {
  if (value === null || value === undefined) {
    return value;
  }

  // Handle Product types (nested objects like Timestamp, Identity)
  if (algebraicType.Product) {
    const elements = algebraicType.Product.elements;

    // Check if it's a Timestamp
    if (
      elements.length === 1 &&
      elements[0].name?.some === "__timestamp_micros_since_unix_epoch__"
    ) {
      return new Timestamp(BigInt(value[0]));
    }

    // Check if it's an Identity
    if (elements.length === 1 && elements[0].name?.some === "__identity__") {
      return SpacetimeIdentity.fromString(value[0]);
    }

    // Generic product type - return the array or first element
    return Array.isArray(value) && value.length === 1 ? value[0] : value;
  }

  // Primitive types are already in correct format
  return value;
}

/**
 * Execute a SQL query against SpacetimeDB and return parsed results
 * @param sql SQL query string
 * @returns Array of parsed objects matching the query results
 */
export const ssql = async <T = any>(sql: string): Promise<T[]> => {
  const identity = await generateTempIdentity();

  const sqlResponse = await fetch(`http://localhost:3000/v1/database/cruciwordo/sql`, {
    method: "POST",
    headers: { Authorization: `Bearer ${identity.token}` },
    body: sql,
  });

  if (!sqlResponse.ok || sqlResponse.status < 200 || sqlResponse.status >= 300) {
    throw Error("Could not process your request");
  }

  const responseJson: SatsJsonResponse = await sqlResponse.json();

  return parseSatsJsonResponse<T>(responseJson);
};
