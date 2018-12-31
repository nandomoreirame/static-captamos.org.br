$(document).ready(function(){
	
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

	$('.lnkDisplay').on('click', function(e){
		e.preventDefault();
		$.post(baseURL + 'collab/tips/switch_display', {display:'switch'}, function(){
			location.reload();
		});
	});
	
	$('body').on('click', '.lnkFilter', function(e){
		e.preventDefault();
		$.post(baseURL + 'collab/tips/filters', {type:$(this).data('type'), value:$(this).data('value'), label:$(this).data('label')}, function(data){
			location.reload();
		});
	});
	
	//solo para la interna de tip
	if($('#tip_id').length){
		//me fijo si el usuario califico el tip
		get_calification($('#tip_id').val());
		//me fijo si el usuario tiene el tip como favorito
		is_favorite($('#tip_id').val());
	}
	
});