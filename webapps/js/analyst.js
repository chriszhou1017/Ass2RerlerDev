let pagination;
const article_analyst_data_handler=(function(){
            let pageSize=5;
        return{
            retrievePassedArticles:function(pageNum,callback){
            $.ajax({
                contentType:'application/json',
                type:'GET',
                url:'/article/pagePassedArticle?pageNum='+pageNum+'&pageSize='+pageSize,
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
        acArticle:function(aid,callback){
            $.ajax({
                contentType:'application/json',
                type:'POST',
                url:'/article/acArticle',
                data:"{\"id\":\""+aid+"\"}",
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
        saveComment:function(aid,rate,researchMethod,researchMetrics,researchParticipants,evidenceItem,callback){
            $.ajax({
                contentType:'application/json',
                type:'POST',
                url:'/articleComment/saveArticleComment',
                data:"{\"articleId\":\""+aid+"\",\"comment\":{\"rates\":\""+rate+"\",\"rmtd\":\""
                +researchMethod+"\",\"rmtc\":\""+researchMetrics+"\",\"rp\":\""+researchParticipants+"\",\"ei\":\""+evidenceItem+"\"}}",
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
      updateComment:function(aid,rate,researchMethod,researchMetrics,researchParticipants,evidenceItem,callback){
            $.ajax({
                contentType:'application/json',
                type:'POST',
                url:'/articleComment/updateArticleComment',
                data:"{\"articleId\":\""+aid+"\",\"comment\":{\"rates\":\""+rate+"\",\"researchMethod\":\""
                +researchMethod+"\",\"researchMetrics\":\""+researchMetrics+"\",\"researchParticipants\":\""+researchParticipants+"\",\"evidenceItem\":\""+evidenceItem+"\"}}",
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
    findArticleComment:function(aid,callback){
            $.ajax({
                contentType:'application/json',
                type:'POST',
                url:'/articleComment/findArticleCommentByArticleId',
                data:"{\"articleId\":\""+aid+"\"}",
                dataType:'json',
                success:function(data){
                    if(data.status=='OK')
                         callback(true,data.msgBody);
                    else
                         callback(false,data.msgBody);
                },
                error:function(){
                     callback(false,data.msgBody);
                }               
            });
                 }
        }



})();



const analyst_util_handler=(function(){
    let slider;
    let checkbox;
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
    let toFormPanel=function(){
        let table=$("#article-list-panel");
        let form=$("#article-form-panel");
        if(!table.hasClass("hide"))table.addClass("hide");
        form.removeClass("hide");
    };
    let totablePanel=function(){
        let table=$("#article-list-panel");
        let form=$("#article-form-panel");
        if(!form.hasClass("hide"))form.addClass("hide");
        table.removeClass("hide");
    };
    let injectArticleInfo=function(btn){
            let tr= btn.parent();
            let title=tr.find(".td-title").html();
            let author=tr.find(".td-author").html();
            let journal=tr.find(".td-journal").html();
            let year=tr.find(".td-year").html();
            let id= btn.attr("id");
            let status= btn.attr("status");
            $(".article-info").val("");
            $("#article-title").val(title);
            $("#article-author").val(author);
            $("#article-journal").val(journal);
            $("#article-year").val(year);
            $("#article-id").val(id);
            $("#article-status").val(status);
        };

    let refreshComment=function(){
        let input=$("#rate-input");
        input.html(0);
        input.attr("value",0);
        slider.slider( "value",0);
        $( ".ipt-checkbox" ).removeAttr('checked');
         $( ".ipt-checkbox" ).checkboxradio("refresh");
       $("#article-researchmrts").val("");
        $("#article-evditm").val("");
    };

    let setComment=function(rate,rm,rmt,rp,ei){
        let input=$("#rate-input");
        input.html(rate);
        input.attr("value",rate);
        slider.slider( "value",rate);
        if(rm && rm.length>0)$(rm).each(function(){
            $("#ckrm"+this).attr('checked', true);
        });
        if(rp && rp.length>0)$(rp).each(function(){
            $("#rp"+this).attr('checked', true);
        });
        $( ".ipt-checkbox" ).checkboxradio("refresh");
        $("#article-researchmrts").val(rmt);
        $("#article-evditm").val(decodeURIComponent(ei));

    };

    return{
    makeTable:function(pageNum){
            showLoadingMask();
            let table_container = $("#table-list");
            table_container.empty();
            article_analyst_data_handler.retrievePassedArticles(pageNum,function(isSuccess,data){
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
                        tr.append($("<td class=\'td-title\'></td>").text(title));
                        let author;
                        (obj.author ==""||obj.author==null)?author = "N/A":author = obj.author;
                        tr.append($("<td class=\'td-author\'></td>").text(author));
                        let journal ;
                        (obj.journal ==""||obj.journal==null)?journal= "N/A":journal = obj.journal;
                        tr.append($("<td class=\'td-journal\'></td>").text(journal));
                        let year ;
                        (obj.year ==""||obj.year==null)?year = "N/A":year = obj.year;
                        tr.append($("<td class=\'td-year\'></td>").text(year));
                        table_container.append(tr);
                        let status ;
                        (obj.status ==""||obj.status==null)?status = "N/A":status = obj.status;
                        let sclass="art-status-acp";
                        if(status=="analysis complete") {sclass="art-status-ac";status="A.C.";}
                        tr.append($("<td class=\'td-status\'><label class=\'"+sclass+"\''>"+status+"</label></td>"));
                        table_container.append(tr);
                        let id;
                        (obj._id ==""||obj._id==null)?id = '':id = obj._id;
                        tr.append($("<td id=\'"+id+"\' status=\'"+status+"\' class=\'opr_btn\' onclick=\'analyst_util_handler.editArticle(this)\'>"
                            +"<img class=\'list-edit-btn\'src=\'./testImg/edit.svg\'>"));
                        table_container.append(tr);
                    }
                    pagination.paginate(pageCount,pageNum,function(cur_number){
                            analyst_util_handler.makeTable(cur_number);
                    });
                }
            });
        },

        saveComment:function(){
            let id=$("#article-id").val();
            let rate =$("#rate-input").html();
            let rm=[];
            $("input:checkbox[name=ckrm]:checked").each(function(){
                let tmp=$(this);
                rm.push(tmp.val());
            });
            let rmrts=$("#article-researchmrts").val();

            let rp=[]
            $("input:checkbox[name=ckrm]:checked").each(function(){
                let tmp=$(this);
                rp.push(tmp.val());
            });
            let ei=$("#article-evditm").val();
            ei=encodeURIComponent(ei);
             showLoadingMask();
              article_analyst_data_handler.saveComment(id,rate,rm,rmrts,rp,ei,function(){
                article_analyst_data_handler.acArticle(id,function(){
                    showNormalMask();
                    analyst_util_handler.makeTable(1);
                    analyst_util_handler.backToList();
                });
                
              });
        },
        updateComment:function(){
            let id=$("#article-id").val();
            let rate =$("#rate-input").html();
            let rm=[];
            $("input:checkbox[name=ckrm]:checked").each(function(){
                let tmp=$(this);
                rm.push(tmp.val());
            });
            let rmrts=$("#article-researchmrts").val();

            let rp=[]
            $("input:checkbox[name=ckrm]:checked").each(function(){
                let tmp=$(this);
                rp.push(tmp.val());
            });
            let ei=$("#article-evditm").val();
            ei=encodeURIComponent(ei);
             showLoadingMask();
              article_analyst_data_handler.updateComment(id,rate,rm,rmrts,rp,ei,function(){
                    showNormalMask();
                    analyst_util_handler.makeTable(1);
                    analyst_util_handler.backToList();
              });
        },
        makeSlider:function(){
        let input=$("#rate-input");
        slider=$( "#rates-slider" ).slider({
        min: 0,
        max: 5,
        range: "min",
        value: 0,
        slide: function( event, ui ) {
        input.html(ui.value );
        input.attr("value",ui.value );
                 }
        });
                            },
        makeSelection:function(){
        checkbox=$( ".ipt-checkbox" ).checkboxradio({icon: false});
        
        },
        editArticle:function(btn){
            btn=$(btn);
            let aid=btn.attr("id");
            let status=btn.attr("status");
            injectArticleInfo(btn);
            if(status=="accepted"){
                toFormPanel();
                refreshComment();
            }
            else if(status=="A.C."){  

            showLoadingMask();
            article_analyst_data_handler.findArticleComment(aid,function(isSuccess,data){
            if(isSuccess){
                if(!data)
                    refreshComment();
                else 
                    setComment(data.rates,data.researchMethod,data.researchMetric,data.researchParticipants,data.evidenceItem);
            showNormalMask();
           
            toFormPanel();
            }
            });
        }
           
        },
        backToList:function(){
            totablePanel();
        },
        submit:function(){
            let status= $("#article-status").val();
            if(status =="accepted"){
                analyst_util_handler.saveComment();
            }else if(status=="A.C."){
                analyst_util_handler.updateComment();
            }
            }
        }
})();
$(document).ready(function(){
        pagination= new pub_pagination($("#pagination-container"));
        analyst_util_handler.makeTable(1);
        analyst_util_handler.makeSlider();
        analyst_util_handler.makeSelection();


});
