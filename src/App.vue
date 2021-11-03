<template>
  <v-app>
      <Main :mapLinkC="mapLink" />
    <v-main>
      <v-container fluid class="px-0 py-0">
          <router-view @loadMy='onLoad'></router-view>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import Main from './components/Main';
import Footer from './components/Footer';

export default {
  name: 'App',

  components: {
    Footer,
    Main,
  },

  data: () => ({
    mapLink:""
  }),

  methods: {
  onLoad (data) {
    this.mapLink = data.link
  }
}
};
</script>

<style>

</style>
