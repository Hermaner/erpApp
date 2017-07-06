﻿﻿﻿/**
 *create by 2012-08-25 pm 17:48
 *@author hexinglun@gmail.com
 *BASE64 Encode and Decode By UTF-8 unicode
 *可以和java的BASE64编码和解码互相转化
 */
(function() {
	var BASE64_MAPPING = [
		'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H',
		'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P',
		'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X',
		'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f',
		'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n',
		'o', 'p', 'q', 'r', 's', 't', 'u', 'v',
		'w', 'x', 'y', 'z', '0', '1', '2', '3',
		'4', '5', '6', '7', '8', '9', '+', '/'
	];

	/**
	 *ascii convert to binary
	 */
	var _toBinary = function(ascii) {
		var binary = new Array();
		while (ascii > 0) {
			var b = ascii % 2;
			ascii = Math.floor(ascii / 2);
			binary.push(b);
		}
		/*
		var len = binary.length;
		if(6-len > 0){
			for(var i = 6-len ; i > 0 ; --i){
				binary.push(0);
			}
		}*/
		binary.reverse();
		return binary;
	};

	/**
	 *binary convert to decimal
	 */
	var _toDecimal = function(binary) {
		var dec = 0;
		var p = 0;
		for (var i = binary.length - 1; i >= 0; --i) {
			var b = binary[i];
			if (b == 1) {
				dec += Math.pow(2, p);
			}
			++p;
		}
		return dec;
	};

	/**
	 *unicode convert to utf-8
	 */
	var _toUTF8Binary = function(c, binaryArray) {
		var mustLen = (8 - (c + 1)) + ((c - 1) * 6);
		var fatLen = binaryArray.length;
		var diff = mustLen - fatLen;
		while (--diff >= 0) {
			binaryArray.unshift(0);
		}
		var binary = [];
		var _c = c;
		while (--_c >= 0) {
			binary.push(1);
		}
		binary.push(0);
		var i = 0,
			len = 8 - (c + 1);
		for (; i < len; ++i) {
			binary.push(binaryArray[i]);
		}

		for (var j = 0; j < c - 1; ++j) {
			binary.push(1);
			binary.push(0);
			var sum = 6;
			while (--sum >= 0) {
				binary.push(binaryArray[i++]);
			}
		}
		return binary;
	};

	var __BASE64 = {
		/**
		 *BASE64 Encode
		 */
		encoder: function(str) {
			var base64_Index = [];
			var binaryArray = [];
			for (var i = 0, len = str.length; i < len; ++i) {
				var unicode = str.charCodeAt(i);
				var _tmpBinary = _toBinary(unicode);
				if (unicode < 0x80) {
					var _tmpdiff = 8 - _tmpBinary.length;
					while (--_tmpdiff >= 0) {
						_tmpBinary.unshift(0);
					}
					binaryArray = binaryArray.concat(_tmpBinary);
				} else if (unicode >= 0x80 && unicode <= 0x7FF) {
					binaryArray = binaryArray.concat(_toUTF8Binary(2, _tmpBinary));
				} else if (unicode >= 0x800 && unicode <= 0xFFFF) { //UTF-8 3byte
					binaryArray = binaryArray.concat(_toUTF8Binary(3, _tmpBinary));
				} else if (unicode >= 0x10000 && unicode <= 0x1FFFFF) { //UTF-8 4byte
					binaryArray = binaryArray.concat(_toUTF8Binary(4, _tmpBinary));
				} else if (unicode >= 0x200000 && unicode <= 0x3FFFFFF) { //UTF-8 5byte
					binaryArray = binaryArray.concat(_toUTF8Binary(5, _tmpBinary));
				} else if (unicode >= 4000000 && unicode <= 0x7FFFFFFF) { //UTF-8 6byte
					binaryArray = binaryArray.concat(_toUTF8Binary(6, _tmpBinary));
				}
			}

			var extra_Zero_Count = 0;
			for (var i = 0, len = binaryArray.length; i < len; i += 6) {
				var diff = (i + 6) - len;
				if (diff == 2) {
					extra_Zero_Count = 2;
				} else if (diff == 4) {
					extra_Zero_Count = 4;
				}
				//if(extra_Zero_Count > 0){
				//	len += extra_Zero_Count+1;
				//}
				var _tmpExtra_Zero_Count = extra_Zero_Count;
				while (--_tmpExtra_Zero_Count >= 0) {
					binaryArray.push(0);
				}
				base64_Index.push(_toDecimal(binaryArray.slice(i, i + 6)));
			}

			var base64 = '';
			for (var i = 0, len = base64_Index.length; i < len; ++i) {
				base64 += BASE64_MAPPING[base64_Index[i]];
			}

			for (var i = 0, len = extra_Zero_Count / 2; i < len; ++i) {
				base64 += '=';
			}
			return base64;
		},
		/**
		 *BASE64  Decode for UTF-8
		 */
		decoder: function(_base64Str) {
			var _len = _base64Str.length;
			var extra_Zero_Count = 0;
			/**
			 *计算在进行BASE64编码的时候，补了几个0
			 */
			if (_base64Str.charAt(_len - 1) == '=') {
				//alert(_base64Str.charAt(_len-1));
				//alert(_base64Str.charAt(_len-2));
				if (_base64Str.charAt(_len - 2) == '=') { //两个等号说明补了4个0
					extra_Zero_Count = 4;
					_base64Str = _base64Str.substring(0, _len - 2);
				} else { //一个等号说明补了2个0
					extra_Zero_Count = 2;
					_base64Str = _base64Str.substring(0, _len - 1);
				}
			}

			var binaryArray = [];
			for (var i = 0, len = _base64Str.length; i < len; ++i) {
				var c = _base64Str.charAt(i);
				for (var j = 0, size = BASE64_MAPPING.length; j < size; ++j) {
					if (c == BASE64_MAPPING[j]) {
						var _tmp = _toBinary(j);
						/*不足6位的补0*/
						var _tmpLen = _tmp.length;
						if (6 - _tmpLen > 0) {
							for (var k = 6 - _tmpLen; k > 0; --k) {
								_tmp.unshift(0);
							}
						}
						binaryArray = binaryArray.concat(_tmp);
						break;
					}
				}
			}

			if (extra_Zero_Count > 0) {
				binaryArray = binaryArray.slice(0, binaryArray.length - extra_Zero_Count);
			}

			var unicode = [];
			var unicodeBinary = [];
			for (var i = 0, len = binaryArray.length; i < len;) {
				if (binaryArray[i] == 0) {
					unicode = unicode.concat(_toDecimal(binaryArray.slice(i, i + 8)));
					i += 8;
				} else {
					var sum = 0;
					while (i < len) {
						if (binaryArray[i] == 1) {
							++sum;
						} else {
							break;
						}
						++i;
					}
					unicodeBinary = unicodeBinary.concat(binaryArray.slice(i + 1, i + 8 - sum));
					i += 8 - sum;
					while (sum > 1) {
						unicodeBinary = unicodeBinary.concat(binaryArray.slice(i + 2, i + 8));
						i += 8;
						--sum;
					}
					unicode = unicode.concat(_toDecimal(unicodeBinary));
					unicodeBinary = [];
				}
			}
			return unicode;
		}
	};

	window.BASE64 = __BASE64;
})();
var hexcase = 0;

function hex_md5(a) {
	if (a == "")
		return a;
	return rstr2hex(rstr_md5(str2rstr_utf8(a)))
}

function hex_hmac_md5(a, b) {
	return rstr2hex(rstr_hmac_md5(str2rstr_utf8(a), str2rstr_utf8(b)))
}

function md5_vm_test() {
	return hex_md5("abc").toLowerCase() == "900150983cd24fb0d6963f7d28e17f72"
}

function rstr_md5(a) {
	return binl2rstr(binl_md5(rstr2binl(a), a.length * 8))
}

function rstr_hmac_md5(c, f) {
	var e = rstr2binl(c);
	if (e.length > 16) {
		e = binl_md5(e, c.length * 8)
	}
	var a = Array(16),
		d = Array(16);
	for (var b = 0; b < 16; b++) {
		a[b] = e[b] ^ 909522486;
		d[b] = e[b] ^ 1549556828
	}
	var g = binl_md5(a.concat(rstr2binl(f)), 512 + f.length * 8);
	return binl2rstr(binl_md5(d.concat(g), 512 + 128))
}

function rstr2hex(c) {
	try {
		hexcase
	} catch (g) {
		hexcase = 0
	}
	var f = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
	var b = "";
	var a;
	for (var d = 0; d < c.length; d++) {
		a = c.charCodeAt(d);
		b += f.charAt((a >>> 4) & 15) + f.charAt(a & 15)
	}
	return b
}

function str2rstr_utf8(c) {
	var b = "";
	var d = -1;
	var a, e;
	while (++d < c.length) {
		a = c.charCodeAt(d);
		e = d + 1 < c.length ? c.charCodeAt(d + 1) : 0;
		if (55296 <= a && a <= 56319 && 56320 <= e && e <= 57343) {
			a = 65536 + ((a & 1023) << 10) + (e & 1023);
			d++
		}
		if (a <= 127) {
			b += String.fromCharCode(a)
		} else {
			if (a <= 2047) {
				b += String
					.fromCharCode(192 | ((a >>> 6) & 31), 128 | (a & 63))
			} else {
				if (a <= 65535) {
					b += String.fromCharCode(224 | ((a >>> 12) & 15),
						128 | ((a >>> 6) & 63), 128 | (a & 63))
				} else {
					if (a <= 2097151) {
						b += String.fromCharCode(240 | ((a >>> 18) & 7),
							128 | ((a >>> 12) & 63),
							128 | ((a >>> 6) & 63), 128 | (a & 63))
					}
				}
			}
		}
	}
	return b
}

function rstr2binl(b) {
	var a = Array(b.length >> 2);
	for (var c = 0; c < a.length; c++) {
		a[c] = 0
	}
	for (var c = 0; c < b.length * 8; c += 8) {
		a[c >> 5] |= (b.charCodeAt(c / 8) & 255) << (c % 32)
	}
	return a
}

function binl2rstr(b) {
	var a = "";
	for (var c = 0; c < b.length * 32; c += 8) {
		a += String.fromCharCode((b[c >> 5] >>> (c % 32)) & 255)
	}
	return a
}

function binl_md5(p, k) {
	p[k >> 5] |= 128 << ((k) % 32);
	p[(((k + 64) >>> 9) << 4) + 14] = k;
	var o = 1732584193;
	var n = -271733879;
	var m = -1732584194;
	var l = 271733878;
	for (var g = 0; g < p.length; g += 16) {
		var j = o;
		var h = n;
		var f = m;
		var e = l;
		o = md5_ff(o, n, m, l, p[g + 0], 7, -680876936);
		l = md5_ff(l, o, n, m, p[g + 1], 12, -389564586);
		m = md5_ff(m, l, o, n, p[g + 2], 17, 606105819);
		n = md5_ff(n, m, l, o, p[g + 3], 22, -1044525330);
		o = md5_ff(o, n, m, l, p[g + 4], 7, -176418897);
		l = md5_ff(l, o, n, m, p[g + 5], 12, 1200080426);
		m = md5_ff(m, l, o, n, p[g + 6], 17, -1473231341);
		n = md5_ff(n, m, l, o, p[g + 7], 22, -45705983);
		o = md5_ff(o, n, m, l, p[g + 8], 7, 1770035416);
		l = md5_ff(l, o, n, m, p[g + 9], 12, -1958414417);
		m = md5_ff(m, l, o, n, p[g + 10], 17, -42063);
		n = md5_ff(n, m, l, o, p[g + 11], 22, -1990404162);
		o = md5_ff(o, n, m, l, p[g + 12], 7, 1804603682);
		l = md5_ff(l, o, n, m, p[g + 13], 12, -40341101);
		m = md5_ff(m, l, o, n, p[g + 14], 17, -1502002290);
		n = md5_ff(n, m, l, o, p[g + 15], 22, 1236535329);
		o = md5_gg(o, n, m, l, p[g + 1], 5, -165796510);
		l = md5_gg(l, o, n, m, p[g + 6], 9, -1069501632);
		m = md5_gg(m, l, o, n, p[g + 11], 14, 643717713);
		n = md5_gg(n, m, l, o, p[g + 0], 20, -373897302);
		o = md5_gg(o, n, m, l, p[g + 5], 5, -701558691);
		l = md5_gg(l, o, n, m, p[g + 10], 9, 38016083);
		m = md5_gg(m, l, o, n, p[g + 15], 14, -660478335);
		n = md5_gg(n, m, l, o, p[g + 4], 20, -405537848);
		o = md5_gg(o, n, m, l, p[g + 9], 5, 568446438);
		l = md5_gg(l, o, n, m, p[g + 14], 9, -1019803690);
		m = md5_gg(m, l, o, n, p[g + 3], 14, -187363961);
		n = md5_gg(n, m, l, o, p[g + 8], 20, 1163531501);
		o = md5_gg(o, n, m, l, p[g + 13], 5, -1444681467);
		l = md5_gg(l, o, n, m, p[g + 2], 9, -51403784);
		m = md5_gg(m, l, o, n, p[g + 7], 14, 1735328473);
		n = md5_gg(n, m, l, o, p[g + 12], 20, -1926607734);
		o = md5_hh(o, n, m, l, p[g + 5], 4, -378558);
		l = md5_hh(l, o, n, m, p[g + 8], 11, -2022574463);
		m = md5_hh(m, l, o, n, p[g + 11], 16, 1839030562);
		n = md5_hh(n, m, l, o, p[g + 14], 23, -35309556);
		o = md5_hh(o, n, m, l, p[g + 1], 4, -1530992060);
		l = md5_hh(l, o, n, m, p[g + 4], 11, 1272893353);
		m = md5_hh(m, l, o, n, p[g + 7], 16, -155497632);
		n = md5_hh(n, m, l, o, p[g + 10], 23, -1094730640);
		o = md5_hh(o, n, m, l, p[g + 13], 4, 681279174);
		l = md5_hh(l, o, n, m, p[g + 0], 11, -358537222);
		m = md5_hh(m, l, o, n, p[g + 3], 16, -722521979);
		n = md5_hh(n, m, l, o, p[g + 6], 23, 76029189);
		o = md5_hh(o, n, m, l, p[g + 9], 4, -640364487);
		l = md5_hh(l, o, n, m, p[g + 12], 11, -421815835);
		m = md5_hh(m, l, o, n, p[g + 15], 16, 530742520);
		n = md5_hh(n, m, l, o, p[g + 2], 23, -995338651);
		o = md5_ii(o, n, m, l, p[g + 0], 6, -198630844);
		l = md5_ii(l, o, n, m, p[g + 7], 10, 1126891415);
		m = md5_ii(m, l, o, n, p[g + 14], 15, -1416354905);
		n = md5_ii(n, m, l, o, p[g + 5], 21, -57434055);
		o = md5_ii(o, n, m, l, p[g + 12], 6, 1700485571);
		l = md5_ii(l, o, n, m, p[g + 3], 10, -1894986606);
		m = md5_ii(m, l, o, n, p[g + 10], 15, -1051523);
		n = md5_ii(n, m, l, o, p[g + 1], 21, -2054922799);
		o = md5_ii(o, n, m, l, p[g + 8], 6, 1873313359);
		l = md5_ii(l, o, n, m, p[g + 15], 10, -30611744);
		m = md5_ii(m, l, o, n, p[g + 6], 15, -1560198380);
		n = md5_ii(n, m, l, o, p[g + 13], 21, 1309151649);
		o = md5_ii(o, n, m, l, p[g + 4], 6, -145523070);
		l = md5_ii(l, o, n, m, p[g + 11], 10, -1120210379);
		m = md5_ii(m, l, o, n, p[g + 2], 15, 718787259);
		n = md5_ii(n, m, l, o, p[g + 9], 21, -343485551);
		o = safe_add(o, j);
		n = safe_add(n, h);
		m = safe_add(m, f);
		l = safe_add(l, e)
	}
	return Array(o, n, m, l)
}

function md5_cmn(h, e, d, c, g, f) {
	return safe_add(bit_rol(safe_add(safe_add(e, h), safe_add(c, f)), g), d)
}

function md5_ff(g, f, k, j, e, i, h) {
	return md5_cmn((f & k) | ((~f) & j), g, f, e, i, h)
}

function md5_gg(g, f, k, j, e, i, h) {
	return md5_cmn((f & j) | (k & (~j)), g, f, e, i, h)
}

function md5_hh(g, f, k, j, e, i, h) {
	return md5_cmn(f ^ k ^ j, g, f, e, i, h)
}

function md5_ii(g, f, k, j, e, i, h) {
	return md5_cmn(k ^ (f | (~j)), g, f, e, i, h)
}

function safe_add(a, d) {
	var c = (a & 65535) + (d & 65535);
	var b = (a >> 16) + (d >> 16) + (c >> 16);
	return (b << 16) | (c & 65535)
}

function bit_rol(a, b) {
	return (a << b) | (a >>> (32 - b))
};


function paramFn(e) {
	var param = { 
		nick: 'V5mobile',
		name: 'V5mobile',
//		nick: '欧少辉',
//		name: '欧少辉',
		format: 'json',
		timestamp: parseInt((new Date()).getTime() / 1000).toString(),
		method: e,
	}
	var sign = hex_md5(BASE64.encoder(param.nick) + BASE64.encoder(param.method) + BASE64.encoder(param.timestamp) + BASE64.encoder(param.name) + BASE64.encoder(param.format));
	param.sign = sign;
	return param;
}

function systemParam(e) {
	var param = paramFn(e);
	param.orgCode = plus.storage.getItem("orgCode");
	param.store = plus.storage.getItem("store");
	param.op = plus.storage.getItem("op");
	return param;
}

function uniqueCode() { //唯一码由自定义唯一数和时间戳组成
	return hex_md5(BASE64.encoder(plus.storage.getItem("op")) + BASE64.encoder(parseInt((new Date()).getTime() / 1000).toString()));
}

function messageAdd(e) { //消息新增接口
	var param = systemParam("V5.mobile.message.add");
	param.message = e;
	param.uniqueCode = uniqueCode();
	dataSendFn('shopSearch', param, function(data) {
		console.log("消息新增接口")

	})
}

function dataSendFn(obj, data, callback, type,error,timeout) {
	type = type ? type : "post";
	//	url = '../json/' + obj;
//			url = 'http://192.168.50.216:8089/openApi/dyncHongware/mobile/' + obj;
//		url = 'http://192.168.50.215:8089/openApi/dyncHongware/mobile/' + obj;
//		url = 'http://jira.hongware.cn:8084/openApi/dyncHongware/mobile/' + obj;
//		url = 'http://swapi.sandbox.hongware.com/openApi/dyncHongware/mobile/' + obj;
	url = 'http://swapi.hongware.com/openApi/dyncHongware/mobile/' + obj;

	mui.ajax(url, {
		data: data,
		dataType: 'application/json', //服务器返回json格式数据    
		type: type, //HTTP请求类型
		timeout:timeout||10000,
		success: function(data) {
			data = JSON.parse(data)
			console.log(data)
			callback(data);
		},
		error: function(data) {
			//异常处理；
			plus.nativeUI.alert("网络异常", function() {}, "", "OK");
			plus.nativeUI.closeWaiting()
			error&&error
			console.log(data);
		}
	});
}