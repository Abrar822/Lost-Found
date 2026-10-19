import { getAdminToken } from "../helper/getToken";

export async function getOrganizationDetails() {
    const token = getAdminToken()
    if (!token) {
        throw new Error("JWT token not found. Please log in again.");
    }
    return fetch("http://127.0.0.1:8000/organization_details", {
        headers: {
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

export async function getUsers() {
    const token = getAdminToken()
    if (!token) {
        throw new Error("JWT token not found. Please log in again.");
    }
    return fetch("http://127.0.0.1:8000/get_users", {
        headers: {
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

export async function deleteUser(u_id) {
    const token = getAdminToken()
    if (!token) {
        throw new Error("JWT token not found. Please log in again.");
    }
    return fetch(`http://127.0.0.1:8000/delete_user/${u_id}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
        }
    }
    )
        .then(async (res) => {
            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(`${data.detail}`);
            }
            return true;
        })
}

export async function updateOrganization(info) {
    const token = getAdminToken()
    if (!token) {
        throw new Error("JWT token not found. Please log in again.");
    }
    return fetch("http://127.0.0.1:8000/update_organization", {
        method: "PUT",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(info)
    }
    )
        .then(async (res) => {
            let data = await res.json();
            console.log(data)
            if (!res.ok) {
                throw new Error(`${data.detail}`);
            }
            return data;
        })
}