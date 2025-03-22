export async function apiRequest<T>(url: string, options: RequestInit = {}): Promise<T> {
  try {
    const response = await fetch(url, options)
    if (!response.ok) throw new Error(`Error: ${response.status}`)
    return response.json()
  } catch (error) {
    console.error(error)
    throw error
  }
}

export function createApiError(
  event: H3Event,
  { code, message, status = 400, details }: CreateApiErrorParams
): ApiErrorResponse {
  setResponseStatus(event, status)

  const baseError = {
    code,
    message,
    status
  }

  return {
    error: details != null ? { ...baseError, details } : baseError
  }
}

export function createApiSuccess<T = unknown>(
  event: H3Event,
  { data, message, meta, status = 200 }: CreateApiSuccessParams & { data: T }
): ApiSuccessResponse<T> {
  setResponseStatus(event, status)

  const response: ApiSuccessResponse<T> = { data }

  if (message) response.message = message
  if (meta) response.meta = meta

  return response
}
