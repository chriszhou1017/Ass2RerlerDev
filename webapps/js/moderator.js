let pagination;
const article_moderator_data_handler=(function(){
		let pageSize=5;
	return{
		retrieveArticles:function(pageNum,callback){
			$.ajax({
				contentType:'application/json',
				type:'GET',
            	url:'/article/pageUnselectedArticle?pageNum='+pageNum+'&pageSize='+pageSize,
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
		passArticle:function(ids,callback){
			$.ajax({
				contentType:'application/json',
				type:'POST',
				data:"{\"ids\":"+JSON.stringify(ids)+"}",
            	url:'/article/passArticle',
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
		rejectArticle:function(ids,callback){
			$.ajax({
				contentType:'application/json',
				type:'POST',
				data:"{\"ids\":"+JSON.stringify(ids)+"}",
            	url:'/article/rejectArticle',
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
	}


})();
const moderator_util_handler=(function(){
	let showLoadingMask=function(){
				let mask = $("#loading-mask");
				mask.removeClass("normal");
				mask.removeClass("operating");
				mask.removeClass("loading");
				mask.addClass("loading");
		};
	let showNormalMask=function(count){
				if(count||count==0){
				let count_con=$("#normal-info-count");
				count_con.html(count);
					}
				let mask = $("#loading-mask");
				mask.removeClass("normal");
				mask.removeClass("operating");
				mask.removeClass("loading");
				mask.addClass("normal");
		};
	let showOperatingMask=function(count){
				let count_con= $("#select-info-count");
				count_con.html(count);
				let mask = $("#loading-mask");
				mask.removeClass("normal");
				mask.removeClass("operating");
				mask.removeClass("loading");
				mask.addClass("operating");
	};
	var selected_list=[];
	return{
		refreshList:function(){
			if(selected_list.length!=0)selected_list=[];
			let btns=$(".selected");
			for(let i=0,max=btns.length;i<max;i++){
				let btn=$(btns[i]);
				let id = btn.attr("id");
				selected_list.push(id);
			}
			return selected_list.length;
		},
		getSelected_list:function(){
			return selected_list;
		},
		makeTable:function(pageNum){
			showLoadingMask();
			let table_container = $("#table-list");
			table_container.empty();
			article_moderator_data_handler.retrieveArticles(pageNum,function(isSuccess,data){
				if(isSuccess){
					let {msgBody}=data;
					let {results}=msgBody;
					let {count}=msgBody;
					let {pageCount}=msgBody;
					pageCount=Math.ceil(pageCount);
						showNormalMask(count);
					for(let i =0, max=results.length;i<max;i++){
						let obj=results[i];
						let tr = $("<tr></tr>");
						let title;
						(obj.title=="")?title = "N/A":title = obj.title;
						tr.append($("<td></td>").text(title));
						let author;
						(obj.author ==""||obj.author==null)?author = "N/A":author = obj.author;
						tr.append($("<td></td>").text(author));
						let journal ;
						(obj.journal ==""||obj.journal==null)?journal= "N/A":journal = obj.journal;
						tr.append($("<td></td>").text(journal));
						let year ;
						(obj.year ==""||obj.year==null)?year = "N/A":year = obj.year;
						tr.append($("<td></td>").text(year));
						table_container.append(tr);
						let id;
						(obj._id ==""||obj._id==null)?id = '':id = obj._id;
						tr.append($("<td id=\'"+id+"\' class=\'opr_btn unselect\' onclick=\'moderator_util_handler.operateArticle(this)\'>"
							+"<img class=\'list-operate-btn unselect\'src=\'./testImg/unselect_opr.png\'>"+
							  "<img class=\'list-operate-btn select\'src=\'./testImg/select_opr.png\'></td>"));
						table_container.append(tr);
					}
					pagination.paginate(pageCount,pageNum,function(cur_number){
							moderator_util_handler.makeTable(cur_number);
					});
				}
			});
		},
		operateArticle:function(btn){
			btn=$(btn);
			if(btn.hasClass('selected')){
				btn.removeClass('selected');
				btn.addClass('unselect');
			}
			else{		
				btn.removeClass('unselect');
				btn.addClass('selected');
			}
			let num=moderator_util_handler.refreshList();
			if(num==0){showNormalMask();return;}
			showOperatingMask(num);
		},
		doPassArticle:function(){
			let ids=selected_list;
			//console.log(ids);
			if(ids.length==0)return;
			showLoadingMask();
			article_moderator_data_handler.passArticle(ids,function(isSuccess,data){
					moderator_util_handler.makeTable(1);
			});
		},
		doRejectArticle:function(){
			let ids=selected_list;
			//console.log(ids);
			if(ids.length==0)return;
			showLoadingMask();
			article_moderator_data_handler.rejectArticle(ids,function(isSuccess,data){
					moderator_util_handler.makeTable(1);
			});
		}
	}
})();

$(document).ready(function(){
		moderator_util_handler.makeTable(1);
		pagination= new pub_pagination($("#pagination-container"));
		$("#opr_acp_btn").on("click",function(){
			moderator_util_handler.doPassArticle();

		});
		$("#opr_rej_btn").on("click",function(){
			moderator_util_handler.doRejectArticle();

		});

});