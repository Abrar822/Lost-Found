import { getUserToken } from "../helper/getToken";

export function getUserDetails() {
    const token = getUserToken()
    if (!token) {
        throw new Error("JWT token not found. Please log in again.");
    }
    return fetch("http://127.0.0.1:8000/user",{
        headers:{
            Authorization: `Bearer ${token}`,
        }
    }
    )
        .then(async (res) => {
            let data = await res.json();
            if (!res.ok) {
                throw new Error(`${data.detail}`);
            }
            return data;
        })
}

export async function updateUserDetails(userData) {
  const token = getToken();

  if (!token) {
    throw new Error("JWT token not found. Please log in again.");
  }

  const res = await fetch("http://127.0.0.1:8000/user/edit", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      name: userData.name,
      phone_number: userData.phone_number,
      email: userData.email,
      code:userData.code
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.detail || "Failed to update profile");
  }

  return data;
}
