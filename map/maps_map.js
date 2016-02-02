//var map = new BMap.Map("map");
//	
//	map.centerAndZoom(point,12);
//	// 创建地址解析器实例
//	var myGeo = new BMap.Geocoder();
//	// 将地址解析结果显示在地图上,并调整地图视野
//	myGeo.getPoint("上海市徐汇区桂平路418号2601室", function(point){
//		if (point) {
//			map.centerAndZoom(point, 16);
//			map.addOverlay(new BMap.Marker(point));
//		}else{
//			alert("您选择地址没有解析到结果!");
//		}
//	}, "北京市");