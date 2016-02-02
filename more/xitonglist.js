var showlist,p;
mui.init({
	pullRefresh: {
		container: '#tochange2',
		up: {
			contentdown: '上拉加载更多',
			contentrefresh: '正在刷新中...',
			callback: pullupRefresh
		}
	}  

});  
mui.plusReady(function() {
	showlist = document.getElementById("showlist");
	getThisDate();
});
 var itemid=null;
function getThisDate() {
    var param = systemParam("V5.mobile.message.search");
    console.log(itemid)
  	param.messageId=itemid||""; 
	param.pageSize=15; 
	param.optype="up";  
	dataSendFn('messageSearch', param, function(data) { 
		    if(!itemid){
		    showlist.innerHTML=""	 
		    }
			var totalCount = data.totalCount;
			var messages = data.messages;
			itemid = messages[messages.length - 1].messageId
			for (var i = 0; i < messages.length; i++) {
				var messageId = messages[i].messageId;
				var messageType = messages[i].messageType;
				var messageInfo = messages[i].messageInfo;
				var orderNumber = messages[i].orderNumber;
//				<span class="mui-badge bardgechange">N</span>角标暂时删除需要时再拼入
				var html = '<a href="javascript:void(0);"><div class="mui-media-body xx-fontcolor">';
				html+='<span>'+messageType+'</span>';
				html+='<p class="mui-ellipsis">'+messageInfo+'</p></div></a>';
				var li = document.createElement("li");
				li.className = "mui-table-view-cell mui-media";
				li.innerHTML = html;
				showlist.appendChild(li);
			}
		
	}, "get")
}

var count = 0;
/**
 * 上拉加载具体业务实现
 */  
function pullupRefresh() {
	setTimeout(function() {
		console.log(1)
		mui('#tochange2').pullRefresh().endPullupToRefresh(false); //参数为true代表没有更多数据了。	 
		getThisDate();
	    count++;
    }, 500);
}
