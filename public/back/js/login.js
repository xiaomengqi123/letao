/**
 * Created by Administrator on 2017/11/21.
 */
$(function(){
  
  var $form=$("form");
  $form.bootstrapValidator({
    //登录验证,用户名不能为空,密码不能为空,密码长度不能小于6位
    fields:{
      username:{
        validators:{
          notEmpty:{
            message:"用户名不能为空"
          },
          callback:{
            message:"用户名不存在"
          }
        }
      },
      password:{
        validators:{
          notEmpty:{
            message:"用户密码不能为空"
          },
          
          stringLength:{
            min:6,
            max:12,
            message:"密码长度是6-12位"
          },
          callback:{
            message:"密码错误"
          }
        }
      }
    },
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },
  });
  
  $form.on("success.form.bv",function(e){
    //需要阻止表单的默认行为
    e.preventDefault();
  //  发送ajax请求
    $.ajax({
      type:"post",
      url:"/employee/employeeLogin",
      data:$form.serialize(),
      success:function(data){
        console.log(data);
        if(data.success){
          //如果成功,就跳转到登录页
          location.href="index.html";
        }
        //如果失败的话,就在底下给提示
        if(data.error==1000){
          //用户名不存在
          $form.data("bootstrapValidator").updateStatus("username","INVALID","callback");
          //参数1:改变哪个字段
          //参数2:改成什么字段 VALID:通过 INVALID:不通过
          //参数3:选择提示的信息
          
        }
        if(data.error==1001){
        //  密码错误
          $form.data("bootstrapValidator").updateStatus("password","INVALID","callback");
        }
      }
    })
    
  });

//  重置按钮功能的设置
  $(".icon-reset").on("click",function(){
    // console.log(111);
    $form.data('bootstrapValidator').resetForm();
  });
})
