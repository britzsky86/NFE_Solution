
function calendarSetting(bMonth) {
    
    if (!bMonth) {
	
	// datepicker 설정.
	$('#BeginDate').datepicker({
	    format: 'yyyy-mm-dd',
	    language: 'ko',
	    todayHighlight:true,
		autoclose: true
	});

	$('#EndDate').datepicker({
	    format: 'yyyy-mm-dd',
	    language: 'ko',
	    todayHighlight:true,
	    autoclose: true
	});
    
    } else {
	
	// datepicker 설정.
	$('#BeginDate').datepicker({
	    format: 'yyyy-mm',
	    language: 'ko',
	    todayHighlight:true,
		autoclose: true
	});

	$('#EndDate').datepicker({
	    format: 'yyyy-mm',
	    language: 'ko',
	    todayHighlight:true,
	    autoclose: true
	});
	
    } 
    
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

// 조회조건 생성.
function getConditionText(type, value) {
    
    var condition;
    
    if (type == 'ALL') {
	condition = "NOT";
    } else if (type == 'Item') {
	
	value = $('#Item').val();
	condition = " AND (iv.Barcode LIKE "+"'"+value+"%'"+" OR iv.ItemName LIKE "+"'%"+value+"')";
	
    } else if (type == 'Group') {
	condition = " AND igm.BigID = "+value;
    } else if (type == 'Sppl') {
	condition = " AND s.SpplID = "+value;
    } else if (type == 'Stop') {
	condition = " AND iv.StatusCD = "+value;
    } else {
	condition = "NOT";
    }
    
    if (value == "" || value == null)
	condition = "NOT";
    
    return condition;
}

//달력기간 이벤트.
function changePeriodType() {
	
    var periodSelect = document.getElementById("PeriodType");  
	  
    // select element에서 선택된 option의 value가 저장된다.  
    var selectValue = periodSelect.options[periodSelect.selectedIndex].value;  
	
    // 날짜설정.
    DoBuildPeriod(selectValue);
}

function DoBuildPeriod(periodType) {
	
    var now = new Date();
	
    var beginDate, endDate;
    
    switch (periodType) {
    case 'day':
	beginDate = new Date(now.getFullYear(), now.getMonth(), now.getDate()-1);
	beginDate = getFormatDate(beginDate);
	endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
	endDate = getFormatDate(endDate);
	break;
    case 'week':
	beginDate = new Date(now.getFullYear(), now.getMonth(), now.getDate()-7);
	beginDate = getFormatDate(beginDate);
	endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
	endDate = getFormatDate(endDate);
	break;
    case 'month':
	beginDate = new Date(now.getFullYear(), now.getMonth()-1, now.getDate());
	beginDate = getFormatDate(beginDate);
	endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
	endDate = getFormatDate(endDate);
	break;
    case 'year':
	beginDate = new Date(now.getFullYear()-1, now.getMonth(), now.getDate());
	beginDate = getFormatDate(beginDate);
	endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
	endDate = getFormatDate(endDate);
	break;
    default:
	beginDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
	beginDate = getFormatDate(beginDate);
	endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
	endDate = getFormatDate(endDate);
    }
    
    $("#BeginDate").datepicker("setDate", beginDate);
    $("#EndDate").datepicker("setDate", endDate);
}

// 조회조건 이벤트.
function changeSearchType() {
    
    var searchselect = document.getElementById("SearchType");  
	  
    // select element에서 선택된 option의 value가 저장된다.  
    var selectValue = searchselect.options[searchselect.selectedIndex].value;  
    
    if (selectValue == 'Item') {
	$('#CommonDlg').css('display', 'none');
	$('#DlgCondition').css('display', 'none');
	$('#ItemCondition').css('display', '');
    } else if (selectValue == 'Group' || selectValue == 'Sppl') {
	$('#CommonDlg').css('display', '');
	$('#DlgCondition').css('display', '');
	$('#ItemCondition').css('display', 'none');
    } else {
	$('#CommonDlg').css('display', 'none');
	$('#DlgCondition').css('display', 'none');
	$('#ItemCondition').css('display', 'none');
    }
}

//select box storeId 가져온다.
function DoBuildStoreID(storeId) {

    var tmpMap = [];
    var itemstr = '';

    if (storeId == '' || storeId == null) {

	$('#StoreList option').each(function() {
	    if (this.value != '' && this.value != null) {
		tmpMap.push(this.value);
	    }
	});

	$.each(tmpMap, function(index, item) {
	    itemstr += item + ',';
	});

	storeId = itemstr.slice(0, -1); //문자
    }

    return storeId;
}

function DoBuildPhoneNumber(str) {
	
    var phoneNumber = str.replace(/(^02.{0}|^01.{1}|[0-9]{3})([0-9]+)([0-9]{4})/,"$1-$2-$3");

    return phoneNumber;
}