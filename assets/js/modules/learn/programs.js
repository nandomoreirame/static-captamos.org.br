$(document).ready(function(){

	$('.lnkDisplay').on('click', function(e){
		e.preventDefault();
		$.post(baseURL + 'learn/programs/switch_display', {display:'switch'}, function(){
			location.reload();
		});
	});

	$('body').on('click', '.lnkFilter', function(e){
		e.preventDefault();
		url = window.location.href.replace('#', '') + '/filters';
		$.post(url, {type:$(this).data('type'), value:$(this).data('value'), label:$(this).data('label')}, function(data){
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
		
		if (typeof onStarsClick == 'function') { 
			onStarsClick(rel);
		}
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

	$('.btnProgramSignUp').on('click', function(e){
		e.preventDefault();
		var esto = this;
		
		bootbox.setLocale('br');
		
		bootbox.confirm({
			message: "Você está iniciando o curso, clique em OK para continuar ou CANCELAR para sair.", 
			callback: function(result) {
				if (result) {
					
					var l = Ladda.create(esto);
					l.start();
					$.post(baseURL + 'learn/programs/signup', {program:$(esto).data('program')}, function(){
						location.reload();
					});	
			
				}
  			},
			buttons: {
				'confirm': {
					label: 'OK',
				}
			}
		}); 
		
	});

	if (typeof onPageReady == 'function') { 
	 	onPageReady();
	}

});