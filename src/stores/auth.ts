import { defineStore } from 'pinia';
import { router } from '@/router';
import { firebaseAuth, firebaseDb } from '@/firebase/config'
import {
    signInWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    sendPasswordResetEmail,
    getAuth,
    createUserWithEmailAndPassword
} from 'firebase/auth'
import { User, SongCodexData } from '@/data/SongCodexData'

const userData = new SongCodexData<User>(
    firebaseDb,
    User
)

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

                const existingUser = await userData.search('uid', result.user.uid);
                if (!existingUser) {
                    const newUser = new User();
                    newUser.uid = result.user.uid;
                    newUser.providerId = 'google';
                    newUser.email = result.user.email ?? '';
                    newUser.displayName = result.user.displayName ?? '';
                    newUser.photoUrl = result.user.photoURL ?? '';
                    const newId = await userData.add(newUser);

                    const createdUser = await userData.get(newId);
                    if (!createdUser) {
                        return 'Failed to create user. Please contact support.';
                    }
                    this.user = createdUser;
                }
                else {
                    this.user = existingUser;
                }

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

                const existingUser = await userData.search('uid', result.user.uid);
                if (!existingUser) {
                    return 'User Does not exist. Please contact support.';
                }
                this.user = existingUser;

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
                        case 'auth/invalid-email':
                            return 'The email address is not valid. Please enter a valid email address.'
                        case 'auth/missing-password':
                            return 'The password is missing. Please enter your password.'
                        case 'auth/user-disabled':
                            return 'This account has been disabled.'
                        case 'auth/too-many-requests':
                            return 'Too many login attempts. Try again later.'
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

                const existingUser = await userData.search('uid', result.user.uid);
                if (!existingUser) {
                    const newUser = new User();
                    newUser.uid = result.user.uid;
                    newUser.providerId = 'email';
                    newUser.email = email ?? '';
                    newUser.displayName = displayName ?? '';
                    newUser.photoUrl = '';
                    const newId = await userData.add(newUser);

                    const createdUser = await userData.get(newId);
                    if (!createdUser) {
                        return 'Failed to create user. Please contact support.';
                    }
                    this.user = createdUser;
                }
                else {
                    this.user = existingUser;
                }

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
                        case 'auth/email-already-in-use':
                            return 'An account with this email address already exists.'
                        case 'auth/weak-password':
                            return 'The password is too weak. Please choose a stronger password.'
                        case 'auth/password-does-not-meet-requirements':
                            return 'The password does not meet the requirements. Please choose a stronger password.'
                        case 'auth/invalid-email':
                            return 'The email address is not valid. Please enter a valid email address.'
                        case 'auth/operation-not-allowed':
                            return 'Email/password accounts are not enabled. Please contact support.'

                        default:
                            return 'An unexpected authentication error occurred.'
                    }
                }

                return 'An unexpected error occurred.'
            }
        },
        async sendPasswordResetEmail(email: string): Promise<string> {
            const auth = getAuth();

            try {
                const userResult = await userData.search('email', email);
                if (!userResult) {
                    return 'No user found with this email address.';
                }
                if (userResult.providerId !== 'email') {
                    return 'Password reset is only available for email/password accounts.';
                }

                const result = await sendPasswordResetEmail(auth, email);

                return 'Email sent. Please check your inbox for further instructions.';

            } catch (error: unknown) {

                if (
                    typeof error === 'object' &&
                    error !== null &&
                    'code' in error
                ) {
                    switch ((error as { code: string }).code) {
                        case 'auth/invalid-email':
                            return 'The email address is not valid. Please enter a valid email address.'
                        case 'auth/missing-email':
                            return 'The email address is missing. Please enter a valid email address.'
                        case 'auth/user-not-found':
                            return 'No user found with this email address.'
                        case 'auth/user-disabled':
                            return 'The user account is disabled.'

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
