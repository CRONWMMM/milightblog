<?php #ajax加载文章

	header("Content-Type:text/html;charset=utf-8");
	//页面准入常量ACCESS_INFO，没有这个常量，页面无法访问。
    define('ACCESS_INFO',true);

    if(isset($_GET['start']) && isset($_GET['count']) && isset($_GET['page'])){

    	//引入mysql数据库连接文件 
		require '../includes_php/mysqli_connect.php';

		// 放置出错信息的数组
		$errors = array();

		// 父数组
		$obj = array();

		// 放置数据的子数组
		$data = array();



		if(is_numeric($_GET['start'])){
			$start = mysqli_real_escape_string($dbc,trim($_GET['start']));
		}else{
			$errors[] = 'start必须为数字';
		}

		if(is_numeric($_GET['count'])){
			$count = mysqli_real_escape_string($dbc,trim($_GET['count']));
		}else{
			$errors[] = 'count必须为数字';
		}

		if(empty($errors)){
			$q = "SELECT 
						a.id,title,brief,picsrc,last_date,love,read_count 
					FROM 
						articles AS a
			  INNER JOIN sub ON a.sub_id=sub.id 
			  	   WHERE sub.name='{$_GET['page']}' 
			  	ORDER BY last_date 
			  	    DESC 
			  	   LIMIT $start,$count";
			$r = @mysqli_query($dbc,$q);
			while($row = mysqli_fetch_array($r,MYSQLI_ASSOC)){
				$data['id']    = $row['id'];
				$data['title'] = $row['title'];
				$data['brief'] = $row['brief'];
				$data['date']  = $row['last_date'];
				$data['love_count']  = $row['love'];
				$data['read_count']  = $row['read_count'];
				// 判断是否存在封面图片
				if($row['picsrc']){
					$data['picsrc'] = $row['picsrc'];
				}

				// 判断是否存在点赞cookie
				if(isset($_COOKIE['like'.$row['id']])){
					$data['like'] = true;
				}else{
					$data['like'] = false;
				}

				// 将文章信息数组填入父数组
				$obj[] = $data;
			}
			// 用JSON编译父数组发送
			echo json_encode($obj);
		}else{
			foreach($errors as $err){
				echo "$err";
			}
		}


		// 关闭数据库连接
		mysqli_close($dbc);
    }
?>
