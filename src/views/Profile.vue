<template>
  <div class="profile">
    <div class="container">
      <h2>User Profile</h2>
      <div class="profile-info">
        <div class="initials">
          <img
            
            :src="photoURL"
            class="profile-pic"
            @click="toggleMenu"
          />
          <label for="changePhoto"><i class="fa-solid fa-plus"></i></label>
          <input
            type="file"
            @change="onFileChange"
            id="changePhoto"
            accept="png, jpg, jpeg"
          />
        </div>
        <div class="input">
          <label for="firstName">First Name:</label>
          <input type="text" id="firstName" v-model="firstName" />
        </div>
        <div class="input">
          <label for="lastName">Last Name:</label>
          <input type="text" id="lastName" v-model="lastName" />
        </div>
        <div class="input">
          <label for="username">Username:</label>
          <input
            @change="changedSettings = true"
            type="text"
            id="username"
            v-model="username"
          />
        </div>
        <div class="input">
          <label for="phone">Phone Number:</label>
          <input type="text" id="phone" v-model="phoneNumber" />
          <p v-if="!isValidPhoneNumber">Invalid phone number</p>
        </div>
        <div class="input">
          <label for="email">Email:</label>
          <input disabled type="text" id="email" v-model="email" />
        </div>
        <span class="Error" v-show="error">{{ errorMsg }}</span>
        <button @click="updateProfile">Save Changes</button>
      </div>
    </div>
  </div>
  <dialog class="dialog" ref="modal" :class="{ closeModal: closeModal }">
    <h2>Changes were saved successfully!</h2>
    <button @click="closeDialog">Close</button>
  </dialog>
  <Loading v-show="loading" />
</template>

<script>
import { ref, getDownloadURL, uploadBytes, getStorage } from "firebase/storage";
import Loading from "../components/Loading.vue";

export default {
  name: "Profile",
  components: { Loading },
  data() {
    return {
      modalMessage: "Changes were saved!",
      userProfile: "../assets/Icons/user-img.png",
      changedPhoto: false,
      profilePictureFile: null,
      imageURL: "",
      changedPhoto: false,
      previousProfilePicturePath: null,
      error: false,
      photochange: false,
      errorMsg: "",
      loading: false,
      closeModal: false,
      changedSettings: false,
    };
  },

  computed: {
    filename() {
      return this.$store.state.profileID;
    },
    user() {
      return this.$store.state.user;
    },
    firstName: {
      get() {
        return this.$store.state.profileFirstName;
      },
      set(payload) {
        this.$store.commit("changeFirstName", payload);
      },
    },
    lastName: {
      get() {
        return this.$store.state.profileLastName;
      },
      set(payload) {
        this.$store.commit("changeLastName", payload);
      },
    },
    username: {
      get() {
        return this.$store.state.profileUserName;
      },
      set(payload) {
        this.$store.commit("changeUserName", payload);
      },
    },
    phoneNumber: {
      get() {
        return this.$store.state.profilePhoneNumber;
      },
      set(payload) {
        this.$store.commit("changeUserPhoneNumber", payload);
      },
    },
    email() {
      return this.$store.state.profileEmail;
    },
    photoURL() {
      if (this.changedPhoto) {
        this.changedPhoto = false;
        return this.imageURL;
      }
      return this.$store.state.profilePhotoURL;
    },
    isValidPhoneNumber() {
      const phoneNumberPattern = /^\d{8,10}$/;
      return phoneNumberPattern.test(this.phoneNumber);
    },
  },
  methods: {
    async updateProfile() {
      try {
        this.loading = true;
        if (
          this.firstName !== "" &&
          this.lastName !== "" &&
          this.username !== "" &&
          this.phoneNumber !== "" &&
          this.firstName !== undefined &&
          this.lastName !== undefined &&
          this.username !== undefined &&
          this.phoneNumber !== undefined
        ) {
          this.error = false;
          this.errorMsg = "";
          await this.uploadProfilePicture().then(() => {
            this.$store.dispatch("updateUserSettings");
            this.$refs.modal.showModal();
            this.loading = false;
          });
        }
        this.changedSettings = false;
        this.changedPhoto = false;
        return;
      } catch (error) {
        this.error = true;
        this.errorMsg = this.error;
      }
      this.error = true;
      this.errorMsg = "Please fill out all the fields";
    },
    onFileChange(event) {
      this.profilePictureFile = event.target.files[0];
      if (this.profilePictureFile) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.imageURL = e.target.result;
          this.changedSettings = true;
          this.changedPhoto = true;
          this.photochange = true;
        };
        reader.readAsDataURL(this.profilePictureFile);
      }
    },
    async uploadProfilePicture() {
      const storage = getStorage();
      const storageRef = ref(storage, "profilePictures/" + this.filename);
      await uploadBytes(storageRef, this.profilePictureFile);
      const downloadURL = await getDownloadURL(storageRef);
      this.$store.commit("changePhotoURL", downloadURL);
    },
    closeDialog() {
      this.closeModal = true;
      setTimeout(() => {
        this.closeModal = false;
        this.$refs.modal.close();
      }, 1000);
    },
  },
};
</script>
<style lang="scss" scoped>
dialog {
  margin: auto;
  width: 45vh;
  border: 0;
  box-shadow: 0 0 5px 1px #f4d157;
  justify-content: center;
  align-items: center;
  padding: 30px;
  color: #f4d157;
  background-color: #1e1e1e;
  text-align: center;
  button {
    width: 60%;
    height: 40px;
    text-align: center;
    font-weight: 800;
    font-size: 25px;
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
  &::backdrop {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(10px);
  }
  &.closeModal {
    animation: hide-dialog 1.1s normal;
    &::backdrop {
      animation: fade 1.1s ease;
    }
    @keyframes fade {
      to {
        opacity: 0;
      }
    }
  }
  @keyframes hide-dialog {
    to {
      opacity: 0;
      transform: scale(0);
    }
  }
}
.profile {
  background-image: url("../assets/Images/Reset.png");
  .container {
    max-width: 1000px;
    padding: 60px 25px;

    h2 {
      text-align: center;
      margin-bottom: 16px;
      font-weight: 500;
      font-size: 32px;
      color: #fff;
    }

    .profile-info {
      border-radius: 8px;
      box-shadow: 0 0 6px 1px rgba(255, 255, 255, 0.5);
      padding: 32px;
      color: #fff;
      background-color: #1e1e1e;
      display: flex;
      flex-direction: column;
      max-width: 400px;
      margin: 32px auto;

      .initials {
        position: relative;
        width: 80px;
        height: 80px;
        font-size: 32px;
        background-color: #303030;
        color: #fff;
        display: flex;
        align-self: center;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        img {
          background-size: cover;
          border-radius: 50%;
          height: 100%;
          width: 100%;
        }
        label {
          position: absolute;
          top: -5px;
          right: -10px;
          color: #fff;
          font-size: 20px;
          cursor: pointer;
          transition: 0.5s ease;
          &:hover {
            transform: scale(1.05);
          }
        }
        input {
          display: none;
        }
      }

      .icon {
        width: 14px;
        height: auto;
        margin-right: 8px;
      }
    }

    .input {
      margin: 14px 0;

      label {
        font-size: 14px;
        display: block;
        padding-bottom: 6px;
      }
      input {
        width: 100%;
        border: none;
        border-radius: 10px;
        background-color: #414141;
        color: white;
        padding: 8px;
        height: 40px;
        @media (min-width: 900px) {
        }

        &:focus {
          outline: none;
        }
      }
    }

    button {
      height: 40px;
      width: 40%;
      align-self: center;
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
  }
}
</style>
