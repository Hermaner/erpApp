mui.init({});
var tolistdetail, storePage;
mui.plusReady(function() {
	dataDel = document.getElementById("dataDel");
	saveBtn = document.getElementById("saveBtn");
	tolistdetail = document.getElementById("tolistdetail")
	storePage = plus.webview.getWebviewById("choose.html")

	dataDel.addEventListener("tap", function() { //删除列表
		var list = tolistdetail.getElementsByClassName("mui-table-view-cell");
		var p = 0;
		while (p < list.length) {
			var listCheck = list[p].getElementsByTagName('input')[0];
			if (listCheck.checked) {
				tolistdetail.removeChild(list[p]);
			} else {
				p++
			}

		}
	});


	saveBtn.addEventListener("tap", function() { //保存数据
		var list = tolistdetail.getElementsByClassName("mui-table-view-cell");
		var products = {};
		var product = [];
		var count = 0;
		for (var i = 0; i < list.length; i++) {
			var listcheck = list[i].getElementsByTagName("input")[0]
			if (listcheck.checked) {
				count++;
				var barcode = list[i].getAttribute("barcode")
				var stock = list[i].getElementsByTagName('input')[1].value;
				product.push({
					barcode: barcode,
					stock: stock
				});
			}

		}
		if (count == 0) {
			plus.nativeUI.alert("请选择商品！", function() {}, "", "OK");
			return
		}
		products.products = product;
		products = JSON.stringify(products);
		mui.fire(storePage, 'storePage', {
			products: products
		});
		setTimeout(function() {
			mui.openWindow({
				id: "choose.html",
				show: {
					aniShow: "pop-in"
				},
				waiting: {
					autoShow: true
				}
			})

		}, 0)


	});
})

document.getElementById("selectAll").addEventListener("click",function(){
	var listUl = document.getElementById("tolistdetail")
	var list = listUl.getElementsByTagName('input');
	var value = this.checked ?  true:false;
	for (var i = 0; i < list.length; i++) {
		if (list[i].getAttribute("type") == "checkbox") {
			list[i].checked = value
		}
	}
	
})