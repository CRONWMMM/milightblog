<?php 

// echo $_SERVER['DOCUMENT_ROOT'].'/milightblog';
// print_r($_FILES['images']);
$path = $_SERVER['DOCUMENT_ROOT'].'/milightblog/tmp/';

if(is_uploaded_file($_FILES['images']['tmp_name'][0])){

	foreach($_FILES['images']['tmp_name'] as $k=>$v){
		if(is_uploaded_file($_FILES['images']['tmp_name'][$k])){
			$save = $path.$_FILES['images']['name'][$k];
			echo $save."<br>";
			if(move_uploaded_file($_FILES['images']['tmp_name'][$k],$save)){
				echo "上传成功！";
			}
		}
	}
}

if($_SERVER['REQUEST_METHOD'] == 'POST'){
	// echo htmlspecialchars($_POST['content']);
	// echo nl2br($_POST['content']);
	echo $_POST['market'].'<br>';
	echo $_POST['sub'].'<br>';
	echo $_POST['title'].'<br>';
	echo $_POST['content'];
}

 ?>
 <!DOCTYPE html>
 <html lang="zh-cn">
 <head>
 	<meta charset="UTF-8">
 	<title>Document</title>
 	<link rel="stylesheet" href="css/module/bootstrap.min.css">
 </head>
 <body>
 	
 </body>
 </html>