const ROOT_URL = '.../admin';

//二次封装用于查询的ajax请求
/*
* 接收一个对象参数（queryObj），该对象参数有以下几个可以用属性：
    var queryObj = {
        table: "",
        queryType:"",
        id:"",
        data:{},
        success:function (response) {

        },
        error:function (response) {

        }
    };
*   1.table：指定查询的表
*   2.queryType：指定查询类型，共有【一般查询（general）】、【指定查询（specified）】两种，默认是一般查询，同时忽略id属性
*   3.id：指定查询类型为指定查询时的目标条目的id
*   4.data：发送到服务器的数据（与jQ封装的ajax函数接收的对象参数的data属性相同）。
*   5.success,error分别是ajax成功，失败的回调函数
* */
function AjaxQuery(queryObj) {
    /*
    * 判断是否允许发送请求
    * 不允许发送请求的情况：
    *   ①未传入queryObj对象参数
    *   ②未指定查询表
    * */
    var isAllow = false;

    if (queryObj) {
        //成功传入queryObj参数
        //判断是否指定查询表
        if (queryObj.hasOwnProperty("table")) {
            /*
            * 判断是否指定查询类型
            * 1.如果指定为指定查询的同时指定id则为指定查询，其他为一般查询
            *   1.1 上述其他包括：
            *       ①未指定查询类型
            *       ②指定查询类型为"general"
            *       ③指定查询类型为"specified"，但是没有指定id
            * 2.如果为一般查询，如果指定data则使用指定的data，否则指定data为{}
            * */
            if (queryObj.hasOwnProperty("queryType")) {
                if (queryObj.queryType == "specified" && queryObj.hasOwnProperty("id")) {
                } else {
                    queryObj.queryType = "general";
                }
            } else {
                queryObj.queryType = "general";
            }

            //判断queryObj是否有data，没有的话设置data为{}
            if (queryObj.hasOwnProperty("data")) {
            } else {
                queryObj.data = {};
            }

            //判断queryObj是否有success和error，没有的话设置其为空函数
            if (queryObj.hasOwnProperty("success")) {
            } else {
                queryObj.success = function () {
                };
            }
            if (queryObj.hasOwnProperty("error")) {
            } else {
                queryObj.error = function () {
                };
            }
            isAllow = true;
        } else {
            //未指定查询表
        }
    } else {
        //未传入queryObj参数
    }

    if (isAllow) {
        switch (queryObj.queryType) {
            case "general":
                /*
                    * 一般查询（下述查询均在指定表下进行）：
                    * 1. `${ROOT_URL}/api/${表名}` // 无携带参数，查询所有条目
                    * 2. `${ROOT_URL}/api/${表名}?${字段名}=${指定值}` // 携带一个参数，查询符合条件的所有条目
                    * 3. `${ROOT_URL}/api/${表名}?${字段名1}=${指定值a}&${字段名2}=${指定值b}` // 携带多个参数，查询符合全部条件的所有条目
                    * */
                $.ajax({
                    type: "get",
                    url: ROOT_URL + '/api/' + queryObj.table,
                    data: queryObj.data,
                    dataType: "json",
                    beforeSend(request) {
                        request.setRequestHeader("Authorization", "Bearer " + localStorage.getItem('token'));
                    },
                    success(response) {
                        queryObj.success(response);
                        if (response.status == 401) {
                            alertify.warning("访问权限已过期，请重新登录");
                            $(window).attr('location', ROOT_URL + '/acc');
                        }  else if (response.status == 400) {
                            alertify.error("传参错误");
                        } else if (response.status == 404) {
                            alertify.error("目标不存在");
                        } else if (response.status == 500) {
                            alertify.error("服务器内部错误");
                        } else {
                            /*
                                status:
                                200: ok
                                404: 目标不存在
                                500: 服务器内部错误
                            */
                            // console.log(response);
                        }
                    },
                    error(response) {
                        alertify.error("error");
                        queryObj.error(response);
                    }
                });
                break;
            case "specified":
                $.ajax({
                    type: "get",
                    url: ROOT_URL + '/api/' + queryObj.table + '/' + queryObj.id,
                    dataType: "json",
                    beforeSend(request) {
                        request.setRequestHeader("Authorization", "Bearer " + localStorage.getItem('token'));
                    },
                    success(response) {
                        queryObj.success(response);
                        // if (response.status == 401) {
                        //     $(window).attr('location', ROOT_URL + '/acc');
                        // } else {
                        //     /*
                        //         status:
                        //         200: ok
                        //         404: 目标不存在
                        //         500: 服务器内部错误
                        //     */
                        //     console.log(response);
                        // }
                    },
                    error(response) {
                        queryObj.error(response);
                    }
                });
                break;
            default:
                break;
        }
    }
}

//二次封装用于创建的ajax请求
/*
* 接收一个对象参数（createObj），该对象参数有以下几个可以用属性：
    var createObj = {
        table: "",
        data:{},
        success:function (response) {

        },
        error:function (response) {

        }
    };
*   1.table：指定添加（新建）数据的表
*   2.data：发送到服务器的数据（与jQ封装的ajax函数接收的对象参数的data属性相同）。
*   3.success,error分别是ajax成功，失败的回调函数
* */
function AjaxCreate(createObj) {
    /*
    * 判断是否允许发送新建请求
    * 不允许发送请求的情况：
    *   ①未传入createObj对象参数
    *   ②未指定添加（新建）数据的表
    *   ③未传入data参数
    * */
    var isAllow = false;

    if (createObj) {
        //成功传入createObj参数
        //判断是否指定新建数据表，未指定无法发送新建请求
        if (createObj.hasOwnProperty("table")) {
            //判断是否传入data参数，未传入data参数无法发送新建请求
            if (createObj.hasOwnProperty("data")) {
                //判断queryObj是否有success和error，没有的话设置其为空函数
                if (!createObj.hasOwnProperty("success")) {
                    createObj.success = function () {
                    };
                }
                if (!createObj.hasOwnProperty("error")) {
                    createObj.error = function () {
                    };
                }
                isAllow = true;
            }
        }
    }


    if (isAllow) {
        $.ajax({
            type: "post",
            url: ROOT_URL + '/api/' + createObj.table,
            data: createObj.data,
            dataType: "json",
            beforeSend(request) {
                request.setRequestHeader("Authorization", "Bearer " + localStorage.getItem('token'));
            },
            success(response) {
                createObj.success(response);
                if (response.status == 401) {
                    alertify.warning("访问权限已过期，请重新登录");
                    $(window).attr('location', ROOT_URL + '/acc');
                } else if (response.status == 400) {
                    alertify.error("传参错误");
                } else if (response.status == 404) {
                    alertify.error("目标不存在");
                } else if (response.status == 500) {
                    alertify.error("服务器内部错误");
                } else {
                    /*
                        status:
                        201: 创建成功
                        202: 用户名已存在
                        500: 服务器内部错误
                    */
                    // console.log(response);
                }
            },
            error(response) {
                alertify.error("error");
                createObj.error(response);
            }
        });
    }
}

//二次封装用于更新的ajax请求
/*
* 接收一个对象参数（updateObj），该对象参数有以下几个可以用属性：
    var updateObj = {
        table: "",
        id："",
        data:{},
        success:function (response) {

        },
        error:function (response) {

        }
    };
*   1.table：指定添加（新建）数据的表
*   2.id：指定更新消息的id
*   3.data：发送到服务器的更新数据，各表字段均选携，按携带字段更新_id所指定的条目，未携字段即不更新。
*   4.success,error分别是ajax成功，失败的回调函数
* */
function AjaxUpdate(updateObj) {
    /*
    * 判断是否允许发送更新请求
    * 不允许发送请求的情况：
    *   ①未传入updateObj对象参数
    *   ②未指定添加（新建）数据的表
    *   ③未指定id
    * */
    var isAllow = false;
    if (updateObj) {
        //成功传入updateObj参数
        //判断是否指定新建数据表，未指定无法发送新建请求
        if (updateObj.hasOwnProperty("table")) {
            //判断是否传入data参数，未传入data参数无法发送新建请求
            if (updateObj.hasOwnProperty("id")) {
                if (!updateObj.hasOwnProperty("data")) {
                    updateObj.data = {};
                }

                //判断queryObj是否有success和error，没有的话设置其为空函数
                if (!updateObj.hasOwnProperty("success")) {
                    updateObj.success = function () {
                    };
                }
                if (!updateObj.hasOwnProperty("error")) {
                    updateObj.error = function () {
                    };
                }
                isAllow = true;
            }
        }
    }


    if (isAllow) {
        $.ajax({
            type: "put",
            url: ROOT_URL + '/api/' + updateObj.table + '/' + updateObj.id,
            data: updateObj.data,
            dataType: "json",
            beforeSend(request) {
                request.setRequestHeader("Authorization", "Bearer " + localStorage.getItem('token'));
            },
            success(response) {
                updateObj.success(response);
                if (response.status == 401) {
                    alertify.warning("访问权限已过期，请重新登录");

                    $(window).attr('location', ROOT_URL + '/acc');
                } else if (response.status == 400) {
                    alertify.error("传参错误");
                } else if (response.status == 404) {
                    alertify.error("目标不存在");
                } else if (response.status == 500) {
                    alertify.error("服务器内部错误");
                } else {
                    /*
                        status:
                        205: 更新成功
                        404: 目标不存在
                        500: 服务器内部错误
                    */
                    // console.log(response);
                }
            },
            error(response) {
                alertify.error("error");
                updateObj.error(response);
            }
        });
    }
}

//二次封装用于删除的ajax请求
/*
* 接收一个对象参数（updateObj），该对象参数有以下几个可以用属性：
    var updateObj = {
        table: "",
        id："",
        success:function (response) {

        },
        error:function (response) {

        }
    };
*   1.table：指定删除数据的表
*   2.id：指定删除消息的id
*   3.success,error分别是ajax成功，失败的回调函数
* */
function AjaxDelete(deleteObj) {
    /*
    * 判断是否允许发送删除请求
    * 不允许发送请求的情况：
    *   ①未传入deleteObj对象参数
    *   ②未指定删除数据的表
    *   ③未指定id
    * */
    var isAllow = false;
    if (deleteObj) {
        //成功传入deleteObj参数
        //判断是否指定新建数据表，未指定无法发送新建请求
        if (deleteObj.hasOwnProperty("table")) {
            //判断是否传入data参数，未传入data参数无法发送新建请求
            if (deleteObj.hasOwnProperty("id")) {
                //判断queryObj是否有success和error，没有的话设置其为空函数
                if (!deleteObj.hasOwnProperty("success")) {
                    deleteObj.success = function () {
                    };
                }
                if (!deleteObj.hasOwnProperty("error")) {
                    deleteObj.error = function () {
                    };
                }
                isAllow = true;
            }
        }
    }

    if (isAllow) {
        $.ajax({
            type: "delete",
            url: ROOT_URL + '/api/' + deleteObj.table + '/' + deleteObj.id,
            dataType: "json",
            beforeSend(request) {
                request.setRequestHeader("Authorization", "Bearer " + localStorage.getItem('token'));
            },
            success(response) {
                deleteObj.success(response);
                if (response.status == 401) {
                    alertify.warning("访问权限已过期，请重新登录");
                    $(window).attr('location', ROOT_URL + '/acc');
                } else if (response.status == 400) {
                    alertify.error("传参错误");
                } else if (response.status == 404) {
                    alertify.error("目标不存在");
                } else if (response.status == 500) {
                    alertify.error("服务器内部错误");
                } else {
                    /*
                        status:
                        205: 删除成功
                        404: 目标不存在
                        500: 服务器内部错误
                    */
                    // console.log(response);
                }
            },
            error(response) {
                alertify.error("error");
                deleteObj.error(response);
            }
        });
    }
}