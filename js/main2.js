;(function(window) {

	'use strict';

	function getComputedTranslateY(obj) {
		if(!window.getComputedStyle) return;
		var style = getComputedStyle(obj),
			transform = style.transform || style.webkitTransform || style.mozTransform;
		var mat = transform.match(/^matrix3d\((.+)\)$/);
		if(mat) return parseFloat(mat[1].split(', ')[13]);
		mat = transform.match(/^matrix\((.+)\)$/);
		return mat ? parseFloat(mat[1].split(', ')[5]) : 0;
	}

	var lastTime = 0;
	var prefixes = 'webkit moz ms o'.split(' ');
	var requestAnimationFrame = window.requestAnimationFrame;
	var cancelAnimationFrame = window.cancelAnimationFrame;
	var prefix;
	for( var i = 0; i < prefixes.length; i++ ) {
		if ( requestAnimationFrame && cancelAnimationFrame ) {
			break;
		}
		prefix = prefixes[i];
		requestAnimationFrame = requestAnimationFrame || window[ prefix + 'RequestAnimationFrame' ];
		cancelAnimationFrame  = cancelAnimationFrame  || window[ prefix + 'CancelAnimationFrame' ] ||
		window[ prefix + 'CancelRequestAnimationFrame' ];
	}

	if ( !requestAnimationFrame || !cancelAnimationFrame ) {
		requestAnimationFrame = function( callback, element ) {
			var currTime = new Date().getTime();
			var timeToCall = Math.max( 0, 16 - ( currTime - lastTime ) );
			var id = window.setTimeout( function() {
				callback( currTime + timeToCall );
			}, timeToCall );
			lastTime = currTime + timeToCall;
			return id;
		};

		cancelAnimationFrame = function( id ) {
			window.clearTimeout( id );
		};
	}

	var docElem = window.document.documentElement;
	
	function scrollY() { return window.pageYOffset || docElem.scrollTop; }
	function extend( a, b ) {
		for( var key in b ) { 
			if( b.hasOwnProperty( key ) ) {
				a[key] = b[key];
			}
		}
		return a;
	}
	
	function IsoGrid(el, options) {
		this.isolayerEl = el;
		
		this.options = extend( {}, this.options );
		extend( this.options, options );

		this.gridEl = this.isolayerEl.querySelector('.grid');

		this.gridItems = [].slice.call(this.gridEl.querySelectorAll('.grid__item'));
		this.gridItemsTotal = this.gridItems.length;
		
		this.didscroll = false;

		this._init();
	}

	IsoGrid.prototype.options = {
		type: 'static',
		perspective: 0,
		transform: '',
		stackItemsAnimation : {
			properties : function(pos) {
				return {
					translateZ: (pos+1) * 50
				};
			},
			options : function(pos, itemstotal) {
				return {
					type: dynamics.bezier,
					duration: 500,
					points: [{"x":0,"y":0,"cp":[{"x":0.2,"y":1}]},{"x":1,"y":1,"cp":[{"x":0.3,"y":1}]}]
				};
			}
		},
		onGridLoaded : function() { return false; }	
	};

	IsoGrid.prototype._init = function() {
		var self = this;

		imagesLoaded(this.gridEl, function() {
			self.msnry = new Masonry(self.gridEl, {
				itemSelector: '.grid__item',
				isFitWidth : true
			});
			if( self.options.type === 'scrollable' ) {
				self.isolayerEl.style.position = 'fixed';	
			}
			
			self.isolayerEl.style.WebkitTransformStyle = self.isolayerEl.style.transformStyle = 'preserve-3d';

			var transformValue = self.options.perspective != 0 ? 'perspective(' + self.options.perspective + 'px) ' + self.options.transform : self.options.transform;
			self.isolayerEl.style.WebkitTransform = self.isolayerEl.style.transform = transformValue;
			if( self.options.type === 'scrollable' ) {
				self._createPseudoScroller();
			}
			self._initEvents();
			if( self.options.type === 'scrollable' ) {
				new AnimOnScroll(self.gridEl, {
					minDuration : 1,
					maxDuration : 1.2,
					viewportFactor : 0
				});
			}
			self.options.onGridLoaded();
			classie.add(self.gridEl, 'grid--loaded');
		});
	};

	IsoGrid.prototype._createPseudoScroller = function() {
		this.pseudoScrollerEl = document.createElement('div');
		this.pseudoScrollerEl.className = 'pseudo-scroller';
		this.isolayerEl.parentNode.insertBefore(this.pseudoScrollerEl, this.isolayerEl);
		this.pseudoScrollerEl.style.height = this.gridEl.offsetHeight + getComputedTranslateY(this.isolayerEl) * Math.sqrt(2) + 'px';	
	};

	IsoGrid.prototype._initEvents = function() {
		var self = this;

		var scrollHandler = function() {
				requestAnimationFrame(function() {
					if (!self.didscroll) {
						self.didscroll = true;
						self._scrollPage();
					}
				});
			},
			mouseenterHandler = function(ev) {
				self._expandSubItems(ev.target);
			},
			mouseleaveHandler = function(ev) {
				self._collapseSubItems(ev.target);
			};

		if( this.options.type === 'scrollable' ) {
			window.addEventListener('scroll', scrollHandler, false);
			this.msnry.on('layoutComplete', function( laidOutItems ) {
				self.pseudoScrollerEl.style.height = self.gridEl.offsetHeight + self.isolayerEl.offsetTop * Math.sqrt(2) + 'px';
				self._scrollPage();
			});
		}

		this.gridItems.forEach(function(item) {
			item.addEventListener('mouseenter', mouseenterHandler);
			item.addEventListener('mouseleave', mouseleaveHandler);
		});
	};

	IsoGrid.prototype._expandSubItems = function(item) {
		var self = this,
			itemLink = item.querySelector('a'),
			subItems = [].slice.call(itemLink.querySelectorAll('.layer')), 
			subItemsTotal = subItems.length;

		itemLink.style.zIndex = item.style.zIndex = this.gridItemsTotal;
		
		subItems.forEach(function(subitem, pos) {
			dynamics.stop(subitem);
			dynamics.animate(subitem, self.options.stackItemsAnimation.properties(pos), self.options.stackItemsAnimation.options(pos, subItemsTotal));
		});
	};

	IsoGrid.prototype._collapseSubItems = function(item) {
		var itemLink = item.querySelector('a');
		[].slice.call(itemLink.querySelectorAll('.layer')).forEach(function(subitem, pos) {
			dynamics.stop(subitem);
			dynamics.animate(subitem, {
				translateZ: 0 
			}, {
				duration: 100,
				complete: function() {
					itemLink.style.zIndex = item.style.zIndex = 1;
				}
			})
		});
	};

	IsoGrid.prototype._scrollPage = function() {
		this.gridEl.style.WebkitTransform = this.gridEl.style.transform = 'translate3d(0,-' + scrollY() + 'px,0)';
		this.didscroll = false;
	};

	window.IsoGrid = IsoGrid;

})(window);