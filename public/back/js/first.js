$(function(){
  var currentpage=1;
  var pageSize=5;
  //1.获取数据,渲染页面
  function render(){
    $.ajax({
      type:"get",
      url:"/category/queryTopCategoryPaging",
      data:{
        page:currentpage,
        pageSize:pageSize
      },
      success:function(info){
        // console.log(info);
        $("tbody").html(template("firstTpl",info));
        //2.分页功能
        $("#paginator").bootstrapPaginator({
          bootstrapMajorVersion:3,
          currentpage:currentpage,
          totalPages:Math.ceil(info.total/info.size),
          onPageClicked:function(a,b,c,page){
            currentpage=page;
            render();
          }
        
        })
      
      }
    })
  }
  render();
//  添加分类出模态框的功能
   $(".btn-add").on("click",function(){
     $("#categoryModal").modal("show");
   });
  
//表单校验
  var $form=$("#firstform");
  $form.bootstrapValidator({
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },
    fields:{
      categoryName:{
        validators:{
          notEmpty:{
            message:"输入不能为空!"
          }
        }
      }
    }
  });

//  添加表单校验成功事件
    //犯了一个错,不需要点击模态框中的按钮在发送ajax请求
  $form.on("success.form.bv",function(e){
    e.preventDefault();
    $.ajax({
      type:"post",
      url:"/category/addTopCategory",
      data:$form.serialize(),
      success:function(info){
        if(info.success){
          $("#categoryModal").modal("hide");
          currentpage=1; //提高用户体验,添加的数据在第一页显示
          render();
          //表单重置
          $form.data('bootstrapValidator').resetForm(); //重置表单的验证图标
          $form[0].reset();                             //重置表单中的内容
        }
      }
    })
  });
  
  
  
  
})
