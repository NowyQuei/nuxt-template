export const transformId = {
  transform: (doc, ret) => {
    const transformBufferToUUID = (value) => {
      if (value && value.type === 'Buffer') {
        const buffer = Buffer.from(value)
        return [
          buffer.toString('hex', 0, 4),
          buffer.toString('hex', 4, 6),
          buffer.toString('hex', 6, 8),
          buffer.toString('hex', 8, 10),
          buffer.toString('hex', 10, 16)
        ].join('-')
      }
      return value
    }

    if (ret._id) {
      ret.id = transformBufferToUUID(ret._id) // ✅ Rename `_id` to `id`
      delete ret._id // ✅ Remove `_id` from API responses
    }

    // ✅ Return a new object with `id` first, followed by other fields
    return {
      id: transformBufferToUUID(ret.id), // ✅ `id` appears first
      ...ret // ✅ Spread remaining properties in their original order
    }
  }
}
