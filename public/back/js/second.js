$(function(){
  var currentpage=1;
  var pageSize=5;
  function render(){
    $.ajax({
      type:"get",
      url:"/category/querySecondCategoryPaging",
      data:{
        page:currentpage,
        pageSize:pageSize
      },
      success:function(info){
        $("tbody").html(template("secondTpl",info));
        //分页功能
        $("#paginator").bootstrapPaginator({
          //  添加版本号
          bootstrapMajorVersion:3,
          currentPage:currentpage,
          totalPages:Math.ceil(info.total/info.size),
          //page为当前点击的按钮值
          onPageClicked:function(a,b,c,page){
            currentpage=page;
            render();
          }
        });
      }
    });
  }
  render();
  
//  点击添加按钮显示模态框
   $(".btn-add2").on("click",function(){
     $("#secondModal").modal("show");
   });

//添加表单模态框中的第一部分:选择一级分类
  $.ajax({
    type:"get",
    url:"/category/queryTopCategoryPaging",
    data:{
      page:1,
      pageSize:100
    },
    success:function(info){
      $(".dropdown-menu").html(template("dropdownmenutpl",info));
    }
  })

//  让所选的值显示在按钮中
  $(".dropdown-menu").on("click","a",function(){
    var droptext=$(this).text();
    $(".dropdown-text").text(droptext);
    var categoryId=$(this).data("id");
    $("[name='categoryId']").val(categoryId);
    
    //手动改变隐藏域的错误信息提示
    $form.data("bootstrapValidator").updateStatus("categoryId", "VALID");
  });
  
// 图片上传功能
  $("#fileupload").fileupload({
    dataType:"json",
    //e：事件对象
    //data：图片上传后的对象，通过e.result.picAddr可以获取上传后的图片地址
    done:function (e, data) {
      // console.log(data);
      $(".imgbox img").attr("src",data.result.picAddr);
      var brandLogo=data.result.picAddr;
      // console.log(brandLogo);
      $("[name='brandLogo']").val(brandLogo);
      //手动改变隐藏域的错误信息提示
      $form.data("bootstrapValidator").updateStatus("brandLogo", "VALID");
    }
  });
  
//  表单校验
  var $form= $("#secondform");
   $form.bootstrapValidator({
     //因为隐藏域不给提示,所以需要用excluded
     excluded:[],
     feedbackIcons: {
       valid: 'glyphicon glyphicon-ok',
       invalid: 'glyphicon glyphicon-remove',
       validating: 'glyphicon glyphicon-refresh'
     },
     fields: {
       categoryId: {
         validators: {
           notEmpty: {
             message: "请选择一级分类"
           }
         }
       },
       brandName: {
         validators: {
           notEmpty: {
             message: "请输入二级分类的名称"
           }
         }
       },
       brandLogo: {
         validators: {
           notEmpty: {
             message: "请上传品牌图片"
           }
         }
       }
     }
   });
//  隐藏域hot的值
  $("[name='hot']").val("0");
  
  
//  注册表单验证成功事件(注意要阻止提交的默认事件的发生)
  $form.on("success.form.bv",function(e){
    console.log(111);
    e.preventDefault();
    $.ajax({
      type:"post",
      url:"/category/addSecondCategory",
      data:$form.serialize(),
      
      success:function(info){
        console.log(info);
        if(info.success){
          $("#secondModal").modal("hide");
          currentpage=1;
          render();
          
        //  重置内容和样式
          $form[0].reset();
          $form.data("bootstrapValidator").resetForm();
        //重置下拉列表和图片
          $(".dropdown-text").text("请选择一级分类");
          $("[name='categoryId']").val('');
          $(".imgbox img").attr("src", "images/none.png");
          $("[name='brandLogo']").val('');
        }

      }
    });
  })
  
})
