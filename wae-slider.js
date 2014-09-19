(function ( $ ){
	$.fn.waeslider = function( options ){
		var settings = $.extend({}, $.fn.waeslider.defaults, options);

		return this.each(function(){
			var $this = $(this);
			var $leftControl  = $this.find('.left-control');
			var $rightControl = $this.find('.right-control');
			
			$rightControl.click(function(e){
				e.preventDefault();
				nextSlide();
			});
			
			$leftControl.click(function(e){
				e.preventDefault();
				prevSlide();
			});

			$this.find('.wae-slider-indicators li').click(function(){
				var $indicator = $(this);
				var $activeIndicator = $indicator.parent().find('.active');
				var currentPos = $('li').index($indicator);
				var activePos = $('li').index($activeIndicator);
				console.log(currentPos);
				console.log(activePos);
				//next slide
				if( currentPos > activePos ){
					switch( settings.effect ){
						case 'crossfading':
							crossNext( $this, currentPos + 1 );
							break;
						default:
							slideLeft( $this, currentPos + 1);
							break;
					}
					nextIndicator( $this, currentPos + 1 );
				}else{
					switch( settings.effect ){
						case 'crossfading':
							crossPrev( $this, currentPos + 1 );
							break;
						default:
							slideRight( $this, currentPos + 1 );
							break;
					}
					prevIndicator( $this, currentPos + 1 );
				}
			});

			//initiate content animation
			var $toAnimate = $this.find('.item.active .animate');
			contentAppears( [], $toAnimate );

			var nextSlide = function(){
				switch( settings.effect ){
					case 'crossfading':
						crossNext( $this );
						break;
					default:
						slideLeft( $this );
						break;
				}
				nextIndicator( $this );
			};

			var prevSlide =  function(){
				switch( settings.effect ){
					case 'crossfading':
						crossPrev( $this );
						break;
					default:
						slideRight( $this );
						break;
				}
				prevIndicator( $this );
			}

			var timer = setInterval( nextSlide, settings.pauseTime );

			if(settings.pauseOnHover){
				$this.hover(function(){
					clearInterval(timer);
				}, function(){
					timer = setInterval( nextSlide, settings.pauseTime );
				});
			}
		});
	}

	function debug( obj ){
		if ( window.console && window.console.log ){
			window.console.log( 'object length: ', obj.length );
			$.each(obj, function( key, element ){
				console.log( key + ' -- ' + element );
			});
		}
	}

	$.fn.waeslider.defaults = {
		effect : 'slide',
		animeSpeed: 500,
		pauseTime: 5000,
		startSlide: 0,
		directionNav: true,
		pauseOnHover: true,
		manualAdvance: false,
		prevText : 'Prev',
		nextText : 'Next',
		beforeChange : function(){},
		afterChange: function(){},
		afterLoad: function(){}
	};

	function slideLeft( $slide, pos ){
		var $active = $slide.find('.item.active');
		var $next = typeof pos == 'undefined' ? $active.next('.item') : 
					$slide.find('.item:nth-child('+pos+')') ;
		if(!$next.length){
			$next = $active.parent().children(':first-child');
		}
		$next.addClass('next');
		
		//before slide
		$active.find('.animate').addClass('fadeOut');

		setTimeout(function(){
			$active.addClass('left');
			$next.addClass('left');
		},600);
		setTimeout(function(){
			$active.removeClass('active left');
			$next.removeClass('next left');
			$next.addClass('active');

			//after slide
			var $lastActive = $active.find('.animate');
			var $toAnimate = $slide.find('.item.active .animate');
			contentAppears($lastActive, $toAnimate);
		},1300)
	}

	function slideRight( $slide, pos ){
		var $active = $slide.find('.item.active');
		var $prev = typeof pos == 'undefined' ? $active.prev('.item') :
					$slide.find('.item:nth-child('+pos+')') ;
		if(!$prev.length){
			$prev = $active.parent().children(':last-child');
		}
		$prev.addClass('prev');
		
		//before slide
		$active.find('.animate').addClass('fadeOut');

		setTimeout(function(){
			$active.addClass('right');
			$prev.addClass('right');
		},600);
		setTimeout(function(){
			$active.removeClass('active right');
			$prev.removeClass('prev right');
			$prev.addClass('active');

			//after slide
			var $lastActive = $active.find('.animate');
			var $toAnimate = $slide.find('.item.active .animate');
			contentAppears($lastActive, $toAnimate);
		},1300);
	}

	function crossNext( $slide, pos ){
		var $active = $slide.find('.item.active');
		var $next = typeof pos == 'undefined' ? $active.next('.item') : 
					$slide.find('.item:nth-child('+pos+')') ;
		console.log($next);
		if(!$next.length){
			$next = $active.parent().children(':first-child');
		}
		$active.addClass('cross-active');
		$next.addClass('active cross-next');

		//before slide
		$active.find('.animate').addClass('fadeOut');
		
		setTimeout(function(){
			$active.addClass('cross');
		},800);
		setTimeout(function(){
			$active.removeClass('active cross-active cross');
			$next.removeClass('cross-next cross');

			//after slide
			var $lastActive = $active.find('.animate');
			var $toAnimate = $slide.find('.item.active .animate');
			contentAppears($lastActive, $toAnimate);
		},1500)
	}

	function crossPrev( $slide, pos ){
		var $active = $slide.find('.item.active');
		var $prev = typeof pos == 'undefined' ? $active.prev('.item') :
					$slide.find('.item:nth-child('+pos+')') ;
		if(!$prev.length){
			$prev = $active.parent().children(':last-child');
		}
		$active.addClass('cross-active');
		$prev.addClass('active cross-next');
		
		//before slide
		$active.find('.animate').addClass('fadeOut');
		setTimeout(function(){
			$active.addClass('cross');
		},800);
		setTimeout(function(){
			$active.removeClass('active cross-active cross');
			$prev.removeClass('cross-next cross');

			//after slide
			var $lastActive = $active.find('.animate');
			var $toAnimate = $slide.find('.item.active .animate');
			contentAppears($lastActive, $toAnimate);
		},1500)
	}

	function nextIndicator( $slide, pos ){
		var $indicators = $slide.find('.wae-slider-indicators');
		if ( !$indicators.length ) return;
		var $active = $indicators.find('.active');
		var $next = typeof pos == 'undefined' ? $active.next('li') : 
					$slide.find('li:nth-child('+pos+')') ;
		if ( !$next.length ){
			$next = $indicators.children(':first-child');
		}
		$active.removeClass('active');
		$next.addClass('active')
	}

	function prevIndicator( $slide, pos ){
		var $indicators = $slide.find('.wae-slider-indicators');
		if ( !$indicators.length ) return;
		var $active = $indicators.find('.active');
		var $prev = typeof pos == 'undefined' ? $active.prev('li') :
					$slide.find('li:nth-child('+pos+')') ;
		if ( !$prev.length ){
			$prev = $indicators.children(':last-child');
		}
		$active.removeClass('active');
		$prev.addClass('active');
	}

	function contentAppears( $lastActive, $toAnimate ){
		if($lastActive.length){
			if($lastActive.hasClass('per-element')){
				$lastActive.removeClass('fadeOut');
				$lastActive.children().each(function(){
					var $element = $(this);
					var animationType = $element.data('animation');
					if ( typeof animationType == 'undefined' ) animationType = 'move-up';
					$element.removeClass(animationType);
				});
			}else{
				var animationType = $lastActive.data('animation');
				if ( typeof animationType == 'undefined' ) animationType = 'move-up';
				$lastActive.removeClass(animationType + ' fadeOut');
			}
		}
		if($toAnimate.length){
			//single animation
			if( $toAnimate.hasClass('per-element') ){
				var interval = 0;
				$toAnimate.children().each(function(){
					var $element = $(this);
					var animationType = $element.data('animation');
					if ( typeof animationType == 'undefined' ) animationType = 'move-up';
					setTimeout(function(){
						$element.addClass(animationType);
					}, interval);
					interval += 200;
				});
			}else{
				var animationType = $toAnimate.data('animation');
				if ( typeof animationType == 'undefined' ) animationType = 'move-up';
				$toAnimate.addClass(animationType);
			}
		}
	}

}( jQuery ));