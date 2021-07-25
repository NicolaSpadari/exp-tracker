import { watch, reactive } from "vue";
import firebase from "firebase/app";
import "firebase/auth";
import fb from "@/firebase.config";

const db = fb.firestore();

export const store = reactive({
    userName: null,
    signedIn: false,
    userPicture: null,
    userId: null,
    order: "date",
    products: [],
});

if (localStorage.getItem("credentials") !== null) {
    const credentials = JSON.parse(localStorage.getItem("credentials"));

    store.userName = credentials.userName;
    store.signedIn = credentials.signedIn;
    store.userId = credentials.userId;
    store.userPicture = credentials.userPicture;
    store.order = credentials.order;
}

watch(
    () => store.order,
    (newVal, oldVal) => {
        if (newVal != oldVal) {
            localStorage.setItem("credentials", JSON.stringify(store));
        }
    }
);

export const login = () => {
    let provider = new firebase.auth.GoogleAuthProvider();

    firebase
        .auth()
        .signInWithPopup(provider)
        .then((res) => {
            console.log("user signed in: ", res);

            store.signedIn = true;
            store.userName = res.user.displayName;
            store.userPicture = res.user.photoURL;
            store.userId = res.additionalUserInfo.profile.id;

            localStorage.setItem("credentials", JSON.stringify(store));
        })
        .catch((err) => {
            console.error("err logging user: ", err);
        });
};

export const logout = () => {
    firebase
        .auth()
        .signOut()
        .then(() => {
            console.log("user signed out");

            store.signedIn = false;

            localStorage.removeItem("credentials");
        });
};

export const getProducts = () => {
    store.products = [];

    db.collection("products_" + store.userId)
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                console.log("pushing to store products");
                store.products.push({
                    id: doc.id,
                    name: doc.data().name,
                    date: doc.data().expirationDate.toDate(),
                    picture: doc.data().picture,
                    quantity: doc.data().quantity,
                });
            });
        });
};

getProducts();
