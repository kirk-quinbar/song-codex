<script setup lang="ts">
import { ref } from 'vue';

import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import UiTittleSubtitleCard from '@/components/shared/UiTittleSubtitleCard.vue';
import TheSalesOverview from '@/components/dashboards/general/TheSalesOverview.vue';
import TotalSales from '@/components/dashboards/general/TotalSales.vue';
import BlogCard from '@/components/dashboards/general/BlogCard.vue';
import NewsletterCampaign from '@/components/dashboards/general/NewsletterCampaign.vue';
import TheBandwidthUsage from '@/components/dashboards/general/TheBandwidthUsage.vue';
import TheDownloadCount from '@/components/dashboards/general/TheDownloadCount.vue';
import TheWeatherCard from '@/components/dashboards/general/TheWeatherCardVue.vue';
import TheProfileCard from '@/components/dashboards/general/TheProfileCard.vue';
import TheMyContacts from '@/components/dashboards/general/TheMyContacts.vue';
import TheActivityTimeline from '@/components/dashboards/general/TheActivityTimeline.vue';
// import SnackBar from '@/components/dashboards/snackbar.vue';
const page = ref({ title: 'General' });
const breadcrumbs = ref([
    {
        text: 'Dashboard',
        disabled: false,
        href: '#'
    },
    {
        text: 'General',
        disabled: false,
        href: '#'
    }
]);
</script>

<template>
    <!-- Loader -->
    <!-- <SnackBar /> -->
    <!-- Loader -->

    <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>
    <v-row>
        <!---Sales overview--->
        <v-col cols="12" sm="12" lg="8">
            <TheSalesOverview />
        </v-col>
        <!---Our visiters--->
        <v-col cols="12" sm="12" lg="4">
            <TotalSales />
        </v-col>
        <!---Blog cards--->
        <v-col cols="12" sm="12" lg="4">
            <BlogCard />
        </v-col>
        <!---Newsletter Campaign--->
        <v-col cols="12" sm="12" lg="8">
            <NewsletterCampaign />
        </v-col>
        <!---Bandwidth usage--->
        <v-col cols="12" sm="12" lg="4">
            <TheBandwidthUsage />
        </v-col>
        <!---Download count--->
        <v-col cols="12" sm="12" lg="4">
            <TheDownloadCount />
        </v-col>
        <v-col cols="12" sm="12" lg="4">
            <TheWeatherCard />
        </v-col>
        <!---Profile card /my contacts--->
        <v-col cols="12" sm="12" lg="4">
            <TheProfileCard />
            <div class="mt-7"></div>
            <TheMyContacts />
        </v-col>
        <!---Activity timeline tabs--->
        <v-col cols="12" sm="12" lg="8">
            <TheActivityTimeline />
        </v-col>
    </v-row>
</template>
