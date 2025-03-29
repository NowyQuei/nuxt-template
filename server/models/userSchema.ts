import { Schema, model } from 'mongoose'
import { v4 as uuidv4 } from 'uuid'

const userSchema = new Schema(
  {
    _id: { type: Schema.Types.UUID, default: uuidv4, immutable: true },
    username: { type: String, unique: true },
    firstName: String,
    lastName: String,
    email: { type: String, unique: true },
    birthday: Date,
    password: String,
    role: String,
    isActive: Boolean,
    profileImage: String
  },
  {
    timestamps: true
  }
)

// Convert `_id` to `id` in responses
userSchema.set('toJSON', transformId)
userSchema.set('toObject', transformId)

userSchema.pre(
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

export const UserSchema = model('User', userSchema)
export default UserSchema
