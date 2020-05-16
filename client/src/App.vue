<template>
  <div id="app">
      <router-view/>
  </div>
</template>

<script>
  export default {
    name: 'app'
  }
</script>

<style lang="scss">
  * {
    margin: 0;
    padding: 0;
  }

   .verify-code{
     cursor: pointer;
   }

  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }

  .form {
    width: 600px;
    margin: auto;
    box-sizing: border-box;
    box-shadow: 0 0 30px #ccc;
    padding: 20px 60px 20px 30px;

    h1{
      margin-bottom: 20px;
    }

    .router-link {
      text-align: right;
    }
  }
</style>
