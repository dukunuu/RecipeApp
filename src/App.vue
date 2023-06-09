<template>
  <div class="app-wrapper">
    <div class="app">
      <Navigation v-show="!navigation"></Navigation>
      <router-view />
      <footerVue v-show="!navigation" />
    </div>
  </div>
</template>

<script>
import Navigation from "@/components/Navigation.vue";
import footerVue from "@/components/footerVue.vue";
import { auth } from "./firebase/index";
import { onAuthStateChanged } from "firebase/auth";
export default {
  name: "app",
  components: {
    Navigation,
    footerVue,
  },
  data() {
    return {
      navigation: null,
    };
  },
  created() {
    this.checkRoute();
    onAuthStateChanged(auth, (user) => {
      this.$store.commit("updateUser", user);
      if (user) {
        this.$store.dispatch("getCurrentUser");
      }
    });
  },
  methods: {
    checkRoute() {
      if (
        this.$route.name === "Login" ||
        this.$route.name === "Register" ||
        this.$route.name === "ResetPassword"
      ) {
        this.navigation = true;
        return;
      }
      this.navigation = false;
    },
  },
  watch: {
    $route() {
      this.checkRoute();
    },
  },
};
</script>
<style lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Quicksand:wght@300;400;500;600;700&display=swap");
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Quicksand", sans-serif;
}
body {
  background-image: url("../assets/Images/Reset.png");
}
.app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
.container {
  max-width: 1440px;
  margin: 0 auto;
}
.link {
  cursor: pointer;
  text-decoration: none;
  text-transform: uppercase;
  color: black;
}
.link-light {
  color: #fff;
}
.recipe-card-wrapper {
  position: relative;
  padding: 60px 16px;
  background-color: #d9d9d9;
  @media (min-width: 500px) {
    padding: 80px 16px;
  }
  .recipe-cards {
    display: grid;
    gap: 32px;
    grid-template-columns: 1fr;
    @media (min-width: 500px) {
      grid-template-columns: repeat(2, 1fr);
    }
    @media (min-width: 900px) {
      grid-template-columns: repeat(3, 1fr);
    }
    @media (min-width: 1200px) {
      grid-template-columns: repeat(4, 1fr);
    }
  }
}
.create-recipe {
  position: relative;
  padding: 60px 16px;
  background-color: #d9d9d9;
  @media (min-width: 500px) {
    padding: 80px 16px;
  }
  .recipe-cards {
    display: grid;
    gap: 32px;
    grid-template-columns: 1fr;
    @media (min-width: 500px) {
      grid-template-columns: repeat(2, 1fr);
    }
    @media (min-width: 900px) {
      grid-template-columns: repeat(3, 1fr);
    }
    @media (min-width: 1200px) {
      grid-template-columns: repeat(4, 1fr);
    }
  }
}
.error {
  text-align: center;
  font-size: 14px;
  color: rgb(235, 95, 95);
}
.signup-options {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 30px;
  font-size: 40px;
  .fa-facebook,
  .fa-google {
    cursor: pointer;
    transition: 0.5s ease all;
  }
  .fa-facebook {
    display: flex;
    color: rgb(53, 53, 255);
    &:hover {
      transform: scale(1.1) rotate(-10deg);
    }
  }
  .fa-google {
    background-size: 100%;
    background: conic-gradient(
        from -45deg,
        #ea4335 110deg,
        #4285f4 90deg 180deg,
        #34a853 180deg 270deg,
        #fbbc05 270deg
      )
      73% 55%/150% 150% no-repeat;
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    -webkit-text-fill-color: transparent;
    position:relative;
    z-index:101;
    &:hover {
      transform: scale(1.1) rotate(-10deg);

      -webkit-background-clip: text;
      -moz-background-clip: text;
      -webkit-text-fill-color: transparent;
      -moz-text-fill-color: transparent;
    }
  }
}
.passwordIcon,
.emailIcon {
  height: 20px;
}
.form-container {
  display: flex;
  justify-content: center;
  width: 90%;
  gap: 20px;
  margin: 0 auto;
  position:absolute;
  padding-right:24px;
  z-index:100;
  form {
    h3 {
      text-align: left;
    }
    input[type="email"],
    input[type="text"],
    input[type="password"] {
      margin: 10px 0;
      border-radius: 10px;
      border: 0;
      text-align: left;
      height: 30px;
      padding-left: 30px;
    }
    button {
      text-align: center;
      font-weight: 800;
      font-size: large;
      border-radius: 20px;
      background-color: #f4d157;
      border: 0;
      box-shadow: 0px 0px 0px 1px #000;
      color: #1e1e1e;
      margin-top: 15px;
      cursor: pointer;
      transition: ease-out 0.3s;
      &:hover {
        background-color: #1e1e1e;
        box-shadow: 0px 0px 0px 1px #f4d157;
        color: #f4d157;
      }
    }
    .password-container {
      position: relative;
      .fa-eye,
      .fa-eye-slash {
        position: absolute;
        top: 17px;
        right: 10px;
        cursor: pointer;
        transition: all ease 500ms;
        color: #1e1e1e;
        &:hover {
          color: #939393;
        }
      }
      .passwordIcon {
        position: absolute;
        top: 17px;
        left: 6px;
        opacity: 0.7;
      }
    }
    .email-container {
      position: relative;
      .emailIcon {
        position: absolute;
        top: 16px;
        left: 6px;
        opacity: 0.8;
      }
    }
  }
}
</style>
