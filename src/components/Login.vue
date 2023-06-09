<template>
  <div class="form-container">
    <form>
      <h3>Email</h3>
      <div class="email-container">
        <img
          class="emailIcon"
          src="/src/assets/Icons/email-svgrepo-com.svg"
          alt="email Icon"
        />

        <input type="email" placeholder="Type in your email" v-model="email" />
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
          @change="updatePassthroughEmail"
        />
        <i
          class="fa-regular"
          :class="[isShut ? 'fa-eye' : 'fa-eye-slash']"
          id="showPassword"
          @click="changePasswordField"
        ></i>
      </div>
      <div class="forgot-Password">
        <router-link
          to="/resetPassword"
          @click="closeRegister(), updatePassthroughEmail()"
        >
          <div class="forgot">Forgot your Password?</div>
        </router-link>
      </div>
      <div class="error-container">
        <div v-show="error" class="error">{{ this.errorMsg }}</div>
      </div>
      <button @click.prevent="login">Log In</button>
    </form>
    <p>Or Log In Using</p>
    <div class="signup-options">
      <i class="fa-brands fa-facebook" @click="signInWithFacebook"></i>
      <i class="fa-brands fa-google" @click="signInWithGoogle"></i>
    </div>
  </div>
</template>

<script>
import { db } from "../firebase/index";
import { auth } from "../firebase/index";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import {
  GoogleAuthProvider,
  signInWithPopup,
  FacebookAuthProvider,
} from "firebase/auth";
export default {
  name: "Login",
  components: {},
  data() {
    return {
      passwordView: "password",
      isShut: false,
      error: null,
      errorMsg: "",
      email: "",
      password: "",
    };
  },
  methods: {
    login() {
      if (this.email !== "" && this.password !== "") {
        this.error = false;
        this.errorMsg = "";

        signInWithEmailAndPassword(auth, this.email, this.password)
          .then((userCredential) => {
            this.$router.push({ name: "Home" });
            this.closeRegister();
            this.error = false;
            this.errorMsg = "";
            const currentUser = userCredential.user;
            console.log(currentUser.uid);
          })
          .catch((error) => {
            if (
              error.code === "auth/account-exists-with-different-credential"
            ) {
              const existingProvider = new GoogleAuthProvider();

              signInWithPopup(auth, existingProvider)
                .then((result) => {
                  const user = result.user;
                  const credential = GoogleAuthProvider.credential(
                    result.credential
                  );
                  return linkWithCredential(user, credential);
                })
                .then(() => {
                  this.$router.push({ name: "Home" });
                  this.closeRegister();
                  this.error = false;
                  this.errorMsg = "";
                })
                .catch((error) => {
                  this.error = true;
                  this.errorMsg = error.message;
                });
            } else {
              this.error = true;
              this.errorMsg = error.message;
            }
          });
      } else {
        this.error = true;
        this.errorMsg = "Please fill out all the fields!";
      }
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
    async signInWithGoogle() {
      const provider = new GoogleAuthProvider();
      try {
        const result = await signInWithPopup(auth, provider);
        const credential = GoogleAuthProvider.credentialFromResult(result);
        this.error = false;
        this.errorMsg = "";
        const user = result.user;
        const uid = user.uid;

        // Check if user exists in Firestore
        const userRef = doc(db, "users", uid);
        const userSnapshot = await getDoc(userRef);

        if (!userSnapshot.exists()) {
          // User does not exist, create a new document
          await setDoc(userRef, {
            firstName: "",
            lastName: "",
            username: user.displayName,
            email: user.email,
            photoURL: user.photoURL,
            phoneNumber: user.phoneNumber,
          });
        }

        this.closeRegister();
        this.$router.push({ name: "Home" });
      } catch (error) {
        this.error = true;
        this.errorMsg = error.message;
        return;
      }
    },

    async signInWithFacebook() {
      const provider = new FacebookAuthProvider();

      try {
        const result = await signInWithPopup(auth, provider);
        const credential = FacebookAuthProvider.credentialFromResult(result);
        this.error = false;
        this.errorMsg = "";
        const user = result.user;
        const uid = user.uid;

        // Check if user exists in Firestore
        const userRef = doc(db, "users", uid);
        const userSnapshot = await getDoc(userRef);

        if (!userSnapshot.exists()) {
          // User does not exist, create a new document
          await setDoc(userRef, {
            firstname: "",
            lastname: "",
            username: user.displayName,
            email: user.email,
            photoURL: user.photoURL,
            phoneNumber: user.phoneNumber,
          });
        }

        this.closeRegister();
        this.$router.push({ name: "Home" });
      } catch (error) {
        if (error.code === "auth/account-exists-with-different-credential") {
          const existingProvider = new GoogleAuthProvider();

          signInWithPopup(auth, existingProvider)
            .then((result) => {
              const user = result.user;
              const credential = FacebookAuthProvider.credential(
                credential.accessToken
              );
              return linkWithCredential(user, credential);
            })
            .then(() => {
              this.closeRegister();
              this.$router.push({ name: "Home" });
            })
            .catch((error) => {
              this.error = true;
              this.errorMsg = error.message;
              return;
            });
        } else {
          this.error = true;
          this.errorMsg = error.message;
          return;
        }
      }
    },
    closeRegister() {
      this.$emit("closeRegister");
    },
    updatePassthroughEmail() {
      this.$store.commit("updatePassthroughEmail", this.email);
      console.log(this.$store.state.passthroughEmail);
    },
  },
};
</script>

<style lang="scss" scoped>
.error-container {
  padding: 10px;
}

.forgot-Password {
  margin-top: 10px;
  display: flex;
  flex-direction: row-reverse;
  text-align: center;
  .forgot {
    color: #d9d9d9;
    font-size: 12px;
    font-weight: 550;
    transition: 0.5s;
    text-align: center;
    &:hover {
      text-decoration: underline;
      color: #fff;
    }
  }
}
input {
  width: 100%;
}
button {
  height: 40px;
  width: 70%;
}
.form-container {
  flex-direction: column;
}
</style>
