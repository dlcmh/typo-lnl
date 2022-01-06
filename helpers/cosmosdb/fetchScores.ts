export const fetchScores = async () => {
  const response = await fetch('./api/cosmosdb/fetch-scores', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  const data = await response.json()
  return data
}
