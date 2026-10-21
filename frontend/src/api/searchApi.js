import { getUserToken } from "../helper/getToken"

export async function search(data) {
  const token = getUserToken()
  if(!token) {
    throw new Error("JWT token not found. Please log in again.")
  }
  let response = await fetch('http://127.0.0.1:8000/search_section/search', {
    method: 'POST',
    headers: {
      'content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data)
  })

  let d = await response.json()
  if(!response.ok) {
    throw new Error(`Error: ${d.detail}`)
  }
  return d
}

export async function getFoundData() {
  const token = getUserToken()
  if(!token) {
    throw new Error("JWT token not found. Please log in again.")
  }
  let response = await fetch('http://127.0.0.1:8000/search_section/display_found_items', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  let data = await response.json()
  if(!response.ok) {
    throw new Error(`Error: ${data.detail}`)
  }
  return data
}

export async function getLostData() {
  const token = getUserToken()
  if(!token) {
    throw new Error("JWT token not found. Please log in again.")
  }
  let response = await fetch('http://127.0.0.1:8000/search_section/display_lost_items', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  let data = await response.json()
  if(!response.ok) {
    throw new Error(`Error: ${data.detail}`)
  }
  return data
}
