/**
 * Ignore PHP blocks when parsing JavaScript files.
 * @module plugins/ignorePHP
 */
'use strict';

exports.handlers = {
    beforeParse: function(e) {
        // match PHP blocks
		e.source = e.source.replace(/<\?(.|[\n\r])*?(\?>|$)/g, "");
    }
};