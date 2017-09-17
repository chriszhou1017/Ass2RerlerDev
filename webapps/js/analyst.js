let editor;
let pagination;

const admin_data_handler=(function(){
    let pageSize=7;

return{
	saveNews:function(title,content,callback){
		$.ajax({
				contentType:'application/json',
				type:'POST',
            	url:'/news/saveNews',
            	data:"{\"news\":{\"title\":\""+encodeURIComponent(title)+"\",\"content\":\""
            	+encodeURIComponent(content)+"\"}}",
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
    delNews:function(id,callback){
            $.ajax({
                contentType:'application/json',
                type:'POST',
                url:'/news/delNews',
                data:"{\"id\":\""+id+"\"}",
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
    updateNews:function(id,title,content,callback){
        $.ajax({
                contentType:'application/json',
                type:'POST',
                url:'/news/updateNews',
                data:"{\"id\":\""+id+"\",\"title\":\""+encodeURIComponent(title)+"\",\"content\":\""
                +encodeURIComponent(content)+"\"}",
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
    retrieveNews:function(pageNum,callback){
            $.ajax({
                contentType:'application/json',
                type:'GET',
                url:'/news/pageNews?pageNum='+pageNum+'&pageSize='+pageSize,
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

}
})();

const admin_util_handler=(function(){
           let cur_opr_id;
           let cleanContainer=function(con){
            con.removeClass("inform");
            con.removeClass("intable");
            con.removeClass("ininfo");
            };
            let cleanLoadingBar=function(con){
                
                con.removeClass('normal');
                con.removeClass('loading')
                con.removeClass('operating');
                con.removeClass('hide');
            };
    return{
            makeTable:function(pageNum){
            let table_container = $("#table-list");
            table_container.empty();
            admin_util_handler.showLoading();
            admin_data_handler.retrieveNews(pageNum,function(isSuccess,data){
                admin_util_handler.showNormal();
                if(isSuccess){
                    let {msgBody}=data;
                    let {results}=msgBody;
                    let {count}=msgBody;
                    let {pageCount}=msgBody;
                    pageCount=Math.ceil(pageCount);
                    for(let i =0, max=results.length;i<max;i++){
                        let obj=results[i];
                        let tr = $("<tr></tr>");
                        let title;
                        (obj.title=="")?title = "N/A":title = decodeURIComponent(obj.title);
                        tr.append($("<td></td>").text(title));
                        let date;
                        (obj.saveDate ==""||obj.saveDate==null)?date = "N/A":date = obj.saveDate.substr(0,10);
                        tr.append($("<td></td>").text(date));
                        let id;
                        (obj._id ==""||obj._id==null)?id = '':id = obj._id;
                        tr.append($("<td class=\'\' >"+
                            "<img class=\'opr_edit opr_btn\'src=\'./testImg/edit.svg\' id=\'"+id+"\' title=\'"+obj.title+"\' value=\'"+obj.content+"\' onclick=\'admin_util_handler.inject2editor(this)\'>"+
                            "<img class=\'opr_del opr_btn\'src=\'./testImg/delete.png\' id=\'"+id+"\' onclick=\'admin_util_handler.delNews(this)\'>"+"</td>"));
                        table_container.append(tr);
                    }
                    pagination.paginate(pageCount,pageNum,function(cur_number){
                            admin_util_handler.makeTable(cur_number);
                    });
                }
            });
        },
        inject2editor:function(btn){
            btn=$(btn);
            let content=btn.attr('value');
            let title=btn.attr('title');
            let id = btn.attr('id');
            cur_opr_id=id;
            $("#news-title").val(decodeURIComponent(title));
            editor.txt.html(decodeURIComponent(content));
            admin_util_handler.hideBar();
            admin_util_handler.switchToForm();
        },
        getCurOprId:function(){
            return cur_opr_id;
        },
        cleanCurOprId:function(){
            cur_opr_id=null;
        },
        switchToForm:function(){
            let con = $("#news-opr-con"); 
            cleanContainer(con);
            if(!con.hasClass("inform"))con.addClass("inform");            
        },
        switchToTable:function(){
            let con = $("#news-opr-con"); 
            cleanContainer(con);
            if(!con.hasClass("intable"))con.addClass("intable"); 
        },
        switchToInfo:function(isSuccess,info,data){
            let con = $("#news-opr-con"); 
            let title = $("#info-title");
            let content = $("#info-content");
            if(isSuccess){
                title.html('Success!');
                content.html(info);
            }else{
                title.html('ERROR!');
                content.html('An error occured when submitting news :'+data);
            }
            cleanContainer(con);
            if(!con.hasClass("ininfo"))con.addClass("ininfo"); 
        },
        cleanEditor:function(){
            cur_opr_id=null;
            $("#news-title").val("");
            editor.txt.html("");
        },
        showLoading:function(){
                let con = $("#loading-mask");
                cleanLoadingBar(con);
                if(!con.hasClass("loading"))con.addClass("loading");
            },

            showNormal:function(){
                let con = $("#loading-mask");
                cleanLoadingBar(con);
                if(!con.hasClass("normal"))con.addClass("normal");
            },
            showOpr:function(){
                let con = $("#loading-mask");
                cleanLoadingBar(con);
                if(!con.hasClass("operating"))con.addClass("operating");
            },
            hideBar:function(){
                let con = $("#loading-mask");
                cleanLoadingBar(con);
                if(!con.hasClass("hide"))con.addClass("hide");
            },
            delNews:function(btn){
                 btn = $(btn);
                 let id = btn.attr("id");
                 cur_opr_id=id;
                 admin_util_handler.showOpr();

            },


    }
})();




$(document).ready(function(){

        var e = window.wangEditor;
        editor = new e('#news-editor');
        editor.create();
        pagination= new pub_pagination($("#pagination-container"));
        admin_util_handler.makeTable(1);
        $("#news-submit-btn").on('click',function(){
        	let title = $("#news-title").val().trim();
        	let content =  editor.txt.html();
            let id=admin_util_handler.getCurOprId();
            admin_util_handler.showLoading();
            if(id==null||id==''){
        	admin_data_handler.saveNews(title,content,function(isSuccess,data){
                admin_util_handler.hideBar();
        	admin_util_handler.switchToInfo(isSuccess,"Your news has successfully submited.",data);
        	});
        }else{
                admin_data_handler.updateNews(id,title,content,function(isSuccess,data){
                admin_util_handler.hideBar();
            admin_util_handler.switchToInfo(isSuccess,"Your news has successfully updated.",data);
                });
            }
        });

        $("#news-cancel-btn").on('click',function(){
            admin_util_handler.cleanEditor();
            admin_util_handler.showNormal();
            admin_util_handler.switchToTable();
        });
        $("#info-back-btn").on('click',function(){
            admin_util_handler.cleanEditor();
            admin_util_handler.switchToTable();
            admin_util_handler.makeTable(1);
                    });
        $("#createNews-btn").on('click',function(){
            admin_util_handler.cleanEditor();
            admin_util_handler.switchToForm();
            admin_util_handler.hideBar();

        });
        $("#opr_acp_btn").on('click',function(){
            admin_util_handler.showLoading();
            let id =admin_util_handler.getCurOprId();
            admin_util_handler.cleanCurOprId();
            admin_data_handler.delNews(id,function(isSuccess,data){
                admin_util_handler.hideBar();
                admin_util_handler.switchToInfo(isSuccess,"News has successfully deleted",data);
            });

        });
        $("#opr_rej_btn").on('click',function(){
             admin_util_handler.showNormal();
             admin_util_handler.cleanCurOprId();
        });
});