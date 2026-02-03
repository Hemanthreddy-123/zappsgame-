import { httpJson } from './http.js'

<<<<<<< HEAD
export async function startGame({ token, level }) {
  return await httpJson('/api/game/start', {
    method: 'POST',
    token,
    body: { level }
  })
}

export async function submitGame({ token, roundId, synonyms, antonyms, timeTaken, reason, level }) {
=======
export async function startGame({ token }) {
  return await httpJson('/api/game/start', {
    method: 'POST',
    token,
  })
}

export async function submitGame({ token, roundId, synonyms, antonyms, timeTaken, reason }) {
>>>>>>> c4aab529800c7f6d987e53657184410f45f54862
  return await httpJson('/api/game/submit', {
    method: 'POST',
    token,
    body: {
      roundId,
      synonyms,
      antonyms,
      timeTaken,
<<<<<<< HEAD
      reason,
      level,
=======
      reason,  // Add this line
>>>>>>> c4aab529800c7f6d987e53657184410f45f54862
    },
  })
}

export async function getGameScore({ token }) {
  return await httpJson('/api/game/score', {
    method: 'GET',
    token,
  })
}

<<<<<<< HEAD
export async function getLeaderboard({ token, period }) {
  let url = '/api/leaderboard';
  if (period) {
    url += `?period=${encodeURIComponent(period)}`;
  }
  return await httpJson(url, {
=======
export async function getLeaderboard({ token }) {
  return await httpJson('/api/leaderboard', {
>>>>>>> c4aab529800c7f6d987e53657184410f45f54862
    method: 'GET',
    token,
  })
}
