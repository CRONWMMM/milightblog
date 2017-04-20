<!DOCTYPE html>
<html lang="zh-cn">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
	<title>milightblog</title>
	<link rel="stylesheet" href="./css/module/bootstrap.min.css">
	<link rel="stylesheet" href="./css/include/common.css">
	<link rel="stylesheet" href="./css/include/index.css">
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
					<li>中篇</li>
					<li>连载</li>
				</ul>
				<li data-target="#milight-accordion-sub2">
					杂文
					<span>&gt;</span>
				</li>
				<ul id="milight-accordion-sub2" class="milight-accordion-sub">
					<li>JavaScript</li>
					<li>NodeJS</li>
					<li>AngularJS</li>
				</ul>
				<li data-target="#milight-accordion-sub3">
					技术栈
					<span>&gt;</span>
				</li>
				<ul id="milight-accordion-sub3" class="milight-accordion-sub">
					<li>JavaScript</li>
					<li>NodeJS</li>
					<li>AngularJS</li>
				</ul>
				<li>
					关于
				</li>
			</ul>
		</nav>
	</header>
	<article>
		<header>
			<h3><a href="#">杂文</a></h3>
			<span>神说要有光，于是便有了光</span>
		</header>
		<section class="post">
			<header>
				<a class="title" href="#">塔尔科夫斯基的火焰</a>
				<time>2017年4月18日</time>
			</header>
			<div class="postbody">
				<p>
					<a href="#">
						<img class="figure" src="./pexels-photo-250164.jpeg" alt="">
					</a>
				<p>当世界是勇敢，快速，愚蠢的时候，我们必须寻求什么是安静，缓慢和聪明地支配自己，反对世界的疯狂。在过去几个星期，我一直受到俄罗斯电影导演安德烈·塔尔科夫斯基（Andrei Tarkovsky）的影片的影响。</p>
				<p>美国的功能障碍现在与其与俄罗斯的对抗关系相争应，而且我也安慰那些对塔尔科夫斯基也不太在意的俄罗斯大国。他们发现他的灵性，模糊性和高贵度都是危险的，所以他们禁止并拖延了他所有的电影。但是，我喜欢灵性，歧义和夸张，所以我当然也喜欢塔尔科夫斯基。他的国家的一切发现危险他的工作，我认为必不可少。</p>
				<ul class="actions text-right">
					<li class="heart">
						128
						<i></i>
					</li>
					<li>2</li>
					<li><a href="#">阅读更多</a></li>
				</ul>
			</div>
		</section>
		<section class="post">
			<header>
				<a class="title" href="#">想把我唱给你听</a>
				<time>2017年2月3日</time>
			</header>
			<div class="postbody">
				<p>
					<a href="#">
						<img class="figure" src="./pexels-photo-29569.jpg" alt="">
					</a>
				</p>
				<p>你不应该从这些人那里听到这些东西。对于那些选择在像XOXO这样的会议上说话的人来说，事情已经很顺利：信誉，关注，成功 - 一个人可能想要达到的铜戒指 - 他们得到了。他们是他们，他们是伟大的，所以为什么挂起来？</p>
				<p>经过几次谈话，一个未知的主题开始出现，为这两天所表达的许多故事和想法提供了燃料。经常被暗示，但只有在Christina Xu的演讲中才直接陈述。它像放大的日光一样明亮而灼热：“独立是孤独的”。</p>
				<p class="text-right"><a href="#">阅读更多</a></p>
			</div>
		</section>
	</article>
	<script src="./script/frame/jquery-2.0.3.min.js"></script>
	<script src="./script/frame/bootstrap.min.js"></script>
	<script src="./script/widget/milight-accordion.js"></script>
	<script>
		$(function(){
			$("#mi-wrapper").MA();
		});
	</script>
</body>
</html>