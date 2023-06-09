<template>
  <SearchFocus @keyup="focusSearch" />
  <div class="recipe-card-wrapper">
    <h1>My Recipes</h1>
    <div class="reacipe-card-container">
      <div class="search-container">
        <input
          type="text"
          placeholder="What would you like to cook? (Search Recipes and Ingridients) [press ' / ' to search]"
          v-model="query"
          ref="search"
        />
        <i class="fa-solid fa-magnifying-glass"></i>
      </div>
      <div class="noResults">
        <span v-if="query.length > 0">No results for '{{ query }}'</span>
      </div>

      <div class="recipe-cards">
        <RecipeCard
          :post="post"
          v-for="(post, index) in recipes"
          :key="index"
        />
      </div>
    </div>
  </div>
</template>

<script>
import RecipeCard from "@/components/RecipeCard.vue";
import Fuse from "fuse.js";
import SearchFocus from "../components/SearchFocus.vue";

export default {
  name: "MyRecipe",
  components: { RecipeCard, SearchFocus },
  data() {
    return {
      query: "",
      noResults: false,
      sampleCards: [
        {
          title: "Pepperoni Pizza",
          photo: "stock-1",
          date: "June 5, 2023",
          servings: 5,
          preparation: "1h 30min",
        },
        {
          title: "Hawaiian Pizza",
          photo: "stock-2",
          date: "June 4, 2023",
          servings: 5,
          preparation: "1h 30min",
        },
        {
          title: "Fried Chicken",
          photo: "stock-3",
          date: "June 5, 2023",
          servings: 3,
          preparation: "1h 30min",
        },
        {
          title: "CheeseBurger",
          photo: "stock-4",
          date: "June 6, 2023",
          servings: 1,
          preparation: "1h 30min",
        },
      ],
      recipes: [],
    };
  },
  methods: {
    focusSearch(e) {
      if (e.key === "/") {
        this.$refs.search.focus();
      }
    },
  },

  computed: {
    async retrieveQuery() {
      const fuse = new Fuse(this.sampleCards, {
        keys: ["title"],
      });
      const searchResults = fuse.search(this.query);
      return searchResults;
    },
    recipes() {
      return this.$store.state.recipes;
    },
  },
  watch: {
    query(newquery) {
      console.log(this.$store.state.recipes);
    },
  },
};
</script>

<style lang="scss" scoped>
.noResults {
  margin-bottom: 30px;
}
span {
  margin: 20px 30px;
  width: 100%;
  color: white;
  font-weight: 600;
  font-size: 20px;
}
.recipe-card-wrapper {
  background-image: url("../assets/Images/Reset.png");
  height: 100%;
  h1 {
    margin: auto;
    color: #fff;
    margin-top: -20px;
    margin-bottom: 20px;
    text-align: center;
    font-size: 40px;
  }
  .search-container {
    position: relative;
    width: 100%;
    padding: 0;
    margin-bottom: 30px;
    input {
      height: 35px;
      width: 100%;
      font-size: 12px;
      border-radius: 10px;
      padding: 10px 45px 10px 15px;
      outline: none;
      @media (min-width: 600px) {
        height: 40px;
        width: 100%;
        font-size: 16px;
      }
    }
    .fa-magnifying-glass {
      cursor: pointer;
      position: absolute;
      font-size: 20px;
      top: 6px;
      right: 16px;
      transition: 300ms ease;
      &:hover {
        font-size: 22px;
      }
      @media (min-width: 700px) {
        font-size: 30px;
        &:hover {
          font-size: 31px;
        }
      }
    }
  }
}
</style>
