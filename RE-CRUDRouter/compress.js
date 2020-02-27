/*
    将base64转换为file对象
    dataurl: 指定待转化的base64数据;
    filename: 指定返回file对象对应文件的文件名;
*/
let dataURLtoFile = (dataurl, filename) => {
    let arr = dataurl.split(','),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]), n = bstr.length,
    u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, {type: mime});
}
/*
    将base64转换为blob对象
    dataurl: 指定待转化的base64数据;
*/
let dataURLtoBlob = (dataurl) => {
    let arr = dataurl.split(','),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {type: mime});
}
/*
    压缩图片，返回base64数据
    imgObj: 指定待压缩的图片（File对象）;
    level: 压缩级别，越大压缩程度越高（正数）;
*/
let compress =  (imgObj, level) => {
    return new Promise( (resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(imgObj);
        reader.onload = (e) => {
            let image = new Image();
            image.onload = () => {    
                let canvas = document.createElement('canvas'),
                context = canvas.getContext('2d'),
                imgWidth = image.width / level,
                imgHeight = image.height / level;
                canvas.width = imgWidth;
                canvas.height = imgHeight;
                context.drawImage(image, 0, 0, imgWidth, imgHeight);
                let dataURL = canvas.toDataURL('image/png');
                if (image.complete == true) {
                    resolve(dataURL);
                } else {
                    reject(false);
                }
            }
            image.src = e.target.result;
        }
    });
}