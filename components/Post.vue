<script setup lang="ts">
import { ref } from 'vue';
import type { Post } from '~/defs/forum'
import PostText from './PostText.vue'

const MAX_LENGTH = 360;
// declare props
const props = defineProps<{
    post: Post
    selected?: boolean
    parent?: boolean
    preview?: boolean
    expand?: boolean
}>();
</script>

<template>
    <article class="post" :class="{selected, parent}">
        <p class="author">{{ post.author }}</p>
        <p class="date">({{ post.createdAt.toLocaleString() }})</p>
        <PostText :text="post.body" :enable_shorten="!expand" />
        <p v-if="!preview"><button v-on:click="$emit('reply')">Reply</button></p>
    </article>
</template>

<style scoped>
.post {
    width: 100%;
    padding: 1em;
    transition: background 0.2s;
    box-sizing: border-box;
    border-radius: 0.5em;
    border: 0.1em solid transparent;
}
.post:not(.parent) {
    background: #ffffff80;
    transition: background 0.8s;
    transition: transform 0.2s;
}
.post.parent {
    background: #ffffffff;
    transition: background 0.8s;
    box-shadow: 0.5em 0.5em 0.5em #00000040;
    transform: translate(-0.5em, -0.5em);
}
.post:not(.selected) {
    border-color: transparent;
}

.post.selected {
    border-color: black;
}

.post p {
    overflow-wrap: break-word;
    margin: 0.2em 0em;
}
.author {
    overflow: hidden;
    font-weight: bold;
}

.date {
    font-size: 0.8em;
    color: #555;
}
</style>~/defs/forum