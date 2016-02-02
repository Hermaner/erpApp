var barcodeData, scanTxt, preval, tt;
var barcodeAr = [];
mui.plusReady(function() {
	barcodeData = plus.storage.getItem("barcodeData") ? JSON.parse(plus.storage.getItem("barcodeData")) : {}
	if (document.getElementById("scanTxt")) {
		scanTxt = document.getElementById("scanTxt")
	}

})

function openIntv() {
	tt = setInterval(function() {
		var val = scanTxt.value;
		console.log(val)
		if (val == preval && val) {
			var valAr = val.split("*");
			readData(0, valAr)
			scanTxt.value = "";
			return
		}
		preval = val;
	}, 1000)
}

function closeIntv() {
	clearInterval(tt)
}

function readData(i, valAr) {
	if (i < valAr.length - 1) {
		scaned(valAr[i])
		i++;
		readData(i, valAr)
	}


}

function scaned(r, p) { //扫描返回数据
	r=r.substring(0,4)
	var tolistdetail = document.getElementById("tolistdetail");
	var tolistli = tolistdetail.getElementsByTagName("li");
	for (var i = 0; i < barcodeAr.length; i++) {
		if (barcodeAr[i] == r) {
			for (var j = 0; j < tolistli.length; j++) {
				if (tolistli[j].getAttribute("barcode") == r) {
					var existVal = parseInt(tolistli[j].getElementsByTagName("input")[1].value);
					existVal += 1
					tolistli[j].getElementsByTagName("input")[1].value = existVal;
					return;
				}
			}
			return;
		}
	}

	if (barcodeData[r]) { //如果缓存中存在此条形码的信息不读接口
		ImportData(barcodeData[r].data);
		barcodeAr.push(r);
		return false;

	}
	var param = systemParam("V5.mobile.item.get");
	param.barcode = r;
	dataSendFn('itemGet', param, function(data) {
		if (!data.isSuccess) {
			var mapmsg = data.map.errorMsg;
			console.log(mapmsg);
			return
		}
		ImportData(data)
		barcodeAr.push(r);
		barcodeData[r] = {
			data: data
		};
		plus.storage.setItem("barcodeData", JSON.stringify(barcodeData));
	}, "get")
}

function ImportData(data) { //导入数据
	//	console.log(data)
	var product = data.product;
	var productNumber = product.productNumber;
	var productName = product.productName;
	var productPic = product.productPic || "../images/cbd.jpg";;
	var skuNumber = product.skuNumber;
	var skuName = product.skuName;
	var price = product.price;
	var barcode = product.barcode;
	if(!productNumber){return}
	var html = '<div class="mui-input-group"><div class="mui-flex-all"><div class="mui-input-row mui-checkbox mui-flex-checkwidth mui-flex-changeinput"><input name="checkbox"  class="changeinput" value="Item 1" type="checkbox"></div><div class="mui-table-flex"><div class="mui-flex-all dd-top" ><img class="itempic" src="' + productPic + '"><div class="mui-table-flex mui-flex-lineheight"><span class="mui-flex-block">' + productName + '</span><span class="mui-flex-block">' + productNumber + ' </span><span class="mui-flex-block">' + skuName + '</span></div><div class="cellpad mui-flex-width"><div class="mui-numbox mui-flex-numbox" data-numbox-min="0"><button class="mui-btn mui-numbox-btn-minus" type="button">-</button><input class="mui-numbox-input" type="number" value="1"><button class="mui-btn mui-numbox-btn-plus" type="button">+</button></div></div></div></div></div></div>'
	var li = document.createElement("li");
	li.className = "mui-table-view-cell";
	li.setAttribute("barcode", barcode)
	li.innerHTML = html;
	tolistdetail.appendChild(li);

	numBtn(); //numer  点击自生成失效，需重新运行
}

function scanTxt(e) {
	var val = e.value;
	scaned(val)
	e.value = ""
}