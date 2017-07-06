mui.init({
	pullRefresh: {
		container: '#tochange',
		up: {
			contentdown: '上拉加载更多',
			contentrefresh: '正在刷新中...',
			callback: pullupRefresh
		}
	},
	swipeBack: false,
	keyEventBind: {
		backbutton: false
	}
});
var mypt = null,
	map = null,
	orderStatus, myGeo, tolistli, bournObj = {}; //储存地址，经纬度，订单编号
mui.plusReady(function() {
		var tolistdetail = document.getElementById("tolistdetail"); //列表UL
		var bottomPopover = document.getElementById("bottomPopover"); //<!--待发货订单-->
		var mapIdTap = document.getElementById("mapIdTap"); //右上角地图图标
		var orderlistTxt = document.getElementById("orderlistTxt");
		var searcBtn = document.getElementById("searcBtn");
		orderStatus = document.getElementById("orderStatus"); //右上角地图图标
		var mapPage = plus.webview.getWebviewById('map/maps_map.html'); //地图页面ID
		var detailPage = plus.webview.getWebviewById('list/listdetail.html'); //订单详情页面ID

		
		mapIdTap.addEventListener("tap", function() {
			var list = tolistdetail.getElementsByTagName("li");
			var count = 0;
			var mapShow = {};
			for (var i = 0; i < list.length; i++) {
				var listck = list[i].getElementsByTagName("input")[0];
				if (listck.checked) {
					var address = listck.getAttribute("address");
					if (count < 10) {
						count++;
						mapShow[address] = bournObj[address];
					} else {
						break
					}
				}
			}
			var lcount = list.length > 10 ? 10 : list.length
			if (count == 0) {
				for (var i = 0; i < lcount; i++) {
					var listck = list[i].getElementsByTagName("input")[0];
					var address = listck.getAttribute("address");
					mapShow[address] = bournObj[address];

				}
			}
			//触发地图页面的mapShow事件

			mui.fire(mapPage, 'mapShow', {
				mapShow: mapShow,
				orderStatus: orderStatus.value,
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
		mui("#tolistdetail").on('tap', "a", function() {
			var orderNumber = this.getAttribute('orderNumber');
			var disc = this.parentNode.getAttribute('disc');
			var address = this.getAttribute('address');
			mui.fire(detailPage, 'detailShow', {
				orderNumber: orderNumber,
				disc: disc,
				address: address
			});
			setTimeout(function() {
				mui.openWindow({
					id: "list/listdetail.html",
					show: {
						aniShow: "pop-in"
					},
					waiting: {
						autoShow: false
					}
				})
			})

		})
		mui('#bottomPopover').on('tap', 'li', function() {
			var tabId = this.getAttribute("pid");
			bottomPopover.style.display = "none";
			var mask = document.getElementsByClassName("mui-backdrop")[0];
			document.body.removeChild(mask);
			document.getElementById('mapIdTap').style.display = "none";
			tolistdetail.innerHTML = ""
			ItemId = null;
			mui("#tochange").pullRefresh().refresh(true)
			plus.nativeUI.showWaiting();
			getThisDate(tabId);

		})

		//	mui("#id_ACCPET").on("tap", ".mui-btnz-kick", function() { //踢回订单接口操作
		//		console.log("踢回订单")
		//		var checkCount = 0;
		//		var kickNum = "";
		//		for (var i = 0; i < tolistli.length; i++) {
		//			var listck = tolistli[i].getElementsByTagName("input")[0];
		//			if (listck.checked) {
		//				checkCount++;
		//				kickNum = listck.getAttribute("ordernumber");
		//			}
		//		}
		//		if (checkCount == 0) {
		//			plus.nativeUI.alert("请选择要踢回的订单", function() {}, "", "OK");
		//			return
		//		}
		//		if (checkCount > 1) {
		//			plus.nativeUI.alert("只能选择一个订单", function() {}, "", "OK");
		//			return
		//		}
		//
		//
		//		var param = systemParam("V5.mobile.order.kickbackreason.search");
		//		dataSendFn('orderKickbackreasonSearch', param, function(data) { //踢回订单原因接口 
		//			var reasons = data.reasons;
		//			var html = "";
		//			for (var i = 0; i < reasons.length; i++) {
		//				var reasonId = reasons[i].reasonId;
		//				var reasonInfo = reasons[i].reasonInfo;
		//				html += "<div class='mui-input-row mui-radio mui-left'><label>" + reasonInfo + "</label><input name='radio' rid=" + reasonId + " rinfo=" + reasonInfo + " type='radio'></div>";
		//			}
		//			layer.open({
		//				title: ['踢回原因选择', 'text-align:center'],
		//				content: html,
		//				btn: ['确认', '取消'],
		//				shadeClose: false,
		//				style: 'width:260px;',
		//				yes: function() {
		//					var layermbox0 = document.getElementsByClassName("layermmain")[0];
		//					var resonList = layermbox0.getElementsByTagName("input");
		//					var rid;
		//					for (var i = 0; i < resonList.length; i++) {
		//						if (resonList[i].checked == true) {
		//							rid = resonList[i].getAttribute("rid");
		//							var kparam = systemParam("V5.mobile.order.operation");
		//							kparam.orderNumber = kickNum;
		//							kparam.operation = "KICK_BACK";
		//							kparam.operationReason = rid;
		//							dataSendFn('orderOperation', kparam, function(data) {
		//								plus.nativeUI.alert("成功踢回订单", function() {}, "", "OK");
		//								layer.closeAll()
		//							})
		//							return;
		//						}
		//					}
		//
		//
		//				}
		//			});
		//		}, "get")
		//
		//	})
		mui(".orderfixBtn").on("tap", ".mui-btnz-tack", function() { //接单接口操作
			var checkCount = 0;
			var getNum = "";
			var checkli;
			for (var i = 0; i < tolistli.length; i++) {
				var listck = tolistli[i].getElementsByTagName("input")[0];
				if (listck.checked) {
					checkCount++;
				}
			}
			if (checkCount == 0) {
				plus.nativeUI.alert("请选择要接的订单", function() {}, "", "OK");
				return
			}
			if (checkCount > 1) {
				plus.nativeUI.alert("只能选择一个订单", function() {}, "", "OK");
				return
			}

			console.log("接单")

			for (var i = 0; i < tolistli.length; i++) {
				var listck = tolistli[i].getElementsByTagName("input")[0];
				if (listck.checked) {
					getNum = listck.getAttribute("ordernumber");
					var param = systemParam("V5.mobile.order.operation");
					param.orderNumber = getNum;
					param.operation = "ACCEPET";
					param.operationReason = "";
					dataSendFn('orderOperation', param, function(data) {
						plus.nativeUI.alert("接单成功", function() {
							mui("#tochange").pullRefresh().refresh(true)
							ItemId = null;
							tolistdetail.innerHTML = ""
							console.log(orderStatus.value)
							getThisDate(orderStatus.value)
						}, "", "OK");
					}, "get")
					return
				}
			}


		})
		mui(".orderfixBtn").on("tap", ".mui-btnz-send", function() { //发货接口操作
			console.log("发货接口");
			var checkCount = 0;
			var getNum = "";
			var checkli;
			for (var i = 0; i < tolistli.length; i++) {
				var listck = tolistli[i].getElementsByTagName("input")[0];
				if (listck.checked) {
					checkCount++;
					getNum = listck.getAttribute("ordernumber")
				}
			}
			if (checkCount == 0) {
				plus.nativeUI.alert("请选择要接的订单", function() {}, "", "OK");
				return
			}
			if (checkCount > 1) {
				plus.nativeUI.alert("只能选择一个订单", function() {}, "", "OK");
				return
			}
			var param = systemParam("V5.mobile.order.outsend");
			param.orderNumber = getNum;

			param.operation = 'STORE_DELIVERY';
			console.log(param)
			dataSendFn('orderOutsend', param, function(data) {
				if (!data.isSuccess) {
					var mapmsg = data.map.errorMsg;
					plus.nativeUI.alert(mapmsg, function() {}, "", "OK");
					console.log(mapmsg)
					return
				}
				plus.nativeUI.alert("发货成功", function() {
					ItemId = null;
					mui("#tochange").pullRefresh().refresh(true)
					tolistdetail.innerHTML = ""
					console.log(orderStatus.value)
					getThisDate(orderStatus.value)

				}, "", "OK");
			}, "get")


		})
		mui(".mui-contentzh").on("tap", "#searcBtn", function() { //搜索操作
			var val = orderlistTxt.value;
			oval = orderStatus.value; 
			plus.nativeUI.showWaiting();
			mui("#tochange").pullRefresh().refresh(true)
			tolistdetail.innerHTML = "";
			getThisDate(oval, val, 1);
			orderlistTxt.value = ""
		})

	})


var count2;
document.getElementById("selectAll").addEventListener("tap", function() {
	var listUl = document.getElementById("tolistdetail")
	var list = listUl.getElementsByTagName('input');
	var count2=0;
	var changeNum=document.getElementById("changeNum");
	var value = this.checked ? false : true;
	for (var i = 0; i < list.length; i++) {
		if (list[i].getAttribute("type") == "checkbox") {
			list[i].checked = value;
			count2++;
		}
	}
	if(!document.getElementById("selectAll").checked){
		changeNum.innerText="("+count2+")";
	}else{
		changeNum.innerText="(0)";
	}
});

mui('#tolistdetail').on('change', 'input', function() {
	
	count2=0;
	var listUl = document.getElementById("tolistdetail");
	var list = listUl.getElementsByTagName('input');
	var changeNum=document.getElementById("changeNum");
	for (var i = 0; i < list.length; i++) {
		if (list[i].getAttribute("type") == "checkbox") {
			if(list[i].checked){
				count2++;
			}
		}
	}
	
	changeNum.innerText="("+count2+")";
	
});


var ItemId = null;

function getThisDate(e, v, c) {
	if (c) {
		ItemId = null;
		tolistdetail.innerHTML = ""
	}
	var param = systemParam("V5.mobile.order.info.search");
	var allstatus;
	
	param.orderStatus = e|| "";
	param.orderNumber = v || "";
	param.optype = "up";
	param.orderId = ItemId || "";
	param.pageSize = 15;
	orderStatus.value = e;
	dataSendFn('orderInfoSearch', param, function(data) {
		plus.nativeUI.closeWaiting();
		if (!data.isSuccess) {
			mui('#tochange').pullRefresh().endPullupToRefresh(true);
			var mapmsg = data.map.errorMsg;
			if (c) {
				plus.nativeUI.alert(mapmsg, function() {}, "", "OK");
			
			}
			if(mapmsg=="没有相关订单信息"){
				plus.nativeUI.alert(mapmsg, function() {}, "", "OK");
			}
			console.log(mapmsg)
			return
		}
		var orders = data.orders;
		ItemId = orders[orders.length - 1].orderId
		var i = 0;
		var adrAr = [];
		var orderAr = [];
		bournObj = {}
		while (i < orders.length) {
			var orderNumber = orders[i].orderNumber;
			var orderPayStatus = orders[i].orderPayStatus;
			var totalAmount = orders[i].totalAmount;
			var address = (orders[i].address).replace(/\s/g, "");
			adrAr.push(address);
			orderAr.push(orderNumber);
			var productNum = orders[i].productNum;
			var orderStatus = orders[i].orderStatus;
			var totalAmount = orders[i].totalAmount;
			var initialTotalAmount = orders[i].initialTotalAmount;
			var initialTotalAmount = orders[i].initialTotalAmount;
			var products = orders[i].products;
			var linkhtml = "";
			allstatus = !e ? orderStatus : "";
			for (var j = 0; j < products.length; j++) {
				var productNumber = products[j].productNumber;
				var productName = products[j].productName;
				var productPic = products[j].productPic || "../images/cbd.jpg";
				var skuNumber = products[j].skuNumber;
				var skuName = products[j].skuName;
				var barcode = products[j].barcode;
				var price = products[j].price;
				var count = products[j].count;
				var stock = products[j].stock;

				linkhtml += '<a class="mui-flex-all dd-top mui-flex-abottom" href="listdetail.html" address=' + address + ' orderNumber=' + orderNumber + '><img class="itempic" src="' + productPic + '"><div class="mui-table-flex mui-flex-lineheight"><span class="mui-flex-block">' + productName + '</span><span class="mui-flex-block">' + skuNumber + ' </span><span class="mui-flex-block">' + skuName + '</span></div><div class="cellpad mui-flex-width"><span class="mui-flex-block mui-flex-textright">￥' + price + '</span><span class="mui-flex-block mui-flex-positionright">*' + count + '</span></div></a>'
			}
			var hascheckBox = e == "" ? '<div class="mui-input-row mui-checkbox mui-flex-checkwidth"></div>' : '<div class="mui-input-row mui-checkbox mui-flex-checkwidth"><input name="checkbox" address=' + address + ' orderNumber=' + orderNumber + ' class="changeinput" value="Item 1" type="checkbox"></div>';
			var html = '<div class="mui-input-group"><div class="mui-flex-all">' + hascheckBox + '<div class="mui-table-flex"><div class="mui-flex-all"><span class="mui-table-flex mui-dingdan-padding mui-flex-margintop"><span class="mui-flex-block">' + orderNumber + '</span></span><span class="mui-table-flex2 mui-flex-margintop mui-flex-textcenter">' + allstatus + '</span><div class="mui-flex-width mui-flex-margintop mui-text-right"><span class="mui-icon iconfont icon-ditu1 dd-fontcolor mui-flex-textright"></span><span class="discText mui-flex-textright"></span></div></div>' + linkhtml + '</div></div><div class="mui-text-right"><span>共' + productNum + '件商品&nbsp;&nbsp;<span class="colorword dd-fontcolor">应付￥' + totalAmount + '&nbsp;&nbsp;实付￥' + initialTotalAmount + '</span></span></div></div>'
			var li = document.createElement("li");
			li.className = "mui-table-view-cell";
			li.innerHTML = html;
			tolistdetail.appendChild(li);
			i++
		}
		tolistli = tolistdetail.getElementsByTagName("li"); //列表li 
		DistanceFn(0, adrAr, myGeo, orderAr);
       
	}, "get")
	document.body.style.paddingBottom = "40px";
	console.log(e)
	switch (e) { 
		case "UN_ACCPET":
			document.getElementById('mapIdTap').style.display = "block";
			document.getElementById('saomiaoId').style.display = "none";
			document.getElementById('myfixBtn').style.display = "block";
			document.getElementById('id_UN_ACCPET').style.display = "block";
			document.getElementById('id_ACCPET').style.display = "none"; 
			document.getElementById('headname').innerHTML = "未接订单<span class='mui-icon mui-icon-arrowdown dingdan-fff'></span>";
			break;
		case "ACCPET":
			document.getElementById('saomiaoId').style.display = "none";
			document.getElementById('mapIdTap').style.display = "block";
			document.getElementById('myfixBtn').style.display = "block";
			document.getElementById('id_ACCPET').style.display = "block";
			document.getElementById('id_UN_ACCPET').style.display = "none";
			document.getElementById('headname').innerHTML = "已接订单<span class='mui-icon mui-icon-arrowdown dingdan-fff'></span>";
			break;
		case "SINCE":
			document.getElementById('saomiaoId').style.display = "block";
			document.getElementById('mapIdTap').style.display = "none";
			document.getElementById('myfixBtn').style.display = "none";
			document.getElementById('id_UN_ACCPET').style.display = "none";
			document.getElementById('id_ACCPET').style.display = "none";
			document.body.style.paddingBottom = "0px";
			document.getElementById('headname').innerHTML = "自提订单<span class='mui-icon mui-icon-arrowdown dingdan-fff'></span>";
			break;
		case "WAIT_GOOD":
			document.getElementById('saomiaoId').style.display = "block";
			document.getElementById('mapIdTap').style.display = "none";
			document.getElementById('myfixBtn').style.display = "none";
			document.getElementById('id_UN_ACCPET').style.display = "none";
			document.getElementById('id_ACCPET').style.display = "none";
			document.getElementById('headname').innerHTML = "待收货订单<span class='mui-icon mui-icon-arrowdown dingdan-fff'></span>";
			break;
		case "END_ORDER":
			document.getElementById('saomiaoId').style.display = "none";
			document.getElementById('mapIdTap').style.display = "none";
			document.getElementById('myfixBtn').style.display = "none";
			document.getElementById('id_UN_ACCPET').style.display = "none";
			document.getElementById('id_ACCPET').style.display = "none";
			document.body.style.paddingBottom = "0px";
			document.getElementById('headname').innerHTML = "已完结订单<span class='mui-icon mui-icon-arrowdown dingdan-fff'></span>";
			break;
		default:
			document.getElementById('saomiaoId').style.display = "none";
			document.getElementById('mapIdTap').style.display = "none";
			document.getElementById('myfixBtn').style.display = "none";
			document.getElementById('id_UN_ACCPET').style.display = "none";
			document.getElementById('id_ACCPET').style.display = "none";
			document.body.style.paddingBottom = "0px";
			document.getElementById('headname').innerHTML = "全部订单<span class='mui-icon mui-icon-arrowdown dingdan-fff'></span>";
			break;
	}

}

function DistanceFn(p, adrAr, myGeo, orderAr) {
	if (p >= adrAr.length) {
		 mui('#tochange').pullRefresh().endPullupToRefresh();
		return
	} else {
 
		myGeo.getPoint(adrAr[p], function(point) {
			if (point) {
				var q = tolistdetail.getElementsByTagName("li").length - adrAr.length + p;
				var b = new plus.maps.Point(point.lng, point.lat);
				var disc = getGreatCircleDistance(b.getLat(), b.getLng(), mypt.getLat(), mypt.getLng());
				var distance = "约" + (disc / 1000).toFixed(3).substring(0, 6) + "km";
				tolistdetail.getElementsByTagName("li")[q].getElementsByClassName("discText")[0].innerText = distance;
				tolistdetail.getElementsByTagName("li")[q].querySelector(".mui-table-flex").setAttribute("disc", distance);
				bournObj[adrAr[p]] = {
					point: b,
					orderNumber: orderAr[p],
					distance: distance
				};
				p++;
				DistanceFn(p, adrAr, myGeo, orderAr)
			}
		})
	}

}

function initialize(){
	myGeo = new BMap.Geocoder();
  console.log(myGeo)
		map = new plus.maps.Map("map");
		myGeo.getPoint(plus.storage.getItem("myAddress"), function(point) {
			if (point) {
				var pos = new plus.maps.Point(point.lng, point.lat);
				mypt = pos;
				plus.storage.setItem("mypt", JSON.stringify(mypt))
				map.setCenter(pos);
				

			}
		})
		map.setZoom(12);
}




/**
 * 上拉加载具体业务实现
 */
function pullupRefresh() {
		var val = document.getElementById("orderStatus").value;
		
		getThisDate(val);

}
function pulldownRefresh() {
	
}