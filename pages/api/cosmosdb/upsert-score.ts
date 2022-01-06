// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { getContainer } from 'helpers/cosmosdb/api/getContainer'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const container = await getContainer()

  // upsert 1 item
  const { body } = req
  const { userHandle: id } = body
  const item = {
    id,
    ...body,
  }
  console.log('upsert-score', { item })
  const response = await container.items.upsert(item, {
    disableAutomaticIdGeneration: true,
  })
  const { requestCharge } = response
  console.log({ requestCharge })

  res.status(200).json({})
}
