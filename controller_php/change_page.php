<?php #切换页面
	
	header("Content-Type:text/html;charset=utf-8");
	//页面准入常量ACCESS_INFO，没有这个常量，页面无法访问。
    define('ACCESS_INFO',true);


    if($_SERVER['REQUEST_METHOD'] == 'GET'){
	    //引入mysql数据库连接文件 
		require '../includes_php/mysqli_connect.php';

		if(isset($_GET['page'])){
			$q = "SELECT 
						title,brief,picsrc,last_date,love,read_count 
					FROM 
						articles AS a
			  INNER JOIN sub ON a.sub_id=sub.id 
			  	   WHERE sub.name='{$_GET['page']}' 
			  	ORDER BY last_date 
			  	    DESC";
			$r = @mysqli_query($dbc,$q);
			$num = @mysqli_num_rows($r);

			// 判断是否有数据
			if($num > 0){
				while($row = mysqli_fetch_array($r,MYSQLI_ASSOC)){
					if($row['picsrc']){
							echo '<section class="post">
							<header>
								<a class="title" href="#">'.$row['title'].'</a>
								<time>'.$row['last_date'].'</time>
								<ul class="control-article">
									<li class="delete-article"><img src="./images/icons/delete.png" alt=""></li>
									<li class="modify-article"><img src="./images/icons/modify.png" alt=""></li>
								</ul>
							</header>
							<div class="postbody clearfix">
								<p>
									<a href="#">
										<img class="figure" src="'.$row['picsrc'].'" alt="">
									</a>
								</p>
								'.$row['brief'].'
								<ul class="article-info">
									<li class="like"><img src="./images/icons/normal.png" alt=""> (<span>'.$row['love'].'</span>)</li>
									<li><img src="./images/icons/read.png" alt=""> (<span>'.$row['read_count'].'</span>)</li>
									<li><a href="javascript:;">阅读更多</a></li>
								</ul>
							</div>
						</section>';
					}else{
							echo '<section class="post">
							<header>
								<a class="title" href="#">'.$row['title'].'</a>
								<time>'.$row['last_date'].'</time>
								<ul class="control-article">
									<li class="delete-article"><img src="./images/icons/delete.png" alt=""></li>
									<li class="modify-article"><img src="./images/icons/modify.png" alt=""></li>
								</ul>
							</header>
							<div class="postbody clearfix">
								'.$row['brief'].'
								<ul class="article-info">
									<li class="like"><img src="./images/icons/normal.png" alt=""> (<span>'.$row['love'].'</span>)</li>
									<li><img src="./images/icons/read.png" alt=""> (<span>'.$row['read_count'].'</span>)</li>
									<li><a href="javascript:;">阅读更多</a></li>
								</ul>
							</div>
						</section>';
					}  // End of if($row['picsrc']) IF

				} 	// End of while($row = mysqli_fetch_array($r,MYSQLI_ASSOC)) WHILE
			}else{
				echo '<section class="post empty">
						<div class="postbody clearfix">
							<p>这个同学很懒，什么都没有写  O__O</p>
						</div>
					</section>';
			}  // End of if($num) IF
		}	// End of if(isset($_GET['page'])) IF

    }	// End of if($_SERVER['REQUEST_METHOD'] == 'GET') IF
	


 ?>