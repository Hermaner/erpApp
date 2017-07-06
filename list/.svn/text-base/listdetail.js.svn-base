mui.init({
	swipeBack: true,
	gestureConfig: {
		longtap: true

	}
});
var listhade, itemName, codeName, listself, phoneheight;
var Destination, orderNum, detailList_id, totalPrices, addnewitem, orderStatus, sinceTime, sinceorderCode, sinceInput, getorderCode, getInput, sendCodeUl, detailBuymsg_id, buyer_id, detailfixBtn, id_UN_ACCPET, id_ACCPET, id_SINCE, IN_STORE, id_WAIT_GOOD, mtel_id, curwebview, backstatus, sinceedit = 0,
	bournObj = {},
	printAr, printShop, printOrderNum, printConsignee, printTel, printAddress, printYprice, mac, outputStream, mygetno, mysinceno, printpostFee, canprint = 1;
mui.plusReady(function() {
	phoneheight = plus.screen.resolutionHeight; //mui获取设备高度分辨率
	listhade = document.getElementById("listhade");
	itemName = document.getElementById("itemName");
	codeName = document.getElementById("codeName");
	listself = document.getElementById("listself");

	mtel_id = document.getElementById("mtel")
	orderTopmsg = document.getElementById("orderTopmsg")
	sinceorderCode = document.getElementById("sinceorderCode") //自提ID
	sinceInput = sinceorderCode.getElementsByTagName("input")[0]
	getorderCode = document.getElementById("getorderCode") //收货ID
	getInput = getorderCode.getElementsByTagName("input")[0]
	sendCodeUl = document.getElementById("sendCodeUl")
	detailList_id = document.getElementById("detailList")
	detailBuymsg_id = document.getElementById("detailBuymsg")
	buyer_id = document.getElementById("buyer") //买家留言
	detailfixBtn = document.getElementById("detailfixBtn")
	id_UN_ACCPET = document.getElementById("id_UN_ACCPET")
	id_ACCPET = document.getElementById("id_ACCPET")
	id_SINCE = document.getElementById("id_SINCE")
	id_WAIT_GOOD = document.getElementById("id_WAIT_GOOD")
	IN_STORE = document.getElementById("IN_STORE")
	curwebview = plus.webview.currentWebview()
	addnewitem = plus.webview.getWebviewById('addnewitem.html'); //选择商品页面ID
	var mapPage = plus.webview.getWebviewById('map/maps_map.html'); //地图页面ID
	mac = plus.storage.getItem("printMac") || "";



	window.addEventListener('detailShow', function(event) {
		orderNum = event.detail.orderNumber;
		printOrderNum = "订单号：" + orderNum;
		backstatus = event.detail.backstatus;
		bournObj.orderNumber = orderNum;
		Destination = event.detail.address || "";
		printAr = []
		var param = systemParam("V5.mobile.order.info.get");
		param.orderNumber = orderNum;
		plus.nativeUI.showWaiting();
		getInput.value = ""
		sinceInput.value = ""

		dataSendFn('orderInfoGet', param, function(data) {
			loadData(data)
			console.log(JSON.stringify(data))
		}, "get")

	})
	mui("#detailfixBtn").on("tap", ".mui-btnz-tack", function() { //接单接口操作
		console.log("接单")
		var param = systemParam("V5.mobile.order.operation");
		param.orderNumber = orderNum;
		param.operation = "ACCEPET";
		param.operationReason = "";
		plus.nativeUI.showWaiting();
		dataSendFn('orderOperation', param, function(data) {
			plus.nativeUI.closeWaiting();
			if (!data.isSuccess) {
				var mapmsg = data.map.errorMsg;
				plus.nativeUI.alert(mapmsg, function() {}, "", "OK");
				console.log(mapmsg)
				return
			}
			plus.nativeUI.alert("接单成功", function() {
				var page = plus.webview.getWebviewById("list/dingdan.html");
				console.log(orderStatus)

				page.evalJS("getThisDate('" + orderStatus + "','',1)")
				mui.back();
			}, "", "OK");
		}, "get")



	})
	mui("#id_UN_ACCPET").on("tap", ".mui-btnz-map", function() { //点对点地图
		console.log("点对点地图")
			//触发地图页面的mapShow事件

		mui.fire(mapPage, 'detailMap', {
			bournObj: bournObj,
			Destination: Destination,
			orderStatus: orderStatus
		});
		setTimeout(function() {
			mui.openWindow({
				id: "map/maps_map.html",
				show: {
					aniShow: "pop-in"
				},
				waiting: {
					autoShow: true
				}
			})

		}, 0)
	})
	mui("#detailfixBtn").on("tap", ".mui-btnz-send", function() { //发货接口操作
		console.log("发货接口");
		var param = systemParam("V5.mobile.order.outsend");
		param.orderNumber = orderNum;
		param.operation = 'STORE_DELIVERY';
		plus.nativeUI.showWaiting();
		console.log(param)
		dataSendFn('orderOutsend', param, function(data) {
			plus.nativeUI.closeWaiting();
			if (!data.isSuccess) {
				var mapmsg = data.map.errorMsg;
				plus.nativeUI.alert(mapmsg, function() {}, "", "OK");
				console.log(mapmsg)
				return
			}
			plus.nativeUI.alert("发货成功", function() {
				var page = plus.webview.getWebviewById("list/dingdan.html");
				page.evalJS("getThisDate('" + backstatus + "','',1)")
				mui.back();
			}, "", "OK");
		}, "get")
	})
	mui("#sendCodeUl").on("tap", ".mui-btnz-sendcode", function() { //发送验证码
		console.log("发送验证码");
		var sec = 60;
		var that = this;
		var type;
		this.setAttribute("disabled", "disabled");
		var param = systemParam("V5.mobile.order.code.send");
		var pid = this.getAttribute("pid")
		if (pid) {
			type = 'ZT'
		} else {
			type = 'FH'
		}
		param.orderNumber = orderNum;
		param.type = type;
		console.log(param)
		dataSendFn('orderCodeSend', param, function(data) {
			if (!data.isSuccess) {
				var mapmsg = data.map.errorMsg;
				plus.nativeUI.alert(mapmsg, function() {}, "", "OK");
				console.log(mapmsg)
				return
			}

			if (pid) {
				mysinceno = data.code;
			} else {
				mygetno = data.code;
			}
			console.log(data.code)
			plus.nativeUI.alert("发送成功", function() {
				//				sinceInput.removeAttribute("disabled")
				var t = setInterval(function() {
					if (sec <= 0) {
						that.innerHTML = "再次发送";
						that.removeAttribute("disabled");
						clearInterval(t)
						sec = 60
					} else {
						that.innerHTML = sec + "秒后可重新发送";
						sec--;
					}

				}, 1000)
			}, "", "OK");
		}, "get")
	})
	mui("#getorderCode").on("tap", ".dd-changebtn", function() { //收货码确认接口
		console.log("收货码确认接口")
		var codeValue = document.getElementById("getorderCode").getElementsByTagName("input")[0].value;
		if (!codeValue) {
			plus.nativeUI.alert("请输入收货码", function() {}, "", "OK");
			return;
		}
		if (codeValue != mygetno) {
			plus.nativeUI.alert("请输入正确收货码", function() {}, "", "OK");
			return;
		}
		var param = systemParam("V5.mobile.order.comfirm");
		param.orderNumber = orderNum;
		param.operation = "STORE_DELIVERY";
		param.storeNo = codeValue;
		dataSendFn('orderComfirm', param, function(data) {
			if (!data.isSuccess) {
				var mapmsg = data.map.errorMsg;
				plus.nativeUI.alert(mapmsg, function() {}, "", "OK");
				console.log(mapmsg)
				return
			}
			sinceInput.value = ""
			getInput.value = ""
			mygetno = ""
				//			sinceInput.setAttribute("disabled", "disabled")
				//			getInput.setAttribute("disabled", "disabled")
			plus.nativeUI.alert("确认收货成功！", function() {
				var page = plus.webview.getWebviewById("list/dingdan.html");
				page.evalJS("getThisDate('" + orderStatus + "','',1)")
				mui.back();
			}, "", "OK");
		}, "get")

	})
	mui("#sinceorderCode").on("tap", ".dd-changebtn", function() { //提货码确认接口
		console.log("提货码确认接口")
		var codeValue = document.getElementById("sinceorderCode").getElementsByTagName("input")[0].value;
		if (!codeValue) {
			plus.nativeUI.alert("请输入提货码", function() {}, "", "OK");
			return;
		}
		if (codeValue != mysinceno) {
			plus.nativeUI.alert("请输入正确提货码", function() {}, "", "OK");
			return;
		}
		var param = systemParam("V5.mobile.order.outsend");
		param.orderNumber = orderNum;
		param.operation = 'SINCE';
		param.code = codeValue;
		console.log(param)
		dataSendFn('orderOutsend', param, function(data) {
			if (!data.isSuccess) {
				var mapmsg = data.map.errorMsg;
				plus.nativeUI.alert(mapmsg, function() {}, "", "OK");
				console.log(mapmsg)
				return
			}
			sinceInput.value = ""
			getInput.value = ""
			mysinceno = ""
				//			sinceInput.setAttribute("disabled", "disabled")
				//			getInput.setAttribute("disabled", "disabled")
			plus.nativeUI.alert("自提成功", function() {
				var page = plus.webview.getWebviewById("list/dingdan.html");
				page.evalJS("getThisDate('" + orderStatus + "','',1)")
				mui.back();
			}, "", "OK");
		}, "get")
	})
	mui("#detailfixBtn").on("tap", ".sinceChange", function() { //自提订单修改订单
		console.log("自提订单修改订单")
		var changelist = '<ul class="mui-table-view mui-input-group cl-formtop">';
		changelist += '<li class="mui-table-view-cell"><div class="mui-input-row"><label>自提时间</label>';
		changelist += '<input type="date" class="addborder" value="' + sinceTime + '" placeholder="普通输入框"><span class="mui-icon iconfont icon-rili cl-rili"></span>';
		changelist += '</div></li><li class="mui-table-view-cell"><div class="mui-input-row"><label>自提门店</label>';
		changelist += '<input type="text" class="addborder" value="' + plus.storage.getItem("orgCode") + '" id="showUserPicker1" readonly="readonly">';
		changelist += '<span id="showUserPicker2" class="mui-icon mui-icon-arrowdown cl-xiala"></span></div></li>';
		changelist += '<li class="mui-table-view-cell"><div class="mui-input-row mui-radio"><label class="cl-labelwidth2" style="padding-right: 0px;">改由线上发货</label><input class="addradio" style="top:0px" name="radio1" type="radio" value="LOGISTIC">';
		changelist += '</div></li><li class="mui-table-view-cell"><div class="mui-input-row mui-radio"><label class="cl-labelwidth" style="padding-right: 0px;">改由门店送货（包邮）</label><input class="addradio" style="top:0px" name="radio1" type="radio" value="STORE_DELIVERY">';
		changelist += '</div></li><li class="mui-table-view-cell" onclick="coorDinate()"><div class="mui-input-row"><label class="cl-labelwidth">申请协调</label>';
		changelist += '</div></li></ul>';
		layer.open({
			title: ['修改订单', 'text-align:center'],
			content: changelist,
			btn: ['确认', '取消'],
			shadeClose: false,
			style: 'width:260px',
			yes: function() {
				console.log("配送方式修改")
				var layUl = document.getElementsByClassName("cl-formtop")[0];
				var layUlv0 = layUl.getElementsByTagName("input")[0].value
				var layUlv1 = layUl.getElementsByTagName("input")[1].value
				var layUlv2 = layUl.getElementsByTagName("input")[2]
				var layUlv3 = layUl.getElementsByTagName("input")[3]
				var delivery = layUlv2.checked ? layUlv2.value : layUlv3.checked ? layUlv3.value : "";
				if (!layUlv0) {
					plus.nativeUI.alert("请选择日期！", function() {}, "", "OK");
					return
				}
				if (!delivery) {
					plus.nativeUI.alert("请选择配送方式！", function() {}, "", "OK");
					return
				}
				var param = systemParam("V5.mobile.order.shipping.update");
				param.orderNumber = orderNum;
				param.operation = delivery;
				dataSendFn('orderShippingUpdate', param, function(data) {
					if (!data.isSuccess) {
						var mapmsg = data.map.errorMsg;
						console.log(mapmsg)
						return
					}
					plus.nativeUI.alert("修改成功！", function() {
						var page = plus.webview.getWebviewById("list/dingdan.html");
						page.evalJS("getThisDate('" + orderStatus + "',0,1)")
						layer.closeAll();
						setTimeout(function() {
							mui.back();
						}, 0)

					}, "", "OK");
				}, "get")

			}
		});
		var stores = JSON.parse(plus.storage.getItem("storesList"));
		var storesAr = [];
		for (var i = 0; i < stores.length; i++) {
			var sobj = {
				value: stores[i].storeCode,
				text: stores[i].storeName
			}
			storesAr.push(sobj)
		}
		//				storesAr=JSON.stringify(storesAr)
		var userPicker = new mui.PopPicker();
		console.log(storesAr)
		userPicker.setData(storesAr);
		var showUserPickerButton = document.getElementById('showUserPicker1');
		showUserPickerButton.addEventListener('tap', function(event) {
			userPicker.show(function(items) {
				showUserPickerButton.value = items[0].text;
			});
		}, false);


	})
	mui("#detailfixBtn").on("tap", ".sinceCoordinate", function() { //自提订单申请协调
		coorDinate()
	})

	mui("#id_UN_ACCPET").on("tap", ".mui-btnz-kick", function() { //踢回订单接口操作
		console.log("踢回订单")
		var param = systemParam("V5.mobile.order.kickbackreason.search");
		dataSendFn('orderKickbackreasonSearch', param, function(data) { //踢回订单原因接口 
			if (!data.isSuccess) {
				var mapmsg = data.map.errorMsg;
				plus.nativeUI.alert(mapmsg, function() {}, "", "OK");
				console.log(mapmsg)
				return
			}
			var reasons = data.reasons;
			var html = "";
			for (var i = 0; i < reasons.length; i++) {
				var reasonId = reasons[i].reasonId;
				var reasonInfo = reasons[i].reasonInfo;
				html += "<div class='mui-input-row mui-radio mui-left'><label>" + reasonInfo + "</label><input name='radio' rid=" + reasonId + " rinfo=" + reasonInfo + " type='radio'></div>";
			}
			layer.open({
				title: ['踢回原因选择', 'text-align:center'],
				content: html,
				btn: ['确认', '取消'],
				shadeClose: false,
				style: 'width:260px;',
				yes: function() {
					var layermbox0 = document.getElementsByClassName("layermmain")[0];
					var resonList = layermbox0.getElementsByTagName("input");
					var rid;
					for (var i = 0; i < resonList.length; i++) {
						if (resonList[i].checked == true) {
							rid = resonList[i].getAttribute("rid");
							var kparam = systemParam("V5.mobile.order.operation");
							kparam.orderNumber = orderNum;
							kparam.operation = "KICK_BACK";
							kparam.operationReason = rid;
							dataSendFn('orderOperation', kparam, function(data) {
								if (!data.isSuccess) {
									var mapmsg = data.map.errorMsg;
									plus.nativeUI.alert(mapmsg, function() {}, "", "OK");
									console.log(mapmsg)
									return
								}
								plus.nativeUI.alert("成功踢回订单", function() {
									var page = plus.webview.getWebviewById("list/dingdan.html");
									page.evalJS("getThisDate('" + orderStatus + "',0,1)")
									layer.closeAll();
									setTimeout(function() {
										mui.back();
									}, 0)
								}, "", "OK");

							}, "get")
							return;
						}
					}


				}
			});
		}, "get")

	})

	mui(".myfixBtn").on("click", ".mui-btnz-print", function() { //打印订单操作

		printAr = []
		printAr.push(printShop)
		printAr.push(printOrderNum)
		printAr.push(printConsignee)
		printAr.push(printTel)
		printAr.push(printAddress)
		var printList = document.getElementsByClassName("mui-detail-list");
		var totalCount = 0;
		var totalPrice = document.getElementById("total-prices").innerText;
		for (var i = 0; i < printList.length; i++) {
			var mid = printList[i].getElementsByClassName("mui-table-cell");
			var name = mid[1].getElementsByTagName("span")[0].innerText;
			var sku = mid[1].getElementsByTagName("span")[1].innerText;

			var unitprice = mid[2].getElementsByTagName("span")[0].innerText;
			unitprice = parseFloat(unitprice)
			var count = mid[2].getElementsByTagName("span")[2].innerText.substring(1);
			count = parseInt(count)
			printAr.push(name)
			printAr.push(("数量:" + count + "；单价:" + unitprice).replace(/\s+/g, ""))
			printAr.push(sku.replace(/\s+/g, ""));
			totalCount += count
		}
		printAr.push("共计" + totalCount + "件；运费" + printpostFee + "元");
		printAr.push(("应付" + totalPrice + "元").replace(/\s+/g, ""));
		console.log(printAr)
		printObj(printAr)



	})
	var old_back = mui.back;
	mui.back = function() {
		var ofb = detailfixBtn.getElementsByClassName('ld-footbtn');
		for (var o = 0; o < ofb.length; o++) {
			ofb[o].style.display = "none"
		}
		document.getElementsByClassName("mui-content")[0].style.display = "none";
		listhade.style.display = "none";
		listself.style.overflow = "auto";
		listself.style.height = "auto";
		document.getElementById("closeHade").style.display = "none";
		listhade.innerHTML = "";
		old_back();
	}

});


function loadData(data, c) {
	if (c) {
		data = JSON.parse(data);
	}

	data = data.order;
	console.log(data)
	var orderDate = data.orderDate;
	var shopName = data.shopName;
	printShop = "店铺名称：" + shopName
	orderStatus = data.orderStatus;
	orderStatus == "未接订单" ? orderStatus = "UN_ACCPET" : "";
	orderStatus == "全部订单" ? orderStatus = "" : "";
	orderStatus == "已接订单" ? orderStatus = "ACCPET" : "";
	orderStatus == "待收货订单" ? orderStatus = "WAIT_GOOD" : "";
	orderStatus == "自提订单" ? orderStatus = "SINCE" : ""
	orderStatus == "已完结订单" ? orderStatus = "END_ORDER" : "";
	var orderPayStatus = data.orderPayStatus;

	var totalAmount = data.totalAmount;
	var initialTotalAmount = data.initialTotalAmount;
	var postFee = data.postFee;
	printpostFee = postFee;
	var platId = data.platId;
	var platName = data.platName;
	mygetno = data.sendCode
	orderNum = data.orderNumber;
	var productNum = data.productNum;
	var sellerPhone = data.sellerPhone;
	var buyerMessage = data.buyerMessage || "无"; //买家留言
	var distance = data.distance.substr(0, 6);
	var distanceHtml;

	if (orderPayStatus == "打印快递单") {
		distanceHtml = '<span class="mui-icon iconfont dd-fontcolor"></span><span id="orderPayStatus">' + orderPayStatus + '</span>';
	} else if (orderPayStatus == "途中订单") {
		orderStatus = "WAIT_GOOD";
		distanceHtml = '<span class="mui-icon iconfont dd-fontcolor"></span><span id="orderPayStatus">' + orderPayStatus + '</span>';
	} else if (platName == "门店订单") {
		orderStatus = "IN_STORE";
		distanceHtml = '<span class="mui-icon iconfont dd-fontcolor"></span><span id="orderPayStatus">' + orderPayStatus + '</span>';
	} else {
		distanceHtml = distance ? '<span class="mui-icon iconfont icon-ditu1 dd-fontcolor" ></span><span>约' + distance + 'km</span>' : '';

	}
	bournObj.distance = distance ? '约' + parseFloat(distance) / 1000 + 'km' : "";

	var logisticInfo = data.logisticInfo;
	console.log(JSON.stringify(logisticInfo))
	var consignee = logisticInfo.consignee;
	var mobile = logisticInfo.mobile;
	var phone = logisticInfo.phone;
	var getTel = phone || mobile
	var province = logisticInfo.province;
	var city = logisticInfo.city;
	var cityArea = logisticInfo.cityArea;
	var address = logisticInfo.address;
	var operation = logisticInfo.operation;
	operation_o = operation;
	sinceTime = logisticInfo.sinceTime;
	var logisticsCode = logisticInfo.logisticsCode;
	logisticsCode_o = operation;
	var outsid = logisticInfo.outsid;
	outsid_o = operation;
	var products = data.products;
	printConsignee = "收货人：" + consignee;
	printTel = "收货人电话：" + getTel;
	printAddress = "收货地址：" + address;
	printYprice = "已付：" + initialTotalAmount;

	orderTopmsg.innerHTML = '<li class="mui-table-view-cell"><ul class="mui-table-view mui-grid-view"><li class="mui-table-view-cell mui-listdetail-num mui-col-xs-8"><span class="mui-listself-spanblack mui-flex-block">订单号：<span class="longtab">' + orderNum + '</span></span></li><li class="mui-table-view-cell mui-listdetail-km mui-col-xs-4">' + distanceHtml + '</li><li class="mui-table-view-cell mui-listdetail-num mui-col-xs-7"><span class="mui-listself-spanblack">' + orderDate + '</span></li><li class="mui-table-view-cell mui-listdetail-num mui-col-xs-8"><img class="ld-ticon" src="../images/icontu/' + platId + '.jpg"  /><span class="ld-p mui-col-xs-10">' + shopName + '</span></li><li class="mui-table-view-cell mui-listdetail-km mui-col-xs-4" id="ntelLi"><div class="mui-pull-right ld-lianxi-hui"><span class="mui-icon iconfont icon-dianhuahaoma1"></span><a class="lianxi-padding2 mui-tel-link" id="ntel" href="tel:' + sellerPhone + '">联系网店</a></div></li></ul></li>';
	if (platName == "门店订单") {
		document.getElementById("ntelLi").style.display = "none";
		document.getElementById("mtel_div").style.display = "none";
	} else {
		document.getElementById("ntelLi").style.display = "";
		document.getElementById("mtel_div").style.display = "";
	}
	var plist = '';
	for (var i = 0; i < products.length; i++) {
		var productNumber = products[i].productNumber;
		var productName = products[i].productName;
		var productPic = products[i].productPic || "../images/cbd.jpg";
		var skuNumber = products[i].skuNumber;
		var skuName = products[i].skuName;
		var barcode = products[i].barcode;
		var price = products[i].price;
		var count = products[i].count;
		var memo = products[i].memo || "无";


		if (orderStatus == "SINCE") {
			plist += '<li class="mui-table-view-cell mui-detail-list"  rid="' + orderNum + '" bid="' + barcode + '"><div class="mui-slider-right mui-disabled btnsize"><a class="mui-btn btnsize mui-listself-pad" href="javascript:void(0);" onclick="delShop(this)"><div><span class="mui-icon iconfont icon-guanbi1 changeicon mui-listself-fontsize"></span> 删除</div></a><a class="mui-btn btnsize mui-listself-pad" href="javascript:void(0);" onclick="replaceShop(this)"><div><span class="mui-icon iconfont icon-xiugai changeicon mui-listself-fontsize"></span> 替换</div></a></div><div class="maxwidth mui-slider-handle"><div class="mui-table-cell mui-col-xs-2 "><img class="ld-itempic" src="' + productPic + '" /></div><div class="mui-table-cell mui-col-xs-6"><span class="spanheight getitemName">' + productName + '</span><span class="spanheight getcodeName">' + skuName + '</span></div><div class="mui-table-cell mui-col-xs-2 cellpad" ><span class="spanheight">' + price + '</span><span class="spanheight">&nbsp;</span><span class="getCount" >*' + count + '</span><div class="mui-numbox nl-num" data-numbox-min="0" style="display:none"><button class="mui-btn mui-numbox-btn-minus" type="button">-</button><input class="mui-numbox-input" type="number" value="' + count + '" /><button class="mui-btn mui-numbox-btn-plus" type="button">+</button></div></div></div></li>';
		} else {
			plist += '<li class="mui-table-view-cell mui-detail-list" rid="' + orderNum + '" bid="' + barcode + '"><div class="maxwidth"><div class="mui-table-cell mui-col-xs-2 "><img class="ld-itempic" src="' + productPic + '"></div><div class="mui-table-cell mui-col-xs-6"><span class="spanheight getitemName">' + productName + '</span><span class="spanheight getcodeName">' + skuName + '</span></div><div class="mui-table-cell mui-col-xs-4 cellpad"><span class="spanheight mui-pull-right">' + price + '</span><span class="spanheight">&nbsp;</span><span class="mui-pull-right dd-kucun getCount">*' + count + '</span></div></div><span class="getmemo" style="display:none">' + memo + '</span></li>';
		}

	}
	//?'<li class="mui-table-view-cell mui-table-view-cell-since"><button class="mui-btn-mini mui-btnz-edit">编辑商品</button><button class="mui-btn-mini mui-btnz-add" style="display:none"><span class="mui-icon iconfont icon-gengduo"></span>新增商品</button></li>' : ""
	//	var sinceBtnhtml = orderStatus == "SINCE";
	var sinceBtnhtml = "";
	plist += sinceBtnhtml + '<li class="mui-table-view-cell" id="showList"><span style="color:#000;font-weight:900;border:1px solid #007aff;padding:5px;border-radius:5px;color:#007aff;">查看全部</span></li><li class="mui-table-view-cell"><p><span>运费：' + postFee + '</span></p><div><span>共' + productNum + '件商品</span><span class="mui-pull-right dd-fontcolor">应付：￥<i id="total-prices">' + totalAmount + '</i>&nbsp;&nbsp;已付：￥' + initialTotalAmount + '</span></div></li>';

	detailList_id.innerHTML = plist;
	detailBuymsg_id.innerHTML = '<li class="mui-table-view-cell"><p><span>' + consignee + '<span class="longtab">' + getTel + '</span></span></p><p><span>' + province + ',' + city + ',' + cityArea + '</span></p><p><span class="longtab">' + address + '</span></p></li>';
	buyer_id.innerHTML = '<li class="mui-table-view-cell"><p>' + buyerMessage + '</p></li>'; //买家留言
	mtel_id.setAttribute("href", "tel:" + getTel)
	totalPrices = document.getElementById("total-prices");
	numBtn(); //numer  点击自生成失效，需重新运行 sinceorderCode.style.display = "none";
	plus.nativeUI.closeWaiting();
	document.getElementsByClassName("mui-content")[0].style.display = "block"
	mui(".longtab").each(function() {
			this.addEventListener("longtap", function() {
				if (plus.os.name == "Android") {
					var Context = plus.android.importClass("android.content.Context");
					var main = plus.android.runtimeMainActivity();
					var clip = main.getSystemService(Context.CLIPBOARD_SERVICE);
					plus.android.invoke(clip, "setText", this.innerText);
				} else {
					var UIPasteboard = plus.ios.importClass("UIPasteboard");
					//这步会有异常因为UIPasteboard是不允许init的，init的问题会在新版中修改
					var generalPasteboard = UIPasteboard.generalPasteboard();
					// 设置/获取文本内容:
					generalPasteboard.setValueforPasteboardType(this.innerText, "public.utf8-plain-text");
					var value = generalPasteboard.valueForPasteboardType("public.utf8-plain-text");
				}
				plus.ui.toast("复制成功", {
					duration: 200,
					verticalAlign: "top"
				});

			});

		})
		//	document.getElementsByClassName("longtab")[2].ontouchstart = function(e) {
		//		var t = e.originalEvent.changedTouches[0];
		//		var x = t.clientX;
		//		var y = t.clientY;
		//	}
		//	document.getElementsByClassName("longtab")[2].ontouchmove = function() {
		//		e.preventDefault();
		//		var t = e.originalEvent.changedTouches[0];
		//		this.tdata.now[0] = t.clientX, this.tdata.now[1] = t.clientY, this.tdata.nowtime = e.timeStamp
		//	}
		//	document.getElementsByClassName("longtab")[2].ontouchend = function() {
		//
		//	}
		//	mui(".mui-table-view-cell-since").on("tap", ".mui-btnz-edit", function() { //自提订单编辑保存
		//		var val = this.innerText;
		//		var mdl = document.getElementsByClassName("mui-detail-list");
		//		var priceAr = [];
		//		var save = 0;
		//		var products = {};
		//		var product = [];
		//		for (var i = 0; i < mdl.length; i++) {
		//			var unitPrice = mdl[i].getElementsByClassName("cellpad")[0].getElementsByTagName("span")[0].innerText.substring(1);
		//			var count = mdl[i].getElementsByClassName("cellpad")[0].getElementsByTagName("span")[1];
		//			var incount = mdl[i].getElementsByClassName("cellpad")[0].getElementsByTagName("div")[0];
		//			var addBtn = document.getElementsByClassName("mui-btnz-add")[0]
		//			if (val == "编辑商品") {
		//				count.style.display = "none";
		//				incount.style.display = "block";
		//			} else {
		//				count.style.display = "block";
		//				incount.style.display = "none";
		//				count.innerHTML = "*" + incount.getElementsByTagName("input")[0].value;
		//				priceAr.push(unitPrice + "," + count.innerHTML);
		//			}
		//
		//		}
		//		if (val == "编辑商品") {
		//			this.innerText = "保存编辑";
		//			addBtn.style.display = "block";
		//			sinceedit = 1;
		//		} else {
		//			sinceedit = 0;
		//			plus.nativeUI.showWaiting();
		//			addBtn.style.display = "none"
		//			this.innerText = "编辑商品";
		//			for (var i = 0; i < mdl.length; i++) {
		//				var barcode = mdl[i].getAttribute("bid")
		//				var stock = mdl[i].getElementsByClassName("cellpad")[0].getElementsByTagName("span")[1].innerText.substring(1);
		//				product[i] = {
		//					barcode: barcode,
		//					stock: stock
		//				};
		//			}
		//			products.products = product;
		//			console.log(products)
		//			var param = systemParam("V5.mobile.order.item.update");
		//			param.orderNumber = orderNum;
		//			param.itemData = JSON.stringify(products);
		//			param.uniqueCode = uniqueCode();
		//			console.log(param)
		//			dataSendFn('orderItemUpdate', param, function(data) {
		//				plus.nativeUI.closeWaiting();
		//				if (!data.isSuccess) {
		//					var mapmsg = data.map.errorMsg;
		//					plus.nativeUI.alert(mapmsg, function() {}, "", "OK");
		//					console.log(mapmsg)
		//					return
		//				}
		//				var total = 0;
		//				console.log(priceAr)
		//				for (var i = 0; i < priceAr.length; i++) {
		//					total += priceAr[i].split(",")[0] * priceAr[i].split(",")[1].substring(1);
		//
		//				}
		//
		//				totalPrices.innerText = total
		//				plus.nativeUI.alert("保存成功", function() {}, "", "OK");
		//			}, "get")
		//		}
		//
		//	})
		//	mui(".mui-table-view-cell-since").on("tap", ".mui-btnz-add", function() { //自提订单添加商品
		//		var href = "addnewitem.html";
		//		mui.openWindow({
		//			id: href,
		//			show: {
		//				aniShow: "pop-in"
		//			},
		//			waiting: {
		//				autoShow: true
		//			}
		//		})
		//	})

	getorderCode.style.display = "none";
	sendCodeUl.style.display = "none";
	sinceorderCode.style.display = "none";
	id_UN_ACCPET.style.display = "none";
	id_ACCPET.style.display = "none";
	id_SINCE.style.display = "none";
	id_WAIT_GOOD.style.display = "none";
	IN_STORE.style.display = "none";
	detailfixBtn.style.display = "block";
	switch (orderStatus) {
		case "UN_ACCPET":
			id_UN_ACCPET.style.display = "block";
			break;
		case "ACCPET":
			id_ACCPET.style.display = "block";
			break;
		case "SINCE":
			id_SINCE.style.display = "block";
			sinceorderCode.style.display = "block";
			sendCodeUl.style.display = "block";
			break;
		case "WAIT_GOOD":
			id_WAIT_GOOD.style.display = "block"
			getorderCode.style.display = "block";
			sendCodeUl.style.display = "block";
			break;
		case "IN_STORE":
			detailfixBtn.style.display = "none";
			//			document.body.style.paddingBottom = "0";

			break;
		default:
			document.body.style.paddingBottom = "40px";
			break;
	}
	if (orderPayStatus == "未付款订单") {
		IN_STORE.style.display = "block";
		detailfixBtn.style.display = "block";
		//				document.body.style.paddingBottom = "40px";
	}
}

function detailaddItems(product, index) { //自提订单新增商品
	//	var sinceClass = index == undefined ? document.getElementsByClassName("mui-table-view-cell-since")[0] : detailList_id.getElementsByTagName("li")[index];
	//	product = JSON.parse(product)
	//
	//	for (var i = 0; i < product.length; i++) {
	//		var barcode = product[i].barcode
	//		var productNumber = product[i].productNumber
	//		var productName = product[i].productName
	//		var productPic = product[i].productPic
	//		var skuName = product[i].skuName
	//		var price = product[i].price
	//		var count = product[i].count;
	//		var numPlay = ""
	//		var spanPlay = "display:none";
	//		console.log(index != undefined)
	//		if (sinceedit == 0 && (index != undefined)) {
	//			numPlay = "display:none";
	//			spanPlay = ""
	//		}
	//		var html = '<div class="mui-slider-right mui-disabled btnsize"><a class="mui-btn btnsize mui-listself-pad" href="javascript:void(0);" onclick="delShop(this)"><div><span class="mui-icon iconfont icon-shanchu changeicon mui-listself-fontsize"></span> 删除</div></a><a class="mui-btn btnsize mui-listself-pad" href="javascript:void(0);" onclick="replaceShop(this)"><div><span class="mui-icon iconfont icon-xiugai changeicon mui-listself-fontsize"></span> 替换</div></a></div><div class="maxwidth mui-slider-handle"><div class="mui-table-cell mui-col-xs-2 "><img class="ld-itempic" src="' + productPic + '" /></div><div class="mui-table-cell mui-col-xs-6"><span class="spanheight">' + productName + '</span><span>' + skuName + '</span></div><div class="mui-table-cell mui-col-xs-2 cellpad" ><span class="spanheight">￥' + price + '</span><span class=""  style="' + spanPlay + '">*' + count + '</span><div class="mui-numbox nl-num" data-numbox-min="0" style="' + numPlay + '"><button class="mui-btn mui-numbox-btn-minus" type="button">-</button><input class="mui-numbox-input" type="number" value="' + count + '" /><button class="mui-btn mui-numbox-btn-plus" type="button">+</button></div></div></div>';
	//		var li = document.createElement("li");
	//		li.className = "mui-table-view-cell mui-detail-list";
	//		li.setAttribute("rid", productNumber)
	//		li.innerHTML = html;
	//		detailList_id.insertBefore(li, sinceClass);
	//
	//	}
	//	index != undefined && sinceClass.parentNode.removeChild(sinceClass)
	//	totalPrices.innerText = "￥" + evelPrice();
	//	numBtn(); //numer  点击自生成失效，需重新运行 
}

function delShop(a) { //自提订单删除
	//	console.log("自提订单删除")
	//	plus.nativeUI.confirm("确定删除?", function(e) {
	//		if (e.index == 0) {
	//			var prList = a.parentNode.parentNode;
	//			var len = prList.parentNode.getElementsByClassName("mui-detail-list").length;
	//			if (len == 1) {
	//				plus.nativeUI.alert("只有一个商品不允许删除", function() {}, "", "OK");
	//				return
	//			}
	//			prList.parentNode.removeChild(prList);
	//		}
	//
	//	}, "", ["确认", "取消"]);
}

function replaceShop(e) { //自提订单替换  
	//	var prList = e.parentNode.parentNode;
	//
	//	var s = index(prList, detailList_id.getElementsByTagName("li"))
	//	console.log(s)
	//	console.log("自提订单替换")
	//	mui.fire(addnewitem, 'addnewitem', {
	//		index: s
	//	});
	//	setTimeout(function() {
	//		mui.openWindow({
	//			id: "addnewitem.html",
	//			show: {
	//				aniShow: "pop-in"
	//			},
	//			waiting: {
	//				autoShow: true
	//			}
	//		})
	//	}, 0)
}


function index(current, obj) {
	for (var i = 0; i < obj.length; i++) {
		if (obj[i] == current) {
			console.log(i)
			return i;
		}
	}
}

function evelPrice() { //计算改变以后的总价
	//	var mdl = document.getElementsByClassName("mui-detail-list");
	//	var priceAr = [];
	//	var save = 0;
	//	for (var i = 0; i < mdl.length; i++) {
	//		var unitPrice = mdl[i].getElementsByClassName("cellpad")[0].getElementsByTagName("span")[0].innerText.substring(1);
	//		var count = mdl[i].getElementsByClassName("cellpad")[0].getElementsByTagName("span")[1].innerText.substring(1);
	//		priceAr.push(unitPrice + "," + count);
	//	}
	//
	//	var total = 0;
	//	for (var i = 0; i < priceAr.length; i++) {
	//		total += priceAr[i].split(",")[0] * priceAr[i].split(",")[1];
	//	}
	//
	//	return total.toFixed(2);

}

function coorDinate() { //自提订单申请协调
	console.log("自提订单申请协调")
	var btnArray = ['确定', '取消'];
	mui.prompt('申请协调：', '请输入申请协调原因', '', btnArray, function(e) {
		if (e.index == 0) {
			if (!e.value) {
				plus.nativeUI.alert("请输入申请协调原因", function() {}, "", "OK");
				return
			}
			var kparam = systemParam("V5.mobile.order.operation");
			kparam.orderNumber = orderNum;
			kparam.operation = "APPLY";
			kparam.operationReason = e.value;
			dataSendFn('orderOperation', kparam, function(data) {
				if (!data.isSuccess) {
					var mapmsg = data.map.errorMsg;
					plus.nativeUI.alert(mapmsg, function() {}, "", "OK");
					console.log(mapmsg)
					return
				}
				plus.nativeUI.alert("申请协调成功！", function() {
					var page = plus.webview.getWebviewById("list/dingdan.html");
					page.evalJS("getThisDate('" + backstatus + "','',1)")
					layer.closeAll();
					setTimeout(function() {
						mui.back();
					}, 0)

				}, "", "OK");
			}, "get")

		}
	})
}
mui("#payPopover").on("tap", "li", function() {
	var pid = this.getAttribute("pid");
	if (pid == "scanCode" || pid == "wxpay") {
		successPay(pid)
	} else {
		plus.nativeUI.confirm("确定已完成付款?", function(e) {
			if (e.index == 0) {
				successPay()
			}
		}, "温馨提示", ["是", "否"]);
	}
	mui('#payPopover').popover('hide');
})

//点击商品信息弹出信息框
mui("#detailList").on("tap", "#showList", function() {
	listhade.style.display = "block";
	listself.style.height = phoneheight - 85 + "px";

	listself.style.overflow = "hidden";

	document.getElementById("closeHade").style.display = "block";
	var getitemName = document.getElementsByClassName("getitemName");
	var getcodeName = document.getElementsByClassName("getcodeName");
	var getCount = document.getElementsByClassName("getCount");
	var getmemo = document.getElementsByClassName("getmemo");

	for (var i = 0; i < getitemName.length; i++) {
		var html = '<div class="listhadediv1"><span class="fontwei">' + (i + 1) + '.商品名称：</span><span class="shopname">' + getitemName[i].innerText + '</span></div>';
		html += '<div class="listhadediv1"><span class="fontwei shopname">规格名称：</span><span class="shopname">' + getcodeName[i].innerText + '</span></div>';
		html += '<div class="listhadediv1"><span class="fontwei shopname">数量：</span><span class="shopname">' + getCount[i].innerText + '</span></div>';
		html += '<div class="listhadediv1"><span class="fontwei shopname">备注：</span><span class="shopname">' + getmemo[i].innerText + '</span></div>';
		var div = document.createElement("div");
		div.className = "listhadedd";
		div.innerHTML = html;
		listhade.appendChild(div);
	}
	listself.style.overflow = "auto";
});

document.getElementById("closeHade").addEventListener("tap", function() {
	listhade.innerHTML = "";
	listhade.style.display = "none";
	listself.style.overflow = "auto";
	listself.style.height = "auto";
	document.getElementById("closeHade").style.display = "none";
});

function successPay(c) {

	if (c) {
		mui.openWindow({
			id: "../barcode/barcode_payment.html",
			url: "../barcode/barcode_payment.html",
			extras: {
				orderNumber: orderNum,
				pid: c
			},
			styles: {
				popGesture: "close"
			},
			show: {
				aniShow: "pop-in"
			},
			waiting: {
				autoShow: true
			}
		})
	} else {
		var param = systemParam("V5.mobile.order.alipay");
		param.orderNumber = orderNum;
		param.authCode = "";
		dataSendFn('orderAlipay', param, function(data) {
			console.log(data)
			if (!data.isSuccess) {
				var mapmsg = data.map.errorMsg;
				plus.nativeUI.alert(mapmsg, function() {}, "", "OK");
				return
			}
			plus.nativeUI.alert("支付成功！", function() {
				IN_STORE.style.display = "none";
				document.getElementById("orderPayStatus").innerHTML = "已付款订单"
			}, "", "OK");
		}, "get")
	}


}

function checkDetail() {
	IN_STORE.style.display = "none";
	document.getElementById("orderPayStatus").innerHTML = "已付款订单"
}
//print


function getprintAr() {
	printAr = []
	printAr.push(printShop)
	printAr.push(printOrderNum)
	printAr.push(printConsignee)
	printAr.push(printTel)
	printAr.push(printAddress)
	var printList = document.getElementsByClassName("mui-detail-list");
	var totalCount = 0;
	var totalPrice = 0;
	for (var i = 0; i < printList.length; i++) {
		var mid = printList[i].getElementsByClassName("mui-table-cell");
		var name = mid[1].getElementsByTagName("span")[0].innerText;
		var sku = mid[1].getElementsByTagName("span")[1].innerText;

		var unitprice = mid[2].getElementsByTagName("span")[0].innerText;
		unitprice = parseFloat(unitprice)
		var count = mid[2].getElementsByTagName("span")[2].innerText.substring(1);
		count = parseInt(count)
		thisPrice = count * unitprice
		printAr.push(name)
		printAr.push(("数量:" + count + "；单价:" + unitprice).replace(/\s+/g, ""))
		printAr.push(sku.replace(/\s+/g, ""));
		totalCount += count
		totalPrice += thisPrice
	}
	printAr.push("共计" + totalCount + "件");
	printAr.push(("应付" + totalPrice + "元").replace(/\s+/g, ""));
}

function getbluetoothStatus(callback) {
	var main = plus.android.runtimeMainActivity();
	var BluetoothAdapter = plus.android.importClass("android.bluetooth.BluetoothAdapter");
	var BAdapter = new BluetoothAdapter.getDefaultAdapter();
	var resultDiv = document.getElementById('output');
	var receiver = plus.android.implements('io.dcloud.android.content.BroadcastReceiver', {
		onReceive: function(context, intent) { //实现onReceiver回调函数
			plus.android.importClass(intent);
			console.log(intent.getAction());
			resultDiv.textContent += '\nAction :' + intent.getAction();
			main.unregisterReceiver(receiver);
		}
	});
	var IntentFilter = plus.android.importClass('android.content.IntentFilter');
	var filter = new IntentFilter();
	filter.addAction(BAdapter.ACTION_STATE_CHANGED); //监听蓝牙开关
	main.registerReceiver(receiver, filter); //注册监听

	if (!BAdapter.isEnabled()) {
		plus.ui.toast("蓝牙开启中…", {
			duration: 200,
			verticalAlign: "top"
		});
		BAdapter.enable(); //启动蓝牙

	} else {
		//		BAdapter.disable();
	}
}

function setPrint(e) {
	var main = plus.android.runtimeMainActivity();
	var BluetoothAdapter = plus.android.importClass("android.bluetooth.BluetoothAdapter");
	var UUID = plus.android.importClass("java.util.UUID");
	var uuid = UUID.fromString("00001101-0000-1000-8000-00805F9B34FB");
	var BAdapter = BluetoothAdapter.getDefaultAdapter();
	BAdapter.cancelDiscovery(); //停止扫描
	var device = BAdapter.getRemoteDevice(e);
	if (!device) {
		canprint = 0
		return
	}
	plus.android.importClass(device);
	var bluetoothSocket = device.createInsecureRfcommSocketToServiceRecord(uuid);
	plus.android.importClass(bluetoothSocket);
	if (!bluetoothSocket.isConnected()) {
		bluetoothSocket.connect();
		var outputStream = bluetoothSocket.getOutputStream();
		plus.android.importClass(outputStream);
		return outputStream
	}
}

function getTwoData(e) {
	var param = systemParam("V5.mobile.order.info.get");
	param.orderNumber = e;
	dataSendFn('orderInfoGet', param, function(data) {
		loadData(data)
	}, "get")
}

function printObj(printAr) {
	var mac = plus.storage.getItem("printMac");
	if (plus.os.name == "iOS") {
		plus.nativeUI.alert("苹果手机暂不支持", function() {}, "", "OK");
		return
	}
	if (!mac) {
		plus.nativeUI.alert("打印机尚未设置,点击更多进行设置", function() {}, "", "OK");
		return
	}
	if (!outputStream) {
		getbluetoothStatus()
		outputStream = setPrint(mac)
	}
	for (var i = 0; i < printAr.length; i++) {
		var string = printAr[i];
		var bytes = plus.android.invoke(string, 'getBytes', 'gbk');
		outputStream.write(bytes, 0, bytes.length);
		outputStream.write(0X0D);
	}
	outputStream.write(0X0D);
	outputStream.write(0X0D);
	outputStream.write(0X0A);
	outputStream.flush();
	var param = systemParam("V5.mobile.order.print");
	param.orderNumber = orderNum;
	dataSendFn('orderPrint', param, function(data) {
		plus.nativeUI.closeWaiting();
		console.log(JSON.stringify(data))
		if (!data.isSuccess) {
			var mapmsg = data.map.errorMsg;
			plus.nativeUI.alert(mapmsg, function() {}, "", "OK");
			console.log(mapmsg)
			return
		}
	}, "get")
}