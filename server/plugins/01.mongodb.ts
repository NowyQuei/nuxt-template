import mongoose from 'mongoose'
import type { Nitro } from 'nitropack'

export default async (_nitroapp: Nitro) => {
  const config = useRuntimeConfig()
  const mongoUri = config.mongodbUri

  mongoose
    .connect(mongoUri)
    .then(() => {
      logger.info('Mongo DB connected')
    })
    .catch((e) => {
      logger.error(e)
    })
}
