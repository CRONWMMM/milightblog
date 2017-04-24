
 <!DOCTYPE html>
 <html lang="zh-cn">
 <head>
 	<meta charset="UTF-8">
 	<title>testupload</title>
 </head>
 <body>
	<form action="server.php" method="post" enctype="multipart/form-data">
		<input type="file" name="images[]" multiple="multiple" style="border:1px solid red" />
		<!-- <input type="text" name="text"> -->
		<input type="submit" value="提交" />
	</form>
	<script src="./script/frame/jquery-2.0.3.min.js"></script>
	<script>

		$('form input[type=submit]').click(function(e){
			e.preventDefault();
			var formdata = new FormData($('form')[0]);
			// console.log(formdata);
			$.ajax({
				url : 'server.php',
				type: 'POST',
				data : formdata,
				cache: false,
			    processData: false,
			    contentType: false,
				success: function(res){
					alert(res);
				},
				error: function (returndata) {  
		            alert(returndata);  
		        }  
			});
		});

	</script>
 </body>
 </html>