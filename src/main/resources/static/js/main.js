// Set new default font family and font color to mimic Bootstrap's default styling
Chart.defaults.global.defaultFontFamily = 'NotoSansKR-Light';
Chart.defaults.global.defaultFontColor = '#858796';

var test1 = "";
var test2 = "";

$(document).ready(function(){

    $('#sidebar').load("/sidebar.html");
    $('#toolbar').load("/toolbar.html");
   
    basicCheck();
    select2Setting()
    
});

function select2Setting() {
    
    $("#StoreList").select2({ width: '90%' });
    $("#StoreList1").select2({ width: '83%' });
    
    $("#StoreList2").select2({ width: '90%' });
    $("#StoreList3").select2({ width: '100%' });
    $("#FileNameCheckTIFF").select2({ width: '66%' });
    $("#FileNameCheckPDF").select2({ width: '66%' });
    $("#FileCheckTIFF").select2({ width: '69%' });
    $("#FileCheckPDF").select2({ width: '69%' });
    
    $("#StoreList4").select2({ width: '90%' });
    $("#StoreList5").select2({ width: '83%' });
    
    $("#StoreList6").select2({ width: '90%' });
    $("#StoreList7").select2({ width: '83%' });
    
    $("#StoreList8").select2({ width: '50%' });
    $("#StoreList9").select2({ width: '20%' });
}

function basicCheck() {
	
    test1 = $('#shopAnalysis').DataTable({
	dom : 'Bfrtip',
    	"pageLength" 	: 7,
    	"ordering"   	: false,
    	"autoWidth"  	: false,
    	"destroy"	: true,
    	"info"		: false,
    	"filter"	: false,
    	ajax:{
        	url: 'https://alphacashier.co.kr/KioskAPI/KioskV2/selectStoreAnalysis.do',
        	type:'post',
        	data : {
    			beginDate : '2022-06-01',
    			endDate : '2022-06-20',
    			storeId : '2100000000152',
    			condition : "NOT"
    		},
        	dataSrc :'rows'	// data 라는 이름으로 넘어와야 하는데
				// 현재 구성상 rows 라는 이름으로
				// json데이터가 넘어오기 때문에 키
				// 값을 변경한다.
        },
        columns:[
        	{data:"CompanyName"	, width:150},
        	{data:"CustomerAmt"	, width:100},
        	{data:"SaleCnt"		, width:100},
        	{data:"SaleAmt"		, width:150},
        	{data:"CashAmt"		, width:150},
        	{data:"CardAmt"		, width:150},
        	{data:"CashRcptAmt"	, width:150},
        	{data:"EtcSumAmt"	, width:150},
        	{data:"PointAmt"	, width:150}
        ],
        columnDefs: [
            { targets: 1, render: $.fn.dataTable.render.number(',') },
            { targets: 2, render: $.fn.dataTable.render.number(',') },
            { targets: 3, render: $.fn.dataTable.render.number(',') },
            { targets: 4, render: $.fn.dataTable.render.number(',') },
            { targets: 5, render: $.fn.dataTable.render.number(',') },
            { targets: 6, render: $.fn.dataTable.render.number(',') },
            { targets: 7, render: $.fn.dataTable.render.number(',') },
            { targets: 8, render: $.fn.dataTable.render.number(',') },
         ]
    }).ajax.reload();
    
    $('.dt-buttons').css('display', 'none');
}

function comparisonCheck() {
	
    $('#shopAnalysis1').DataTable({
	dom : 'Bfrtip',
    	"pageLength" 	: 7,
    	"ordering"   	: false,
    	"autoWidth"  	: false,
    	"destroy"	: true,
    	"info"		: false,
    	"filter"	: false,
    	ajax:{
        	url: 'https://alphacashier.co.kr/KioskAPI/KioskV2/selectStoreAnalysis.do',
        	type:'post',
        	data : {
    			beginDate : '2022-06-01',
    			endDate : '2022-06-20',
    			storeId : '2100000000152',
    			condition : "NOT"
    		},
        	dataSrc :'rows'	// data 라는 이름으로 넘어와야 하는데
				// 현재 구성상 rows 라는 이름으로
				// json데이터가 넘어오기 때문에 키
				// 값을 변경한다.
        },
        columns:[
        	{data:"CompanyName"	, width:150},
        	{data:"CustomerAmt"	, width:100},
        	{data:"SaleCnt"		, width:100},
        	{data:"SaleAmt"		, width:150},
        	{data:"CashAmt"		, width:150},
        	{data:"CardAmt"		, width:150},
        	{data:"CashRcptAmt"	, width:150},
        	{data:"EtcSumAmt"	, width:150},
        	{data:"PointAmt"	, width:150}
        ],
        columnDefs: [
            { targets: 1, render: $.fn.dataTable.render.number(',') },
            { targets: 2, render: $.fn.dataTable.render.number(',') },
            { targets: 3, render: $.fn.dataTable.render.number(',') },
            { targets: 4, render: $.fn.dataTable.render.number(',') },
            { targets: 5, render: $.fn.dataTable.render.number(',') },
            { targets: 6, render: $.fn.dataTable.render.number(',') },
            { targets: 7, render: $.fn.dataTable.render.number(',') },
            { targets: 8, render: $.fn.dataTable.render.number(',') },
         ]
    }).ajax.reload();
    
    $('.dt-buttons').css('display', 'none');
}

$('a[data-toggle="tab"]').on('hidden.bs.tab', function(e){
    var text = $(e.relatedTarget).text();
    
    if (text == "비교검사") {
	console.log(text)
	select2Setting();
	comparisonCheck();
    }
});
