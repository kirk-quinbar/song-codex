<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import user1 from '@/assets/images/profile/user-1.jpg'

const authStore = useAuthStore();
const authUser = authStore.user;
const photoURL = ref(authUser?.photoURL || user1);

export interface profileType {
    title: string;
    href: string;
    badge: boolean;
}

const profileDD: profileType[] = [
    // {
    //     title: 'My Profile',
    //     href: '/apps/user/profile',
    //     badge: false
    // },
    // {
    //     title: 'My Subscription',
    //     href: '/pages/pricing',
    //     badge: false
    // },
    // {
    //     title: 'My Notes',
    //     href: '/apps/notes',
    //     badge: true
    // },
    {
        title: 'Account Settings',
        href: '/pages/account-settings',
        badge: false
    },
    {
        title: 'Sign Out',
        href: '/auth/login2',
        badge: false
    }
];

</script>

<template>
    <!-- ---------------------------------------------- -->
    <!-- notifications DD -->
    <!-- ---------------------------------------------- -->
    <v-menu open-on-hover open-on-click class="profile_popup">
        <template v-slot:activator="{ props }">
            <v-btn variant="text" v-bind="props" icon size="small" color="primary" class="custom-hover-primary ms-md-2">
                <v-avatar variant="text" size="30">
                    <img :src="photoURL" :alt="photoURL" />
                </v-avatar>
            </v-btn>
        </template>
        <v-sheet rounded="md" width="350" elevation="9">
            <div class="pb-4">
                <div class="d-flex align-center pa-4">
                    <v-avatar variant="text" size="50">
                        <img :src="photoURL" :alt="photoURL" width="50" />
                    </v-avatar>
                    <div class="ml-3">
                        <h6 class="text-title-large textPrimary font-weight-medium">{{ authUser?.displayName || 'Unknown' }}</h6>
                        <span class="text-12 textSecondary">{{ authUser?.email || 'markrarn@wrappixel.com' }}</span>
                    </div>
                </div>
                <v-divider></v-divider>
                <div style="height: 100px;">
                    <v-list class="py-0 px-4 theme-list mt-3" lines="one">
                        <v-list-item
                            v-for="item in profileDD"
                            :key="item.title"
                            class="py-0 px-2 rounded-md custom-text-primary"
                            color="primary"
                            :to="item.href"
                        >
                            <div class="d-flex gap-3 align-center">
                                <p class="text-body-large textPrimary hover-primary font-weight-medium">{{ item.title }}</p>
                                <v-chip size="small" color="info" v-if="item.badge">4</v-chip>
                            </div>
                        </v-list-item>
                    </v-list>
                </div>
            </div>
        </v-sheet>
    </v-menu>
</template>
