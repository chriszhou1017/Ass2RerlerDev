

var pub_pagination=function(container){
		if(!container instanceof $)container=$(container);
		this.container=container;

		var createLayout=function(pageNum,curNum){
			if(pageNum<=1)return;
			let ul=$("<ul class=\'pagination\'></ul>");
			for(let i =0 ,max = pageNum;i<max;i++){
					let pgNum=i+1;
					let li = $("<li class=\'pagination-pills\' value=\'"+pgNum+"\''>"+pgNum+"</li>");
					if(pgNum==curNum)li.addClass("curPage");
					ul.prepend(li);

			}

			container.append(ul);

		}



		this.paginate=function(pageNum,curNum,callback){
				container.empty();
				createLayout(pageNum,curNum);
				$('.pagination-pills').on('click',function(){
						    let btn = $(this);
						    if(btn.hasClass("curPage"))return;
						    let cur_num=btn.attr('value')*1;
							callback(cur_num);
				})
		}



}