$(document).ready(function(){
    
 // 순차적으로 호출한다.
    new Promise((resolve, reject) => {
	$('#loading').show();
	calendarSetting(false);
	resolve();
    }).then(() => {
	$('#loading').show();
	// 날짜설정.
	DoBuildPeriod('day');
    }).then(() => {
	$('#loading').hide();
	// 매장목록 조회.
	SelectStoreDataList();
    }).catch(() => {
	console.log('Error!'); 
    })
    
    // (#22328) 알파캐셔 ASP - 모든 분석화면 > 날짜조건 고정
    if (gBeginDate != '' && gBeginDate != null) {
	$("#BeginDate").datepicker("setDate", gBeginDate);	    
    }
    
    if (gEndDate != '' && gEndDate != null) {
	$('#EndDate').datepicker("setDate", gEndDate);   
    }
    
    // 조회.
    onClickSearchBtn();
});

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

//select box 정보 가져옴
function SelectStoreDataList() {
    	
	// 검색 Select Box
	$('#StoreList').select2();

	var UserID = localStorage.getItem("UserID");

	$.ajax({
		type : "POST",
		url  : ASPRoot + "/selectStoreDataList.do",
		dataType : "json",
		data : {
			userId 		: localStorage.getItem("UserID"),
			statusCd 	: localStorage.getItem("StatusCD"),
			franchiseId : localStorage.getItem("FranchiseID"),
			storeId 	: localStorage.getItem("StoreID"),
			partnerId 	: localStorage.getItem("PartnerID")
		},
		async : false,
		method : "POST",
		success : function(data) {

			if (data.rows.length != 0) {
				
				storeCount = data.rows.length;
				
				for (var i = 0; i < data.rows.length; i++) {
					// SelectBox 설정
					$("#StoreList").append(
						"<option value=" + data.rows[i].StoreID + ">"
						+ data.rows[i].CompanyName + " ("
						+ data.rows[i].BizNo + ")" + "</option>");
				}
			}
		},
		error : function(request, status, error) {
			alert("code:" + request.status + "\n" + "message:"
					+ request.responseText + "\n" + "error:" + error)
		}
	});
}

// 조회방식 이벤트.
function changeSearchType() {
	
	var searchSelect = document.getElementById("SearchType");  
	  
	// select element에서 선택된 option의 value가 저장된다.  
	var selectValue = searchSelect.options[searchSelect.selectedIndex].value;  
}

// 달력기간 이벤트.
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

function getSearchTypeText() {
	
	var searchSelect = document.getElementById("SearchType");  
	  
	// select element에서 선택된 option의 value가 저장된다.  
	var selectText = searchSelect.options[searchSelect.selectedIndex].text;
	
	return selectText;
}

function onClickSearchBtn() {
	
	$('#loading').show();
	
	var condition = DoBuildCondition();
	
	$('#dayAnalysis').DataTable({
		dom : 'Bfrtip',
	    	"pageLength" : 15,
	    	"ordering"   : false,
	    	"autoWidth"  : false,
	    	"destroy"	 : true,
	    	"info"		 : false,
	    	"filter"	 : false,
    	ajax:{
        	url: APIRoot + '/selectPeriodAnalysis.do',
        	type:'post',
        	data : condition,
        	dataSrc :'rows'	//data 라는 이름으로 넘어와야 하는데 현재 구성상 rows 라는 이름으로 json데이터가 넘어오기 때문에 키 값을 변경한다.
        },
        columns:[
        	{data:"SaleDate"	, width:100},
        	{data:"CustomerAmt"	, width:100, render: $.fn.dataTable.render.number(',') },
        	{data:"SaleCnt"		, width:100, render: $.fn.dataTable.render.number(',')},
        	{data:"MarginPer"	, width:80},
        	{data:"ProfitAmt"	, width:100, render: $.fn.dataTable.render.number(',')},
        	{data:"SaleAmt"		, width:100, render: $.fn.dataTable.render.number(',')},
        	{data:"SalePrice"	, width:100, render: $.fn.dataTable.render.number(',')},
        	{data:"CashAmt"		, width:100, render: $.fn.dataTable.render.number(',')},
        	{data:"CardAmt"		, width:100, render: $.fn.dataTable.render.number(',')},
        	{data:"CashRcptAmt"	, width:100, render: $.fn.dataTable.render.number(',')},
        	{data:"PointAmt"	, width:100, render: $.fn.dataTable.render.number(',')},
        	{data:"DCAmt"		, width:100, render: $.fn.dataTable.render.number(',')},
        	{data:"ReturnAmt"	, width:100, render: $.fn.dataTable.render.number(',')},
        	{data:"CancelAmt"	, width:100, render: $.fn.dataTable.render.number(',')}
        ],
        buttons: [
        	 {
        		 	extend: 'excel',
        		 	text: '엑셀출력',
            	 		filename: getSearchTypeText()+'판매분석',
            	 		title: getSearchTypeText()+'판매분석'
        	 	}
        	 ]
    });
	
	$('.dt-buttons').css('display', 'none');
	
	$('#loading').hide();
}

function DoBuildCondition() {
    
    var condition = [];
    
    // (#22328) 알파캐셔 ASP - 모든 분석화면 > 날짜조건 고정
    gBeginDate = $('#BeginDate').val();
    gEndDate = $('#EndDate').val();
	
    var beginDate 	= $('#BeginDate').val();
    var endDate 	= $('#EndDate').val();
    var memberData	= $('#Member').val();
    var storeId 	= $("#StoreList option:selected").val();
    var periodType 	= $("#SearchType option:selected").val();
    var memberType	= $("#MemberType option:selected").val();
   
    if (memberData == '') 	{ memberData = 'NOT'; 	}
    
    if (periodType == 2) {
	
	beginDate = beginDate.substring(0,7);
	endDate = endDate.substring(0,7);
	
    }
    
    storeId = DoBuildStoreID(storeId);
    
    var Params = {
	    beginDate 	: beginDate,
	    endDate 	: endDate,
	    memberData 	: memberData,
	    storeId 	: storeId,
	    periodType  : periodType,
	    memberType	: memberType
    };
	
    return Params;
    
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

function onClickExcelBtn() {
	$('.buttons-html5').trigger("click");
}
