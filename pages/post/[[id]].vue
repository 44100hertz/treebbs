<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import type { Post, PostCreate } from '~/defs/forum'
import PostColumn from '~/components/PostColumn.vue'
import ReplyModal from '~/components/ReplyModal.vue'

definePageMeta({
    title: 'Forum',
    description: 'Experimental forum',
    layout: 'forum',
})

type Thread = {
    posts: Post[],
    subthreads: Thread[],
}

const root = reactive<Thread>({
    posts: await getReplies(0),
    subthreads: [],
});
const selection = reactive([0]);
const scrollAnimation = ref(null as null | 'left' | 'right');

async function getReplies(id: number): Promise<Post[]> {
    return $fetch('/api/thread', {key: id, method: 'GET', query: {which: 'replies', id}});
}

async function addPost(contents: PostCreate) {
    await $fetch('/api/createPost', {method: 'POST', body: contents});
}

// Recurse over the thread tree into the desired selection
const getSelectedThreads = async (thread: Thread, selection: number[]): Promise<Thread[]> => {
    const out = [thread];
    for (let index of selection) {
        if (!thread.subthreads[index]) {
            const posts = await getReplies(thread.posts[index].id as any);
            thread.subthreads[index] = {
                posts, 
                subthreads: [],
            }
        }
        thread = thread.subthreads[index];
        out.push(thread);
    }
    return out;
}

const currentThreads = reactive([root]);

watch(selection, async () => {
    Object.assign(currentThreads, await getSelectedThreads(root, selection));
}, { immediate: true });

// Reload all threads from server
async function reload() {
    root.subthreads = [];
    Object.assign(currentThreads, await getSelectedThreads(root, selection));
}

window.addEventListener('keydown', (e) => {
    if (replyModal.value.active()) {
        return;
    }

    if (e.key === 'F5') {
        reload();
        e.preventDefault();
    } else if (e.key === 'ArrowLeft') {
        if (selection.length > 1) {
            selection.pop()
            if (selection.length >= columnCount.value-1) {
                scrollAnimation.value = 'right';
                setTimeout(() => {
                    scrollAnimation.value = null;
                }, 200);
            }
            currentThreads.pop();
            e.preventDefault();
        }
    } else if (e.key === 'ArrowRight') {
        if (currentThreads[selection.length].posts.length > 0) {
            selection.push(0);
            if (selection.length >= columnCount.value) {
                scrollAnimation.value = 'left';
                setTimeout(() => {
                    scrollAnimation.value = null;
                }, 200);
            }
            e.preventDefault();
        }
    } else if (e.key === 'ArrowUp') {
        const selectHead = selection[selection.length - 1];
        if (selectHead > 0) {
            selection[selection.length - 1]--;
            e.preventDefault();
        }
    } else if (e.key === 'ArrowDown') {
        const selectHead = selection[selection.length - 1];
        if (selectHead < currentThreads[selection.length - 1].posts.length - 1) {
            selection[selection.length - 1]++;
            e.preventDefault();
        }
    }
})

const replyModal = ref({ showModal: (post: Post) => null, active: () => false });
function showReply(post: Post) {
    replyModal.value.showModal(post);
}

async function addReply(contents: PostCreate) {
    await addPost(contents);
    reload();
}

const columnCount = ref(3);

function setColumnCount() {
    const postWidth = 300
    const span = Math.max(2, Math.floor(window.innerWidth / postWidth))
    columnCount.value = span
}

setColumnCount();
window.addEventListener('resize', setColumnCount);

function getVisibleThreads() {
    const span = columnCount.value
    return currentThreads
        .map((thread: Thread, index: number) => [thread, index] as any)
        .slice(Math.max(0, selection.length-span+1), selection.length+1)
}

</script>

<template>
    <ReplyModal ref="replyModal" @reply="addReply"></ReplyModal>
        <div class="board" :class="{
            shiftLeft: scrollAnimation == 'left',
            shiftRight: scrollAnimation == 'right'
        }">
            <PostColumn v-for="[thread, threadIndex] in getVisibleThreads()" class="thread"
            :columnCount="columnCount"
            :key="threadIndex"
            :thread="thread.posts"
            :threadIndex="threadIndex"
            :selection="selection[threadIndex]"
            :selected="threadIndex === selection.length - 1"
            v-on:select="(threadIndex, postIndex) => {
                selection[threadIndex] = postIndex;
                selection.length = threadIndex + 1;
            }"
            v-on:reply="(threadIndex, postIndex) => {
                showReply(currentThreads[threadIndex].posts[postIndex]);
            }" />
</div>
</template>

<style scoped>
@keyframes shiftRight {
    from { transform: translate(max(-300px, -50vw), 0); }
    to { transform: translate(0, 0); }
}
@keyframes shiftLeft {
    from { transform: translate(min(300px, 50vw), 0); }
    to { transform: translate(0, 0); }
}
.shiftRight {
    animation-name: shiftRight;
    animation-duration: 0.2s;
    animation-timing-function: ease-out;
}
.shiftLeft {
    animation-name: shiftLeft;
    animation-duration: 0.2s;
    animation-timing-function: ease-out;
}
.board {
    display: flex;
    flex-direction: row;
    width: 100%;
}
</style>