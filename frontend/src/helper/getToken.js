export default function getToken() {
  // const cookies = document.cookie.split("; ");

  // const cookie = cookies.find(row => row.startsWith("user_jwt="));

  // return cookie ? cookie.split("=")[1] : null;

  const token = document.cookie
    .split(";")
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith("user_jwt="))
    ?.substring("user_jwt=".length);
    return token
};
