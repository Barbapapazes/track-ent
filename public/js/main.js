var ctx = document.getElementById('chart').getContext('2d')

fetch('/data', { mode: 'cors' })
  .then((res) => res.json())
  .then((data) => {
    drawChart(data)
  })

function drawChart(data) {
  sortData = data.sort((obj1, obj2) => {
    if (obj1.date > obj2.date) return 1
    else return -1
  })
  const dates = sortData.map((obj) => {
    const date = new Date(obj.date)
    return date.toLocaleString()
  })
  const status = sortData.map((obj) => obj.status)
  const colors = status.map((value) => {
    if (value === 200) {
      return 'rgb(0, 255, 0)'
    } else {
      return 'rgb(255, 0, 0)'
    }
  })

  const chart = new Chart(ctx, {
    // The type of chart we want to create
    type: 'line',

    // The data for our dataset
    data: {
      labels: dates,
      datasets: [
        {
          label: 'Status codes from ENT',
          borderColor: colors,
          backgroundColor: colors,
          fill: true,
          pointRadius: 3,
          pointHoverRadius: 8,
          showLine: false,
          data: status,
        },
      ],
    },

    // Configuration options go here
    options: {
      scales: {
        xAxes: [{}],
      },
    },
  })
}
