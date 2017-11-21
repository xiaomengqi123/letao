/**
 * Created by Administrator on 2017/11/21.
 */
$(function(){
//  进度条功能(Nprogress插件)
  NProgress.configure({ showSpinner: false });
  $(document).ajaxStart(function(){
    NProgress.start();
  })
  $(document).ajaxStop(function(){
    setTimeout(function(){
      NProgress.done();
    },300);
  })
  
 //判断是否登录成功
           //当不在登录页面时,才执行
  if(location.href.indexOf("login.html")==-1){
    $.ajax({
      type:"get",
      url:"/employee/checkRootLogin",
      success:function(data){
        if(data.error==400){
          location.href="login.html";
        }
      }
    });
  }
  
  
//  一级菜单下拉功能
  $(".child").prev().on("click",function(){
    $(this).next().slideToggle();
  });
//左侧侧边栏显示隐藏
  $(".icon-mune").on("click",function(){
    $(".lt-main").toggleClass("now");
    $(".lt-aside").toggleClass("now");
  });
  //右侧小图标退出功能
  $(".icon-logout").on("click",function(){
    $('.modal').modal("show");
    
  //点击小叉退出
    $(".logout").off().on("click",function(){
      $.ajax({
        type:"get",
        url:"/employee/employeeLogout",
        success:function(data){
          // console.log(data);
          if(data.success){
            location.href="login.html";
          }
          
        }
      })
    })
    
  })
})