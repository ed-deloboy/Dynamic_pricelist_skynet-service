<template>
  <div>
  <v-app-bar app class="main-cont" >
      <v-container>
        <v-row no-gutters style="justify-content:space-between;">
          <v-col md="auto">
              <v-row  no-gutters class="mt-1">
                <v-col>
                  <p class="logo-text mb-0">Скайнет</p>
                </v-col>
              </v-row>
              <v-row  no-gutters>
                <v-col>
                  <p class="sub-logo mb-0">прайс лист компании</p>
                </v-col>
              </v-row>
          </v-col>      
          
          <v-col md="auto" class="pt-2 large-info">
              <v-btn color="white" 
              href="https://shop.skynet-service.com/"
              max-width="300"
              elevation="0"
              text
              class="large-but"
              target="_blank"
              ><span class="hover-span">Интернет магазин</span></v-btn>
              <v-btn 
              color="white" 
              max-width="300"
              elevation="0"
              :href="mapLinkC"
              target="_blank"
              text
              class="large-but"
              ><span class="hover-span">Мы на карте</span></v-btn>
          </v-col>
          <div class="small-info">
              <v-menu
            offset-y
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                dark
                icon
                v-bind="attrs"
                v-on="on"
                @click="close=!close"
              >
                <v-icon v-if="!close">fas fa-bars</v-icon>
                <v-icon v-if="close">fas fa-times</v-icon> 
              </v-btn>
            </template>
            <v-card
                elevation="2"
                class="px-2 py-2"
              >
              <v-row no-gutters><v-col align="end"><span class="menu-text">Меню</span></v-col></v-row>
              <v-row no-gutters>
                <v-col align="end">
                  <v-btn color="white" 
                  href="https://shop.skynet-service.com/"
                  elevation="0"
                  text
                  class="pr-0"
                  target="_blank"
                  ><span class="blue-text">Интернет магазин</span></v-btn>
                    </v-col>
              </v-row>
              <v-row no-gutters>
                <v-col align="end">
                  <v-btn 
              color="white" 
              elevation="0"
              :href="mapLinkC"
              target="_blank"
              text
              class="pr-0"
              ><span class="blue-text">Мы на карте</span></v-btn>
                </v-col>
              </v-row>
              </v-card>
          </v-menu>
          </div>
        </v-row>
      </v-container>
  </v-app-bar>
  </div>
</template>

<script>
export default {
  name: "Main",
  props: ['mapLinkC'],
  data: () => ({
      close:false,
  }),

  methods: {
  },

  watch: {

  },
}
</script>

<style scoped>
  .main-cont{
    background-color: #0A74C0 !important;
    font-family: Montserrat !important;
    font-style: normal !important;
    font-weight: bold !important;
    font-size: 14px !important;
    line-height: 20px !important;
    color: #FFFFFF !important;
    text-align: right;
  }

  .logo-text{
    text-align: left !important;
    font-family: Montserrat !important;
    font-style: normal !important;
    font-weight: 900 !important;
    font-size: 23px !important;
    line-height: 27px !important;
    letter-spacing: 0.36em !important;
    color: #FFFFFF !important;
     letter-spacing:.06em !important;
  }

  .sub-logo{
    font-family: Montserrat !important;
    font-style: normal !important;
    font-weight: bold !important;
    font-size: 14px !important;
    line-height: 16px !important;
    color: #FFFFFF !important;
    text-align: left !important;
  }

  .hover-span{
    border-bottom: 1px solid transparent !important;
  }

  .hover-span:hover{
    border-bottom: 1px solid white !important;
  }

  .small-info{
    display: none;
    margin-right: -23px;
  }

  .blue-text
  {
    font-family: Montserrat !important;
    font-style: normal !important;
    font-weight: 500 !important;
    font-size: 14px !important;
    line-height: 20px !important;
    color: #0A74C0 !important;
  }

  .menu-text{
    font-family: Montserrat !important;
    font-style: normal !important;
    font-weight: 600 !important;
    font-size: 16px !important;
    line-height: 22px !important;
    text-align: right !important;
    color: #000000 !important;
  }

  @media screen and (max-width: 711px) { 
    .hover-span{
      display: none;
    }

    .large-info{
      display: none;
    }

    .small-info{
    display: block;
  }
  }
</style>

