const ctx = document.querySelector(".pollChart").getContext("2d");
const chartLegend = document.querySelector(".cdd");
const addVote = document.querySelector('#addVote');

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
    text.push('<select class="custom-select">');
    for (var i = 0; i < chart.data.datasets[0].data.length; i++) {
      text.push(
        '<option>'
        // `<option>` +
          // chart.data.datasets[0].backgroundColor[i] +
          // `">`
      );
      if (chart.data.labels[i]) {
        text.push(chart.data.labels[i]);
      }
      text.push("</option>");
    }
    // text.push("<option>Add New Option</option>");
    text.push("</select>");
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
          data.labels[tooltipItems.index] // + ' ' +  
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
pollChart.update();

function postVote(path, method) {
  method = method || "get"; 

  var form = document.createElement("form");
  form.setAttribute("method", method);
  form.setAttribute("action", path);

  document.body.appendChild(form);
  form.submit();
}

const optionSelect = document.querySelector('.custom-select');

addVote.addEventListener('click', () => {
  const path = `/poll/${POLL._id}/update/${optionSelect.options.selectedIndex}`;
  return postVote(path, 'get');
});
