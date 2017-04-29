<?php 

	header("Content-Type:text/html;charset=utf-8");
	//页面准入常量ACCESS_INFO，没有这个常量，页面无法访问。
    define('ACCESS_INFO',true);

    if($_SERVER['REQUEST_METHOD'] == 'POST'){
    	//引入mysql数据库连接文件 
		require '../includes_php/mysqli_connect.php';

		$errors = array();

		if(isset($_POST['articleID'])){

			$id = mysqli_real_escape_string($dbc,trim($_POST['articleID']));

			// 检查name
			if(empty($_POST['name'])){
				$errors[] = '您忘了填写昵称';
			}else{
				$name = mysqli_real_escape_string($dbc,trim($_POST['name']));
			}

			// 存储网站
			$website = mysqli_real_escape_string($dbc,trim($_POST['website']));

			// 检查content
			if(empty($_POST['content'])){
				$errors[] = '您忘了填写内容';
			}else{
				$content = mysqli_real_escape_string($dbc,trim($_POST['content']));
			}

			if(empty($errors)){

				$q = "INSERT INTO comment (
											article_id,
											name,
											website,
											content,
											comment_date
										) VALUES (
											'$id',
											'$name',
											'$website',
											'$content',
											NOW()
										)";
				$r = @mysqli_query($dbc,$q);
				if($r){
					echo '评论成功！';
				}else{
					echo '评论失败，错误信息：'.mysqli_error($dbc);
				}

			}else{
				foreach($errors as $emg){
					echo "$emg";
				}
			}

		}else{
			echo '找不到文章ID';
		}

		// 关闭数据库连接
		mysqli_close($dbc);
    }

?>