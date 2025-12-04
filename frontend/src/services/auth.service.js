export function isAuthenticated() {
  const current = sessionStorage.getItem("currentLogin");
  const section = sessionStorage.getItem(current + "Section");
  const token = section ? JSON.parse(section).token : null;
  return !!token && !!current;
}

export function getCurrentRole() {
  const current = sessionStorage.getItem("currentLogin");
  const section = sessionStorage.getItem(current + "Section");
  return section ? JSON.parse(section).role : null;
}
