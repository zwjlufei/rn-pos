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
    ScrollView, DeviceEventEmitter, Alert
} from 'react-native';
var {width,height} = Dimensions.get('window');
import px2dp from './../tools/px2dp';
import Header from "./../CommonModules/Header";
import {dataReset, feach_request, getStorage, Toast} from "../tools/Public";
import Loading from "../CommonModules/Loading";
import constant from "../tools/constant";
export default class ProlactinOrderInfo extends Component{
    static navigationOptions = {
        header: null
    };
    constructor(props){
        super(props);
        this.state = {
            hasGive:false,
            info:'',
            userInfo:'',
            chargeBack:[],
            salary:[],
            serviceRecord:[]
        }
    }
    componentWillMount(){
        const rowData=this.props.navigation.state.params.rowData;
        this.setState({
            rowData: rowData
        })
        getStorage('userInfo')
            .then(data=>{
                this.setState({
                    userInfo:data
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
                let serviceRecord=[];
                if(data.status==0){
                    data.data.service_record.map((item,index)=>{
                        if(item.times!==0){
                            serviceRecord.push(item)
                        }
                    });
                    this.setState({
                        chargeBack:data.data.charge_back,
                        salary:data.data.salary,
                        serviceRecord:serviceRecord
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
    //按钮操作
    orderBtn(type){
        const state=this.state.info.status;
        const { navigate } = this.props.navigation;
        if(state=='chargeback_ing'||state=='chargeback_done'){
            Toast(`该订单${constant[state]},无法操作该按钮`);
        }else if(state=='done'){
            if(type=='pay'){
                navigate('ProlactinPay',{info:this.state.info});
            }else {
                Toast(`该订单${constant[state]},无法操作该按钮`);
            }
        }else {
            if(type=='back'){
                Alert.alert(
                    '',
                    '您确定要进行退单吗？',
                    [
                        {text: '取消', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                        {text: '确定', onPress: () => {
                                navigate('ProlactinBack',{info:this.state.info});
                            }},
                    ],
                    { cancelable: false }
                )
            }else if(type=='pay'){
                navigate('ProlactinPay',{info:this.state.info});
            }else if(type=='change'){
                navigate('CreateNewServer',{info:this.state.info,source:'prolactin'});
            }
        }
    }
    render(){
        const { navigate } = this.props.navigation;
        const hasBtn = this.props.navigation.state.params.hasBtn;
        return(
            <View style={{flex:1,backgroundColor: '#fcfcfc'}}>
                <Header title={'母指单信息'} navigate={this.props.navigation}/>
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
                                    <Text style={styles.item_content}>{constant[this.state.info.order_type]}</Text>
                                </View>
                                <View style={styles.flex_space_between}>
                                    <Text style={styles.item_title}>订单状态:</Text>
                                    <Text style={[styles.item_content,styles.strong_font]}>{constant[this.state.info.status]}</Text>
                                </View>
                                <View style={styles.flex_space_between}>
                                    <Text style={styles.item_title}>服务次数:</Text>
                                    <Text style={styles.item_content}>{this.state.info.cr_times}次</Text>
                                </View>
                                <View style={styles.flex_space_between}>
                                    <Text style={styles.item_title}>剩余次数:</Text>
                                    <Text style={styles.item_content}>{this.state.info.remaining}次</Text>
                                </View>
                                <View style={styles.flex_space_between}>
                                    <Text style={styles.item_title}>上户次数:</Text>
                                    <Text style={styles.item_content}>{this.state.info.cr_customers_times}次</Text>
                                </View>
                                <View style={styles.flex_space_between}>
                                    <Text style={styles.item_title}>订单金额:</Text>
                                    <Text style={[styles.item_content,styles.blue_color]}>{this.state.info.amount}元</Text>
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
                                                    <Text style={[styles.item_title,styles.pl_15]}>{index+1}、{item.name} {constant[item.location]}服务  {item.times}次</Text>
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
                        </ScrollView>
                        ):(
                        <Loading loading={this.state.loading}/>
                    )
                }

                {
                    hasBtn&&this.state.info?(
                        <View style={[styles.flex_space_between,styles.bottom_btn_wrap]}>
                            {
                                this.state.info.remaining == '0' ? (null) : (
                                    <TouchableWithoutFeedback onPress={()=>{this.orderBtn('back')}}>
                                        <View style={styles.bottom_btn}>
                                            <Text style={styles.bottom_btn_font}>退单</Text>
                                        </View>
                                    </TouchableWithoutFeedback>
                                )
                            }
                            <View style={styles.btn_gap}></View>
                            <TouchableWithoutFeedback onPress={()=>{this.orderBtn('change')}}>
                                <View style={[styles.bottom_btn]}>
                                    <Text style={[styles.bottom_btn_font]}>创建服务记录</Text>
                                </View>
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback onPress={()=>{this.orderBtn('pay')}}>
                                <View style={[styles.bottom_btn,styles.bottom_btn_on]}>
                                    <Text style={[styles.bottom_btn_font,styles.bottom_btn_font_on]}>立即支付</Text>
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                    ):(null)
                }
            </View>

        )
    }
    //注册通知
    componentDidMount(){
        DeviceEventEmitter.addListener('UpdateData',()=>{
            //接收到详情页发送的通知，刷新首页的数据，改变按钮颜色和文字，刷新UI
            this.initData(this.state.rowData,this.state.userInfo);
            this.getRecord(this.state.rowData,this.state.userInfo);
        });
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
        elevation:3,
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