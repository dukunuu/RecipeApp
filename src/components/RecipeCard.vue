<template>
  <div
    class="blog-card"
    @mouseover="hoverState = true"
    @mouseleave="hoverState = false"
  >
    <div class="icons">
      <div class="icon">
        <i class="fa-solid fa-pen-to-square" @click="editRecipe"></i>
      </div>
      <div class="icon">
        <i class="fa-solid fa-trash" @click="deleteRecipe"></i>
      </div>
    </div>
    <div class="img">
      <img :src="post.imageURL" :class="{ zoom: hoverState }" />
    </div>
    <div class="info">
      <h4>{{ post.title }}</h4>
      <h6>Posted on: {{ dateTime }}</h6>
      <div class="more-info">
        <div class="serving">
          <i
            class="fa-solid"
            :class="[post.servings > 1 ? 'fa-people-group' : 'fa-person']"
          ></i>
          <h6>{{ post.servings }} {{ checkNoun(post.servings) }}</h6>
        </div>
        <div class="prep-time">
          <i class="fa-solid fa-clock"></i>
          <h6>{{ post.timeToPrepare }}</h6>
        </div>
      </div>
      <div class="link" :class="[{animate: animate}, {resetArrow:resetArrow}]" @click="openCard">
        View Recipe
        <i class="fa-solid fa-arrow-right"></i>
      </div>
    </div>
  </div>
  <dialog class="view" ref="modal" :class="{ close: modalClosed }">
    <i class="fa-solid fa-xmark" @click="closeModal"></i>
    <ViewRecipe :post="post" />
  </dialog>
</template>

<script>
import ViewRecipe from "./viewRecipe.vue";
export default {
  name: "RecipeCard",
  components: {
    ViewRecipe,
  },
  props: ["post"],
  data() {
    return {
      path: null,
      animate: false,
      hoverState: false,
      modalClosed: false,
      resetArrow: false,
    };
  },
  created(){
    this.setStore();
  },
  methods: {
    checkNoun(servings) {
      if (servings > 1) {
        return "People";
      }
      return "Person";
    },
    openCard() {
      this.animate = true;
      setTimeout(() => {
        this.$refs.modal.showModal();
      }, 600);
    },
    closeModal() {
      this.modalClosed = true;
      setTimeout(()=>{
        this.$refs.modal.close();
        this.modalClosed=false;
        this.resetingArrow();
      },400);
    },
    resetingArrow(){
      this.animate=false;
      this.resetArrow=true;
      setTimeout(() => {
        this.resetArrow = false;
      }, 1000);
    },
    setStore(){
      this.$store.commit("setRecipeValues", this.post);
    },
    editRecipe(){
      this.setStore();
      this.$router.push({ name: "EditRecipe" });
    },
    deleteRecipe(){
      this.$store.dispatch("deleteDocument", this.post.id);
    }
  },
  computed:{
    dateTime() {
      const date = this.post.date.toDate();
      return date.toLocaleDateString();
    },
  }
};
</script>

<style lang="scss" scoped>
.view {
  text-decoration:none;
  margin: auto;
  background: none;
  outline: none;
  border-radius: 8px;
  border: 1px solid #fff;
  background-color: #1e1e1e;
  box-shadow: 2px 2px 3px 1px #2c2c2c;
  z-index: 102;
  height: 80vh;
  max-height: 1000px;
  max-width: 500px;
  width: 80vw;
  justify-content: center;
  justify-self: center;
  &[open]{
    animation: open-modal 400ms normal;
    @keyframes open-modal {
      from {
        transform: scale(0%);
        opacity: 0;
      }
      to {
        transform: scale(100%);
        opacity: 100;
      }
    }
  }
  &.close {
    animation: closingModal 400ms normal;
    @keyframes closingModal {
      from {
        transform: scale(100%);
        opacity: 1;
      }
      to {
        transform: scale(0%);
        opacity: 0;
      }
    }
  }

  .fa-xmark {
    position: fixed;
    font-size: 50px;
    top: 15px;
    right: 15px;
    color: #fff;
    cursor: pointer;
    transition: 1s ease all;
    &:hover {
      transform: scale(1.1);
    }
  }
  &::backdrop {
    backdrop-filter: blur(10px);
  }
}
.blog-card {
  position: relative;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  border: 1px solid #f4d157;
  background-color: #1e1e1e;
  color: #f4d157;
  
  transition: 0.5s ease all;
  &:hover {
    transform: scale(1.01);
    box-shadow: 2px 2px 3px 1px #2c2c2c;
  }
  .img {
    overflow: hidden;
  }
  .icons {
    display: flex;
    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 99;
    .icon {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 35px;
      height: 35px;
      border: 0.1px solid #f4d157;
      border-radius: 50%;
      background-color: #1e1e1e;
      transition: 0.5s ease all;
      &:hover {
        background-color: #f4d157;
        border: 0.1px solid #1e1e1e;
        color: #1e1e1e;
      }
      &:nth-child(1) {
        margin-right: 8px;
      }
    }
  }
  img {
    display: block;
    border-radius: 8px 8px 0 0;
    z-index: 1;
    width: 100%;

    min-height: 200px;
    object-fit: cover;
    &.zoom {
      animation: zoom 2s forwards;
      @keyframes zoom {
        from {
          transform: scale(100%);
        }
        to {
          transform: scale(120%);
        }
      }
    }
  }
  .info {
    display: flex;
    flex-direction: column;
    height: 40%;
    z-index: 3;
    padding: 15px 16px;
    h4 {
      padding-bottom: 8px;
      font-size: 20px;
      font-weight: 300;
    }
    h6 {
      font-weight: 400;
      font-size: 12px;
    }
    .link {
      display: inline-flex;
      align-items: center;
      margin-top: 20px;
      font-weight: 500px;
      font-size: 12px;
      color: #757575;
      gap: 5px;
      transition: 0.5s ease-in all;
      &:hover {
        color: #d9d9d9;
        gap: 20px;
      }
    }
    .animate {
      animation: arrow-expand 600ms forwards;
      @keyframes arrow-expand {
        to {
          gap: 72%;
        }
      }
    }
    .resetArrow{
      animation: arrow-close 1000ms forwards;
      @keyframes arrow-close{
        from {
          gap: 72%;
        }
        to{
          gap:5px;
        }
      }
    }
    .more-info {
      display: flex;
      margin: 20px 0;
      flex-direction: row;
      width: 100%;
      gap: 30px;
      .serving,
      .prep-time {
        display: flex;
        gap: 5px;
      }
    }
  }
}
</style>
