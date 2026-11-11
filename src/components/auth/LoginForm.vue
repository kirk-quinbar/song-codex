<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';

/*Social icons*/
import google from '@/assets/images/svgs/google-icon.svg';

const authStore = useAuthStore();
authStore.logout(); //remove user cookie upon load

const formRef = ref()
const apiError = ref('');
const loading = ref(false);
const password = ref('');
const username = ref('');
const passwordRules = ref([
    (v: string) => !!v || 'Password is required',
    (v: string) => (v && v.length >= 8) || 'Password must be greater than 8 characters'
]);
const emailRules = ref([(v: string) => !!v || 'E-mail is required', (v: string) => /.+@.+\..+/.test(v) || 'E-mail must be valid']);

async function signInGoogle() {
    loading.value = true;
    const result = await authStore.loginGoogle()

        loading.value = false;
        apiError.value = result.code ?? result;
        console.log('signInGoogle:', apiError);
    
}
    
async function submit() {
    
    loading.value = true;
    authStore.login(username.value, password.value).then((result) => {
        loading.value = false;
        const apiError = typeof result === 'object' && result !== null && 'code' in result ? result.code : result;
        
    })
}
</script>

<template>
    <v-row class="d-flex mb-5" no-gutters>
        <v-col >
            <v-btn variant="text" size="large" class="border text-body-large" block @click="signInGoogle">
                <img :src="google" height="16" class="mr-2" alt="google" />
                <span class="d-sm-flex d-none mr-1">Sign in with</span>Google
            </v-btn>
        </v-col>
    </v-row>
    <div class="d-flex align-center text-center mb-6">
        <div class="text-title-large w-100 px-5 font-weight-regular auth-divider position-relative">
            <span class="bg-surface px-5 py-3 position-relative">or sign in with</span>
        </div>
    </div>
    <v-form ref="formRef" class="mt-5">
        <v-label class="text-body-large font-weight-medium pb-2 text-lightText">Username</v-label>
        <v-text-field v-model="username" :rules="emailRules" class="mb-8" ></v-text-field>
        <v-label class="text-body-large font-weight-medium pb-2 text-lightText">Password</v-label>
        <v-text-field v-model="password" :rules="passwordRules" type="password" class="pwdInput"></v-text-field>
        <div class="d-flex flex-wrap align-center my-3 ml-n2">
            <div class="ml-sm-auto">
                <RouterLink to="/auth/forgot-password2" class="text-primary text-decoration-none text-body-large opacity-1 font-weight-medium"
                    >Forgot Password ?</RouterLink
                >
            </div>
        </div>
        <v-btn size="large" :loading="loading" color="primary" :disabled="valid" block type="submit" >Sign In</v-btn>
        <v-alert v-if="apiError" type="error" variant="tonal" class="mb-4">{{ apiError }}</v-alert>
    </v-form>
</template>
