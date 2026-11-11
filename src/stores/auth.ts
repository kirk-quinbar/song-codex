import { defineStore } from 'pinia';
import { router } from '@/router';
import { firebaseAuth } from '@/firebase/config'
import {
    signInWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    FacebookAuthProvider,
    getAuth,
    createUserWithEmailAndPassword
} from 'firebase/auth'
import { getUser, createOrGetUser } from '@/data/userData'
import {
    type AuthError
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
        async loginGoogle(): Promise<string> {
            const provider = new GoogleAuthProvider();
            provider.addScope('profile');
            provider.addScope('email');

            try {
                const result = await signInWithPopup(firebaseAuth, provider);

                const createResult = await createOrGetUser(result.user.uid, 'google', result.user.displayName ?? '', result.user.email ?? '', result.user.photoURL ?? '');
                if (createResult.hasError) {
                    return createResult.errorMessage;
                }
                this.user = createResult.data;

                localStorage.setItem('user', JSON.stringify(this.user));
                // redirect to previous url or default to home page
                router.push(this.returnUrl || '/dashboards/general');
                return '';

            } catch (error: unknown) {

                if (
                    typeof error === 'object' &&
                    error !== null &&
                    'code' in error
                ) {
                    switch ((error as { code: string }).code) {
                        case 'auth/invalid-credential':
                            return 'Invalid email or password.'

                        case 'auth/user-disabled':
                            return 'This account has been disabled.'

                        case 'auth/too-many-requests':
                            return 'Too many login attempts. Try again later.'

                        case 'auth/network-request-failed':
                            return 'Network error. Please check your connection.'

                        default:
                            return 'An unexpected authentication error occurred.'
                    }
                }

                return 'An unexpected error occurred.'
            }
        },
        async login(username: string, password: string): Promise<string> {
            const auth = getAuth();
            try {
                const result = await signInWithEmailAndPassword(auth, username, password)

                const createResult = await getUser(result.user.uid);
                if (createResult.hasError) {
                    return createResult.errorMessage;
                }
                this.user = createResult.data;

                // store user details and jwt in local storage to keep user logged in between page refreshes
                localStorage.setItem('user', JSON.stringify(this.user));
                // redirect to previous url or default to home page
                router.push(this.returnUrl || '/dashboards/general');
                return '';

            } catch (error: unknown) {

                if (
                    typeof error === 'object' &&
                    error !== null &&
                    'code' in error
                ) {
                    switch ((error as { code: string }).code) {
                        case 'auth/invalid-credential':
                            return 'Invalid email or password.'

                        case 'auth/user-disabled':
                            return 'This account has been disabled.'

                        case 'auth/too-many-requests':
                            return 'Too many login attempts. Try again later.'

                        case 'auth/network-request-failed':
                            return 'Network error. Please check your connection.'

                        default:
                            return 'An unexpected authentication error occurred.'
                    }
                }

                return 'An unexpected error occurred.'
            }
        },
        async register(email: string, password: string, displayName: string): Promise<string> {
            const auth = getAuth();

            try {
                const result = await createUserWithEmailAndPassword(auth, email, password)

                const createResult = await createOrGetUser(result.user.uid, 'email', displayName, email, '');
                if (createResult.hasError) {
                    return createResult.errorMessage;
                }
                this.user = createResult.data;

                // store user details and jwt in local storage to keep user logged in between page refreshes
                localStorage.setItem('user', JSON.stringify(this.user));
                // redirect to previous url or default to home page
                router.push(this.returnUrl || '/dashboards/general');
                return '';

            } catch (error: unknown) {

                if (
                    typeof error === 'object' &&
                    error !== null &&
                    'code' in error
                ) {
                    switch ((error as { code: string }).code) {
                        case 'auth/invalid-credential':
                            return 'Invalid email or password.'

                        case 'auth/user-disabled':
                            return 'This account has been disabled.'

                        case 'auth/too-many-requests':
                            return 'Too many login attempts. Try again later.'

                        case 'auth/network-request-failed':
                            return 'Network error. Please check your connection.'

                        default:
                            return 'An unexpected authentication error occurred.'
                    }
                }

                return 'An unexpected error occurred.'


            }
        },
        logout() {
            this.user = null;
            localStorage.removeItem('user');
            router.push('/');
        }
    }
});
