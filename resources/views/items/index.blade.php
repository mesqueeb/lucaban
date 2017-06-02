<html>
<head>

    @include('config.analytics')

	<meta charset="UTF-8">
	<meta name="csrf-token" id="csrf-token" content="{{ csrf_token() }}">
	<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1.0, user-scalable=no">
	<meta name="google" value="notranslate">
	
	<link rel="stylesheet" href="/css/items.css">
	{{-- <link rel="stylesheet" href="/css/fonts/material-design-iconic-font.min.css"> --}}

	<title>{{ config('app.name') }}</title>

</head>
<body>
<div style="position: fixed; height:100%; width:100%; top:0; left:0;">
<div style="height:calc(100% - 1px); width:100%; z-index: 1; overflow-y: scroll; -webkit-overflow-scrolling: touch;" id="background">
{{-- <a href="{{route('home')}}">Go home</a> --}}
@include('items.app')
</div>{{-- /Inner Wrapper  --}}
</div>{{-- /Outer Wrapper  --}}
<script>
	window.defaultLanguage = "{{ $_GET["l"] or 'en' }}";
</script>
<script src="js/items.js"></script>
</body>
</html>