import { auth, db } from "./firebase.js";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";

import {
  doc,
  setDoc
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";


// إنشاء حساب جديد
export async function register(email, password) {

  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );

  const user = userCredential.user;

  await setDoc(doc(db, "users", user.uid), {
    email: user.email,
    createdAt: new Date()
  });

  return userCredential;
}


// تسجيل الدخول
export async function login(email, password) {
  return await signInWithEmailAndPassword(auth, email, password);
}


// تسجيل الخروج
export async function logout() {
  return await signOut(auth);
}


// التحقق من المستخدم الحالي
export function checkAuth(callback) {
  onAuthStateChanged(auth, (user) => {
    callback(user);
  });
}