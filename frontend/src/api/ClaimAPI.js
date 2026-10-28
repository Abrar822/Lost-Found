import { getUserToken } from "../helper/getToken";

export async function claimRequest(input) {
console.log(input)
  let token = getUserToken();
  if (!token) {
    throw new Error("JWT token not found. Please log in again.");
  }
  let response = await fetch("http://127.0.0.1:8000/claim/request", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  let result = await response.json();
  if (!response.ok) {
    throw new Error(`${result.detail}`);
  }
  return result;
}