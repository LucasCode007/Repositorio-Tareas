const USUARIO = JSON.parse(localStorage.getItem("usuario"));

if (!USUARIO) {
  window.location.href = "./login.html";
}
function cerrarSesion() {
  localStorage.removeItem("usuario");
  window.location.href = "./login.html";
}