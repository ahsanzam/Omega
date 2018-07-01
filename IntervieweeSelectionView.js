/**
 * A view that presents a list of interviewees for the user to choose from.
 * @class
 * @extends StackView
 * @param {IntervieweeSelectionView~Options} options - An object of keyed options for initializing the view.
 */
var IntervieweeSelectionView = function(options) {
	StackView.call(this, options);
}
extend(StackView, IntervieweeSelectionView);

/**
 * @typedef {Object} IntervieweeSelectionView~Options
 * @property {Interviewee[]} options.interviewees - The interviewees. All the most important data is here.
 * @property {number} [options.interviewTimeLimit=300] - The time limit for an interview, in seconds.
 * @property {function(new:InterviewView, Object.<string, *>)} [options.interviewViewType=InterviewView] - The type of InterviewView to use. Must inherit from InterviewView.
 * @property {Object.<string, *>} [options.interviewViewOptions={}] - The options with which to initialize InterviewViews. 'interviewee' will be set automatically.
 */
/**
 * @property {IntervieweeSelectionView~Options} options - An object of keyed options for the view.
 */
IntervieweeSelectionView.prototype.options = {
	interviewees: undefined,
	interviewTimeLimit: 10,
	interviewViewType: InterviewView,
	interviewViewOptions: {}
};
 
/**
 * @property {string} HTMLSource - The HTML source for this view.
 * @override
 */
IntervieweeSelectionView.prototype.HTMLSource = "<?php StackViewSource() ?>";

/**
 * @property {string} styles - A CSS string containing styles for this view.
 * @override
 */
IntervieweeSelectionView.prototype.styles = "<?php FileContents(__DIR__ . '/styles.css') ?>";

/**
 * This function is called when the view is first shown.
 * @override
 */
IntervieweeSelectionView.prototype.onAddToApplication = function()
{	
	let scope = this;

	let pt = this.DOMObject.find(".interviewee-prototype");

	// Setup the click handler
	pt.find(".button").click(function() {
		let id = $(this).parents(".interviewee").attr("interviewee-id");
		let interviewee = scope.options.interviewees[id];
		if (interviewee.disabled) return;

		let options = Object.assign({ interviewee: scope.options.interviewees[id] }, scope.options.interviewViewOptions);
		
		// Create and push an InterviewView
		let interviewView = Object.create(scope.options.interviewViewType.prototype);
		scope.options.interviewViewType.call(interviewView, options);
		
		scope.selectedIntervieweeID = id;
		scope.application.push(interviewView, {"transition":"slideLeft"});
	});
	
	// Make empty copies of the prototype
	for (let i in this.options.interviewees)
	{
		let interviewee = this.options.interviewees[i];
		
		let obj = pt.clone(true)
					.removeClass("interviewee-prototype")
					.addClass("interviewee")
					.attr("interviewee-id", i);
		obj.appendTo(pt.parent());
	}
	
	// Hide the prototype
	pt.hide();
	
	// Initialize the interviewees object
	for (let i in this.options.interviewees)
	{
		let interviewee = this.options.interviewees[i];
		
		// Set interview time limit
		if (interviewee.timeRemaining === undefined)
		{
			interviewee.timeRemaining =parseInt(interviewee["time"])*60;// this.options.interviewTimeLimit;
		}
	}
}

/**
 * This function is called whenever the view was previously not shown, but now is shown.
 * @override
 */
IntervieweeSelectionView.prototype.onShow = function()
{
	let scope = this;
	this.DOMObject.find(".interviewee").each(function() {
		let id = $(this).attr("interviewee-id");
		let interviewee = scope.options.interviewees[id];
		let orgChartAttrs = {"pos":interviewee.title, "img":interviewee.profileImage, "name":interviewee.name}
		
		$(this).find(".name").text(interviewee.name);
		$(this).find(".title").text(interviewee.title)
		$(this).find(".title").click(orgChartAttrs, window.orgChart.showChart);
		$(this).find(".image").attr("src", interviewee.profileImage);
		$(this).find(".time").text(formatTime(interviewee.timeRemaining));
		
		$(this).toggleClass("interviewee-disabled", interviewee.disabled == true);
	});
}

/**
 * @property {(boolean|number)} selectedIntervieweeID - The ID of the interviewee that was selected, or false if no interviewee is currently selected.
 * @see onPopTo
 */
IntervieweeSelectionView.prototype.selectedIntervieweeID = false;

/**
 * This function is called (before onShow) when this view is popped back to from an InterviewView.
 * @param {Interviewee} interviewee - The updated Interviewee passed back from the InterviewView.
 */
IntervieweeSelectionView.prototype.onPopTo = function(interviewee)
{
	if (this.selectedIntervieweeID !== false)
	{
		this.options.interviewees[this.selectedIntervieweeID] = interviewee;
		
		this.selectedIntervieweeID = false;
	}
}
