mui.init({
	pullRefresh: {
		container: '#tochange',
		down: {
			contentrefresh: '下拉刷新中...',
			callback: pulldownRefresh
		},
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
var tochange,phonetype;
var mypt = null,
	map = null,
	orderStatus, myGeo, tolistli, bournObj = {}; //储存地址，经纬度，订单编号
mui.plusReady(function() {
	tochange=document.getElementById("tochange");
	var tolistdetail = document.getElementById("tolistdetail"); //列表UL
	var bottomPopover = document.getElementById("bottomPopover"); //<!--待发货订单-->
	var mapIdTap = document.getElementById("mapIdTap"); //右上角地图图标
	var orderlistTxt = document.getElementById("orderlistTxt");
	var searcBtn = document.getElementById("searcBtn");
	orderStatus = document.getElementById("orderStatus"); //右上角地图图标
	var mapPage = plus.webview.getWebviewById('map/maps_map.html'); //地图页面ID
	var detailPage = plus.webview.getWebviewById('list/listdetail.html'); //订单详情页面ID
	phonetype = plus.os.name.toLowerCase();
	var styleios = "<style>.mui-pull-top-pocket{height:75px}.mui-pull-top-pocket .mui-pull{top:40px}</style>";
	var divios = document.getElementById("divios");
	if (phonetype == "ios") {
		divios.innerHTML = styleios;
	}

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
		var address = this.getAttribute('address');
		mui.fire(plus.webview.getWebviewById('list/listdetail.html'), 'detailShow', {
			orderNumber: orderNumber,
			address: address,
			backstatus: orderStatus.value
		});

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

		plus.nativeUI.showWaiting()
		var param = systemParam("V5.mobile.order.outsend");
		param.orderNumber = getNum;

		param.operation = 'STORE_DELIVERY';
		console.log(param)
		dataSendFn('orderOutsend', param, function(data) {
			plus.nativeUI.closeWaiting()
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
//		tolistdetail.innerHTML = "";
		getThisDate(oval, val, 1);
		orderlistTxt.value = ""
		if (plus.os.name == "Android") {
			window.scrollTo(0, 0)
		} else {
			mui('#tochange').pullRefresh().scrollTo(0, 0)
		}
	})

})


var count2;
document.getElementById("selectAll").addEventListener("click", function() {
	var listUl = document.getElementById("tolistdetail")
	var list = listUl.getElementsByTagName('input');
	var count2 = 0;
	var changeNum = document.getElementById("changeNum");
	var value = this.checked ? true : false;
	for (var i = 0; i < list.length; i++) {
		if (list[i].getAttribute("type") == "checkbox") {
			list[i].checked = value;
			count2++;
		}
	}
	if (document.getElementById("selectAll").checked) {
		changeNum.innerText = "(" + count2 + ")";
	} else {
		changeNum.innerText = "(0)";
	}
});

mui('#tolistdetail').on('change', 'input', function() {

	count2 = 0;
	var listUl = document.getElementById("tolistdetail");
	var list = listUl.getElementsByTagName('input');
	var changeNum = document.getElementById("changeNum");
	for (var i = 0; i < list.length; i++) {
		if (list[i].getAttribute("type") == "checkbox") {
			if (list[i].checked) {
				count2++;
			}
		}
	}

	changeNum.innerText = "(" + count2 + ")";

});


var ItemId = null;

function getThisDate(e, v, c) {
	if (c) {
		ItemId = null;
		bournObj = {}
	}
	var param, paramurl;
	if (e == "IN_STORE") {
		param = systemParam("V5.mobile.order.store.search");
		paramurl = "orderStoreSearch"
	} else {
		param = systemParam("V5.mobile.order.info.search");
		paramurl = "orderInfoSearch"
	}

	var allstatus;
	var changeNum = document.getElementById("changeNum"); //全选数量归零
	changeNum.innerText = "(0)";
	param.orderStatus = e || "";
	param.orderNumber = v || "";
	param.optype = "up";
	param.orderId = ItemId || "";
	param.pageSize = 15;
	orderStatus.value = e;
	dataSendFn(paramurl, param, function(data) {
		plus.nativeUI.closeWaiting();
		if (c){
			tolistdetail.innerHTML = "";
			if (plus.os.name == "Android") {
				window.scrollTo(0, 0)
			} else {
				mui('#tochange').pullRefresh().scrollTo(0, 0)
			}
		}
		if (!data.isSuccess) {
			mui('#tochange').pullRefresh().endPullupToRefresh(true);
			var mapmsg = data.map.errorMsg;
			document.getElementById("tolistdetail").innerHTML = "";
			plus.nativeUI.alert(mapmsg, function() {}, "", "OK");
			return
		}
		if(ItemId==null){
			document.getElementById("tolistdetail").innerHTML = "";
		}
		var orders = data.orders;
		ItemId = orders[orders.length - 1].orderId
		var i = 0;
		console.log(orders[0])
		while (i < orders.length) {
			var orderNumber = orders[i].orderNumber || "";
			var orderPayStatus = orders[i].orderPayStatus || "";
			var totalAmount = orders[i].totalAmount || "";
			var address = (orders[i].address).replace(/\s/g, "") || "";
			var productNum = orders[i].productNum || "";
			var orderStatus = orders[i].orderStatus || "";
			var totalAmount = orders[i].totalAmount || "";
			var initialTotalAmount = orders[i].initialTotalAmount || "";
			var products = orders[i].products || "";
			var platName = orders[i].platName || "";
			var distance = orders[i].distance.substr(0, 6) || "";
			var linkhtml = "";
			if (platName == "门店订单") {
				allstatus = orderPayStatus
			} else if (!e) {
				allstatus = orderStatus
			} else {
				allstatus = ""
			}
			var distanceHtml = distance ? '<span class="mui-icon iconfont icon-dingwei dd-fontcolor mui-flex-textright"></span><span class="discText mui-flex-textright">约' + distance + 'km</span>' : '';
			for (var j = 0; j < products.length; j++) {
				var productNumber = products[j].productNumber || "";
				var productName = products[j].productName || "";
				var productPic = products[j].productPic || "../images/cbd.jpg";
				var skuNumber = products[j].skuNumber || "";
				var skuName = products[j].skuName || "";
				var barcode = products[j].barcode || "";
				var price = products[j].price || "";
				var count = products[j].count || "";
				var stock = products[j].stock || "";

				linkhtml += '<a class="mui-flex-all dd-top mui-flex-abottom" href="listdetail.html" address="' + address + '" orderNumber=' + orderNumber + '><img class="itempic" src="' + productPic + '"><div class="mui-table-flex mui-flex-lineheight"><span class="mui-flex-block">' + productName + '</span><span class="mui-flex-block">' + skuNumber + ' </span><span class="mui-flex-block">' + skuName + '</span></div><div class="cellpad mui-flex-width"><span class="mui-flex-block mui-flex-textright">￥' + price + '</span><span class="mui-flex-block mui-flex-positionright">*' + count + '</span></div></a>'
			}
			var hascheckBox = e == "" || e == "IN_STORE"||e == "SINCE"||e == "WAIT_GOOD"||e == "END_ORDER" ? '<div class="mui-input-row mui-checkbox mui-flex-checkwidth"></div>' : '<div class="mui-input-row mui-checkbox mui-flex-checkwidth"><input name="checkbox" address=' + address + ' orderNumber=' + orderNumber + ' class="changeinput" value="Item 1" type="checkbox"></div>';
			var html = '<div class="mui-input-group"><div class="mui-flex-all">' + hascheckBox + '<div class="mui-table-flex"><div class="mui-flex-all"><span class="mui-table-flex mui-dingdan-padding mui-flex-margintop"><span class="mui-flex-blockbyell">' + orderNumber + '</span></span><span class="mui-table-flex2 mui-flex-margintop mui-flex-textcenter">' + allstatus + '</span><div class="mui-flex-width mui-flex-margintop mui-text-right">' + distanceHtml + '</div></div>' + linkhtml + '</div></div><div class="mui-text-right"><span>共' + productNum + '件商品&nbsp;&nbsp;<span class="colorword dd-fontcolor">应付￥' + totalAmount + '&nbsp;&nbsp;实付￥' + initialTotalAmount + '</span></span></div></div>'
			var li = document.createElement("li");
			li.className = "mui-table-view-cell";
			li.innerHTML = html;
			tolistdetail.appendChild(li);
			i++;
			var disctext = distance || "未知"
			bournObj[address] = {
				orderNumber: orderNumber,
				distance: "约" + disctext + "km",
				point: ""
			};
		}
		tolistli = tolistdetail.getElementsByTagName("li"); //列表li 
		mui('#tochange').pullRefresh().endPullupToRefresh();
	}, "get")
	document.body.style.paddingBottom = "40px";
	switch (e) {
		case "UN_ACCPET":
			if (phonetype == "ios") {
				tochange.style.paddingBottom="40px";
			}
			document.getElementById('mapIdTap').style.display = "block";
			document.getElementById('saomiaoId').style.display = "none";
			document.getElementById('myfixBtn').style.display = "block";
			document.getElementById('id_UN_ACCPET').style.display = "block";
			document.getElementById('id_ACCPET').style.display = "none";
			document.getElementById('headname').innerHTML = "未接订单<span class='mui-icon mui-icon-arrowdown dingdan-fff'></span>";
			break;
		case "ACCPET":
			if (phonetype == "ios") {
				tochange.style.paddingBottom="40px";
			}
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
			tochange.style.paddingBottom="0px";
			document.getElementById('headname').innerHTML = "自提订单<span class='mui-icon mui-icon-arrowdown dingdan-fff'></span>";
			break;
		case "WAIT_GOOD":
			document.body.style.paddingBottom = "0px";
			tochange.style.paddingBottom="0px";
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
			tochange.style.paddingBottom="0px";
			document.getElementById('headname').innerHTML = "已完结订单<span class='mui-icon mui-icon-arrowdown dingdan-fff'></span>";
			break;
		case "IN_STORE":
			document.getElementById('saomiaoId').style.display = "none";
			document.getElementById('mapIdTap').style.display = "none";
			document.getElementById('myfixBtn').style.display = "none";
			document.getElementById('id_UN_ACCPET').style.display = "none";
			document.getElementById('id_ACCPET').style.display = "none";
			document.body.style.paddingBottom = "0px";
			tochange.style.paddingBottom="0px";
			document.getElementById('headname').innerHTML = "门店订单<span class='mui-icon mui-icon-arrowdown dingdan-fff'></span>";
			break;
		default:
			document.getElementById('saomiaoId').style.display = "none";
			document.getElementById('mapIdTap').style.display = "none";
			document.getElementById('myfixBtn').style.display = "none";
			document.getElementById('id_UN_ACCPET').style.display = "none";
			document.getElementById('id_ACCPET').style.display = "none";
			document.body.style.paddingBottom = "0px";
			tochange.style.paddingBottom="0px";
			document.getElementById('headname').innerHTML = "全部订单<span class='mui-icon mui-icon-arrowdown dingdan-fff'></span>";
			break;
	}

}


function initialize() {
	myGeo = new BMap.Geocoder();
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

	ItemId = null;
	var val = document.getElementById("orderStatus").value;
	mui('#tochange').pullRefresh().endPulldownToRefresh();
	getThisDate(val, '', 1);
}