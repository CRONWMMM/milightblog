;(function($,window,document,undefined){
	window.count     = 2,									// 一次性加载条数
	window.datalen= window.count;							// 服务器返回的数据条数，这里默认是count而不是0是因为方便后面判断
	var	num       = count,
	    $wrapper  = $('#articles-wrapper'),					// articles部分的包装wrapper
		$loading  = $('#loading'),							// loading加载提示块
		canLoad   = true,									// 加载标识符，表示能否执行加载
		start     = 0,										// 开始加载的位置

		time      = 0,										// 用于存储setTimeout的时间戳
		$window   = $(window),								// jQuery封装的window对象
		docHeight = 0,										// 网页页面文档总高度
		scrollTop = 0,										// 网页滚动高度
		winHeight = 0;										// 视口高度
	$window.on('scroll',function(e){

		// 如果父级的子级少长度少于3个，则判定全部加载完成，退出程序
		if($wrapper.children('section').length < 3){
			$loading.show()
					.removeClass('milight-loading')
					.text('到底啦~');
			return ;
		}					

		if(time) clearTimeout(time);
		time = setTimeout(function(){

			// 重新计算
			docHeight = $(document).height(),
			scrollTop = $window.scrollTop(),
			winHeight = $window.height();

			// 首先判断上面一次服务器返回的datalen条数
			// 如果为0或者小于count的请求数则退出函数
			if(!datalen || datalen<count){
				$loading.show()
						.removeClass('milight-loading')
						.text('到底啦~');
				return ;
			}

			// 逻辑
			if((scrollTop + winHeight) === docHeight){
				if(canLoad){
					// 关闭加载标识符
					canLoad = false;
					// 显示loading图标
					$('#loading').fadeIn('fast');
					// 将目前页面存在的文章数量赋值给start，告诉服务器PHP需要从那条开始加载
					// 这里我假定每次加载两篇文章，就是块级作用域里的count = 2
					start = $('.post').length;

					// ajax发送请求
					$.ajax({
						url : './controller_php/load_articles.php',
						type : 'GET',
						data : {
							start : start,
							count : count,
							page  : window.page
						},
						success : function(res){
							// 这块我需要判断服务器返回的数据，但是没法用typeof 类型判断
							// 因为返回的数据格式都是string
							// 只能用try尝试JSON.parse
							// 未报错说明是正确的JSON数据
							// 否则catch捕获的就是服务器端的错误信息
							try{
								// 将从数据库里收到的JSON数据转换为object
								var dataObj = JSON.parse(res),
									i       = 0,
									pic     = '',
									like    = '',
									DOM     = '';
								datalen = Array.apply(null,dataObj).length;
								for(i; i<datalen; i++){
										pic = (dataObj[i].picsrc) ? ('<p>' +
																		'<a href="./article?id='+ dataObj[i].id +'">' +
																			'<img class="figure" src="' + dataObj[i].picsrc + '" alt="' + dataObj[i].title + '">' +
																		'</a>' +
																	'</p>') :
																	'',
										like = (dataObj[i].like === true) ? ('<li data-id="' + dataObj[i].id + '">' + 
																					'<img src="./images/icons/like.png" alt="like"> (<span>' + dataObj[i].love_count + '</span>)' +
																			   '</li>') :
																			  ('<li class="like" data-id="' + dataObj[i].id + '">' + 
																					'<img src="./images/icons/normal.png" alt="like"> (<span>' + dataObj[i].love_count + '</span>)' +
																			   '</li>'),
										DOM = '<section class="post">' +
												'<header>' +
													'<a class="title" href="./article?id='+ dataObj[i].id +'">' + dataObj[i].title + '</a>' + 
													'<time>' + dataObj[i].date + '</time>' +
													'<ul class="control-article">' +
														'<li class="delete-article" data-id="' + dataObj[i].id + '"><img src="./images/icons/delete.png" alt=""></li>' +
														'<li class="modify-article" data-id="' + dataObj[i].id + '"><img src="./images/icons/modify.png" alt=""></li>' +
													'</ul>' +
												'</header>' +
												'<div class="postbody clearfix">' +
													pic + 
													dataObj[i].brief +
													'<ul class="article-info">' +
														like +
														'<li><img src="./images/icons/read.png" alt="read_count"> (<span>' + dataObj[i].read_count + '</span>)</li>' +
														'<li><a href="./article?id='+ dataObj[i].id +'">阅读更多</a></li>' +
													'</ul>' +
												'</div>' +
											'</section>';
									$wrapper.append(DOM);
								}

								// 累加start的值，为了下次Ajax加载做准备
								start += count;
							}catch(e){// 捕获服务器端错误
								// 显示出错信息提示框
								$('#milight-prompt').trigger('changeInfo',res)
													.trigger('changeStyle','prompt-warning')
													.trigger('show');
							}
							// 开启加载标识符
							canLoad = true;
						},
						error : function(err){
							// 显示出错信息提示框
							$('#milight-prompt').trigger('changeInfo','哦哟！加载文章出错啦~ 错误编号：' + err.status  + ' 错误信息：' + err.statusText)
												.trigger('changeStyle','prompt-error')
												.trigger('show');
							// 开启加载标识符
							canLoad = true;
						}
					});			// End of $.ajax()
				}		// End of if(canLoad)  IF
			}else{
				$('#loading').fadeOut('fast');
			}



		},500);
	});











})(jQuery,window,document);