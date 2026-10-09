import "./style.css";

const pathEl = document.getElementById("notfound-path");
const errorEl = document.getElementById("notfound-error");

const pathname = window.location.pathname;

if (pathEl) {
  pathEl.textContent = pathname;
}

if (errorEl) {
  errorEl.textContent = `bash: cd: ${pathname}: No such file or directory`;
}
