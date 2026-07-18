import { auth, db } from "./firebase.js";

import {
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";

import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";


// حماية لوحة التحكم
onAuthStateChanged(auth, (user) => {

  if (!user) {
    window.location.href = "login.html";
  }

});


// تسجيل الخروج
const logoutBtn = document.getElementById("logoutBtn");

logoutBtn.addEventListener("click", async () => {

  await signOut(auth);

  window.location.href = "login.html";

});


// العناصر
const uploadBtn = document.getElementById("uploadBtn");

const titleInput = document.getElementById("title");

const categorySelect = document.getElementById("category");

const typeSelect = document.getElementById("type");

const fileUrlInput = document.getElementById("fileUrl");

const fileList = document.getElementById("fileList");



// عرض الملفات
async function loadFiles(){

  fileList.innerHTML = "";

  const querySnapshot = await getDocs(collection(db,"notes"));


  querySnapshot.forEach((item)=>{


    const data = item.data();


    fileList.innerHTML += `

    <div class="file-item">

      <h4>${data.title}</h4>

      <p>
      ${data.category} - ${data.type}
      </p>


      <a href="${data.fileUrl}" target="_blank">
      📄 فتح الملف
      </a>


      <button 
      class="delete-btn"
      data-id="${item.id}">
      
      🗑️ حذف

      </button>


    </div>

    `;


  });


  document.querySelectorAll(".delete-btn")
  .forEach(button=>{


    button.addEventListener("click", async()=>{


      const id = button.dataset.id;


      if(confirm("هل تريد حذف هذا الملف؟")){


        await deleteDoc(doc(db,"notes",id));


        alert("تم حذف الملف");


        loadFiles();


      }


    });


  });


}



// حفظ الملف

uploadBtn.addEventListener("click", async()=>{


const title = titleInput.value.trim();

const category = categorySelect.value;

const type = typeSelect.value;

const fileUrl = fileUrlInput.value.trim();



if(!title){

alert("اكتب اسم الملف");

return;

}


if(!fileUrl){

alert("الصق رابط PDF");

return;

}



try{


uploadBtn.disabled=true;

uploadBtn.textContent="جارٍ الحفظ...";



await addDoc(collection(db,"notes"),{


title,

category,

type,

fileUrl,

createdAt:serverTimestamp()


});



alert("✅ تم حفظ الملف بنجاح");



titleInput.value="";

fileUrlInput.value="";



loadFiles();



}

catch(error){

alert(error.message);

}


finally{


uploadBtn.disabled=false;

uploadBtn.textContent="💾 حفظ الملف";


}



});


// تشغيل عرض الملفات عند فتح الصفحة

loadFiles();
