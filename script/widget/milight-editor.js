/**
 * 


$(function(){
	var wrap    = $('#milight-editor-wrap'),
		bold    = $("#milight-editor-bold"),
		link    = $("#milight-editor-link"),
		code    = $("#milight-editor-code"),
		getpho  = $("#milight-editor-pic"),
		getPic  = $('#milight-editor input[type=file]'),
		list    = $('#milight-editor-list'),
		hr      = $('#milight-editor-hr');
	// document.execCommand('formatblock',false,'<p>');
	wrap.click(function(){
		document.execCommand('formatblock',false,'<p>');
	});
	bold.click(function(){
		document.execCommand('bold',false,null);
	});
	link.click(function(){
		var linktext = document.getSelection();
		document.execCommand('createlink',false,linktext);
	});
	code.click(function(){
		document.execCommand('formatblock',false,'<pre>');
	});
	list.click(function(){
		document.execCommand('insertorderedlist',false,null);
	});
	hr.click(function(){
		document.execCommand('inserthorizontalrule',false,null);
	});
	getpho.click(function(){
		getPic.trigger('click');
	});
	getPic.change(function(){
		// filearr.push(getPic[]);
		console.log(getPic[0].files);
		if(this.files[0] !== undefined){
			var file;
			if (window.FileReader) {
				for(var i=0;i<this.files.length;i++){
					var reader = new FileReader(); 
					reader.onload = function (e) {
						document.execCommand('insertimage',false,e.target.result);
						   //e.target.result就是最后的路径地址
					};  
					file = this.files[i];
					reader.readAsDataURL(file); //监听文件读取结束后事件
					reader = null;
				}
			   	
			} 
		}  
	});

});

 */



/**
 * 难点：
 * 		1.插件模式如何设计？是挂在jQuery原型上用于jQuery对象实例化？还是绑在window对象上在插件中直接返回实例？
 * 		2.DOM渲染，用JS还是直接HTML？
 * 		3.有哪些参数需要设置
 * 		4.事件委托
 */

 /**
  * [description]
  * @param  {jquery} $--------------jQuery对象
  * @param  {window} window---------window对象
  * @param  {document} document-----document对象
  * @param  {undefined} undefined---undefined基本类型
  * @return {null}------------------null对象
  */
;(function($,window,document,undefined){

	// 挂在jQuery原型上的插件名称
	var pluginName = 'ME';						


	/**
	 * 插件的构造函数
	 * @param {[obj]} element 原生elementDOM对象 用this传入
	 * @param {[obj]} options 传入的初始化参数
	 */
	function ME(element,options){
		this.element = element;
		// 使用$.extend的拷贝方法，实现初始化参数
		// 第一个参数为空对象，是不想污染defaults默认参数对象
		// 第二个参数用this.constructor而不是ME，避免耦合过紧
		this.options = $.extend(true,{},this.constructor.defaults,options || {});

		// 运行初始化函数init;
		this.init();
	}

	ME.prototype = {
		// 将原本的constructor指回构造函数本身
		constructor : ME,

		/**
		 * init初始化函数
		 * @param  {[array]} widget 数组，里面装需要执行的方法名
		 * @return {[type]}        [description]
		 */
		init : function(widget){
			var self      = this,								// 缓存this
				selectors = self.options.selectors;				// 缓存selectors

			self.head  = selectors.head;
			self.body  = selectors.body;
			self.input = selectors.input;
			self.wrap  = selectors.wrap;
			self.bold  = selectors.bold;
			self.link  = selectors.link;
			self.code  = selectors.code;
			self.quote = selectors.quote;
			self.pic   = selectors.pic;
			self.list  = selectors.list;
			self.hr    = selectors.hr;
			self.music = selectors.music;

			// 这里需要等到DOM文档加载完毕再执行
			$(function(){
				// 渲染DOM结构
				self.build();
				// 绑定事件函数
				self._bindEvent();
			});
		},


		/**
		 * build方法为DOM渲染函数
		 * @return {[type]} [description]
		 */
		build : function(){
			var self      = this,								// 缓存this
				element   = this.element,						// 缓存需要插入的elementDOM对象
				editor    = $('<div class="milight-editor"></div>');
				head = $('<div class="row">' + 					// milight-editor头部
							'<div class="col-md-12 editor-header">' + 
								'<input class="milight-editor-uploadpic" type="file" name="images[]" multiple="multiple">' + 
								'<div class="btn-group" role="toolbar" aria-label="...">' + 
									'<button type="button" class="btn btn-default milight-editor-wrap">' + 
										'<span class="glyphicon glyphicon-pencil"></span>' + 
									'</button>' + 
									'<button type="button" class="btn btn-default milight-editor-bold">' + 
										'<span class="glyphicon glyphicon-bold"></span>' + 
									'</button>' + 
									'<button type="button" class="btn btn-default milight-editor-link">' + 
										'<span class="glyphicon glyphicon-link"></span>' + 
									'</button>' + 
									'<button type="button" class="btn btn-default milight-editor-code">' + 
										'<span class="glyphicon glyphicon-edit"></span>' + 
									'</button>' + 
									'<button type="button" class="btn btn-default milight-editor-quote">' + 
										'<span class="glyphicon glyphicon-paperclip"></span>' + 
									'</button>' + 
									'<button type="button" class="btn btn-default milight-editor-pic">' + 
										'<span class="glyphicon glyphicon-picture"></span>' + 
									'</button>' +
									'<button type="button" class="btn btn-default milight-editor-list">' + 
										'<span class="glyphicon glyphicon-list"></span>' + 
									'</button>' + 
									'<button type="button" class="btn btn-default milight-editor-hr">' + 
										'<span class="glyphicon glyphicon-minus"></span>' + 
									'</button>' + 
									'<button type="button" class="btn btn-default milight-editor-music">' + 
										'<span class="glyphicon glyphicon-tag"></span>' + 
									'</button>' + 
								'</div>' + 
							'</div>' + 
						'</div>'),
				body = $('<div class="row">' + 					// milight-editor富文本操作区
							'<div class="col-md-12 editor-body" contenteditable="true">' + 
								self.options.prompt +
							'</div>' + 
						 '</div>');
				// 渲染好的DOM结构插入指定位置
				editor.append(head,body);
				$(element).append(editor);					
		},


		/**
		 * _bindEvent方法为事件委托函数，用于执行富文本编辑器的主要操作逻辑
		 * @return {[type]} [description]
		 */
		_bindEvent : function(){
			var self      = this,
				$head     = ($(self.options.selectors.head)[0] ? $(self.options.selectors.head) : undefined);
			// 判断headDOM结构是否被渲染，被渲染再执行逻辑
			if($head){
				$head.on('click',function(e){
					// 取消事件冒泡
					e.stopPropagation();
					// 获取点击目标,做个简单的判断处理
					var $target = (($(e.target)[0].nodeName === 'SPAN') ? $(e.target).parent() : $(e.target));

					// 目标类型判断
					if($target.is(self.wrap)){								// <p>标签包裹
						self.changeWrap();
					}else if($target.is(self.bold)){							// bold加粗
						self.changeBold();
					}else if($target.is(self.link)){							// link添加链接
						self.addLink();
					}else if($target.is(self.code)){							// code添加代码
						self.addCode();
					}else if($target.is(self.quote)){						// quote添加引用
						self.addQuote();
					}else if($target.is(self.pic)){							// pic添加图片
						self.addPic();
					}else if($target.is(self.list)){							// list添加ol
						self.addList();
					}else if($target.is(self.hr)){							// hr添加分隔线
						self.addHr();
					}else if($target.is(self.music)){						// music添加音乐
						self.clearStyle();
					}
				});
			}
		},


		// 转换p标签
		changeWrap : function(){
			document.execCommand('formatblock',false,'<p>');
		},

		// 加粗
		changeBold : function(){
			document.execCommand('bold',false,null);
		},

		// 添加链接
		addLink : function(){
			var linktext = document.getSelection();
			document.execCommand('createlink',false,linktext);
		},

		// 添加代码块
		addCode : function(){
			document.execCommand('formatblock',false,'<pre>');
		},

		// 添加引用
		addQuote : function(){
			document.execCommand('formatblock',false,'<blockquote>');
		},

		// 添加图片
		addPic : function(){
			var self  = this,
				$input = ($(self.input)[0] ? $(self.input) : undefined);
			if($input){
				// 单击上传图片图标，就意味着发布了input的点击事件
				$input.trigger('click');

				// input[type=file]内容改变事件
				// 注意此处有坑，注册change事件之前需要先off掉change事件
				// 不然会多次执行
				$input.off('change').change(function(){
					// 检测输入框被清空的情况，防止出错
					if($input[0].files.length === 0) return;

					// 检测是否支持window.FileReader方法
					if(!window.FileReader) return;

					// 执行addPicToEditor方法，向文本编辑器中插入图片
					self.addPicToEditor($input[0].files);
				});
			}
		},

		// 添加ol
		addList : function(){
			document.execCommand('insertorderedlist',false,null);
		},

		// 添加分割线
		addHr : function(){
			document.execCommand('inserthorizontalrule',false,null);
		},

		// 清除复制外来文本时候自带的样式
		clearStyle : function(){
			$(this.body).html(document.getSelection().toString());
		},


		/**
		 * addPicToEditor方法，向富文本编辑器中插入图片
		 * @param {[obj]} fileList FileList对象
		 */
		addPicToEditor : function(fileList){
			var self = this;
			for(var i=0,reader=null,file=null;i<fileList.length;i++){
				// 检测是否为图片文件，不符合的return
				if(!/image\/\w+/.test(fileList[i].type)){
					alert('请插入图片文件');
					return ;
				}
				reader = new FileReader();

				// 还是一样，先解绑再注册，避免太多的引用
				$(reader).off('load').on('load',function(e){
					document.execCommand('insertimage',false,e.target.result);

					// 释放内存
					reader = null;
					file = null;
				});

				// 获取file文件对象
				file = fileList[i];

				//监听文件读取结束后事件
				reader.readAsDataURL(file); 
			}
		}
	};


	/**
	 * 插件使用的默认参数设置
	 * @type {Object}
	 */
	ME.defaults = {
		canUse    : true,							// 编辑器是否可用，默认可用
		selectors : {								// 选择器名称
			head : ".editor-header",
			body : ".editor-body",
			input: ".milight-editor-uploadpic",
			wrap : ".milight-editor-wrap",
			bold : ".milight-editor-bold",
			link : ".milight-editor-link",
			code : ".milight-editor-code",
			quote: ".milight-editor-quote",
			pic  : ".milight-editor-pic",
			list : ".milight-editor-list",
			hr   : ".milight-editor-hr",
			music: ".milight-editor-music"
		},
		prompt : '请输入文章内容'					// 编辑器提示文本，默认是空
	};


	/**
	 * 使用单例模式
	 * 注册在jQuery对象的原型上
	 * @param  {[obj]} options 用户自定义参数
	 * @return {[obj]} 返回jQuery对象，实现连缀
	 */
	$.fn[pluginName] = function(options){
		return this.each(function(){
			if(!$.data(this,pluginName)){
				$.data(this,pluginName,new ME(this,options));
			}
		});
	};

})(jQuery,window,document);






















