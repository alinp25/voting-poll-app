var ctx = document.querySelector(".pollChart").getContext("2d");
const chartLegend = document.querySelector(".chartjs-legend");

const randomNum = () => Math.floor(Math.random() * 255 + 1);

const optionBackgroundColor = [];
const optionBorderColor = [];
const optionLabels = POLL.labels;
const optionData = POLL.votes;
const currentLocation = window.location;

for (var i = 0; i < optionLabels.length; i++) {
  const r = randomNum();
  const g = randomNum();
  const b = randomNum();
  optionBackgroundColor.push(`rgba(${r}, ${g}, ${b}, 0.5)`);
  optionBorderColor.push(`rgba(${r}, ${g}, ${b}, 1)`);
}

const data = {
  labels: optionLabels,
  datasets: [
    {
      label: "# of Votes",
      data: optionData,
      backgroundColor: optionBackgroundColor,
      borderColor: optionBorderColor,
      borderWidth: 1
    }
  ]
};

const options = {
  animation: {
    animateRotate: false,
    animateScale: true
  },
  cutoutPercentage: 85,
  legend: false,
  legendCallback: function(chart) {
    const text = [];
    text.push("<ul class=" + chart.id + '-legend">');
    for (var i = 0; i < chart.data.datasets[0].data.length; i++) {
      text.push(
        `<li><a href="${currentLocation}/update/${i}" style="background-color: ` +
          chart.data.datasets[0].backgroundColor[i] +
          `">`
      );
      if (chart.data.labels[i]) {
        text.push(chart.data.labels[i]);
      }
      text.push("</a></li>");
    }
    text.push("</ul>");
    return text.join("");
  },
  tooltips: {
    mode: "single",
    callbacks: {
      label: function(tooltipItems, data) {
        var sum = data.datasets[0].data.reduce(add, 0);
        function add(a, b) {
          return a + b;
        }

        return (
          parseInt(data.datasets[0].data[tooltipItems.index] / sum * 100, 10) +
          "%"
        );
      },
      beforeLabel: function(tooltipItems, data) {
        return (
          data.labels[tooltipItems.index] + ' ' // +  
          // data.datasets[0].data[tooltipItems.index] +
          // " vote" +
          // (data.datasets[0].data[tooltipItems.index] == 1 ? "" : "s")
        );
      }
    }
  }
};

const pollChart = new Chart(ctx, {
  type: "pie",
  data: data,
  options: options
});

chartLegend.innerHTML = pollChart.generateLegend();

// const liChartLegend = chartLegend.querySelectorAll("li");
// const ulChartLegend = chartLegend.querySelector("ul");
// liChartLegend.forEach(lis =>
//   lis.addEventListener("click", function(e) {
//     const idx = Array.prototype.indexOf.call(ulChartLegend.children, this);
//     pollChart.data.datasets[0].data[idx] += 1;
//   })
// );
pollChart.update();

// /*$('#myChart').on('click', function(evt) {
//   var activePoints = myChart.getElementsAtEvent(evt);
//   var firstPoint = activePoints[0];
//   if (firstPoint !== undefined) {
//     console.log('canvas: ' + data.datasets[firstPoint._datasetIndex].data[firstPoint._index]);
//   } else {
//     myChart.data.labels.push("New");
//     myChart.data.datasets[0].data.push(100);
//     myChart.data.datasets[0].backgroundColor.push("red");
//     myChart.options.animation.animateRotate = false;
//     myChart.options.animation.animateScale = false;
//     myChart.update();
//     $("#chartjs-legend").html(myChart.generateLegend());
//   }
// });*/
