<template>
  <div class="blog-card-view">
    
    <div class="image">
      <img :src="post.imageURL" alt="" />
    </div>
    <div class="info">
      <h4>{{ post.title }}</h4>
      <div class="general">
        <h6>Posted on: {{ dateTime }}</h6>
        <h6>Created By {{ this.$store.state.profileUserName }}</h6>
      </div>
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
        <div class="ingridients">
          <i class="fa-solid fa-plate-wheat"></i>
          <h6>{{ post.ingredients.length }} ingridients</h6>
        </div>
      </div>
      <div class="description">
        <p>
          {{ post.description }}
        </p>
      </div>
    </div>
    <div class="video-container">
      <p>Video Tutorial</p>
      <div class="video">
        <iframe width="100%" :src="post.youTubeURL"> </iframe>
      </div>
    </div>
    <div class="container">
      <div class="left">
        <div class="ingredients">
          <p>Ingredients</p>
          <ul>
            <li v-for="ingredient in post.ingredients">
              {{ ingredient.name }}: {{ ingredient.value
              }}{{ ingredient.units }}
            </li>
          </ul>
        </div>
        <div class="nuitrition">
        <p>Steps</p>
        <ul>
          <li v-for="(step, index) in post.steps" :key="index">
            Step {{ index + 1 }}: {{ step.text }}
          </li>
        </ul>
      </div>
      </div>
      
    </div>
  </div>
</template>

<script>
export default {
  name: "ViewRecipe",
  props: ["post"],
  data() {
    return {
      cardImage: null,
      path: null,
      ingredients: ["Flour", "Sugar", "Eggs", "Butter", "Vanilla extract"],
      nuitritions: [
        { name: "Calories", value: 285 },
        { name: "Fat", value: 12 },
        { name: "Carbohydrates", value: 36 },
        { name: "Protein", value: 11 },
        { name: "Sodium", value: 590 },
      ],
      pizzaSteps: [
        "Preheat the oven to 450°F",
        "Roll out the pizza dough",
        "Spread sauce on the dough",
        "Add your favorite toppings",
        "Bake the pizza in the oven for 12-15 minutes",
        "Remove the pizza from the oven",
        "Slice and enjoy!",
      ],
    };
  },
  methods: {
    getSrc(photo) {
      const path = `../assets/Cards/${photo}.jpg`;
      const modules = import.meta.globEager("../assets/Cards/*.jpg");
      return modules[path].default;
    },
    checkNoun(servings) {
      if (servings > 1) {
        return "People";
      }
      return "Person";
    },
  },
  computed: {
    userName() {
      this.$store.dispatch("getUserName", this.post.userID);
      return this.$store.state.recipeUsername;
    },
    dateTime() {
      const date = this.post.date.toDate();
      return date.toLocaleDateString();
    },
  },
};
</script>

<style lang="scss" scoped>
.blog-card-view {
  position: relative;
  display: flex;
  flex-direction: column;
  padding-bottom: 30px;
  color: #fff;
  overflow: hidden;
  transition: 0.5s ease all;
  .container {
    display: flex;
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
      border: 0.1px solid #fff;
      border-radius: 50%;
      background-color: #1e1e1e;
      transition: 0.5s ease all;
      &:hover {
        background-color: #fff;
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
    transition: 2s;
    &:hover {
      transform: scale(1.2);
    }
  }
  .image {
    overflow: hidden;
    display: flex;
  }
  .info {
    display: flex;
    flex-direction: column;
    height: 40%;
    z-index: 3;
    padding: 15px 30px;
    .description {
      text-align: justify;
      border-top: 1px solid;
      border-bottom: 1px solid;
      padding: 20px 0;
      p{
        width:100%;
        display:inline;
      }
    }
    h4 {
      padding-bottom: 8px;
      font-size: 30px;
      font-weight: 600;
      text-align: center;
    }
    h6 {
      font-weight: 400;
      font-size: 15px;
      @media (min-width: 500px) {
        font-size: 12px;
      }
    }
    .general {
      justify-content: center;
      display: flex;
      gap: 100px;
    }
    .more-info {
      display: flex;
      margin: 20px 0;
      flex-direction: row;
      width: 100%;
      align-items: center;
      justify-content: center;
      gap: 30px;
      .serving,
      .prep-time,
      .ingridients {
        display: flex;
        gap: 5px;
      }
    }
  }
  .container {
    padding: 10px 30px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    @media (min-width: 600px) {
      flex-direction: row;
      gap: 20px;
    }
    p {
      display: flex;
      margin-bottom: 10px;
      font-size: 20px;
      font-weight: 600;
      border: 2px solid;
      border-image-slice: 1;
      border-width: 3px;
      border-top: 0;
      border-left: 0;
      border-right: 0;
      border-image-source: linear-gradient(to left, #1e1e1e, #f4d157);
    }
    ul {
      list-style-type: none;
    }
    .left {
      gap: 20px;
      width: 100%;
      display: flex;
      flex-direction: column;
      p {
        width: 120px;
        justify-self: center;
        align-self: center;
      }
      ul {
        font-size: 16px;
      }
    }
  }
  .video-container {
    display: flex;
    flex-direction: row;
    margin: 0 30px;
    padding-bottom: 15px;
    border-bottom: 1px solid;
    display: flex;
    flex-direction: column;
    gap: 10px;
    @media (min-width: 600px) {
      flex-direction: row;
      gap: 20px;
    }
    p {
      display: block;
      justify-self: center;
      margin: auto;
      font-size: 20px;
      font-weight: 600;
    }
    iframe {
      display: flex;
    }
  }
}
</style>
