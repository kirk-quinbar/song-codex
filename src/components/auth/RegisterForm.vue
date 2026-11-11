<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
const formRef = ref();
const password = ref('');
const email = ref('');
const apiError = ref('');
const loading = ref(false);

const passwordRules = ref([
    (v: string) => !!v || 'Password is required',
    (v: string) => (v && v.length >= 8) || 'Password must be at least 8 characters'
]);
const emailRules = ref([(v: string) => !!v || 'E-mail is required', (v: string) => /.+@.+\..+/.test(v) || 'E-mail must be valid']);
const displayName = ref('');
const displayNameRules = ref([
    (v: string) => !!v || 'Display Name is required',
    (v: string) => (v && v.length <= 100) || 'Display Name must be less than 100 characters'
]);

async function submit() {
    apiError.value = ''

    const formResult = await formRef.value.validate()

    if (!formResult.valid) {
        return
    }

    loading.value = true;
    const result = await authStore.register(email.value, password.value, displayName.value);

    loading.value = false;
    apiError.value = result;
}

</script>
<template>
    <v-form ref="formRef" class="mt-5" @submit.prevent="submit">
        <v-label class="text-body-large font-weight-medium pb-2">Display Name</v-label>
        <v-text-field v-model="displayName" :rules="displayNameRules" required></v-text-field>
        <v-label class="text-body-large font-weight-medium pb-2">Email Address</v-label>
        <v-text-field v-model="email" :rules="emailRules" required></v-text-field>
        <v-label class="text-body-large font-weight-medium pb-2">Password</v-label>
        <v-text-field v-model="password" :rules="passwordRules" type="password" class="pwdInput"></v-text-field>
        <v-btn size="large" class="mt-2" color="primary" block type="submit">Sign Up</v-btn>
        <v-alert v-if="apiError" type="error" variant="tonal" class="mb-4">{{ apiError }}</v-alert>
    </v-form>
</template>
