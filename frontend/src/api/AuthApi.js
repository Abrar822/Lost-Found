import { API_URL } from "../config";

export function generateOtp(email) {
  return fetch(`${API_URL}/generate_otp`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: email,
    }),
  }).then(async (res) => {
    let data = await res.json();
    if (!res.ok) {
      throw new Error(`${data.detail}`);
    }
    return data;
  });
}

export function userSignup(user) {
  return fetch(`${API_URL}/user_signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: user.name,
      phone_number: user.phone_number,
      email: user.email,
      code: user.code,
      password: user.password,
      otp: user.otp,
    }),
  }).then(async (res) => {
    let data = await res.json();
    if (!res.ok) {
      throw new Error(`${data.detail}`);
    }
    return data;
  });
}

export function adminSignup(admin) {
  return fetch(`${API_URL}/admin_signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      organization_name: admin.organization_name,
      email: admin.email,
      code: admin.code,
      password: admin.password,
    }),
  }).then(async (res) => {
    let data = await res.json();
    if (!res.ok) {
      throw new Error(`${data.detail}`);
    }
    return data;
  });
}

export function userLogin(user) {
  console.log('user login: ', API_URL)
  return fetch(`${API_URL}/user_login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: user.email,
      password: user.password,
    }),
  }).then(async (res) => {
    let data = await res.json();
    if (!res.ok) {
      throw new Error(`${data.detail}`);
    }
    return data;
  });
}

export function adminLogin(user) {
  return fetch(`${API_URL}/admin_login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: user.email,
      password: user.password,
    }),
  }).then(async (res) => {
    let data = await res.json();
    if (!res.ok) {
      throw new Error(`${data.detail}`);
    }
    return data;
  });
}

export function updatePassword(data) {
  return fetch(`${API_URL}/user_login/reset_password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  }).then(async (res) => {
    let data = await res.json();
    if (!res.ok) {
      throw new Error(`${data.detail}`);
    }
    return data;
  });
}
