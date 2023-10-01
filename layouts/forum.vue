<template>
  <header>
    TREEBBS
    <hr>
  </header>
  <div>
    <slot />
  </div>
</template>
<style>
body {
  background: #8bc0b0;
}

button {
  background: #eeeeee;
  border: 0.2em outset #ffffff;
  border-radius: 0.2em;
  padding: 0.3em 0.5em;
  cursor: pointer;
}

button:hover {
  text-decoration: underline;
}

button:active {
  border-style: inset;
  background: linear-gradient(#dddddd, #ffffff);
}
</style>