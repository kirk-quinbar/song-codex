import { defineStore } from 'pinia';
import { router } from '@/router';
import { fetchWrapper } from '@/utils/helpers/fetch-wrapper';
import { firebaseAuth } from '@/firebase/config'
import {
    signInWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    FacebookAuthProvider,
    getAuth,
    createUserWithEmailAndPassword
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

            return await signInWithPopup(firebaseAuth, provider).then((result) => {
                this.user = {
                    uid: result.user.uid,
                    displayName: result.user.displayName,
                    email: result.user.email,
                    photoURL: result.user.photoURL,
                };

                localStorage.setItem('user', JSON.stringify(this.user));
                // redirect to previous url or default to home page
                router.push(this.returnUrl || '/dashboards/general');

                return this.user;
            }
            ).catch((error) => {
                return error;
            });
        },
        // async loginFacebook() {
        //     const provider = new FacebookAuthProvider();
        //     provider.addScope('public_profile');
        //     provider.addScope('email');

        //     return signInWithPopup(firebaseAuth, provider)
        //         .then((result) => {
        //             this.user = {
        //                 uid: result.user.uid,
        //                 displayName: result.user.displayName,
        //                 email: result.user.email,
        //                 photoURL: result.user.photoURL,
        //             };

        //             localStorage.setItem('user', JSON.stringify(this.user));
        //             // redirect to previous url or default to home page
        //             router.push(this.returnUrl || '/dashboards/general');

        //             return this.user;
        //         }
        //         ).catch((error) => {
        //             return error;
        //         });

        // },
        async login(username: string, password: string) {
            const auth = getAuth();
            return await signInWithEmailAndPassword(auth, username, password)
                .then((userCredential) => {
                    // Signed in 
                    // update pinia state
                    this.user = userCredential.user;
                    // store user details and jwt in local storage to keep user logged in between page refreshes
                    localStorage.setItem('user', JSON.stringify(this.user));
                    // redirect to previous url or default to home page
                    router.push(this.returnUrl || '/dashboards/general');
                    return this.user;
                })
                .catch((error) => {
                    return error;
                });

        },
        async register(username: string, password: string, displayName: string) {
            const auth = getAuth();
            return await createUserWithEmailAndPassword(auth, username, password)
                .then((userCredential) => {
                    // Signed in 
                    // update pinia state
                    this.user = userCredential.user;
                    //this.user.displayName = displayName;
                    console.log('User registered:', this.user);
                    // store user details and jwt in local storage to keep user logged in between page refreshes
                    localStorage.setItem('user', JSON.stringify(this.user));
                    // redirect to previous url or default to home page
                    router.push(this.returnUrl || '/dashboards/general');
                    return this.user;
                })
                .catch((error) => {
                    return error;
                });

        },
        logout() {
            this.user = null;
            localStorage.removeItem('user');
            router.push('/');
        }
    }
});
