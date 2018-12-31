$(document).ready(function(){
	if (typeof reloadWall == 'function') { 
		if($('#noticia_id').length){
			reloadWall(); 
		}
	}
	
	$('#fDesde').datetimepicker({
		format: 'DD/MM/YYYY',
		locale: 'pt-br',
		useCurrent: false
	}).on('dp.change',function(e){
		//post to filter by date
		var d = e.date.format("YYYY-MM-DD");
		$.post(baseURL + 'news/contents/filters', {type:'fDesde', value:'fDesde', label:d, scope:'articles'}, function(data){
			location.reload();
		});
	});
	
	$('#fHasta').datetimepicker({
		format: 'DD/MM/YYYY',
		locale: 'pt-br',
		useCurrent: false
	}).on('dp.change',function(e){
		//post to filter by date
		var d = e.date.format("YYYY-MM-DD");
		$.post(baseURL + 'news/contents/filters', {type:'fHasta', value:'fHasta', label:d, scope:'articles'}, function(data){
			location.reload();
		});
	});
	
	$('.lnkDisplay').on('click', function(e){
		e.preventDefault();
		$.post(baseURL + 'learn/programs/switch_display', {display:'switch'}, function(){
			location.reload();
		});
	});

	$('body').on('click', '.lnkFilter', function(e){
		e.preventDefault();
		//url = window.location.href.replace('#', '') + '/filters';
		$.post(baseURL + 'news/contents/filters', {type:$(this).data('type'), value:$(this).data('value'), label:$(this).data('label'), scope:$(this).data('scope')}, function(data){
			location.reload();
		});
	});

	$('.stars a').hover(
		function(){
			var rel = $(this).attr('rel');
			$(this).parent().addClass(rel);
		},
		function(){
			$(this).parent().removeClass('s1').removeClass('s2').removeClass('s3').removeClass('s4').removeClass('s5');
		}
	);
	
	$('.stars a').on('click',function(e){
		e.preventDefault();
		
		var rel = $(this).attr('rel');
		$(this).parent().removeClass('actives1').removeClass('actives2').removeClass('actives3').removeClass('actives4').removeClass('actives5');
		$(this).parent().addClass('active'+rel);
	});
	
	/* listado de actividades */
	//abro modulo
	$('#modulos-list').on('shown.bs.collapse', function () {
	  var id = $('.panel-collapse.collapse.in').attr('id');
	  
	  //oculto la flecha hacia abajo del heading
	  $('#h'+id+' .info').hide();
	});
	$('#modulos-list').on('hide.bs.collapse', function () {
	  var id = $('.panel-collapse.collapse.in').attr('id');
	  
	  //muestro la flecha hacia abajo del heading
	  $('#h'+id+' .info').show();
	});

	$('.lnkFilterAuthor').click(function(e){
		e.preventDefault();
		$.post(baseURL + 'news/contents/filters', {type:'author', value:$(this).data('author'), label:$(this).data('label'), scope:$(this).data('scope')}, function(data){
			location.href = baseURL + 'news/articles';
		});
	});
	
	$('.owl-articles').owlCarousel({
			nav: true,
			dots: false,
			responsiveClass:true,
			responsive:{
				0:{
					items:1,
					nav:true,
					loop:true
				},
				600:{
					items:3,
					nav:false,
					loop:true
				},
				1000:{
					items:5,
					nav:true,
					loop:true
				}
			}
		});
});