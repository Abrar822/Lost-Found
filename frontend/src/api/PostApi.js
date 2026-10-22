import { getUserToken } from "../helper/getToken";

export async function postLost(formData) {
  let token = getUserToken();
  if (!token) {
    throw new Error("JWT token not found. Please log in again.");
  }
  let response = await fetch("http://127.0.0.1:8000/post_lost", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  let result = await response.json();
  if (!response.ok) {
    throw new Error(`${result.detail}`);
  }
  return result;
}

export async function postFound(formData) {
  let token = getUserToken();
  if (!token) {
    throw new Error("JWT token not found. Please log in again.");
  }
  let response = await fetch("http://127.0.0.1:8000/post_found", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  let result = await response.json();
  if (!response.ok) {
    throw new Error(`${result.detail}`);
  }
  return result;
}
