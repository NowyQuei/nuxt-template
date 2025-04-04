import { z, type ZodSchema } from 'zod'

export async function useSafeFetch<T>(
  url: string,
  options: Parameters<typeof $fetch>[1] = {},
  schema?: ZodSchema<T>
): Promise<T | null> {
  try {
    const response = await $fetch<ApiSuccessResponse<T> | ApiErrorResponse>(url, options)

    if ('error' in response) {
      logger.error('API returned error:', response.error)
      $toast.error(response.error.message || 'Something went wrong.')
      return null
    }

    if ('data' in response) {
      if (schema) {
        const parsed = schema.safeParse(response.data)
        if (!parsed.success) {
          logger.error('Failed Zod validation:', parsed.error.flatten())
          $toast.error('Invalid response format.')
          return null
        }
        return parsed.data
      }
      return response.data
    }

    logger.error('Unexpected response format:', response)
    $toast.error('Unexpected response format.')
    return null
  } catch (err: any) {
    logger.error('Fetch failed:', err)
    $toast.error(err.message || 'Could not load data.')
    return null
  }
}

export async function useSafePost<T = any>(
  url: string,
  body?: Record<string, any>,
  options: Omit<FetchOptions<'json'>, 'method' | 'body'> = {}
): Promise<T | null> {
  try {
    const result = await $fetch<ApiSuccessResponse<T> | ApiErrorResponse>(url, {
      method: 'POST',
      body,
      ...options
    })

    if ('error' in result) {
      logger.error('[useSafePost] API returned error:', result.error)
      $toast.error(result.error.message || 'An error occurred.')
      return null
    }

    return result.data ?? null
  } catch (err) {
    logger.error('[useSafePost] Exception:', err)
    $toast.error('Unexpected error occurred.')
    return null
  }
}

export async function useSafePut<T = any>(
  url: string,
  body?: Record<string, any>,
  options: Omit<FetchOptions<'json'>, 'method' | 'body'> = {}
): Promise<T | null> {
  try {
    const result = await $fetch<ApiSuccessResponse<T> | ApiErrorResponse>(url, {
      method: 'PUT',
      body,
      ...options
    })

    if ('error' in result) {
      logger.error('[useSafePut] API returned error:', result.error)
      $toast.error(result.error.message || 'An error occurred.')
      return null
    }

    return result.data ?? null
  } catch (err) {
    logger.error('[useSafePut] Exception:', err)
    $toast.error('Unexpected error occurred.')
    return null
  }
}

export async function useSafePatch<T = any>(
  url: string,
  body?: Record<string, any>,
  options: Omit<FetchOptions<'json'>, 'method' | 'body'> = {}
): Promise<T | null> {
  try {
    const result = await $fetch<ApiSuccessResponse<T> | ApiErrorResponse>(url, {
      method: 'PATCH',
      body,
      ...options
    })

    if ('error' in result) {
      logger.error('[useSafePatch] API returned error:', result.error)
      $toast.error(result.error.message || 'An error occurred.')
      return null
    }

    return result.data ?? null
  } catch (err) {
    logger.error('[useSafePatch] Exception:', err)
    $toast.error('Unexpected error occurred.')
    return null
  }
}

export async function useSafeDelete<T = any>(
  url: string,
  body?: Record<string, any>,
  options: Omit<FetchOptions<'json'>, 'method' | 'body'> = {}
): Promise<T | null> {
  try {
    const result = await $fetch<ApiSuccessResponse<T> | ApiErrorResponse>(url, {
      method: 'DELETE',
      body,
      ...options
    })

    if ('error' in result) {
      logger.error('[useSafeDelete] API returned error:', result.error)
      $toast.error(result.error.message || 'An error occurred.')
      return null
    }

    return result.data ?? null
  } catch (err) {
    logger.error('[useSafeDelete] Exception:', err)
    $toast.error('Unexpected error occurred.')
    return null
  }
}
