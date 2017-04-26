




/**
 * milight-mask插件
 */

;(function($,window,document,undefined){

	var pluginName = 'Mask',
		instance;				// 设置一个instance变量，由于单例模式

	function Mask(options){
		this.options = $.extend(true,{},this.constructor.defaults,options || {});
		this.init();			// 初始化函数
	}

	Mask.prototype = {
		constructor : Mask,
		init : function(){
			var self = this;
			self.fadeTime = this.options.fadeTime;
			$(function(){
				// 渲染DOM结构
				self.build();
				// 绑定事件函数
				self._bindEvent();
			});
		},

		build : function(){
			var self = this;
			$(document.body).append($('<div id="milight-mask" class="bgi"></div>'));
		},

		_bindEvent : function(){
			var self = this;

			// 在milight-mask上绑定背景图开关事件
			$('#milight-mask')
			.on('onbgi',function(){
				$(this).addClass('bgi');
			})
			.on('offbgi',function(){
				$(this).removeClass();
			});

			// 在milight-mask上绑定淡入淡出事件
			$('#milight-mask')
			.on('fadeIn',function(){
				$(this).fadeIn(self.fadeTime);
			})
			.on('fadeOut',function(){
				$(this).fadeOut(self.fadeTime);
			});
		}
	};

	Mask.defaults = {
		fadeTime : 400								// 遮罩层淡入淡出时间
	};


	/**
	 * 直接挂载在jQuery对象下的单例插件
	 */
	$[pluginName] = function(options){
		if(!instance) instance = new Mask(options);
		return instance;
	}

})(jQuery,window,document);
















