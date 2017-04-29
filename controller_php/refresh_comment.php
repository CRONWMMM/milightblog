<?php #刷新主页文章

	header("Content-Type:text/html;charset=utf-8");
	//页面准入常量ACCESS_INFO，没有这个常量，页面无法访问。
    define('ACCESS_INFO',true);


    if($_SERVER['REQUEST_METHOD'] == 'GET'){
    	//引入mysql数据库连接文件 
		require '../includes_php/mysqli_connect.php';

		$data = array();

		if(isset($_GET['id'])){
			$q = "SELECT 
						id,article_id,name,admin,website,content,DATE_FORMAT(comment_date,'%Y年%c月%e日') AS comment_date
					FROM 
						 comment
			  	   WHERE article_id='{$_GET['id']}' 
			  	ORDER BY comment_date DESC 
			  	   LIMIT 1";
			$r = @mysqli_query($dbc,$q);
			$num = @mysqli_num_rows($r);
			if($num == 1){
 				while($row = mysqli_fetch_array($r,MYSQLI_ASSOC)){
					$data['id'] = $row['id'];
					$data['article_id'] = $row['article_id'];
					$data['name'] = htmlspecialchars($row['name']);
					$data['admin'] = $row['admin'];
					$data['website'] = htmlspecialchars($row['website']);
					$data['content'] = htmlspecialchars($row['content']);
					$data['comment_date'] = $row['comment_date'];
				}		// End of while($row = mysqli_fetch_array($r,MYSQLI_ASSOC)) WHILE

				// 编译发送JSON
				echo json_encode($data);
			}		// End of if($num > 0) IF
		}	// End of if(isset($_GET['page'])) IF

   		// 关闭数据库连接
		mysqli_close($dbc);
		
    }		// End of if($_SERVER['REQUEST_METHOD'] == 'GET') IF


 ?>

