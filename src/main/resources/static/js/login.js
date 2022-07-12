$(document).ready(function(){
    $('#UserID').focus();
});

$("#loginBtn").on("click", function(){
	loginCheck();
});

$("#UserID").on("keyup",function(key){
    
    if(key.keyCode==13) {
        if ($('#UserID').val() == "") {
            alert("아이디를 입력하세요.");
            $('#UserID').focus();
        } else if ($('#PassWord').val() == "") {
            alert("비밀번호를 입력하세요.");
            $('#PassWord').focus();
        } else {
            loginCheck();
        }
    }
});

$("#PassWord").on("keyup",function(key){
    
    if(key.keyCode==13) {
        if ($('#UserID').val() == "") {
            alert("아이디를 입력하세요.");
            $('#UserID').focus();
        } else if ($('#PassWord').val() == "") {
            alert("비밀번호를 입력하세요.");
            $('#PassWord').focus();
        } else {
            loginCheck();
        }
    }
});

function loginCheck(){
	
    var UserID = document.getElementById("UserID").value;
    var Password = document.getElementById("PassWord").value;
	
    console.log(ASPRoot)
    
    $.ajax({
        url  	 : ASPRoot + "/login/doLogin.do",
        dataType : 'json', 
        method   : 'post',
        data : {
            UserID 	: UserID, 
            PassWord 	: Password
        }, 
        success : function(result){
        	
            if (result.status == 'success') {
            	
            	doBuildLocalStorage(result); 
            	
            	if (localStorage.getItem("StatusCD") == 'N') {
            	    $(location).attr('href', ASPRoot + '/agentMain.html');
            	} else if (localStorage.getItem("StatusCD") == 'C') {
            	    $(location).attr('href', ASPRoot + '/franchiseMain.html');
            	} else {
            	    $(location).attr('href', ASPRoot + '/main.html');
            	}
            }

        },error : function(request , status , error){
        	
            alert("code:" + request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
            
        }
    });
};

function doBuildLocalStorage(result) {
	
    console.log(result);
    
	/*
	 * strStatusCD = N (넥스니즈 직원)
	 * strStatusCD = S (체인점에 등록되지 않은 단일매장)
	 * strStatusCD = G (체인점에 등록된 매장)
	 * strStatusCD = C (체인점 관리자)
	 * strStatusCD = E (해당없음)
	 * */
	
    // 로그인 한 정보로 세팅하기 전에 한번 클린.
    localStorage.clear();
	
    localStorage.setItem("UserID", result.UserID);
    localStorage.setItem("StatusCD", result.StatusCD);
    localStorage.setItem("Device", result.Device);
    localStorage.setItem("PartnerID", result.PartnerID);
    localStorage.setItem("StoreID", result.StoreID);
    localStorage.setItem("FranchiseID", result.FranchiseID);
    localStorage.setItem("Name", result.Name);
    localStorage.setItem("StoreName", result.StoreName);
}
