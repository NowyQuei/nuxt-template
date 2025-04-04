import { Schema } from 'mongoose'
import { v4 as uuidv4 } from 'uuid'

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

// Common schema options
export const baseSchemaOptions = {
  _id: { type: Schema.Types.UUID, default: uuidv4, immutable: true }
}

// Applies transformId to JSON/Object
export function applyTransformId(schema: Schema) {
  schema.set('toJSON', transformId)
  schema.set('toObject', transformId)
}

// Adds pre-hooks for `id -> _id` mapping
export function addIdAliasHooks(schema: Schema) {
  const hookMethods = [
    'findOne',
    'findOneAndUpdate',
    'findOneAndDelete',
    'findOneAndReplace',
    'findOneAndRemove',
    'findByIdAndUpdate',
    'findById',
    'updateOne',
    'updateMany',
    'deleteOne',
    'deleteMany',
    'replaceOne',
    'find',
    'countDocuments',
    'exists'
  ]

  schema.pre(hookMethods, function (next) {
    if (this.getQuery().id) {
      this.setQuery({ _id: this.getQuery().id })
      delete this.getQuery().id
    }
    next()
  })
}
