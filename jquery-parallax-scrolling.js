/**
 * @license
 * Copyright (c) 2015 Sasha Bichkov <aleksandar.bichkov@gmail.com>

 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:

 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.

 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

/**
 * UMD pattern which defines a jQuery plugin that works 
 * with AMD and browser globals
 * https://github.com/umdjs/umd/blob/master/jqueryPlugin.js
 */
;(function (factory) {
	if (typeof define === 'function' && define.amd) {
		define(['jquery'], factory);
	} else {
		factory(jQuery);
	}
}(function ($) {
	'use strict';

	var BEFORE_BLOCK = 20;
	var PLUGIN_NAME  = 'parallax';
	
	var current = 0;
	var coords  = [];
	var motion, speed, property;

	var defaults = {
		children: null,
		motion: 'vertical',
		speed: 1
	};

	var errors = {
			motion: function(err) {
				'Motion \"' + err + ' \" not found'
			}
	};

	/**
	 * Detect IE9, IE10, IE11
	 * @returns {boolean}
	 */
	var isIE = function() {
		var ua = navigator.userAgent.toLowerCase();
		return /msie|trident/g.test(ua);
	};

	/**
	 * Parallax class.
	 * @constructor
	 * @param {JQuery} container - The element which using the plugin
	 * @param {string} options - The options of the parallax.
	 *
	 */
	var Parallax = function (container, options) {
		this.container = container;
		this.options   = $.extend({}, defaults, options);
		this._defaults = defaults;
		this.init();
	};

	/**
	 * Initialize function.
	 * Here we are setting options and starting parallax effect
	 */
	Parallax.prototype.init = function() {
		motion   = this.options.motion;
		speed    = this.options.speed || 1;
		property = motion === 'vertical' ? 'top' : 'left';
		this.els = this.getElements();
		this.setCoords();
		this.resize();
		this.addAccelerate();
		this.start();
	};

	/**
	 * Get elements by settings
	 * @returns {jQuery} childrens - It's elements which will be using parallax
	 */
	Parallax.prototype.getElements = function() {
		var children = this.options.children;
		var $container = $(this.container);
		if (children == null) return $container.children();
		return $container.find(children);
	};

	/**
	 * Here we are set event 'scroll' to window
	 * scrolling may be is as vertical or horizontal
	 */
	Parallax.prototype.start = function() {
		var scrolling = this.getScrolling();
		$(window).on('scroll', scrolling);
		$(window).on('wheel', function(e) {
			if (isIE()) {
				e.preventDefault();
				return;
			}
		});
	};

	/**
	 * When browser was resized we need change 
	 * coordinates for blocks
	 */
	Parallax.prototype.resize = function() {
		var setCoords = this.setCoords.bind(this);
		$(window).on('resize', setCoords);
	};

	/**
	 * Setting coordinates of blocks.
	 * We need top and left coords
	 */
	Parallax.prototype.setCoords = function() {
		if (motion === 'vertical') {
			coords = this.getTopCoords();
		} else {
			coords = this.getLeftCoords();
		}
	};

	Parallax.prototype.getTopCoords = function() {
		return $.map(this.els, function(el) {
			return $(el).offset().top;
		});
	};

	Parallax.prototype.getLeftCoords = function() {
		return $.map(this.els, function(el) {
			return $(el).offset().left;
		});
	};

	/**
	 * Set accelerate for perfomance
	 */
	Parallax.prototype.addAccelerate = function() {
		var accelerate = " \
			-webkit-transform: translateZ(0); \
				 -moz-transform: translateZ(0); \
					-ms-transform: translateZ(0); \
					 -o-transform: translateZ(0); \
							transform: translateZ(0); \
		";

		$.each(this.els, function (i, el) {
			$(el).css('cssText', accelerate);
		});
	};

	/**
	 * It's a decorator for scrolling function
	 * @param {function}
	 */
	Parallax.prototype.verticalScrolling = function(fn) {
		var context = this;
		return function() {
			return fn.call(context, $(window).scrollTop());	
		}
	};

	/**
	 * It's a decorator for scrolling function
	 * @param {function}
	 */
	Parallax.prototype.horizontalScrolling = function(fn) {
		var context = this;
		return function() {
			return fn.call(context, $(window).scrollLeft());
		}
	};

	/**
	 * Get scrolling function
	 * @returns motion function
	 */
	Parallax.prototype.getScrolling = function() {
		switch (motion) {
			case 'vertical': 
				return this.verticalScrolling(this.scrolling); 
			case 'horizontal': 
				return this.horizontalScrolling(this.scrolling);
			default:
				throw new Error(errors['motion'](motion));
		}
	};

	/**
	 * Calculate position
	 * @param {number} scrollPos
	 * @param {number} currentPos - position of current slide
	 */
	Parallax.prototype._calculatePos = function(scrollPos, currentPos) {
		if (motion === 'vertical') {
			return (scrollPos - currentPos) * speed;
		} else {
			return scrollPos * speed;
		}
	};

	/**
	 * The function which goal is change slide on
	 * next or prev.
	 * @param {number} i - count of slide
	 */
	Parallax.prototype._changeSlide = function(i) {
		var len = this.els.length;
		if (i > 0 && current < len) current++;
		if (i < 0 && current > 0  ) current--;
	};

	/**
	 * Stop point when motion was scrolling horizontal
	 * returns {number}
	 */
	Parallax.prototype._getNextLeftPoint = function(nextPos) {
		return nextPos - BEFORE_BLOCK;
	};

	/**
	 * Stop point when motion was scrolling vertical
	 * @param {number} nextPos - The pos of next slide.
	 * returns {number}
	 */
	Parallax.prototype._getNextTopPoint = function(nextPos) {
		return nextPos - coords[current] - BEFORE_BLOCK;
	};

	/**
	 * Function for get stop point. Stop point is a coordinate which
	 * will set for slide.
	 * @param {nextPos}
	 * retruns {number}
	 */
	Parallax.prototype._getStopPoint = function(nextPos) {
		if (motion === 'vertical') {
			return this._getNextTopPoint(nextPos);
		} else {
			return this._getNextLeftPoint(nextPos);
		}
	};

	Parallax.prototype._stop = function(status, stop_point) {
		// var $current = $(this.els[current]);
		var $current = (motion === 'horizontal') //that condition is a crutch =/
			? $(this.els[current-1]) // get a prev slide when horizontal scrolling
			: $(this.els[current]);

		var stop = stop_point;
		if (status === 'prev') stop = 0;
		$current.css(property, stop);
	};

	/**
	 * The function which realize a slide scrolling.
	 * @param {number} scrollPos - current scroll position
	 */
	Parallax.prototype.scrolling = function(scrollPos) {
		var $current = $(this.els[current]);
		var currentPos = coords[current];
		var nextPos = coords[current + 1];

		var isNext = scrollPos >= (nextPos - BEFORE_BLOCK);
		var isPrev = scrollPos <= currentPos;
		var nextExists = !!nextPos;
		var position = this._calculatePos(scrollPos, currentPos);
		var stop_point;

		if (nextExists) $current.css(property, position);

		if (isNext) {
			stop_point = this._getStopPoint(nextPos);
			this._stop('next', stop_point);
			this._changeSlide(1);
		}

		if (isPrev) {
			stop_point = currentPos;
			this._stop('prev', stop_point);
			this._changeSlide(-1);
		}
	};

	$.fn[PLUGIN_NAME] = function (options) {
		return this.each(function() {
			if (!$.data(this, 'plugin_' + PLUGIN_NAME)) {
				$.data(this, 'plugin_' + PLUGIN_NAME,
				new Parallax(this, options));
			}
		});
	}
}));