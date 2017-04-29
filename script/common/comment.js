


;(function($,window,document,undefined){

	// 评论框弹出
	$('.pop-button').click(function(){
		$(this).fadeOut(400);
		$('#comment').fadeIn(400);
	});

	$('.close-comment').click(function(){
		if($(window).width() >= 767){
			$('.pop-button').fadeIn(400);
		}else{
			$('.pop-button').fadeOut(400);
		}
		$('#comment').fadeOut(400);
	});

	$('.comment').click(function(){
		$('#comment').fadeToggle(400);
	});





	// 评论发送
	$('#write-area button').click(function(e){
		var formObj = newFormData();
		if(formObj.cansend){
			$.ajax({
				url : '../controller_php/comment.php',
				type : 'POST',
				data : formObj.df,
				cache : false,
				processData : false,
				contentType : false,
				success : function(res){
					if(res === '评论成功！'){
						// 显示milight成功弹框
						$('#milight-prompt').trigger('changeInfo',res)
											.trigger('changeStyle','prompt-success')
											.trigger('show')
											.trigger('delayHide');
						$.ajax({
							url : '../controller_php/refresh_comment.php',
							type : 'GET',
							data : {
								id : $('#articleID').attr('data-id')
							},
							success : function(res){
								var dataObj = JSON.parse(res),
									face    = (dataObj.admin === '0') ? '<img src="../images/icons/user.png" alt="'+ dataObj.name +'的头像">' : 
																		'<img src="../images/icons/admin.png" alt="'+ dataObj.name +'的头像">',
									name    = (dataObj.website) ? '<h4><a href="http://'+ dataObj.website +'">'+ dataObj.name +'</a></h4>' : 
																  '<h4>'+ dataObj.name +'</h4>',
									date    = '<span>在<time data-time="'+ dataObj.comment_date +'"> '+ dataObj.comment_date +' </time>说：</span>',
									content = '<p>'+ dataObj.content +'</p>',
									section = '<div class="view-area clearfix">' + 
													'<div class="comment-header">' + 
														face + name + date +
													'</div>' + 
													'<div class="comment-content">' + 
														content + 
													'</div>' + 
												  '<ul class="comment-control pull-right">' +
												  		'<li><a href="javascript:;"><img src="../images/icons/delete.png" alt=""> 删除</a></li>' +
												  		'<li><a href="javascript:;" class="message"><img src="../images/icons/message.png" alt=""> 回复</a></li>' + 
												  '</ul>';
											  '</div>' + 
				
								$('#comment-area').prepend($(section));
							},
							error : function(err){
								alert(err);
							}
						});
					}else{
						// 显示milight失败弹框
						$('#milight-prompt').trigger('changeInfo',res)
											.trigger('changeStyle','prompt-error')
											.trigger('show');
					}
				},
				error : function(err){
					alert(err);
				}
			});
		}
	});





/**
 * 创建一个新的FormData对象，并填充数据
 * @return {object} 内含是否可以发送的标识符、以及df对象
 */
function newFormData(){
	// 实例化一个FormData对象，用于存放数据
	var df   = new FormData(),
		arr  = [],

		// 存储准备发送的文章ID
		articleID = $('#articleID').attr('data-id'),
		name = $.trim($('#name').val()),
		website = $.trim($('#website').val()),
		content = $.trim($('#content').val());
	arr.push(check_empty(articleID,'未知的文章id~',function(){
		df.append('articleID',articleID);
	}));

	arr.push(check_empty(name,'您还没填写昵称呢~',function(){
		df.append('name',name);
	}));

	if(website){
		df.append('website',website);
	}

	arr.push(check_empty(content,'您还没填写内容呢~',function(){
		df.append('content',content);
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
			$('#milight-prompt').trigger('changeInfo',errinfo)
								.trigger('changeStyle','prompt-warning')
								.trigger('show')
								.trigger('delayHide');
		}else{
			alert(errinfo);
		}
		return false;
	}
}


})(jQuery,window,document);








