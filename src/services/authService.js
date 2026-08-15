import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth } from "../firebase/config";

export function loginWithEmail(email, password) {
  return signInWithEmailAndPassword(auth, email.trim(), password);
}

export function logout() {
  return signOut(auth);
}

export function subscribeToAuth(callback) {
  return onAuthStateChanged(auth, callback);
}
