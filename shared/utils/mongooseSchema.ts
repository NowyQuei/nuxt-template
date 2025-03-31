import { Schema } from 'mongoose'
import { v4 as uuidv4 } from 'uuid'

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
