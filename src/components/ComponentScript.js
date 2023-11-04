import data from "../assets/data.json";

export default {
  data() {
    return {
      hideStatus: [],
      allCheckBox: [],
      UIData: [],
      wwInfo: {},
      allCheck: false,
    };
  },
  mounted() {
    this.UIData = data;
    this.wwInfo = this.getWWFromDate();
  },
  computed: {
    wwData() {
      return `${this.wwInfo.year}WW${this.wwInfo.workweek}.${this.wwInfo.numofday}`;
    },
    productDataByStatus() {
      let tmp = {};
      let data = this.UIData;
      let statusSet = new Set();

      data.forEach((element) => {
        let status = element.Status;
        let cores = element.Cores;

        // push status to set
        statusSet.add(status);

        if (this.hideStatus.includes(status)) return; // Hide by status
        if (!tmp[status]) tmp[status] = {};
        if (!tmp[status][cores]) tmp[status][cores] = [];

        tmp[status][cores].push(element);
      });

      // sort status in order
      const strings = new Set(statusSet);
      const sortedStringsArray = [...strings].sort();
      statusSet = new Set(sortedStringsArray);

      return {
        status: [...statusSet],
        data: tmp,
      };
    },
  },
  methods: {
    calstatusRowspan(data) {
      let sum = Object.keys(data).length + 1;
      for (const cores in data) {
        sum += Object.keys(data[cores]).length;
      }
      return sum;
    },
    getWWFromDate(date = null) {
      let currentDate = date || new Date();
      let startDate = new Date(currentDate.getFullYear(), 0, 1);
      let days = Math.floor((currentDate - startDate) / (24 * 60 * 60 * 1000));

      return {
        year: currentDate.getFullYear(),
        workweek: Math.ceil(days / 7),
        numofday: currentDate.getDay(),
      };
    },
    hideShowAllStatus() {
      if (!document.querySelector(".styled").checked) {
        this.hideStatus = [];
        this.allCheckBox = [];
      }

      if (document.querySelector(".styled").checked) {
        this.hideStatus = this.productDataByStatus.status;
        this.allCheckBox = this.productDataByStatus.status;
      }

      this.allCheck = !this.allCheck;

      if (this.allCheck) {
        // Perform some action when all checkboxes are checked
      } else {
        this.hideStatus = [];
        this.allCheckBox = [];
      }
    },
  },
};