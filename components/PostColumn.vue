<script setup lang="ts">
import { type Post } from '~/defs/forum';
import PostElem from './Post.vue';

const props = defineProps<{
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

const scrollToPost = (index: number) => {
    const targetId = props.thread[index].id;
    const targetRef = `posts-${targetId}`;
    const elem = document.getElementById(targetRef);
    if (elem) {
        elem.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

defineExpose({ scrollToPost });
</script>

<template>
    <div class="postColumn" :style="{width: `calc((100% / ${columnCount}) - 1.5em)`}">
        <div v-for="(post, postIndex) in thread" class="postSlot" :key="post.id"
            @click="(e) => {
                scrollToPost(postIndex);
                emit('select', threadIndex, postIndex)
            }">
            <PostElem
            :post=post
            :parent="selection === postIndex"
            :selected="selected && selection === postIndex"
            :expand="threadIndex === 0"
            :id="`posts-${post.id}`"
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
    overflow-x: visible;
    overflow-y: scroll;
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