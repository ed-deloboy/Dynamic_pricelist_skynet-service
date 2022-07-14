<template>
  <div>
    <v-container>
      <v-row justify="center">
        <v-dialog v-model="loading" overlay-opacity="1" overlay-color="#fff">
          <v-card class="load-card">
            <v-progress-circular
              :size="100"
              color="primary"
              indeterminate
            ></v-progress-circular>
          </v-card>
        </v-dialog>
      </v-row>
      <v-row v-if="listOfCities.length !== 0" no-gutters class="mb-5">
        <v-col>
          <v-row no-gutters class="city-price-place">
            <v-col md="auto" class="mr-3 mt-2 select-text">
              Выберите город:
            </v-col>
            <v-col md="auto" style="min-width: 300px" class="py-2">
              <v-select
                :items="listOfCities"
                solo
                @change="downloadFileFromSite"
                dense
                hide-details
                v-model="city"
                label="Ростов"
                background-color="#efefef"
                elevation="0"
              >
                <template v-slot:selection="data">
                  {{ data.item.Сity }}
                </template>
                <template v-slot:item="data">
                  <v-list-item-content
                    v-text="data.item.Сity"
                    style="
                      color: #000 !important;
                      background-color: #fff;
                      background: #fff;
                      caret-color: #fff !important;
                    "
                  ></v-list-item-content>
                </template>
              </v-select>
            </v-col>
            <v-spacer class="no-spacer"></v-spacer>
            <v-col class="copy-price-container" md="auto">
              <div class="dx-button-mode-contained-copy">
                Скачать прайс-лист
              </div>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col style="min-width: 300px">
          <v-text-field
            label="Введите наименование запчати"
            solo
            dense
            v-model="search"
            hide-no-data
            hide-details
            @keydown="enterPress"
            append-icon="fas fa-search"
            background-color="#efefef"
            elevation="0"
            class="input-serch"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row class="pl-2">
        <v-col md="auto" class="px-1">
          <v-btn
            color="#0A74C0"
            class="mr-2 white--text serch-but"
            @click="filterMass"
            small
            depressed
          >
            Искать
          </v-btn>

          <v-btn
            color="#0353B4"
            outlined
            @click="clearMass"
            small
            class="expand-close"
          >
            Очистить поиск
          </v-btn>
          <v-btn
            color="#D71B1B"
            outlined
            @click="clearMass"
            small
            class="small-close ml-2"
          >
            <v-icon color="#D71B1B" small>fas fa-times</v-icon>
          </v-btn>
        </v-col>
      </v-row>
      <v-row v-if="orders.length !== 0" class="no-margin">
        <v-col>
          <DxDataGrid
            :allow-column-reordering="true"
            :data-source="orders"
            key-expr="Код"
            :show-borders="true"
            @exporting="onExporting"
          >
            <DxColumn
              data-field="Артикул"
              :width="120"
              cell-template="vendorСode"
              :allow-sorting="false"
              :hiding-priority="1"
            />
            <DxColumn
              data-field="Наименование"
              :allow-sorting="false"
              :hiding-priority="4"
            />
            <DxColumn
              data-field="ОПТ"
              :width="100"
              cell-template="opt"
              :allow-sorting="false"
              :hiding-priority="3"
            />
            <DxColumn
              data-field="ОПТ-Мастер"
              :width="100"
              cell-template="opt-master"
              :allow-sorting="false"
              :hiding-priority="2"
            />
            <DxColumn
              :group-index="0"
              data-field="Название группы"
              caption=""
              sort-order="asc"
            />

            <template #vendorСode="{ data }">
              <span class="vendor-code">{{ data.value }}</span>
            </template>
            <template #opt="{ data }">
              <span>{{ data.value }} ₽</span>
            </template>
            <template #opt-master="{ data }">
              <span>{{ data.value }} ₽</span>
            </template>
            <DxGroupPanel :visible="true" />
            <DxGrouping :auto-expand-all="autoExpandAll" />
            <DxPaging :page-size="1000000" />
            <DxSearchPanel :visible="false" />
            <DxExport :enabled="true" />
          </DxDataGrid>
        </v-col>
      </v-row>
      <v-row v-if="orders.length === 0 && !loading">
        <v-col>
          <v-alert
            text
            prominent
            type="error"
            icon="mdi-cloud-alert"
            v-if="!loading"
          >
            Во время загрузки данных возникла ошибка. Обновите страницу клавишей
            F5. Если ошибка повторится обратитесь к администратору.
          </v-alert>
        </v-col>
      </v-row>
    </v-container>
    <a href="#" class="topbutton">
      <v-icon style="color: #fff !important">fas fa-arrow-up</v-icon>
    </a>
    
  </div>

  
</template>

<script>



import {
  DxDataGrid,
  DxColumn,
  DxGrouping,
  DxGroupPanel,
  DxSearchPanel,
  DxPaging,
  DxExport,
} from "devextreme-vue/data-grid";
import ruMessages from "devextreme/localization/messages/ru.json";
import { locale, loadMessages } from "devextreme/localization";
import XLSX from "xlsx";
import { Workbook } from "exceljs";
import { saveAs } from "file-saver";
import { exportDataGrid } from "devextreme/excel_exporter";
export default {
  components: {
    DxColumn,
    DxGroupPanel,
    DxGrouping,
    DxPaging,
    DxSearchPanel,
    DxDataGrid,
    ruMessages,
    locale,
    loadMessages,
    DxExport,
  },
  name: "GeneralInformation",
  data: () => ({
    autoExpandAll: true,
    orders: [],
    ordersCopy: [],
    loading: true,
    listOfCities: [],
    city: { Link: "", Сity: "" },
    descriptionLimit: 60,
    model: null,
    search: "",
    searchMass: [],
    cashClear: false,
  }),

  methods: {
    rebornMassForClick() {
      this.rebornMass();
    },

    changeValue(e) {
      if (e === undefined) {
        this.loading = true;
        this.rebornMass();
        setTimeout(() => (this.loading = false), 3000);
      } else {
        this.orders.splice(0, this.orders.length);
        if (this.model !== null) {
          this.orders = [this.model];
        }
      }
    },

    clearMass() {
      this.loading = true;
      this.rebornMass();
      this.search = "";
      setTimeout(() => (this.loading = false), 3000);
    },

    rebornMass() {
      this.orders.splice(0, this.orders.length);

      for (let i = 0; i < this.ordersCopy.length; i++) {
        this.orders.push(this.ordersCopy[i]);
      }
    },

    enterPress(e) {
      if (e.key === "Enter") this.filterMass();
    },

    filterMass() {
      this.search = this.search.trim();
      this.searchMass = this.search.split(" ");

      this.rebornMass();

      for (let j = 0; j < this.searchMass.length; j++) {
        this.orders = this.orders.filter(
          (f) =>
            f["Наименование"]
              .toString()
              .toLowerCase()
              .includes(this.searchMass[j].toLowerCase()) ||
            f["Артикул"]
              .toString()
              .toLowerCase()
              .includes(this.searchMass[j].toLowerCase()) ||
            f["Название группы"]
              .toString()
              .toLowerCase()
              .includes(this.searchMass[j].toLowerCase())
        );
      }
    },

    initialization() {
      if (this.city.Link === "") {
        this.city.Link = this.listOfCities[0].Link;
        this.city.Сity = this.listOfCities[0].Сity;
        this.downloadFileFromSite(this.city);
      }
    },

    downloadFileListOfCitiesFromSite() {
      this.loading = true;
      console.log("Скайнет");
      fetch("/listOfCities.xlsx", {})
      // fetch("https://skynet-service.com/price/listOfCities.xlsx", {})
        .then((response) => response.blob())
        .then((blob) => {
          this.fileToJsonCity(this.blobToFile(blob, "City"));
        });
    },

    fileToJsonCity(e) {
      let file = e;
      if (file) {
        var fileReader = new FileReader();
        fileReader.onload = (event) => {
          var data = event.target.result;

          var workbook = XLSX.read(data, {
            type: "binary",
          });
          workbook.SheetNames.forEach((sheet) => {
            let rowObject = XLSX.utils.sheet_to_row_object_array(
              workbook.Sheets[sheet]
            );
            let jsonObject = JSON.stringify(rowObject, null, "\t");
            this.listOfCities = JSON.parse(jsonObject);
            this.loadMy();
          });
        };
        fileReader.readAsBinaryString(file);
      }
      setTimeout(this.initialization, 1000);
    },

    loadMy() {
      this.$emit("loadMy", {
        link: this.listOfCities[0]["mapLink"],
      });
    },

    downloadFileFromSite(e) {
      this.loading = true;
      if (e.Link !== "") {
        fetch(e.Link, {
          method: "GET",
        })
          .then((response) => response.blob())
          .then((blob) => {
            this.fileToDevExtreme(this.blobToFile(blob, "test"));
          });
      }
    },

    blobToFile(theBlob, fileName) {
      theBlob.lastModifiedDate = new Date();
      theBlob.name = fileName;
      return theBlob;
    },

    fileToDevExtreme(e) {
      let file = e;
      if (file) {
        var fileReader = new FileReader();
        fileReader.onload = (event) => {
          var data = event.target.result;

          var workbook = XLSX.read(data, {
            type: "binary",
          });
          workbook.SheetNames.forEach((sheet) => {
            let rowObject = XLSX.utils.sheet_to_row_object_array(
              workbook.Sheets[sheet]
            );
            let jsonObject = JSON.stringify(rowObject, null, "\t");
            this.orders = JSON.parse(jsonObject);
            this.ordersCopy = JSON.parse(jsonObject);
          });
        };
        fileReader.readAsBinaryString(file);
      }
      setTimeout(() => (this.loading = false), 3000);
    },

    /*Формирование файла в эксель*/
    onExporting(e) {
      const workbook = new Workbook();
      const worksheet = workbook.addWorksheet("Companies");

      worksheet.columns = [
        { width: 15 },
        { width: 100 },
        { width: 14 },
        { width: 18 },
      ];

      exportDataGrid({
        component: e.component,
        worksheet: worksheet,
        keepColumnWidths: false,
        topLeftCell: { row: 1, column: 1 },
        customizeCell: ({ gridCell, excelCell }) => {
          if (gridCell.rowType === "data") {
            if (gridCell.column.dataField === "Артикул") {
              excelCell.value = gridCell.value;
              excelCell.font = { color: { argb: "B4C7DC" }, underline: false };
              excelCell.alignment = { horizontal: "left" };
            }
            if (
              gridCell.column.dataField === "ОПТ" ||
              gridCell.column.dataField === "ОПТ-Мастер"
            ) {
              excelCell.value = gridCell.value + " ₽";
            }
            excelCell.border = {
              top: { style: "thin", color: { argb: "000000" } },
              left: { style: "thin", color: { argb: "000000" } },
              bottom: { style: "thin", color: { argb: "000000" } },
              right: { style: "thin", color: { argb: "000000" } },
            };
          }
          if (gridCell.rowType === "group") {
            excelCell.value = gridCell.value;
            excelCell.fill = {
              type: "pattern",
              pattern: "solid",
              fgColor: { argb: "0A74C0" },
            };
            excelCell.font = { color: { argb: "FFFFFF" }, bold: true };
            excelCell.border = {
              top: { style: "thin", color: { argb: "000000" } },
              left: { style: "thin", color: { argb: "000000" } },
              bottom: { style: "thin", color: { argb: "000000" } },
              right: { style: "thin", color: { argb: "000000" } },
            };
          }
        },
      }).then(() => {
        workbook.xlsx.writeBuffer().then((buffer) => {
          saveAs(
            new Blob([buffer], { type: "application/octet-stream" }),
            "Скайнет прайс лист.xlsx"
          );
        });
      });
      e.cancel = true;
    },
    //cache
    reloadCash() {
      var curentDate = new Date();
      var cookieValue = document.cookie
        .split(";")
        .filter((f) => f.match("cashClear"));
      cookieValue = cookieValue[0].split("=")[1];

      if (curentDate.getHours() == "3") {
        if (cookieValue === "false") {
          this.set_cookie("cashClear", true);
          window.location.reload(true);
        }
      } else {
        this.set_cookie("cashClear", false);
      }
    },

    createCookie() {
      var cookieValue = document.cookie
        .split(";")
        .filter((f) => f.match("cashClear"));
      if (cookieValue.length == 0) {
        this.set_cookie("cashClear", false);
      }
    },

    set_cookie(name, value) {
      document.cookie = name + "=" + value + "; Path=/;";
    },

    delete_cookie(name) {
      document.cookie =
        name + "=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    },
  },

  mounted() {
    this.downloadFileListOfCitiesFromSite();
    this.reloadCash();
  },

  created() {
    loadMessages(ruMessages);
    locale(navigator.language);
    this.createCookie();
  },

  computed: {},
};
</script>

<style>
body::-webkit-scrollbar {
  width: 8px;
  background: rgb(248, 248, 248);
}

body::-webkit-scrollbar-thumb {
  border: 2px solid rgb(255, 255, 255);
  border-radius: 4px;
  background: linear-gradient(#b7ddf7, #1b69c2);
}
.dx-datagrid-nowrap,
.dx-datagrid-nowrap .dx-header-row > td > .dx-datagrid-text-content {
  white-space: normal !important;
}

.v-text-field.v-text-field--solo:not(.v-text-field--solo-flat)
  > .v-input__control
  > .v-input__slot {
  box-shadow: none !important;
}

.v-select {
  box-shadow: 0px 3px 1px -2px rgb(0 0 0 / 20%),
    0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 1px 5px 0px rgb(0 0 0 / 12%) !important;
}

.v-text-field.v-text-field--solo .v-label {
  font-family: "Montserrat", sans-serif;
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 20px;
  color: #b6b6b6;
}

.serch-but {
  width: 172px !important;
}

.fa-search {
  color: #b6b6b6 !important;
}

.options {
  padding: 20px;
  margin-top: 20px;
  background-color: rgba(191, 191, 191, 0.15);
}

.but-load {
  font-family: "Montserrat", sans-serif;
  font-style: normal;
  font-weight: 500;
  font-size: 13px;
  /*line-height: 20px;*/
}

.small-close {
  display: none;
}

.expand-close {
  display: inline-flex;
}

.caption {
  font-size: 18px;
  font-weight: 500;
}

.option {
  margin-top: 10px;
}

.dx-datagrid-rowsview .dx-row.dx-group-row:not(.dx-row-focused) {
  color: #ffffff;
  background-color: #0a74c0;
}

.v-select {
  box-shadow: none !important;
  color: #000 !important;
}

.v-input__icon {
  color: #000;
}

.dx-datagrid-group-opened {
  color: #ffffff;
}

.vendor-code {
  color: #b4c7dc;
}
table{
  border: none !important;
}
tbody{
  border: none !important;
}
tr{
  border: none !important;
  transition: background .2s ease-in-out;
}
tr:nth-child(1n) {
background: rgb(248, 248, 248);
}
tr:nth-child(2n) {
background: rgb(233, 233, 233);
}

tr:hover{
    background: #0a74c02e;
  }

td {
  border: 1px solid #ddd !important;
  border: none !important;
}

td:focus{
  background: #0a74c031;
}

.dx-button-mode-contained-copy {
  background-color: #0a74c0;
  border-color: #0a74c0;
  color: #fff !important;
  width: 200px;
  padding: 5px;
  border-radius: 5px;
  text-align: center;
  vertical-align: middle;
  text-transform: inherit;
  font-family: Montserrat !important;
  font-style: normal !important;
  font-weight: 500 !important;
  font-size: 0.85rem !important;
  line-height: 20px !important;
}

.dx-button-mode-contained-copy:hover {
  background-color: #0a74c0;
  border-color: #0a74c0;
  color: #fff !important;
}

.dx-button-mode-contained-copy:focus {
  background-color: #0a74c0;
  border-color: #0a74c0;
  color: #fff !important;
}

.dx-button-mode-contained {
  background-color: #0353b4;
  border-color: #0353b4;
  color: #fff !important;
  width: 204px !important;
  position: relative;
  top: -160px;
  z-index: 3 !important;
  opacity: 0;
}

.dx-button-mode-contained:hover {
  background-color: #033e7c;
  border-color: #033e7c;
  color: #fff !important;
}

.dx-button-mode-contained:focus {
  background-color: #033e7c;
  border-color: #033e7c;
  color: #fff !important;
}

.dx-button-mode-contained .dx-icon {
  color: #fff !important;
}

.dx-datagrid-group-closed {
  color: #fff !important;
}

.select-text {
  font-family: Montserrat;
  font-style: normal;
  font-size: 1rem;
  font-weight: 500;
  line-height: 20px;
  color: #0a74c0;
  padding-bottom: 1.5rem;
}
.v-application .mt-2 {
  margin-top: 0 !important;
}

.load-card {
  width: 160px;
  text-align: center;
  height: 160px;
  padding: 33px;
  margin: 0 auto;
}

.v-dialog {
  width: 160px !important;
  text-align: center !important;
  height: 160px !important;
  padding: 33px !important;
  margin: 0 auto !important;
  padding: 0px !important;
  box-shadow: none !important;
}

.v-overlay--active {
  z-index: 3 !important;
}

.no-style {
  background: #fff;
  color: #000;
}

.dx-datagrid-group-panel .dx-group-panel-item {
  display: none;
}

.dx-selection-disabled {
  display: none;
}

.v-btn__content {
  font-size: 0.8rem;
  font-weight: 400;
  letter-spacing: 0.02rem;
  text-transform: initial !important;
}

.fixed-serch {
  position: fixed;
  z-index: 3;
  background: #fff;
  top: -3px;
  padding-top: 93px;
}

.topbutton {
  position: fixed;
  bottom: 19px;
  right: 19px;
  width: 45px;
  height: 45px;
  cursor: pointer;
  background: rgb(8 116 192 / 31%);
  border-radius: 100%;
  text-decoration: none;
  color: #fff !important;
  display: flex;
  justify-content: center;
  align-items: center;
}

.topbutton:hover {
  background: #0a74c0;
}
.city-price-place {
  align-items: center;
}
.v-icon.v-icon {
  font-size: 1.1rem;
}

/* preload start */
.v-dialog {
  width: 170px !important;
  height: 170px !important;
}
.load-card {
  width: 170px !important;
  height: 170px !important;
  padding: 0 !important;
}
.load-card {
  /* background-image: url("preload.svg"); */
  background-size: 48%;
  background-position: center center;
}
.v-progress-circular {
  width: 170px !important;
  height: 170px !important;
  overflow: hidden;
}

.v-progress-circular > svg {
  width: 100% !important;
  height: 100% !important;
  /* background-image: url("preload-circle.svg"); */
  background-size: 85%;
  background-position: center center;
}
.v-progress-circular--indeterminate > svg {
  animation: progress-circular-rotate 6s linear infinite;
}
.v-progress-circular__overlay {
  stroke: none;
}

.dx-datagrid-headers,
.dx-datagrid-content,
.dx-datagrid-rowsview{
  border: none !important;
}
.dx-command-adaptive{
  background: #fff;
}
/* preload end */

@media screen and (max-width: 992px) {
  .small-close {
    display: inline-flex;
  }

  .expand-close {
    display: none;
  }
}

@media screen and (min-width: 638px) {
  .no-margin {
    margin-top: -19px !important;
  }
}

@media screen and (max-width: 803px) and (min-width: 616px) {
  .dx-button-mode-contained {
    top: -160px;
  }
}

@media screen and (max-width: 637px) and (min-width: 616px) {
  .dx-button-mode-contained {
    top: -184px;
  }
}

@media screen and (max-width: 615px) and (min-width: 459px) {
  .dx-button-mode-contained {
    top: -155px;
    left: -46%;
    width: 404px !important;
  }

  .select-text {
    min-width: 177px;
  }
}

@media screen and (max-width: 459px) {
  .select-text {
    min-width: 300px;
  }
  .topbutton {
    width: 65px;
    height: 65px;
  }

  .dx-button-mode-contained-copy {
    /* width: 300px; */
    min-width: 100%;
    padding: 10px 0;
    margin: 0 auto;
  }

  .dx-toolbar-item-content > .dx-texteditor {
    width: 296px !important;
  }

  .dx-button-mode-contained {
    width: 646px !important;
    top: -165px;
    left: 9px;
  }

  .select-text {
    /* text-align: center; */
    font-size: 1rem;
    font-weight: 500;
  }

  .no-spacer {
    display: none;
  }

  .v-select {
    margin: 0 auto !important;
  }

  .serch-but {
    width: 75% !important;
  }
  .v-btn:not(.v-btn--round).v-size--small {
    height: 40px;
  }
  .v-btn:not(.v-btn--round).v-size--small {
    min-width: 55px;
  }
}
</style>
