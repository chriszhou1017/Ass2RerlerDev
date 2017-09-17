let pagination;

const home_data_handler=(function(){
    let pageSize=4;

return{
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


const home_util_handler=(function(){
    return{
        makeNews:function(pgNum,container){
            home_data_handler.retrieveNews(pgNum,function(isSuccess,data){
                if(isSuccess){
                    let {msgBody}=data;
                    let {results}=msgBody;
                    let {count}=msgBody;
                    let {pageCount}=msgBody;
                    pageCount=Math.ceil(pageCount);
                    for(let i =0, max=results.length;i<max;i++){
                        let obj=results[i];
                        let title_con = $("<h3></h3>");
                        let title;
                        (obj.title=="")?title = "N/A":title = decodeURIComponent(obj.title);
                        title_con.html(title);
                        let content;
                        content=$("<div>"+decodeURIComponent(obj.content)+"</div>");
                      container.append(title_con);
                      container.append(content);
                    }
                    container.accordion({
                                active: false,
                                collapsible: true,
                                heightStyle: "fill"
                                });
                    pagination.paginate(pageCount,pgNum,function(cur_number){
                            container.empty();
                            container.accordion( "destroy" );
                            home_util_handler.makeNews(cur_number,container);
                    });
                    }
                     
                    
            });

        }

    }
})();


$(document).ready(function(){
    pagination= new pub_pagination($("#news-pagination-container"));
    let con=$("#news-list-container");
    home_util_handler.makeNews(1,con);


});