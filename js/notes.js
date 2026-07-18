import { db } from "./firebase.js";

import {
  collection,
  getDocs,
  query,
  where,
  orderBy
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";


// قراءة اسم المادة من الرابط
const params = new URLSearchParams(window.location.search);

const category = params.get("category");


// عناصر الصفحة
const pageTitle = document.getElementById("pageTitle");
const subjectTitle = document.getElementById("subjectTitle");
const notesContainer = document.getElementById("notesContainer");


// إذا لم يتم إرسال المادة
if (!category) {

  pageTitle.textContent = "المادة غير موجودة";

  subjectTitle.textContent = "لم يتم تحديد المادة";

  notesContainer.innerHTML = `
    <p style="text-align:center">
      لم يتم تحديد المادة.
    </p>
  `;

  throw new Error("Category Missing");

}


// تغيير عنوان الصفحة
pageTitle.textContent = category;

subjectTitle.textContent = category;


// تحميل الملفات
async function loadNotes() {

  notesContainer.innerHTML = `
    <p style="text-align:center">
      جارٍ تحميل الملفات...
    </p>
  `;

  try {

    const q = query(
  collection(db, "notes"),
  where("category", "==", category)
);

const snapshot = await getDocs(q);


    if (snapshot.empty) {

      notesContainer.innerHTML = `
        <p style="text-align:center">
          لا توجد ملفات لهذه المادة.
        </p>
      `;

      return;

    }


    notesContainer.innerHTML = "";

    snapshot.forEach((doc) => {

      const note = doc.data();
            const card = document.createElement("div");

      card.className = "card";

      card.innerHTML = `

        <div class="card">

          <div class="card-icon">

            ${note.type === "محاضرات" ? "🎓" : "📘"}

          </div>

          <div class="card-info">

            <span class="card-badge">

              ${note.type}

            </span>

            <h3>

              ${note.title}

            </h3>

            <p>

              ${note.category}

            </p>

            <div class="buttons">

              <a
                href="${note.fileUrl}"
                target="_blank"
                class="primary-btn">

                📖 قراءة

              </a>

              <a
                href="${note.fileUrl}"
                download
                class="secondary-btn">

                ⬇ تحميل

              </a>

            </div>

          </div>

        </div>

      `;

      notesContainer.appendChild(card);

    });

  } catch (error) {

    console.error(error);

    notesContainer.innerHTML = `

      <p style="text-align:center">

        حدث خطأ أثناء تحميل الملفات.

      </p>

    `;

  }

}
// تشغيل تحميل الملفات
loadNotes();