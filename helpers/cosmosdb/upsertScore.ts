const dummy = {
  userHandle: 'kellie',
  completed: '1:40',
  averageWpm: 40,
}

export const upsertScore = async (data = dummy) => {
  fetch('./api/cosmosdb/upsert-score', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
}
