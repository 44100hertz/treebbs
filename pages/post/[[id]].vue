<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import type { Post, PostCreate } from '~/defs/forum'
import PostElem from '~/components/Post.vue'
import ReplyModal from '~/components/ReplyModal.vue'

type Thread = {
    posts: Post[],
    subthreads: Thread[],
}

const root = reactive<Thread>({
    posts: await getReplies(0),
    subthreads: [],
});
const selection = reactive([0]);

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
async function refresh() {
    root.subthreads = [];
    Object.assign(currentThreads, await getSelectedThreads(root, selection));
}

window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        if (selection.length > 1) {
            selection.pop()
        }
    } else if (e.key === 'ArrowRight') {
        if (currentThreads[selection.length].posts.length > 0) {
            selection.push(0);
        }
    } else if (e.key === 'ArrowUp') {
        if (selection[selection.length - 1] > 0) {
            selection[selection.length - 1]--;
        }
    } else if (e.key === 'ArrowDown') {
        if (selection[selection.length - 1] < currentThreads[selection.length - 1].posts.length - 1) {
            selection[selection.length - 1]++;
        }
    }
})

const replyModal = ref({ showModal: (post: Post) => null });
function showReply(post: Post) {
    replyModal.value.showModal(post);
}

async function addReply(contents: PostCreate) {
    await addPost(contents);
    refresh();
}

function getVisibleThreads() {
    return currentThreads
        .map((thread: Thread, index: number) => [thread, index] as any)
        .slice(Math.max(0, selection.length-4), selection.length+1)
}
</script>

<template>
    <ReplyModal ref="replyModal" @reply="addReply"></ReplyModal>
    <div class="board">
        <div v-for="[thread, threadIndex] in getVisibleThreads()" class="thread"
            :key="currentThreads[threadIndex - 1]?.posts?.[selection[threadIndex - 1]]?.id">
            <div v-for="(post, postIndex) in thread.posts" class="postSlot" :key="post.id"
                @click="selection[threadIndex] = postIndex; selection.length = threadIndex+1">
                <PostElem :post=post
                    :parent="selection[threadIndex] === postIndex"
                    :selected="selection.length-1 === threadIndex && selection[threadIndex] === postIndex"
                    :expand="threadIndex === 0"
                    @reply="showReply(post)" />
            </div>
        </div>
    </div>
</template>

<style scoped>
.board {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
}

.thread {
    width: calc((100% - 5em) / 5);
    display: flex;
    padding: 0 0.5em;
    flex-direction: column;
}

.postSlot {
    width: 100%;
    padding: 0.5em 0;
}
</style>~/defs/forum