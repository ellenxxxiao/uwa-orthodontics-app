export {};

// Create a type for the roles
export type Roles = "admin" | "clinician" | "patient";

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      role?: Roles;
    };
  }
}
