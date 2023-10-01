<template>
  <header>
    TREEBBS
    <hr>
  </header>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
<style>
body {
  background: #bbf0f0;
}

button {
  background: linear-gradient(#ffffff, #dddddd);
  border: 0.2em outset #eeeeee;
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