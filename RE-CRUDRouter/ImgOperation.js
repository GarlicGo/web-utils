// document.write("<script language=javascript src='./compress.js'></script>");

/*
*   该JS脚本文件为封装的一些常用的图片操作功能，包含以下几部分内容
*   1.function getBase64URL(imgObj){...}
*       作用：用于将本地图片加载到前端。
*       注意事项：HTML的<img>标签的src属性节点无法引用图片的本地路径，可以引用网址、base64编码。
*   2.function UploadImg(imgObj){...}
*       作用：用于将本地图片存储到服务器上并返回相关信息。
*   3.function DeleteImg(imgObj){...}
*       作用：删除指定位置存储在服务器上的图片。
* */

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

//将图片存储到服务器上并获取连接
/*
* 接收一个对象参数（imgObj），该对象参数有以下几个可以用属性：
    var updateObj = {
        file: {},
        id："",
        success:function (response) {

        },
        error:function (response) {

        }
    };
*   1.file：指定图片的文件对象(例如：evt.target.files[0])
*   2.id：指定删除消息的id
*   3.success,error分别是ajax成功，失败的回调函数
* */
function UploadImg(imgObj) {
    if (imgObj.file != null && imgObj.file != "") {
        var type = imgObj.file.name.substr(imgObj.file.name.lastIndexOf('.'));
        if (type == ".jpg" || type == ".gif" || type == ".jpeg" || type == ".png") {
            let level = 1;
            if (imgObj.file.size <= 100 * 1024) {
                level = 2;
            } else if (imgObj.file.size > 100 * 1024 && imgObj.file.size <= 1 * 1024 * 1024) {
                level = 3.5;
            } else if (imgObj.file.size > 1 * 1024 * 1024 && imgObj.file.size <= 3 * 1024 * 1024) {
                level = 4;
            } else if (imgObj.file.size > 3 * 1024 * 1024 && imgObj.file.size <= 5 * 1024 * 1024) {
                level = 4.5;
            } else if (imgObj.file.size > 5 * 1024 * 1024 && imgObj.file.size <= 7 * 1024 * 1024) {
                level = 5;
            } else if (imgObj.file.size > 7 * 1024 * 1024 && imgObj.file.size <= 9 * 1024 * 1024) {
                level = 5.5;
            } else if (imgObj.file.size > 9 * 1024 * 1024 && imgObj.file.size <= 11 * 1024 * 1024) {
                level = 6;
            } else if (imgObj.file.size > 11 * 1024 * 1024 && imgObj.file.size <= 13 * 1024 * 1024) {
                level = 6.5;
            } else if (imgObj.file.size > 13 * 1024 * 1024 && imgObj.file.size <= 15 * 1024 * 1024) {
                level = 7;
            } else if (imgObj.file.size > 15 * 1024 * 1024 && imgObj.file.size <= 17 * 1024 * 1024) {
                level = 7.5;
            } else if (imgObj.file.size > 17 * 1024 * 1024 && imgObj.file.size <= 19 * 1024 * 1024) {
                level = 8;
            } else if (imgObj.file.size > 19 * 1024 * 1024 && imgObj.file.size <= 21 * 1024 * 1024) {
                level = 8.5;
            } else {
                level = 10;
            }
            /* 处理结果将返回在回调函数then中，即res */
            compress(imgObj.file, level).then(res => {
                let cmpedImg = dataURLtoFile(res, new Date().getTime() + '.png');
                /* 得到压缩后的图片文件后即进行上传 */
                let formData = new FormData();
                // 目前后端测试阶段暂规定该字段叫做zxyissb...
                let 图片对应字段 = 'zxyissb';
                formData.append(`${图片对应字段}`, cmpedImg);
                /* 向formData中添加其他信息 */
                // console.log("压缩前:" + imgObj.file.size / (1024 * 1024) + " / " + "压缩后:" + cmpedImg.size / (1024 * 1024));
                // console.log("压缩比：" + (imgObj.file.size / (1024 * 1024)) / (cmpedImg.size / (1024 * 1024)));
                if (cmpedImg.size / (1024 * 1024) < 25) {
                    $.ajax({
                        type: "post",
                        url: 'https://www.gayestmaple.com/dyatcm/admin/res/upload',
                        data: formData,
                        processData: false,
                        contentType: false,
                        beforeSend(request) {
                            request.setRequestHeader("Authorization", "Bearer " + localStorage.getItem('token'));
                        },
                        success: function (response) {
                            if (response.status == 401) {
                                alertify.warning("访问权限已过期，请重新登录");
                                // $(window).attr('location', 'https://www.gayestmaple.com/dyatcm/admin/acc');
                            } else {
                                /*
                                    status:
                                    201: 创建成功
                                    202: 用户名已存在
                                    500: 服务器内部错误
                                */
                                // console.log(response);
                                //console.log(response);
                                var url = 'https://www.gayestmaple.com/dyatcm/admin' + '/res/' + response.content.filename;
                                response.content.fileurl = url;
                            }
                            imgObj.success(response);
                        },
                        error: function (response) {
                            response.content.fileurl = "";
                            imgObj.error(response);
                        }
                    });
                } else {
                    alertify.warning("图片过大,请尽量选择大小在25M以下的图片");
                }
            })
        } else {
            alertify.warning("仅支持(.jpg|.jpeg|.gif|.png)类型的图片！");
        }
    }
}

function DeleteImg(imgUrl) {
    $.ajax({
        type: "delete",
        url: imgUrl,
        beforeSend(request) {
            request.setRequestHeader("Authorization", "Bearer " + localStorage.getItem('token'));
        },
        success: function (response) {
            if (response.status == 401) {
                alertify.warning("访问权限已过期，请重新登录");
                // $(window).attr('location', 'https://www.gayestmaple.com/dyatcm/admin/acc');
            } else {
                //console.log(response);
            }
        },
        error: function (response) {
            //console.log(response);
        }
    });
}
