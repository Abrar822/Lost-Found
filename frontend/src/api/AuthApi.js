export function userSignup(user) {
  return fetch("http://127.0.0.1:8000/user_signup", {
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
  })
    .then(async (res) => {
      let data = await res.json();
      if (!res.ok) {
        throw new Error(`${data.detail}`);
      }
      return data;
    })
}

export function adminSignup(admin) {
  return fetch("http://127.0.0.1:8000/admin_signup", {
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
  })
    .then(async (res) => {
      let data = await res.json();
      if (!res.ok) {
        throw new Error(`${data.detail}`);
      }
      return data;
    })
}

export function userLogin(user) {
  return fetch("http://127.0.0.1:8000/user_login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: user.email,
      password: user.password,
    }),
  })
    .then(async (res) => {
      let data = await res.json();
      if (!res.ok) {
        throw new Error(`${data.detail}`);
      }
      return data
    })
}

export function adminLogin(user) {
  return fetch("http://127.0.0.1:8000/admin_login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: user.email,
      password: user.password,
    }),
  })
    .then(async (res) => {
      let data = await res.json();
      if (!res.ok) {
        throw new Error(`${data.detail}`);
      }
      return data;
    })
}
