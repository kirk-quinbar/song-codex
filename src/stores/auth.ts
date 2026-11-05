import { defineStore } from 'pinia';
import { router } from '@/router';
import { fetchWrapper } from '@/utils/helpers/fetch-wrapper';
import { firebaseAuth } from '@/firebase/config'
import {
    signInWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider, 
    FacebookAuthProvider
} from 'firebase/auth'

const baseUrl = `${import.meta.env.VITE_API_URL}/users`;

export const useAuthStore = defineStore('auth', {
    state: () => ({
        // initialize state from local storage to enable user to stay logged in
        // @ts-ignore
        user: JSON.parse(localStorage.getItem('user')),
        returnUrl: null
    }),
    actions: {
        async loginGoogle() {
            const provider = new GoogleAuthProvider();
            provider.addScope('profile');
            provider.addScope('email');

            return signInWithPopup(firebaseAuth, provider).then((result) => {
                const user = result.user;
                console.log('Google sign in successful:', user);
                return user;
            });
        },
        async loginFacebook() {

        },
        async login(username: string, password: string) {
            const user = await fetchWrapper.post(`${baseUrl}/authenticate`, { username, password });

            // update pinia state
            this.user = user;
            // store user details and jwt in local storage to keep user logged in between page refreshes
            localStorage.setItem('user', JSON.stringify(user));
            // redirect to previous url or default to home page
            router.push(this.returnUrl || '/dashboards/general');
        },
        logout() {
            this.user = null;
            localStorage.removeItem('user');
            router.push('/');
        }
    }
});
