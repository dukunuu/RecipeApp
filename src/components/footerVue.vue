<template>
  <footer>
    <div class="container">
      <div class="left">
        <div class="col-1">
          <router-link class="header" to="#">Recipe</router-link>
          <ul>
            <li>
              <a href=""><i class="fab fa-instagram"></i></a>
            </li>
            <li>
              <a href=""><i class="fab fa-linkedin"></i></a>
            </li>
            <li>
              <a href=""><i class="fab fa-youtube"></i></a>
            </li>
            <li>
              <a href=""><i class="fab fa-twitter"></i></a>
            </li>
          </ul>
        </div>
        <div class="col-2">
          <ul>
            <router-link class="link" to="#">Home</router-link>
            <router-link class="link" to="#">About</router-link>
          </ul>
        </div>
      </div>
      <div class="right">
        <p>Copyright 2023 All Rights Reserved</p>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: "footerVue",
  computed: {},
};
</script>

<style lang="scss" scoped>
footer {
  z-index: 100;
  margin-top: auto;
  padding: 50px 25px;
  background-color: rgba(0, 0, 0, 1);
  text-align: justify;
  @media (min-width: 900) {
    text-align: justify;
  }
}
.container {
  display: flex;
  flex-direction: column;
  gap: 32px;
  @media (min-width: 800px) {
    flex-direction: row;
    gap: 0px;
  }

  > div {
    display: flex;
    flex: 1;
  }

  .left {
    gap: 32px;
    color: #fff;
    display: flex;
    flex-direction: column;
    align-items: center;
    @media (min-width: 800px) {
      flex-direction: row;
      align-items: initial;
      gap: 0;
    }

    .header {
      font-size: 24px;
      color: #fff;
      text-decoration: none;
      font-weight: 600;
    }
    ul {
      gap: 16px;
      list-style: none;
      display: flex;

      i {
        font-size: 24px;
        color: #fff;
      }
    }

    .col-1,
    .col-2 {
      gap: 32px;
      display: flex;
      flex: 1;
      @media (min-width: 800px) {
        gap: 0;
      }
    }

    .col-1 {
      flex-direction: column;

      h2 {
        text-align: center;
        @media (min-width: 800px) {
          text-align: initial;
        }
      }
      ul {
        margin-top: auto;
      }
    }

    .col-2 {
      ul {
        height: 100%;
        justify-content: center;
        flex-direction: row;
        flex-wrap: wrap;
        @media (min-width: 800px) {
          flex-direction: column;
        }
        .link {
          font-size: 16px;
          font-weight: 500;
          color: #fff;
          text-decoration: none;
        }
      }
    }
  }

  .right {
    gap: 32px;
    color: #fff;
    align-items: center;
    flex-direction: column;
    @media (min-width: 800px) {
      align-items: flex-end;
      gap: 0;
    }
  }

  p {
    margin-top: auto;
  }
}
</style>
