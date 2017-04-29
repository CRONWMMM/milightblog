




/**
 * milight-prompt提示框插件
 */
;(function($,window,document,undefined){

	var pluginName = 'MLoad',
		instance;				// 设置一个instance变量，由于单例模式

	function MLoad(options){
		this.options   = $.extend(true,{},this.constructor.defaults,options || {});
		this.selectors = this.options.selectors;
		this.$doc      = $(this.selectors.doc);
		this.$view     = $(this.selectors.view);
		this.$scroll    = $(this.selectors.scroll);

		this.url       = this.options.url;
		this.type      = this.options.type;

		this.delay     = this.options.delay;					// 延迟加载时间
		this.canLoad   = true;									// 加载标识符，表示能否执行加载
		this.start     = 0;										// 开始加载的位置
		this.count     = this.options.count;					// 一次性加载条数
		this.datalen   = this.count;							// 服务器返回的数据条数，这里默认是count而不是0是因为方便后面判断
		this.time      = 0;										// 用于存储setTimeout的时间戳
		this.$window   = $(window);								// jQuery封装的window对象
		this.docHeight = 0;										// 网页页面文档总高度
		this.scrollTop = 0;										// 网页滚动高度
		this.winHeight = 0;										// 视口高度
		this.init();											// 运行初始化函数
	}

	MLoad.prototype = {
		constructor : MLoad,
		init : function(){
			var self = this;
			$(function(){
				self.build();
				self._bindEvent();
			});
		},

		build : function(){
			var self = this;
			$(document.body).append($('<div id="loading" class="milight-loading text-center"></div>'));
		},

		_bindEvent : function(){
			var self      = this,
				$window   = this.$window;
			$window.scroll(function(e){
				self._load();
			});
		},

		/**
		 * Load加载主函数
		 * @return {[type]} [description]
		 */
		_load : function(){
			var self      = this,
				delay     = this.delay;
			if(self.time) clearTimeout(self.time);
			self.time = setTimeout(function(){
				// 重新算值
				var dis = self._calculation();
					
				self._judge(
							((dis.scrollTop + dis.winHeight) === dis.docHeight),
							function(){
								// 显示loading图标
								$('#loading').fadeIn('fast');
								// 将目前页面存在的文章数量赋值给start，告诉服务器PHP需要从那条开始加载
								// 这里我假定每次加载两篇文章，就是块级作用域里的count = 2
								self.start = $('.post').length;
							},function(){
								$('#loading').fadeOut('fast');
							});
			},delay);
		},

		/**
		 * 计算docHeight、scrollTop和winHeight
		 * @return {[type]} [description]
		 */
		_calculation : function(){
			var docHeight = this.$doc.height(),
				scrollTop = this.$scroll.scrollTop(),
				winHeight = this.$view.height();
			return {
				scrollTop : scrollTop,
				winHeight : winHeight,
				docHeight : docHeight
			}
		},

		/**
		 * 逻辑判断
		 * @param  {[type]} condition 必选，执行条件
		 * @param  {[type]} func1     必选，条件满足时的执行函数
		 * @param  {[type]} func2     可选，条件不满足时的执行函数
		 * @return {[type]}           [description]
		 */
		_judge : function(condition,func1,func2){
			if(condition){
				func1();
			}else if(func2){
				func2();
			}
		},

		/**
		 * ajax发送函数
		 * @return {[type]} [description]
		 */
		_ajax : function(){
			var self = this;
			$.ajax({
				url  : self.url,
				type : self.type,
				data : {
					start : self.start,
					count : self.count,
					page  : window.page
				},
				success : function(res){
					
				},
				error : function(err){

				}
			});
		}

	};

	MLoad.defaults = {
		selectors : {											// 选择器
			wrapper : '#articles-wrapper',						// 包装层选择器
			loading : '#loading',								// loading加载提示块选择器
			doc    : document,									// 文档对象
			view   : window,									// 视口对象
			scroll : window										// 滚动对象
		},
		count : 2, 												// 一次性加载条数
		delay : 500,											// 延迟加载时间
		url   : './controller_php/load_articles.php',			// Ajax发送到的url
		type  : 'GET',											// Ajax发送方式
	};

	/**
	 * 直接挂载在jQuery对象下的单例插件
	 */
	$[pluginName] = function(options){
		if(!instance) instance = new MLoad(options);
		return instance;
	}

})(jQuery,window,document);