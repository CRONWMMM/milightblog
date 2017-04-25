/**
 * 文集页面跳转
 */


$('#milight-accordion').click(function(e){
	var page = '',
		market = '';
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
	}

	if(e.target.id){

		// milight-mask遮罩开启
		// $('#milight-mask').fadeIn('fast');
		$('#milight-mask').trigger('fadeIn');
		$.ajax({
			url  : 'controller_php/change_page.php',
			type : 'GET',
			data : {
					  'page' : page
				   },
			success : function(res){

				// 改变模态框标题
				// alert($('#articles-market').text().);
				$('#articles-market').text(market + ' ');
				$('#articles-sub').text(page);

				// 改变header标题
				$('#market-title').text(market);
				$('#sub-title').text(page);

				// 重置文章article页面
				$('#articles-wrapper').html(res);

			

				// milight-mask遮罩关闭
				$('#milight-mask').trigger('fadeOut');
			}
		
		});
	}


});







// 发布文章，考虑把它做成一个模块？
$('#submit-article').click(function(e){

	// 实例化一个FormData对象
	var df = new FormData(),
		brief = '',									// 用于存储文章简介
		market = $('#articles-market').text(),		// 用于存储父文集名称
		sub = $('#articles-sub').text();			// 用于存储子文集名称

	df.append('market',market);						// 向FormData里添加父文名称
	df.append('sub',sub);							// 向FormData里添加子文名称
	df.append('title',$('#article-title').val());	// 向FormData里添加文章标题

	// 检测并以此向FormData里添加多图
	for(var i=0;i<$('.milight-editor-uploadpic')[0].files.length;i++){
		df.append('images[]',$('.milight-editor-uploadpic')[0].files[i]);
	}

	// 检测文章内容中是否存在图片
	// 有的话就将文章中所有图片的SRC地址替换为服务器图片地址
	// 没有就跳过此步骤
	if($('.editor-body img').length > 0){
		for(var i=0;i<$('.editor-body img').length;i++){
			$('.editor-body img').eq(i).attr('src','./tmp/'+$('.milight-editor-uploadpic')[0].files[i].name);
		}
	}

	// 向FormData里添加文章内容（包含html）
	df.append('content',$('.editor-body').html());

	// 检测上传图片的files input是否存在filelist
	// 存在就将第一张图片的name（包含图片格式，例如：.jpeg）添加到picsrc中
	// 作为封面图片
	if($('.milight-editor-uploadpic')[0].files.length > 0){
		df.append('picsrc','./tmp/'+$('.milight-editor-uploadpic')[0].files[0].name);
	}
	
	// 循环遍历文章中P标签的text内容（此处写死了，设置的遍历次数为3次）
	// 将其分别插入新的P标签中
	// 添加到brief简介里，作为文章概要
	for(var i=0;i<3;i++){
		brief += '<p>' + $('.editor-body p').eq(i).text() + '<p>';
	}
	df.append('brief',brief);


	// 等待上传时候打开mask遮罩
	$('#milight-mask').trigger('fadeIn');;


	// 以上完毕，使用Ajax向服务端发送FormData数据
	// 请求将其添加到数据库
	// 此处处理数据的服务端文件：./controller_php/control_articles.php
	$.ajax({
		url : './controller_php/control_articles.php',
		type: 'POST',
		data : df,
		cache: false,
	    processData: false,
	    contentType: false,
		success: function(res){

			// 收到返回值后打印服务端响应信息
			$('#milight-prompt').trigger('changeInfo',res);



			// 这块判断要用正则表达式来做。。后面完成
			if(res === '图片上传成功！文章发表成功！' || res === '文章发表成功！'){

				// 显示milight成功弹框
				$('#milight-prompt').trigger('changeStyle','prompt-success')
									.trigger('show')
									.trigger('delayHide');


				// 发表成功，再用Ajax更新主页的最新一篇文章显示
				$.ajax({
					url  : 'controller_php/refresh.php',
					type : 'GET',
					data : {
							  'page' : $('#articles-sub').text()
						   },
					success : function(res){

						// 判断正在发布文章的页面是否原本一篇文章也没有
						// 如果目前发布的是第一篇文章，就将原来页面上的
						// class="empty"提示信息给删除，再向页面填充文章
						if($('.empty')[0]){
							$('#articles-wrapper').html(res);
						}else{
							$('#articles-wrapper').prepend($(res));
						}

					},
					error: function (returndata) {  
			            alert(returndata);  
			        }
				});

			}else{
				// $('#milight-prompt').fadeIn('fast').removeClass().addClass('prompt-error');
				$('#milight-prompt').trigger('changeStyle','prompt-error')
									.trigger('show');
			}


			// 然后清空富文本编辑器文字
			$('.editor-body').html('请输入内容');
			// 清空files input
			$('.milight-editor-uploadpic').val('');
			// 清空标题input
			$('#article-title').val('');
			// 关闭模态框
			$('#myModal .close').trigger('click');
			// 关闭mask遮罩层
			$('#milight-mask').trigger('fadeOut');;

		},

		// 出错也打印错误信息
		error: function (returndata) {  
            alert(returndata);  
        }
	});
});