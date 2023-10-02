<script setup lang="ts">
import { ref, watch, type Ref } from 'vue'
import { type Post, type PostCreate, type PostId } from '~/defs/forum'
import { validate } from '~/defs/validate'
import PostElem from './Post.vue'

const emit = defineEmits<{ (e: 'reply', post: PostCreate): void }>()

let replyTo: Ref<Post | null> = ref(null);
let replyModal = ref({ showModal: () => null, close: () => null });
let replyText = ref('');
let replyAuthor = ref('Anonymous');
let badReply = ref(undefined as undefined | string);

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
    const invalid = validate(replyAuthor.value, replyText.value);
    if (invalid) {
        badReply.value = invalid;
        return;
    }
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
            <div>
                <div class="flexRow">
                    Name:
                    <input type="text" v-model="replyAuthor" placeholder="Anonymous" />
                </div>
                <textarea v-model="replyText"></textarea>
                <div class="flexRow">
                    <button @click="doReply">Reply</button>
                    <button @click="cancel">Cancel</button>
                </div>
            </div>
            <div class="warn">{{ badReply ? `cannot submit: ${badReply}.` : '' }}</div>
        </div>
    </dialog>
</template>

<style>
.center {
    text-align: center; 
}
.replyModal {
    border: none;
    border-radius: 2em;
    padding: 2em;
    background: #eeeeeec0;
    box-shadow: 0.5em 0.5em 1.0em #00000040;
    backdrop-filter: blur(0.2em);
    max-width: min(100vw, 600px);
    box-sizing: border-box;
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

.warn {
    color: #f00;
    height: 1.2em;
}
</style>