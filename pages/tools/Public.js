//公共方法
import React, { Component } from 'react';
import {ToastAndroid,AsyncStorage} from 'react-native';

const URL = 'http://47.95.254.178:8169';
//数据请求
export function feach_request(api,method,data,navigation){
    if (method === 'GET'){
        return new Promise((resolve,reject)=>{
            fetch(URL+api,{
                method : method,
            }).then(response=> response.json())
                .then(responseData=>{
                    resolve(responseData)
                })
                .catch(error=>{
                    reject(error)
                })
        })
    }else{
        return new Promise((resolve,reject)=>{
            fetch(URL+api,{
                method : method,
                headers : {
                    'Accept': 'application/json',
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
                },
                body:data
            }).then(response=> response.json())
                .then(responseData=>{
                    if(responseData.data.code==20001 || responseData.data.code==20002){
                        ToastAndroid.showWithGravity(
                            '登录过期，请重新登录～',
                            ToastAndroid.SHORT,
                            ToastAndroid.CENTER
                        );
                        navigation.navigate('Login')
                    }else {
                        resolve(responseData)
                    }
                })
                .catch(error=>{
                    reject(error)
                })
            setTimeout(()=>{
                reject('network error')
            },10000)
        })
    }
}
//弹框
export function Toast(message) {
    ToastAndroid.showWithGravity(
        message,
        ToastAndroid.SHORT,
        ToastAndroid.CENTER
    );
}
//获取storage
export function getStorage(type){
    return new Promise((resolve,reject)=>{
        AsyncStorage.getItem(type,(error,result)=>{
            if (result != null){
                var user_info = JSON.parse(result)
                resolve(user_info)
            }else{
                reject(error)
            }
        })
    })
}
//数据上传格式转换
export function dataReset(data){
    var param = '';
    for(const i in data){
        param = param+`${i}=${data[i]}&`
    }
    param = param.substring(0,param.length-1)
    return param;
}
//身份证号验证
export function checkID(ID) {
    if(typeof ID !== 'string'){
        return false;
    }
    var city = {11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",21:"辽宁",22:"吉林",23:"黑龙江 ",31:"上海",32:"江苏",33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南",42:"湖北 ",43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆",51:"四川",52:"贵州",53:"云南",54:"西藏 ",61:"陕西",62:"甘肃",63:"青海",64:"宁夏",65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外"};
    var birthday = ID.substr(6, 4) + '/' + Number(ID.substr(10, 2)) + '/' + Number(ID.substr(12, 2));
    var d = new Date(birthday);
    var newBirthday = d.getFullYear() + '/' + Number(d.getMonth() + 1) + '/' + Number(d.getDate());
    var currentTime = new Date().getTime();
    var time = d.getTime();
    var arrInt = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
    var arrCh = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'];
    var sum = 0, i, residue;

    if(!/^\d{17}(\d|x)$/i.test(ID)){
        return false;
    }
    if(city[ID.substr(0,2)] === undefined){
        return false;
    }
    if(time >= currentTime || birthday !== newBirthday){
        return false;
    }
    for(i=0; i<17; i++) {
        sum += ID.substr(i, 1) * arrInt[i];
    }
    residue = arrCh[sum % 11];
    if (residue !== ID.substr(17, 1)){
        return false;
    }
    return true;
}
//时间转换
export function timeTransform(date,type,time){
    let regEx = new RegExp("\\-","gi");
    let validDateStr=date.replace(regEx,"/");
    var newDate='';
    if(type=='day'){
       newDate=new Date(Date.parse(validDateStr)+time*3600*1000*24);
    }else if(type=='hour'){
       newDate=new Date(Date.parse(validDateStr)+time*3600*1000);
    }
    const newTime = newDate.getFullYear() + "-" + ((newDate.getMonth() + 1)<10?'0'+(newDate.getMonth() + 1):(newDate.getMonth() + 1)) + "-" + (newDate.getDate()<10?'0'+newDate.getDate():newDate.getDate()) + "  " + (newDate.getHours()<10?'0'+ newDate.getHours():newDate.getHours())+ ":" + (newDate.getMinutes()<10?'0'+newDate.getMinutes():newDate.getMinutes())+ ":" + (newDate.getSeconds()<10?'0'+newDate.getSeconds():newDate.getSeconds());
    return newTime;
}
//时间比较
export function compareTime(time1,time2) {
    let regEx = new RegExp("\\-","gi");
    let Time1=time1.replace(regEx,"/");
    let Time2=time2.replace(regEx,"/");
    if(Date.parse(Time1)>Date.parse(Time2)||Date.parse(Time1)==Date.parse(Time2)){
        return true;
    }else {
        return false;
    }
}