<template>
  <SearchFocus @keyup="focusSearch" />
  <div class="Home">
    <div class="image">
      <div class="text-container">
        <h1 v-if="!user">Welcome!</h1>
        <h3 v-else>
          Welcome,
          <div class="username">{{ username }}</div>
          !
        </h3>
        <div class="switching-text">
          <h2>Let's Cook Something</h2>
          <div class="scroll">
            <span>Incredible</span>
            <span class="gradient-text B">Incredibile</span>
            <span class="gradient-text C">Unglaublich</span>
            <span class="gradient-text D">Incroyable</span>
          </div>
        </div>
        <div class="search-container">
          <input
            type="text"
            placeholder="What would you like to cook?"
            v-model="value"
            ref="search"
          />
          ><i class="fa-solid fa-magnifying-glass" @click="searchFunction"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SearchFocus from "../components/SearchFocus.vue";
export default {
  name: "Home",
  components: { SearchFocus },
  data() {
    return {
      windowWidth: null,
      value: "",
    };
  },
  methods: {
    checkScreen() {
      this.windowWidth = window.innerWidth;
    },
    focusSearch(e) {
      if (e.key === "/") {
        this.$refs.search.focus();
      }
      if (this.value !== "" && e.key === "Enter") {
        this.searchFunction();
      }
    },
    searchFunction() {
      this.$store.commit("updateSearch", this.value);
      this.$router.push("/search");
    },
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
    username() {
      return this.$store.state.profileUserName;
    },
  },
  created() {},
};
</script>

<style lang="scss" scoped>
span {
  font-weight: 600;
}
.gradient-text {
  background-color: #fff;
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
  -webkit-text-stroke-width: 0px;
  -webkit-text-stroke-color: #c0c0c0;
  filter: brightness(4);
}
.B {
  background-image: linear-gradient(
    to right,
    #009246 calc(100% / 3),
    white calc(100% / 3),
    white calc(100% / 3 * 2),
    #ce2b37 calc(100% / 3 * 2)
  );
}
.C {
  background-image: linear-gradient(
    to bottom,
    black calc(100% / 3),
    #dd0000 calc(100% / 3),
    #dd0000 calc(100% / 3 * 2),
    #ffce00 calc(100% / 3 * 2)
  );
}
.D {
  background-image: linear-gradient(
    to right,
    #002395 calc(100% / 3),
    white calc(100% / 3),
    white calc(100% / 3 * 2),
    #ed2939 calc(100% / 3 * 2)
  );
}
.Home {
  height: 89vh;
}
.switching-text {
  display: flex;
  flex-direction: row;
  font-size: 16px;
  height: 20px;
  padding: 0px;
  overflow: hidden;
  position: relative;
  @media (min-width: 600px) {
    font-size: 24px;
    height: 30px;
  }
  h2 {
    margin-right: 5px;
  }
}
.switching-text .scroll {
  display: flex;
  flex-direction: column;
  margin-left: 2px;
  color: white;
  font-weight: 400;
  text-shadow: 0 0 3px black;
  text-align: start;
  transform: translateY(0px);
  animation: jumpy-text-sm 12s infinite;
  @media (min-width: 600px) {
    animation: jumpy-text 12s infinite;
  }

  @keyframes jumpy-text {
    10% {
      transform: translateY(-35px);
    }
    20% {
      transform: translateY(-30px);
    }
    35% {
      transform: translateY(-65px);
    }
    45% {
      transform: translateY(-60px);
    }
    60% {
      transform: translateY(-95px);
    }
    70% {
      transform: translateY(-90px);
    }
    80% {
      transform: translateY(5px);
    }
  }
  @keyframes jumpy-text-sm {
    10% {
      transform: translateY(-24px);
    }
    20% {
      transform: translateY(-20px);
    }
    35% {
      transform: translateY(-44px);
    }
    45% {
      transform: translateY(-40px);
    }
    60% {
      transform: translateY(-64px);
    }
    70% {
      transform: translateY(-60px);
    }
    85% {
      transform: translateY(4px);
    }
  }
}
.image {
  display: flex;
  background-image: url("@/assets/Images/background.jpg");
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  width: 100%;
  height: 100vh;
  top: 0;
  position: absolute;
  .text-container {
    display: flex;
    width: 70%;
    text-align: center;
    margin: auto;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    transform: scale(1.3);
    @media (min-width: 750px) {
      transform: scale(1.3);
    }
    h1 {
      color: #ffffff;
      font-size: 24px;
      @media (min-width: 600px) {
        font-size: 36px;
      }
    }
    h2 {
      color: #ffffff;
      font-size: 14px;
      @media (min-width: 600px) {
        font-size: 24px;
      }
    }
    h3 {
      color: #ffffff;
      font-size: 14px;
      display: flex;
      @media (min-width: 600px) {
        font-size: 21px;
      }
      .username {
        margin-left: 5px;
        color: #f98181;
      }
    }
  }
  .search-container {
    position: relative;
    margin: auto;
    justify-content: center;
    width: 100%;
    padding: 0;
    input {
      height: 35px;
      width: 100%;
      font-size: 12px;
      margin-top: 10px;
      border-radius: 50px;
      padding: 10px 45px 10px 15px;
      outline: none;
      max-width: 300px;
      @media (min-width: 600px) {
        height: 40px;
        width: 100%;
        max-width: 400px;
        font-size: 16px;
      }
    }
    .link {
      position: relative;
      .fa-magnifying-glass {
        cursor: pointer;
        position: absolute;
        font-size: 20px;
        top: 0px;
        right: 16px;
        transition: 300ms ease;
        &:hover {
          font-size: 22px;
        }
      }
    }
  }
}
</style>
