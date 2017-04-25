




/**
 * milight-prompt提示框插件
 */
;(function($,window,document,undefined){
	var pluginName = 'MP',
		instance;				// 设置一个instance变量，由于单例模式


	function MP(options){
		this.options = $.extend(true,{},this.constructor.defaults,options || {});
		var selectors = this.options.selectors,
			styles    = this.options.styles;
		this.prompt  = selectors.prompt;
		this.info    = selectors.info;
		this.close   = selectors.close;

		this.fadeTime = this.options.fadeTime;
		this.holdTime = this.options.holdTime;

		this.base    = styles.base;
		this.success = styles.success;
		this.warning = styles.warning;
		this.error   = styles.error;
		this.init();
	}


	MP.prototype = {
		constructor : MP,
		init : function(){
			var self = this;
			$(function(){
				self.build();
				self._bindEvent();
			});
		},

		build : function(){
			var self = this;
			$(document.body).append($('<div id="milight-prompt" class="prompt-success">' + 
										'<span class="prompt_info"></span>' + 
										'<span class="prompt_close">&times;</span>' + 
									  '</div>'));
		},


		// 这个事件绑定程序存在一个性能问题，
		// 就是实例化了太多重复的jQuery对象，由于时间原因，暂且这么写
		// 以后有机会再优化
		_bindEvent : function(){
			var self    = this,
				delay   = null,										// 用于存放setTimeout
				$prompt = $(self.prompt);							// 将包装着prompt的jquery对象缓存起来，避免重复实例化
			$prompt
			.on('changeStyle',function(e,style){					// 绑定更换样式事件
				$prompt.removeClass().addClass(style);				
			})
			.on('changeInfo',function(e,info){					// 绑定更换提示文本事件
				$(self.info).html(info);
			})
			.click(function(e){									// 绑定click事件
				if(e.target.className === self.close){
					$prompt.trigger('close');
					// 取消设定的延迟消失
					if(delay) clearTimeout(delay);
				}
			})
			.on('close',function(){								// 绑定淡出事件
				$prompt.fadeOut(self.fadeTime);
			})
			.on('show',function(){								// 绑定淡入事件
				$prompt.fadeIn(self.fadeTime);
			})
			.on('delayHide',function(){							// 绑定延迟消失事件
				if(delay) clearTimeout(delay);
				delay = setTimeout(function(){
					$prompt.trigger('close');
				},self.holdTime);
			});
		}
	};


	MP.defaults = {
		selectors : {									// 选择符名称
			prompt : '#milight-prompt',					// prompt弹出框选择符
			info   : '.prompt_info',						// prompt文本提示信息选择符
			close  : 'prompt_close'						// prompt关闭按钮选择符
		},
		styles    : {									// class样式名称
			success : '.prompt-success',				// 成功样式
			warning : '.prompt-warning',				// 警告样式
			error   : '.prompt-error'					// 出错样式
		},
		fadeTime  : 200,								// 淡入淡出时间
		holdTime  : 2000								// 持续显示时间
	};


	/**
	 * 直接挂载在jQuery对象下的单例插件
	 */
	$[pluginName] = function(options){
		if(!instance) instance = new MP(options);
		return instance;
	}

})(jQuery,window,document);







