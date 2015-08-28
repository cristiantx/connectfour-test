<!DOCTYPE html>
<html>
	<head>
		<title>Connect 4</title>

		<link href="{{ asset('styles/app.css') }}" rel="stylesheet" media="screen">
	</head>
	<body>
		<div id="app"></div>
		@if ( App::environment('local') )
		<script src="//localhost:3100/livereload.js"></script>
		@endif
		<script>
		var player = <?php echo json_encode($user) ?>
		</script>
		<script src="{{ asset('scripts/app.js') }}"></script>
	</body>
</html>
