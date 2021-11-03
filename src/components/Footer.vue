<template>
  <v-footer app class="main-cont" fixed>
    <v-container fluid>
      <v-row no-gutters  justify="center">
          <v-col md="auto" style="text-align: center;">
              <v-btn color="white" 
              class="foot-but left-but" 
              href="https://shop.skynet-service.com/"
              max-width="300"
              elevation="0"
              >Интернет магазин</v-btn>
              <v-btn 
              color="white" 
              class="foot-but"
              max-width="300"
              elevation="0"
              :href="mapLinkC"
              target="_blank"
              >Мы на карте</v-btn>
          </v-col>
      </v-row>
    </v-container>
  </v-footer>
</template>

<script>
export default {
name: "Footer",
props: ['mapLinkC'],
  data: () => ({
      
  }),

  computed: {
    },

  methods:{
    
  },

   mounted() {

  }
}
</script>

<style scoped>
  .main-cont{
    background-color: #0A74C0 !important;
    font-family: Roboto !important;
    font-style: normal !important;
    font-weight: bold !important;
    font-size: 14px !important;
    line-height: 20px !important;
    color: #FFFFFF !important;
    text-align: right!important;
    z-index: 1;
  }

  .foot-but
  {
    border: 1px solid #0A74C0 !important;
    box-sizing: border-box !important;
    border-radius: 4px !important;
    font-family: Montserrat !important;
    font-style: normal !important;
    font-weight: 600 !important;
    font-size: 14px !important;
    line-height: 20px !important;
    text-align: center !important;
    color: #0A74C0 !important;
    width: 300px;
  }

  .left-but{
    margin-right: 20px;
  }

  @media screen and (max-width: 675px) and (min-width: 504px){ 
  .foot-but
  {
    font-size: 12px !important;
    width: 214px;
  }
  }

    @media screen and (max-width: 504px) and (min-width: 399px){ 
  .foot-but
  {
    font-size: 12px !important;
    width: 160px;
  }
  }

  @media screen and (max-width: 399px) { 
      .foot-but
    {
      font-size: 10px !important;
      width: 120px;

    }

      .left-but{
    margin-right: 5px;
  }
  }
</style>

<style>
  .v-footer--fixed {
    position: fixed !important;
  }
</style>