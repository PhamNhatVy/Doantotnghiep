
//-- script cho ngay thang nam
function updateClock(){
    var now = new Date();
    var dname = now.getDay(),
        mo = now.getMonth(),
        dnum = now.getDate(),
        yr = now.getFullYear();

    var months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    var week = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    var ids = ["dayname", "month", "daynum", "year"];
    var values = [week[dname], months[mo], dnum, yr];
    for(var i = 0; i < ids.length; i++)
    document.getElementById(ids[i]).textContent = values[i];
}

function initClock(){
    updateClock();
   setInterval("updateClock", 1000);
}
initClock();
// script cho dong ho
let time = document.getElementById("current-time");

setInterval(() =>{
    let d = new Date();
    time.innerHTML = d.toLocaleTimeString();
},1000)

//lấy dữ liệu từ firebase và cấu hình thông số kết nối
const firebaseConfig = {
  apiKey: "AIzaSyAeRk0IQOwVv1fpn64Qs6BSAguZAl0wxmI",
  authDomain: "da-tn-477be.firebaseapp.com",
  databaseURL: "https://da-tn-477be-default-rtdb.firebaseio.com",
  projectId: "da-tn-477be",
  storageBucket: "da-tn-477be.appspot.com",
  messagingSenderId: "455706461067",
  appId: "1:455706461067:web:a491cf8a9d6f9afd23a58e"
};

//khởi tạo kết nối firebase
firebase.initializeApp(firebaseConfig);
 
function getLatestData(sensorRef, temperatureElementId, humidityElementId, timeElementId) {
  sensorRef.limitToLast(1).on('value', function(snapshot) {
    var latestData = snapshot.val();
  
    var latestTimestamp, latestTemperature, latestHumidity;
    for (var date in latestData) {
      for (var time in latestData[date]) {
        var idObj = latestData[date][time];
        for (var id in idObj) {
          var sensorObj = idObj[id];
          latestTimestamp = date + '/' + time;
          latestTemperature = sensorObj.temperature;
          latestHumidity = sensorObj.humidity;
        }
      }
    }
  
    document.getElementById(temperatureElementId).textContent = 'Nhiệt độ: ' + latestTemperature + ' °C';
    document.getElementById(humidityElementId).textContent = 'Độ ẩm: ' + latestHumidity + ' %';
    document.getElementById(timeElementId).textContent = 'Thời gian: ' + latestTimestamp;
  });
}

// Lấy tham chiếu đến nút CAM01 trong cơ sở dữ liệu Firebase
var cam01Ref = firebase.database().ref('/CAM01');

// Lấy giá trị gần nhất từ nút CAM01
cam01Ref.limitToLast(1).once('value', function(snapshot) {
  var latestData = snapshot.val();

  // Lặp qua các thuộc tính trong latestData để tìm thông tin thời gian và dữ liệu cảnh báo
  var latestTimestamp, latestWarning;
  for (var date in latestData) {
    for (var time in latestData[date]) {
      var ipAddressObj = latestData[date][time];
      for (var ipAddress in ipAddressObj) {
        var warningObj = ipAddressObj[ipAddress];
        for (var warning in warningObj) {
          latestTimestamp = date + '/' + time;
          latestWarning = warningObj[warning];
        }
      }
    }
  }

  // Hiển thị thông tin mới nhất trên trang web
  var timestampContainer = document.getElementById("timestamp-container");
  timestampContainer.innerHTML =  latestTimestamp;

  var warningContainer = document.getElementById("warning-container");
  warningContainer.innerHTML =  latestWarning;
});

// Sử dụng Moment.js để định dạng lại thời gian
function formatTime(time) {
  return moment(time, 'HH:mm:ss').format('HH:mm:ss');
}
var currentDate = getCurrentDate();
// Lấy dữ liệu nhiệt độ và độ ẩm từ Firebase cho ngày hiện tại
function getSensor1Data() {

  var sensor1DataRef = firebase.database().ref('SENSOR1/' + currentDate);

  sensor1DataRef.on('value', function(snapshot) {
    var temperatureData = [];
    var humidityData = [];
    var timeData = [];

    snapshot.forEach(function(timeSnapshot) {
      timeSnapshot.forEach(function(sensorSnapshot) {
        var humidity = sensorSnapshot.child('humidity').val();
        var temperature = sensorSnapshot.child('temperature').val();
        var time = formatTime(timeSnapshot.key);

        humidityData.push(humidity);
        temperatureData.push(temperature);
        timeData.push(time);
      });
    });
    // Lấy dữ liệu nhiệt độ máy đo
    var TemperatureMayDo = [30.9,30.5,32.3,30.4,32.1,31.9,31.4,31,30.8,30.3,30.1,30.2,30]; // Giá trị nhiệt độ giả sử
    // Lấy dữ liệu nhiệt độ google
    var Temperaturegoogle = [31,31,31,31,31,31,31,31,31,31,31,31,31]; // Giá trị nhiệt độ giả sử
    // Lấy dữ liệu độ ẩm máy đo
    var HumidityMayDo = [68.2,69.5,60.6,60.5,63.1,63.8,64.9,66.8,70.2,70.4,71,71.5,72.3]; // Giá trị độ ẩm giả sử
    // Lấy dữ liệu độ ẩm google
   var Humiditygoogle = [59,59,59,59,59,59,59,59,59,59,59,59,59]; // Giá trị độ ẩm giả sử

    var simulatedTimeData = []; // Thời gian tương ứng với giá trị nhiệt độ giả sử
    // Vẽ biểu đồ
    drawCharts(timeData, temperatureData, humidityData, simulatedTimeData, TemperatureMayDo, Temperaturegoogle, HumidityMayDo, Humiditygoogle );
  });
}


// Hàm vẽ biểu đồ nhiệt độ và độ ẩm từ dữ liệu Firebase
function drawCharts(timeData, temperatureData, humidityData, simulatedTimeData, TemperatureMayDo, Temperaturegoogle, HumidityMayDo, Humiditygoogle ) {
  // Cấu hình biểu đồ nhiệt độ
  var temperatureChart = new Chart(document.getElementById('sensor1TemperatureChart'), {
    type: 'line',
    data: {
      labels: timeData,
      datasets: [{
        label:'SENSOR1-Nhiệt độ-' + currentDate,
        data: temperatureData,
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1
      },
      {
        label: 'Nhiệt độ lấy từ máy đo nhiệt độ và độ ẩm kỹ thuật số',
          data: TemperatureMayDo,
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
      },
      {
        label: 'Nhiệt độ lấy từ Google',
        data: Temperaturegoogle,
        backgroundColor: 'rgba(255, 206, 86, 0.2)',
        borderColor: 'rgba(255, 206, 86, 1)',
        borderWidth: 1
      }
  ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true
        }
      },
      plugins: {
        title: {
          display: true,
          text: 'Nhiệt độ (°C) - SENSOR1',
          position: 'left'
        }
      }
    }
  });

  // Cấu hình biểu đồ độ ẩm
  var humidityChart = new Chart(document.getElementById('sensor1HumidityChart'), {
    type: 'line',
    data: {
      labels: timeData,
      datasets: [{
        label: 'SENSOR1-Độ ẩm-' + currentDate,
        data: humidityData,
        backgroundColor:'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1
      },
      {
        label: 'Độ ẩm lấy từ máy đo nhiệt độ và độ ẩm kỹ thuật số',
          data: HumidityMayDo,
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
      },
      {
        label: 'Độ ẩm lấy từ Google',
        data: Humiditygoogle,
        backgroundColor: 'rgba(255, 206, 86, 0.2)',
        borderColor: 'rgba(255, 206, 86, 1)',
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,// Tắt việc giữ tỷ lệ khung biểu đồ
      scales: {
        y: {
          beginAtZero: true
        }
      },
      plugins: {
        title: {
          display: true,
          text: 'Độ ẩm (%) - SENSOR1',
          position: 'left'
        }
      }
    }
  });
}

function getSensor2Data() {

  var sensor2DataRef = firebase.database().ref('SENSOR2/' + currentDate);

  sensor2DataRef.on('value', function(snapshot) {
    var temperatureData = [];
    var humidityData = [];
    var timeData = [];

    snapshot.forEach(function(timeSnapshot) {
      timeSnapshot.forEach(function(sensorSnapshot) {
        var humidity = sensorSnapshot.child('humidity').val();
        var temperature = sensorSnapshot.child('temperature').val();
        var time = formatTime(timeSnapshot.key);

        humidityData.push(humidity);
        temperatureData.push(temperature);
        timeData.push(time);
      });
    });
    // Lấy dữ liệu nhiệt độ máy đo
    var TemperatureMayDo = [30.9,31.2,32.3,32.5,32.6,32.1,31.8,31.4,31.1,30.4,30.1,30.2,30.2,30]; // Giá trị nhiệt độ giả sử
    // Lấy dữ liệu nhiệt độ google
    var Temperaturegoogle = [31,31,31,31,31,31,31,31,31,31,31,31,31,31]; // Giá trị nhiệt độ giả sử
    // Lấy dữ liệu độ ẩm máy đo
    var HumidityMayDo = [68.3,64.2,60.4,60.3,62,63.2,64,65,67,70.6,70.6,71.4,71.7,72.3]; // Giá trị độ ẩm giả sử
    // Lấy dữ liệu độ ẩm google
   var Humiditygoogle = [59,59,59,59,59,59,59,59,59,59,59,59,59,59]; // Giá trị độ ẩm giả sử

    var simulatedTimeData = []; // Thời gian tương ứng với giá trị nhiệt độ giả sử

    // Vẽ biểu đồ
    drawCharts2(timeData, temperatureData, humidityData, simulatedTimeData,  TemperatureMayDo, Temperaturegoogle, HumidityMayDo, Humiditygoogle );
  });
}


// Hàm vẽ biểu đồ nhiệt độ và độ ẩm từ dữ liệu Firebase
function drawCharts2(timeData, temperatureData, humidityData, simulatedTimeData,TemperatureMayDo, Temperaturegoogle,HumidityMayDo, Humiditygoogle  ) {
  // Cấu hình biểu đồ nhiệt độ
  var temperatureChart = new Chart(document.getElementById('sensor2TemperatureChart'), {
    type: 'line',
    data: {
      labels: timeData,
      datasets: [{
        label:'SENSOR2-Nhiệt độ-' + currentDate,
        data: temperatureData,
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1
      },
      {
        label:'Nhiệt độ lấy từ máy đo nhiệt độ và độ ẩm kỹ thuật số',
          data: TemperatureMayDo,
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
      },
      {
        label:  'Nhiệt độ lấy từ Google',
        data: Temperaturegoogle,
        backgroundColor: 'rgba(255, 206, 86, 0.2)',
        borderColor: 'rgba(255, 206, 86, 1)',
        borderWidth: 1
      }
  ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true
        }
      },
      plugins: {
        title: {
          display: true,
          text: 'Nhiệt độ (°C) - SENSOR2',
          position: 'left'
        }
      }
    }
  });

  // Cấu hình biểu đồ độ ẩm
  var humidityChart = new Chart(document.getElementById('sensor2HumidityChart'), {
    type: 'line',
    data: {
      labels: timeData,
      datasets: [{
        label: 'SENSOR2-Độ ẩm-' + currentDate,
        data: humidityData,
        backgroundColor:'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1
      },
      {
        label: 'Độ ẩm lấy từ máy đo nhiệt độ và độ ẩm kỹ thuật số',
          data: HumidityMayDo,
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
      },
      {
        label: 'Độ ẩm lấy từ Google',
        data: Humiditygoogle,
        backgroundColor: 'rgba(255, 206, 86, 0.2)',
        borderColor: 'rgba(255, 206, 86, 1)',
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,// Tắt việc giữ tỷ lệ khung biểu đồ
      scales: {
        y: {
          beginAtZero: true
        }
      },
      plugins: {
        title: {
          display: true,
          text: 'Độ ẩm (%) - SENSOR2',
          position: 'left'
        }
      }
    }
  });
}

function getSensor3Data() {

  var sensor3DataRef = firebase.database().ref('SENSOR3/' + currentDate);

  sensor3DataRef.on('value', function(snapshot) {
    var temperatureData = [];
    var humidityData = [];
    var timeData = [];

    snapshot.forEach(function(timeSnapshot) {
      timeSnapshot.forEach(function(sensorSnapshot) {
        var humidity = sensorSnapshot.child('humidity').val();
        var temperature = sensorSnapshot.child('temperature').val();
        var time = formatTime(timeSnapshot.key);

        humidityData.push(humidity);
        temperatureData.push(temperature);
        timeData.push(time);
      });
    });
 // Lấy dữ liệu nhiệt độ máy đo
 var TemperatureMayDo = [30.9,31.2,32.3,32.6,32.6,32.2,31.7,31,31.2,30.4,30.2,30.2,30]; // Giá trị nhiệt độ giả sử
 // Lấy dữ liệu nhiệt độ google
 var Temperaturegoogle = [31,31,31,31,31,31,31,31,31,31,31,31,31]; // Giá trị nhiệt độ giả sử
 // Lấy dữ liệu độ ẩm máy đo
 var HumidityMayDo = [68.4,68.5,60.2,63.3,62.1,63,64.2,67.2,68.8,71.2,71.3,71.9,72.3]; // Giá trị độ ẩm giả sử
 // Lấy dữ liệu độ ẩm google
var Humiditygoogle = [59,59,59,59,59,59,59,59,59,59,59,59,59]; // Giá trị độ ẩm giả sử

 var simulatedTimeData = []; // Thời gian tương ứng với giá trị nhiệt độ giả sử
    // Vẽ biểu đồ
    drawCharts3(timeData, temperatureData, humidityData, simulatedTimeData,  TemperatureMayDo, Temperaturegoogle, HumidityMayDo, Humiditygoogle );
  });
}


// Hàm vẽ biểu đồ nhiệt độ và độ ẩm từ dữ liệu Firebase
function drawCharts3(timeData, temperatureData, humidityData, simulatedTimeData,  TemperatureMayDo, Temperaturegoogle, HumidityMayDo, Humiditygoogle  ) {
  // Cấu hình biểu đồ nhiệt độ
  var temperatureChart = new Chart(document.getElementById('sensor3TemperatureChart'), {
    type: 'line',
    data: {
      labels: timeData,
      datasets: [{
        label:'SENSOR3-Nhiệt độ-' + currentDate,
        data: temperatureData,
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1
      },
      {
        label: 'Nhiệt độ lấy từ máy đo nhiệt độ và độ ẩm kỹ thuật số',
          data:  TemperatureMayDo,
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
      },
      {
        label: 'Nhiệt độ lấy từ Google',
        data: Temperaturegoogle,
        backgroundColor: 'rgba(255, 206, 86, 0.2)',
        borderColor: 'rgba(255, 206, 86, 1)',
        borderWidth: 1
      }
  ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true
        }
      },
      plugins: {
        title: {
          display: true,
          text: 'Nhiệt độ (°C) - SENSOR3',
          position: 'left'
        }
      }
    }
  });

  // Cấu hình biểu đồ độ ẩm
  var humidityChart = new Chart(document.getElementById('sensor3HumidityChart'), {
    type: 'line',
    data: {
      labels: timeData,
      datasets: [{
        label: 'SENSOR3-Độ ẩm-' + currentDate,
        data: humidityData,
        backgroundColor:'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1
      },
      {
        label: 'Độ ẩm lấy từ máy đo nhiệt độ và độ ẩm kỹ thuật số',
          data:  HumidityMayDo,
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
      },
      {
        label:  'Độ ẩm lấy từ Google',
        data: Humiditygoogle,
        backgroundColor: 'rgba(255, 206, 86, 0.2)',
        borderColor: 'rgba(255, 206, 86, 1)',
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,// Tắt việc giữ tỷ lệ khung biểu đồ
      scales: {
        y: {
          beginAtZero: true
        }
      },
      plugins: {
        title: {
          display: true,
          text: 'Độ ẩm (%) - SENSOR3',
          position: 'left'
        }
      }
    }
  });
}





// Hàm lấy ngày hiện tại dưới dạng chuỗi 'YYYY-MM-DD'
function getCurrentDate() {
  var currentDate = new Date();
  var year = currentDate.getFullYear();
  var month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
  var day = currentDate.getDate().toString().padStart(2, '0');
  return year + '-' + month + '-' + day;
}

// Tạo hàm hiển thị dữ liệu cho sensor
function displaySensorData(sensorName, containerId) {
  var sensorRef = firebase.database().ref(sensorName);

  sensorRef.limitToLast(1).once('value', function(snapshot) {
    var tableContainer = document.getElementById(containerId);
    tableContainer.innerHTML = '';

    if (snapshot.exists()) {
      var table = document.createElement('table');
      var headerRow = document.createElement('tr');
      var timeHeader = document.createElement('th');
      timeHeader.textContent = 'Thời gian';
      var temperatureHeader = document.createElement('th');
      temperatureHeader.textContent = 'Nhiệt độ (°C)';
      var humidityHeader = document.createElement('th');
      humidityHeader.textContent = 'Độ ẩm (%)';
      headerRow.appendChild(timeHeader);
      headerRow.appendChild(temperatureHeader);
      headerRow.appendChild(humidityHeader);
      table.appendChild(headerRow);

      snapshot.forEach(function(dateSnapshot) {
        var currentDate = new Date();
        var formattedCurrentDate = formatDate(currentDate);

        if (dateSnapshot.key === formattedCurrentDate) { // Kiểm tra nếu là ngày hiện tại
          dateSnapshot.forEach(function(timeSnapshot) {
            timeSnapshot.forEach(function(ipSnapshot) {
              var humidity = ipSnapshot.child('humidity').val();
              var temperature = ipSnapshot.child('temperature').val();
              var timestamp = timeSnapshot.key;

              var dataRow = document.createElement('tr');
              var timeCell = document.createElement('td');
              timeCell.textContent = timestamp;
              var temperatureCell = document.createElement('td');
              temperatureCell.textContent = temperature;
              var humidityCell = document.createElement('td');
              humidityCell.textContent = humidity;
              dataRow.appendChild(timeCell);
              dataRow.appendChild(temperatureCell);
              dataRow.appendChild(humidityCell);
              table.appendChild(dataRow);
            });
          });
        }
      });

      tableContainer.appendChild(table);
    } else {
      // Hiển thị thông báo hoặc thực hiện hành động khác khi không có dữ liệu
      var message = document.createElement('p');
      message.textContent = 'Không có dữ liệu cho ngày hôm nay.';
      tableContainer.appendChild(message);
    }
  });
}

// Định dạng ngày thành chuỗi 'YYYY-MM-DD'
function formatDate(date) {
  var year = date.getFullYear();
  var month = (date.getMonth() + 1).toString().padStart(2, '0');
  var day = date.getDate().toString().padStart(2, '0');

  return year + '-' + month + '-' + day;
}

window.onload = function() {
getLatestData(firebase.database().ref('/SENSOR1'), 'sensor1TemperatureValue', 'sensor1HumidityValue', 'sensor1TimeValue');
getLatestData(firebase.database().ref('/SENSOR2'), 'sensor2TemperatureValue', 'sensor2HumidityValue', 'sensor2TimeValue');
getLatestData(firebase.database().ref('/SENSOR3'), 'sensor3TemperatureValue', 'sensor3HumidityValue', 'sensor3TimeValue');
getSensor1Data();
getSensor2Data();
getSensor3Data();

displaySensorData('SENSOR1', 'sensor1Data');
displaySensorData('SENSOR2', 'sensor2Data');
displaySensorData('SENSOR3', 'sensor3Data');
};

