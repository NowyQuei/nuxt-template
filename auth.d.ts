declare module '#auth-utils' {
  interface User extends CookieUser {}

  interface UserSession extends UserSession {} // Or use directly if desired

  interface SecureSessionData {
    // Add custom fields here if needed
  }
}

export {}
