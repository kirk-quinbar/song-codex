<script setup lang="ts">
import { ref } from 'vue';
import Logo from '@/layouts/full/logo/Logo.vue';
/*Social icons*/
import google from '@/assets/images/svgs/google-icon.svg';
import facebook from '@/assets/images/svgs/facebook-icon.svg';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
const checkbox = ref(false);
const valid = ref(true);
const show1 = ref(false);
const password = ref('');
const email = ref('');
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

function validate() {
    return authStore.register(email.value, password.value, displayName.value);
}

</script>
<template>
    <v-form ref="form" v-model="valid" lazy-validation action="/pages/boxedlogin" class="mt-5" @submit.prevent="validate">
        <v-label class="text-body-large font-weight-medium pb-2">Display Name</v-label>
        <VTextField v-model="displayName" :rules="displayNameRules" required></VTextField>
        <v-label class="text-body-large font-weight-medium pb-2">Email Address</v-label>
        <VTextField v-model="email" :rules="emailRules" required></VTextField>
        <v-label class="text-body-large font-weight-medium pb-2">Password</v-label>
        <VTextField
            v-model="password"
            :counter="10"
            :rules="passwordRules"
            required
            variant="outlined"
            type="password"
            color="primary"
        ></VTextField>
        <v-btn size="large" class="mt-2" color="primary" block type="submit" flat>Sign Up</v-btn>
    </v-form>
</template>
