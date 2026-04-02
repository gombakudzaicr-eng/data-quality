
import api from './api'

export async function getEdaSummary(filename) {
  const response = await api.get(`/eda/${filename}`)
  return response.data
}