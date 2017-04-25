<?php 
	header("Content-Type:text/html;charset=utf-8");
	//页面准入常量ACCESS_INFO，没有这个常量，页面无法访问。
    define('ACCESS_INFO',true);

    if(isset($_GET['like']) && isset($_COOKIE['like'.$_GET['like']])){
    	//引入mysql数据库连接文件 
		require '../includes_php/mysqli_connect.php';

		$q = "UPDATE articles SET love=love+1 WHERE id='{$_GET['like']}'";
		$r = @mysqli_query($dbc,$q);
		if(mysqli_affected_rows($dbc) == 1){
			echo '感谢赞赏~(●′ω`●)';
		}else{
			echo '点赞未成功，快去告诉博主有bug！(｡ŏ_ŏ)';
		}
    }

?>