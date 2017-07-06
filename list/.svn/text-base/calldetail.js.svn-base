mui.init({});

var orderNum, detailList_id, orderStatus, callStatus, dataDel, callPage,outsaveBtn,insaveBtn,codecount = [];
mui.plusReady(function() {
	var mtel_id = document.getElementById("mtel")
	var orderTopmsg = document.getElementById("orderTopmsg")
	var operation_id = document.getElementById("operation")
	detailList_id = document.getElementById("detailList")
	var detailBuymsg_id = document.getElementById("detailBuymsg")
	var detailfixBtn = document.getElementById("detailfixBtn")
	var id_CALLOUT = document.getElementById("id_CALLOUT")
	var id_CALLIN = document.getElementById("id_CALLIN")
	var orderstatus = document.getElementById("orderstatus")
	var storesList = JSON.parse(plus.storage.getItem("storesList"))
	dataDel = document.getElementById("dataDel")
	callPage = plus.webview.getWebviewById("callin.html");  
	outsaveBtn=document.getElementById("outsaveBtn")
	insaveBtn=document.getElementById("insaveBtn")
	window.addEventListener('detailShow', function(event) {
		orderNum = event.detail.orderNumber;
		callStatus = event.detail.callStatus;
		var param,api,sname,ncode;
		if(callStatus=="callout"){
			param = systemParam("V5.mobile.allocate.out.get");
		    param.allocateOutNo = orderNum;
		    api='allocateOutGet';
		    sname="调入门店：";
		    ncode='出库单号：'
		}
		else{
			param = systemParam("V5.mobile.allocate.in.get");
		    param.allocateInNo = orderNum;
		    api='allocateInGet';
		    sname="调出门店："
		    ncode='入库单号：'
		}
		plus.nativeUI.showWaiting();
		console.log(callStatus)
		dataSendFn(api, param, function(data) {
			plus.nativeUI.closeWaiting();
			data = data.order;
			var allocateOutNo = data.allocateOutNo||data.allocateInNo;
			var orderAllocateStatus = data.orderAllocateStatus;
			var inStore = data.inStore||data.outStore||"";
			var totalAmount = data.totalAmount;
			var productNum = data.productNum;
			var products = data.products;
			var phone;
			for (var i = 0; i < storesList.length; i++) {
				var storeName = storesList[i].storeName;
				if (storeName == inStore) {
					phone = storesList[i].phone||storesList[i].mobile;
				}
			}
			orderTopmsg.innerHTML = '<li class="mui-table-view-cell"><ul class="mui-table-view mui-grid-view mui-table-view-chevron"><li class="mui-table-view-cell mui-listdetail-num mui-col-xs-9"><span class="mui-listself-spanblack">' +ncode+allocateOutNo + '</span></li><li class="mui-table-view-cell mui-listdetail-km mui-col-xs-3"><div class="mui-pull-right ld-lianxi"><span class="mui-icon iconfont icon-dianhuahaoma1"></span><a class="lianxi-padding2 mui-tel-link" id="ntel" href="tel:' + phone + '">联系门店</a></div></li><li class="mui-table-view-cell mui-listdetail-num mui-col-xs-8"><span class="ld-p mui-col-xs-10">' +sname +inStore + '</span></li></ul></li>';
			var plist = '';
			for (var i = 0; i < products.length; i++) {
				var productNumber = products[i].productNumber;
				var productName = products[i].productName;
				var productPic = products[i].productPic || "../images/cbd.jpg";
				var skuNumber = products[i].skuNumber;
				var skuName = products[i].skuName;
				var barcode = products[i].barcode;
				var count = products[i].count;
				codecount.push({
					barcode: barcode,
					stock: count
				})
				plist += '<li class="mui-table-view-cell mui-media"><a class="m-fix-box"><img class="mui-media-object m"  src="' + productPic + '"><div class="mui-media-body m-fix-m"><p class="mui-ellipsis">'+productName+'</p><p class="mui-ellipsis">商品编码：' + skuNumber + '</p><p class="mui-ellipsis">' + skuName + '</p></div><div class="m-fix-r">*' + count + '</div></a></li>';
			}
			plist += '<li class="mui-table-view-cell"><div><span>共' + productNum + '件商品</span></div></li>';
			detailList_id.innerHTML = plist;
			orderstatus.innerHTML = orderAllocateStatus == 2 ? "已审核" : "未审核"
			document.body.style.paddingBottom = "42px";
			id_CALLOUT.style.display = "none";
			id_CALLIN.style.display = "none";
			console.log(callStatus)
			switch (callStatus) {
				case "callout":
					id_CALLOUT.style.display = "block";
					break;
				case "callin":
					id_CALLIN.style.display = "block";
					break;
				default:
					break; 
			}

		}, "get")


	})
	dataDel.addEventListener("tap", function() { //删除列表
		console.log("删除订单")
		var param = systemParam("V5.mobile.allocate.out.cancel")
		param.outNo = orderNum;
		dataSendFn("allocateOutCancel", param, function(data) {
			if (!data.isSuccess) {
				var mapmsg = data.map.errorMsg;
				if (mapmsg == "已审核的调拨出库单不允许取消") {
					plus.nativeUI.alert(mapmsg, function() {}, "", "OK");
				}
				return
			}
			console.log(callPage)
			callPage.evalJS("detailBack('" + orderNum + "')")
			mui.back()
			console.log(data)
		}, "get")
	});
	outsaveBtn.addEventListener("tap", function() { //调出保存数据
		var param = systemParam('V5.mobile.allocate.out.confirm');
		var products = {};
		products.products = codecount
		console.log(products)
		param.outNo = orderNum;
		param.applyData = JSON.stringify(products);
		param.uniqueCode = uniqueCode();
		console.log(param)
		plus.nativeUI.showWaiting();
		dataSendFn('allocateOutConfirm', param, function(data) {
			plus.nativeUI.closeWaiting();
            if (!data.isSuccess) {
				var mapmsg = data.map.errorMsg;
				console.log(mapmsg)
				plus.nativeUI.alert(mapmsg, function() {}, "", "OK");
				return
			}
			callPage.evalJS("detailBack('" + orderNum + "')")
			mui.back()
			console.log(data.isSuccess)
		}, "get")
	});
	insaveBtn.addEventListener("tap", function() { //调入保存数据
		var codecount;
		var param = systemParam('V5.mobile.allocate.in.confirm');
		var products = {};
		products.products = codecount
		param.inNo = orderNum;
		param.applyData = JSON.stringify(products);
		param.uniqueCode = uniqueCode();
		console.log(param)
		plus.nativeUI.showWaiting();
		dataSendFn('allocateInConfirm', param, function(data) {
			plus.nativeUI.closeWaiting();
			if (!data.isSuccess) {
				var mapmsg = data.map.errorMsg;
				plus.nativeUI.alert(mapmsg, function() {}, "", "OK");
				console.log(mapmsg)
				return
			}
			callPage.evalJS("detailBack('" + orderNum + "',1)")
			mui.back()
			console.log(data.isSuccess)
		}, "get")
	});
});