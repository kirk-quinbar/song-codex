<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
const formRef = ref();

const apiError = ref('');
const loading = ref(false);
const email = ref('');
const emailRules = ref([(v: string) => !!v || 'E-mail is required', (v: string) => /.+@.+\..+/.test(v) || 'E-mail must be valid']);

async function submit() {
    apiError.value = ''

    const formResult = await formRef.value.validate()

    if (!formResult.valid) {
        return
    }

    loading.value = true;
    const result = await authStore.sendPasswordResetEmail(email.value);

    loading.value = false;
    apiError.value = result;
    
}

</script>
<template>
    <v-form ref="formRef" class="mt-8" @submit.prevent="submit">
        <v-label class="text-body-large font-weight-medium pb-2 text-lightText">Email Address</v-label>
        <v-text-field v-model="email" :rules="emailRules" ></v-text-field>
        <v-btn size="large" :loading="loading" color="primary" block type="submit" >Forgot Password</v-btn>
        <v-alert v-if="apiError" type="error" variant="tonal" class="mb-4">{{ apiError }}</v-alert>
    </v-form>
</template>
