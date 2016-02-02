var tolistdetail;


function scaned(r) { //扫描返回数据
	var param = systemParam('V5.mobile.item.sku.search');
	param.optype = "up";
	param.condition = val || "";
	param.pageSize = 30;
	param.productItemId = ItemId || "";
	dataSendFn('itemSkuSearch', param, function(data) {
		plus.nativeUI.closeWaiting();
		if (!data.isSuccess) {
			pocket = document.getElementsByClassName("mui-pull-bottom-pocket")[0]
			canpush = 0
			var mapmsg = data.map.errorMsg;
			plus.nativeUI.alert(mapmsg, function() {}, "", "OK");
			pocket.style.display = "none"
			return
		}
		var products = data.productSkus;
		ItemId = products[products.length - 1].productItemId
		for (var i = 0; i < products.length; i++) {
			var productItemId = products[i].productItemId;
			var productNumber = products[i].productNumber;
			var productName = products[i].productName;
			var productPic = products[i].productPic || "../images/cbd.jpg";
			var stock = products[i].stock;
			var skuName = products[i].skuName;
			var barcode = products[i].barcode;
			var warnStock = products[i].warnStock || 0;
			var html = '<div class="mui-input-group" ><div class="mui-flex-all"><div class="mui-table-flex"><a class="mui-flex-all dd-top"><img class="itempic" src="' + productPic + '"><div class="mui-table-flex mui-flex-lineheight"><span class="mui-flex-block">' + productName + '</span><span class="mui-flex-block">' + productNumber + ' </span><span class="mui-flex-block">' + skuName + '</span></div><div class="cellpad mui-flex-width mui-flex-lineheight mui-text-right"><span class="mui-flex-block">NO：' + canIndex + '</span><span class="mui-flex-block">本店库存：' + stock + '</span><span class="mui-flex-block">预警库存：' + warnStock + '</span></div></a></div></div></div>'
			var li = document.createElement("li");
			li.className = "mui-table-view-cell mui-media item-liheight";
			li.setAttribute("barcode", barcode)
			li.innerHTML = html;
			goodsList.appendChild(li);
			canIndex++
		}
	}, "get")
}

function scanTxt(e) {
	var val = e.value;
	scaned(val)
	e.value = ""
}