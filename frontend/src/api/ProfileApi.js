import getToken from "../helper/getToken"

export function getUserDetails() {
    const token = getToken()
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
