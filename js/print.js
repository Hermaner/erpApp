var mac,outputStream;
mui.plusReady(function() {
	mac=plus.storage.getItem("printMac")||"00:1F:B7:08:36:90"
	outputStream=setPrint(mac)	
	
})
function setPrint(e){
	var main = plus.android.runtimeMainActivity();
	var BluetoothAdapter = plus.android.importClass("android.bluetooth.BluetoothAdapter");
	var UUID = plus.android.importClass("java.util.UUID");
	var uuid = UUID.fromString("00001101-0000-1000-8000-00805F9B34FB");
	var BAdapter = BluetoothAdapter.getDefaultAdapter();
	BAdapter.cancelDiscovery(); //停止扫描
	var device = BAdapter.getRemoteDevice(e); 
	plus.android.importClass(device);
	var bluetoothSocket = device.createInsecureRfcommSocketToServiceRecord(uuid);
	plus.android.importClass(bluetoothSocket);
	bluetoothSocket.connect(); 
	var outputStream = bluetoothSocket.getOutputStream();
	plus.android.importClass(outputStream);
	return outputStream
}

function print(){
	var printAr = ["店铺名称", "订单号：888888888", "收货人：阿萨德", "收货人电话：1566666666636", "收货地址：上海徐汇区桂平路", "商品A：", "数量8；单价88元；金额：888元", "sku：5435535353453", "商品B：", "数量8；单价88元；金额：888元", "sku：5435535353453", "共计88件，888元", "应付：8888元，已付：888元"]
	if(!mac){
		plus.nativeUI.alert("打印机尚未设置,点击更多进行设置", function() {}, "", "OK");
		return
	}
	
	for (var i = 0; i < printAr.length; i++) {
		var string = printAr[i];
		var bytes = plus.android.invoke(string, 'getBytes', 'gbk');
		outputStream.write(bytes, 0, getByteLen(string));
		outputStream.write(0X0D);
	}
	outputStream.write(0X0D);
	outputStream.write(0X0D);
	outputStream.write(0X0A);
	outputStream.flush();
}
mui(".myfixBtn").on("tap", ".mui-btnz-print", function() { //打印订单操作
		print()
	})

function getByteLen(val) {
	var len = 0;
	for (var i = 0; i < val.length; i++) {
		if (val[i].match(/[^x00-xff]/ig) != null) //全角 
			len += 2;
		else
			len += 1;
	};
	return len;
}