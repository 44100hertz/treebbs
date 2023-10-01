<script setup lang="ts">
import { computed, ref } from 'vue';
const MAX_LENGTH = 360;
const MAX_LINES = 5;

const props = defineProps<{ text: string, enable_shorten?: boolean }>();

let shouldShorten = computed(() => {
    return props.text.length > MAX_LENGTH || props.text.split(/\n+/g).length > MAX_LINES;
});

let do_shorten = ref(props.enable_shorten);

let lines = computed(() => {
    if (shouldShorten.value && do_shorten.value) {
        let lines = props.text.substring(0, MAX_LENGTH).split(/\n+/).slice(0, MAX_LINES);
        lines[lines.length - 1] += '...';
        return lines;
    } else {
        return props.text.split(/\n+/g);
    }
});
</script>

<template>
    <p v-for="(line, index) in lines" class="postLine" :key="index">{{ line }}
    <button v-if="index == lines.length-1 && enable_shorten && shouldShorten" @click="do_shorten = !do_shorten">
        {{ do_shorten ? 'expand' : 'collapse' }}
    </button>
    </p>
</template>

<style scoped>
.postLine {
    overflow-wrap: break-word;
    margin: 0.5em 0em;
}
</style>