var tolistdetail, dataDel, saveBtn, ScanTxt;
var num=0
var numVal=0;
mui.init({});

mui.plusReady(function() {
	if(plus.storage.getItem("imei")==1){
		document.getElementById("isScan").style.display="block";
	}else{
		document.getElementById("isScan").style.display="none";
	}
	dataDel = document.getElementById("dataDel");
	tolistdetail = document.getElementById("tolistdetail");
	saveBtn = document.getElementById("saveBtn");

	ScanTxt = document.getElementById("ScanTxt");

	Array.prototype.remove = function(val) {
		var index = this.indexOf(val);
		if (index > -1) {
			this.splice(index, 1);
		}
	};
	document.getElementById("scanTxt").focus();
	dataDel.addEventListener("tap", function() { //删除列表
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
				} else {
					return;
				}
			}, "", ["确认", "取消"]);
		} else {
			plus.nativeUI.alert("请勾选商品！", function() {}, "", "OK");
		}



	})
	saveBtn.addEventListener("tap", function() { //保存数据
		var list = tolistdetail.getElementsByClassName("mui-table-view-cell");
		var products = {};
		var product = [];
		var count = 0;
		for (var i = 0; i < list.length; i++) {
			var listcheck = list[i].getElementsByTagName('input')[0];
			if (listcheck.checked) {
				count++
				var barcode = list[i].getAttribute("barcode")
				var stock = list[i].getElementsByTagName('input')[1].value;
				console.log(stock)
				product[i] = {
					barcode: barcode,
					stock: stock
				};
			}

		}
		if (count == 0) {
			plus.nativeUI.alert("请选择商品", function() {}, "", "OK");
			return
		}
		products.products = product
		plus.nativeUI.showWaiting();
		var param = systemParam('V5.mobile.stock.check.confirm');
		param.stockCheckData = JSON.stringify(products);
		param.uniqueCode = uniqueCode();
		console.log(param);
		dataSendFn('stockCheckConfirm', param, function(data) {
			plus.nativeUI.closeWaiting();
			console.log(JSON.stringify(data))
			if (!data.isSuccess) {
				var mapmsg = data.map.errorMsg;
				plus.nativeUI.alert(mapmsg, function() {}, "", "OK");
				console.log(mapmsg)
				return
			}
			var list = tolistdetail.getElementsByClassName("mui-table-view-cell");
			var p = 0;
			while (p < list.length) {
				var listCheck = list[p].getElementsByTagName('input')[0];
				if (listCheck.checked) {
					var listbar=list[p].getAttribute("barcode");
					tolistdetail.removeChild(list[p]);
					allCategory.innerHTML = 0;
					allNumber.innerHTML = 0;
					document.getElementById("selectAll").checked = false;
				} else {
					p++
				}
	
			}
			plus.nativeUI.alert("保存成功！", function() {}, "", "OK");
			allCategory.innerHTML = 0;
			allNumber.innerHTML = 0;
			document.getElementById("selectAll").checked = false;
		})
	});

});

function ScanTxt() {
	var val = e.value;
	//		scaned(val)

	e.value = ""
}
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
