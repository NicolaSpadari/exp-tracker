import { reactive } from "vue";
import firebase from "firebase/app";
import "firebase/auth";

export const store = reactive({
    userName: null,
    signedIn: false,
    userPicture: null,
    userId: null,
});

if (localStorage.getItem("credentials") !== null) {
    const credentials = JSON.parse(localStorage.getItem("credentials"));

    store.userName = credentials.userName;
    store.signedIn = credentials.signedIn;
    store.userId = credentials.userId;
    store.userPicture = credentials.userPicture;
}

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
