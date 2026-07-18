import { login } from "./auth.js";

const loginBtn = document.getElementById("loginBtn");

if (loginBtn) {
  loginBtn.addEventListener("click", async () => {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    if (!email || !password) {
      alert("يرجى إدخال البريد الإلكتروني وكلمة المرور.");
      return;
    }

    try {
       const userCredential = await login(email, password);

const user = userCredential.user;

alert("تم تسجيل الدخول بنجاح.");

window.location.href = "admin.html";

    } catch (error) {

      alert("فشل تسجيل الدخول: " + error.message);

    }
  });
}