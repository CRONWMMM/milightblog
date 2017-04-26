<?php #请求修改的文章

	header("Content-Type:text/html;charset=utf-8");
	//页面准入常量ACCESS_INFO，没有这个常量，页面无法访问。
    define('ACCESS_INFO',true);

    /**
     * 如果数据是通过GET方式发送过来的
     * 并且存在$_GET['id']，则可以认为是请求修改的文章
     */
    if($_SERVER['REQUEST_METHOD'] == 'GET' && isset($_GET['id'])){
		//引入mysql数据库连接文件 
		require '../includes_php/mysqli_connect.php';

		// 放置数据的数组
		$data = array();

		$q = "SELECT 
					title,content
				FROM 
					articles
		  	   WHERE id='{$_GET['id']}' 
		  	   LIMIT 1";
		$r = @mysqli_query($dbc,$q);
		$num = @mysqli_num_rows($r);
		// 判断是否有数据
		if($num > 0 && $num == 1){
			while($row = mysqli_fetch_array($r,MYSQLI_ASSOC)){
				$data['title'] = $row['title'];
				$data['content'] = $row['content'];
				echo json_encode($data);
			}
		}else{
			echo 'sorry sir~没有找到这篇文章';
		}

		// 关闭数据库连接
		mysqli_close($dbc);
    }		// End of if($_SERVER['REQUEST_METHOD'] == 'GET' && isset($_GET['id'])) IF

 ?>