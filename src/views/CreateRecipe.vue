<template>
  <div class="create-recipe">
    <div class="page-container">
      <h1>Create Recipe</h1>
      <form class="form">
        <div class="text-input">
          <h2>Recipe Title</h2>
          <input
            type="text"
            placeholder="Example: Peperoni Pizza"
            v-model="title"
          />
        </div>
        <div class="text-input">
          <h2>Recipe description</h2>
          <textarea
            name=""
            id=""
            cols="30"
            rows="10"
            v-model="description"
          ></textarea>
        </div>
        <div class="info">
          <div class="text-input portion">
            <h2>Serving Portions</h2>
            <input type="number" placeholder="Example: 5" v-model="servings" />
          </div>
          <div class="text-input prep">
            <h2>Time To Prepare</h2>
            <input type="text" placeholder="Example: 2h 15m" v-model="time" />
          </div>
        </div>
        <div class="text-input">
          <h2>Add An Image</h2>
          <div class="upload-photo">
            <input
              type="file"
              @change="onFileChange"
              id="recipe-photo"
              accept="png, jpg, jpeg"
            />
            <div class="buttons">
              <label for="recipe-photo" class="preview">Upload Photo</label>
              <button
                class="preview"
                @click.prevent="openPreview"
                :disabled="!photochange"
              >
                Preview Photo
              </button>
            </div>
            <span v-show="photochange">File Chosen: {{ fileName }}</span>
          </div>
        </div>
        <div class="text-input">
          <h2>Video URL</h2>
          <input
            v-model="youTubeURL"
            type="text"
            placeholder="For Example: https://www.youtube.com/watch?v=aPUVUrS2oC0"
            @change="this.preview = false"
          />
          <span class="error success" v-if="isYouTubeLink"
            >Valid YouTube link</span
          >
          <span class="error" v-else>Not a valid YouTube link</span>
          <iframe
            :src="youTubeURL"
            v-show="previewVideo"
            width="100%"
            height="300px"
          ></iframe>
          <button class="preview" @click.prevent="youtubePlay">
            <h3 v-if="!convertVideo">Preview Video</h3>
            <h3 v-else>Click Again</h3>
          </button>
        </div>
        <div class="steps">
          <h2>
            Add Steps <i class="fa-solid fa-circle-plus" @click="addStep"> </i>
            <i
              @click="removeStep"
              class="fa-solid fa-circle-minus"
              v-show="steps.length > 1"
            ></i>
          </h2>
          <ul>
            <li v-for="(item, index) in steps" :key="index">
              <h2>Step {{ index + 1 }}</h2>
              <input type="text" v-model="item.text" placeholder="Step" />
            </li>
          </ul>
        </div>
        <div class="ingridients">
          <h2>
            Add Ingridients
            <i class="fa-solid fa-circle-plus" @click="addIngredients"> </i>
            <i
              @click="removeIngredients"
              class="fa-solid fa-circle-minus"
              v-show="ingredients.length > 1"
            ></i>
          </h2>
          <ul>
            <li v-for="(item, index) in ingredients" :key="index">
              <h2 v-if="item.name === ''">Ingredient {{ index + 1 }}</h2>
              <h2 v-else>{{ item.name }}: {{ item.value }} {{ item.units }}</h2>
              <div class="ingridient-input">
                <input
                  type="text"
                  v-model="item.name"
                  placeholder="Ingridient Name"
                />
                <input
                  type="number"
                  v-model="item.value"
                  placeholder="Ammount"
                />
                <select name="" id="" v-model="item.units">
                  <option value="units">units</option>
                  <option value="gramms">gramms</option>
                  <option value="oz">ounces</option>
                  <option value="tb">table spoons</option>
                  <option value="litres">litres</option>
                  <option value="ml">mililitres</option>
                </select>
              </div>
            </li>
          </ul>
        </div>
        <span class="error" v-show="error">{{ errorMsg }}</span>
        <button class="create" @click.prevent="createRecipe">
          Create Recipe
        </button>
      </form>
    </div>
  </div>
  <dialog ref="preview" class="dialog" :class="{ closeModal: closeModal }">
    <div class="image-container"><img :src="imageURL" /></div>
    <i @click="closeDialog" class="fa-solid fa-xmark"></i>
  </dialog>
  <Loading v-show="loading" />
</template>

<script>
import { ref, getDownloadURL, uploadBytes, getStorage } from "firebase/storage";
import { setDoc, doc } from "firebase/firestore";
import { db } from "../firebase/index";
import Loading from "../components/Loading.vue";

export default {
  name: "CreateRecipe",
  components: {
    Loading,
  },
  data() {
    return {
      title: "",
      description: "",
      steps: [{ text: "" }],
      ingredients: [{ name: "", value: 0, units: "" }],
      youTubeURL: "",
      notUploaded: true,
      changephoto: false,
      previewVideo: false,
      convertVideo: false,
      closeModal: false,
      fileName: "",
      imageURL: "",
      photochange: false,
      loading: false,
      downloadURL: "",
      error: false,
      errorMsg: "",
      time: "",
      servings: 0,
      profilePictureFile: null,
    };
  },
  watch: {
    youTubeURL() {
      console.log(this.recipeID);
      console.log(this.$store.state.profileID);
      this.previewVideo = false;
    },
  },
  methods: {
    closeDialog() {
      this.closeModal = true;
      setTimeout(() => {
        this.$refs.preview.close();
        this.closeModal = false;
      }, 1000);
    },
    addStep() {
      const lastIndex = this.steps.length - 1;
      const lastItem = this.steps[lastIndex];

      if (lastItem.text.trim() !== "") {
        this.steps.push({ text: "" });
      }
      console.log(this.steps);
    },
    removeStep() {
      this.steps.pop();
      console.log(this.steps);
    },
    addIngredients() {
      const lastIndex = this.ingredients.length - 1;
      const lastItem = this.ingredients[lastIndex];

      if (lastItem.name.trim() !== "" && lastItem.value > 0) {
        this.ingredients.push({ name: "", value: 0, units: 0 });
      }
      console.log(this.ingredients);
    },
    removeIngredients() {
      this.ingredients.pop();
    },
    onFileChange(event) {
      this.profilePictureFile = event.target.files[0];
      if (this.profilePictureFile) {
        this.fileName = this.profilePictureFile.name;
        const reader = new FileReader();
        reader.onload = (e) => {
          this.imageURL = e.target.result;
          this.changedPhoto = true;
          this.photochange = true;
        };
        reader.readAsDataURL(this.profilePictureFile);
      }
    },
    async uploadPicture() {
      const storage = getStorage();
      const storageRef = ref(storage, "RecipePhotos/" + this.recipeID);
      await uploadBytes(storageRef, this.profilePictureFile);
      this.downloadURL = await getDownloadURL(storageRef);
    },
    openPreview() {
      this.$refs.preview.showModal();
      console.log(this.imageURL);
    },
    extractVideoId(link) {
      const match = link.match(regex);
      return match && match[1];
    },
    youtubePlay() {
      if (!this.previewVideo) {
        this.toggleConvert();
      }
      const videoId = this.extractVideoId(this.youTubeURL);
      if (videoId) {
        this.youTubeURL = `https://www.youtube.com/embed/${videoId}`;
        this.previewVideo = true;
      }
      return;
    },
    toggleConvert() {
      this.convertVideo = !this.convertVideo;
    },
    extractVideoId(link) {
      const regex =
        /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?/]+)/;
      const match = link.match(regex);
      return match && match[1];
    },
    async createRecipe() {
      if (
        this.title !== "" &&
        this.description !== "" &&
        this.steps[0].text !== "" &&
        this.ingredients[0].name !== "" &&
        this.isYouTubeLink &&
        this.photochange
      ) {
        this.error = false;
        this.errorMsg = "";
        this.loading = true;
        await this.uploadPicture().then(async ()=>{
          const documentRef = doc(db, "recipes", this.recipeID);
          const updatedData = {
            title: this.title,
            description: this.description,
            steps: this.steps,
            ingredients: this.ingredients,
            youTubeURL: this.youTubeURL,
            imageURL: this.downloadURL,
            userID: this.$store.state.profileID,
            servings: this.servings,
            timeToPrepare: this.time,
            date: new Date(),
          };
          await setDoc(documentRef, updatedData).then(()=>{
            console.log("Document updated successfully!");
            this.$store.dispatch("getRecipes");
            this.loading = false;
          });
        });

      } else {
        this.error = true;
        this.errorMsg = "Please fill out all the inputs.";
      }
    },
  },
  computed: {
    isYouTubeLink() {
      const youtubeRegex =
        /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?/]+)/;
      return youtubeRegex.test(this.youTubeURL);
    },
    photoURL() {
      this.changephoto = false;
      return this.imageURL;
    },
    recipeID() {
      const alphanumeric =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      const timestamp = new Date().getTime();
      let randomId = "";

      for (let i = 0; i < 9; i++) {
        randomId += alphanumeric.charAt(
          Math.floor(Math.random() * alphanumeric.length)
        );
      }

      return `${timestamp}${randomId}`;
    },
  },
};
</script>

<style lang="scss" scoped>
.info {
  display: flex;
  flex-direction: row;
  width: 100%;
  gap: 20px;
  .portion {
    width: 100px;
    overflow: hidden;
  }
  .prep {
    width: 100px;
    overflow: hidden;
  }
}
iframe {
  animation: frameslide 0.7s normal;
  @keyframes frameslide {
    from {
      height: 0;
      margin-bottom: -50px;
    }
    to {
      height: 300px;
      margin-bottom: auto;
    }
  }
}
.error {
  &.success {
    color: #fff;
  }
}
.dialog {
  margin: auto;
  background: none;
  border: none;
  max-width: 80%;
  max-height: 80%;
  animation: show-dialog 1.1s normal;
  @keyframes show-dialog {
    from {
      transform: scale(0);
      opacity: 0;
    }
    to {
      transform: scale(1);
      opacity: 1;
    }
  }
  .fa-xmark {
    position: absolute;
    text-align: center;
    justify-content: center;
    align-items: center;
    height: 45px;
    width: 45px;
    top: 20px;
    right: 20px;
    font-size: 35px;
    color: #1e1e1e;
    cursor: pointer;
    transition: 0.5s ease;
    border-radius: 50%;
    stroke: 1px #fff solid;
    &:hover {
      transform: scale(1.1);
      color: #f4d157;
    }
  }
  img {
    position: relative;
    max-width: 100%;
    max-height: 100%;
  }
  &::backdrop {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(10px);
    animation: fade-in 1.1s ease;
    @keyframes fade-in {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }
  }
  &.closeModal {
    animation: hide-dialog 1.1s normal;
    @keyframes hide-dialog {
      to {
        transform: scale(0);
        opacity: 0;
      }
    }
    &::backdrop {
      animation: fade 1.1s ease;
    }
    @keyframes fade {
      to {
        opacity: 0;
      }
    }
  }
}
.create-recipe {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-image: url("../assets/Images/Reset.png");
  background-size: cover;
  justify-content: center;
  align-items: center;
  color: #1e1e1e;
  .page-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    background-color: #d9d9d9;
    padding: 30px;
    border-radius: 10px;
    width: 80%;
    max-width: 700px;
    input {
      background-color: #d9d9d9;
      border-bottom: solid 2px;
      border-left: 0px;
      border-right: 0px;
      border-top: 0px;
      transition: 500ms ease;
      font-size: 10px;
      &:focus {
        font-size: 9px;
      }
      @media (min-width: 600px) {
        font-size: 14px;
        &:focus {
          font-size: 12px;
        }
      }
    }
    h1 {
      padding-bottom: 20px;
      font-size: 32px;
      text-align: center;
    }
    .form {
      display: flex;
      flex-direction: column;
      gap: 20px;
      justify-content: center;
      align-items: center;
      .upload-photo {
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 10px;
        input {
          display: none;
        }
        .buttons {
          display: flex;
          flex-direction: row;
          justify-self: center;
          align-self: center;
          gap: 20px;
        }
      }
      .create {
        text-align: center;
        font-weight: 800;
        font-size: large;
        border-radius: 20px;
        background-color: #f4d157;
        border: 0;
        box-shadow: 0px 0px 0px 1px #000;
        color: #1e1e1e;
        cursor: pointer;
        padding: 10px;
        transition: ease-out 0.3s;
        &:hover {
          background-color: #1e1e1e;
          box-shadow: 0px 0px 0px 1px #f4d157;
          color: #f4d157;
        }
      }
      .text-input {
        display: flex;
        position: relative;
        flex-direction: column;
        width: 100%;
        justify-content: center;
        align-items: left;
        gap: 5px;
        .preview {
          text-align: center;
          font-weight: 800;
          font-size: large;
          border-radius: 20px;
          background-color: #f4d157;
          border: 0;
          box-shadow: 0px 0px 0px 1px #000;
          color: #1e1e1e;
          cursor: pointer;
          padding: 10px;
          transition: ease-out 0.3s;
          &:hover {
            background-color: #1e1e1e;
            box-shadow: 0px 0px 0px 1px #f4d157;
            color: #f4d157;
          }
          &:disabled {
            background-color: #303030;
            box-shadow: 0px 0px 0px 1px #1e1e1e;
            color: #d9d9d9;
            cursor: default;
            &:hover {
              background-color: #303030;
              box-shadow: 0px 0px 0px 1px #1e1e1e;
              color: #d9d9d9;
            }
          }
        }
        h2 {
          font-size: 24px;
          text-align: left;
        }
        input {
          width: 100%;
          height: 30px;
          outline: none;
          padding-left: 5px;
        }
        textarea {
          padding: 10px;
          max-height: 150px;
          border-radius: 5px;
          resize: none;
          outline: none;
        }
      }
      .steps {
        display: flex;
        flex-direction: column;
        width: 100%;
        gap: 5px;
        h2 {
          .fa-circle-plus {
            cursor: pointer;
            color: #1e1e1e;
            &:hover {
              color: #fff;
            }
            transition: 0.5s ease;
          }
          .fa-circle-minus {
            color: #1e1e1e;
            cursor: pointer;
            margin-left: 10px;
            transition: 0.5s ease;
            &:hover {
              color: #fff;
            }
          }
        }
        ul {
          list-style-type: none;
          li {
            display: flex;
            flex-direction: column;
            gap: 5px;
            input {
              width: 100%;
              height: 30px;
              outline: none;
              padding-left: 5px;
            }
            padding-bottom: 10px;
          }
        }
      }
      .ingridients {
        display: flex;
        flex-direction: column;
        width: 100%;
        gap: 5px;

        h2 {
          .fa-circle-plus {
            cursor: pointer;
            color: #1e1e1e;
            &:hover {
              color: #fff;
            }
            transition: 0.5s ease;
          }
          .fa-circle-minus {
            color: #1e1e1e;
            cursor: pointer;
            margin-left: 10px;
            transition: 0.5s ease;
            &:hover {
              color: #fff;
            }
          }
        }
        ul {
          list-style-type: none;
          li {
            display: flex;
            flex-direction: column;
            gap: 5px;
            padding-bottom: 10px;
            .ingridient-input {
              display: flex;
              gap: 5px;
              input {
                display: flex;
                height: 30px;
                outline: none;
                padding-left: 5px;
                &[type="text"] {
                  flex: 2;
                  width: 70%;
                }
                &[type="number"] {
                  flex: 1;
                  width: 30%;
                  text-align: center;
                }
              }
              select {
                border-radius: 5px;
                background-color: #d9d9d9;
                outline: none;
              }
            }
            h2 {
              font-size: 16px;
              color: #636363;
            }
          }
        }
      }
    }
  }
}
</style>
