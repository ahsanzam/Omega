/**
 * A view where the user conducts a virtual interview.
 * @class
 * @extends StackView
 * @param {OmegaInterviewView~Options} options - An object of keyed options for initializing the view.
 */
function OmegaInterviewView(options) {
	StackView.call(this, options);
}
extend(StackView, OmegaInterviewView);
 
/**
 * @typedef {Object} OmegaInterviewView~Options
 * @property {Interviewee} options.interviewee - The interviewee.
 * @property {boolean} [options.canInterrupt=false] - If true, the user can ask a new question or go back in the middle of a response.
 * @property {boolean} [options.canRepeat=false] - If true, the user can ask the same question more than once.
 * @property {string} [options.backPrompt="Back"] - The prompt for the back button.
 */
/**
 * @property {OmegaInterviewView~Options} options - An object of keyed options for the view.
 */
OmegaInterviewView.prototype.options = {
	interviewee: undefined,
	canInterrupt: false,
	canRepeat: false,
	backPrompt: "Back"
};

/**
 * @property {string} HTMLSource - The HTML source for this view.
 * @override
 */
OmegaInterviewView.prototype.HTMLSource = "<?php StackViewSource() ?>";

/**
 * @property {string} styles - A CSS string containing styles for this view.
 * @override
 */
OmegaInterviewView.prototype.styles = "<?php FileContents(__DIR__ . '/styles.css') ?>";

/**
 * This function is called when the view is first shown.
 * @override
 */
OmegaInterviewView.prototype.onAddToApplication = function()
{
	let scope = this;
	let interviewee = this.options.interviewee;
	this.firstQuestion = true;
	if(!this.application.interviewees[this.options.interviewee.name])
		this.application.interviewees[this.options.interviewee.name] = {};

	// Lock question list scrolling as necessary
	let questionList = $(".question-list")[0];
	questionList.addEventListener("scroll", function() {
		if (scope.questionListScrollPosition !== undefined) {
			questionList.scrollTop = scope.questionListScrollPosition;
		}
	});
	
	let pt = this.DOMObject.find(".question-prototype");

	// Setup the question click handler
	pt.find(".question-button").click(function() {
		let id = $(this).parents(".question").attr("question-id");
		let question = interviewee.questions[id];
		scope.lastVideoEndTime = undefined
		window.userScore += parseInt(question['score']); //accumulate user score

		if (!interviewee.disabled && !question.disabled)
		{
			//perform setup
			$(".video-prompt").prop("hidden",true);
			$(".video-error").hide();
			$(".interview-video").prop("hidden",false);
			if(scope.firstQuestion){ 
				scope.flashTimeInstruction();
				scope.firstQuestion = false;
			}
			if(scope.answeringQuestion){	//if we have just switched to a new question
				//if you cannot interrupt this speaker
				if(!scope.options.canInterrupt) return;
				//if the previous video has not finished playing, save the point where it was paused
				scope.application.interviewees[scope.options.interviewee.name][scope.currQuestion.prompt] = scope.DOMObject.find(".interview-video")[0].currentTime; 
			}
			let video_location = question.responseVideo;
			//check if selected video exists, if not, show error message
			window.style.checkIfFileExists(video_location, function () {
				$(".video-error").show();
				scope.stopClock();
			});

			// Mark the interview as having began
			interviewee.began = true;
			
			// Record the question list scroll position
			scope.questionListScrollPosition = questionList.scrollTop;
			
			// Play the response video
			let video = scope.DOMObject.find(".interview-video");
			video.attr('src',video_location);
			if (video[0].currentTime !== undefined)
				video[0].currentTime = scope.application.interviewees[scope.options.interviewee.name][question.prompt];
			scope.currQuestion = question;
			scope.answeringQuestion = true; 

			// Disable the question only when video is finished
			scope.DOMObject.find(".interview-video").on('ended', function () {
				if (scope.currQuestion)
				{
					if (scope.currQuestion.endInterview) {
						interviewee.timeRemaining = 0;
					}
					if (scope.currQuestion.triggerEvents) {
						for (var i in scope.currQuestion.triggerEvents) {
							let event = scope.currQuestion.triggerEvents[i];
							scope.application.triggerInterviewEvent(event);
						}
					}
				}
				
				scope.questionListScrollPosition = undefined;
				
				scope.lastVideoEndTime = scope.options.interviewee.timeRemaining;
				if(scope.idleVideo){
					scope.idleVideo = undefined; 
					return;
				}
				
				if (!scope.options.canRepeat)
				{
					scope.answeringQuestion = false;
				}
			});
			
			if (!scope.options.canRepeat)
			{
				question.disabled = true;
				$(this).parents(".question").toggleClass("question-disabled", question.disabled == true);
			}

			// Start the clock, if necessary
			if (!scope.isClockRunning())
			{
				scope.startClock();
			}
		}
	});

	// Make empty copies of the prototype
	for (let i in interviewee.questions)
	{
		let question = interviewee.questions[i];
		
		if (question.hidden !== true)
		{
			let obj = pt.clone(true)
						.removeClass("question-prototype")
						.addClass("question")
						.attr("question-id", i);
			$(obj).css("border-bottom","1px solid black"); 
			obj.appendTo(pt.parent());
			if(!this.application.interviewees[this.options.interviewee.name][question.prompt])	//set pausedAt value to 0 (initial) if not already set
				this.application.interviewees[this.options.interviewee.name][question.prompt] = 0; 
		}
	}
	
	// Hide the prototype
	pt.hide();
	
	// Back Button
	this.DOMObject.find(".back")
		.attr("value", this.options.backPrompt)
		.click(function() {
			//if this user is not disabled yet, save current video pause point 
			if(scope.options.interviewee.timeRemaining > 0 && scope.currQuestion)
				scope.application.interviewees[scope.options.interviewee.name][scope.currQuestion.prompt] = scope.DOMObject.find(".interview-video")[0].currentTime;
			scope.application.pop(interviewee, "slideRight");
		});
	
	// Feedback Dialog
	this.feedbackDialog = this.DOMObject.find("#feedback-dialog")
		.html(interviewee.feedback)
		.dialog({
			autoOpen: false,
			resizable: false,
			draggable: false,
			width: "50vw",
			maxHeight: 600,
			classes: {
				"ui-dialog": "feedback-dialog"
			},
			position: { my: "center top", at: "center bottom", of: this.DOMObject.find(".interview-view-header") }
		});
	this.DOMObject.find(".feedback-button")
		.hide()
		.click(function() {
			scope.feedbackDialog.dialog("open");
		});	
}

/**
 * This function is called whenever the view was previously not shown, but now is shown.
 * @override
 */
OmegaInterviewView.prototype.onShow = function()
{
	let scope = this;
	let interviewee = this.options.interviewee;
	let orgChartAttrs = {"pos":interviewee.title, "img":interviewee.profileImage, "name":interviewee.name}
	
	// Header
	this.DOMObject.find(".name").text(interviewee.name);
	this.DOMObject.find(".title").text(interviewee.title);
	this.DOMObject.find(".container").css('background-image','url(images/'+interviewee.background+')');
	
	// Questions
	this.DOMObject.find(".question").each(function() {
		let id = $(this).attr("question-id");
		let question = interviewee.questions[id];
		
		$(this).find(".question-prompt").text(question.prompt);
		
		$(this).toggleClass("question-disabled", question.disabled == true);
	});
	
	// Clock
	if (interviewee.began) {
		this.startClock();
		this.idleSince = interviewee.timeRemaining;
	}
	this.updateTimeRemaining();
}


/**
 * Flashes warning that timer begins now
 */
OmegaInterviewView.prototype.flashTimeInstruction = function(){
	$(".time-container").animate({ backgroundColor:"#F3DE8A"},1500,function(){ $(".time-container").animate({ backgroundColor:"transparent"}, 1500) });
}

/**
 * This function is called whenever the view was previously shown, but now is not anymore.
 */
OmegaInterviewView.prototype.onHide = function()
{
	this.stopClock();
}

/**
 * Update the time remaining that is displayed to the user, as well as the time's up display.
 */
OmegaInterviewView.prototype.updateTimeRemaining = function()
{
	let interviewee = this.options.interviewee;

	this.DOMObject.find(".time").text(formatTime(interviewee.timeRemaining));
	
	this.DOMObject.toggleClass("interview-view-disabled", interviewee.disabled == true);
	this.DOMObject.find(".interviewee-disabled-message").toggle(interviewee.disabled == true);
	
	let shouldDisplayFeedback = interviewee.feedback !== false && interviewee.disabled == true;
	if (shouldDisplayFeedback && this.DOMObject.find(".feedback-button:hidden"))
		this.feedbackDialog.dialog("open");
	this.DOMObject.find(".feedback-button").toggle(shouldDisplayFeedback);
}

/**
 * @property {(boolean|number)} clockID - The interval ID of the clock running every second, or false if the clock is not running.
 */
OmegaInterviewView.prototype.clockID = false;

/**
 * Check if the clock is running.
 * @return {boolean} - Whether or not the clock is currently running.
 */
OmegaInterviewView.prototype.isClockRunning = function()
{
	return (this.clockID !== false);
}

/**
 * Start the clock.
 */
OmegaInterviewView.prototype.startClock = function()
{
	if (!this.isClockRunning())
	{
		this.clockID = setInterval(this.tickClock, 1000, this);
	}
}

OmegaInterviewView.prototype.playIdleVideo = function(scope){
	scope.lastVideoEndTime = undefined;
	scope.idleVideo = true;
	scope.DOMObject.find(".interview-video").attr('src',scope.options.interviewee['idle_video']);
}
/**
 * Tick the clock forward by one second.
 */
OmegaInterviewView.prototype.tickClock = function(scope)
{
	let interviewee = scope.options.interviewee;

	if(scope.lastVideoEndTime!=undefined && (scope.lastVideoEndTime - interviewee.timeRemaining) > 5){
		//play idle video
		scope.playIdleVideo(scope);
	}
	
	if (interviewee.timeRemaining > 0)
	{
		interviewee.timeRemaining -= 1;
	}
	else
	{ // stop the clock
		scope.stopClock();
		interviewee.disabled = true;
		$(".question").addClass("question-disabled");
	}
	
	scope.updateTimeRemaining();
}

/**
 * Stop the clock.
 */
OmegaInterviewView.prototype.stopClock = function()
{
	if (this.isClockRunning())
	{
		clearInterval(this.clockID);
		this.clockID = false;
	}
}
