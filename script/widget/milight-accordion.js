/**
 * 


$(function(){

	var menu = $('#main-con');
		arr = [],											// 创建一个数组用来存放需要需要折叠的模块
		canToggle = true;
		miAccordion = $('#milight-accordion'),
		controllers = $('#milight-accordion > li[data-target]');

	controllers.click(function(){
		
			// var self = this;
			// var target = $(this).attr('data-target');
			// $(target).slideToggle('fast');
		

		
		if(canToggle){
			canToggle = false;
			var self = this,
				 target = $(this).attr('data-target');

			if(arr[0] === target){
				$(arr[0]).slideUp(180,function(){
					arr.pop();
					canToggle = true;
				});
				// 箭头方向改变
				$(self).find('span').css('transform','rotate(0deg)');
			}else{
				$(arr[0]).slideUp(180,function(){
					arr.pop();
				});

				// 箭头方向改变
				$('[data-target=' + arr[0] + ']').find('span').css('transform','rotate(0deg)');


				$(target).slideDown(180,function(){
					arr.push(target);
					canToggle = true;
				});

				// 箭头方向改变
				$(self).find('span').css('transform','rotate(90deg)');
			}	
		}

	});


	menu.click(function(){
		$('#mi-wrapper').slideToggle(180);
	});


	var time = void 0;
	$(window).resize(function(){
		if(time) clearTimeout(time);
		time = setTimeout(function(){
			if(menu.css('display') === 'none'){
				$('#mi-wrapper').show('fast');
			}else{
				$('#mi-wrapper').slideUp('fast');
			}
		},200);
	});


});

 */



;(function($,window,document,undefined){

	var pluginName = 'MA';

	function MA(element,options){
		this.element = element;
		this.options = $.extend(true,{},this.constructor.defaults,options || {});

		// 运行初始化函数
		this.init();
	}

	MA.prototype = {
		constructor : MA,

		init : function(){
			var self     = this,
				mainUl   = self.options.selectors.mainUl,
				subUl    = self.options.selectors.subUl;

			// 指定一个数组用来存放需要折叠的模块
			this.arr = [];

			// 指定一个布尔值用于控制是否可切换
			this.canToggle = true;

			this.speed = this.options.speed;

			/**
			 * 运行事件处理程序
			 */
			this._bindEvent(mainUl);
		},



		/**
		 * _bindEvent 绑定事件处理程序
		 * @param  {[string]} mainUl   主Ul选择器字符串，类似于'#milight-accordion'
		 * @return {[type]}          [description]
		 */
		_bindEvent : function(mainUl){
			var self     = this,
				time     = void 0,								// 设定保存clearTimeout的time变量
				$mainUl  = $(mainUl),							// 作为点击事件委托对象的jQuery对象
				$menu    = $(self.options.selectors.menu),		// 汉堡菜单
				wrapper  = self.options.selectors.wrapper,
				target   = '',
				$target  = null;

			$mainUl.click(function(e){

				// 取消事件冒泡
				e.stopPropagation();

				// 取出点击的li的data-target属性，用于搜索并且控制对应的子ul
				target  = (e.target.nodeName === 'SPAN') ? $(e.target).parent().attr('data-target') : 
						  ($(e.target).attr('data-target') !== undefined) ? $(e.target).attr('data-target') : undefined;
				
				// 保证点击的对象是$包装的带data-target的li的DOM对象
				$target = (e.target.nodeName === 'SPAN') ? $(e.target).parent() : 
						  ($(e.target).attr('data-target') !== undefined) ? $(e.target) : null;		 
				
				// 如果$target存在并且折叠控制器开启，就启动私有方法_listToggle
				if($target && self.canToggle) self._listToggle(target,$target);
			});	



			/**
			 * 汉堡按钮点击事件
			 */
			$menu.click(function(){
				$(wrapper).slideToggle(self.speed); 
			});
		


			/**
			 * 浏览器窗口大小改变事件
			 */
			$(window).resize(function(){
				if(time) clearTimeout(time);
				time = setTimeout(function(){
					if($menu.css('display') === 'none'){
						$(wrapper).show(self.speed);
					}else{
						$(wrapper).slideUp(self.speed);
					}
				},200);
			});
			
		},


		/**
		 * _listToggle 列表折叠方法
		 * @param  {[string]} target  选择器字符串
		 * @param  {[jquery]} $target 用jQuery对象包装的li对象
		 */
		_listToggle : function(target,$target){
			var self   = this,
				target  = target,
				$target = $target,
				arr     = self.arr,
				speed   = self.options.speed;

				// 正在折叠的时候将控制器关闭
				self.canToggle = false;
				if(arr[0] === target){							// 如果重复第二次点击同一个Li
					$(arr[0]).slideUp(speed,function(){			// 就将这个li控制的子ul折叠
						arr.pop();								// 并且将这个target从数组中剔除
						self.canToggle = true;					// 完成后再次开启控制器
					});

					// 同步动画，将箭头方向改变回原位置
					$target.find('span').css('transform','rotate(0deg)');
				}else{
					$(arr[0]).slideUp(speed,function(){			// 将数组中的target对应的子ul折叠起来
						arr.pop();								// 剔除
					});

					// 同步动画，将箭头方向改变回原位置，因为剔除是回调函数，需要在所有动画程序完成后执行，所以此时arr[0]依旧是可见的
					$('[data-target=' + arr[0] + ']').find('span').css('transform','rotate(0deg)');

					// 同步动画，将目前点击的这个target对应的子ul拉下
					// 将其添加至arr里
					// 一套完成后，将折叠控制器开启
					$(target).slideDown(speed,function(){
						arr.push(target);
						self.canToggle = true;
					});
					// 将点击的target对应的箭头转向90°
					$target.find('span').css('transform','rotate(90deg)');
				}
		}

	};


	/**
	 * 插件的默认参数
	 */
	MA.defaults = {
		selectors : {										// 选择器名称
			mainUl  : '#milight-accordion',
			subUl   : '.milight-accordion-sub',
			menu    : '#main-con',
			wrapper : '#mi-wrapper',
			space   : 'article'
		},
		autoFold : true,									// 是否自动折叠，默认为true
		speed    : 150,										// 折叠速度，默认为300ms
	};


	/**
	 * 单例挂载
	 * @param  {[obj]} listObj  手风琴列表结构
	 * @param  {[type]} options [description]
	 * @return {[type]}         [description]
	 */
	$.fn[pluginName] = function(options){
		return this.each(function(){
			if(!$(this).data(pluginName)){
				$(this).data(pluginName,new MA(this,options));
			}
		});
	}

})(jQuery,window,document);





















