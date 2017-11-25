$(function(){
  render();
  function render(){
    $.ajax({
      type:"get",
      url:"/category/queryTopCategory",
      success:function(info){
        // console.log(info);
        $(".category_l .mui-scroll").html(template("firstTpl",info));
      //  渲染二级分类列表
        renderSecond(info.rows[0].id);
        
      }
    })
  };
  
  
  function renderSecond(id){
    $.ajax({
      type:"get",
      url:"/category/querySecondCategory",
      data:{id:id},
      success:function(info){
        console.log(info);
        $(".category_r .mui-scroll").html(template("secondTpl",info));
      }
    })
  };
  
  
  $(".category_l .mui-scroll").on("click","li",function(){
    $(this).addClass("now").siblings().removeClass("now");
    var id=$(this).data("id");
    renderSecond(id);
    //解决因为右边滑动没返回的问题;
    mui('.mui-scroll-wrapper').scroll()[1].scrollTo(0,0,500);//100毫秒滚动到顶2
  });
  
})
