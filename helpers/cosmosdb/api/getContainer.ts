import { COSMOS_CONFIG } from './constants'
import { getDatabase } from './getDatabase'

export async function getContainer() {
  const { containerId } = COSMOS_CONFIG

  // ensuring a container exists for us to work with
  const database = await getDatabase()
  const { container } = await database.containers.createIfNotExists({
    id: containerId,
  })

  return container
}
