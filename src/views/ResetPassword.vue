<template>
  <div class="reset-password">
    <Modal
      v-if="modalActive"
      :modalMessage="modalMessage"
      v-on:close-modal="closeModal"
    />
    <Loading v-if="loading" />
    <div class="form-container">
      <form class="reset">
        <h2>Reset Password</h2>
        <p>Forgot Your password? Enter your email to reset it</p>
        <router-link to="/"><h6>Go Back to Main</h6></router-link>
        <div class="inputs">
          <div class="email-container">
            <input type="text" placeholder="Email" v-model="email" />
            <img
              class="emailIcon"
              src="/src/assets/Icons/email-svgrepo-com.svg"
              alt="email Icon"
            />
          </div>
        </div>
        <button @click.prevent="resetPassword">Reset</button>
        <div class="angle"></div>
      </form>
      <div class="background"></div>
    </div>
  </div>
</template>

<script>
import { auth } from "../firebase/index";
import { sendPasswordResetEmail } from "firebase/auth";
import Loading from "../components/Loading.vue";
import Modal from "../components/Modal.vue";
export default {
  name: "ForgotPassword",
  data() {
    return {
      email: "",
      modalActive: null,
      modalMessage: "",
      loading: null,
    };
  },
  created() {
    this.email = this.$store.state.passthroughEmail;
  },
  components: {
    Modal,
    Loading,
  },
  methods: {
    closeModal() {
      this.modalActive = false;
      this.email = "";
    },
    resetPassword() {
      this.loading = true;
      sendPasswordResetEmail(auth, this.email)
        .then(() => {
          this.modalMessage =
            "If your account exists, you will recieve an email";
          this.loading = false;
          this.modalActive = true;
        })
        .catch((error) => {
          this.modalMessage = error.message;
          this.loading = false;
          this.modalActive = true;
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.reset-password {
  background-color: #d9d9d9;
  height: 100vh;
  .form-container {
    position: relative;
    height: 100vh;
    @media (min-width: 900px) {
      width: 100%;
    }
    form {
      display: flex;
      position: relative;
      height: 100%;
      width: 100%;
      padding: 0 10px;
      flex: 1;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      @media (min-width: 900px) {
        padding: 0 50px;
      }
      h2 {
        text-align: center;
        margin-bottom: 8px;
        font-size: 32px;
        @media (min-width: 900px) {
          font-size: 40px;
        }
      }
      p {
        text-align: center;
        margin-bottom: 32px;
      }
      .email-container {
        input {
          height: 30px;
          width: 50vw;
          max-width: 350px;
          min-width: 200px;
        }
      }
      button {
        height: 40px;
        width: 100%;
        max-width: 180px;
      }
      .angle {
        display: none;
        position: absolute;
        background-color: #d9d9d9;
        transform: rotateZ(4deg);
        width: 60px;
        right: -45px;
        height: 110%;
        @media (min-width: 900px) {
          display: initial;
        }
      }
    }
  }
}
.background {
  display: none;
  flex: 2;
  background-size: cover;
  background-image: url("../assets/Images/Reset.png");
  width: 100%;
  height: 100%;
  @media (min-width: 900px) {
    display: initial;
  }
}
</style>
