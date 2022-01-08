// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { getContainer } from 'helpers/cosmosdb/api/getContainer'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const container = await getContainer()

  /**
   * Query the container using SQL
   */
  const querySpec = {
    // query: 'SELECT c.id, c.userHandle, c.completed from c',
    query: 'SELECT * from c order by c.averageWpm DESC',
  }

  const response = await container.items.query(querySpec).fetchAll()
  const { requestCharge, resources: results } = response
  console.log({ requestCharge })

  res.status(200).json(results)
}
