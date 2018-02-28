console.log(POLL);

var ctx = document.querySelector('.pollChart').getContext("2d");

const randomNum = () => Math.floor((Math.random() * 255) + 1);

Chart.defaults.global.maintainAspectRatio = false;

const optionBackgroundColor = [];
const optionBorderColor = [];
const optionLabels = POLL.options.map(opt => opt.option);
const optionData   = POLL.options.map(opt => opt.votes);

for (var i = 0; i < optionLabels.length; i++) {
  const r = randomNum();
  const g = randomNum();
  const b = randomNum();
  optionBackgroundColor.push(`rgba(${r}, ${g}, ${b}, 0.2)`);
  optionBorderColor.push(`rgba(${r}, ${g}, ${b}, 1)`);
};

const pollChart = new Chart(ctx, {
  type: 'pie',
  data: {
    labels: optionLabels,
    datasets: [{
      label: '# of Votes',
      data: optionData,
      backgroundColor: optionBackgroundColor,
      borderColor: optionBorderColor,
      borderWidth: 1
    }]
  },
  options: {
    responsive: false,
    tooltips: {
      // bodyFontSize: 80
    },
    legend: {
      labels: {
        // padding: 40,
        // fontSize: 80
      },
      display: true,
      position: 'right',
      onClick: null
    },
    scales: {
      yAxes: [{
        display: false
      }],
      xAxes: [{
        display: false
      }]
    }
  }
});