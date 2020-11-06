<template>
  <div>
    <line-chart :chart-data="datacollection" :options="options"></line-chart>
    <!-- <div class="flex justify-center">
      <button
        class="p-2 text-lg rounded hover:bg-blue-300 border border-blue-300 hover:text-gray-900 text-blue-300 uppercase tracking-wide font-bold transition duration-200 ease-in-out"
        @click="refresh()"
      >
        refresh
      </button>
    </div> -->
  </div>
</template>

<script>
export default {
  name: 'StatusChart',
  props: {
    service: {
      type: String,
      default: '',
    },
  },
  async fetch() {
    const { apiUrl } = this.$config
    this.data = await this.$axios.$get(`http://${apiUrl}/api/${this.service}`)
    this.fillData()
  },
  data() {
    return {
      data: null,
      datacollection: {},
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          xAxes: [
            {
              gridLines: {
                color: '#666666',
              },
              display: true,
              scaleLabel: {
                display: true,
                labelString: 'Temps',
                fontColor: '#ffffff',
                fontSize: 12,
              },
              ticks: {
                fontColor: 'white',
                fontSize: 10,
              },
            },
          ],
          yAxes: [
            {
              gridLines: {
                color: '#666666',
              },
              display: true,
              scaleLabel: {
                display: true,
                labelString: 'Codes HTTP',
                fontColor: '#ffffff',
                fontSize: 12,
              },
              ticks: {
                fontColor: 'white',
                fontSize: 10,
              },
            },
          ],
        },
        legend: {
          labels: {
            fontColor: 'white',
          },
        },
      },
    }
  },
  computed: {
    dates() {
      const data = this.data
      return data.map((obj) => {
        const date = this.$dayjs(obj.date)
        return date.format('dddd DD MMMM YYYY à hh:MM')
      })
    },
    status() {
      const data = this.data
      return data.map((obj) => obj.status)
    },
    colors() {
      const data = this.status
      return data.map((value) => {
        if (value === 200) {
          return 'rgb(0, 255, 0)'
        } else {
          return 'rgb(255, 0, 0)'
        }
      })
    },
  },
  methods: {
    fillData() {
      this.datacollection = {
        labels: this.dates,
        datasets: [
          {
            label: `Status codes from ${this.service}`,
            borderColor: this.colors,
            backgroundColor: this.colors,
            fill: true,
            pointRadius: 3,
            pointHoverRadius: 8,
            showLine: false,
            data: this.status,
          },
        ],
      }
    },
    refresh() {
      this.$fetch()
    },
  },
}
</script>
