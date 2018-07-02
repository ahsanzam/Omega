/**
 * The Interview application.
 * @class
 * @extends StackApplication
 * @param {DOMObject} container - The HTML object in which the application should place its views.
 */
var InterviewApplication = function(container, toStyle) {
	StackApplication.call(this, container);
	
	this.interviewees = <?php require(__DIR__ . "/../json/interviewees.json"); ?>;
	
	let selectionView = new OmegaIntervieweeSelectionView({
		interviewees: this.interviewees,
		interviewViewType: OmegaInterviewView,
		interviewViewOptions: {
			canInterrupt: false,
			backPrompt: "Back"
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
		transition: "slideLeft"
	});
	
	window.userScore = 0;
	window.style = new Styling();
	this.show(textView);
}
extend(StackApplication, InterviewApplication);

/**
 * Trigger an interview event, which may enable new questions for some interviewees.
 * @param {string} eventName - The event to trigger.
 */
InterviewApplication.prototype.triggerInterviewEvent = function(eventName)
{
	// iterate through all interview questions
	for (let i in interviewees)
	{
		let intervieweeQuestions = interviewees[i];
		for (let j in intervieweeQuestions)
		{
			question = intervieweeQuestions[j];
			if (question.revealOnEvent == eventName)
			{
				question.hidden = false;
			}		
		}
	}
}