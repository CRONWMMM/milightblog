<?php 
	header("Content-Type:text/html;charset=utf-8");
	//页面准入常量ACCESS_INFO，没有这个常量，页面无法访问。
    define('ACCESS_INFO',true);

	//引入mysql数据库连接文件 
	require dirname(__FILE__).'/includes_php/mysqli_connect.php';

	// 绝对路径URL
	// echo 'http://'.$_SERVER['HTTP_HOST'].dirname($_SERVER['PHP_SELF']);


	// 用url + 参数方式跳转至本页面的情况
	if(isset($_GET['sub']) && isset($_GET['market'])){
		$q = "SELECT 
					m.market_name,s.name
				FROM 
					market AS m
		  INNER JOIN sub AS s
		          ON m.id=s.market_id 
		  	   WHERE s.name='{$_GET['sub']}' AND m.market_name='{$_GET['market']}'";
		$r = @mysqli_query($dbc,$q);
		$num = @mysqli_num_rows($r);
		if($num === 1){
			while($row = mysqli_fetch_array($r,MYSQLI_ASSOC)){
				$market = $row['market_name'];
				$sub = $row['name'];
			}
			mysqli_free_result($r);
		}else{
			$market = '杂文';
			$sub = '随笔';
		}
	}else{		// 默认设置为'杂文'----'随笔'模块
		$market = '杂文';
		$sub = '随笔';
	}
 ?>
<!DOCTYPE html>
<html lang="zh-cn">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
	<title>milightblog</title>
	<!-- <link rel="stylesheet" href="./bootstrap/css/bootstrap.min.css"> -->
	<link rel="stylesheet" href="css/module/bootstrap.min.css">
	<link rel="stylesheet" href="./css/include/common.css">
	<link rel="stylesheet" href="./css/module/milight-editor.css">
	<link rel="stylesheet" href="./css/module/milight-mask.css">
	<link rel="stylesheet" href="./css/module/milight-prompt.css">
</head>
<body>
	<header>
		<button id="main-con" class="btn btn-default visible-xs" data-target="#milight-accordion">
			menu
		</button>
		<!-- Button trigger modal -->
		<nav id="mi-wrapper">
			<ul id="milight-accordion">
				<li data-target="#milight-accordion-sub1">
					小说
					<span>&gt;</span>
				</li>
				<ul id="milight-accordion-sub1" class="milight-accordion-sub">
					<li id="short-story">短篇</li>
					<li id="long-story">长篇</li>
				</ul>
				<li data-target="#milight-accordion-sub2">
					杂文
					<span>&gt;</span>
				</li>
				<ul id="milight-accordion-sub2" class="milight-accordion-sub">
					<li id="think">感悟</li>
					<li id="essay">随笔</li>
					<li id="travel">纪行</li>
				</ul>
				<li data-target="#milight-accordion-sub3">
					技术栈
					<span>&gt;</span>
				</li>
				<ul id="milight-accordion-sub3" class="milight-accordion-sub">
					<li id="javascript">JavaScript</li>
					<li id="nodejs">NodeJS</li>
					<li id="frame">框架</li>
				</ul>
				<li data-target="#milight-accordion-sub4">
					关于
					<span>&gt;</span>
				</li>
				<ul id="milight-accordion-sub4" class="milight-accordion-sub">
					<li id="lightblog">轻博客</li>
					<li id="me">博主</li>
				</ul>
			</ul>
		</nav>
	</header>
	<article>
		<header>
			<h3 id="market-title"><?php echo $market;?></h3>
			<span id="sub-title"><?php echo $sub;?></span>
			<a href="#" id="write-article" class="pull-right" data-toggle="modal" data-target="#myModal">发布文章</a>
		</header>
		<section id="articles-wrapper">
			<?php 
				// 主页默认显示随笔内容
				$q = "SELECT 
							a.id,title,brief,picsrc,last_date,love,read_count 
						FROM 
							articles AS a
				  INNER JOIN sub ON a.sub_id=sub.id 
				  	   WHERE sub.name='$sub'
				  	ORDER BY last_date 
				  	    DESC 
				  	   LIMIT 0,3";
				$r = @mysqli_query($dbc,$q);
				$num = @mysqli_num_rows($r);

				// 判断是否有有效数据
				// 有则利用数据依次渲染DOM
				// 没有则显示事先渲染好的空页面
				if($num){
					while($row = mysqli_fetch_array($r,MYSQLI_ASSOC)){

				
			 ?>

			<section class="post">
				<header>
					<a class="title" href="./article?id=<?php echo $row['id'];?>"><?php echo $row['title'];?></a>
					<time><?php echo $row['last_date'];?></time>
					<ul class="control-article">
						<li class="delete-article" data-id="<?php echo $row['id'];?>"><img src="./images/icons/delete.png" alt=""></li>
						<li class="modify-article" data-id="<?php echo $row['id'];?>"><img src="./images/icons/modify.png" alt=""></li>
					</ul>
				</header>
				<div class="postbody clearfix">
				<?php
					// 检测封面图片是否存在，存在再设置
					if($row['picsrc']){
				?>
					<p>
						<a href="./article?id=<?php echo $row['id'];?>">
							<img class="figure" src="<?php echo $row['picsrc'];?>" alt="<?php echo $row['title'];?>">
						</a>
					</p>
				<?php
					}
				?>
					<?php echo $row['brief'];?>
					<ul class="article-info">
						<?php 
							// 如果存在这篇文章的点赞cookie
							if(isset($_COOKIE['like'.$row['id']])){
						?>
						<li data-id="<?php echo $row['id'];?>"><img src="./images/icons/like.png" alt="like"> (<span><?php echo $row['love'];?></span>)</li>
						<?php 
							}else{  // 如果不存在这篇文章的点赞cookie
						?>
						<li class="like" data-id="<?php echo $row['id'];?>"><img src="./images/icons/normal.png" alt="like"> (<span><?php echo $row['love'];?></span>)</li>
						<?php
							}
						?>
						<li><img src="./images/icons/read.png" alt="read_count"> (<span><?php echo $row['read_count'];?></span>)</li>
						<li><a href="./article?id=<?php echo $row['id'];?>">阅读更多</a></li>
					</ul>
				</div>
			</section>
			<?php
					}
				}else{
			?>
				<section class="post empty">
					<div class="postbody clearfix">
						<p>这个同学很懒，什么都没有写  O__O</p>
					</div>
				</section>

			<?php 
				}

				// 释放资源
				mysqli_free_result($r);
			?>
			<!-- <section class="post">
				<header>
					<a class="title" href="#">想把我唱给你听</a>
					<time>2017年2月3日</time>
					<ul class="control-article">
						<li class="delete-article"><img src="./images/icons/delete.png" alt=""></li>
						<li class="modify-article"><img src="./images/icons/modify.png" alt=""></li>
					</ul>
				</header>
				<div class="postbody clearfix">
					<p>
						<a href="#">
							<img class="figure" src="./pexels-photo-29569.jpg" alt="">
						</a>
					</p>
					<p>你不应该从这些人那里听到这些东西。对于那些选择在像XOXO这样的会议上说话的人来说，事情已经很顺利：信誉，关注，成功 - 一个人可能想要达到的铜戒指 - 他们得到了。他们是他们，他们是伟大的，所以为什么挂起来？</p>
					<p>经过几次谈话，一个未知的主题开始出现，为这两天所表达的许多故事和想法提供了燃料。经常被暗示，但只有在Christina Xu的演讲中才直接陈述。它像放大的日光一样明亮而灼热：“独立是孤独的”。</p>
					<ul class="article-info">
						<li class="like"><img src="./images/icons/normal.png" alt=""> (<span>244</span>)</li>
						<li><img src="./images/icons/read.png" alt=""> (<span>588</span>)</li>
						<li><a href="javascript:;">阅读更多</a></li>
					</ul>
				</div>
			</section> -->
		</section>
	</article>
	

	<!-- Modal -->
	<div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="articles-market">
	  <div class="modal-dialog" role="document">
	    <div class="modal-content">
	      <div class="modal-header">
	        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
	        <h4 class="modal-title" id="articles-market"><?php echo $market;?></h4>
	        <small id="articles-sub"><?php echo $sub;?></small>
	      </div>
	      <div class="modal-body">
			<div class="input-group">
			  <span class="input-group-addon" id="basic-addon1">标题</span>
			  <input id="article-title" type="text" class="form-control" placeholder="请输入标题" aria-describedby="basic-addon1">
			</div>
	      </div>
	      <div class="modal-footer">
	        <button type="button" class="btn btn-default" data-dismiss="modal">关闭</button>
	        <button id="submit-article" data-method="new" type="button" class="btn btn-primary">发布</button>
	      </div>
	    </div>
	  </div>
	</div>
	

	<!-- milight-mask遮罩层  考虑写成模块插件？ -->
	<!-- <div id="milight-mask"></div> -->

	<!-- milight-alert弹出层 考虑写成模块插件？ -->
	<!-- <div id="milight-prompt" class="milight-prompt prompt-success">
		<span class="prompt_info"></span>
		<span class="prompt_close">&times;</span>
	</div> -->
<div id="loading" class="milight-loading text-center"></div>

	<script src="./script/frame/jquery-2.0.3.min.js"></script>
	<script src="./script/widget/jquery.cookie.js"></script>
	<script src="./script/frame/bootstrap.min.js"></script>


	<script src="./script/widget/milight-accordion.js"></script>
	<script src="./script/widget/milight-editor.js"></script>
	<script src="./script/widget/milight-mask.js"></script>
	<script src="./script/widget/milight-prompt.js"></script>	

	
	<!-- <script src="./script/common/index.js"></script> -->
	<script>
		$(function(){
			$("#mi-wrapper").MA();
			$('#myModal .modal-body').ME();
			$.ML();
			$.Mask();
			$.MP();
			// $.MLoad();
		});
	</script>
	<script src="./script/widget/milight-love.js"></script>
	<script src="./script/common/common.js"></script>
	<script src="./script/common/loading.js"></script>
	<!-- <script src="./script/widget/milight-loading.js"></script> -->
</body>
</html>