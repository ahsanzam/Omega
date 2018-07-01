/**
 * @class
 **/
 var Styling = function(palette)
 {
	this.miscellaneous();
 }

/**
 * Perform miscalleneous styling:
 * 	1. Set location on brand icon on top left
 **/
 Styling.prototype.miscellaneous = function()
 {
 	$("#brand").click(function() {
 			window.location.href = "https://www.marshall.usc.edu/programs/experiential-learning-center";
 		});
 }

/**
 * Provides aesthetic transitions
 * @param {DOMObject|DOMObject[]} the DOM object(s) to design the transition effect around
 * @param {function} a callback function to execute once the effect is done
 * @param {string} the transition to use 
 **/
Styling.prototype.transition = function(target, callback, transition){
	if(transition == "cover"){
		let offsetTop = localToGlobalPos(target).top;
		let offsetLeft = localToGlobalPos(target).left;
		let targetCopy = $(target).clone(); //make copy of clicked button 
		targetCopy.css("margin",0).css("position","fixed").css("top",offsetTop).css("left",offsetLeft);
		targetCopy.html();
		targetCopy.empty();
		//prepend to dom 
		$("#application").prepend(targetCopy);
		$(targetCopy).attr("value","");
		//enlarge dimensions of button to cover screen based on current position
		$(targetCopy).animate({width:"100vw", height:"100vh", top:0, left:0}, 500, function(){
			if(callback) callback();
			$(this).animate({width:0, height:0, padding:0, top:offsetTop, left:offsetLeft}, 500, function(){
				$(this).remove(); //remove from dom <- remove this into a callback 
			});
		});
	}
	else if(transition == "slideLeft" || transition == "slideRight"){
		// animate both divs at the same time by setting queue value to false 
		direction = .95;
		if(transition == "slideLeft") direction *= -1;
		duration = 750;
		$(target[0]).animate({left:direction*$(window).width()}, {duration:duration, queue:false, complete: function(){
				$(target[0]).css("left", "0");
				if(callback) callback();
				$(target[1]).hide().fadeIn();
			}
		});
	}
    function localToGlobalPos( _el ) {
       var target = _el,
       target_width = target.offsetWidth,
       target_height = target.offsetHeight,
       target_left = target.offsetLeft,
       target_top = target.offsetTop,
       gleft = 0,
       gtop = 0,
       rect = {};

       var moonwalk = function( _parent ) {
        if (!!_parent) {
            gleft += _parent.offsetLeft;
            gtop += _parent.offsetTop;
            moonwalk( _parent.offsetParent );
        } else {
            return rect = {
            top: target.offsetTop + gtop,
            left: target.offsetLeft + gleft,
            bottom: (target.offsetTop + gtop) + target_height,
            right: (target.offsetLeft + gleft) + target_width
            };
        }
    };
        moonwalk( target.offsetParent );
        return rect;
	}
}

/**
 * Allows user to check if a file exists. If it exists, successCallback is executed, else errorCallback is executed. 
 * @param {string} the url of the file
 * @param {function} callback to execute if file does not exist
 * @param {function} callback to execute if file does exist
 **/
Styling.prototype.checkIfFileExists = function(url, errorCallback, successCallback){
	$.ajax({
	    type: 'HEAD',
	    url: url,
	    success: function(){
	    	if(successCallback) 
	    		successCallback();
	    },
	    error: function() {
	    	if(errorCallback)
	    		errorCallback();
	    }
	});
}