<link href="https://fonts.googleapis.com/css?family=Tajawal|Merriweather" rel="stylesheet">
<link href="lib/jquery-ui-flick/jquery-ui-flick.min.css" rel="stylesheet">
<link href="lib/jquery-ui-flick/jquery-ui.min.css" rel="stylesheet">

<link rel="shortcut icon" href="assets/favicon.png">
<script>
		// require_once(__DIR__ . '/../_lib/Interviewer/include.js');
	
	<?php
		require_once($_SERVER['LIBDIR'] . '/Interviewer/include.js');
		
		require_once(__DIR__ . "/js/InterviewApplication.js");
		require_once(__DIR__ . "/js/OmegaIntervieweeSelectionView.js");
		require_once(__DIR__ . "/js/OmegaInterviewView.js");
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
<div id="footer">
	<div id="footer-background"></div>
	<p>&#169; <?php echo date("Y"); ?> University of Southern California Marshall School of Business. All rights reserved.</p>
	<p>Website by Phillip Nazarian and Ahsan Zaman</p>
</div>

<style>

	body {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		min-height: 100%;
		
		background-attachment: fixed !important;
		background: #eee; /* Old browsers */
		background: -moz-linear-gradient(top, #ddd 0%, #eee 35%, #eee 65%, #ddd 100%); /* FF3.6-15 */
		background: -webkit-linear-gradient(top, #ddd 0%,#eee 35%,#eee 65%,#ddd 100%); /* Chrome10-25,Safari5.1-6 */
		background: linear-gradient(to bottom, #ddd 0%,#eee 35%,#eee 65%,#ddd 100%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
	}


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

	#footer {
		bottom: 0;
		position: absolute;
		width: 100%;
		
		padding-bottom: 10px;
	}
	#footer-background {
		position: absolute;
		bottom: 0;
		width: 100%;
		z-index: -1;
		
		box-shadow: 0 0 0 55px #ccc;
	}
	#footer p {
		margin: 0;
		text-align: center;
		
		font-size: 13px;
		color: black;
	}

</style>
<link rel="stylesheet" type="text/css" href="js/styleSheet.css">
