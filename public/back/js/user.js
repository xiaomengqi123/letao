/**
 * Created by Administrator on 2017/11/22.
 */
$(function(){
  var currentPage=1;
  var pageSize=5;
//  动态渲染用户列表
  function render(){
    $.ajax({
      type:"get",
      url:"/user/queryUser",
      data:{
        page:currentPage,
        pageSize:pageSize
      },
      success:function(info){
        // console.log(info);
        $("tbody").html(template("userModal",info));
      
        //  分页的功能
        $("#paginator").bootstrapPaginator({
          //  添加版本号
          bootstrapMajorVersion:3,
          currentPage:currentPage,
          totalPages:Math.ceil(info.total/info.size),
                                   //page为当前点击的按钮值
          onPageClicked:function(a,b,c,page){
            currentPage=page;
            render();
          }
        
        })
      
      }
    });
    
  }
  render();
  
//  添加点击禁用的功能
   //注册委托事件
  $("tbody").on("click",".btn-click",function(){
    // console.log(111);
    $('#usermodal1').modal("show");
    var id=$(this).parent().data("id");
    var isDelete=$(this).hasClass("btn-danger")?"0":"1";
    // console.log(id);
  
    $(".icon-comfirm").off().on("click",function(){
      $.ajax({
        type:"post",
        url:"/user/updateUser",
        data:{
          id:id,
          isDelete:isDelete
        },
        success:function(info){
          // console.log(info);
           if(info.success){
             $('#usermodal1').modal("hide");
             render();
           }
      
        }
    
      })
    });
  
    
    
    
  })
   

})