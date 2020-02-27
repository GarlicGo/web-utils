
/*
* 该文档是对Ajax请求和ImgOperation的一个二次封装
* 进行二次封装的有增、删、改
* */

//增
/*
* 接收一个对象参数（updateObj），该对象参数有以下几个可以用属性：
    var updateObj = {
        imgObj: "",
        table: "",
        data:{},
        success:function (response) {

        },
        error:function (response) {

        }
    };
*   1.imgObj：指定添加图片的file对象
*   2.table：指定删除数据的表
*   3.id：指定删除消息的id
*   4.success,error分别是ajax成功，失败的回调函数
* */
function AjaxCreateConImg(createObj) {
    console.log(createObj.imgObj);
    if (createObj.imgObj != null && createObj.imgObj != "") {
        //用户传入了imgObj属性，代表需要上传图片
        UploadImg({
            file: createObj.imgObj,
            success(response) {
                if (response.status != 401) {
                    // console.log("url:" + response.content.fileurl);
                    switch (createObj.table) {
                        case "admin"://暂无图片需要存储
                            break;
                        case "carousel":
                            createObj.data.doc.path = response.content.fileurl;
                            break;
                        case "doctor":
                            createObj.data.doc.photo = response.content.fileurl;
                            break;
                        case "notification":
                            createObj.data.doc.cover = response.content.fileurl;
                            break;
                        case "operation"://暂无图片需要存储
                            break;
                        case "organization":
                            createObj.data.doc.photo = response.content.fileurl;
                            break;
                        case "register_secret"://暂无图片需要存储
                            break;
                        default:
                            return false;
                            break;
                    }
                }
                AjaxCreate(createObj);
            },
            error(response) {
                createObj.error(response);
            }
        });
    } else {
        //用户未传入了imgObj属性，代表不 需要上传图片
        AjaxCreate(createObj);
    }
}

//删
/*
* 接收一个对象参数（updateObj），该对象参数有以下几个可以用属性：
    var updateObj = {
        imgPath: "",
        table: "",
        id: "",
        success:function (response) {

        },
        error:function (response) {

        }
    };
*   1.imgPath：指定删除图片的服务器地址
*   2.table：指定删除数据的表
*   3.id：指定删除消息的id
*   4.success,error分别是ajax成功，失败的回调函数
* */
function AjaxDeleteConImg(deleteObj) {
    DeleteImg(deleteObj.imgPath);
    AjaxDelete(deleteObj);
}

//更新
/*
* 接收一个对象参数（updateObj），该对象参数有以下几个可以用属性：
    var updateObj = {
        imgObj: "",
        imgPath: "",
        table: "",
        id："",
        data:{},
        success:function (response) {

        },
        error:function (response) {

        }
    };
*   1.imgObj：指定更新的图片的file对象
*   2.imgPath：指定删除的图片的服务器地址
*   3.table：指定添加（新建）数据的表
*   4.id：指定更新消息的id
*   5.data：发送到服务器的更新数据，各表字段均选携，按携带字段更新_id所指定的条目，未携字段即不更新。
*   6.success,error分别是ajax成功，失败的回调函数
* */
function AjaxUpdateConImg(updateObj) {

    if (updateObj.imgObj != null && updateObj.imgObj != "") {
        //用户传入了imgObj属性，代表需要上传图片
        UploadImg({
            file: updateObj.imgObj,
            success(response) {
                response.targetFileUrl = response.content.fileurl;
                if (response.status != 401) {
                    // console.log("url:" + response.content.fileurl);
                    switch (updateObj.table) {
                        case "admin"://暂无图片需要存储
                            break;
                        case "carousel":
                            updateObj.data.update.path = response.content.fileurl;
                            break;
                        case "doctor":
                            updateObj.data.update.photo = response.content.fileurl;
                            break;
                        case "notification":
                            updateObj.data.update.cover = response.content.fileurl;
                            break;
                        case "operation"://暂无图片需要存储
                            break;
                        case "organization":
                            updateObj.data.update.photo = response.content.fileurl;
                            break;
                        case "register_secret"://暂无图片需要存储
                            break;
                        default:
                            return false;
                            break;
                    }
                }
                DeleteImg(updateObj.imgPath);
                AjaxUpdate(updateObj);
                updateObj.success(response);
            },
            error(response) {
                updateObj.error(response);
            }
        });
    } else {
        //用户未传入了imgObj属性，代表不 需要上传图片
        AjaxUpdate(updateObj);
    }
}
//
// $(function () {
//     var temp = "";
//
//     //新建测试,带图片
//     $("button").eq(0).click(function () {
//         console.log("create");
//         AjaxCreateConImg({
//             imgObj: temp,
//             table: "carousel",
//             data: {
//                 mode: 'single',
//                 doc: {
//                     "title": "标题13",
//                     "link": "",
//                     "order": "0"
//                 }
//             },
//             success: function (response) {
//
//                 console.log("success");
//                 console.log(response);
//             },
//             error: function (response) {
//                 console.log("error");
//                 console.log(response);
//             }
//         });
//
//
//     });
//
//     //更新测试
//     $("button").eq(1).click(function () {
//         console.log("update");
//         AjaxUpdateConImg({
//             imgObj: temp,
//             imgPath: "https://www.gayestmaple.com/dyatcm/admin/res/111.png",
//             table: "carousel",
//             id:"5e4e7e0b85ebcf7f37c14c61",
//             data:{
//                 update: {
//                     title: "测试3",
//                 }
//             },
//         success:function (response) {
//             console.log(response);
//
//         },
//         error:function (response) {
//
//         }
//         });
//         // AjaxUpdate({
//         //     table: "carousel",
//         //     id: "5e4e7e0b85ebcf7f37c14c61",
//         //     data: {
//         //         update: {
//         //             title: "测试2",
//         //         }
//         //     },
//         //     success: function (response) {
//         //         console.log(response);
//         //
//         //     },
//         //     error: function (response) {
//         //
//         //     }
//         // });
//     });
//
//     //删除测试
//     $("button").eq(2).click(function () {
//         console.log("delete");
//         AjaxDeleteConImg({
//             imgPath:"https://www.gayestmaple.com/dyatcm/admin/res/2222.png",
//             table:"carousel",
//             id:""
//         });
//
//     });
//
//     //清楚temp
//     $("button").eq(3).click(function () {
//         console.log("clear temp");
//         temp = "";
//         console.log("temp:" + temp);
//     });
//
//     $("input").change(function (evt) {
//         console.log("change");
//         temp = evt.target.files[0];
//         console.log(temp);
//     });
// //新建不带图
//     $("button").eq(4).click(function () {
//         console.log("update");
//     });
// });
