var members;
var ajax_request = false;

function load()
	{
		gapi.client.setApiKey('AIzaSyAOSkQmOqK5ORcLZHYukQHoFnDKFmLzlLI'); //get your ownn Browser API KEY
		gapi.client.load('urlshortener', 'v1',function(){});
		
	}
window.onload = load;

function reloadReplies(ref) {
	$.post(baseURL + 'collab/feed/comments', {ref_id:ref}, function(response){
		$('#comments_' + ref).empty();
		$('#comments_' + ref).html(response);
	});
}

function init_owl_attachments(){
	if($(".owl-attachments").length){
		$(".owl-attachments").owlCarousel({ 
		  items         : 1,
		  singleItem    : true,
		  nav           : true,
		  navText       : ["<i class='material-icons slide-prev'>navigate_before</i>","<i class='material-icons slide-next'>navigate_next</i>"]  
		});
	}
	
	if($( '.swipebox-attachments' ).length){
		$( '.swipebox-attachments' ).swipebox({hideBarsDelay : 0});
	}
}

$(document).ready( function(){
  
  if (reqlogin) {
  	$('.lnkMemberTip').addClass('reqlogin');
  }

  if (showlogin) {
  	$.post(baseURL + 'auth/pop_login', function(data){
		$.fancybox.open({
			padding: 0,
			closeBtn: false,
			content: data
		});
	});
  }

  $('body').on('click', '.reqlogin, .reqlogin *', function(e){
  	if (reqlogin != '') {
	  	e.preventDefault();
	  	e.stopPropagation();

			$.post(baseURL + 'auth/pop_login', function(data){
				$.fancybox.open({
					padding: 0,
					closeBtn: false,
					content: data
				});
			});

	  	throw new Error('Must login');
	  }
  });

  $('body').on('click', '.restorePass', function(e){
  	e.preventDefault();
  	e.stopPropagation();
	var code = $(this).attr('data-code');
	$.post(baseURL + 'auth/reset_form/' + code, function(data){
		$.fancybox.open({
			padding: 0,
			closeBtn: false,
			content: data
		});
	});

  	//throw new Error('Must login');
  });

  $('body').on('click', '.reqsignup', function(e){
  	e.preventDefault();
  	e.stopPropagation();

	$.post(baseURL + 'auth/pop_signup', function(data){
		$.fancybox.open({
			padding: 0,
			closeBtn: false,
			content: data
		});
	});

  	throw new Error('Must sign up');
  });  

  /* LOGIN SCRIPTS */
	$('body').on('click', '.fbclose', function(e){
		e.preventDefault();
		$.fancybox.close();
	});

	$('body').on('click', '.btn-fbconnect', function(e){
		e.preventDefault();
		$.fancybox.showLoading();
		FB.login(function(response) {
			$.post(baseURL + 'auth/fbconnect', {access_token:response.authResponse.accessToken}, function(response){
				if (response.result == 'failed') {
					$.post(baseURL + 'auth/pop_signup', function(data){
						$.fancybox.open({
							padding: 0,
							closeBtn: false,
							content: data
						});
					});					
				}
				else {
					$.fancybox.close();
					location.reload();					
				}
			}, "json");
		}, {scope: 'email'});		
	});

	$('body').on('click', '.btn-login', function(e){
		e.preventDefault();
		$.post(baseURL + 'auth/login', $('#fLogin').serialize(), function(response){
			if (response.result == 'success') {
				$.fancybox.close();
				location.reload();
			}
			else {
				$('#error-login').text(response.error).show();
			}
		}, "json");
	});

	$('body').on('click', '.btn-forgot', function(e){
		e.preventDefault();
		$('#titLogin').fadeOut(400, function(){
			$('#titPassword').fadeIn(400);
		});
		$('#section-login').slideUp(400, function(){
			$('#section-password').slideDown(400);
		});
	});

	$('body').on('click', '.btn-cancel-forgot', function(e){
		e.preventDefault();
		$('#titPassword').fadeOut(400, function(){
			$('#titLogin').fadeIn(400)
		});
		$('#section-password').slideUp(400, function(){
			$('#section-login').slideDown(400);
		});				
	});

	$('body').on('click', '.btn-recover', function(e){
		e.preventDefault();
		$.post(baseURL + 'auth/recover', $('#fPassword').serialize(), function(response){
			if (response.result == 'success') {
				$('#section-password').hide();
				$('#section-password-sent').show();
			}
			else {
				$('#error-password').text(response.error).show();
			}
		}, "json");
	});

	$('body').on('click', '.btn-back-login', function(e){
		e.preventDefault();
		$('#section-password-sent').slideUp(400, function(){
			$('#section-login').slideDown(400);
		});
	});

	$('body').on('click', '.btn-signup', function(e){
		e.preventDefault();
		$.post(baseURL + 'auth/pop_signup', function(data){
			$.fancybox.open({
				padding: 0,
				closeBtn: false,
				content: data
			});
		});
	});

	$('body').on('click', '.btn-register', function(e){
		e.preventDefault();
		$.post(baseURL + 'auth/create', $('#fSignup').serialize(), function(response){
			if (response.result == 'success') {
				if (response.message == '') {
					$.fancybox.close();
					location.reload();
				}
				else {
					$('#section-signup').hide();
					$('#section-verification').show();
					$.fancybox.update();
				}
			}
			else {
				$('#error-signup').text(response.error).show();
			}
		});
	});

	$('body').on('click', '.btn-accept', function(e){
		e.preventDefault();
		$.fancybox.close();
	});
  /* END LOGIN SCRIPTS */  

  //btn get next activity
  $('body').on('click', '.btnNextAct', function(e){
	e.preventDefault();
		
	$('.btnNextAct span').text('carregando...').attr('disabled','disabled');
	
	var program_id = $(this).data('programid');
	var activity_id = $(this).data('activityid');

	var text = $(this).text();
	
	$.post(baseURL + 'learn/activities/get_next_activity', {program: program_id, activity: activity_id}, function(data){
		if(data.redirectURL){			
			location.href = data.redirectURL;			
		}
		else {
			$('.btnNextAct').text(text).removeAttr('disabled');
		}
	},'json');
  });
  
  //btn get prev activity
  $('body').on('click', '.btnPrevAct', function(e){
	e.preventDefault();
		
	$('.btnPrevAct span').text('carregando...').attr('disabled','disabled');
	
	var program_id = $(this).data('programid');
	var activity_id = $(this).data('activityid');

	var text = $(this).text();
	
	$.post(baseURL + 'learn/activities/get_prev_activity', {program: program_id, activity: activity_id}, function(data){
		if(data.redirectURL){
			location.href = data.redirectURL;			
		}
		else {
			$('.btnNextAct').text(text).removeAttr('disabled');
		}
	},'json');
  });  
  


	//captamos profile not trigger link
	$('body').on('click', 'a[data-id="1108"]', function(e){
		e.preventDefault();
		
		$.get(baseURL + 'help/contact', function(data){
			if(data){
				bootbox.dialog({
				  title: "Contatar o facilitador",
				  message: data
				});
			}
		});
		
		return false;
	});

	if($('#current_module').length){
		$('.panel-title a[href="#modulo'+$('#current_module').val()+'"]').trigger('click');
	}
	
	init_owl_attachments();
	
	$('#main-navbar-notif').slimScroll({ height: '' });

	$('[data-toggle="tooltip"]').tooltip();

	$('body').on('click', '.fancybox', function(e){
		e.preventDefault();
		$.fancybox.open('<img src="' + $(this).attr('href') + '" />', {
			afterShow: function(){
				$.fancybox.update();
			}
		});
	});

	$('.fajax').fancybox();
	//$('.fiframe').fancybox();
	
	$('body').on('click', '.fiframe', function(e){
		e.preventDefault();
		var url = $(this).attr('href');
		$.fancybox.open({href:url, type: 'iframe' });
	});

	$('.fancyajax').click(function(e){
		e.preventDefault();
		$.fancybox({
			href : $(this).data('link'),
			type : 'ajax'
		});
	});

	$('#btnInfoGroup').click(function(e){
		e.preventDefault();
		$('.info-group-content').slideToggle();
	});

	//btn grabar_contacto facilitador Captamos
	$('body').on('click', '#btnFC', function(e){
		e.preventDefault();
		
		$.post(baseURL + 'help/save_contact', $('#fContactar').serialize(), function(data){
			if(data.status == 'success'){			
				$('#contactar_form').hide();
				$('#contactar_form_botones').hide();
				$('#contactar_gracias').show();
				$('#contactar_gracias_botones').show();
			}
			else{
				bootbox.alert(data.msg);
			}
		},'json');
	});
	
	//SOBRE NOS CONTACTO footer link
	$('body').on('click', '.lnkContacto', function(e){
		e.preventDefault();
		
		$.get(baseURL + 'help/sobre_nos', function(data){
			if(data){
				bootbox.dialog({
				  title: "Contato",
				  message: data
				});
			}
		});
		
		return false;
	});

	//btn grabar contacto SOBRE NOS CONTACTO
	$('body').on('click', '#btnSNC', function(e){
		e.preventDefault();
		
		$.post(baseURL + 'help/save_sobre_nos', $('#fContactar').serialize(), function(data){
			if(data.status == 'success'){			
				$('#contactar_form').hide();
				$('#contactar_form_botones').hide();
				$('#contactar_gracias').show();
				$('#contactar_gracias_botones').show();
			}
			else{
				bootbox.alert(data.msg);
			}
		},'json');
	});
	
	$('#btnInvite').click(function(e){
		e.preventDefault();
		$.get(baseURL + 'channel/invite', function(data){
			bootbox.dialog({
				title: 'Invitar miembros a este grupo',
				message: data
			});
		});
	});	

	$('body').on('click', '#btnSendInvites', function(e){
		mentions = $('#users').mentionsInput('getMentions');

		$.post(baseURL + 'channel/invite', {users:mentions, emails:$('#invite_emails').val()}, function(){
			bootbox.hideAll();
		});
	});



	$('body').on('click', '.btnFollow', function(e){
		e.preventDefault();
		me = $(this);
		$.post(baseURL + 'collab/members/follow', {ref_id: $(this).data('ref')}, function(response){
			if (response.result == 'success') {
				$(me).toggleClass('btn-primary');
				$(me).toggleClass('btn-secondary').text(response.message);
			}
		}, "json");
	});


	$('.lnkNewChannel').click(function(e){
		e.preventDefault();
		$.get(baseURL + 'channel/create', function(data){
			bootbox.dialog({
				title: 'Crear un nuevo grupo o canal',
				message: data
			});
		});
	});

	$('body').on('click', '#btnCreateChannel', function(e){
		e.preventDefault();
		$('.dialog #error').hide();
		$.post(baseURL + 'channel/update', $('#fCreateChannel').serialize(), function(response){
			if (response.result == 'success') {
				bootbox.hideAll();
				location.href = response.next;
			}
			else {
				$('.dialog #error').html(response.error);
				$('.dialog #error').show();
			}
		}, "json");
	});

	$('#lnkNotifications').click(function(e){
		var me = $(this);
		$.post(baseURL + 'notification/read', function(data){
			me.find('.badge').text('');
		});
	});

	/*
	$('#story').keyup(function (e) {
	    var $this = $(this);

	    //detect space
	    if (e.keyCode == 32) {
	        var innerHtml = $this.html();
	        innerHtml = innerHtml.replace(/(.*[\s|($nbsp;)])(#\w+)(.*)/g, makeHashtag);

	        if(innerHtml !== $this.html()){
	            $this.html(innerHtml)
	                 .focus();

	            setEndOfContenteditable(document.getElementById('story'));
	        }
	    }
	});
	*/

	/*
	members = new Bloodhound({
	  datumTokenizer: Bloodhound.tokenizers.obj.whitespace('name'),
	  queryTokenizer: Bloodhound.tokenizers.whitespace,
//	  prefetch: baseURL + 'members/search?v=1',
	  remote: baseURL + 'members/search?v=1'
	});
	members.initialize();
	*/


	$('body').on('click', '.btnFavorite', function(e){
		e.preventDefault();
		var me = $(this);
		$.post(baseURL + 'favorites/add', {entity:$(this).data('entity')}, function(result){
			if (result.success) {
				if(result.userlike)
					me.addClass('disabled');
				else
					me.removeClass('disabled');
			}
		},'json');
	});

	$('body').on('click', '.btnLike', function(e){
		e.preventDefault();
		var me = $(this);
		$.post(baseURL + 'likes/like', {entity:$(this).data('entity')}, function(result){
			if (result.success) {
				if(result.userlike)
					me.addClass('disabled');
				else
					me.removeClass('disabled');
					
				me.find('.numlikes').text(result.likes);
				/*
				me.closest('likesRow').html(result.content);
				me.text(result.link);
				me.toggleClass('liked');
				*/
				
			}
		},'json');
	});

	$('.selectpicker').selectpicker();

	//home captamos
	if( $('.container-home').length ){
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
		
		$.each($('.comment'),function(i,el){
			initMentions('#'+el.id);
		});
	
		
		/* btn enter para mandar a submitear */
		/* //este enter ya no se usa
		$('body').on('keypress', '.comment', function(e) {
			if (e.which == 13) {
				ref = $(this).data('ref');
				me = $(this);
				
				var mentions = $.jMentions.getResults('#' + $(me).attr('id'));
				var tags = $.jMentions.getTags('#' + $(me).attr('id'));//nuevo
				
				var story = $(this).html();
				
				$(me).attr('disabled', 'disabled');
				
				$.post(baseURL + 'collab/feed/post', {tags:tags, story:story, mentions:mentions, ref:ref}, function(response){

					$(me).removeAttr('disabled');
					if (response.result == 'success') {
						me.html('');

						reloadReplies(ref);
					}

				}, "json");

				return false;
			}
		});
		*/
		
		$('body').on('click', '.btn-comment', function(e) {
			e.preventDefault();
			
			var me = $(this).closest('.comment-data').find('.comment');
			var ref = me.data('ref');
			console.log(me);
			console.log(ref);
			
			var mentions = $.jMentions.getResults('#' + $(me).attr('id'));
			var tags = $.jMentions.getTags('#' + $(me).attr('id'));//nuevo
			
			var story = me.html();
			
			$(me).attr('disabled', 'disabled');
			
			$.post(baseURL + 'collab/feed/post', {tags:tags, story:story, mentions:mentions, ref:ref}, function(response){

				$(me).removeAttr('disabled');
				if (response.result == 'success') {
					me.html('');

					reloadReplies(ref);
				}

			}, "json");

			return false;
		});
		
		/*
		$('.comment').textntags({
			triggers: {'@': {
				uniqueTags   : false,
				syntax       : _.template('@[<%= id %>:<%= type %>:<%= title %>]'),
				parser       : /(@)\[(\d+):([\w\s\.\-]+):([\w\s@\.,-\/#!$%\^&\*;:{}=\-_`~()]+)\]/gi,
				parserGroups : {id: 2, type: 3, title: 4},
			}, '#': {
				uniqueTags   : false,
				syntax       : _.template('#[<%= id %>:<%= type %>:<%= title %>]'),
				parser       : /(#)\[(\d+):([\w\s\.\-]+):([\w\s@\.,-\/#!$%\^&\*;:{}=\-_`~()]+)\]/gi,
				parserGroups : {id: 2, type: 3, title: 4},
			}},
			onDataRequest:function (mode, query, triggerChar, callback) {
				if (ajax_request) ajax_request.abort()
				if (triggerChar == '@') {
					endpoint = baseURL + 'collab/members/search';
				}
				else {
					endpoint = baseURL + 'tags/search';
				}

				ajax_request = $.getJSON(endpoint, function(responseData){
					query = query.toLowerCase();
					found = _.filter(responseData, function(item) { return item.name.toLowerCase().indexOf(query) > -1; });

					callback.call(this, found);
					ajax_request = false;
				});
			}
		});
		
		$('body').on('keypress', '.comment', function(e) {
			if (e.which == 13) {
				ref = $(this).data('ref');

				me = $(this);
				$(me).attr('disabled', 'disabled');
				$(me).textntags('val', function(story){
					$(me).textntags('getTagsMapFacebook', function(mentions){

						$.post(baseURL + 'collab/feed/post', {story:story, mentions:mentions, ref:ref}, function(response){

							$(me).removeAttr('disabled');
							if (response.result == 'success') {
								$(me).textntags('reset');

								reloadReplies(ref);
							}

						}, "json");

					});
				});

				return false;
			}
		});
		*/

		$('.owl-carousel').owlCarousel({
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
					items:7,
					nav:true,
					loop:true
				}
			}
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
	}

	/* para saber qué tecla apreto */
	$('body').on('keydown', '.publish-message', function(e) {
		if (e.keyCode == 51) {
			is_tagging = true;
		}
		else if (e.keyCode == 18) {
			is_tagging = false;
		}
		
	});
		
	$('.sobre-nos .owl-carousel').owlCarousel({
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
				nav:true,
				loop:true
			},
			1000:{
				items:7,
				nav:true,
				loop:true
			}
		}
	});

	$('.lnkMember').click(function(e){
		e.preventDefault();
		var me = $(this);
		if ($(this).hasClass('open')) {
			me.closest('.panel').find('.member-info').slideUp();
			$(this).removeClass('open');
		}
		else {
			$('.lnkMember').removeClass('open');
			$(this).addClass('open');

			$.post(baseURL + 'sobrenos/profile/' + $(this).data('ref'), function(data){
				me.closest('.panel').find('.member-info').html(data);
				me.closest('.panel').find('.member-info').slideDown();
			});
		}
	});

	$('#btnEditBackground').click(function(e){
		e.preventDefault();
		$.get(baseURL + 'profile/edit/picture/texture', function(data){
			bootbox.dialog({
				title: lang['Cambiar imagen de portada'],
				message: data
			});
		});
	});

	$('#btnEditProfileImg').click(function(e){
		e.preventDefault();
		$.get(baseURL + 'profile/edit/picture/profile', function(data){
			bootbox.dialog({
				title: lang['Cambiar imagen de perfil'],
				message: data
			});
		});
	});

	var upload = function(){
		var _file = document.getElementById('changePicture');
		var files = new Array();
		var requests = new Array();

	    if(_file.files.length === 0){
	        return;
	    }

		$.fancybox.showLoading()
		
	    for (i=0; i<_file.files.length; i++) {

		    var data = new FormData();
		    data.append('picture', _file.files[i]);

		    // Agregamos un valor al post para guardar desde que sección se subió el archivo
		    // current la seteamos en el footer en base a una constante de CI
		    if(current_section) {
		    	data.append('section', current_section);	
		    }

		    requests[i] = new XMLHttpRequest();

		    requests[i].onreadystatechange = function(i){
		        if(this.readyState == 4){
		            try {
		                var resp = $.parseJSON(this.response);
		                if (resp.result == 'success') {
		                	if (resp.field == 'texture') {
								$.fancybox.hideLoading()
								
		                		//$('#workhub-heading').css('background', 'url(' + resp.url + ')');
		                		var d = new Date();
								var n = d.getTime();
								$('#photo').attr('src', resp.url + '?v='+n);
								$("#photo").dragncrop('destroy');
								init_photo_drag();
								
		                	}
		                	else {
								$.fancybox.hideLoading()
								
								var d = new Date();
								var n = d.getTime();
		                		$('.imgProfile').attr('src', resp.url+'?v='+n);
								
								var src = $('.imgIcoProfile').attr('src');
		                		$('.imgIcoProfile').attr('src', src+'?v='+n);
		                	}

		                	bootbox.hideAll();
		                }
						else{
							$.fancybox.hideLoading()
						}
		            } catch (e){
						$.fancybox.hideLoading()
								
		            	$('.dialog .alert').text(this.responseText);
		            	$('.dialog .alert').show();
		            }
		        }
		    };

			var dd = new Date();
			var nn = dd.getTime();
		    requests[i].open('POST', baseURL + 'media/profile/' + $('#type').val()+'?v='+nn);
		    requests[i].send(data);
			
		}
		
	}

	$('body').on('change', '#changePicture', function(){
		upload();
	});	

	$('body').on('click', 'form .search', function(){
		$(this).closest('form').submit();
	});
	
	//member tooltip
	var timer;
	$('body').on('mouseenter', '.lnkMemberTip', 
		function(e){
			var me = $(this);
			var id = $(this).attr('data-id');
			
			var winheight = window.innerHeight;
			var curpos = getPosition(this);
				
			timer = setTimeout(function(){
				
				$.get(baseURL+'collab/members/memberData/'+id,function(data){
					if(data){
						$(me).append('<div class="box-tooltip">'+data+'</div>');
						
						//para mostrar el tooltip en la mitad superior o inferior de la pantalla
						if(curpos.y < winheight/2){
							//muestro abajo
							me.find('.box-tooltip').addClass('posB');
						}
					}
				});
			},300);
		}
	);
	$('body').on('mouseleave', '.lnkMemberTip', 
		function(e){
			$(this).find('.box-tooltip').remove();
			clearTimeout(timer);
		}
	);
	
	
	if($('#photo').length){
		$('#offset').val('0');
		init_photo_drag();
		
		$(document).on('click','#btnSaveDrag',function(e){
			e.preventDefault();
			var height_ratio = $('#height_ratio').val();
			var offset = $('#offset').val();
			
			$.post(baseURL + 'profile/feed/save_portada', {offset:offset, height_ratio:height_ratio}, function(response){
				if(response.success){
					bootbox.alert(response.msg);
				}
			}, "json");
		});
	}
	
	//para calificar generico
	$('.calification a').hover(
		function(){
			var me = $(this);
			if(!me.closest('.calification').hasClass('disabled')){
				var puntaje = me.data('puntaje');
				stars(puntaje,'star');
			}
		},
		function(){
			var me = $(this);
			if(!me.closest('.calification').hasClass('disabled')){
				var puntaje = me.data('puntaje');
				stars(puntaje,'star_border');
			}
		}
	);
	
	$('.calification a').on('click',function(e){
		e.preventDefault();
		var puntaje = $(this).data('puntaje');
		var me = $(this);
		if(!me.closest('.calification').hasClass('disabled')){
			$.post(baseURL + 'califications/add', {entity:$(this).data('entity'), puntaje:$(this).data('puntaje')}, function(result){
				if (result.success) {
					stars(puntaje,'star');
					me.closest('.calification').addClass('disabled');
				}
			},'json');
		}
	});
	
	//denunciar contenido
	$('body').on('click', '.btn-report', function(e){
		e.preventDefault();
		id = $(this).data('id');
		
		bootbox.setLocale('br');
		
		bootbox.confirm("Você quer denunciar conteúdo?", function(result) {
  			if (result) {
  				$.post(baseURL + 'report/content', {id:id}, function(data){
  					if(data.result == 'failed'){
						bootbox.alert(data.error);
					}
					else{
						bootbox.alert(data.message);
					}
  				},'json');
  			}
		}); 
	});
	
	//votar contenido
	$('body').on('click', '.btnVote', function(e){
		e.preventDefault();
		var me = $(this);
		$.post(baseURL + 'votes/vote', {entity:$(this).data('entity')}, function(result){
			if (result.success) {
				if(result.uservote)
					me.addClass('disabled');
				else
					me.removeClass('disabled');
					
				me.find('.numvotes').text(result.votes);
			}
		},'json');
	});

	
	 //filtro de tags
	 $('body').on('click','.lnkFilterTag',function(e){
		e.preventDefault();
		var rel = $(this).attr('data-rel');
		$('#keywords').val(rel);
		$('#navbar form').submit();
	 });
	 
	 //share fb
	 $('body').on('click', '.btnFacebook', function(e){
		e.preventDefault();
		var href = $(this).attr('href');
		FB.ui({
			method: 'share',
			href: href,
		}, function(response){
			
		});
	});

	$('body').on('click', '.btnShare', function(e){
		e.preventDefault();
		return false;
	});
	
	//share tw
	$('body').on('click', '.btnTwitter', function(e){
		e.preventDefault();
		
		var text = $(e.target).attr('data-text');
		var url_original = $(e.target).attr('data-url');
		
		makeShort(url_original);
		
		function makeShort(longUrl) 
		{
		    var request = gapi.client.urlshortener.url.insert({
		    'resource': {
		      'longUrl': longUrl
			}
		    });
		    request.execute(function(response) 
			{
				
				if(response.id != null)
				{
					var href = 'http://twitter.com/share?text=' + (text)+"&url="+response.id;
					
					//window.open(href, "tweet", "height=300,width=550,resizable=1") 
					window.open(href, "_blank");
					
					return false;
				}				
			
		    });
		}

	});
	
	$('body').on('mouseenter', '.btnShare', function(e){
		$(this).find('.box-share').show();
		
	});
	$('body').on('mouseleave', '.btnShare', function(e){
		$(this).find('.box-share').hide();
	});
	
	
	//borrar contenido
	$('body').on('click','.lnkBorrarP',function(e){
		e.preventDefault();
		var ref = $(this).attr('rel');
		var tipo = $(this).attr('data-tipo');
		var redirect = $(this).attr('data-redirect');
		bootbox.dialog({
                title: "Apagar conteúdo",
                message: 'Tem certeza que deseja apagar este conteúdo?',
                buttons: {
                    cancel: {
                        label: "Cancelar",
                        className: "btn-cancel",
                        callback: function () {
                            bootbox.hideAll();
                        }
                    },
                    success: {
                        label: "Aceitar",
                        className: "btn-primary",
                        callback: function () {
                            $.post(baseURL + 'home/borrar_contenido',{id: ref, tipo: tipo, redirect: redirect}, function(data){
								if (data.redirect) {
									bootbox.alert(data.msg,
													function(){
														location.href = data.redirect;
													});
								}
								else{
									$('.conteudo[data-rel="'+ref+'"]').fadeOut();
									bootbox.alert(data.msg);
								}
							}, "json");
                        }
                    }
                }
            }
        );
	});
	
	//form tip embebido en feed
	if(tip_form){
		var ajax_request_t = false;
		init_tip_form();
		
		$('#attachments_t').sortable();	
	}
});

function init_tip_form(){
	$('.selectpicker').selectpicker();
	
	//tips form
	var _file_t = document.getElementById('attachment_t');
	var files_t = new Array();
	var requests_t = new Array();
	
	var upload_t = function(){
		if(_file_t.files.length === 0){
			return;
		}

		$('#attachments_t').show();
		
		for (i=0; i<_file_t.files.length; i++) {
		
			code = Math.random().toString(36).substring(7);

			$('#attachments_t').append('' + 
				'<div class="form-cta adjunto row" id="' + code + '">' + 
					'<div class="col-xs-2" style="display:none;"><img class="img-responsive attach_'+code+'" src="" alt=""/></div>' + 
					'<div class="col-xs-5"><input type="text" name="attachments_names['+i+']" class="attachments_names" placeholder="Insira o nome para o arquivo" value=""/></div>' + 
					'<div class="col-xs-5">' + _file_t.files[i].name + '</div>' + 
					'<div class="col-xs-4 pr">' + 
						'<div class="progress_outer"><div id="progress_' + code + '" class="progress"></div></div>' + 
					'</div>' + 
					'<div class="col-xs-2"><a href="#" class="cancel lnkCancelUpload" data-code="' + code + '"><i class="material-icons">&#xE14C;</i></a></div>' + 
				'</div>' + 
			'');

			var data = new FormData();
			data.append('attachment', _file_t.files[i]);

			files_t[i] = code;
			requests_t[i] = new XMLHttpRequest();

			//Referencia a la fila del adjunto
			requests_t[i].code = code;
			requests_t[i].upload.code = code;

			var num = i;
			requests_t[i].onreadystatechange = function(i){
				if(this.readyState == 4){
					try {
						var resp = $.parseJSON(this.response);
						
						//los pongo dentro de la fila de cada imagen
						$('#attachments_t #'+ this.code).append('<input type="hidden" name="attachments[]" id="attachment_' + this.code + '" value="' + resp.code + '" />');
						
						var aux_src = resp.src;
						aux_src = aux_src.split('.');
						
						//solo si es un tipo de imagen le muestro el preview
						//console.log(ext_images);
						if(ext_images.indexOf(aux_src[aux_src.length-1]) != -1){
							$('.attach_'+this.code).attr('src',resp.src).parent().show();
						}
						else{
							$('.attach_'+this.code).parent().show();
							$('.attach_'+this.code).remove('');
						}
						$('#'+this.code).find('.pr').removeClass('col-xs-4').addClass('col-xs-2');
					} catch (e){
						var resp = {
							status: 'error',
							data: 'Unknown error occurred: [' + this.responseText + ']'
						};
					}
					$('#progress_' + this.code).parent().remove();
				}
			};

			requests_t[i].upload.addEventListener('progress', function(e){
				$('#progress_' + this.code).css('width', Math.ceil(e.loaded/e.total) * 100 + '%');
			}, false);

			requests_t[i].open('POST', baseURL + 'media/upload');
			requests_t[i].send(data);
		}
	}

	$('#uploader_t').load(function(){
		content = $('#uploader_t').contents().find('body').html();
			console.log(content);
		if (content != '') {
			response = $.parseJSON(content);
			if (response.result == 'success') {
				$('#attachments_t').append('<div class="form-cta adjunto">' + response.file.src + ' ' + response.file.name + '<a href="#" class="cancel lnkCancel" data-code="' + response.file.code + '"><i class="material-icons">&#xE14C;</i></a><input type="hidden" name="attachments[]" value="' + response.file.code + '" /></div>');
			}
		}
	});

	$('#attachment_t').change(function(){
		upload_t();
		//$('#fNewTip').submit();
	});

	
	//buscar amigos
	var curImages = new Array();
	$('#amigos_t').liveUrl({
		loadStart : function(){
			$('.liveurl-loader').show();
		},
		loadEnd : function(){
			$('.liveurl-loader').hide();
		},
		success : function(data)
		{
			var output = $('.liveurl');
			output.find('.title').text(data.title);
			output.find('.description').text(data.description);
			output.find('.url').text(data.url);
			output.find('.image').empty();

			output.find('.close').one('click', function() 
			{
				var liveUrl     = $(this).parent();
				liveUrl.hide('fast');
				liveUrl.find('.video').html('').hide();
				liveUrl.find('.image').html('');
				liveUrl.find('.controls .prev').addClass('inactive');
				liveUrl.find('.controls .next').addClass('inactive');
				liveUrl.find('.thumbnail').hide();
				liveUrl.find('.image').hide();
				$('#description').trigger('clear'); 
				curImages = new Array();
			});
			
			output.show('fast');
			
			if (data.video != null) {                       
				var ratioW        = data.video.width  /350;
				data.video.width  = 350;
				data.video.height = data.video.height / ratioW;

				var video = 
				'<object width="' + data.video.width  + '" height="' + data.video.height  + '">' +
					'<param name="movie"' +
						  'value="' + data.video.file  + '"></param>' +
					'<param name="allowScriptAccess" value="always"></param>' +
					'<embed src="' + data.video.file  + '"' +
						  'type="application/x-shockwave-flash"' +
						  'allowscriptaccess="always"' +
						  'width="' + data.video.width  + '" height="' + data.video.height  + '"></embed>' +
				'</object>';
				output.find('.video').html(video).show();
				
			 
			}

			console.log(data);
		},
		addImage : function(image)
		{   
			var output  = $('.liveurl');
			var jqImage = $(image);
			jqImage.attr('alt', 'Preview');
			
			if ((image.width / image.height)  > 7 
			||  (image.height / image.width)  > 4 ) {
				// we dont want extra large images...
				return false;
			} 
			if (curImages.length == 3) return false;

			curImages.push(jqImage.attr('src'));
			output.find('.image').append(jqImage);
			
			
			if (curImages.length == 1) {
				// first image...
				
				output.find('.thumbnail .current').text('1');
				output.find('.thumbnail').show();
				output.find('.image').show();
				jqImage.addClass('active');
				
			}
			
			if (curImages.length == 2) {
				output.find('.controls .next').removeClass('inactive');
			}
			
			output.find('.thumbnail .max').text(curImages.length);
		}
	});
  
	initMentions('#description');
	initMentions('#amigos_t');
	/*
	$('#amigos_t').textntags({
		triggers: {'@': {
			uniqueTags   : false,
			syntax       : _.template('@[<%= id %>:<%= type %>:<%= title %>]'),
			parser       : /(@)\[(\d+):([\w\s\.\-]+):([\w\s@\.,-\/#!$%\^&\*;:{}=\-_`~()]+)\]/gi,
			parserGroups : {id: 2, type: 3, title: 4},
		}, '#': {
			uniqueTags   : false,
			syntax       : _.template('#[<%= id %>:<%= type %>:<%= title %>]'),
			parser       : /(#)\[(\d+):([\w\s\.\-]+):([\w\s@\.,-\/#!$%\^&\*;:{}=\-_`~()]+)\]/gi,
			parserGroups : {id: 2, type: 3, title: 4},
		}},
		onDataRequest:function (mode, query, triggerChar, callback) {
			if (ajax_request_t) ajax_request_t.abort()
			if (triggerChar == '@') {
				endpoint = baseURL + 'collab/members/search';
			}
			else {
				endpoint = baseURL + 'tags/search';
			}
			query = query.toLowerCase();
			ajax_request_t = $.getJSON(endpoint, {term: query}, function(responseData){
				
				found = _.filter(responseData, function(item) { 
					return item.name.toLowerCase().indexOf(query) > -1; 
				});

				callback.call(this, found);
				ajax_request_t = false;
			});
		}
	});
	*/
	
	/*
	$('#amigos_t').bind('tagsAdded.textntags', function (e, addedTagsList) {
		//console.log('tagsAdded:' + JSON.stringify(addedTagsList));
		//agrego nombre de usuario
		var item = JSON.stringify(addedTagsList);
		var span = "<div class='usr usr"+addedTagsList[0].id+"'>"+addedTagsList[0].name+" | <a href='#' rel='"+addedTagsList[0].id+"' class='lnkDelUsr pull-right'>x</a></div>";
		$('#fNewTip #amigos-list').append(span);
		$('#amigos_t').val('');
		$('#fNewTip .textntags-beautifier').find('div').text('');
	 });
	 */
	 
	 $('body').on('click','#btnPostTip',function(e){
		e.preventDefault();
		var l = Ladda.create(this);
		l.start();

		var ref = $(this).data('ref');
		var type = $(this).data('type');
		var tip = $('#fNewTip #tip').val();
		//var description = $('#fNewTip #description').val();
		//var tags = $('#fNewTip #tags').val();
		var category = $('#fNewTip #category').val();
		var tagged_users = [];
		
		//obtengo IDs de usuarios tagueados
		$.each($('#fNewTip #amigos-list .usr'),function(i,el){
			tagged_users.push($(el).find('a').attr('rel'));
		});
		
		var mentions = $.jMentions.getResults('#fNewTip #description');
		var tags = $.jMentions.getTags('#fNewTip #description');
		var story = $('#fNewTip #description').html();
		
		/*
		$('#amigos_t').textntags('val', function(story){
			$('#amigos_t').textntags('getTagsMapFacebook', function(mentions){
		*/
				var data = $('#fNewTip').serializeArray();
				var attach_names = $('#fNewTip .form-cta input[type="text"]').serializeArray();
				
				$.post(
					baseURL + 'collab/tips/post',
					{
						tagged_users:tagged_users,
						tags:tags,
						story:story,
						mentions:mentions,
						attachments:data,
						attachments_names:attach_names,
						ref:ref,
						type:type,
						link_title: $('#fNewTip .liveurl .title').text(),
						link_description: $('#fNewTip .liveurl .description').text(),
						link_url: $('#fNewTip .liveurl .url').text(),
						link_image: $('#fNewTip .liveurl .image img.active').attr('src'),
						tip:tip,
						category:category
					}, 
					function(response){
						if(response.result == 'success'){
							document.getElementById('fNewTip').reset();
							$('.lnkNotifyUser').removeClass('selected');
							$('#amigos-list .usr').remove();
							$('#attachments_t').empty();
							$('select[name=category]').val(0);
							$('.selectpicker').selectpicker('refresh');
						
							if (typeof reloadWall == 'function') { 
								$('#fNewTip #description').html('');
								//cuando se postea desde seccion FEED
								reset_offset = true;
								reloadWall(); 
							}
							else{
								//desde interna de TIPS
								location.reload();
							}
						}
						else{
							bootbox.alert(response.error);
							l.stop();
							return false;
						}
						
						l.stop();
					}, "json"
				);
		/*
			});
		});
		*/

	});
	
	$('body').on('click', '#fNewTip .lnkCancelUpload', function(e){
		e.preventDefault();
		code = $(this).data('code');
		for (i=0; i<requests_t.length; i++) {
			if (requests_t[i].code == code) {
				requests_t[i].abort();
				break;
			}
		}

		$('#fNewTip #progress_' + code).parent().remove();
		$('#fNewTip #attachment_' + code).remove();
		$('#fNewTip #' + code).remove();
	});
}

function getPosition(element) {
    var xPosition = 0;
    var yPosition = 0;
  
    while(element) {
        xPosition += (element.offsetLeft - element.scrollLeft + element.clientLeft);
        yPosition += (element.offsetTop - element.scrollTop + element.clientTop);
        element = element.offsetParent;
    }
    return { x: xPosition, y: yPosition };
}


//para calificar y/o marcar como favorito los contenidos
//funcion para marcar/desmarcar estrellas
function stars(puntaje,text){
	//reseteo a todos
	$('.calification a i').text('star_border');
	
	//marco las que corresponden
	$('.calification a').each(function(i,el){
		if(parseInt($(el).data('puntaje')) <= parseInt(puntaje)){
			$(el).find('i').text(text);
		}
	});
}

//obtengo la calificacion del usuario sobre el contenido, si corresponde
function get_calification(entity_id){
	$.post(baseURL + 'califications/get', {entity:entity_id}, function(result){
		if (result.success) {
			stars(result.puntaje,'star');
		}
	},'json');
}

//obtengo si el contenido es favorito del usuario o no
function is_favorite(entity_id){
	$.post(baseURL + 'favorites/get', {entity:entity_id}, function(result){
		if (result.success) {
			$('.btnFavorite').addClass('disabled');
		}
	},'json');
}

function init_photo_drag(){
	$('#photo').dragncrop({
		overlay: false,
		overflow: false,
		start: function(){
		  //$('#photo-log').css('background', '#ccc')
		},
		drag: function(event, position){
		  console.log('aca3');
		  var img_offset = Math.abs(parseFloat($('#photo').css('top')));
		  $('#offset').val(img_offset);
		  var height_ratio = $('#workhub-heading').height() / $('#photo').height();
		  $('#height_ratio').val(height_ratio);
		},
		stop: function(e){
		  //$('#photo-log').css('background', '#fff')
		}
	});
}

//Plugin de menciones
function initMentions(id) {
	$(id).jMentions({
	  source: function(prefix) {
		if (prefix.length > 2) {
			var dfd = jQuery.Deferred(),
				filteredUsers = [];

				var posturl = baseURL + 'collab/members/search?term=' + prefix
				if(is_tagging){
					posturl = baseURL + 'tags/search?term=' + prefix
				}
				
				  var users = $.post(posturl, function(data){

					data.forEach(function(elm) {

						filteredUsers = filteredUsers.concat(elm);
					  
					});

				  dfd.resolve(filteredUsers);
				}, "json");

			return dfd.promise();
		  }
	  }
  });	
}