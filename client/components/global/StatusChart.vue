<template>
  <div class="container mx-auto">
    <line-chart :chart-data="datacollection" :options="options"></line-chart>
    <div class="flex justify-end">
      <button
        class="p-2 text-lg rounded bg-purple-300 text-purple-800 uppercase tracking-wide font-bold"
        @click="refresh()"
      >
        refresh
      </button>
    </div>
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
      },
    }
  },
  computed: {
    dates() {
      const data = this.data
      return data.map((obj) => {
        const date = new Date(obj.date)
        return date.toLocaleString()
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
