
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
	interviewViewOptions: {},
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
	if(this.orgChartMade) return;
	
	let scope = this;
	$.ajax({
	  dataType: "json",
	  url: "../json/org_chart.json",
	  success:function(data){
  			scope.ChartMaker("#orgGraph",data);
  			scope.showDetails(scope.options.interviewees[0]['title']);
  			scope.orgChartMade = true;
	  },
	  error: function(){ alert('Invalid JSON or org_chart file missing.') }
	});
}

IntervieweeSelectionView.prototype.showDetails = function(selectedPersonPosition){
	selectedPerson = undefined;
	for(var i in this.options.interviewees){
		if(this.options.interviewees[i]['title'] == selectedPersonPosition)
			selectedPerson = this.options.interviewees[i];
	}
	if(selectedPerson == undefined) return;

	//get and set selected person's position, name, and image
	$("#chosenPerson > #name").html(selectedPerson['name']);
	$("#chosenPerson > #pos").html(selectedPerson['title']);
	$("#chosenPerson > #personImage").css("background-image","url("+selectedPerson['profileImage']+")");

	 //empty previous circle if colored in
	if(this.currentlySelectedNode)
		d3.select(this.currentlySelectedNode).select('circle').style("fill", "fff");

	//find person's position on orgChart and color it in
	this.currentlySelectedNode = d3.select("#orgGraph svg").selectAll("g.node")[0].filter(function(d,i){ return d.textContent === selectedPerson['title']})[0];
	d3.select(this.currentlySelectedNode).select('circle').style("fill", "red"); //set the fill of person's node to red

	this.selectedPerson = selectedPerson;
}

IntervieweeSelectionView.prototype.transitionToInterview = function(selectedPersonPosition){
	var selectedPerson = undefined;
	for(var i in this.options.interviewees){
		if(this.options.interviewees[i]['title'] == selectedPersonPosition)
			selectedPerson = this.options.interviewees[i];
	}
	if(selectedPerson == undefined) return;
	if (selectedPerson.disabled) return;

	let options = Object.assign({ interviewee: selectedPerson }, this.options.interviewViewOptions);
	
	// Create and push an InterviewView
	let interviewView = Object.create(this.options.interviewViewType.prototype);
	this.options.interviewViewType.call(interviewView, options);
	
	this.application.push(interviewView, {"transition":"slideLeft"});
}

/**
 * This function is called to create the graph nodes, links, and layout
 */
IntervieweeSelectionView.prototype.ChartMaker = function(container, data){
	// false=vertical, true=horizontal
	let orientation = false;
	let scope = this;
	// ************** Generate the tree diagram	 *****************
	var margin = {top: 40, right: 30, bottom: 20, left: 30},
		width = $(container).width() - margin.right - margin.left,
		height = $(container).height() - margin.top - margin.bottom;


	var i = 0, duration = 750, root;

	var tree = d3.layout.tree().size([width, height]).separation(function(a, b) { return (a.parent == b.parent ? 1 : 2); });

	var horizontalTree = function(d){ return [d.y, d.x] },
		verticalTree = function(d){ return [d.x, d.y] },
		verticalTransition = function(d) { return "translate(" + d.y + "," + d.x + ")"; },
		horizontalTransition = function(d) { return "translate(" + d.x + "," + d.y + ")"; };
	var diagonal = d3.svg.diagonal().projection(orientation ? horizontalTree : verticalTree);

	var svg = d3.select(container).append("svg").attr("width", width + margin.right + margin.left).attr("height", height + margin.top + margin.bottom)
	  			.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	root = data[0];
	root.x0 = width / 2;
	root.y0 = 0;
	  
	update(root);

	function update(source) {

		// Compute the new tree layout.
		var nodes = tree.nodes(root).reverse(),
			links = tree.links(nodes);

		// Normalize for fixed-depth.
		nodes.forEach(function(d) { d.y = d.depth * 180; });

		// Update the nodes…
		var node = svg.selectAll("g.node").data(nodes, function(d) { return d.id || (d.id = ++i); }).attr("margin",10);

		// Enter any new nodes at the parent's previous position.
		var nodeEnter = node.enter()
							.append("g")
							.attr("class", "node")
							.attr("transform", function(d) { return "translate(" + source.x0 + "," + source.y0 + ")"; })
							.on("mouseover",hover)
							.on("click",click); 

		nodeEnter.append("circle").attr("r", 1e-6).style("fill-opacity", 1);

		nodeEnter.append("foreignObject")
				    .attr("width", 70)
				    .attr("height", 20).attr("x", 15).attr("y",-15)//function(d) { return d.children || d._children ? -13 : 13; })
					.attr("dy", ".2em")
					.attr("text-anchor", "bottom")//function(d) { return d.children || d._children ? "end" : "start"; })
					.text(function(d) { return d.name; })

		// Transition nodes to their new position.
		var nodeUpdate = node.transition().duration(duration).attr("transform", orientation ? verticalTransition : horizontalTransition);

		nodeUpdate.select("circle").attr("r", 10).style("cursor","pointer");

		nodeUpdate.select("foreignObject").style("fill-opacity", 1).style("cursor","pointer");

		// Update the links…
		var link = svg.selectAll("path.link").data(links, function(d) { return d.target.id; });

		// Enter any new links at the parent's previous position.
		link.enter().insert("path", "g")
			.attr("class", "link")
			.attr("d", function(d) {
				var o = {x: source.x0, y: source.y0};
				return diagonal({source: o, target: o});
			});

		// Transition links to their new position.
		link.transition().duration(duration).attr("d", diagonal);

		// Transition exiting nodes to the parent's new position.
		link.exit().transition().duration(duration)
			.attr("d", function(d) {
				var o = {x: source.x, y: source.y};
				return diagonal({source: o, target: o});
			}).remove();
	}

	function hover(d){
		scope.showDetails(d['name']);
	}
	function click(d){
		scope.transitionToInterview(d['name']);
	}
}

