export default function getToken() {
  const cookies = document.cookie.split("; ");

  const cookie = cookies.find((row) => row.startsWith("user_jwt="));

  return cookie ? cookie.split("=")[1] : null;
}
