import { auth, db } from "./firebase.js";

import {
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";

import {
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
  deleteDoc,
  doc,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";


// حماية لوحة التحكم
onAuthStateChanged(auth, (user) => {

  if (!user) {

    window.location.href = "login.html";

  }

});


// تسجيل الخروج
const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {

logoutBtn.addEventListener("click", async () => {

  await signOut(auth);

  window.location.href = "login.html";

});

}


// العناصر
const uploadBtn = document.getElementById("uploadBtn");

const titleInput = document.getElementById("title");

const categorySelect = document.getElementById("category");

const typeSelect = document.getElementById("type");

const fileUrlInput = document.getElementById("fileUrl");

const fileList = document.getElementById("fileList");



// إضافة ملف
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

    fileUrlInput.value = "";



    loadFiles();



  } catch(error) {


    alert("❌ " + error.message);


  } finally {


    uploadBtn.disabled = false;

    uploadBtn.textContent = "💾 حفظ الملف";


  }


});




// عرض الملفات
async function loadFiles(){


  if(!fileList) return;


  fileList.innerHTML = "جارٍ تحميل الملفات...";


  try{


    const q = query(
      collection(db,"notes"),
      orderBy("createdAt","desc")
    );


    const snapshot = await getDocs(q);



    fileList.innerHTML = "";



    snapshot.forEach((item)=>{


      const data = item.data();



      const div = document.createElement("div");


      div.className = "file-item";



      div.innerHTML = `

      <h4>${data.title}</h4>

      <p>
      ${data.category}
      - 
      ${data.type}
      </p>


      <a href="${data.fileUrl}" target="_blank">
      📖 فتح الملف
      </a>


      <button class="delete-btn">
      🗑️ حذف
      </button>

      `;



      const deleteBtn = div.querySelector(".delete-btn");



      deleteBtn.addEventListener("click", async()=>{


        const confirmDelete = confirm(
          "هل تريد حذف هذا الملف؟"
        );


        if(!confirmDelete) return;



        await deleteDoc(
          doc(db,"notes",item.id)
        );



        alert("✅ تم الحذف");


        loadFiles();


      });



      fileList.appendChild(div);



    });



  }catch(error){


    fileList.innerHTML =
    "حدث خطأ: " + error.message;


  }


}



// تشغيل عرض الملفات عند فتح الصفحة
loadFiles();
