<template>
  <div class="modal">
    <div class="modal-content">
      <p>{{ this.modalMessage }}</p>
      <button @click="closeModal">Close</button>
    </div>
  </div>
</template>

<script>
export default {
  props: ["modalMessage"],
  methods: {
    closeModal() {
      this.$emit("close-modal");
    },
  },
};
</script>

<style lang="scss" scoped>
.modal {
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 101;
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  background-color: rgba(0, 0, 0, 0.7);
  .modal-content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    border-radius: 8px;
    width: 300px;
    padding: 40px 30px;
    background-color: #fff;
    p {
      text-align: center;
      margin-bottom: 30px;
    }
    button {
      align-self: center;
      text-align: center;
      width: 60%;
      font-weight: 800;
      font-size: large;
      border-radius: 20px;
      background-color: #f4d157;
      border: 0;
      box-shadow: 0px 0px 0px 2px #000;
      color: #1e1e1e;
      cursor: pointer;
      transition: ease-out 0.3s;
      &:hover {
        background-color: #1e1e1e;
        box-shadow: 0px 0px 0px 2px #f4d157;
        color: #f4d157;
      }
    }
  }
}
</style>
