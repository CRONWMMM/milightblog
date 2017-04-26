<?php #修改文章
	
	header("Content-Type:text/html;charset=utf-8");
	//页面准入常量ACCESS_INFO，没有这个常量，页面无法访问。
    define('ACCESS_INFO',true);

    /**
     * 如果是POST方式发送过来的数据
     * 并且存在$_POST['id']
     * 则可以判定为添加文章
     */
	if($_SERVER['REQUEST_METHOD'] == 'POST' && $_POST['id']){

		//引入mysql数据库连接文件 
		require '../includes_php/mysqli_connect.php';

		// 放置出错信息的数组
		$errors = array();


		/**
		 * 保存图片
		 */
		// 这个地方的$_SERVER['DOCUMENT_ROOT']要小心，需要放在虚拟机上预测试一下
		// 看看路径是什么，再确定
		// 放在本机上测试是对的路径，暂时先这样写
		$path = $_SERVER['DOCUMENT_ROOT'].'/milightblog/tmp/';

		// 判定是否通过HTTP POST上传
		if(is_uploaded_file($_FILES['images']['tmp_name'][0])){

			foreach($_FILES['images']['tmp_name'] as $k=>$v){
				if(is_uploaded_file($_FILES['images']['tmp_name'][$k])){
					$save = $path.$_FILES['images']['name'][$k];
					if(move_uploaded_file($_FILES['images']['tmp_name'][$k],$save)){
						
					}else{
						$errors[] = '图片上传失败';
					}
				}else{
					$errors[] = '文件未通过正当途径上传...';
				}	// End of if(is_uploaded_file($_FILES['images']['tmp_name'][$k])) IF
			}
		}	// End of if(is_uploaded_file($_FILES['images']['tmp_name'][0])) IF



		/**
		 * 过滤提交过来的数据
		 */
		// 检查market
		if(empty($_POST['market'])){
			$errors[] = '父文集名称不能为空';
		}else{
			$market = mysqli_real_escape_string($dbc,trim($_POST['market']));
		}

		// 检查sub
		if(empty($_POST['sub'])){
			$errors = '子文集名称不能为空';
		}else{
			$sub = mysqli_real_escape_string($dbc,trim($_POST['sub']));
		}

		// 检查title
		if(empty($_POST['title'])){
			$errors[] = '文章标题不能为空';
		}else{
			$title = mysqli_real_escape_string($dbc,trim($_POST['title']));
		}

		// 检查content
		if(empty($_POST['content'])){
			$errors[] = '文章内容不能为空';
		}else{
			$content = mysqli_real_escape_string($dbc,trim($_POST['content']));
		}

		// 检查picsrc
		if(isset($_POST['picsrc'])){
			$picsrc = mysqli_real_escape_string($dbc,trim($_POST['picsrc']));
		}

		// 检查brief
		if(empty($_POST['brief'])){
			$errors[] = '文章概要不能为空';
		}else{
			$brief = mysqli_real_escape_string($dbc,trim($_POST['brief']));
		}
		

		// 如果错误数组为空则正常执行
		if(empty($errors)){

			// 检测picsrc是否存在
			if($picsrc){
				$q = "UPDATE articles SET title='{$title}',
										  content='{$content}',
										  picsrc='{$picsrc}',
										  brief='{$brief}',
										  last_date=NOW() 
									WHERE id='{$_POST['id']}'
									LIMIT 1";
			}else{
				$q = "UPDATE articles SET title='{$title}',
										  content='{$content}',
										  brief='{$brief}',
										  last_date=NOW() 
									WHERE id='{$_POST['id']}'
									LIMIT 1";
			}


			$r = @mysqli_query($dbc,$q);
			if(mysqli_affected_rows($dbc) == 1){
				$success = '文章修改成功！';
				echo $success;
			}else{
				echo '文章修改失败，错误信息：'.mysqli_error($dbc);
			}
			
		}else{
			foreach($errors as $emg){
				echo "$emg";
			}
		}	// End of if(empty($errors)) IF

		// 关闭数据库连接
		mysqli_close($dbc);

	}

?>