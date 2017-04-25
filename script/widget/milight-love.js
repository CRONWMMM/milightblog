




/**
 * milight-love 点赞插件
 */
;(function($,window,document,undefined){

	var pluginName = 'ML',
		instance;

	function Love(options){
		this.options = $.extend(true,{},this.constructor.defaults,options || {});
		this.like = this.options.selectors;
		this.url = this.options.url;
		this.AjaxUrl = this.options.AjaxUrl;
		this.cookie_name = this.options.cookie_name;
		this.day = this.options.holdDay;
		this.init();
	}

	Love.prototype = {
		constructor : Love,
		init : function(){
			var self = this;
			$(function(){
				self.prevLoadPic();
				self._bindEvent();
			});
		},

		/**
		 * 预加载点赞图片
		 */
		prevLoadPic : function(){
			this.imgsrc = new Image();
			this.imgsrc.src = this.url;
		},

		/**
		 * 绑定事件处理程序
		 */
		_bindEvent : function(){
			// 设置一个$element，用于存放包裹目标元素的jQuery对象
			var self = this,
				$element = null;

			// 将事件委托在document.body上
			// 这里处理的时候我做了一个假设
			// 如果e.target目标元素有指定的class类名，或者他的父元素具有这个指定的类名
			// 那么就认为这个元素为我要处理的元素，在此基础上做处理
			// 这个假设有风险，但目前我找不到更好的替代方法，先这样写
			$(document.body).click(function(e){
				$element = ($(e.target).attr('class') === self.like) ? $(e.target) : 
						   ($(e.target).parent().attr('class') === self.like) ? $(e.target).parent() : null;

				if($element){
					self._changePic($element);
					self._addCount($element);
					self._sendCookie($element);
					self._Ajax_change_count($element);
					self._off($element);
				}
			});
		},

		/**
		 * 替换图片
		 */
		_changePic : function($element){
			$element.find('img').attr('src',this.imgsrc.src);
			
		},

		/**
		 * 点赞数量累加
		 */
		_addCount : function($element){
			var $span = $element.find('span'),
				text = parseInt($span.text()) + 1;
			$span.text(text);
		},


		/**
		 * 设置cookie
		 */
		 _sendCookie : function($element){
		 	var self        = this,
		 		cookie_id   = $element.attr('data-id'),
		 		cookie_name = self.cookie_name + cookie_id;

		 	// 设置cookie
		 	$.cookie(cookie_name,cookie_id,{expires : self.day});

		 },


		 /**
		  * Ajax更新点赞数据
		  */
		  _Ajax_change_count : function($element){
		  	var self = this,
		  		cookie_id   = $element.attr('data-id');

		  	$.ajax({
		  		url : self.AjaxUrl,
		  		type : 'GET',
		  		data : {
		  			like : cookie_id
		  		},
		  		success : function(res){
		  			// 这块回去还要再写
		  			// 成功使用prompt-success类名
		  			// 失败使用prompt-warning类名
		  			$('#milight-prompt').trigger('changeInfo',res)
		  								.trigger('changeStyle','prompt-success')
		  								.trigger('show')
		  								.trigger('delayHide');
		  		},
		  		error : function(err){
		  			alert(err);
		  		}
		  	});
		  },


		/**
		 * 清除控制类名，阻止多次点赞
		 */
		_off : function($element){
			$element.removeClass(this.like);
		}

	}

	Love.defaults = {
		selectors   : 'like',							// 选择器类名
		url         : './images/icons/like.png',		// 替换图片的url
		AjaxUrl     : './controller_php/set_cookie.php',// Ajax更新数据的url地址
		cookie_name : 'like',							// cookie名称前缀
		holdDay     : 3									// cookie持续时间
	};


	$[pluginName] = function(options){
		if(!instance) instance = new Love(options);
		return instance;
	};


/**
	$.fn[pluginName] = function(options){
		return $(this).each(function(){
			if(!$(this).data(pluginName)){
				$(this).data(pluginName,new Love(this,options));
			}
		});
	}
*/

})(jQuery,window,document);