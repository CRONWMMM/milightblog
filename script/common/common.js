




/**
 * common.js------逻辑控制层
 * 面向过程
 */
;(function($,window,document,undefined){
		// 缓存私有变量，节约内存，提升访问速度
		// 这块我把page改成了全局变量，因为Ajax加载文章也需要访问这个page变量
		window.page         = $('#sub-title').text(),			// 子文集名称，这块我考虑到article页面会传递参数切换，所以直接设置了页面上子标题的名字作为page
		market              = '',								// 父文集名称
		$mask               = null,								// 用来存放遮罩层
		$market_title       = $('#market-title'),				// header部分父文集标题
		$sub_title          = $('#sub-title'),					// header部分子文集标题
		$articles_market    = $('#articles-market'),			// 模态框部分父文集标题
		$articles_sub       = $('#articles-sub'),				// 模态框部分子文集标题
		$article_wrapper    = $('#articles-wrapper'),			// 文章包裹层
		$article_title      = $('#article-title'),				// 文章标题（模态框的input）
		$file_input			= null;								// 用来存放input type="file"

	/**
	 * 为milight-accordion绑定点击事件
	 * Ajax实现页面跳转
	 */
	$('#milight-accordion').click(function(e){
		// 预先定义存储遮罩层，这块有个坑
		// 不能在自执行函数开头存储，因为遮罩层是用JS渲染的
		// 立刻赋值的话$mask就是undefined
		if(!$mask) $mask = $('#milight-mask');

		// 如果点击目标没有id直接退出程序
		if(!e.target.id) return;
		switch(e.target.id){
			case 'short-story':
				page = '短篇';
				market = '小说';
				break;
			case 'long-story':
				page = '长篇';
				market = '小说';
				break;
			case 'think':
				page = '感悟';
				market = '杂文';
				break;
			case 'essay':
				page = '随笔';
				market = '杂文';
				break;
			case 'travel':
				page = '纪行';
				market = '杂文';
				break;
			case 'javascript':
				page = 'JavaScript';
				market = '技术栈';
				break;
			case 'nodejs':
				page = 'NodeJS';
				market = '技术栈';
				break;
			case 'frame':
				page = '框架';
				market = '技术栈';
				break;
			case 'lightblog':
				page = '轻博客';
				market = '关于';
				break;
			case 'me':
				page = '博主';
				market = '关于';
				break;
			default :
				page = '随笔';
				market = '杂文';
		}

		// 如果page和market都有值，则判定为点击了有效的导航按钮
		// 进行Ajax切换页面
		if(page && market){
			// 首先开启遮罩层，防止重复点击执行函数导致页面崩溃
			$mask.trigger('fadeIn');

			// 换页后重置datalen
			window.datalen = window.count;
			$('#loading').hide()
					.addClass('milight-loading')
					.text('');

			// Ajax提交换页申请
			$.ajax({
				url  : 'controller_php/change_page.php',
				type : 'GET',
				data : {
					'page' : page
				},
				success : function(res){
					// 改变页面的header标题
					$market_title.text(market);
					$sub_title.text(page);

					//改变模态框标题 
					$articles_market.text(market + ' ');
					$articles_sub.text(page);

					// 刷新文章article页面
					$article_wrapper.html(res);

					// 关闭遮罩层
					$mask.trigger('fadeOut');
				},
				error : function(err){
					// 显示出错信息提示框
					$('#milight-prompt').trigger('changeInfo','哦哟！出错啦~ 错误编号：' + err.status  + ' 错误信息：' + err.statusText)
										.trigger('changeStyle','prompt-error')
										.trigger('show');
				}
			});
		}

	});








	/**
	 * 为submit-article发布按钮绑定一个事件
	 */
	 $('#submit-article').click(function(e){

	 	// 赋值给$file_input  jQuery包裹的对象
	 	$file_input = $('.milight-editor-uploadpic');

	 	var $edbody = $('.editor-body'),					// 用于存储富文本编辑器的Body
			$this   = $(this),								// 用于存储$('#submit-article')发布按钮
			dataform = null;								// 一个对象，包含df对象、以及发送控制的标识

	 	if($this.attr('data-method') === 'new'){			// 点击时判断用户操作类型，情况一：发布文章

	 		dataform = newFormData();
	 		if(!dataform.cansend) return;

			/**
			 * 以上检测全部通过，交由Ajax发送
			 */
			// 打开遮罩层
			if(!$mask) $mask = $('#milight-mask');
			$mask.trigger('fadeIn');
			// 数据发送前按钮禁用
			$this.attr('disabled','disabled');

			// 使用Ajax向服务端发送FormData数据
			// 请求将其添加到数据库
			// 此处处理数据的服务端文件：./controller_php/control_articles.php
			// 注意，涉及到文件上传，一定要将cache、processData和contentType重新设置！
			ajaxSendData({
				url  : './controller_php/control_articles.php',
				type : 'POST',
				data : dataform.df,
				cache: false,
			    processData: false,
			    contentType: false,
			    success : function(res){
			    	// 这块判断要用正则表达式来做。。后面完成
					if(res === '文章发表成功！'){
						// 显示milight成功弹框
						$('#milight-prompt').trigger('changeInfo',res)
											.trigger('changeStyle','prompt-success')
											.trigger('show')
											.trigger('delayHide');
						// 发表成功，用Ajax动态更新主页最新一篇文章
						ajaxSendData({
							url  : './controller_php/refresh.php',
							type : 'GET',
							data : {
									  'page' : $articles_sub.text()
								   },
							success : function(res){
								// 这块有隐患，success只是成功接收到服务器返回回来的数据，并没有检测数据内容
								// 应该向上面一样，检测之后再执行逻辑

								// 判断正在发布文章的页面是否原本一篇文章也没有
								// 如果目前发布的是第一篇文章，就将原来页面上的
								// class="empty"提示信息给删除，再向页面填充文章
								if($('.empty')[0]){
									$('#articles-wrapper').html(res);
								}else{
									$('#articles-wrapper').prepend($(res));
								}
							},
							error : function(err){
								// 显示出错信息提示框
								$('#milight-prompt').trigger('changeInfo','哦哟！更新文章出错啦~ 错误编号：' + err.status  + ' 错误信息：' + err.statusText)
													.trigger('changeStyle','prompt-error')
													.trigger('show');
							}
						});
					}else{
						// 显示milight错误弹框
						$('#milight-prompt').trigger('changeInfo',res)
											.trigger('changeStyle','prompt-warning')
											.trigger('show');
					}

					// 清空富文本编辑器文字
					$edbody.html('请输入文章内容');
					// 清空files input
					$file_input.val('');
					// 清空标题input
					$article_title.val('');
					// 关闭模态框
					$('#myModal .close').trigger('click');
					// 关闭mask遮罩层
					$mask.trigger('fadeOut'); 
					// 打开按钮
					$this.removeAttr('disabled');
			    },
			    error : function(err){
					// 显示出错信息提示框
					$('#milight-prompt').trigger('changeInfo','哦哟！发布文章出错啦~ 错误编号：' + err.status  + ' 错误信息：' + err.statusText)
										.trigger('changeStyle','prompt-error')
										.trigger('show');
					// 关闭mask遮罩层
					$mask.trigger('fadeOut');
					// 打开按钮
					$this.removeAttr('disabled');
			    }
			});
	 	}else if($this.attr('data-method') === 'modify'){					// 点击时判断用户操作类型，情况二：修改文章
	 		var id = parseInt($this.attr('data-id')) || undefined;
	 		dataform = (typeof id === 'number') ? newFormData(id) : newFormData();

	 		if(!dataform.cansend) return;

			// 使用Ajax向服务端发送FormData数据
			// 请求将其添加到数据库
			// 此处处理数据的服务端文件：./controller_php/modify_article.php	
			ajaxSendData({
				url : './controller_php/modify_article.php',
				type: 'POST',
				data : dataform.df,
				cache: false,
			    processData: false,
			    contentType: false,
			    success : function(res){
			    	// 这块判断要用正则表达式来做。。后面完成
					if(res === '文章修改成功！请刷新页面后查看'){
						// 显示milight成功弹框
						$('#milight-prompt').trigger('changeInfo',res)
											.trigger('changeStyle','prompt-success')
											.trigger('show')
											.trigger('delayHide');
					}else{
						// 显示milight错误弹框
						$('#milight-prompt').trigger('changeInfo',res)
											.trigger('changeStyle','prompt-warning')
											.trigger('show');
					}
					// 清空富文本编辑器文字
					$edbody.html('请输入文章内容');
					// 清空files input
					$file_input.val('');
					// 清空标题input
					$article_title.val('');
					// 关闭模态框
					$('#myModal .close').trigger('click');
					// 关闭mask遮罩层
					$mask.trigger('fadeOut'); 
					// 打开按钮
					$this.removeAttr('disabled');
			    },
			    error : function(err){
			    	// 显示出错信息提示框
					$('#milight-prompt').trigger('changeInfo','哦哟！修改文章出错啦~ 错误编号：' + err.status  + ' 错误信息：' + err.statusText)
										.trigger('changeStyle','prompt-error')
										.trigger('show');
					// 关闭mask遮罩层
					$mask.trigger('fadeOut'); 
					// 打开按钮
					$this.removeAttr('disabled');
			    }
			});

			// 还原提交按钮
			$this.text('发布').attr('data-method','new').removeAttr('data-id');
	 	}
 	});




	/**
	 * 发表文章按钮点击时，将发布按钮状态改回
	 */	
	$(document.body).click(function(e){
		var self     = this,
			$edbody  = $('.editor-body'),
			$element = null;
		$file_input = $('.milight-editor-uploadpic');
		$element = ($(e.target).attr('id') === 'write-article') ? $(e.target) : null;
		if($element){
			// 清空富文本编辑器文字
			$edbody.html('请输入文章内容');
			// 清空files input
			$file_input.val('');
			// 清空标题input
			$article_title.val('');
			// 改变模态框发布按钮的value值和data-method
	 		$('#submit-article').text('发布')
	 							.attr('data-method','new')
	 							.removeAttr('data-id');
		}
	});





	/**
	 * 修改按钮点击时，查找需要修改的文章
	 * 并改写发布按钮状态
	 */
	 $(document.body).click(function(e){
	 	var self     = this,
	 		$element = null;

	 	// 将事件委托在document.body上
		// 这里处理的时候我做了一个假设
		// 如果e.target目标元素有指定的class类名，或者他的父元素具有这个指定的类名
		// 那么就认为这个元素为我要处理的元素，在此基础上做处理
		// 这个假设有风险，但目前我找不到更好的替代方法，先这样写
	 	$element = ($(e.target).attr('class') === 'modify-article') ? $(e.target) : 
				   ($(e.target).parent().attr('class') === 'modify-article') ? $(e.target).parent() : null;
	 	
	 	if($element){
	 		// 改变模态框发布按钮的value值和data-method
	 		// 增加一个data-id标识需要修改的文章编号
	 		$('#submit-article').text('修改')
	 							.attr('data-method','modify')
	 							.attr('data-id',$element.attr('data-id'));

	 		// 打开milight-mask遮罩
	 		if(!$mask) $mask = $('#milight-mask');
	 		$mask.trigger('fadeIn');


	 		// 启动Ajax发送
	 		ajaxSendData({
	 			url : './controller_php/get_article.php',
	 			type : 'GET',
	 			data : {
	 				id : $element.attr('data-id')
	 			},
	 			success : function(res){
	 				if(res !== 'sorry sir~没有找到这篇文章'){
						var dataObj = JSON.parse(res);

						// 显示milight成功弹框
						$('#milight-prompt').trigger('changeInfo','sir，找到你要的文章啦~请修改')
											.trigger('changeStyle','prompt-success')
											.trigger('show')
											.trigger('delayHide');

						// 更改title
						$article_title.val(dataObj.title);
						// 更改content
						$('.editor-body').html(dataObj.content);
						// 打开模态框
	 					$('#myModal').modal();
					}else{
						// 显示出错信息提示框
						$('#milight-prompt').trigger('changeInfo',res)
											.trigger('changeStyle','prompt-warning')
											.trigger('show');
					}

					// 关闭遮罩
					$mask.trigger('fadeOut');
	 			},
	 			error : function(err){
	 				// 显示出错信息提示框
					$('#milight-prompt').trigger('changeInfo','哦哟！查找文章出错啦~ 错误编号：' + err.status  + ' 错误信息：' + err.statusText)
										.trigger('changeStyle','prompt-error')
										.trigger('show');
	 			}
	 		});
	 	}
	 });





/**
 * 工具函数
 */


/**
 * 获取url的请求参数
 * @param  {[type]} name [description]
 * @return {[type]}      [description]
 */
function getQueryString(name) { 
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); 
    var r = window.location.search.substr(1).match(reg); 
    if (r != null) return decodeURI(r[2]); 
    return null; 
} 



/**
 * 检测传入字符串是否为空
 * @param  {string} str     需要检测的字符串
 * @param  {string} errinfo 出错后的提示信息
 * @param  {function} func  检测通过后需要运行的函数
 * @return {boolean}        返回布尔值用于控制是否提交
 */
function check_empty(str,errinfo,func){
	// 传入str不为string类型，系统报错
	if(typeof str !== 'string' ) throw new Error('参数str必须为字符串');
	if(str){// 传入str不为空的情况

		// 传入了func并且func为函数，则执行成功函数
		if(func && typeof func === 'function') func();
		return true;
	}else{// 传入str为空的情况

		// 如果存在milight提示弹框的情况
		if($('#milight-prompt')[0]){
			// 显示出错信息提示框
			$('#milight-prompt').trigger('changeInfo',errinfo || '咦，你好像漏填了一项')
								.trigger('changeStyle','prompt-warning')
								.trigger('show')
								.trigger('delayHide');
		}else{
			alert(errinfo);
		}
		return false;
	}
}




/**
 * 创建一个新的FormData对象，并填充数据
 * @return {object} 内含是否可以发送的标识符、以及df对象
 */
function newFormData(id){
		// 实例化一个FormData对象，用于存放数据
		var df      = new FormData(),
			id      = id;									// 用于修改文章时存储需要修改的文章id
			brief   = '',									// 用于存储文章简介
			market  = $.trim($articles_market.text()),		// 用于存储父文集名称
			sub     = $.trim($articles_sub.text()),			// 用于存储子文集名称
			title   = $.trim($article_title.val()),			// 用于存储文章标题

			$edbody = $('.editor-body'),					// 用于存储富文本编辑器的Body

			content = $.trim($edbody.text()),				// 用于存储文章内容
			arr     = [];									// 用于存放布尔值信息，最后提交时判断，全为true才能提交

		// 如果存在id并且是number类型，说明是修改文章
		if(id && (typeof id === 'number')){
			df.append('id',id);						// 向FormData里添加需要修改的文章id
		}

		arr.push(check_empty(market,'父文集名称不能为空',function(){
			df.append('market',market);						// 向FormData里添加父文名称
		}));

		arr.push(check_empty(sub,'自文集名称不能为空',function(){
			df.append('sub',sub);							// 向FormData里添加子文名称
		}));
		
		arr.push(check_empty(title,'文章标题不能为空',function(){
			df.append('title',title);						// 向FormData里添加文章标题
		}));


		// 检测type=file的input里面是否有图片文件
		// 有的话向FormData里添加
		for(var i=0,files=$file_input[0].files; i<files.length; i++){
			df.append('images[]',files[i]);
		}


		// 检测文章内容中是否存在图片
		// 有的话就将文章中所有图片的SRC地址替换为服务器图片地址
		// 
		// 这里我分了两种情况，第一种是存在id也就是修改文章的时候
		// 
		// 第二种个情况，不存在id就是写文章的时候
		// 这块代码比较繁琐，不健壮，以后有机会重写
		if(id && (typeof id === 'number')){
			// 如果是修改文章
			if(files.length === 0 && $('.editor-body img').length > 0){
				// 跳过
				arr.push(true);
			}else if(files.length === $('.editor-body img').length){
				for(i=0; i<files.length; i++){
					// 这块我根据本机地址写的绝对路径，正式上线发布的时候要修改
					$('.editor-body img').eq(i).attr('src',location.protocol + '//' + location.host + '/milightblog/tmp/'+ files[i].name);
				}
				arr.push(true);
			}else{
				// 如果存在milight提示弹框的情况
				if($('#milight-prompt')[0]){
					// 显示出错信息提示框
					$('#milight-prompt').trigger('changeInfo','sir，文章图片和filelists中图片文件数目不一致')
										.trigger('changeStyle','prompt-warning')
										.trigger('show');
				}else{
					alert(errinfo);
				}
				arr.push(false);
			}
		}else{
			// 如果是发布新文章
			// 则需要确认文章图片数和filelists文件数目是否一致，
			// 不一致弹出milight警告弹窗
			if($('.editor-body img').length === files.length){
				for(i=0; i<files.length; i++){
					// 这块我根据本机地址写的绝对路径，正式上线发布的时候要修改
					$('.editor-body img').eq(i).attr('src',location.protocol + '//' + location.host + '/milightblog/tmp/'+ files[i].name);
				}
				arr.push(true);
			}else{
				// 如果存在milight提示弹框的情况
				if($('#milight-prompt')[0]){
					// 显示出错信息提示框
					$('#milight-prompt').trigger('changeInfo','sir，文章图片和filelists中图片文件数目不一致')
										.trigger('changeStyle','prompt-warning')
										.trigger('show');
				}else{
					alert(errinfo);
				}
				arr.push(false);
			}
		}




		arr.push(check_empty(content,'文章内容不能为空',function(){
			// 向FormData里添加文章内容（包含html）
			df.append('content',$edbody.html());
		}));

		

		// 检测上传图片的files input是否存在filelist
		// 存在就将第一张图片的name（包含图片格式，例如：.jpeg）添加到picsrc中
		// 作为封面图片
		// files为之前for循环里设置的变量：files=$file_input[0].files
		if(files.length > 0){
			// 这块我根据本机地址写的绝对路径，正式上线发布的时候要修改
			df.append('picsrc',location.protocol + '//' + location.host + '/milightblog/tmp/'+ files[0].name);
		}

		// 循环遍历文章中P标签的text内容（此处写死了，设置的遍历次数为2次）
		// 将其分别插入新的P标签中
		// 添加到brief简介里，作为文章概要
		if($.trim($edbody.text()) && $('.editor-body p').length){	// 富文本body里面text不为空,且必须存在p标签则执行逻辑
			for(var i=0;i<2;i++){
				// 注意！！这块要写成html()，不能写成text()，jQuery的html()有自动转译HTML实体功能，防止XSS攻击
				brief += '<p>' + $.trim($('.editor-body p').eq(i).html()) + '<p>';
			}
		}
		arr.push(check_empty(brief,'文章概要不能为空',function(){
			df.append('brief',brief);			// 向FormData里添加文章概要
		}));


		// FormData填充完毕后，再次检测，遍历arr数组，确保是否均为true
		for(i=0; i<arr.length; i++){
			if(!arr[i]){
				return {
					cansend : false
				};
			}
		}
		return {
			cansend : true,
			df : df
		};
}




/**
 * ajax发送数据函数
 * @param  {object} obj 包裹着ajax要用参数的对象
 * @return {[type]}     [description]
 */
function ajaxSendData(obj){
	var url   = obj.url   || '',
		type  = obj.type  || 'POST',
		data  = obj.data  || {},
		cache = (obj.cache === false) ? obj.cache : true,
		processData = (obj.processData === false) ? obj.processData : true,
		contentType = (obj.contentType === false) ? obj.contentType : 'application/x-www-form-urlencoded',
		success = obj.success,
		error   = obj.error;
	$.ajax({
		url  : url,
		type : type,
		data : data,
		cache : cache,
		processData : processData,
		contentType : contentType,
		success : function(res){success(res);},
		error : function(err){error(err);}
	});
}



})(jQuery,window,document);
















