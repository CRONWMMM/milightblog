<?php #切换页面
	
	header("Content-Type:text/html;charset=utf-8");
	//页面准入常量ACCESS_INFO，没有这个常量，页面无法访问。
    define('ACCESS_INFO',true);


    if($_SERVER['REQUEST_METHOD'] == 'GET'){
	    //引入mysql数据库连接文件 
		require '../includes_php/mysqli_connect.php';

		if(isset($_GET['page'])){
			$q = "SELECT 
						a.id,title,brief,picsrc,last_date,love,read_count 
					FROM 
						articles AS a
			  INNER JOIN sub ON a.sub_id=sub.id 
			  	   WHERE sub.name='{$_GET['page']}' 
			  	ORDER BY last_date 
			  	    DESC 
			  	   LIMIT 0,3";
			$r = @mysqli_query($dbc,$q);
			$num = @mysqli_num_rows($r);
			// 判断是否有数据
			if($num > 0){
				while($row = mysqli_fetch_array($r,MYSQLI_ASSOC)){

					// 检测点赞COOKIE
					// 根据是否点赞来构建DOM
					if(isset($_COOKIE['like'.$row['id']])){
						$li = '<li data-id="'.$row['id'].'"><img src="./images/icons/like.png" alt="like"> (<span>'.$row['love'].'</span>)</li>';
					}else{
						$li = '<li class="like" data-id="'.$row['id'].'"><img src="./images/icons/normal.png" alt="like"> (<span>'.$row['love'].'</span>)</li>';
					}


					// 检测是否存在picsrc封面图片
					if($row['picsrc']){
						$img = '<p>
									<a href="#">
										<img class="figure" src="'.$row['picsrc'].'" alt="">
									</a>
								</p>';
					}else{
						$img = '';
					}

					echo '<section class="post">
							<header>
								<a class="title" href="#">'.$row['title'].'</a>
								<time>'.$row['last_date'].'</time>
								<ul class="control-article">
									<li class="delete-article" data-id="'.$row['id'].'"><img src="./images/icons/delete.png" alt=""></li>
									<li class="modify-article" data-id="'.$row['id'].'"><img src="./images/icons/modify.png" alt=""></li>
								</ul>
							</header>
							<div class="postbody clearfix">
								'.$img.$row['brief'].'
								<ul class="article-info">
									'.$li.'
									<li><img src="./images/icons/read.png" alt=""> (<span>'.$row['read_count'].'</span>)</li>
									<li><a href="javascript:;">阅读更多</a></li>
								</ul>
							</div>
						</section>';

				} 	// End of while($row = mysqli_fetch_array($r,MYSQLI_ASSOC)) WHILE
			}else{
				echo '<section class="post empty">
						<div class="postbody clearfix">
							<p>这个同学很懒，什么都没有写  O__O</p>
						</div>
					</section>';
			}  // End of if($num) IF
		}	// End of if(isset($_GET['page'])) IF

		// 关闭数据库连接
		mysqli_close($dbc);
		
    }	// End of if($_SERVER['REQUEST_METHOD'] == 'GET') IF
	


 ?>