
import api from './api'

export async function getQuality(filename) {
  const res = await api.get(`/quality/${filename}`)
  return res.data
}