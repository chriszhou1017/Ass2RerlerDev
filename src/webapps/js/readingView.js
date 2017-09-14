/**
 * 
 */
function cTransData(_name ,_txt){
    return {
    name:_name,
    txt:_txt,
    isDupli:function(otherName){
    	if(otherName&&otherName==_name)return true;
    	else
    		return false;
    }
    };
}
var data_store=(function(){
	var dataList=[];
	return {
		save:function(_name,_txt){
			for(var i=0,max=dataList.length;i<max;i++){
				if(dataList[i].isDupli(_name)){
					dataList[i].txt=_txt;
					return;
				}
			}
		var data=new cTransData(_name,_txt); 
		dataList.push(data);
		}
	};
})();


var menu_data_provider=(function(){
	var transnNumToWord=function(num){
		if(0<=num<=10){
			switch(num){
			case 0:return '';	
			case 1:return '一';	
			case 2:return '二';	
			case 3:return '三';	
			case 4:return '四';	
			case 5:return '五';	
			case 6:return '六';	
			case 7:return '七';	
			case 8:return '八';
			case 9:return '九';
			case 10:return '十';
			}
			
		}
		
	};
	var getChapterNum=function(num){
		
		if(num>=0&&num<=10){
			var txt=transnNumToWord(num);
			return txt;
		}else{
			var txt=num.toString();
			switch(txt.length){
			case 2:var result=transnNumToWord(txt.substr(0,1))+'十'+transnNumToWord(txt.substr(1,1));return result;
			case 3:var result=transnNumToWord(txt.substr(0,1))+'百'+(txt.substr(1,1)=='0'?transnNumToWord(txt.substr(1,1)):transnNumToWord(txt.substr(1,1))+'十')+transnNumToWord(txt.substr(2,1));return result;
			}
			
		}
	};
	var makeMenu=function(data){
	//	$('.menu-data-con').html('');
		$('#data-like-num').html(data.goodRateCount);
		var title = data.title;
		var title_length=title.length;
		$('#data-title').html(title);
		if(title_length<=7){
			$('#data-title').addClass('big');
		}else if(title_length<15){
			$('#data-title').addClass('mid');
		}else{
			$('#data-title').addClass('small');
		}
		if(data.finished)$('#data-finished').html('(完结)');
		else
			$('#data-finished').html('(待续)');
		
		$('#data-desc').html("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+data.desc);
		var content=data.index.chapterInfos;
		var contentCon=$('#data-content');
		var contribsCon=$('#info-contribs');
		for(var i=0,max=content.length;i<max;i++){
			var title=content[i].title;
			var preview=content[i].preview;
			var nickname=content[i].userNick;
			var cid=content[i].id;
		//	var chaptNum=i-(-1)+'.';
			var contentLine=$("<li class='content-item' onclick='rv_sys_util.selectChapter("+cid+",this)' chapterid='"+cid+"'><div class='content-line'><div class='content-head'><strong>"+'●'+"</strong>"+title+"</div><div class='content-brife'>"+preview+"...</div></div></li>");
			var contribsLine=$("<li><div><img src='./testImg/icon-face.jpg' class='head-img'/><div class='head-name'>"+nickname+"</div></div></li>");
			contentCon.append(contentLine);
			contribsCon.append(contribsLine);
		}
		
		
	};
	return {
		contentRefresh:function(){
			$('.hide-when-prepear').addClass('hide');
            $.ajax({type:'GET',
            	url:'/rest/article/1',
            	dataType:'json',
            	success:function(data){
            		makeMenu(data);
            		$('.hide-when-prepear').removeClass('hide');
                	
                	setTimeout(function(){
                		common_util.mkScroll($("#content"),8);
                		sys_eventHandler.bindEventHandler();
            	},10);
                	data_store.save('menu',data);
            }
            });			
		}
	};
})();




var rv_sys_util=(function(){
	var toggleTabColor=function(tab){
	    		$(".tab-selected").removeClass("tab-selected");
	    		tab.addClass("tab-selected");
	    		$(".nav-current-tab").removeClass("nav-current-tab");
	    		var link=tab.attr("link");
	    		$("#"+link).addClass("nav-current-tab");
	    		common_util.scrollAllResetSize();
	};
	return {
    sys_init:function(){
    	userAccount_handler.loadingUser();
    	menu_data_provider.contentRefresh();
    	sys_eventHandler.bindEventHandler();
    	//setTimeout(function(){common_util.mkScroll($("#content"),8);
    	//console.log($(".scrollbar").css('display'));
    	//},100);
    },
     minizeLeft:function(div){
    	 div=$(div);
    	var nav=$("#heroNav");
    	var view=$("#mainframe");
    	if(nav.hasClass("minimz")){
    	nav.animate({left:"0"});
    	view.css("margin-left","300px");
    	nav.removeClass("minimz");
    	div.html("<span>◀</span>");
    	}else{
    	nav.animate({left:'-301px'});
    	view.css("margin-left","0px");
        nav.addClass("minimz");
    	div.html("<span>▶</span>");
    	}
    },
    toggleContentTab:function(tab){
    	 tab=$(tab);
	    if(tab.hasClass("tab-selected"))return;
    	var back=$("#float-banner");
    	if(back.hasClass("in-left")){
    		back.removeClass("in-left");
    		back.animate({left:'50%'},{'speed':200,'callback':toggleTabColor(tab)});
    	}else{
    		back.addClass("in-left");
    		back.animate({left:'0'},{'speed':200,'callback':toggleTabColor(tab)});
    	}
    },
    selectChapter:function(cid,content){
    	$(".content-item").removeClass("content-selected");
    	
    	content=$(content);
    	content.addClass("content-selected");
    	context_data_provider.getChapter(cid);
    	comment_data_provider.countChapterComment(cid);
    	comment_data_provider.getChapterComment(cid,1,true);
    	comment_data_provider.curComment_page=1;
    }
	};
})();


var userAccount_handler=(function(){
	var userAccount;
	var getCookie=function(c_name){
		if (document.cookie.length>0)
		  {
		  c_start=document.cookie.indexOf(c_name + "=");
		  if (c_start!=-1)
		    { 
		    c_start=c_start + c_name.length+1; 
		    c_end=document.cookie.indexOf(";",c_start);
		    if (c_end==-1) c_end=document.cookie.length;
		    return decodeURIComponent(document.cookie.substring(c_start,c_end));
		    } 
		  }
		return "";
		};
		var makeAccount=function(user_name){
			$(".username-label").html(user_name);
			$(".login-locked").removeAttr("disabled","");
			$(".login-locked").val("");
		};
	
	return {
		loadingUser:function(){
	    	var user=getCookie("currentUser");
	    	if(!user||user=="")return;
	    	try{
	    	if(!JSON){
	    		
	          user=eval('('+user+')');
	    	}else{
	    	//  console.log(user);
	    	//console.log(encodeURIComponent('拜拜肉啊'));
	    	// user=JSON.parse(user);
	    	  user=eval('('+user+')');
	    	// console.log(encodeURIComponent(user.nick));
	    	//  console.log(user);
	    	}
	    	}catch(e){
	    		return;
	    	}
	    	userAccount_handler.setAccount(user);
	    	makeAccount(user.nick);
	    	$("#user-blank").addClass("hide");
	    	$("#user-onboard").removeClass("hide");
		},
	    setAccount:function(user){
	    	userAccount=user;
	    },
	    isAccount:function(){
	    if(!userAccount)return false;
	    return true;
	    },
	    showDashboard:function(){
	    	$("#onboard-name").addClass("indash");
	    	$("#user-dashboard").removeClass("hide");
	    	return false;
	    },
	    hideDashboard:function(){
	    	$("#onboard-name").removeClass("indash");
	    	$("#user-dashboard").addClass("hide");
	    	return false;
	    },
	    getUserId:function(){
	    	if(userAccount)return userAccount.id;
	    	return null;
	    
	    }
	};
})();

var context_data_provider=(function(){
	var chapter_session=0;
	var curChapterid="";
	var makeChapter=function(cdata){
		var title=(!cdata.title)?"未命名章节":cdata.title;
		var author=(!cdata.userNick)?"佚名":cdata.userNick;
		var context=(!cdata.content)?" ":cdata.content.replace(/\r\n/g, "<br/>&nbsp;&nbsp");
		$("#chapter-title").html(title);
		$("#author-name").html(author);
		$("#author-by").html("by");
		$("#main-reading-view").html(context);
	};
	return {
		getCurChapterid:function(){
			return curChapterid;
		},
		setCurChapterid:function(id){
			curChapterid=id;
		},
        getChapter:function(chapterid){
        	var cur_session=++chapter_session;
        	   $.ajax({type:'GET',
               	url:'/rest/chapter/'+chapterid,
               	dataType:'json',
               	success:function(data){
               	if(cur_session!=chapter_session)return;
               	makeChapter(data);
               	scrollTo(0,0);
                context_data_provider.setCurChapterid(chapterid);
               }
               });	
        	
        	}		
		};
	})();
	
var comment_data_provider=(function(){
	var cur_count_session=0;
	var cur_comment_session=0;
	var pagesize=10;
	var isAllowedToComment=function(){
      var cid=context_data_provider.getCurChapterid();
      var isaccount=userAccount_handler.isAccount();
    //  console.log(cid);
      if(cid!=""&&isaccount)return true;
      else
    	  return false;
	};
	var lockCommentBtn=function(btn){
		btn.html("提交中..");
		btn.addClass("locked");
	};
	var releaseCommentBtn=function(btn){
		btn.html("提&nbsp;交");
		btn.removeClass("locked");
	};
	var makeCommentTitle=function(count){
		$("#comments-amount").html("共"+count+"条评论");
	};
	/**
	var makeComment=function(data){
		var con=$("#comments-list-con");
		for(var i=0,max=data.length;i<max;i++){
			var comment=data[i];
			var comment_txt=comment.content?comment.content:"";
			var comment_nick=comment.userNick?comment.userNick:"";
			var comment_date=comment.createTime?common_tools.getDateLabel(comment.createTime):"--";
			var li=$("<li></li>");
			var img=$("<div class='comment-left-head'><img src='./testImg/icon-face.jpg' class='head-img'/></div>");
			var body=$("<div class='comment-right-body'><span class='comment-usernick'>"+comment_nick+"<span class='comment-time'>发表于&nbsp;&nbsp;"+comment_date+"</span></span><span class='comment-context'>"+comment_txt+"</span></div>");
			var btns=$("<div class='comment-btn-bar'><span class='comment-btn comment-btn-reply btn' onclick='comment_data_provider.appendReplyBar(this)'>回复</span></div>");
			var rply_line=$("<div class='reply-line hide'><input class='reply-input' type='text'/><span class='reply-btn btn' commentid='"+comment+"'>提&nbsp;交</span></div>");
			body.append(btns);
		    body.append(rply_line);
			li.append(img);
			li.append(body);
			con.append(li);
		}
	};
	**/
	
	var makeCommentRow=function(comment){
		var myId=userAccount_handler.getUserId();
		var comment_txt=comment.content?comment.content:"";
		var comment_nick=comment.userNick?comment.userNick:"";
		var comment_date=comment.createTime?common_tools.getDateLabel(comment.createTime):"--";
		var li=$("<li></li>");
		var img=$("<div class='comment-left-head'><img src='./testImg/icon-face.jpg' class='head-img'/></div>");
		var body;
		var btns;
		if(myId==comment.userId){
			 body=$("<div class='comment-right-body'><span class='comment-usernick'>我<span class='comment-time'>发表于&nbsp;&nbsp;"+comment_date+"</span></span><span class='comment-context'>"+comment_txt+"</span></div>");
			 btns=$("<div class='comment-btn-bar'><span class='comment-btn comment-btn-del btn' onclick='comment_data_provider.appendDelBar(this)' cid="+comment.id+">删除</span></div>");
		}else{
			 body=$("<div class='comment-right-body'><span class='comment-usernick'>"+comment_nick+"<span class='comment-time'>发表于&nbsp;&nbsp;"+comment_date+"</span></span><span class='comment-context'>"+comment_txt+"</span></div>");
			 btns=$("<div class='comment-btn-bar'><span class='comment-btn comment-btn-reply btn' onclick='comment_data_provider.appendReplyBar(this)' cid="+comment.id+">回复</span></div>");
		}
		if(comment.replyComment){
             var replycomment=comment.replyComment;
             var quote_context=replycomment.content?replycomment.content:"原回复已被作者删除.";
             var quote_author=replycomment.userNick?replycomment.userNick:"";
             var quote=$("<div class='comment-quote-bar'><span>@"+quote_author+":</span><span>"+quote_context+"</span></div>");
             body.append(quote);
	    }
		body.append(btns);
		li.append(img);
		li.append(body);
		return li;
		
	};
	var makeReplyBar=function(commentid){
		var rply_line=$("<div class='comment-tool-line reply-line'><input class='reply-input' type='text'/><span class='reply-btn btn' onclick='comment_data_provider.submitReply(this)' commentid='"+commentid+"'>提&nbsp;交</span></div>");
	    return rply_line;
	};
	var makeDelBar=function(commentid){
		var del_line=$("<div class='comment-tool-line del-line'><span>确认删除该评论么？</span><span class='del-confirm-btn btn' onclick='comment_data_provider.submitDel(this)' cid="+commentid+">确&nbsp;认</span><span  class='del-confirm-btn btn' onclick='comment_data_provider.cancelDel(this)'>取&nbsp;消</span></div>");
		return del_line;
	};
	var clearCommentTools=function(con,btn){
		con=$(con);
		var lines=con.find(".comment-tool-line");
		var btn_bar=con.find(".comment-btn-bar")[0];
		var btns=$(btn_bar).find(".comment-btn");
		if(lines)lines.remove();
		if(btns)for(var i=0,max=btns.length;i<max;i++){
			   var tempbtn=$(btns[i]);
			if(tempbtn.dom!=btn.dom)tempbtn.removeClass("act");
		}
	};
	var isMore=function(total,size,nowpage){
		if(size*nowpage>=total)
			return false;
		else
			return true;
	};
	return {
		comment_count:0,
		curComment_page:1,
		clearComment:function(){
			var con=$("#comments-list-con");
			con.empty();
		},
		makeMoreBtn:function(curpage){
			$(".fetching").html("显示更多评论");
			$(".fetching").removeClass("fetching");
			var inNeed=isMore(comment_data_provider.comment_count,pagesize,curpage);
			if(inNeed)
				$("#comment-more").removeClass("hide");
			else
				$("#comment-more").addClass("hide");
		},
		getChapterComment:function(chaid,page,refresh){
			var cur_session=++cur_comment_session;
			if(refresh)comment_data_provider.clearComment();
			  $.ajax({type:'GET',
	            	url:'/rest/chapterComment/query/byChapterId',
	            	data:{chapterId:chaid,_page:page,_size:pagesize},
	            	dataType:'json',
	            	success:function(data){
	            	if(cur_session!=cur_comment_session)return;
	            	var con=$("#comments-list-con");
	        		for(var i=0,max=data.length;i<max;i++){
	        			var comment=data[i];
	        			var li=makeCommentRow(comment);
	        			con.append(li);
	        		}
	            	comment_data_provider.makeMoreBtn(page);
	            }
	            });	
		},
		pageturning:function(hint){
			hint=$(hint);
			if(hint.hasClass("fetching"))return;
			hint.addClass("fetching");
			hint.html("读取中...");
			console.log(1);
			var cptid=context_data_provider.getCurChapterid();
			var page=++comment_data_provider.curComment_page;
			comment_data_provider.getChapterComment(cptid, page, false);
		},
		countChapterComment:function(chaid){
			var cur_session=++cur_count_session;
     	   $.ajax({type:'GET',
            	url:'/rest/chapterComment/count/byChapterId',
            	data:{chapterId:chaid},
            	dataType:'json',
            	success:function(data){
            	if(cur_session!=cur_count_session)return;
            	comment_data_provider.comment_count=data;
            	makeCommentTitle(data);
            }
            });	
		},
		appendReplyBar:function(btn){
			btn=$(btn);
			var con=btn.parent().parent();
			//var bar=con.find('.reply-line');
			clearCommentTools(con,btn);
			if(!btn.hasClass('act')){
				btn.addClass('act');
			var bar=makeReplyBar(btn.attr("cid"));
			con.append(bar);
			btn.html(btn.html()+":");
			
			//bar.removeClass("hide");
			
			}else{
				btn.removeClass('act');
				btn.html(btn.html().replace(':',''));
				var bar=con.find('.reply-line');
				bar.remove();
			}
		},
		appendDelBar:function(btn){
			btn=$(btn);
			var con=btn.parent().parent();
			clearCommentTools(con,btn);
			if(!btn.hasClass('act')){
				btn.addClass('act');
			var bar=makeDelBar(btn.attr("cid"));
			con.append(bar);
			}else{
				btn.removeClass('act');
				var bar=con.find('.del-line');
				bar.remove();
			}
		},
		cancelDel:function(btn){
			btn=$(btn);
			con=btn.parent().parent();
			var delbtn=con.find('.comment-btn-del');
			if(delbtn)this.appendDelBar(delbtn);
		},
		packReplayBar:function(btn){
			btn=$(btn);
			con=btn.parent().parent();
			var rpybtn=con.find('.comment-btn-reply');
			if(rpybtn)this.appendReplyBar(rpybtn);
		},
		submitDel:function(btn){
			btn=$(btn);
			btn.html("删除中...");
			var cid=btn.attr("cid");
			console.log(cid);
			$.ajax({
				type:'DELETE',
            	url:'/rest/chapterComment/'+cid,
            	success:function(){
            		var li=btn.parent().parent().parent();
            		comment_data_provider.comment_count-=1;
            		makeCommentTitle(comment_data_provider.comment_count);
            	//	li.animate({opacity:'0'},200,'swing',function(){
            			li.remove();
            	//		});
                }
			});
		},
		submitMyComment:function(){
			if($("#comment-submit-btn").hasClass("locked"))return;
			var content=$("#my-comment-txt").val().trim();
			if(content=="")return;
			if(!isAllowedToComment())return;
			var btn=$("#comment-submit-btn");
			lockCommentBtn(btn);
			var cid=context_data_provider.getCurChapterid();
			$.ajax({
				contentType:'application/json',
				type:'POST',
            	url:'/rest/chapterComment/',
            	data:"{\"chapterId\":\""+cid+"\",\"content\":\""+content+"\"}",
            	dataType:'json',
            	success:function(data){
            		releaseCommentBtn(btn);
            		$("#my-comment-txt").val("");
            		comment_data_provider.comment_count-=-1;
            		makeCommentTitle(comment_data_provider.comment_count);
            		var con=$("#comments-list-con");
            		var li = makeCommentRow(data);
            		con.prepend(li);
                }
			});
		},
		submitReply:function(btn){
			btn=$(btn);
			if(btn.hasClass("locked"))return;
			var id=btn.attr("commentid");
			if(!(id==0||id))return;
			var input=btn.parent().find('input');
		    var context=input.val().trim();
		    if(context=="")return;
		    lockCommentBtn(btn);
			var cid=context_data_provider.getCurChapterid();
			btn.html("提交中...");
			btn.addClass("locked");
			$.ajax({
				contentType:'application/json',
				type:'POST',
            	url:'/rest/chapterComment/',
            	data:"{\"chapterId\":\""+cid+"\",\"content\":\""+context+"\",\"replyCommentId\":\""+id+"\"}",
            	dataType:'json',
            	success:function(data){
            		releaseCommentBtn(btn);
            		input.val("");
            		comment_data_provider.packReplayBar(btn);
            		comment_data_provider.comment_count-=-1;
            		makeCommentTitle(comment_data_provider.comment_count);
            		var con=$("#comments-list-con");
            		var li = makeCommentRow(data);
            		con.prepend(li);
                }
			});
		    
		}
	};
	
})();

$(document).ready(function(){
	//setTimeout(function(){
		//console.log(
			//$("#content-con")[0].scrollHeight)+"-------"+console.log($("#content-con")[0].clientHeight);
//	rv_sys_util.sys_init();},10);
	rv_sys_util.sys_init();
	window.onscroll = function(){ 
    var t = document.documentElement.scrollTop || document.body.scrollTop;  
    if(t>=41){$("#heroNav").css({
    		position:'fixed',
    		top:0
    		});
    }else{
    		$("#heroNav").css({
    			position:'absolute',
    			top:45
    		});
    		}
	};
	$("#user-dashboard").on('mouseleave',function(e){
		userAccount_handler.hideDashboard();
	});
//	alert(window.location.pathname.lastIndexOf('/'));

	});