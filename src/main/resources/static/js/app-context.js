var domainName = window.location.hostname ;

/*var contextRoot = "http://alphacashier.co.kr";*/
/*var contextRoot = "http://localhost:8080";
var kioskAPIRoot = "http://ec2-54-180-120-5.ap-northeast-2.compute.amazonaws.com:9090/KioskAPI/Kiosk";*/

/* (#16684) KIOSK ASP 에서 배포 환경 별 세팅을 다르게 할 수 있도록 반영 */
var ASPRoot;
var APIRoot;

var gBeginDate = "";
var gEndDate = "";

$(document).ready(function() {
	
    var getUrl = window.location;
    var baseUrl = getUrl.origin;
    
    $.ajax({
        url  : baseUrl + "/login/getPropertiesValue.do",
        dataType : "json" , 
        data : {
            tmp : "", 
        },
        async: false,
        method   : "post" , 
        success : function(result){
        	
            console.log("Properties ASP 결과 :: " + result.ASPServer);
            console.log("Properties API 결과 :: " + result.APIServer);
            
            ASPRoot = result.ASPServer;
            APIRoot = result.APIServer;
            
            console.log("현재 ASP 결과 :: " + ASPRoot);
            console.log("현재 API 결과 :: " + APIRoot);
        }
    });
});