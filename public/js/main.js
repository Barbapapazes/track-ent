var ctx = document.getElementById('chart').getContext('2d')

fetch('/data')
  .then((res) => res.json())
  .then((data) => {
    drawChart(data)
  })

function drawChart(data) {
  const dates = data.map((obj) => obj.date)
  const status = data.map((obj) => obj.status)
  const colors = status.map((value) => {
    if (value === 200) {
      return 'rgb(0, 255, 0)'
    } else {
      return 'rgb(255, 0, 0)'
    }
  })

  console.log(dates.length, status.length, colors.length)

  console.log(dates)

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
    options: {},
  })
}
