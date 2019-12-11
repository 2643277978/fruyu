$(function(){
	   var username=$("#username").val();
	   var casRemoteLoginUrl = $("#companyCasDomain").val()+"/remoteLogin";
	   var limitUrl = $("#companyShopDomain").val()+"/design/login";
	   var siteId =$("#lcsiteId").val();
	   var showId = "loadHtml";
    $("#company_collect_shop").click(function(){  
 	    if(username==""){//未登录
			 initLoginDiv(casRemoteLoginUrl,limitUrl,siteId,showId);
 	    }else{//已登录
 	    	var memberId=$("#companyMemberId").val();
 	   	$.ajax({
 			type : "post",
 			cache:false,
 			data:{shopId:memberId},
 			url :"/aaacollect/save",
 			success : function(data) {
 	    		var value = "";
 	    		if(data=="mark"){
	 	   		    value = '<div>您不能收藏自己的店铺</div>';
	 	   		    } else if(data=="success"){
	 	   		    value = '<div class="collectOk2"></div>店铺收藏成功'
		 	   		} else{
		 	   		 value = '<div>您已收藏过此店铺</div>'
	 	 	   	    }
 	   		art.dialog({
 	   		    time: 3,
 	   		    title:false,
 	   		    width:200,
 	   		    height:70,
 	   		    lock:true,
 	   		    content:value
 	   		});
 			}
 		});
 	    }
	}); 
})