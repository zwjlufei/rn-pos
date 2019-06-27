import React, {Component} from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    TouchableWithoutFeedback,
    Dimensions,
    StatusBar,
    Image,
    TextInput,
    ScrollView, DeviceEventEmitter, Modal, Alert
} from 'react-native';
var {width,height} = Dimensions.get('window');
import px2dp from './../tools/px2dp';
import Header from "./../CommonModules/Header";
import {compareTime, dataReset, feach_request, getStorage, Toast} from "../tools/Public";
import Loading from "../CommonModules/Loading";
import constant from "../tools/constant";
export default class CareOrderInfo extends Component{
    static navigationOptions = {
        header: null
    };
    constructor(props){
        super(props);
        this.state = {
            hasGive:false,
            info:null,
            loading:true,
            modalVisible: false,
            phSalary:[],
            disable:false,
            chargeBack:[],
            salary:[],
            serviceRecord:[]
        }
    }
    componentWillMount(){
        const rowData=this.props.navigation.state.params.rowData;
        getStorage('userInfo')
            .then(data=>{
                this.setState({
                    userInfo:data,
                    rowData:rowData
                })
                this.initData(rowData,data);
                this.getRecord(rowData,data);
            }).catch(err=>{
            console.log(err)
        })

    }
    //获取服务、退款、工资记录
    getRecord(rowData,userInfo){
        var data={
            order_id:rowData.id,
            token:userInfo.token
        };
        data = dataReset(data);
        feach_request('/pos_order_info','POST',data,this.props.navigation)
            .then((data)=>{
                if(data.status==0){
                    this.setState({
                        chargeBack:data.data.charge_back,
                        salary:data.data.salary,
                        serviceRecord:data.data.service_record
                    })
                }
            })
            .catch((err)=>{
                console.log(err);
                Toast('出现未知错误，请稍后再试～');
            })
    }
    //数据初始化
    initData(rowData,userInfo){
        var data={
            order_id:rowData.id,
            order_type:rowData.type,
            token:userInfo.token
        };
        data = dataReset(data);
        feach_request('/pos_order_details','POST',data,this.props.navigation)
            .then((data)=>{
                if(data.status==0){
                    data.data.order.order_id=rowData.id;
                    this.setState({
                        loading:false,
                        info:data.data.order
                    })
                }
            })
            .catch((err)=>{
                console.log(err);
                Toast('出现未知错误，请稍后再试～');
            })
    }
    //注册通知
    componentDidMount(){
        DeviceEventEmitter.addListener('UpdateData',()=>{
            //接收到详情页发送的通知，刷新首页的数据，改变按钮颜色和文字，刷新UI
            this.initData(this.state.rowData,this.state.userInfo);
        });
    }
    //按钮操作
    orderBtn(type){
        const state=this.state.info.status;
        const { navigate } = this.props.navigation;
        if(state=='chargeback_ing'||state=='chargeback_done'){
            Toast(`该订单${constant[state]},无法操作该按钮`);
        }else {
            if(type=='back'){
                Alert.alert(
                    '',
                    '您确定要进行退单吗？',
                    [
                        {text: '取消', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                        {text: '确定', onPress: () => {
                                navigate('CareBack',{info:this.state.info});
                            }},
                    ],
                    { cancelable: false }
                );
            }else if(type=='pay'){
                navigate('CarePay',{info:this.state.info})
            }else if(type=='change'){
                navigate('CreateNewServer',{info:this.state.info,source:'care'})
            }
        }
    }
    //合算工资
    checkSalary(){
        const state=this.state.info.status;
        const date=new Date();
        const nowDate=date.getFullYear() + '-' + Number(date.getMonth() + 1) + '-' + Number(date.getDate()) +' ' + Number(date.getHours())+':'+Number(date.getMinutes());
        const endDate=this.state.info.end_datetime;
        const compare = compareTime(endDate,nowDate);
        var data={
            contracts_id:this.state.info.contracts_id,
            order_id:this.state.info.order_id,
            token:this.state.userInfo.token
        };
        data = dataReset(data);
        if(state=='chargeback_ing'||state=='chargeback_reject'){
            Toast(`该订单${constant[state]},无法操作该按钮`);
        }else if(compare){
            Toast('服务未结束，无法核算工资～');
        }else {
            if(!this.state.disable){
                feach_request('/pos_ph_salary_wage','POST',data,this.props.navigation)
                    .then((data)=>{
                        if(data.status=='0'){
                            this.setState({
                                phSalary:data.data.ph_salary,
                                modalVisible:true
                            })
                        }

                    })
                    .catch((err)=>{
                        console.log(err);
                        Toast('出现未知错误，请稍后再试～');
                    })
            }
        }
    }
    render(){
        const { navigate } = this.props.navigation;
        const hasBtn = this.props.navigation.state.params.hasBtn;
        return(
            <View style={{flex:1,backgroundColor: '#fcfcfc'}}>
                <Header title={'陪护单信息'} navigate={this.props.navigation}/>
                {
                    this.state.info?(
                        <ScrollView>
                            <View style={styles.info_item}>
                                <View style={styles.flex_space_between}>
                                    <Text style={styles.item_title}>客户姓名:</Text>
                                    <Text style={styles.item_content}>{this.state.info.customer_name}</Text>
                                </View>
                                <View style={styles.flex_space_between}>
                                    <Text style={styles.item_title}>客户手机号:</Text>
                                    <Text style={styles.item_content}>{this.state.info.customer_phone}</Text>
                                </View>
                                <View style={styles.flex_space_between}>
                                    <Text style={styles.item_title}>客户身份证号:</Text>
                                    <Text style={styles.item_content}>{this.state.info.customer_id_number?this.state.info.customer_id_number:'无'}</Text>
                                </View>
                                <View style={styles.flex_space_between}>
                                    <Text style={styles.item_title}>宝宝生日:</Text>
                                    <Text style={styles.item_content}>{this.state.info.customer_birth}</Text>
                                </View>
                                <View style={styles.flex_space_between}>
                                    <Text style={styles.item_title}>宝宝性别:</Text>
                                    <Text style={styles.item_content}>{constant[this.state.info.customer_sex]}</Text>
                                </View>
                            </View>
                            <View style={styles.info_item}>
                                <View style={styles.flex_space_between}>
                                    <Text style={styles.item_title}>订单号:</Text>
                                    <Text style={styles.item_content}>{this.state.info.order_id}</Text>
                                </View>
                                <View style={styles.flex_space_between}>
                                    <Text style={styles.item_title}>创建时间:</Text>
                                    <Text style={styles.item_content}>{this.state.info.create_date}</Text>
                                </View>
                                <View style={styles.flex_space_between}>
                                    <Text style={styles.item_title}>床号:</Text>
                                    <Text style={styles.item_content}>{this.state.info.bed_no}</Text>
                                </View>
                                <View style={styles.flex_space_between}>
                                    <Text style={styles.item_title}>订单类型:</Text>
                                    <Text style={[styles.item_content,styles.strong_font]}>{constant[this.state.info.order_type]}</Text>
                                </View>
                                <View style={styles.flex_space_between}>
                                    <Text style={styles.item_title}>订单状态:</Text>
                                    <Text style={styles.item_content}>{constant[this.state.info.status]}</Text>
                                </View>
                                <View style={styles.flex_space_between}>
                                    <Text style={styles.item_title}>服务天数:</Text>
                                    <Text style={styles.item_content}>{this.state.info.ph_days}天</Text>
                                </View>
                                <View style={styles.flex_space_between}>
                                    <Text style={styles.item_title}>订单金额:</Text>
                                    <Text style={[styles.item_content,styles.blue_color]}>{this.state.info.amount}元</Text>
                                </View>
                            </View>
                            <View style={styles.info_item}>
                                <View style={styles.flex_space_between}>
                                    <Text style={styles.item_title}>服务开始时间:</Text>
                                    <Text style={styles.item_content}>{this.state.info.start_datetime}</Text>
                                </View>
                                <View style={styles.flex_space_between}>
                                    <Text style={styles.item_title}>服务结束时间:</Text>
                                    <Text style={styles.item_content}>{this.state.info.end_datetime}</Text>
                                </View>
                                <View style={styles.flex_space_between}>
                                    <Text style={styles.item_title}>服务员工姓名:</Text>
                                    <Text style={styles.item_content}>{this.state.info.waiter_name}</Text>
                                </View>
                                <View style={styles.flex_space_between}>
                                    <Text style={styles.item_title}>服务员工手机号:</Text>
                                    <Text style={styles.item_content}>{this.state.info.waiter_phone_number}</Text>
                                </View>
                            </View>
                            <View style={styles.info_item}>
                                <Text style={[styles.item_title,styles.module_title]}>历史服务</Text>
                                {
                                    this.state.serviceRecord.length==0?(
                                        <View style={styles.flex_space_between}>
                                            <Text style={[styles.item_title,styles.pl_15]}>暂无服务记录</Text>
                                        </View>
                                    ):(
                                        this.state.serviceRecord.map((item,index)=>{
                                            return(
                                                <View key={index} style={styles.flex_space_between}>
                                                    <Text style={[styles.item_title,styles.pl_15]}>{index+1}、{item.name}   服务{item.duration}天</Text>
                                                </View>
                                            )
                                        })
                                    )
                                }
                            </View>
                            <View style={styles.info_item}>
                                <Text style={[styles.item_title,styles.module_title]}>退款记录</Text>
                                {
                                    this.state.chargeBack.length==0?(
                                        <View style={styles.flex_space_between}>
                                            <Text style={[styles.item_title,styles.pl_15]}>暂无退款记录</Text>
                                        </View>
                                    ):(
                                        this.state.chargeBack.map((item,index)=>{
                                            return(
                                                <View key={index} style={styles.flex_space_between}>
                                                    <Text style={[styles.item_title,styles.pl_15]}>{index+1}、{item.write_date}   退款{item.amount}元</Text>
                                                </View>
                                            )
                                        })
                                    )
                                }
                            </View>
                            <View style={styles.info_item}>
                                <Text style={[styles.item_title,styles.module_title]}>工资记录</Text>
                                {
                                    this.state.salary.length==0?(
                                        <View style={styles.flex_space_between}>
                                            <Text style={[styles.item_title,styles.pl_15]}>暂无工资记录</Text>
                                        </View>
                                    ):(
                                        this.state.salary.map((item,index)=>{
                                            return(
                                                <View key={index} style={styles.flex_space_between}>
                                                    <Text style={[styles.item_title,styles.pl_15]}>订单号:</Text>
                                                    <Text style={styles.item_content}>{this.state.info.order_id}</Text>
                                                </View>
                                            )
                                        })
                                    )
                                }
                            </View>
                        </ScrollView>
                    ):(
                        <Loading loading={this.state.loading}/>
                    )
                }
                {
                    hasBtn&&this.state.info?(
                        <View>
                            <View style={[styles.flex_space_between,styles.bottom_btn_wrap]}>
                                <TouchableWithoutFeedback onPress={()=>{this.orderBtn('back')}}>
                                    <View style={[styles.bottom_btn]}>
                                        <Text style={[styles.bottom_btn_font]}>退单</Text>
                                    </View>
                                </TouchableWithoutFeedback>
                                <View style={styles.btn_gap}></View>
                                <TouchableWithoutFeedback onPress={()=>{this.orderBtn('change')}}>
                                    <View style={styles.bottom_btn}>
                                        <Text style={styles.bottom_btn_font}>更换服务员工</Text>
                                    </View>
                                </TouchableWithoutFeedback>
                                <TouchableWithoutFeedback onPress={()=>{this.orderBtn('pay')}}>
                                    <View style={[styles.bottom_btn,styles.bottom_btn_on]}>
                                        <Text style={[styles.bottom_btn_font,styles.bottom_btn_font_on]}>立即支付</Text>
                                    </View>
                                </TouchableWithoutFeedback>
                            </View>
                            <View>
                                <TouchableWithoutFeedback onPress={()=>{this.checkSalary()}}>
                                    <View style={[styles.bottom_btn_on,this.state.disable?styles.gray_bg:'']}>
                                        <Text style={[styles.bottom_btn_font,styles.bottom_btn_font_on,this.state.disable?styles.gray_color:'']}>核算工资</Text>
                                    </View>
                                </TouchableWithoutFeedback>
                            </View>
                        </View>

                    ):(null)
                }
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={this.state.modalVisible}
                    onRequestClose={() => {
                        this.setState({
                            modalVisible: false
                        })
                    }}>
                    <View style={styles.modal_wrap}>
                        <View style={styles.success_wrap}>
                            <Text style={{textAlign:'center',fontSize:px2dp(18),marginBottom: px2dp(20)}}>工资核算</Text>
                            {
                                this.state.phSalary.length==0?(
                                    <Text style={{textAlign:'center',fontSize:px2dp(15),color:'#a3a3a3'}}>服务员工：0元</Text>
                                ):(
                                    this.state.phSalary.map((item,index)=>{
                                        return(
                                            <Text key={index} style={{textAlign:'center',fontSize:px2dp(15),color:'#a3a3a3'}}>{item.name}：{item.salary}元</Text>
                                        )
                                    })
                                )
                            }
                            <TouchableWithoutFeedback onPress={()=>{this.setState({
                                modalVisible: false,
                                disable:true
                            })}}>
                                <View style={styles.modal_btn}>
                                    <Text style={{color:'#fff',textAlign:'center',lineHeight:px2dp(40),fontSize:px2dp(16)}}>确定</Text>
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                    </View>
                </Modal>
            </View>

        )
    }
}
const styles = StyleSheet.create({
    flex:{
        flex:1
    },
    flex_space_between:{
        flexDirection:'row',
        justifyContent: 'space-between',
        alignItems:'center'
    },
    item_title:{
        flex:1,
        fontSize:px2dp(13),
        color:'#4b4b4b',
        lineHeight:px2dp(32)
    },
    item_content:{
        flex:2,
        fontSize:px2dp(14),
        color:'#000',
        lineHeight:px2dp(32)
    },
    info_item:{
        borderBottomWidth: 1,
        borderBottomColor:'#efefef',
        paddingVertical: px2dp(24),
        paddingHorizontal: px2dp(18)
    },
    bottom_btn:{
        flex:1,
        height:px2dp(50)
    },
    bottom_btn_font:{
        textAlign:'center',
        color:'#64bdf9',
        fontSize:px2dp(18),
        lineHeight:px2dp(50)
    },
    bottom_btn_on:{
        backgroundColor:'#64bdf9'
    },
    bottom_btn_font_on:{
        color:'#fff'
    },
    bottom_btn_wrap:{
        height:px2dp(50),
        elevation:2,
        backgroundColor: '#fff'
    },
    btn_gap:{
        width:1,
        height:px2dp(25),
        backgroundColor:'#d9d9d9'
    },
    blue_color:{
        color:'#64bdf9'
    },
    gray_bg: {
        backgroundColor:'#f8f8f8'
    },
    gray_color:{
        color:'#666'
    },
    modal_wrap:{
        flex:1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center'
    },
    success_wrap:{
        width:px2dp(240),
        borderRadius:px2dp(5),
        backgroundColor:'#fff',
        paddingTop: px2dp(20)
    },
    modal_btn:{
        height:px2dp(40),
        borderRadius:px2dp(5),
        backgroundColor:'#64bdf9',
        marginHorizontal:px2dp(17),
        marginTop:px2dp(35),
        elevation:3,
        marginBottom: px2dp(10)
    },
    mt_30:{
        marginTop:px2dp(10)
    },
    modal_btn_left:{
        backgroundColor:'#fff',
    },
    strong_font:{
        fontWeight: '600'
    },
    module_title:{
        fontSize:px2dp(14),
        marginLeft: -px2dp(8),
        fontWeight: '600'
    },
    pl_15:{
        paddingLeft: px2dp(2)
    }
});