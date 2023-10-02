<script setup lang="ts">
import { type Post } from '~/defs/forum';
import PostElem from './Post.vue';

defineProps<{
    thread: Post[],
    threadIndex: number,
    selection: number | undefined,
    selected: boolean,
    columnCount: number
}>();

const emit = defineEmits<{
    (e: 'select', threadIndex: number, postIndex: number): void,
    (e: 'reply', threadIndex: number, postIndex: number): void
}>();

let posts = ref(null);

defineExpose({ posts });
</script>

<template>
    <div class="postColumn" :style="{width: `calc((100% / ${columnCount}) - 1.5em)`}">
        <div v-for="(post, postIndex) in thread" class="postSlot" :key="post.id" ref="posts"
            @click="emit('select', threadIndex, postIndex)">
            <PostElem
            :post=post
            :parent="selection === postIndex"
            :selected="selected && selection === postIndex"
            :expand="threadIndex === 0"
            @reply="emit('reply', threadIndex, postIndex)" />
        </div>
    </div>
</template>

<style>
@keyframes fadeIn {
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
}

.postColumn {
    height: 100vh;
    overflow: scroll;
    display: flex;
    padding: 0 0.5em;
    flex-direction: column;
    flex-shrink: 0;
}

.postSlot {
    padding: 0.5em 0;
    animation-name: fadeIn;
    animation-duration: 0.5s;
    animation-timing-function: ease-out;
}
</style>