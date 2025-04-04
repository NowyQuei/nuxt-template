import { validate as isUUID } from 'uuid'

/**
 * Match a dynamic route pattern like `/api/users/:id` against a concrete URL like `/api/users/abc-123`
 */
export function isMatchingProtectedRoute(pattern: string, path: string): boolean {
  const patternSegments = pattern.split('/')
  const pathSegments = path.split('/')

  if (patternSegments.length !== pathSegments.length) return false

  return patternSegments.every((segment, index) => {
    if (segment.startsWith(':')) {
      // Check if it's an ":id" segment and validate UUID
      const paramName = segment.slice(1)
      const paramValue = pathSegments[index]
      if (paramName === 'id') {
        return isUUID(paramValue)
      }
      return !!paramValue // Accept any non-empty param otherwise
    }
    return segment === pathSegments[index]
  })
}
