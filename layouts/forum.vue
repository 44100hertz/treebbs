<template>
  <div>
    <slot />
  </div>
</template>
<style>
@import url('https://fonts.googleapis.com/css2?family=Alegreya+Sans:wght@400;700&display=swap');
body {
  background: url("/bg.png");
  background-attachment: fixed;
  background-size: cover;
  font-family: 'Alegreya Sans', sans-serif;
  letter-spacing: 0.03em;
}

textarea {
  font-family: 'Alegreya Sans', sans-serif;
  letter-spacing: 0.03em;
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