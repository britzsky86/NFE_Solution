// Set new default font family and font color to mimic Bootstrap's default styling
/*Chart.defaults.global.defaultFontFamily = 'Nunito', '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#858796';*/

window.onload = function() {
	
	getEverySales();
}

function number_format(number, decimals, dec_point, thousands_sep) {
  // *     example: number_format(1234.56, 2, ',', ' ');
  // *     return: '1 234,56'
  number = (number + '').replace(',', '').replace(' ', '');
  var n = !isFinite(+number) ? 0 : +number,
    prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
    sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
    dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
    s = '',
    toFixedFix = function(n, prec) {
      var k = Math.pow(10, prec);
      return '' + Math.round(n * k) / k;
    };
  // Fix for IE parseFloat(0.55).toFixed(0) = 0;
  s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
  if (s[0].length > 3) {
    s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
  }
  if ((s[1] || '').length < prec) {
    s[1] = s[1] || '';
    s[1] += new Array(prec - s[1].length + 1).join('0');
  }
  return s.join(dec);
}

function getFormatDate(date){
	
    var year = date.getFullYear();
    var month = (1 + date.getMonth());
    month = month >= 10 ? month : '0' + month;
    var day = date.getDate();
    day = day >= 10 ? day : '0' + day;
    
    return year + '-' + month + '-' + day;
}

function getEverySales() {
	
	// 순차적으로 호출한다.
	new Promise((resolve, reject) => {
		commonAjax('daysAnalysis', false);
		resolve();
	}).then(() => {
		commonAjax('monthAnalysis', false);
	}).then(() => {
		commonAjax('daysAnalysis', true);
	}).then(() => {
		commonAjax('timesAnalysis', true);
	}).catch(() => {
	    console.log('Error!'); 
	})
}

function commonAjax(searchType, weekFlag) {
	
	var beginDate, endDate;
	
	var now = new Date();
	
	if (!weekFlag) {
		beginDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
		beginDate = getFormatDate(beginDate);
		endDate = beginDate;
	} else {
		beginDate = new Date(now.getFullYear(), now.getMonth(), now.getDate()-7);
		beginDate = getFormatDate(beginDate);
		endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
		endDate = getFormatDate(endDate);
	}
	
	console.log("조회타입 :: " + searchType + " 시작 :: "+ beginDate + " 종료 :: "+ endDate )
	
	$.ajax({
		url      : 'https://alphacashier.co.kr/KioskAPI/Kiosk/selectCommonAnalysis.do',
		dataType : 'json',
		method : 'post',
		data : {
			pageId : searchType,
			beginDate : beginDate,
			endDate : endDate,
			storeId : 2100000000201
		},
		success : function(data) {
			
			if (searchType == 'daysAnalysis' && !weekFlag) {
				
				document.getElementById("TodaySaleCnt").innerHTML 		= number_format(data.rows[0].SaleCnt) + '명';
				document.getElementById("TodayCustomerAmt").innerHTML 	= number_format(data.rows[0].CustomerAmt) + '원';
				document.getElementById("TodaySaleAmt").innerHTML 		= number_format(data.rows[0].SaleAmt) + '원';
				document.getElementById("TodayProfitAmt").innerHTML 	= number_format(0) + '원';
				document.getElementById("TodayProfitRatio").innerHTML 	= number_format(0) + '%';
			
			} else if (searchType == 'monthAnalysis') {
				
				document.getElementById("MonthSaleCnt").innerHTML 		= number_format(data.rows[0].SaleCnt) + '명';
				document.getElementById("MonthCustomerAmt").innerHTML 	= number_format(data.rows[0].CustomerAmt) + '원';
				document.getElementById("MonthSaleAmt").innerHTML 		= number_format(data.rows[0].SaleAmt) + '원';
				document.getElementById("MonthProfitAmt").innerHTML 	= number_format(0) + '원';
				document.getElementById("MonthProfitRatio").innerHTML 	= number_format(0) + '%';
			
			} else if (searchType == 'daysAnalysis' && weekFlag) {
				
				// 차트의 Labels, data에 넣을 ArrayList 생성.
				var arrSaleDateValues = new Array();
				var arrSaleAmtValues = new Array();
				
				for (var iRow = 1; iRow < data.rows.length; iRow++) {
					arrSaleDateValues.push(data.rows[iRow].SaleDate);
					arrSaleAmtValues.push(data.rows[iRow].SaleAmt);
				}
				// 차트 그리기
				doBuildBarChart(arrSaleDateValues, arrSaleAmtValues, false);
				
			} else if (searchType == 'timesAnalysis' && weekFlag) {
				
				// 차트의 Labels, data에 넣을 ArrayList 생성.
				var arrSaleDateValues = new Array();
				var arrSaleAmtValues = new Array();
				
				for (var iRow = 1; iRow < data.rows.length; iRow++) {
					arrSaleDateValues.push(data.rows[iRow].SaleHour);
					arrSaleAmtValues.push(data.rows[iRow].SaleAmt);
				}
				// 차트 그리기
				doBuildBarChart(arrSaleDateValues, arrSaleAmtValues, true);
			}
		},
		beforeSend : function() {
			//(로딩 이미지 보여주기 처리)
			/*$('.wrap-loading').removeClass('display-none');*/
		},
		complete : function() {
			//( 로딩이미지 감추기 처리)
			/*$('.wrap-loading').addClass('display-none');
			$(':focus').blur();*/
		},
		error : function(request, status, error) {
			console.log("code:" + request.status + "\n" + "message:"
					+ request.responseText + "\n" + "error:" + error);
		}
	});
}

function doBuildBarChart(arrSaleDateValues, arrSaleAmtValues, chartFlag) {
	
	var ctx;
	
	if (!chartFlag) {
		ctx = document.getElementById("myBarChart");
	} else {
		ctx = document.getElementById("myBarChart2");
	}
	
	// 차트의 최대값을 구하기 위함.
	var maxValue = Math.max.apply(null, arrSaleAmtValues);
	var minValue = Math.min.apply(null, arrSaleAmtValues);
	
	maxValue = Math.ceil(maxValue);
	minValue = Math.ceil(minValue);
	
	maxValue = maxValue + 10000;
	
	console.log("max :: " + maxValue);
	console.log("min :: " + minValue);
	
	var myBarChart = new Chart(ctx, {
	  type: 'bar',
	  data: {
	    labels: arrSaleDateValues,
	    datasets: [{
	      label: "Revenue",
	      backgroundColor: "#4e73df",
	      hoverBackgroundColor: "#2e59d9",
	      borderColor: "#4e73df",
	      data: arrSaleAmtValues,
	    }],
	  },
	  options: {
	    maintainAspectRatio: false,
	    layout: {
	      padding: {
	        left: 10,
	        right: 25,
	        top: 25,
	        bottom: 0
	      }
	    },
	    scales: {
	      xAxes: [{
	        gridLines: {
	          display: false,
	          drawBorder: false
	        },
	        maxBarThickness: 25,
	      }],
	      yAxes: [{
	        ticks: {
	          min: 0,
	          max: maxValue,
	          maxTicksLimit: 10,
	          padding: 10,
	          // Include a dollar sign in the ticks
	          callback: function(value, index, values) {
	            return number_format(value)+'원';
	          }
	        },
	        gridLines: {
	          color: "rgb(234, 236, 244)",
	          zeroLineColor: "rgb(234, 236, 244)",
	          drawBorder: false,
	          borderDash: [2],
	          zeroLineBorderDash: [2]
	        }
	      }],
	    },
	    legend: {
	      display: false
	    },
	    tooltips: {
	      titleMarginBottom: 10,
	      titleFontColor: '#6e707e',
	      titleFontSize: 14,
	      backgroundColor: "rgb(255,255,255)",
	      bodyFontColor: "#858796",
	      borderColor: '#dddfeb',
	      borderWidth: 1,
	      xPadding: 15,
	      yPadding: 15,
	      displayColors: false,
	      caretPadding: 10,
	      callbacks: {
	        label: function(tooltipItem, chart) {
	          var datasetLabel = chart.datasets[tooltipItem.datasetIndex].label || '';
	          return datasetLabel + ':' + number_format(tooltipItem.yLabel) + '원';
	        }
	      }
	    },
	  }
	});
}