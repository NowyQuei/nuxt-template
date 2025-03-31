import { Schema, model } from 'mongoose'

const userSchema = new Schema(
  {
    ...baseSchemaOptions,
    username: { type: String, unique: true },
    firstName: String,
    lastName: String,
    email: { type: String, unique: true },
    birthday: Date,
    password: String,
    credentials: [{ type: Schema.Types.UUID, ref: 'Credentials' }],
    role: String,
    isActive: Boolean,
    profileImage: String
  },
  { timestamps: true }
)

applyTransformId(userSchema)
addIdAliasHooks(userSchema)

export const UserSchema = model('User', userSchema)
export default UserSchema
