import { Schema, model } from 'mongoose'

const credentialsSchema = new Schema(
  {
    ...baseSchemaOptions,
    user: { type: Schema.Types.UUID, required: true, ref: 'User' },
    credentialId: { type: String, required: true, unique: true },
    publicKey: { type: String, required: true },
    counter: { type: Number, default: 1 },
    backedUp: { type: Number, default: 0 },
    transports: { type: String, required: true },
    name: { type: String, required: true }
  },
  { timestamps: true }
)

applyTransformId(credentialsSchema)
addIdAliasHooks(credentialsSchema)

export const CredentialsSchema = model('Credentials', credentialsSchema)
export default CredentialsSchema
