//获取file对象的base64编码
/*
* 接收一个对象参数（imgObj），该对象参数有以下几个可以用属性：
    var updateObj = {
        file: {},
        success:function (response) {

        },
        error:function (response) {

        }
    };
*   1.file：指定图片的文件对象(例如：evt.target.files[0])
*   2.success,error分别是ajax成功，失败的回调函数
* */
function getBase64URL(imgObj) {
    if (imgObj.file != null && imgObj.file != "") {
        var type = imgObj.file.name.substr(imgObj.file.name.lastIndexOf('.'));
        //console.log(type);
        // console.log((type != ".jpg"));
        if (type == ".jpg" || type == ".gif" || type == ".jpeg" || type == ".png") {
            if (imgObj.file.size > 25 * 1024 * 1024) {
                alertify.warning("请选择大小低于25M的图片");
            } else {
                var reader = new FileReader();//实例化文件读取对象
                reader.readAsDataURL(imgObj.file); //将文件读取为 DataURL,也就是base64编码
                reader.onload = function (ev) { //文件读取成功完成时触发
                    // var dataURL = ev.target.result; //获得文件读取成功后的DataURL,也就是base64编码
                    imgObj.success(ev);
                };
            }
        } else {
            alertify.warning("仅支持(.jpg|.jpeg|.gif|.png)类型的图片！");
        }
    } else {
        alertify.warning("未选择图片!");
    }
}