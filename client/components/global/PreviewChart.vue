<template>
  <line-chart :chart-data="datacollection" :options="options"></line-chart>
</template>

<script>
export default {
  name: 'PreviewChart',
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
        tooltips: {
          enabled: false,
        },
        scales: {
          xAxes: [
            {
              gridLines: {
                color: '#666666',
              },
              display: true,

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

              ticks: {
                stepSize: 1,
                fontColor: 'white',
                fontSize: 10,
              },
            },
          ],
        },
        legend: {
          display: false,
        },
      },
    }
  },
  computed: {
    dates() {
      const data = this.data
      return data.map((obj) => {
        const date = this.$dayjs(obj.date)
        return date.format('DD/MM/YYYY')
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
            borderColor: this.colors,
            backgroundColor: this.colors,
            fill: true,
            pointRadius: 3,
            pointHoverRadius: 3,
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
