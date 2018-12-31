var reset_offset = false;
var ajax_request = false;
var content_type = 'posts';
var offset = 0;
													
function makeHashtag(match, p1, p2, p3, offset, string) {
    return p1+'<span class="hashtag">' + p2 + '</span>'+p3;
};

function reloadWall() {
	if(reset_offset){
		offset = 0;
		reset_offset = false;
	}
	
	$.ajax({
		url: baseURL + 'collab/feed/' + content_type + '/' + offset,
		success: function(response){
			if(response != ''){
				if(offset == 0){
					$('#wallposts').empty();
					$('#wallposts').html(response);
				}
				else{
					$('#wallposts').append(response);
				}
				
				offset += 10;
				$('.load-more').show();
				$('.no-more').hide();
				
				$.each($('.comment'),function(i,el){
					initMentions('#'+el.id);
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
						query = query.toLowerCase();
						console.log(query);
						ajax_request = $.getJSON(endpoint, {term: query}, function(responseData){
							
							found = _.filter(responseData, function(item) { return item.name.toLowerCase().indexOf(query) > -1; });

							callback.call(this, found);
							ajax_request = false;
						});
					}
				});
				*/
			}
			else{
				$('.lnkLoadMore').hide();
				$('.no-more').show();
			}
		}
	});
};

function reloadReplies(ref) {
	$.post(baseURL + 'collab/feed/comments', {ref_id:ref}, function(response){
		$('#comments_' + ref).empty();
		$('#comments_' + ref).html(response);
	});
}

$(document).ready(function(){

	var curImages = new Array();

	$('#story').liveUrl({
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
                $('#story').trigger('clear'); 
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
  
  
    $('.liveurl ').on('click', '.controls .button', function() 
    {
        var self        = $(this);
        var liveUrl     = $(this).parents('.liveurl');
        var content     = liveUrl.find('.image');
        var images      = $('img', content);
        var activeImage = $('img.active', content);
        if (self.hasClass('next')) 
             var elem = activeImage.next("img");
        else var elem = activeImage.prev("img");

        if (elem.length > 0) {
            activeImage.removeClass('active');
            elem.addClass('active');  
            liveUrl.find('.thumbnail .current').text(elem.index() +1);
            
            if (elem.index() +1 == images.length || elem.index()+1 == 1) {
                self.addClass('inactive');
            }
        }
        if (self.hasClass('next')) 
             var other = elem.prev("img");
        else var other = elem.next("img");
        
        if (other.length > 0) {
            if (self.hasClass('next')) 
                   self.prev().removeClass('inactive');
            else   self.next().removeClass('inactive');
       } else {
            if (self.hasClass('next')) 
                   self.prev().addClass('inactive');
            else   self.next().addClass('inactive');
       }
       
       
       
    });

	//post story
	$('body').on('click', '#btnPost', function(e) {
		e.preventDefault();

		var l = Ladda.create(this);
	 	l.start();

	 	var ref = $(this).data('ref');
	 	var type = $(this).data('type');
	 	var question = ''; //$('#fNewPost #question').val();
	 	var category = ''; //$('#fNewPost #category').val();
		var tags = $('#fNewPost #tags').val();
		var tagged_users = [];
		
		//obtengo IDs de usuarios tagueados
		$.each($('#fNewPost #amigos-list .usr'),function(i,el){
			tagged_users.push($(el).find('a').attr('rel'));
		});
				
		var mentions = $.jMentions.getResults('#story');
		var tags = $.jMentions.getTags('#story');
		var story = $('#story').html();
				
		/*
		$('#story').textntags('val', function(story){
			$('#story').textntags('getTagsMapFacebook', function(mentions){
		*/
				var data = $('#fNewPost').serializeArray();
				var attach_names = $('#fNewPost .form-cta input[type="text"]').serializeArray();

				$.post(
                    baseURL + 'collab/feed/post',
                    {
						tagged_users:tagged_users,
						tags:tags,
                        story:story,
                        mentions:mentions,
                        attachments:data,
                        attachments_names:attach_names,
                        ref:ref,
                        type:type,
                        link_title: $('#fNewPost .liveurl .title').text(),
                        link_description: $('#fNewPost .liveurl .description').text(),
                        link_url: $('#fNewPost .liveurl .url').text(),
                        link_image: $('#fNewPost .liveurl .image img.active').attr('src'),
                        question:question,
                        category:category
                    }, 
                    function(response){

    					if (response.result == 'success') {
    						//$('#story').textntags('reset');
    						$('#story').html('');
							$('#attachments').empty();
							reset_offset = true;
							reloadWall();
    					}
    					else if (response.result == 'failed') {
    						bootbox.alert(response.error);
							l.stop();
							return false;
    					}

    					l.stop();

						//close liveurl box
						$('#fNewPost .liveurl .close').trigger('click');
				
    					if (typeof onAfterPost == 'function') { 
    					 	//onAfterPost();
    					}

    				}, "json"
                );

		/*
			});
		});
		*/

	});
    
	/*//no se usa mas el enter para publicar
	$('body').on('keypress', '.comment', function(e) {
  		if (e.which == 13) {
  			ref = $(this).data('ref');

  			me = $(this);
  			$(me).attr('disabled', 'disabled');
			
			var mentions = $.jMentions.getResults('#' + $(me).attr('id'));
			var tags = $.jMentions.getTags('#' + $(me).attr('id'));
			var story = $(me).html();
		
					$.post(baseURL + 'collab/feed/post', {tags:tags, story:story, mentions:mentions, ref:ref}, function(response){

						$(me).removeAttr('disabled');
						if (response.result == 'success') {
							//$(me).textntags('reset');
							$(me).html('');

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
			ref = $(me).data('ref');
  			$(me).attr('disabled', 'disabled');
			
			var mentions = $.jMentions.getResults('#' + $(me).attr('id'));
			var tags = $.jMentions.getTags('#' + $(me).attr('id'));
			var story = $(me).html();
		
					$.post(baseURL + 'collab/feed/post', {tags:tags, story:story, mentions:mentions, ref:ref}, function(response){

						$(me).removeAttr('disabled');
						if (response.result == 'success') {
							//$(me).textntags('reset');
							$(me).html('');

							reloadReplies(ref);
						}

					}, "json");
	

		    return false;
		});

	//upload files for STORY POST FORM
	var _file = document.getElementById('attachment');
	var files = new Array();
	var requests = new Array();

	var upload = function(){
	    if(_file.files.length === 0){
	        return;
	    }

		$('#attachments').show();
		
	    for (i=0; i<_file.files.length; i++) {

	    	code = Math.random().toString(36).substring(7);

			//'<div class="col-xs-2" style="display:none;"><img class="img-responsive attach_'+code+'" src="" alt=""/></div>' + 
			$('#attachments').append('' + 
				'<div class="form-cta adjunto row" id="' + code + '">' + 
					'<div class="col-xs-2" style="display:none;"><img class="img-responsive attach_'+code+'" src="" alt=""/></div>' + 
					'<div class="col-xs-5"><input type="text" name="attachments_names[]" class="attachments_names" placeholder="Insira o nome para o arquivo" value=""/></div>' + 
					'<div class="col-xs-5">' + _file.files[i].name + '</div>' + 
					'<div class="col-xs-4 pr">' + 
						'<div class="progress_outer"><div id="progress_' + code + '" class="progress"></div></div>' + 
					'</div>' + 
					'<div class="col-xs-2"><a href="#" class="cancel lnkCancelUpload" data-code="' + code + '"><i class="material-icons">&#xE14C;</i></a></div>' + 
				'</div>' + 
			'');

		    var data = new FormData();
		    data.append('attachment', _file.files[i]);

		    // Agregamos un valor al post para guardar desde que sección se subió el archivo
		    // current la seteamos en el footer en base a una constante de CI
		    if(current_section) {
		    	data.append('section', current_section);	
		    }
		    

		    files[i] = code;
		    requests[i] = new XMLHttpRequest();

		    //Referencia a la fila del adjunto
		    requests[i].code = code;
		    requests[i].upload.code = code;

		    requests[i].onreadystatechange = function(i){
		        if(this.readyState == 4){
		            try {
		                var resp = $.parseJSON(this.response);
						$('#attachments').append('<input type="hidden" name="attachments[]" id="attachment_' + this.code + '" value="' + resp.code + '" />');
						
						var aux_src = resp.src;
						aux_src = aux_src.split('.');
						
						//solo si es un tipo de imagen le muestro el preview
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

		    requests[i].upload.addEventListener('progress', function(e){
		    	$('#progress_' + this.code).css('width', Math.ceil(e.loaded/e.total) * 100 + '%');
		    }, false);

		    requests[i].open('POST', baseURL + 'media/upload');
		    requests[i].send(data);
		}
	}

    $('body').on('click', '.lnkCancelUpload', function(e){
    	e.preventDefault();
    	code = $(this).data('code');
    	for (i=0; i<requests.length; i++) {
    		if (requests[i].code == code) {
    			requests[i].abort();
    			break;
    		}
    	}

    	$('#progress_' + code).parent().remove();
    	$('#attachment_' + code).remove();
    	$('#' + code).remove();
    });


	$('#uploader').load(function(){
		content = $('#uploader').contents().find('body').html();
		if (content != '') {
			response = $.parseJSON(content);
			if (response.result == 'success') {
				$('#attachments').append('<div class="form-cta adjunto">' + response.file.name + '<a href="#" class="cancel lnkCancel" data-code="' + response.file.code + '"><i class="material-icons">&#xE14C;</i></a><input type="hidden" name="attachments[]" value="' + response.file.code + '" /></div>');
			}
		}
	});

	$('#attachment').change(function(){
		upload();
        //$('#fNewPost').submit();
	});

	initMentions('#story');
	/*
	$('#story').textntags({
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

        	query = query.toLowerCase();
       		ajax_request = $.getJSON(endpoint, {term: query}, function(responseData){
       				
       			found = _.filter(responseData, function(item) { return item.name.toLowerCase().indexOf(query) > -1; });

       			callback.call(this, found);
       			ajax_request = false;
       		});
        }
    });
	*/
	
	$('body').on('click', '.lnkFrmContent', function(e){
		e.preventDefault();
		
		if($(this).hasClass('disabled')){
			return false;
		}
		
		var type = $(this).attr('data-type');
		switch(type){
			case "story":
				$('.form-content-tip, .form-content-question').hide();
				$('.form-content-story').fadeIn(1000);
			break;
			case "tip":
				$('.form-content-story, .form-content-question').hide();
				$('.form-content-tip').fadeIn(1000);
			break;
			case "question":
				$('.form-content-tip, .form-content-story').hide();
				$('.form-content-question').fadeIn(1000);
			break;
		}
	});
	
	//show/hide notify and tags widget on Feed form
	$('body').on('click', '.lnkToggleTags', function(e){
		e.preventDefault();
		if( $('.tagsTo').hasClass('hidden') ){
			$('.tagsTo').removeClass('hidden');
		}
		else{
			$('.tagsTo').addClass('hidden');
		}
	});
	
	$('body').on('click', '.lnkToggleNotify', function(e){
		e.preventDefault();
		if( $('.notifyTo').hasClass('hidden') ){
			$('.notifyTo').removeClass('hidden');
		}
		else{
			$('.notifyTo').addClass('hidden');
		}
	});
	
	//story form post
	//buscar amigos
	var curImages = new Array();
	$('#amigos').liveUrl({
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
  
	initMentions('#amigos');
	/*
	$('#amigos').textntags({
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

			ajax_request_t = $.getJSON(endpoint, function(responseData){
				query = query.toLowerCase();
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
	$('#amigos').bind('tagsAdded.textntags', function (e, addedTagsList) {
		//console.log('tagsAdded:' + JSON.stringify(addedTagsList));
		//agrego nombre de usuario
		var item = JSON.stringify(addedTagsList);
		var span = "<div class='usr usr"+addedTagsList[0].id+"'>"+addedTagsList[0].name+" | <a href='#' rel='"+addedTagsList[0].id+"' class='lnkDelUsr pull-right'>x</a></div>";
		$('#fNewPost #amigos-list').append(span);
		$('#amigos').val('');
		$('#fNewPost .textntags-beautifier').find('div').text('');
	 });
	 */
	 
	 $('body').on('click','.lnkLoadMore',function(e){
		e.preventDefault();
		reloadWall();
	 }); 
	 
});