import { Schema, model } from 'mongoose'
import { v4 as uuidv4 } from 'uuid'

const credentialsSchema = new Schema(
  {
    _id: { type: Schema.Types.UUID, default: uuidv4, immutable: true },
    userId: { type: Schema.Types.UUID, required: true, ref: 'User' },
    publicKey: { type: String, required: true },
    counter: { type: Number, default: 1 },
    backedUp: { type: Number, default: 0 },
    transports: { type: String, required: true },
    name: { type: String, required: true }
  },
  {
    timestamps: true
  }
)

// Convert `_id` to `id` in responses
credentialsSchema.set('toJSON', transformId)
credentialsSchema.set('toObject', transformId)

credentialsSchema.pre(
  [
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
  ],
  function (next) {
    if (this.getQuery().id) {
      this.setQuery({ _id: this.getQuery().id })
      delete this.getQuery().id
    }
    next()
  }
)

export const CredentialsSchema = model('Credentials', credentialsSchema)
export default CredentialsSchema
