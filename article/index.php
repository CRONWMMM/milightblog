<?php
	header("Content-Type:text/html;charset=utf-8");
	//页面准入常量ACCESS_INFO，没有这个常量，页面无法访问。
    define('ACCESS_INFO',true);

	//引入mysql数据库连接文件 
	// require dirname(__FILE__).'/includes_php/mysqli_connect.php';
    require '../includes_php/mysqli_connect.php';

    if(isset($_GET['id'])){
    	$q = "SELECT 
					a.id,a.sub_id,s.name,m.market_name,title,content,last_date
				FROM 
					articles AS a 
		  INNER JOIN sub AS s
		  INNER JOIN market AS m
		  		  ON a.sub_id=s.id AND a.market_id=m.id
		  	   WHERE a.id='{$_GET['id']}'
		  	   LIMIT 1";
		$r = @mysqli_query($dbc,$q);
		$num = @mysqli_num_rows($r);


		// 搜索文章信息
		if($num === 1){
			while($row = mysqli_fetch_array($r,MYSQLI_ASSOC)){
				$id      = $row['id'];
				$sub_id  = $row['sub_id'];
				$market  = $row['market_name'];
				$sub     = $row['name'];
				$title   = $row['title'];
				$date    = $row['last_date'];
				$content = $row['content'];
			}
			mysqli_free_result($r);


			// 刷新阅读数
			$q = "UPDATE articles SET read_count=read_count+1 WHERE id='$id'";
			$r = @mysqli_query($dbc,$q);

			// 获取上一篇文章信息
			$q = "SELECT 
						id,title
					FROM 
						articles
			  	   WHERE last_date>'$date' AND sub_id='$sub_id'
			  	ORDER BY last_date
			  	     ASC
			  	   LIMIT 1";
			$r = @mysqli_query($dbc,$q);
			$num = @mysqli_num_rows($r);
			while($row = mysqli_fetch_array($r,MYSQLI_ASSOC)){
				$prev_id    = $row['id'];
				$prev_title = $row['title']; 
			}
			mysqli_free_result($r);

			// 获取下一篇文章信息
			$q = "SELECT 
						id,title
					FROM 
						articles
			  	   WHERE last_date<'$date' AND sub_id='$sub_id'
			  	ORDER BY last_date
			  	     DESC
			  	   LIMIT 1";
			$r = @mysqli_query($dbc,$q);
			$num = @mysqli_num_rows($r);
			while($row = mysqli_fetch_array($r,MYSQLI_ASSOC)){
				$next_id    = $row['id'];
				$next_title = $row['title']; 
			}
			mysqli_free_result($r);

			// 拼装上下文切换导航
			$article_ul = '<ul class="more-articles clearfix">
								<li class="pull-left">
									<h5>上一篇</h5>
									<a href="./?id='.$prev_id.'">'.$prev_title.'</a>
								</li>
								<li class="pull-right">
									<h5>下一篇</h5>
									<a href="./?id='.$next_id.'">'.$next_title.'</a>
								</li>
							</ul>';


			// 获取评论数
			$q = "SELECT 
						id,article_id,name,admin,website,content,DATE_FORMAT(comment_date,'%Y年%c月%e日') AS co_date
					FROM 
						 comment
			  	   WHERE article_id='$id'
			  	   ORDER BY comment_date DESC 
			  	   ";
			$r = @mysqli_query($dbc,$q);
			$comment_num = @mysqli_num_rows($r);

		}else{
			$market = '客官，您要的文章走丢咯';
			$sub    = '未知主题';
		}
    }else{
    	$market = '客官，您要的文章走丢咯';
		$sub    = '未知主题';
    }

?>

<!DOCTYPE html>
<html lang="zh-cn">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
	<title>milightblog</title>
	<link rel="stylesheet" href="../css/module/bootstrap.min.css">
	<link rel="stylesheet" href="../css/include/common.css">
	<link rel="stylesheet" href="../css/include/article.css">
	<link rel="stylesheet" href="../css/module/milight-prompt.css">
</head>
<body>
	<header>
		<button id="main-con" class="btn btn-default visible-xs" data-target="#milight-accordion">
			menu
		</button>
		<nav id="mi-wrapper">
			<ul id="milight-accordion">
				<li data-target="#milight-accordion-sub1">
					小说
					<span>&gt;</span>
				</li>
				<ul id="milight-accordion-sub1" class="milight-accordion-sub">
					<li>短篇</li>
					<li>长篇</li>
				</ul>
				<li data-target="#milight-accordion-sub2">
					杂文
					<span>&gt;</span>
				</li>
				<ul id="milight-accordion-sub2" class="milight-accordion-sub">
					<li>感悟</li>
					<li>随笔</li>
					<li>纪行</li>
				</ul>
				<li data-target="#milight-accordion-sub3">
					技术栈
					<span>&gt;</span>
				</li>
				<ul id="milight-accordion-sub3" class="milight-accordion-sub">
					<li>JavaScript</li>
					<li>NodeJS</li>
					<li>框架</li>
				</ul>
				<li data-target="#milight-accordion-sub4">
					关于
					<span>&gt;</span>
				</li>
				<ul id="milight-accordion-sub4" class="milight-accordion-sub">
					<li>轻博客</li>
					<li>博主</li>
				</ul>
			</ul>
		</nav>
	</header>
	<article>
		<header>
			<h3><?php echo $market;?></h3>
			<span><?php echo $sub;?></span>
		</header>
		<section class="post post-content">
			
			<header>
				<span id="articleID" class="title" data-id="<?php echo $id;?>"><?php echo $title;?></span>
				<time><?php echo $date?></time>
			</header>
			<div class="postbody">
				<?php echo $content;?>
				<?php echo $article_ul;?>
			</div>
		</section>
	</article>
	<span class="pop-button"><img src="../images/icons/message.png" alt=""><span class="badge"><?php echo $comment_num;?></span></span>
	<div id="comment">
		<h3>评论</h3>
		<span class="close-comment"><img src="../images/icons/close.png" alt=""></span>
		<div id="write-area" class="clearfix" data-method="comment" data-replyid="0">
			<input id="name" name="name" type="text" placeholder="昵称">
			<input id="website" name="website" type="text" placeholder="网站">
			<textarea name="content" id="content" placeholder="说两句吧"></textarea>
			<button class="btn btn-primary pull-right">提交</button>
		</div>
		<div id="comment-area">
			<?php 

				while($row = mysqli_fetch_array($r,MYSQLI_ASSOC)){
					$comment_id = $row['id'];
					$article_id = $row['article_id'];
					$name = $row['name'];
					$admin = $row['admin'];
					$website = $row['website'];
					$content = $row['content'];
					$comment_date = $row['co_date'];
			?>
			<div class="view-area clearfix">
				<div class="comment-header">
					<?php 
						if($admin){
							echo '<img src="../images/icons/admin.png" alt="'.$name.'的头像">';
						}else{
							echo '<img src="../images/icons/user.png" alt="'.$name.'的头像">';
						}
					?>
					<?php 
						if($website){
							echo '<h4><a href="http://'.$website.'">'.$name.'</a></h4>';
						}else{
							echo '<h4>'.$name.'</h4>';
						}
					?>
					<span>在<time data-time="'.$comment_date .'"> <?php echo $comment_date;?>  </time>说：</span>
				</div>
				<div class="comment-content">
					<p>
						<?php echo $content;?>
					</p>
				</div>
				<ul class="comment-control pull-right">
					<li><a href="javascript:;"><img src="../images/icons/delete.png" alt=""> 删除</a></li>
					<li><a href="javascript:;" class="message"><img src="../images/icons/message.png" alt=""> 回复</a></li>
				</ul>
			</div>
			<?php 
				}
				mysqli_free_result($r);
			?>
<!-- 			<div class="view-area clearfix">
				<div class="comment-header">
					<img src="../images/icons/user.png" alt="CRONW的头像">
					<h4>赵子龙</h4>
					<span>在<time data-time="2016 年 12 月 17 日 09:33"> 2014年3月21日 </time>说：</span>
				</div>
				<div class="comment-content">
					<p>
					人品第一，作品第二。十分欣赏，也十分欣赏你的开源精神，一般人难以做到。
					</p>
				</div>
				<ul class="comment-control pull-right">
					<li><a href="javascript:;"><img src="../images/icons/delete.png" alt=""> 删除</a></li>
					<li><a href="javascript:;" class="message"><img src="../images/icons/message.png" alt=""> 回复</a></li>
				</ul>
				<div class="reply">
					<div class="reply-area">
						<div class="reply-header">
							<img src="../images/icons/user.png" alt="CRONW的头像">
							<h4>justify</h4>
							<span>在<time data-time="2016 年 12 月 17 日 09:33"> 2014年3月21日 </time>说：</span>
						</div>
						<div class="reply-content">
							<p>说的非常好，赞一个！我很好奇 你那模糊的原理 于是我自己也写了点</p>
						</div>
					</div>
					<div class="reply-area">
						<div class="reply-header">
							<img src="../images/icons/user.png" alt="CRONW的头像">
							<h4>疾风剑豪</h4>
							<span>在<time data-time="2016 年 12 月 17 日 09:33"> 2014年3月21日 </time>说：</span>
						</div>
						<div class="reply-content">
							<p>如果你想要来杀我，最好把你的朋友们也带上。</p>
						</div>
					</div>
					<div class="reply-area">
						<div class="reply-header">
							<img src="../images/icons/admin.png" alt="CRONW的头像">
							<h4>疾风剑豪</h4>
							<span>在<time data-time="2016 年 12 月 17 日 09:33"> 2014年3月21日 </time>说：</span>
						</div>
						<div class="reply-content">
							<p>如果你想要来杀我，最好把你的朋友们也带上。</p>
						</div>
					</div>
				</div>
			</div>
			<div class="view-area clearfix">
				<div class="comment-header">
					<img src="../images/icons/user.png" alt="CRONW的头像">
					<h4>盖伦</h4>
					<span>在<time data-time="2016 年 12 月 17 日 09:33"> 2013年10月8日 </time>说：</span>
				</div>
				<div class="comment-content">
					<p>
					祝好
					</p>
				</div>
				<ul class="comment-control pull-right">
					<li><a href="javascript:;"><img src="../images/icons/delete.png" alt=""> 删除</a></li>
					<li><a href="javascript:;" class="message"><img src="../images/icons/message.png" alt=""> 回复</a></li>
				</ul>
				<div class="reply">
					<div class="reply-area">
						<div class="reply-header">
							<img src="../images/icons/user.png" alt="CRONW的头像">
							<h4>疾风剑豪</h4>
							<span>在<time data-time="2016 年 12 月 17 日 09:33"> 2014年3月21日 </time>说：</span>
						</div>
						<div class="reply-content">
							<p>如果你想要来杀我，最好把你的朋友们也带上。</p>
						</div>
					</div>
					<div class="reply-area">
						<div class="reply-header">
							<img src="../images/icons/user.png" alt="CRONW的头像">
							<h4>疾风剑豪</h4>
							<span>在<time data-time="2016 年 12 月 17 日 09:33"> 2014年3月21日 </time>说：</span>
						</div>
						<div class="reply-content">
							<p>如果你想要来杀我，最好把你的朋友们也带上。</p>
						</div>
					</div>
					<div class="reply-area">
						<div class="reply-header">
							<img src="../images/icons/user.png" alt="CRONW的头像">
							<h4>疾风剑豪</h4>
							<span>在<time data-time="2016 年 12 月 17 日 09:33"> 2014年3月21日 </time>说：</span>
						</div>
						<div class="reply-content">
							<p>如果你想要来杀我，最好把你的朋友们也带上。</p>
						</div>
					</div>
				</div>
			</div> -->
		</div>
	</div>

	<div class="action-nav clearfix">
		<div class="home"><img src="../images/icons/home.png" alt=""></div>
		<div class="share"><img src="../images/icons/share.png" alt=""></div>
		<div class="comment"><img src="../images/icons/message.png" alt=""><span class="badge"><?php echo $comment_num;?></span></div>
	</div>
	<script src="../script/frame/jquery-2.0.3.min.js"></script>
	<script src="../script/frame/bootstrap.min.js"></script>
	<script src="../script/widget/milight-accordion.js"></script>
	<script src="../script/widget/milight-prompt.js"></script>	
	<script src="../script/common/comment.js"></script>
	<script>
		$(function(){
			$("#mi-wrapper").MA();
			$.MP();
		});


		/**
		 * milight-accordion跳转导航
		 */
		$(function(){
			$('.milight-accordion-sub li').click(function(e){
				switch($(e.target).text()){
					case '短篇':
						window.location.href=encodeURI("http://localhost:8080/milightblog?sub=短篇&market=小说");
						break;
					case '长篇':
						window.location.href=encodeURI("http://localhost:8080/milightblog?sub=长篇&market=小说");
						break;
					case '感悟':
						window.location.href=encodeURI("http://localhost:8080/milightblog?sub=感悟&market=杂文");
						break;
					case '随笔':
						window.location.href=encodeURI("http://localhost:8080/milightblog?sub=随笔&market=杂文");
						break;
					case '纪行':
						window.location.href=encodeURI("http://localhost:8080/milightblog?sub=纪行&market=杂文");
						break;
					case 'JavaScript':
						window.location.href=encodeURI("http://localhost:8080/milightblog?sub=JavaScript&market=技术栈");
						break;
					case 'NodeJS':
						window.location.href=encodeURI("http://localhost:8080/milightblog?sub=NodeJS&market=技术栈");
						break;
					case '框架':
						window.location.href=encodeURI("http://localhost:8080/milightblog?sub=框架&market=技术栈");
						break;
					case '轻博客':
						window.location.href=encodeURI("http://localhost:8080/milightblog?sub=轻博客&market=关于");
						break;
					case '博主':
						window.location.href=encodeURI("http://localhost:8080/milightblog?sub=博主&market=关于");
						break;
				}
			});
		});
	</script>
</body>
</html>