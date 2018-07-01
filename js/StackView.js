/**
 * Represents a view in a StackApplication.
 * @class
 * @param {Object.<string, *>} options - An object of keyed options for initializing the view.
 */
var StackView = function(options)
{
	for (let key in options)
	{
		this.options[key] = options[key];
	}
	
	for (let key in this.options)
	{
		if (this.options[key] === undefined)
		{
			console.log("Missing required parameter: " + key);
		}
	}
}

/**
 * @property {Object.<string, *>} options - An object of keyed options for the view. This property should be overridden by subclasses to specify options. Options with a default value of undefined are required.
 */
StackView.prototype.options = {};

/**
 * @property {string} HTMLSource - The HTML source for this view.
 * @abstract
 */
StackView.prototype.HTMLSource = "OVERRIDE THIS";
 
/**
 * @property {string} styles - A CSS string containing styles for this view.
 */
StackView.prototype.styles = "";
 
<?php
	function FileContents($filename)
	{		
		$contents = file_get_contents($filename, true);		
		$contents = str_replace(array("\r", "\n"), " ", $contents);
		$contents = addslashes($contents);
		
		echo $contents;
	}

	function StackViewSource()
	{
		$bt = debug_backtrace();
		$filename = $bt[0]["file"];
		$filename = preg_replace("/\..*/", ".html", $filename);
		
		FileContents($filename);
	}
?>
 
/**
 * @property {StackApplication} application - The StackApplication this view is in, or false if the view is not currently in an application.
 */
StackView.prototype.application = false; 

/**
 * @property {(boolean|DOMObject)} DOMObject - The DOM Object of the view, or false if the view is not currently in the document.
 */
StackView.prototype.DOMObject = false;

/**
 * Add the view to a StackApplication.
 * @param {StackApplication} application - The application this view is added to.
 * @param {DOMObject} DOMObject - The DOM Object in which the view resides.
 */
StackView.prototype.addToApplication = function(application, DOMObject)
{
	this.application = application;
	this.DOMObject = DOMObject;
	
	this.DOMObject.append("<style>" + this.styles + "</style>");
	
	this.onAddToApplication();
}

/**
 * Remove the view from a StackApplication.
 */
StackView.prototype.removeFromApplication = function()
{
	this.application = false;
	this.DOMObject = false;
}

/**
 * This function is called when the view is first shown.
 * @abstract
 */
StackView.prototype.onAddToApplication = function()
{
}

/**
 * This function is called whenever the view was previously not shown, but now is shown.
 * @abstract
 */
StackView.prototype.onShow = function()
{
}

/**
 * This function is called (before onShow) when this view is popped back to.
 * @param {*} returnValue - A value of any type that was passed to the pop function of the StackApplication.
 * @abstract
 */
StackView.prototype.onPopTo = function()
{
}

/**
 * This function is called whenever the view was previously shown, but now is not anymore.
 * @abstract
 */
StackView.prototype.onHide = function()
{
}

/**
 * This function is called when the view is removed from the application.
 * @abstract
 */
StackView.prototype.onRemoveFromApplication = function()
{
}