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
    ScrollView,
    ImageBackground, ToastAndroid
} from 'react-native';
var {width,height} = Dimensions.get('window');
import px2dp from './../tools/px2dp';
import Header from "./../CommonModules/Header";
import WangPos from './../../youmayouzi';
import constant from './../tools/constant';
import {dataReset, feach_request, getStorage, timeTransform, Toast} from "../tools/Public";
import Loading from './../CommonModules/Loading';
import NoDoublePrint from './../tools/NoDoublePrint';
import NoDoublePress from "../tools/NoDoublePress";
export default class PayDetail extends Component{
    static navigationOptions = {
        header: null
    };
    constructor(props){
        super(props);
        this.state = {
            info:{},
            loading:true
        }
    }
    componentWillMount(){
        getStorage('userInfo')
            .then(data=>{
                this.setState({
                    userInfo:data
                })
                this.initData(data)
            }).catch(err=>{
            console.log(err)
        })
    }
    //请求数据
    initData(userInfo){
        const info = this.props.navigation.state.params.info;
        var data={
            company_flow_id:info.id,
            token:userInfo.token
        };
        // token:this.state.userInfo.token
        data = dataReset(data);
        feach_request('/pos_flow_detail','POST',data,this.props.navigation)
            .then((data)=>{
                console.log(data)
                if(data.status==0){
                    this.setState({
                        loading:false
                    })
                    this.setState({
                        info:data.data.details
                    })
                }
            })
            .catch((err)=>{
                console.log(err);
                Toast('网络错误，请稍后再试～');
            })

    }
    //调打印机
    goPrint(url){
        const product = this.state.info.order_type=='sw'?this.state.info.product:'--';
        const waiter=this.state.info.order_type=='sw'?'--':this.state.info.waiter_name;
        const bed = this.state.info.bed_no?this.state.info.bed_no:'--';
        const title = url?'扫描查询电子合同':'';
        const times=(this.state.info.order_type=='sw'||this.state.info.order_type=='dl')?'--':(this.state.info.days+(this.state.info.order_type=='cr'?'次':'天'));
        const data = `{pay_no:${this.state.info.pay_id}, url:'${url}',title:'${title}',product:'${product}', amount:${this.state.info.amount}, pay_type:${constant[this.state.info.channel]},bed_no:${bed},customer_phone:${this.state.info.customer_phone}, pay_price:"${this.state.info.actual_amount}元", contract_no:${this.state.info.order_no}, client_name:${this.state.info.customer_name}, server_type:${constant[this.state.info.order_type]}, server_time:${times}, server_name:${waiter},hospital_name:${this.state.info.order_source}, en_no:${this.state.userInfo.en}, operator:${this.state.info.order_source}, all_pay:${this.state.info.actual_amount}, pay_time:'${this.state.info.pay_time}'}`;
          WangPos.print(data, (location)=> {
            this.setState({
                location: location,
                loading:false
            })
        });
    }
    //打印小票
    printInfo(){
        this.setState({
            loading:true
        })
        if(this.state.info.order_type=='ys'){
            fetch(`http://weixin.youmayouzi.com/module/2/2ed643/custom/get_contact_qrcode/${this.state.info.customer_id}`,{
                method : 'GET',
            }).then(response=> response.json())
                .then(responseData=>{
                    console.log('responseData',responseData)
                    if(responseData.code==0){
                        this.goPrint(responseData.data)
                    }
                })
                .catch(error=>{
                    console.log(error)
                })
            setTimeout(()=>{
                console.log('网络错误～')
            },10000)
        }else {
            this.goPrint('')
        }

    }
    render(){
        const { navigate } = this.props.navigation;
        return(
            <View style={{flex:1,backgroundColor: '#ffffff'}}>
                <Header title={'订单详情'} navigate={this.props.navigation}/>
                <View style={styles.container_wrap}>
                    <Loading loading={this.state.loading}/>
                    <View>
                        <View style={styles.container}>
                            <View style={styles.money_wrap}>
                                <Image
                                    source={require('./../../images/money_symbol.png')}
                                    style={{width:px2dp(30),height:px2dp(30),marginBottom: px2dp(5)}}
                                />
                                <Text style={{fontSize:px2dp(40),color: '#64bdf9'}}>{this.state.info.actual_amount}</Text>
                            </View>
                            <Text style={{fontSize:px2dp(16),color:'#8acbfa'}}>支付成功</Text>
                        </View>
                        <View style={{paddingHorizontal: px2dp(17)}}>
                            <View style={styles.flex_space_between}>
                                <Text style={[styles.flex,styles.item_font]}>订单流水号:</Text>
                                <Text style={[styles.flex,styles.item_num]}>{this.state.info.pay_id}</Text>
                            </View>
                        </View>
                        <View style={{paddingHorizontal: px2dp(17)}}>
                            <View style={styles.flex_space_between}>
                                <Text style={[styles.flex,styles.item_font]}>订单号:</Text>
                                <Text style={[styles.flex,styles.item_num]}>{this.state.info.order_no}</Text>
                            </View>
                        </View>
                        <View style={{paddingHorizontal: px2dp(17)}}>
                            <View style={styles.flex_space_between}>
                                <Text style={[styles.flex,styles.item_font]}>订单类型:</Text>
                                <Text style={[styles.flex,styles.item_font]}>{constant[this.state.info.order_type]}</Text>
                            </View>
                        </View>
                        <View style={{paddingHorizontal: px2dp(17)}}>
                            <View style={styles.flex_space_between}>
                                <Text style={[styles.flex,styles.item_font]}>支付方式:</Text>
                                <Text style={[styles.flex,styles.item_font]}>{constant[this.state.info.channel]}支付</Text>
                            </View>
                        </View>
                        <View style={{paddingHorizontal: px2dp(17)}}>
                            <View style={styles.flex_space_between}>
                                <Text style={[styles.flex,styles.item_font]}>支付时间:</Text>
                                <Text style={[styles.flex,styles.item_num]}>{this.state.info.pay_time}</Text>
                            </View>
                        </View>
                        <View style={{paddingHorizontal: px2dp(17)}}>
                            <View style={styles.flex_space_between}>
                                <Text style={[styles.flex,styles.item_font]}>客户姓名:</Text>
                                <Text style={[styles.flex,styles.item_font]}>{this.state.info.customer_name}</Text>
                            </View>
                        </View>
                        <View style={{paddingHorizontal: px2dp(17)}}>
                            <View style={styles.flex_space_between}>
                                <Text style={[styles.flex,styles.item_font]}>客户手机号:</Text>
                                <Text style={[styles.flex,styles.item_num]}>{this.state.info.customer_phone}</Text>
                            </View>
                        </View>
                    </View>

                    <View style={{paddingHorizontal:px2dp(17)}}>
                        <TouchableWithoutFeedback onPress={()=>{NoDoublePrint.onPress(()=>{this.printInfo()})}}>
                            <View style={styles.bottom_btn}>
                                <Text style={styles.bottom_btn_font}>补打小票</Text>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </View>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    flex:{
        flex:1,
    },
    flex_space_between:{
        flexDirection:'row',
        justifyContent: 'space-between',
        alignItems:'center'
    },
    container:{
        paddingTop: px2dp(55),
        flexDirection:'column',
        alignItems:'center',
        marginBottom: px2dp(45)
    },
    money_wrap:{
        flexDirection: 'row',
        alignItems: 'flex-end',
        marginRight: px2dp(31)
    },
    item_font:{
        fontSize:px2dp(14),
        paddingLeft: px2dp(16),
        lineHeight:px2dp(35)
    },
    item_num:{
        fontSize:px2dp(15),
        paddingLeft: px2dp(16),
        lineHeight:px2dp(35)
    },
    bottom_btn:{
        height:px2dp(46),
        backgroundColor:'#ffffff',
        borderRadius:px2dp(8),
        elevation:3,
        marginBottom:px2dp(25)
    },
    bottom_btn_font:{
        textAlign: 'center',
        lineHeight:px2dp(40),
        fontSize:px2dp(16),
        color:'#64bdf9'
    },
    container_wrap:{
        flex:1,
        flexDirection:'column',
        justifyContent: 'space-between'
    }
});