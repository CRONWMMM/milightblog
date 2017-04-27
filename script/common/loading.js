;(function($,window,document,undefined){
	var $articles = $('.post'),
		$wrapper  = $('#articles-wrapper'),
		start     = 0,
		count     = 2,
		datalen   = 0,

		time      = 0,
		$window   = $(window),
		docHeight = 0,
		scrollTop = 0,
		winHeight = 0;
	$window.on('scroll',function(e){
		if(time) clearTimeout(time);
		time = setTimeout(function(){

			// 重新计算
			docHeight = $(document).height(),
			scrollTop = $window.scrollTop(),
			winHeight = $window.height();

			// 逻辑
			if((scrollTop + winHeight) === docHeight){

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
						page  : page
					},
					success : function(res){
						// 这块需要做个判断，回来再说
						// 将从数据库里收到的JSON数据转换为object
						var dataObj = JSON.parse(res);
						datalen = Array.apply(null,dataObj).length;
						for(var i=0; i<datalen; i++){
							var pic = (dataObj[i].picsrc) ? ('<p>' +
																'<a href="#">' +
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
											'<a class="title" href="#">' + dataObj[i].title + '</a>' + 
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
												'<li><a href="javascript:;">阅读更多</a></li>' +
											'</ul>' +
										'</div>' +
									'</section>';
							$wrapper.append(DOM);
						}

						// 累加start的值，为了下次Ajax加载做准备
						start += count;
					},
					error : function(err){
						alert(err);
					}
				});

			}else{
				$('#loading').fadeOut('fast');
			}



		},500);
	});











})(jQuery,window,document);