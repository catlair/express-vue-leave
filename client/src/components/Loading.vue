<template>
  <div class="loading">
    <div class="base">
      <div class="cube"></div>
      <div class="cube"></div>
      <div class="cube"></div>
      <div class="cube"></div>
      <div class="cube"></div>
      <div class="cube"></div>
      <div class="cube"></div>
      <div class="cube"></div>
      <div class="cube"></div>
    </div>
    <p class="msg">正在加载...</p>
  </div>
</template>

<script>
  export default {
    name: "Loading"
  }
</script>

<style lang="scss">
  .loading {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    min-width: 800px;
    height: 600px;
    min-height: 400px;
    z-index: 9;

    .msg {
      font-size: 26px;
      color: #000;
      position: absolute;
      top: 50%;
      left: 50%;
      margin: 120px auto auto -50px;
    }
  }

  .base {
    height: 9em;
    left: 50%;
    margin: -7.5em;
    padding: 3em;
    position: absolute;
    top: 50%;
    width: 9em;
    transform: rotateX(45deg) rotateZ(45deg);
    transform-style: preserve-3d;

    .cube,
    .cube:after,
    .cube:before {
      content: '';
      float: left;
      height: 3em;
      position: absolute;
      width: 3em;
    }

    .cube {
      background-color: #05afd1;
      position: relative;
      transform: translateZ(3em);
      transform-style: preserve-3d;
      transition: .25s;
      box-shadow: 13em 13em 1.5em rgba(0, 0, 0, 0.1);
      animation: anim 1s infinite;
    }

    .cube:after {
      background-color: #049dbc;
      transform: rotateX(-90deg) translateY(3em);
      transform-origin: 100% 100%;
    }

    .cube:before {
      background-color: #048ca7;
      transform: rotateY(90deg) translateX(3em);
      transform-origin: 100% 0;
    }

    @for $i from 1 through 9 {
      .cube:nth-child(#{$i}) {
        animation-delay: $i * .05s;
      }
    }

    @keyframes anim {
      50% {
        transform: translateZ(0.5em);
      }
    }
  }
</style>