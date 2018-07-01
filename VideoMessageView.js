/**
 * A view that presents a single video message, then prompts the user to continue.
 * @class
 * @extends StackView
 * @param {VideoMessageView~Options} options - An object of keyed options for initializing the view.
 */
var VideoMessageView = function(options) {
	StackView.call(this, options);
}
extend(StackView, VideoMessageView);

/**
 * @typedef {Object} VideoMessageView~Options
 * @property {string} options.videoURL - The URL of the video to play.
 * @property {boolean} [options.canSkip=false] - If true, the user can continue before the video finishes.
 * @property {string} [options.title="Welcome"] - The title for the video message.
 * @property {string} [options.continuePrompt="Continue"] - The prompt to display to the user when the video ends.
 * @property {StackView} [options.nextView=false] - The view to push when the user chooses to continue. If false, the view pops on continue.
 */
/**
 * @property {VideoMessageView~Options} options - An object of keyed options for the view.
 */
VideoMessageView.prototype.options = {
	videoURL: undefined,
	canSkip: false,
	title: "Welcome",
	continuePrompt: "Continue",
	nextView: false,
	autoplay: false,
	transition: undefined,
	controls: false
};

/**
 * @property {string} HTMLSource - The HTML source for this view.
 * @override
 */
VideoMessageView.prototype.HTMLSource = "<?php StackViewSource() ?>";

/**
 * @property {string} styles - A CSS string containing styles for this view.
 * @override
 */
VideoMessageView.prototype.styles = "<?php FileContents(__DIR__ . '/styles.css') ?>";

/**
 * This function is called when the view is first shown.
 * @override
 */
VideoMessageView.prototype.onAddToApplication = function()
{
	let scope = this;
	let videoElement = $(this.DOMObject).find(".video-element");
	let nextButton = $(this.DOMObject).find(".continue");
	//check if intro video file exists, if not show error message
	window.style.checkIfFileExists(this.options.videoURL, 
		()=>{
			$(".video-prompt").show();
			//videoElement.css("background-color","#4C3523");
	});

	let video = '<source src="'+this.options.videoURL+'" type="video/mp4"></source>';
	$(".video-prompt").hide();
	videoElement.html(video);
	//videoElement.css("background-color","#230C0F");
	if(this.options.controls) enableVideoControls();
	if(this.options.autoplay) $(videoElement).prop("autoplay","autoplay");
	if(!this.options.canSkip) $(nextButton).prop("disabled",true);

	$(videoElement).on('ended',()=>{
		this.options.canSkip = true;
		enableVideoControls();
		$(nextButton).prop("disabled",false);
	});

	this.DOMObject.find(".video-message-title").text(scope.options.title);
	
	nextButton
		.attr("value", this.options.continuePrompt)
		.click(function(){
			if(scope.options.canSkip){
				disableVideoControls();
				$(".video-prompt").hide()
				pauseVideo();
				if (scope.options.nextView)
				{
					scope.application.push(scope.options.nextView, {"transition": scope.options.transition});
				}
				else
				{
					scope.application.pop();
				}
			}
		});

	function enableVideoControls(){
		$(videoElement).prop("controls",true);
		$(videoElement).attr("controlslist","nodownload");
	}
	function disableVideoControls(){
		$(videoElement).prop("controls",false);
	}
	function pauseVideo(){
		$(videoElement).trigger("pause");
	}
}


