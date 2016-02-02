var param, tolistdetail, dataDel, saveBtn, redscan, detailshopPage,allCategory,allNumber,allpay,phonetype;
var ws = null,
	wo = null;
mui.init({

});

mui.plusReady(function() {
	if(plus.storage.getItem("imei")==1){
		document.getElementById("isScan").style.display="block";
	}else{
		document.getElementById("isScan").style.display="none";
	}
	var cartDetailPage = plus.webview.getWebviewById("listdetailbyshop.html");
	tolistdetail = document.getElementById("tolistdetail");
	allpay = document.getElementById("allpay");
	redscan = document.getElementById("redscan");
	allCategory = document.getElementById("allCategory");
	allNumber = document.getElementById("allNumber");
	phonetype = plus.os.name.toLowerCase();
	document.getElementById("scanTxt").focus();

	allpay.addEventListener("click", function() {
		var isCheck = false;
		var list = tolistdetail.getElementsByClassName("mui-table-view-cell");
		var itemHtml = '';
		var itemPrice = 0;
		var itemNum = 0;
		for (var p = 0; p < list.length; p++) {
		    mui.swipeoutClose(list[p]);
			var cloneItem = document.createElement("li");
			cloneItem.className = "mui-table-view-cell";
			cloneItem.innerHTML = list[p].innerHTML;
			var itemCheckbox = cloneItem.getElementsByClassName("mui-checkbox")[0];
			var itemCount = parseInt(list[p].getElementsByClassName("openNum")[0].getElementsByTagName("input")[0].value);
			var unitPrice = parseFloat(cloneItem.getElementsByClassName("pricei")[0].innerHTML);
			itemPrice += itemCount * unitPrice;
			itemNum += 1;
			itemCheckbox.style.display = "none";
			cloneItem.getElementsByClassName("openNum")[0].style.display = "none";
			cloneItem.getElementsByClassName("openCount")[0].style.display = "block";
			cloneItem.getElementsByClassName("openCount")[0].innerHTML = "*" + itemCount;
			itemHtml += '<li class="mui-table-view-cell">' + cloneItem.innerHTML + '</li>';
			isCheck = true;
			
		}
		allCategory.innerHTML = 0;
		allNumber.innerHTML = 0;
		document.getElementById("selectAll").checked = false;
		var checkboxAll = document.getElementsByTagName('input');
		for(var i=0;i<checkboxAll.length;i++){
			if(checkboxAll[i].getAttribute("type")=="checkbox"){
				checkboxAll[i].checked=false 
			}
		}
		mui.fire(cartDetailPage, 'createOrderShow', {
			itemHtml: itemHtml,
			itemPrice: itemPrice,
			itemNum: itemNum
		});
		mui.openWindow({
			id: "listdetailbyshop.html",
			show: {
				aniShow: "pop-in"
			},
			waiting: {
				autoShow: true
			}
		})
	})
	var old_back = mui.back;
	mui.back = function() {
		tolistdetail.innerHTML="";
		old_back();
//		if (plus.storage.getItem("itemExist") == 1) {
//			plus.nativeUI.confirm("确定返回清空购物车商品？", function(e) {
//				if (e.index == 0) {
//					plus.storage.setItem("itemExist", "0")
//					wo.evalJS("clearCart()")
//					detailshopPage.evalJS("cleardetailShop()")
//					old_back();
//				}
//			}, "", ["确认", "取消"]);
//			return
//		} else {
//			if (mui.os.ios) {
//				plus.webview.show('home2.html');
//			} else {
//				plus.webview.show('home2.html', "fade-in", 300);
//			}
//			plus.webview.hide('list/newlist.html');
//			plus.webview.hide('shoppingcart.html');
//			plus.webview.hide('additembyself.html');
//		}

	}
});
document.getElementById("selectAll").addEventListener("click", function() {
	var listUl = document.getElementById("tolistdetail");
	var list = listUl.getElementsByTagName('input');
	var allCategory = document.getElementById("allCategory")
	var allNumber = document.getElementById("allNumber");
	var value = this.checked ? true : false;
	if (value) {
		num = listUl.getElementsByTagName("li").length || 0;
		allCategory.innerHTML = num;
		numVal = 0;
		for (var i = 0; i < list.length; i++) {
			if (list[i].getAttribute("type") == "number") {
				numVal += parseInt(list[i].value);
			}
		}
		allNumber.innerHTML = numVal;
	}else{
		allCategory.innerHTML=0;
		allNumber.innerHTML = 0;
	}
	for (var i = 0; i < list.length; i++) {
		if (list[i].getAttribute("type") == "checkbox") {
			list[i].checked = value;
		}
	}
});
mui('#tolistdetail').on('change', 'input', function() {
	var listUl = document.getElementById("tolistdetail");
	var list = listUl.getElementsByTagName('input');
	var allCategory = document.getElementById("allCategory")
	var allNumber = document.getElementById("allNumber");
	var value = this.checked ? true : false;
	var list2 = listUl.getElementsByClassName("mui-table-view-cell");
	num = 0;
	numVal=0;
	for (var i = 0; i < list.length; i++) {
		if (list[i].getAttribute("type") == "checkbox" && list[i].checked) {
			var avalue = list[i].checked ? "true" : "false";
			var par = list[i].parentNode.parentNode;
			var countNum = parseInt(par.getElementsByTagName("input")[1].value);
			if (avalue) {
				num++;
				numVal += countNum;
			}
			
		}
	}
	for (var p = 0; p < list2.length; p++) {
		var listCheck = list2[p].getElementsByTagName('input')[0];
		if (!listCheck.checked) {
			document.getElementById("selectAll").checked = false;

		}else{
			
		}
	}
	allCategory.innerHTML = num;
	allNumber.innerHTML = numVal;
});
document.getElementById("dataDel").addEventListener("tap", function() { //删除列表
		// 弹出提示信息对话框
		var isCheck = false;
		var allCategory = document.getElementById("allCategory")
		var allNumber = document.getElementById("allNumber");
		var list = tolistdetail.getElementsByClassName("mui-table-view-cell");
		var p = 0;
		while (p < list.length) {
			var listCheck = list[p].getElementsByTagName('input')[0];
			if (listCheck.checked) {
				isCheck = true;
				break;
			} else {
				p++
			}

		}

		if (isCheck) {
			plus.nativeUI.confirm("是否删除所选产品？", function(e) {

				if (e.index == 0) {
					var list = tolistdetail.getElementsByClassName("mui-table-view-cell");
					var p = 0;
					while (p < list.length) {
						var listCheck = list[p].getElementsByTagName('input')[0];
						if (listCheck.checked) {
							var listbar = list[p].getAttribute("barcode");
							tolistdetail.removeChild(list[p]);
							allCategory.innerHTML = 0;
							allNumber.innerHTML = 0;
							document.getElementById("selectAll").checked = false;
						} else {
							p++
						}

					}
					if(list.length<=0){
						CloseTopay();
					}
				} else {
					return;
				}
			}, "", ["确认", "取消"]);
		} else {
			plus.nativeUI.alert("请勾选商品！", function() {}, "", "OK");
		}
	})
	//document.getElementById("selectAll").addEventListener("click", function() {
	//	var listUl = document.getElementById("tolistdetail")
	//	var list = listUl.getElementsByTagName('input');
	//	var value = this.checked ? true : false;
	//	for (var i = 0; i < list.length; i++) {
	//		if (list[i].getAttribute("type") == "checkbox") {
	//			list[i].checked = value
	//		}
	//	}
	//
	//});
	//
	//document.getElementById("dataDel").addEventListener("tap", function() { //删除列表
	//	// 弹出提示信息对话框
	//	var isCheck = false;
	//	var list = tolistdetail.getElementsByClassName("mui-table-view-cell");
	//	var p = 0;
	//	while (p < list.length) {
	//		var listCheck = list[p].getElementsByTagName('input')[0];
	//		if (listCheck.checked) {
	//			isCheck = true;
	//			break;
	//		} else {
	//			p++
	//		}
	//
	//	}
	//
	//	if (isCheck) {
	//		plus.nativeUI.confirm("是否删除所选产品？", function(e) {
	//
	//			if (e.index == 0) {
	//				var list = tolistdetail.getElementsByClassName("mui-table-view-cell");
	//				var p = 0;
	//				while (p < list.length) {
	//					var listCheck = list[p].getElementsByTagName('input')[0];
	//					if (listCheck.checked) {
	//						document.getElementById("selectAll").checked = false;
	//						tolistdetail.removeChild(list[p]);
	//						plus.ui.toast("删除成功！", {
	//							duration: 200,
	//							verticalAlign: "top"
	//						})
	//						if (list.length == 0) {
	//							document.getElementById("selectAll").checked = false;
	//						}
	//					} else {
	//						p++
	//					}
	//
	//				}
	//			} else {
	//				return;
	//			}
	//		}, "", ["确认", "取消"]);
	//	} else {
	//		plus.ui.toast("请勾选商品！", {
	//			duration: 200,
	//			verticalAlign: "top"
	//		})
	//
	//	}
	//
	//
	//
	//})



//document.getElementById("addcart").addEventListener("tap", function() {
//	// 弹出提示信息对话框
//	var isCheck = false;
//	var list = tolistdetail.getElementsByClassName("mui-table-view-cell");
//	var p = 0;
//	while (p < list.length) {
//		var listCheck = list[p].getElementsByTagName('input')[0];
//		if (listCheck.checked) {
//			isCheck = true;
//			break;
//		} else {
//			p++
//		}
//
//	}
//
//	if (isCheck) {
//		plus.nativeUI.confirm("是否加入购物车？", function(e) {
//
//			if (e.index == 0) {
//				var list = tolistdetail.getElementsByClassName("mui-table-view-cell");
//				var p = 0;
//				while (p < list.length) {
//					var listCheck = list[p].getElementsByTagName('input')[0];
//					if (listCheck.checked) {
//						var listbar = list[p].getAttribute("barcode");
//						wo.evalJS("addNewItems('" + list[p].innerHTML + "');");
//						tolistdetail.removeChild(list[p]);
//						plus.ui.toast("添加成功！", {
//							duration: 200,
//							verticalAlign: "top"
//						})
//						plus.storage.setItem("itemExist", "1");
//						if (list.length == 0) {
//							document.getElementById("selectAll").checked = false;
//						}
////						OpenAllpay();
////						OpenTopay();
//					} else {
//						p++
//					}
//
//				}
//			} else {
//				return;
//			}
//		}, "", ["确认", "取消"]);
//	} else {
//		plus.ui.toast("请勾选商品！", {
//			duration: 200,
//			verticalAlign: "top"
//		})
//
//	}
//
//
//
//})
var btnArray = ['确认', '取消'];
mui('#tolistdetail').on('tap', '.swipe-btn', function(event) {
	var elem = this;
	var li = elem.parentNode.parentNode;
	var listUl = document.getElementById("tolistdetail");
	var list2 = listUl.getElementsByClassName("mui-table-view-cell");

	mui.confirm('是否删除所选产品？', '', btnArray, function(e) {
		if (e.index == 0) {
			li.parentNode.removeChild(li);
			for (var p = 0; p < list2.length; p++) {
				var listCheck = list2[p].getElementsByTagName('input')[0];
				listCheck.checked=false;
			}
			if(list2.length<=0){
				CloseTopay();
			}
			document.getElementById("selectAll").checked = false;
			allCategory.innerHTML=0;
			allNumber.innerHTML=0;
		} else {
			setTimeout(function() {
				mui.swipeoutClose(li);
			}, 0);
		}
	});
});


