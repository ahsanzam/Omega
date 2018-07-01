<link href="https://fonts.googleapis.com/css?family=Tajawal|Merriweather" rel="stylesheet">

<script>
	<?php
		require_once(__DIR__ . '/js/include.js');
		require_once(__DIR__ . "/js/InterviewApplication.js");
	?>
	
	$(function() {		
		let application = new InterviewApplication($("#application"));
		
		window.application = application;
	});
</script>

<div class="navbar">
	<div id="app-title" class="titles">Omega</div>
	<div class="brand" id="left-brand"></div>
	<div class="brand" id="right-brand"></div>
	<!-- <img id="brand" src='./../assets/ELC_Logo2.png'> -->
</div>
<div id="application"></div>

<style>
	.navbar{
		background-color:black;
		color:white;
		width:100%;
		position:relative;
		top:0;
		left:0;
	}
	#app-title{
		font-size:1.5em;
		position:absolute;
		left:0;
		right:0;
		top:13px;
		text-align:center;
	}
	#application{
		overflow-x:hidden;
	}
	.brand{
		height:60px;
		position:absolute;
		top:0;
		background-size:contain;
		background-repeat:no-repeat;
	}
	#left-brand{
		position:relative; /*needs at least one element with position:relative to give parent div height*/
		left:0;
		background-image:url('assets/Formal_Marshall_ELC_CardOnGold.jpg');
	}
	#right-brand{
		top:4px;
		width:60px;
		right:5px;
		background-image:url('assets/JFF-ELC-Mouse-Pad-CIRCLE.png');
	}
	@media screen and (max-width: 800px) {
		#body{ background-color:black; }
		#brand{
			width:30px;
			height:30px;
			background-image:url('assets/shield.jpg');
			background-repeat:no-repeat;
			background-size:contain;
			cursor:pointer;
			position:relative;
			top:0;
			left:0;
		}
	}
</style>
<link rel="stylesheet" type="text/css" href="js/styleSheet.css">
