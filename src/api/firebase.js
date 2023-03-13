import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { getDatabase, ref, get, set, remove } from "firebase/database";
import { v4 as uuid } from "uuid";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DB_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const provider = new GoogleAuthProvider();
const database = getDatabase(app);

// 외부에서 사용할 수 있도록 export 함수로 감싸기
export async function login() {
  signInWithPopup(auth, provider).catch(console.error); // (error) => { console.error() }
}

export async function logout() {
  signOut(auth).catch(console.error);
}

export function onUserStateChange(callback) {
  // 내부 함수가 비동기 함수이므로  비동기 callback으로 데이터 받기
  onAuthStateChanged(auth, async (user) => {
    // 1. 사용자가 있는 경우 (로그인한 경우)
    // 비동기 함수를 기다릴 것이므로 await
    const updatedUser = user ? await adminUser(user) : null;
    callback(updatedUser);
  });
}

// 네트워크 통신을 직접적으로 수행하는 것들은 전부 async
async function adminUser(user) {
  // 2. 사용자가 어드민 권한을 가지고 있는지 확인!
  // 3. {...user, isAdmin: true/false}
  // firebase에서 데이터를 받을때는 get
  return get(ref(database, "admins")) //
    .then((snapshot) => {
      if (snapshot.exists()) {
        const admins = snapshot.val();
        const isAdmin = admins.includes(user.uid);
        return { ...user, isAdmin }; // 전체 사용자 정보를 decompose하여 isAdmin 여부와 함께 리턴
      }
      return user;
    });
}

export async function addNewProduct(product, image) {
  // image = imageUrl
  const id = uuid();
  // firebase에서 이미지를 올릴대는 set
  return set(ref(database, `products/${id}`), {
    ...product,
    id,
    price: parseInt(product.price),
    image,
    options: product.options.split(","),
  });
}

export async function getProducts() {
  return get(ref(database, "products")).then((snapshot) => {
    if (snapshot.exists()) {
      return Object.values(snapshot.val()); // key-value에서 value만 가져올 목적
    }
    return [];
  });
}

// 장바구니 가져오기
export async function getCart(userId) {
  return get(ref(database, `carts/${userId}`)) //
    .then((snapshot) => {
      const items = snapshot.val() || {};
      return Object.values(items);
    });
}

// 장바구니 추가
export async function addOrUpdateToCart(userId, product) {
  return set(ref(database, `carts/${userId}/${product.id}`), product);
}

// 장바구니 삭제
export async function removeFromCart(userId, productId) {
  return remove(ref(database, `carts/${userId}/${productId}`));
}
