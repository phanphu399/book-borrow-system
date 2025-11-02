export function isAuthenticated() {
  return !!localStorage.getItem("authenticateToken");
}
