var ajax_request_rev = false;

$(document).ready(function(){
		
	//post review
	$('body').on('click', '#btnPostReview', function(e) {
		e.preventDefault();

		var l = Ladda.create(this);
	 	l.start();

	 	var ref = $(this).data('ref');
	 	var type = $(this).data('type');
	 	var referer = $(this).data('referer');
	 	var review = $('#fNewReview #story_rev').val();
	 	var stars = $('#stars').val();
		
		$.post(
			baseURL + 'collab/feed/post',
			{
				tags:'',
				tagged_users:'',
				story:'',
				mentions:'',
				attachments:'',
				ref:ref,
				referer:referer,
				type:type,
				link_title: '',
				link_description: '',
				link_url: '',
				link_image: '',
				review:review,
				stars:stars
			}, 
			function(response){

				if (response.result == 'success') {
					document.getElementById('fNewReview').reset();
					
					if(response.href)
						location.href = response.href;
					else
						location.href = location.href;
				}
				else if (response.result == 'failed') {
					bootbox.alert(response.error);
					l.stop();
					return false;
				}

				l.stop();

			}, "json"
		);

	});

	
	setTimeout(function(){
		$.scrollTo($('.submenu').offset().top-175,2000);
	},2000);
});

function onStarsClick(num){
	$('#stars').val(num[1]);
}