var ext_images = ['png','jpg','jpeg','gif','bmp'];

$(document).ready(function(){

	if (typeof reloadWall == 'function') { reloadWall(); }
	
	/* common for tips and questions */
	/* add/remove notification to user */
	$('body').on('click','.lnkNotifyUser', function (e) {
		e.preventDefault();
		var me = $(this);
		var uid = me.attr('rel');
		var name = me.attr('data-name');
		var span = '';
		var form_id = $(this).closest('form').attr('id');
		
		me.toggleClass('selected');
		
		//click sobre icono TODOS
		if(uid == 'all'){
			$('.lnkNotifyUser').removeClass('selected');
				
			if($('#'+form_id+' #amigos-list').find('.usr0').length){
				//saco TODOS
				me.find('i').text('people');
				$('#'+form_id+' #amigos-list .usr0').remove();
			}
			else{
				//agrego TODOS
				me.find('i').text('people_outline');
				$('#'+form_id+' #amigos-list .usr').remove();
				span = "<div class='usr usr0'>Tudos | <a href='#' rel='0' class='lnkDelUsr pull-right'>x</a><input type='hidden' name='tagged_users[all]' value='all'/></div>";
			}
		}
		else{
			//cada usuario
			if($('#'+form_id+' #amigos-list').find('.usr'+uid).length){
				$('#'+form_id+' a[rel="all"] i').text('people');
				
				//saco user
				$('#'+form_id+' #amigos-list .usr'+uid).remove();
			}
			else{
				$('#'+form_id+' a[rel="all"] i').text('people');
				
				//agrego user
				$('#'+form_id+' #amigos-list .usr0').remove();
				span = "<div class='usr usr"+uid+"'>"+name+" | <a href='#' rel='"+uid+"' class='lnkDelUsr pull-right'>x</a></div>";
			}
		}
		$('#'+form_id+' #amigos-list').append(span);
	 });
		
	/* remove user from notifications list */
	$('body').on('click','.lnkDelUsr', function (e) {
		e.preventDefault();
		var id = $(this).attr('rel');
		var form_id = $(this).closest('form').attr('id');
		$('#'+form_id+' .usr'+id).remove();
	 });
		
});