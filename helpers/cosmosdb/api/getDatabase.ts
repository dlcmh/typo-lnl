import { COSMOS_CONFIG } from './constants'
import { cosmosClient } from './cosmosClient'

export async function getDatabase() {
  const { databaseId } = COSMOS_CONFIG

  // ensuring a database exists for us to work with
  const { database } = await cosmosClient.databases.createIfNotExists({
    id: databaseId,
  })

  return database
}
