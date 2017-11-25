$(function(){
  var currentpage=1;
  var pageSize=2;
  var imgs=[];
  function render(){
    $.ajax({
      type:"get",
      url:"/product/queryProductDetailList",
      data:{
        page:currentpage,
        pageSize:pageSize
      },
      success:function(info){
        $("tbody").html(template("productTpl",info));
        //分页功能
        $("#paginator").bootstrapPaginator({
          //  添加版本号
          bootstrapMajorVersion:3,
          currentPage:currentpage,
          totalPages:Math.ceil(info.total/info.size),
          itemTexts:function(type,page,current){
            switch (type) {
              case "first":
                return "首页";
              case "prev":
                return "上一页";
              case "next":
                return "下一页";
              case "last":
                return "尾页";
              default :
                return page;
            }
          },
          tooltipTitles:function(type,page,current){
            switch (type) {
              case "first":
                return "首页";
              case "prev":
                return "上一页";
              case "next":
                return "下一页";
              case "last":
                return "尾页";
              default :
                return page;
            }
            
          },
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
  
//  点击添加商品
 $(".btn-addproduct").on("click",function(){
   $("#productModal").modal("show");
 });
  
//  动态渲染一级分类类表名
  $.ajax({
    type:"get",
    url:"/category/queryTopCategoryPaging",
    data:{
      page:1,
      pageSize:100
    },
    success:function(info){
      // console.log(info);
      $(".dropdown-menu").html(template("dropdownmenu",info));
    }
  });
//  点击按钮所选的值显示在按钮中
  $(".dropdown-menu").on("click","a",function(){
    $(".dropdown-text").text($(this).text());
    var brandId=$(this).data("id");
    $("[name='brandId']").val(brandId);
  //  手动改成校验成功
    $form.data("bootstrapValidator").updateStatus("brandId","VALID");
    
  });

//  表单校验
  var $form=$("#productForm");
  // var validators=$form.data("bootstrapValidator");
  $form.bootstrapValidator({
  //  字体图标
    excluded:[],
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },
    fields:{
      brandId:{
        validators:{
          notEmpty:{
            message:"请选择一级分类!"
          }
        }
      },
      proName:{
        validators:{
          notEmpty:{
            message:"请选择产品名称!"
          }
        }
      },
      proDesc:{
        validators:{
          notEmpty:{
            message:"请进行产品描述!"
          }
        }
      },
      num:{
        validators:{
          notEmpty:{
            message:"请填写产品库存!"
          },
          regexp:{
            //不能是0开头,必须是数字
            regexp:/^[1-9]\d*$/,
            message:"请输入合法的库存!"
          }
        }
      },
      price:{
        validators:{
          notEmpty:{
            message:"请填写产品价格!"
          }
        }
      },
      oldPrice:{
        validators:{
          notEmpty:{
            message:"请填写产品原价!"
          }
        }
      },
      size:{
        validators:{
          notEmpty:{
            message:"请填写产品尺寸!"
          },
        //  正则:
          regexp:{
            regexp:/^\d{2}-\d{2}$/,
            message:"请输入合法的库存:(33-44)"
          }
        }
      },
      brandLogo:{
        validators: {
          notEmpty: {
            message: "请上传图片!"
          }
        }
      }
    }
  });
  
//  上传图片
  $("#fileupload").fileupload({
    dataType:"json",
    done:function(e,data){
      // console.log(data);
      
      //处理图片超过3张时的情况
      if(imgs.length>=3){
        return false;
      };
      
      $(".imgbox").append('<img src='+data.result.picAddr+' width="100" height="100" alt="">');
      imgs.push(data.result);
     // 判断数组的长度，如果是3，手动让brandLogo 校验成功即可，  如果不是3，校验失败
      if(imgs.length===3){
        $form.data("bootstrapValidator").updateStatus("brandLogo","VALID");
      }else{
        $form.data("bootstrapValidator").updateStatus("brandLogo","INVALID");
      }
    }
  });
  
  
//  注册校验成功事件
  $form.on("success.form.bv",function(e){
    e.preventDefault();
    var param=$form.serialize();
    param+="picAddr1&"+imgs[0].picAddr+"picName1&"+imgs[0].picName;
    param+="picAddr2&"+imgs[1].picAddr+"picName2&"+imgs[1].picName;
    param+="picAddr3&"+imgs[2].picAddr+"picName3&"+imgs[2].picName;
    // console.log(param);
    $.ajax({
      type:"post",
      url:"/product/addProduct",
      data:param,
      success:function(info){
        if(info.success){
          $("#productModal").modal("hide");
          currentpage=1;
          render();
          
        //  重置表单
          $form[0].reset();
          $form.data("bootstrapValidator").resetForm();
          $(".dropdown-text").text("请选择一级分类");
          $("[name='brandId']").val("");
          $(".imgbox img").remove();
          imgs=[];
          
        }
      }
      
    })
    
    
    
  })
  
  
});
