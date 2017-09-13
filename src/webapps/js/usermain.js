const article_data_handler=(function(){

return {
	saveArticle:function(callback){
	let title=$("#article-title").val().trim();
	let author=$("#article-author").val().trim();
	let journal=$("#article-journal").val().trim();
	let year=$("#article-year").val().trim();
	$.ajax({
				contentType:'application/json',
				type:'POST',
            	url:'/article/saveArticle',
            	data:"{\"article\":{\"title\":\""+title+"\",\"author\":\""
            	+author+"\",\"journal\":\""+journal+"\",\"year\":\""+year+"\"}}",
            	dataType:'json',
            	success:function(data){
            		if(data.status=='OK')
            			 callback(true,data);
            		else
            			 callback(false,data);
                },
			    error:function(){
			    	 callback(false,data);
			    }				
			});
	},
	convertApaRef:function(callback){
		let ref = $('#ref-txt').val().trim();
		$.ajax({
				contentType:'application/json',
				type:'POST',
            	url:'/article/convertApaArticle',
            	data:"{\"apa\":\""+ref+"\"}",
            	dataType:'json',
            	success:function(data){
            		if(data.status=='OK')
            			 callback(true,data);
            		else
            			 callback(false,data);
                },
			    error:function(){
			    	 callback(false,data);
			    }				
			});


	}

};
})();

const util_handler=(function(){


	return{
    	toFormSheet:function(){
		let panel =  $('#articlepanel');
		panel.removeClass('reference');
		if(!panel.hasClass('form'))panel.addClass('form');
    	},

    	toRefSheet:function(){
		let panel =  $('#articlepanel');
		panel.removeClass('form');
		if(!panel.hasClass('reference'))panel.addClass('reference');
    	},
		hideAtcDropDown:function(){
    	let dropdown= $('#article-title-dropdown');
    	if(!dropdown.hasClass('hide'))dropdown.addClass('hide');
		},
		showAtcDropDown:function(){
    	let dropdown= $('#article-title-dropdown');
    	if(dropdown.hasClass('hide'))dropdown.removeClass('hide');
		},
		fillInTheForm:function(data){
			let {author,year,title,journal} = data;
			$('#article-author').val(author);
			$('#article-year').val(year);
			$('#article-title').val(title);
			$('#article-journal').val(journal);
		},
		backToFormSheet:function(){
		let panel =  $('#articlepanel');
		panel.removeClass('reference');
		if(!panel.hasClass('form'))panel.addClass('form');
		let formbtn = $('#panel-form-btn');
		let refbtn = $('#panel-ref-btn');
		refbtn.removeClass('active');
		if(!formbtn.hasClass('active'))formbtn.addClass('active');
    	}

	}
})();

$(document).ready(function(){
	$("#article-submit-btn").on("click",function(){
	let btn=$(this);
	if(btn.hasClass("loading"))return;
	btn.removeClass("normal");
	btn.addClass("loading");
	article_data_handler.saveArticle(function(isSuccess,data){
		btn.removeClass("loading");
		btn.addClass("normal");
		if(isSuccess){
			console.log("success saving article :"+JSON.stringify(data.msgBody));
		}

		});	
	});
	$('.panel-switch-btn').on('click',function(){
		let btn=$(this);
		if((btn).hasClass('active'))return;
		$('.panel-switch-btn').removeClass('active');
		btn.addClass('active');
		let link = btn.attr("link");
		if(link=='ref')
			util_handler.toRefSheet();
		else if(link=='form')
			util_handler.toFormSheet();
	});
	$('.atc-dropdown-pills').on('click',function(){
		let btn=$(this);
		let value = btn.attr("value");
		let key = btn.attr("key"); 
		let bar = $('#ref-type');
		bar.addClass("value");
		bar.attr("value",value);
		bar.html(key);
		util_handler.hideAtcDropDown();
	});
	$('#ref-type').on('click',function(){
		let btn = $(this);
		util_handler.showAtcDropDown();
	});
	$('#ref-convert-btn').on('click',function(){
		let type = $('#ref-type');
		let ref_type = type.attr("value");
		if(ref_type == 'apa'){
			let btn=$(this);
			if(btn.hasClass("loading"))return;
			btn.removeClass("normal");
			btn.addClass("loading");
			article_data_handler.convertApaRef(function(isSuccess,data){
					btn.removeClass("loading");
					btn.addClass("normal");
					console.log(data);
					util_handler.fillInTheForm(data.msgBody);
					util_handler.backToFormSheet();
			});
		}

	});




});
