<?php #连接数据库  
	
	/*防止恶意调用*/
	 if(!(defined('ACCESS_INFO'))){
	 	exit('非法调用内置文件');
	 }

	 DEFINE('DB_USER','root');
	 DEFINE('DB_PASSWORD','950313');
	 DEFINE('DB_HOST','localhost');
	 DEFINE('DB_NAME','milightblog');
 	
 	// 创建连接
 	$dbc = @mysqli_connect(DB_HOST,DB_USER,DB_PASSWORD,DB_NAME) OR die('无法连接到mysql数据库，错误信息：'.mysqli_connect_error());

 	mysqli_set_charset($dbc,'utf8');

?>