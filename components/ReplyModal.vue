<script setup lang="ts">
import { ref, watch, type Ref } from 'vue'
import { type Post, type PostCreate, type PostId, MAX_AUTHOR_LEN, MAX_TEXT_LEN } from '~/defs/forum'
import PostElem from './Post.vue'

const emit = defineEmits<{ (e: 'reply', post: PostCreate): void }>()

let replyTo: Ref<Post | null> = ref(null);
let replyModal = ref({ showModal: () => null, close: () => null });
let replyText = ref('');
let replyAuthor = ref('Anonymous');

watch(replyAuthor, (author) => {
    if (author.length > MAX_AUTHOR_LEN) {
        replyAuthor.value = author.substring(0, MAX_AUTHOR_LEN);
    }
});

watch(replyText, (text) => {
    if (text.length > MAX_TEXT_LEN) {
        replyText.value = text.substring(0, MAX_TEXT_LEN);
    }
});

function showModal(post: Post) {
    replyTo.value = post;
    replyModal.value.showModal();
}

function cancel() {
    replyTo.value = null;
    replyModal.value.close();
}

function active() {
    return replyTo.value !== null;
}

function doReply() {
    let post: PostCreate = {
        author: replyAuthor.value.substring(0, 64),
        body: replyText.value,
        parentId: replyTo.value?.id as PostId,
    }
    emit('reply', post);
    replyText.value = '';
    cancel();
}

defineExpose({ showModal, active });

window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        cancel();
    }
});
</script>

<template>
    <dialog class="replyModal" ref="replyModal">
        <div v-if="replyTo">
            <div>
                <div class="center">Composing a reply to:</div>
                <PostElem :post="replyTo" :selected="true" :preview="true" />
            </div>
            <form>
                <div class="flexRow">
                    Name:
                    <input type="text" v-model="replyAuthor" placeholder="Anonymous" />
                </div>
                <textarea v-model="replyText"></textarea>
                <div class="flexRow">
                    <button @click="doReply" :disabled="replyText.length === 0">Reply</button>
                    <button @click="cancel">Cancel</button>
                </div>
            </form>
        </div>
    </dialog>
</template>

<style>
.center {
    text-align: center; 
}
.replyModal {
    background: #ffffff80;
    backdrop-filter: blur(0.2em);
    border-radius: 1em;
    max-width: 600px;
}
textArea {
    width: 100%;
    height: 8em;
    box-sizing: border-box;
    max-width: 600px;
}

.flexRow {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 0.5em;
    margin: 0.5em 0;
}
</style>