$(document).ready(function(){
	doBuildLoginInfo();
});

function doBuildLoginInfo() {
	
	document.getElementById("StoreName").innerHTML = localStorage.getItem("StoreName");
	document.getElementById("UserName").innerHTML = localStorage.getItem("Name");
}

/******* 브라우저 종료시 로그아웃 처리 Start *******/
var toDoWhenClosing = function() { 
	
	$.ajax({
		url      : "http://localhost:8080/login/doLogout.do",
		dataType : 'json',
		method : 'post',
		async: false,
		success : function(data) {
			
			console.log("!!");
			localStorage.clear(); // 전체 삭제
			
			$(location).attr('href','http://localhost:8080/index.html');
			
		},
		error : function(request, status, error) {
			console.log("code:" + request.status + "\n" + "message:"
					+ request.responseText + "\n" + "error:" + error);
		}
	});
	return; 
};

window.addEventListener("beforeunload", function (e) { 
	if (closing_window) { 
		toDoWhenClosing(); 
	} 
})
/******* 브라우저 종료시 로그아웃 처리 End *******/

function doLogout() {
	
    	console.log("!!!!")
    
	toDoWhenClosing();
}

function menuReload(val) {
    
    console.log(val)
    
    $('#page-top').load("/"+val");
    
    /*$.ajax({

	type: 'POST',
	url: val,
	async:false,
	data: "",
	contentType:"application/x-www-form-urlencoded; charset=UTF-8",
	success: function(data) {
	    $('#page-top').html(val);
	    if(isMenuHide) menuOff();
	},
	error: function(request, status, error) {
	    alert(error);
	}
    });*/
}