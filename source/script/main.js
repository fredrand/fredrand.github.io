const portfolio = {

	is_home: true,

	cache(){

		this.home_holder_inner = $('.home_holder_inner');
		this.line_art =  $('.line_art');
		this.show_more = $('.show_more');
		this.back_to_home = $('.back_to_home');
		this.scroll_icon =  $('.scroll_icon');
		this.main_nav_item_link = $('.main_nav_item_link');

		this.home = $('#home');
		this.circle_path2 = $('.circle_path2');
		this.skills_holder = $('.skills_holder');
		this.work_title = $('.work_title');
		this.footer = $('#footer');

	},
	bindEvent(){

		const that = this ;

		this.show_more.on('click',()=>{

			this.home_holder_inner.addClass('step_two');
			this.line_art.addClass('is_hidden');
			this.back_to_home.addClass('is_visible');

			this.is_home = false; // toggle back_to_home visibility only on home page
			$('html, body').delay(350).animate( { scrollTop: 0 }, 750 );

		});
		this.back_to_home.on('click',()=>{

			this.home_holder_inner.removeClass('step_two');
			this.line_art.removeClass('is_hidden');
			this.back_to_home.removeClass('is_visible');

			this.is_home = true;

		});
		this.main_nav_item_link.on('click', function(){

			that.smoothScroll( $(this) ) ;

		});
		this.scroll_icon.on('click', function(){

			that.smoothScroll( $(this) ) ;

		});
		window.addEventListener('scroll', ()=>{

			this.animateNavOnScroll();

		})

	},
	smoothScroll( elmt ){

		const page = elmt.attr('href');
		const speed = 750;
		$('html, body').animate( { scrollTop: $(page).offset().top }, speed );

		if( elmt.hasClass( 'main_nav_item_link' )){ // Click on menu link
				
			this.updateActiveMenu.call(this, elmt);

		}else{ // Click on scroll btn
			this.updateActiveMenu.call(this, $('.skill_item'));
		}

		return false;

	},
	updateActiveMenu( elmt ){

		$('.main_nav_item.is_active').removeClass('is_active');
		elmt.parent().addClass('is_active');

	},
	animateNavOnScroll(){

		const that = this;
		// Update active navigation item
		let scroll_distance = $(window).scrollTop();
		$('.page_section').each(function(i) {

				if ($(this).position().top <= scroll_distance) {

					$('.main_nav_item.is_active').removeClass('is_active');
					$('.main_nav_item').eq(i).addClass('is_active');

					// Hide / Show back home button
					if( !that.is_home ){
						if( i == 0){
							that.back_to_home.addClass('is_visible');
						}else if( i == 1){
							that.back_to_home.removeClass('is_visible');
						}
					}

					
				}
		});

	},
	init(){

		this.cache();
		this.bindEvent();

	}
}

const lightbox = {

	current_slide: -1,

	cache(){

		this.lightbox = $('#lightbox');
		this.works = $('.work');
		this.close_lightbox = $('.close_lightbox');
		this.lightbox_slides = $('.lightbox_slide');

		this.prev_btns = $('.nav_prev');
		this.next_btns = $('.nav_next');

	},
	bindEvent(){

		const that = this;

		this.works.on('click', function(){

			const index = $(this).index();

			that.open();
			that.showSlide( index );

		});

		this.close_lightbox.on('click', this.close.bind(this));

		this.prev_btns.on('click', this.swipeWork.bind(this, -1));

		this.next_btns.on('click', this.swipeWork.bind(this, 1));
	},
	open(){
		this.lightbox.addClass('is_visible');
		$('body').addClass('is_fullscreen');
	},
	close(){

		this.lightbox.removeClass('is_visible');
		$('body').removeClass('is_fullscreen');

		this.hideCurrentSlide.call(this, this.current_slide);
	},
	showSlide( index ){

		this.current_slide = index;
		const slide = this.lightbox_slides[ this.current_slide];
		$(slide).addClass('is_visible');
	},
	hideCurrentSlide( index ){

		this.lightbox_slides[ index];
		const slide = this.lightbox_slides[ index ];
		$(slide).removeClass('is_visible');
	},

	time_out: 0,

	swipeWork( n ){

		clearTimeout( this.time_out );

		const slide = this.lightbox_slides[ this.current_slide];
		const img = $(slide).find('.work_fullscreen');
		const txt = $(slide).find('.work_detail_inner');

		fadeOut(()=>{

			this.hideCurrentSlide( this.current_slide );

			if( n == -1 && this.current_slide == 0){ // prev on first slide
				this.current_slide = this.lightbox_slides.length
			}else if( n == 1 && this.current_slide == this.lightbox_slides.length - 1){ // next on last slide
				this.current_slide = -1;
			}
			
			this.showSlide( this.current_slide += n );

		}, 500);
		

		function fadeOut( callback, ms ){

			img.addClass('fade_out');
			txt.addClass('fade_out');

			setTimeout(()=>{

				img.removeClass('fade_out');
				txt.removeClass('fade_out');

				callback();
			}, ms )
		};
	},
	init(){

		this.cache();
		this.bindEvent();
	}
}

const allWorkManager = ()=>{

	const view = $('#view');

	// @content { html } - the page to append to view
	// @parent { html } - the view 
	const updateView = ( content, parent )=>{

		let holder = $('<div class="inner_view"></div>');
		holder.append( content );
		parent.html( holder );
		$('.porfolio_body').addClass('is_visible');
	};

	// Show one project
	// @content { html } - the page retrieved via Ajax
	const showProjectDetails = ( content )=>{
		updateView(  $(content).find('#main_content') , view );
		$('html, body').animate( { scrollTop:0 }, 350 );
	};


	// Load all project masonry
	$.get( 'source/work/all-work.html')
		.done(( content )=> { 
			showProjectDetails( content );
		});
	

	// Loads a work when clicking on a "loader_btn"
	const getProjectContentOnBtnClick = ( loader_btn )=>{
		
		// Delegate click event on loader btn
		// Selector { array } - an array of string selector
		const delegate = ( selector_arr )=>{

			// For each selector, bind an  ajax call on click
			selector_arr.forEach(( selector )=>{

				$(document).on('click', selector , function( evt ){
					evt.preventDefault();

					const work_url = $(this).attr('href');

					// Retrieve portfolio content via Ajax
					$.get( work_url )
						.done(( content )=> {
							showProjectDetails( content );
						})
						.fail(function() {
						   console.log('Ajax error');
						})

				})
			});

			
		};

		delegate( loader_btn );
	};

	getProjectContentOnBtnClick(['.all_work_item a','.pagination_btn', '.close_project']);


	const filterManager = ()=>{
		$(document).on('click', '.portfolio_filter_item > button' , function( evt ){

			const filter = $(evt.target);


			const doc = $(evt.delegateTarget);

			let works = doc.find('.all_work_item');


			$('.portfolio_filter_item').removeClass('is_current');
			filter.parents('.portfolio_filter_item').addClass('is_current');

			// Reset disabled work
			works.removeClass('is_disabled');

			if( filter.hasClass('all')){ 
				return ;
			}else{
				
				works.each(function(i, item){
					const data_filter = filter.attr('data-filter');
					if( !$(item).hasClass( data_filter )){
						$(item).addClass('is_disabled');
					}
				})
			}

		})
	};
	filterManager();


	
};

$(function() {
    portfolio.init();
    lightbox.init();
    allWorkManager();

    $('.loader_holder').addClass('is_hidden');
});
