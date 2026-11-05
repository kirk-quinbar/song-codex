<script setup lang="ts">
import { RouterLink } from 'vue-router';
import logo from '@/assets/images/logos/song_codex_logo_white.jpg';
</script>
<template>
    <div class="logo">
        <RouterLink to="/">
            <img :src="logo" alt="home" width="250" />
        </RouterLink>
    </div>
</template>
