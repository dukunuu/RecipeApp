<template>
  <div class="form-container">
    <form @submit.prevent="handleSubmit">
      <h3>Username</h3>
      <div class="user-container">
        <img
          class="userIcon"
          src="/src/assets/Icons/user-svgrepo-com.svg"
          alt="User Icon"
        />
        <input
          type="text"
          placeholder="Type in your username"
          v-model="username"
        />
      </div>
      <h3>Email</h3>
      <div class="email-container">
        <img
          class="emailIcon"
          src="/src/assets/Icons/email-svgrepo-com.svg"
          alt="email Icon"
        />
        <input
          type="email"
          placeholder="Type in your email"
          v-model="email"
          required
        />
      </div>
      <h3>Password</h3>
      <div class="password-container">
        <img
          class="passwordIcon"
          src="/src/assets/Icons/password-2-svgrepo-com.svg"
          alt="Password Icon"
        />
        <input
          :type="passwordView"
          placeholder="Type in your password"
          v-model="password"
          required
        />
        <i
          class="fa-regular"
          :class="[isShut ? 'fa-eye' : 'fa-eye-slash']"
          id="showPassword"
          @click="changePasswordField"
        ></i>
      </div>
      <h3>Confirm Password</h3>
      <div class="password-container">
        <img
          class="passwordIcon"
          src="/src/assets/Icons/password-2-svgrepo-com.svg"
          alt="Password Icon"
        />
        <input
          :type="passwordView"
          placeholder="Type in your password"
          v-model="confirmPassword"
        />
        <i
          class="fa-regular"
          :class="[isShut ? 'fa-eye' : 'fa-eye-slash']"
          id="showPassword"
          @click="changePasswordField"
        ></i>
      </div>
      <div v-show="error" class="error">{{ this.errorMsg }}</div>
      <button @click.prevent="register">Sign Up</button>
    </form>
    <p>Or Sign Up Using</p>
    <div class="signup-options">
      <i class="fa-brands fa-facebook" @click="signInWithFacebook"></i>
      <i class="fa-brands fa-google" @click="signInWithGoogle"></i>
    </div>
  </div>
</template>

<script>
import { db } from "../firebase/index";
import { auth } from "../firebase/index";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import {
  GoogleAuthProvider,
  signInWithPopup,
  FacebookAuthProvider,
} from "firebase/auth";
export default {
  name: "SignUp",
  components: {},
  data() {
    return {
      passwordView: "password",
      isShut: false,
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      error: null,
      errorMsg: "",
    };
  },
  methods: {
    closeRegister() {
      this.$emit("closeRegister");
    },
    changePasswordField() {
      if (this.passwordView === "password") {
        this.passwordView = "text";
        this.isShut = !this.isShut;
        return;
      } else {
        this.passwordView = "password";
        this.isShut = !this.isShut;
        return;
      }
    },
    async register() {
      if (
        this.email !== "" &&
        this.username !== "" &&
        this.password !== "" &&
        this.confirmPassword !== ""
      ) {
        if (this.password !== this.confirmPassword) {
          this.error = true;
          this.errorMsg = "Passwords do not match!";
          return;
        }
        this.error = false;
        this.errorMsg = "";
        await createUserWithEmailAndPassword(auth, this.email, this.password)
          .then((userCredential) => {
            this.error = false;
            this.errorMsg = "";
            const user = userCredential.user;
            const uid = user.uid;
            setDoc(doc(db, "users", uid), {
              firstName: "",
              lastName: "",
              username: this.username,
              email: this.email,
              photoURL: "",
              phoneNumber: "",
            });
            this.closeRegister();
            this.$router.push({ name: "Home" });
            return;
          })
          .catch((error) => {
            this.error = true;
            this.errorMsg = error.message;
            console.error(error);
            return;
          });
        return;
      }
      this.error = true;
      this.errorMsg = "Please fill out all the fields!";
      return;
    },
    async signInWithGoogle() {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider)
        .then((result) => {
          this.error = false;
          this.errorMsg = "";
          const user = result.user;
          const uid = user.uid;
          setDoc(doc(db, "users", uid), {
            firstName: "",
            lastName: "",
            username: user.displayName,
            email: user.email,
            photoURL: user.photoURL,
            phoneNumber: user.phoneNumber,
          });
          this.closeRegister();
          this.$router.push({ name: "Home" });
        })
        .catch((error) => {
          this.error = true;
          this.errorMsg = error.message;
          return;
        });
    },
    async signInWithFacebook() {
      const provider = new FacebookAuthProvider();
      await signInWithPopup(auth, provider)
        .then((result) => {
          this.error = false;
          this.errorMsg = "";
          const user = result.user;
          const uid = user.uid;
          setDoc(doc(db, "users", uid), {
            firstName: "",
            lastName: "",
            username: user.displayName,
            email: user.email,
            photoURL: user.photoURL,
            phoneNumber: user.phoneNumber,
          });
          this.closeRegister();
          this.$router.push({ name: "Home" });
        })
        .catch((error) => {
          this.error = true;
          this.errorMsg = error.message;
          return;
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.form-container {
  flex-direction: column;
}
.user-container {
  position: relative;
  .userIcon {
    height: 18px;
    position: absolute;
    top: 16px;
    left: 6px;
    opacity: 0.8;
  }
}
input {
  width: 100%;
}

button {
  height: 40px;
  width: 70%;
}
</style>
