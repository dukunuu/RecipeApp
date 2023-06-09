<template>
  <header>
    <nav class="container">
      <div class="branding">
        <router-link class="header" :to="{ name: 'Home' }">Recipe</router-link>
      </div>
      <div class="nav-links">
        <ul v-show="!mobile">
          <router-link class="link" to="/">Home</router-link>
          <router-link class="link" v-if="user" to="/createRecipe"
            >Create Recipe</router-link
          >
          <router-link class="link" to="#">About</router-link>
          <div class="search-container">
            <input
              v-if="search"
              type="text"
              class="search"
              :class="{ hiding: toggler }"
              placeholder="Search"
              v-model="value"
            />
          </div>
          <div class="link" @click="toggleSearch">
            <i class="fa-solid fa-magnifying-glass"></i>
          </div>
          <button v-if="!user" @click="showRegister">Login/Register</button>
        </ul>
        <div class="profile" ref="profile" v-show="!mobile" v-if="user">
          <img
            v-if="userHasProfile()"
            :src="this.$store.state.profilePhotoURL"
            class="profile-pic"
            @click="toggleMenu"
          />
          <img
            v-else
            src="../assets/Icons/user-img.png"
            class="profile-pic"
            @click="toggleMenu"
          />
          <div
            class="profile-menu"
            v-if="menuToggle"
            :class="{ hideMenu: hideMenu }"
          >
            <div class="info">
              <img
                v-if="userHasProfile()"
                :src="this.$store.state.profilePhotoURL"
                class="sm-pfp"
              />
              <img
                v-else="userHasProfile()"
                src="../assets/Icons/user-img.png"
                class="sm-pfp"
              />

              <div class="right">
                <p>{{ this.$store.state.profileUserName }}</p>
                <p>{{ this.$store.state.profileEmail }}</p>
              </div>
            </div>
            <div class="options">
              <div class="option">
                <router-link class="option" to="/profile">
                  <i class="fa-solid fa-user"></i>
                  <p>Profile</p>
                </router-link>
              </div>
              <div class="option">
                <router-link class="option" to="/myrecipes">
                  <i class="fa-solid fa-utensils"></i>
                  <p>My Recipes</p>
                </router-link>
              </div>
              <div class="option" @click="signOutUser()">
                <i class="fa-solid fa-right-to-bracket"></i>
                <p>Sign out</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <img
        class="menu-icon"
        src="/src/assets/Icons/burger-menu-svgrepo-com.svg"
        alt="Bars Icon"
        @click="toggleMobileNav"
        v-show="mobile"
      />
      <Transition name="mobileNav">
        <ul class="mobile-nav" v-show="mobileNav">
          <div class="branding">
            <router-link class="header" :to="{ name: 'Home' }"
              >Recipe</router-link
            >
          </div>
          <router-link class="link" to="/">Home</router-link>
          <router-link class="link" v-if="user" to="/createRecipe"
            >Create Recipe</router-link
          >
          <router-link class="link" to="#">About</router-link>
          <div class="profile-menu-mobile" v-if="user">
            <div class="info">
              <img
                v-if="userHasProfile()"
                :src="this.$store.state.profilePhotoURL"
                class="sm-pfp"
              />
              <img
                v-else="userHasProfile()"
                src="../assets/Icons/user-img.png"
                class="sm-pfp"
              />

              <div class="right">
                <p>{{ this.$store.state.profileUserName }}</p>
                <p>{{ this.$store.state.profileEmail }}</p>
              </div>
            </div>
            <div class="options">
              <div class="option">
                <router-link class="option" to="/profile">
                  <i class="fa-solid fa-user"></i>
                  <p>Profile</p>
                </router-link>
              </div>
              <div class="option">
                <router-link class="option" to="/myrecipes">
                  <i class="fa-solid fa-utensils"></i>
                  <p>My Recipes</p>
                </router-link>
              </div>
              <div class="option" @click="signOutUser()">
                <i class="fa-solid fa-right-to-bracket"></i>
                <p>Sign out</p>
              </div>
            </div>
          </div>
          <button class="link" v-if="!user" @click="showRegister">
            Login/Register
          </button>
        </ul>
      </Transition>
    </nav>
    <dialog ref="modal" id="modal" class="dialog" :class="{ hide: show }">
      <img
        class="closeBut"
        src="/src/assets/Icons/close-lg-svgrepo-com.svg"
        alt="Close Icon"
        @click="closeRegister"
      />
      <div class="switcher">
        <h3
          class="login"
          @click="swapComponent(componentsArray[0])"
          :style="[
            currentPage == componentsArray[0]
              ? { filter: 'brightness(' + on + ')' }
              : { filter: 'brightness(' + off + ')' },
          ]"
        >
          Login
        </h3>
        <h3>|</h3>
        <h3
          class="register"
          @click="swapComponent(componentsArray[1])"
          :style="[
            currentPage == componentsArray[0]
              ? { filter: 'brightness(' + off + ')' }
              : { filter: 'brightness(' + on + ')' },
          ]"
        >
          Register
        </h3>
      </div>
      <div class="page">
        <Login
          @closeRegister="closeDialog"
          v-if="currentPage == componentsArray[0]"
        />
        <Register @closeRegister="closeDialog" v-else />
      </div>
    </dialog>
  </header>
</template>

<script>
import Login from "./Login.vue";
import Register from "./Register.vue";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/index";
export default {
  name: "Navigation",
  components: {
    Login,
    Register,
  },
  data() {
    return {
      mobile: null,
      mobileNav: null,
      windowWidth: null,
      currentPage: Login,
      componentsArray: [Login, Register],
      off: 0.5,
      on: 1,
      show: false,
      text: "",
      search: false,
      value: "",
      toggler: false,
      menuToggle: false,
      hideMenu: false,
      userProfile: "../assets/Icons/user-img.png",
    };
  },
  created() {
    this.checkScreen();
    window.addEventListener("resize", this.checkScreen);
  },
  methods: {
    toggleMenu() {
      if (this.menuToggle) {
        this.hideMenu = true;
        setTimeout(() => {
          this.hideMenu = false;
          this.menuToggle = !this.menuToggle;
        }, 1000);
        return;
      }
      this.menuToggle = !this.menuToggle;
      return;
    },
    checkScreen() {
      this.windowWidth = window.innerWidth;
      if (this.windowWidth <= 750) {
        this.mobile = true;
        return;
      }
      this.mobile = false;
      this.mobileNav = false;
      return;
    },
    toggleMobileNav() {
      this.mobileNav = !this.mobileNav;
      return;
    },
    showRegister() {
      this.$refs.modal.showModal();
      if (this.mobileNav === false && this.mobile === true) {
        this.mobileNav = !this.mobileNav;
      }
      return;
    },
    closeRegister() {
      this.show = true;
      this.$refs.modal.addEventListener(
        "animationend",
        this.animationEndHandler
      );
    },
    closeDialog() {
      this.$refs.modal.close();
    },
    animationEndHandler() {
      this.show = false;
      this.$refs.modal.close();
      this.$refs.modal.removeEventListener(
        "animationend",
        this.animationEndHandler
      );
    },
    swapComponent(component) {
      this.currentPage = component;
      return;
    },
    toggleSearch() {
      if (this.value !== "") {
        this.$store.commit("updateSearch", this.value);
        this.$router.push("/search");
        this.value = "";
        this.toggler = false;
        this.search = false;
        this.show = false;
        this.closeDialog();
        return;
      }
      if (this.search) {
        this.toggler = true;
        setTimeout(() => {
          this.toggler = false;
          this.search = !this.search;
        }, 1000);
        return;
      }
      this.search = !this.search;
      return;
    },
    userHasProfile() {
      if (this.$store.state.profilePhotoURL) {
        return true;
      }
      return false;
    },
    async signOutUser() {
      await signOut(auth).then(() => {
        this.$router.push({ name: "Home" });
      });
    },
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
  },
};
</script>
<style lang="scss" scoped>
header {
  background: rgba(0, 0, 0, 0.7);
  padding: 0 25px;
  box-shadow: 0 2px 3px 0px #1e1e1e;
  z-index: 100;
}
.link {
  color: #d9d9d9;
  font-weight: 500;
  padding: 0 8px;
  margin-top: 0;
  transition: 0.3s ease;
  &:hover {
    color: #f4d157;
    transform: scale(1.05);
  }
}
button {
  cursor: pointer;
  margin-top: -10px;
  text-transform: uppercase;
}

nav {
  display: flex;
  padding: 20px 0;
  .branding {
    display: flex;
    align-items: center;
    .header {
      font-weight: 600;
      font-size: 24px;
      color: #d9d9d9;
    }
  }
  .fa-magnifying-glass {
    color: #f4d157;
    background-color: #1e1e1e;
    height: 30px;
    width: 30px;
    text-align: center;
    border-radius: 50%;
    border: #f4d157 solid;
    padding: 5px;
    margin-top: -8px;
    transition: 0.5s ease-out all;
    z-index: 100;
    position: relative;

    &:hover {
      color: #1e1e1e;
      background-color: #f4d157;
      border: #1e1e1e solid;
    }
  }
  .nav-links {
    position: relative;
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: flex-end;

    ul {
      display: flex;
      margin-top: 8px;
      list-style-type: none;
      .link {
        margin-right: 32px;
      }
      .link .fa-magnifying-glass {
        margin-right: -20px;
      }
      input {
        min-width: 150px;
        max-width: 200px;
        padding: 3px;
        padding-left: 8px;
        border-radius: 10px 0px 0px 10px;
        border: none;
        outline: none;
        margin-right: -20px;
        animation: slide 1s forwards;
        transform-origin: right;
        position: relative;
        z-index: 0;

        @keyframes slide {
          from {
            transform: scaleX(0);
            margin-left: -95px;
          }
          to {
            margin-left: 0;
            transofrm: scaleX(100%);
          }
        }
        &.hiding {
          animation: hiding 1s forwards;
          @keyframes hiding {
            to {
              transform: scaleX(0);
              margin-left: -140px;
            }
          }
        }
      }
      button {
        padding: 10px 20px;
        border-radius: 50px;
        border: 0;
        font-weight: 900;
        color: #1e1e1e;
        background-color: #f4d157;
        transition: 0.3s background-color ease;
        &:hover {
          background-color: #1e1e1e;
          box-shadow: 0px 0px 0px 1px #f4d157;
          color: #f4d157;
        }
      }
    }
    .profile {
      position: relative;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background-color: #d9d9d9;
      color: #d9d9d9;
    }
    .profile-pic {
      width: 40px;
      height: 40px;
      border-radius: 50%;

      background-color: #d9d9d9;
      transition: 300ms ease;
      &:hover {
        transform: scale(1.2);
      }
    }
    .profile-menu {
      position: absolute;
      top: 60px;
      right: 0;
      width: 250px;
      background-color: #1e1e1e;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.9);
      animation: show-menu 1s ease normal;
      @keyframes show-menu {
        from {
          opacity: 0;
          transform: translateY(-20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      &.hideMenu {
        animation: hide-menu 1s ease normal;
        @keyframes hide-menu {
          to {
            opacity: 0;
            transform: translateY(-20px);
          }
        }
      }
      .info {
        display: flex;
        align-items: center;
        padding: 15px;
        border-bottom: 1px solid white;
        .sm-pfp {
          position: initial;
          width: 40px;
          height: 40px;
          background-color: #d9d9d9;
          color: #d9d9d9;
          display: flex;
          align-items: center;
          border-radius: 50%;
          cursor: default;
        }
        .right {
          flex: 1;
          margin-left: 20px;

          p:nth-child(1) {
            font-size: 14px;
          }
          p:nth-child(2) {
            font-size: 10px;
          }
        }
      }
      .options {
        padding: 15px;
        .option {
          text-decoration: none;
          color: #5f5f5f;
          display: flex;
          align-items: center;
          margin-bottom: 12px;
          font-weight: 500;
          transition: 300ms ease all;
          &:hover {
            transform: scale(1.02);
            color: #fff;
          }

          .fa-user,
          .fa-right-to-bracket,
          .fa-utensils {
            font-size: 10px;
          }
          p {
            font-size: 14px;
            margin-left: 12px;
          }
          &:last-child {
            margin-bottom: 0px;
          }
        }
      }
    }
  }
  .menu-icon {
    cursor: pointer;
    position: absolute;
    top: 20px;
    right: 25px;
    height: 40px;
    width: auto;
  }
  .mobile-nav {
    padding: 20px;
    width: 70%;
    max-width: 250px;
    display: flex;
    flex-direction: column;
    position: fixed;
    height: 100%;
    background-color: #303030;
    top: 0;
    left: 0;
    .profile-menu-mobile {
      position: absolute;
      bottom: 0;
      right: 0;
      width: 100%;
      color: white;
      background-color: #1e1e1e;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.9);
      .info {
        display: flex;
        align-items: center;
        padding: 15px;
        border-bottom: 1px solid white;
        .sm-pfp {
          position: initial;
          width: 40px;
          height: 40px;
          background-color: #d9d9d9;
          color: #d9d9d9;
          display: flex;
          align-items: center;
          border-radius: 50%;
          cursor: default;
        }
        .right {
          flex: 1;
          margin-left: 20px;

          p:nth-child(1) {
            font-size: 14px;
          }
          p:nth-child(2) {
            font-size: 10px;
          }
        }
      }
      .options {
        padding: 15px;
        .option {
          text-decoration: none;
          color: #5f5f5f;
          display: flex;
          align-items: center;
          margin-bottom: 12px;
          font-weight: 500;
          transition: 300ms ease all;
          &:hover {
            transform: scale(1.02);
            color: #fff;
          }

          .fa-user,
          .fa-right-to-bracket,
          .fa-utensils {
            font-size: 10px;
          }
          p {
            font-size: 14px;
            margin-left: 12px;
          }
          &:last-child {
            margin-bottom: 0px;
          }
        }
      }
    }
    .link {
      padding: 15px 0;
      color: #fff;
    }
    .link:last-child {
      display: flexbox;
      width: 70%;
      max-width: 250px;
      position: absolute;
      bottom: 30px;
    }
    button {
      padding: 10px 20px;
      border-radius: 50px;
      border: 0;
      font-weight: 900;
      color: #1e1e1e;
      background-color: #f4d157;
      transition: 0.3s background-color ease;
      font-size: 16px;
      &:hover {
        background-color: #1e1e1e;
        box-shadow: 0px 0px 0px 1px #f4d157;
        color: #f4d157;
      }
    }
  }
}
.dialog {
  margin: auto;
  height: 600px;
  width: 45vh;
  border: 0;
  justify-content: center;
  align-items: center;
  padding: 30px;
  color: #f4d157;
  background-color: #1e1e1e;
  .switcher {
    display: flex;
    text-align: center;
    justify-content: center;
    margin-top: 30px;

    .login,
    .register {
      cursor: pointer;
      margin-left: 10px;
      margin-right: 10px;
      transition: 300ms;
      &:hover {
        transform: scale(1.1);
      }
    }
    .login {
      display: block;
      filter: brightness(1);
    }

    .register {
      display: block;
      filter: brightness(0.5);
    }
  }
  .page {
    padding: 10px 0;
    text-align: center;
    justify-content: center;
    transition: 300ms;
  }
  .closeBut {
    height: 25px;
    cursor: pointer;
    position: absolute;
    right: 20px;
    top: 20px;
    color: red;
    transition: all 300ms ease;
    &:hover {
      transform: scale(1.2);
    }
  }
  &[open] {
    border: 1px solid rgba(0, 0, 0, 0.3);
    border-radius: 6px;
    box-shadow: 0 3px 7px rgba(0, 0, 0, 0.3);
    animation: show-dialog 1s ease normal;
  }
  &.hide {
    animation: hide-dialog 0.9s ease normal;
    &::backdrop {
      animation: hide-backdrop 0.9s ease normal;
      @keyframes hide-backdrop {
        to {
          backdrop-filter: blur(0px);
          background: none;
        }
      }
    }
  }
  &::backdrop {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(10px);
    animation: show-backdrop 1s ease;
    @keyframes show-backdrop {
      from {
        backdrop-filter: blur(0px);
        background: none;
      }
      to {
        backdrop-filter: blur(10px);
        background-color: rgba(0, 0, 0, 0.5);
      }
    }
  }
  @keyframes show-dialog {
    from {
      opacity: 0;
      transform: translateY(-100%);
    }
    to {
      opacity: 1;
      transform: translateY(0%);
    }
  }
  @keyframes hide-dialog {
    to {
      opacity: 0;
      transform: translateY(-100%);
    }
  }
}
.mobileNav-enter-active,.mobileNav-leave-active{
  transition:all 1s ease;
}
.mobileNav-enter-from{
  transform:translateX(-250px);
}
.mobileNav-enter-to{
  transform:translateX(0);
}
.mobileNav-leave-to{
  transform: translateX(-250px);
}
</style>
