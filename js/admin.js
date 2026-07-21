import { auth, db } from "./firebase.js";

import {
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";

import {
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

// ===============================
// حماية لوحة التحكم (الأدمن فقط)
// ===============================

const ADMIN_EMAIL = "lym050244@gmail.com";

onAuthStateChanged(auth, async (user) => {

  if (!user) {
    window.location.href = "login.html";
    return;
  }

  if (user.email !== ADMIN_EMAIL) {
    alert("❌ ليس لديك صلاحية للدخول إلى لوحة التحكم");
    await signOut(auth);
    window.location.href = "login.html";
    return;
  }

});

// ===============================
// تسجيل الخروج
// ===============================

const logoutBtn = document.getElementById("logoutBtn");

logoutBtn.addEventListener("click", async () => {

  await signOut(auth);

  window.location.href = "login.html";

});

// ===============================
// عناصر الصفحة
// ===============================

const uploadBtn = document.getElementById("uploadBtn");

const titleInput = document.getElementById("title");

const categorySelect = document.getElementById("category");

const typeSelect = document.getElementById("type");

const fileUrlInput = document.getElementById("fileUrl");

// ===============================
// حفظ الملف
// ===============================

uploadBtn.addEventListener("click", async () => {

  const title = titleInput.value.trim();

  const category = categorySelect.value;

  const type = typeSelect.value;

  const fileUrl = fileUrlInput.value.trim();

  if (!title) {

    alert("اكتب اسم الملف");

    return;

  }

  if (!fileUrl) {

    alert("الصق رابط ملف PDF");

    return;

  }

  try {

    uploadBtn.disabled = true;

    uploadBtn.textContent = "جارٍ الحفظ...";

    await addDoc(collection(db, "notes"), {

      title: title,

      category: category,

      type: type,

      fileUrl: fileUrl,

      createdAt: serverTimestamp()

    });

    alert("✅ تم حفظ الملف بنجاح");

    titleInput.value = "";

    categorySelect.selectedIndex = 0;

    typeSelect.selectedIndex = 0;

    fileUrlInput.value = "";

  } catch (error) {

    console.error(error);

    alert("❌ " + error.message);

  } finally {

    uploadBtn.disabled = false;

    uploadBtn.textContent = "💾 حفظ الملف";

  }

});
