var Page = {
	init: function() {
		this.vue = E.vue(this.vueObj), this.initConfig()
	},
	initConfig: function() {
		var self = this
		mui.init();
		mui.plusReady(function() {
			
		})
	},
	vueObj: {
		el: '#vue',
		data: {
			mode: "", //退货还是换货
			type: "", //换货方式

			items: []
		},
		methods: {
			changeHtml: function() {
				if(this.mode=1){
					
				}
				
			},
			chargeMethod: function(e) {
				var params = E.systemParam('V5.mobile.platMember.add');
				params = mui.extend(params, {
					amount: this.amount
				})
				E.getData('platMemberAdd', params, function(data) {
					console.log(JSON.stringify(data))
					E.closeLoading()
					if (!data.isSuccess) {
						E.alert(data.map.errorMsg)
						return
					}

				})
			}
		}
	}
}
Page.init()