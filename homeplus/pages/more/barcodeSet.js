var Page = {
	init: function() {
		this.vue = E.vue(this.vueObj), this.plusEvent()
	},
	plusEvent: function() {
		mui.plusReady(function() {
			document.querySelector('.mui-table-view.mui-table-view-radio').addEventListener('selected', function(e) {
				var type = e.detail.el.getAttribute('index')
				E.setStorage('codeType', type)

			});
		})
	},
	vueObj: {
		el: '#vue',
		data: {
			items: ['EAN13', 'EAN8', 'AZTEC', 'DATAMATRIX', 'UPCA', 'UPCE', 'CODABAR', 'CODE39', 'CODE93', 'CODE128', 'ITF', 'MAXICODE', 'PDF417', 'RSS14', 'RSSEXPANDED']
		},
		methods: {

		}
	}
}
Page.init()