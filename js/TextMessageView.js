/**
 * A view that presents a text message, then prompts the user to continue.
 * @class
 * @extends StackView
 * @param {TextMessageView~Options} options - An object of keyed options for initializing the view.
 */
var TextMessageView = function(options) {
	StackView.call(this, options);
}
extend(StackView, TextMessageView);

/**
 * @typedef {Object} TextMessageView~Options
 * @property {string} options.content - The HTML of the text to present to the user.
 * @property {string} [options.title="Welcome"] - The title for the video message.
 * @property {string} [options.continuePrompt="Continue"] - The prompt to display to the user when the video ends.
 * @property {StackView} [options.nextView=false] - The view to push when the user chooses to continue. If false, the view pops on continue.
 */
 
/**
 * @property {TextMessageView~Options} options - An object of keyed options for the view.
 */
TextMessageView.prototype.options = {
	content: undefined,
	title: "Welcome",
	continuePrompt: "Continue",
	nextView: false,
	transition: undefined,
};

/**
 * @property {string} HTMLSource - The HTML source for this view.
 * @override
 */
TextMessageView.prototype.HTMLSource = "<?php StackViewSource() ?>";

/**
 * @property {string} styles - A CSS string containing styles for this view.
 * @override
 */
TextMessageView.prototype.styles = "<?php FileContents(__DIR__ . '/styles.css') ?>";

/**
 * This function is called when the view is first shown.
 * @override
 */
TextMessageView.prototype.onAddToApplication = function()
{
	let scope = this;

	this.DOMObject.find(".text-message-title").text(scope.options.title);
	
	this.DOMObject.find(".text-message-content").html(scope.options.content);
	
	this.DOMObject.find(".continue")
		.attr("value", this.options.continuePrompt)
		.click(function(){
			if (scope.options.nextView)
			{
				scope.application.push(scope.options.nextView, {"transition": scope.options.transition});
			}
			else
			{
				scope.application.pop();
			}
		});
}


