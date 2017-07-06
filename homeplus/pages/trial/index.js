var Page = {
	init: function() {
		this.vue = E.vue(this.vueObj), this.initConfig()
	},
	initConfig: function() {
		var self = this;
		mui.plusReady(function() {
			var ws = plus.webview.currentWebview()

		});
	},
	vueObj: {
		el: '#vue',
		data: {
			channels: [{
				name: '实体店',
				status: false
			}, {
				name: '淘宝、京东等线上平台',
				status: false
			}, {
				name: '微店',
				status: false
			}, {
				name: '自营网店',
				status: false
			}, {
				name: '自营APP',
				status: false
			}],
			mobilePhone: '',
			company: '',
			name: ''
		},
		methods: {
			channelTap: function(c) {
				this.channels[c].status = !this.channels[c].status
			},
			checkTel: function() {
				if(!this.mobilePhone) {
					return
				}
				var telReg = (this.mobilePhone).match(/^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/);
				if(!telReg) {
					E.toast("请输入正确的手机号")
					return
				}
			},
			resetData: function() {
				this.mobilePhone = '',
					this.company = '',
					this.name = '',
					this.channels = [{
						name: '实体店',
						status: false
					}, {
						name: '淘宝、京东等线上平台',
						status: false
					}, {
						name: '微店',
						status: false
					}, {
						name: '自营网店',
						status: false
					}, {
						name: '自营APP',
						status: false
					}]
			},
			save: function() {

				if(!this.name || !this.company || !this.mobilePhone) {
					mui.toast('信息不全')
					return
				}
				var telReg = (this.mobilePhone).match(/^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/);
				if(!telReg) {
					E.toast("请输入正确的手机号")
					return
				}
				var selectChannel = [];
				for(var i = 0; i < this.channels.length; i++) {
					if(this.channels[i].status) {
						selectChannel.push(this.channels[i].name)
					}
				}
				var trialAddData = {
					orgName: this.company,
					linkMan: this.name,
					linkPhone: this.mobilePhone,
					selectChannel: selectChannel.join(',')
				}
				var self = this
				var params = E.systemParam("V5.mobile.hong.trial.add")
				params = mui.extend(params, {
					trialAddData: JSON.stringify(trialAddData)
				})
				E.showLoading()
				E.getData('hongTrialAdd', params, function(data) {
					E.closeLoading()
					console.log(JSON.stringify(data))
					E.closeLoading()
					if(!data.isSuccess) {
						E.alert(data.map.errorMsg)
						return
					}
					E.alert('申请成功', function() {
						mui.back()
						self.resetData()
					})
				});
			}
		}
	}

}
Page.init()