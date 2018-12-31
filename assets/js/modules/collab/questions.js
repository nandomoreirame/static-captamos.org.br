var ajax_request_q = false;
$(document).ready(function(){

	$('body').on('click', '.lnkFilter', function(e){
		e.preventDefault();
		$.post(channelURL + 'questions/filters', {type:$(this).data('type'), value:$(this).data('value'), label:$(this).data('label')}, function(data){
			url = channelURL + 'questions';
			/*
			if (window.location.href.indexOf('?') >= 0) {
				url += window.location.href.slice(window.location.href.indexOf('?'));
			}
			*/
			location.href = url;
		});
	});

	$('#btnNewQuestion').click(function(e){
		e.preventDefault();
		$('#titleNewQuestion').hide();
		$('#fQuestion').slideDown();
	});

	if ($('.panel-questions').exists() && $('.panel-questions').hasClass('content-questions')) {
		content_type = 'questions';
	}
	
	//post question
	$('body').on('click', '#btnPostQuestion', function(e) {
		e.preventDefault();

		var l = Ladda.create(this);
	 	l.start();

	 	var ref = $(this).data('ref');
	 	var type = $(this).data('type');
	 	//var question = $('#fNewQuestion #question').val();
	 	var question = '';
	 	var category = $('#fNewQuestion #category').val();
		//var tags = $('#fNewQuestion #tags').val();
		var tagged_users = [];
		
		//obtengo IDs de usuarios tagueados
		$.each($('#fNewQuestion #amigos-list .usr'),function(i,el){
			tagged_users.push($(el).find('a').attr('rel'));
		});
					
		var mentions = $.jMentions.getResults('#story_q');
		var tags = $.jMentions.getTags('#story_q');
		var story = $('#story_q').html();
		
		/*
		$('#story_q').textntags('val', function(story){
			$('#story_q').textntags('getTagsMapFacebook', function(mentions){
		*/
				var data = $('#fNewQuestion').serializeArray();
				var attach_names = $('#fNewQuestion .form-cta input[type="text"]').serializeArray();

				$.post(
                    baseURL + 'collab/feed/post',
                    {
                        tags:tags,
                        tagged_users:tagged_users,
                        story:story,
                        mentions:mentions,
                        attachments:data,
						attachments_names:attach_names,
                        ref:ref,
                        type:type,
                        link_title: $('#fNewQuestion .liveurl .title').text(),
                        link_description: $('#fNewQuestion .liveurl .description').text(),
                        link_url: $('#fNewQuestion .liveurl .url').text(),
                        link_image: $('#fNewQuestion .liveurl .image img.active').attr('src'),
                        question:question,
                        category:category
                    }, 
                    function(response){

    					if (response.result == 'success') {
    						document.getElementById('fNewQuestion').reset();
							$('.lnkNotifyUser').removeClass('selected');
							$('#amigos-list .usr').remove();
							//$('#story_q').textntags('reset');
							$('#story_q').html('');
							$('#attachments_q').empty();
							$('select[name=category]').val(0);
							$('.selectpicker').selectpicker('refresh');
							offset = 0;
							reloadWall();
    					}
    					else if (response.result == 'failed') {
    						bootbox.alert(response.error);
							l.stop();
							return false;
    					}

    					l.stop();

						//close liveurl box
						$('#fNewQuestion .liveurl .close').trigger('click');
				
    					if (typeof onAfterPost == 'function') { 
    					 	onAfterPost();
    					}

    				}, "json"
                );

			
		/*	
			});
		});
		*/

	});

	initMentions('#story_q');
	/*
	$('#story_q').textntags({
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
	*/
	
	//upload files for QUESTION POST FORM
	var _file_q = document.getElementById('attachment_q');
	var files_q = new Array();
	var requests_q = new Array();

	var upload_q = function(){
	    if(_file_q.files.length === 0){
	        return;
	    }

		$('#attachments_q').show();
		
	    for (i=0; i<_file_q.files.length; i++) {

	    	code = Math.random().toString(36).substring(7);

			//'<div class="col-xs-2" style="display:none;"><img class="img-responsive attach_'+code+'" src="" alt=""/></div>' + 
			$('#attachments_q').append('' + 
				'<div class="form-cta adjunto row" id="' + code + '">' + 
					'<div class="col-xs-2" style="display:none;"><img class="img-responsive attach_'+code+'" src="" alt=""/></div>' + 
					'<div class="col-xs-5"><input type="text" name="attachments_names[]" class="attachments_names" placeholder="Insira o nome para o arquivo" value=""/></div>' + 
					'<div class="col-xs-5">' + _file_q.files[i].name + '</div>' + 
					'<div class="col-xs-4 pr">' + 
						'<div class="progress_outer"><div id="progress_' + code + '" class="progress"></div></div>' + 
					'</div>' + 
					'<div class="col-xs-2"><a href="#" class="cancel lnkCancelUpload" data-code="' + code + '"><i class="material-icons">&#xE14C;</i></a></div>' + 
				'</div>' + 
			'');

		    var data = new FormData();
		    // Agregamos un valor al post para guardar desde que seccion se subio el archivo
		    // current la seteamos en el footer en base a una constante de CI
		    if(current_section) {
		    	data.append('section', current_section);	
		    }

		    data.append('attachment', _file_q.files[i]);

		    files_q[i] = code;
		    requests_q[i] = new XMLHttpRequest();

		    //Referencia a la fila del adjunto
		    requests_q[i].code = code;
		    requests_q[i].upload.code = code;

		    requests_q[i].onreadystatechange = function(i){
		        if(this.readyState == 4){
		            try {
		                var resp = $.parseJSON(this.response);
						$('#attachments_q').append('<input type="hidden" name="attachments[]" id="attachment_' + this.code + '" value="' + resp.code + '" />');
						
						var aux_src = resp.src;
						aux_src = aux_src.split('.');
						
						//solo si es un tipo de imagen le muestro el preview
						if(ext_images.indexOf(aux_src[1]) != -1){
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

		    requests_q[i].upload.addEventListener('progress', function(e){
		    	$('#progress_' + this.code).css('width', Math.ceil(e.loaded/e.total) * 100 + '%');
		    }, false);

		    requests_q[i].open('POST', baseURL + 'media/upload');
		    requests_q[i].send(data);
		}
	}

	$('#uploader_q').load(function(){
		content = $('#uploader_q').contents().find('body').html();
			
		if (content != '') {
			response = $.parseJSON(content);
			if (response.result == 'success') {
				$('#attachments_q').append('<div class="form-cta adjunto">' + response.file.src + ' ' + response.file.name + '<a href="#" class="cancel lnkCancel" data-code="' + response.file.code + '"><i class="material-icons">&#xE14C;</i></a><input type="hidden" name="attachments[]" value="' + response.file.code + '" /></div>');
			}
		}
	});

	$('#attachment_q').change(function(){
		upload_q();
	});
	
	$('body').on('click', '#answers_txt', function(e){
		e.preventDefault();
		
		$('body').scrollTo($('#answers').offset().top-180,1000);
	});
	
	$('body').on('click', '#fNewQuestion .lnkCancelUpload', function(e){
		e.preventDefault();
		code = $(this).data('code');
		for (i=0; i<requests_t.length; i++) {
			if (requests_t[i].code == code) {
				requests_t[i].abort();
				break;
			}
		}

		$('#fNewQuestion #progress_' + code).parent().remove();
		$('#fNewQuestion #attachment_' + code).remove();
		$('#fNewQuestion #' + code).remove();
	});
	
	var curImages_q = new Array();
	$('#amigos_q').liveUrl({
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
				curImages_q = new Array();
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
			if (curImages_q.length == 3) return false;

			curImages_q.push(jqImage.attr('src'));
			output.find('.image').append(jqImage);
			
			
			if (curImages_q.length == 1) {
				// first image...
				
				output.find('.thumbnail .current').text('1');
				output.find('.thumbnail').show();
				output.find('.image').show();
				jqImage.addClass('active');
				
			}
			
			if (curImages_q.length == 2) {
				output.find('.controls .next').removeClass('inactive');
			}
			
			output.find('.thumbnail .max').text(curImages_q.length);
		}
	});
  
	initMentions('#amigos_q');
	/*
	$('#amigos_q').textntags({
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
			if (ajax_request_q) ajax_request_q.abort()
			if (triggerChar == '@') {
				endpoint = baseURL + 'collab/members/search';
			}
			else {
				endpoint = baseURL + 'tags/search';
			}

			ajax_request_q = $.getJSON(endpoint, function(responseData){
				query = query.toLowerCase();
				found = _.filter(responseData, function(item) { 
					return item.name.toLowerCase().indexOf(query) > -1; 
				});

				callback.call(this, found);
				ajax_request_q = false;
			});
		}
	});
	*/
	
	/*
	$('#amigos_q').bind('tagsAdded.textntags', function (e, addedTagsList) {
		//console.log('tagsAdded:' + JSON.stringify(addedTagsList));
		//agrego nombre de usuario
		var item = JSON.stringify(addedTagsList);
		var span = "<div class='usr usr"+addedTagsList[0].id+"'>"+addedTagsList[0].name+" | <a href='#' rel='"+addedTagsList[0].id+"' class='lnkDelUsr pull-right'>x</a></div>";
		$('#fNewQuestion #amigos-list').append(span);
		$('#amigos_q').val('');
		$('#fNewQuestion .textntags-beautifier').find('div').text('');
	 });
	 */
});

var onAfterPost = function(){
	if ($('#btnNewQuestion').exists()) {
		$('#fQuestion').slideUp();
		$('#titleNewQuestion').show();
	}
	else {
		if($('#btnPostQuestion').data('ref')){
			$.post(channelURL + 'questions/question_info/' + $('#btnPostQuestion').data('ref'), function(result){
				$('#answers_txt').html(result.answers_txt);
				$('#question_repliers_widget').html(result.repliers);
			}, "json");
		}
	}
}
