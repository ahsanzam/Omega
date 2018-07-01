/**
 * The Interview application.
 * @class
 * @extends StackApplication
 * @param {DOMObject} container - The HTML object in which the application should place its views.
 */
var InterviewApplication = function(container, toStyle) {
	StackApplication.call(this, container);
	
	let interviewees = <?php require(__DIR__ . "/../json/interviewees.json"); ?>;
	
	let selectionView = new IntervieweeSelectionView({
		interviewees: interviewees,
		interviewViewOptions: {
			canInterrupt: false
		}
	});
	
	let videoView = new VideoMessageView({
		videoURL: "videos/exec1/1_28.mp4",
		title: "Eugene Stevens - CEO",
		continuePrompt: "Continue",
		nextView: selectionView,
		autoplay: true,
		transition: "slideLeft",
		canSkip: true
	});
	
	let textView = new TextMessageView({
		content: "<?php FileContents(__DIR__ . '/introMessage.html'); ?>",
		title: "Omega",
		continuePrompt: "Begin",
		nextView: videoView,
		transition: "slideLeft",
	});
	
	window.userScore = 0;
	window.style = new Styling();
	this.show(textView);
}
extend(StackApplication, InterviewApplication);