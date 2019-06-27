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
    ImageBackground, BackHandler
} from 'react-native';
var {width,height} = Dimensions.get('window');
import px2dp from './../tools/px2dp';
import Header from "./../CommonModules/Header";
import constant from "../tools/constant";
import WangPos from "../../youmayouzi";
import {dataReset, feach_request, getStorage, timeTransform, Toast} from "../tools/Public";
import NoDoublePrint from "../tools/NoDoublePrint";
import Loading from "../CommonModules/Loading";
export default class SuccessPay extends Component{
    static navigationOptions = {
        header: null
    };
    constructor(props){
        super(props);
        this.state = {
            title:'支付完成',
            info:{},
            userInfo:'',
            loading:false
        }
    }
    componentWillMount(){
        var info=this.props.navigation.state.params.info;
        const price=this.props.navigation.state.params.price;
        const payId=this.props.navigation.state.params.id;
        getStorage('userInfo')
            .then(data=>{
                this.setState({
                    userInfo:data
                })
            }).catch(err=>{
            console.log(err)
        })
        this.setState({
            info:info,
            payId:payId,
            price:price
        })
    }
    //调起打印机
    goPrint(info,url){
        const product = info.order_type=='sw'?info.product:'--';
        const waiter=info.order_type=='sw'?'--':info.waiter_name;
        const bed = info.bed_no?info.bed_no:'--';
        const title = url?'扫描查询电子合同':'';
        const times=(info.order_type=='sw'||info.order_type=='dl')?'--':(info.days+(info.order_type=='cr'?'次':'天'));
        const data = `{pay_no:${info.pay_id}, url:'${url}',title:'${title}',product:'${product}', amount:${info.amount}, pay_type:${constant[info.channel]},bed_no:${bed},customer_phone:${info.customer_phone}, pay_price:"${info.actual_amount}元", contract_no:${info.order_no}, client_name:${info.customer_name}, server_type:${constant[info.order_type]}, server_time:${times}, server_name:${waiter},hospital_name:${info.order_source}, en_no:${this.state.userInfo.en}, operator:${info.order_source}, all_pay:${info.actual_amount}, pay_time:'${info.pay_time}'}`;
        WangPos.print(data, (location)=> {
            this.setState({
                location: location,
                loading:false
            })

        });
    }
    getCode(info){
        if(info.order_type=='ys'){
            fetch(`http://weixin.youmayouzi.com/module/2/2ed643/custom/get_contact_qrcode/${info.customer_id}`,{
                method : 'GET',
            }).then(response=> response.json())
                .then(responseData=>{
                    this.goPrint(info,responseData.data)
                })
                .catch(error=>{
                    console.log(error)
                })
            setTimeout(()=>{
                console.log('网络错误～')
            },10000)
        }else {
            this.goPrint(info,'')
        }
    }
    //打印小票
    printInfo(){
        this.setState({
            loading:true
        });
        const source=this.props.navigation.state.params.source;
        if(source!=='pos'){
            this.getCode(this.state.info);
        }else {
            const id=this.props.navigation.state.params.id;
            var data={
                order_pay_no:id,
                token:this.state.userInfo.token
            };
            data = dataReset(data);
            feach_request('/pos_inquire_pay','POST',data,this.props.navigation)
                .then((data)=>{
                    if(data.data.pay_status=='fail'){
                        Toast('打印失败，请稍后再试～');
                    }else if(data.data.pay_status=='success'){
                        // this.goPrint(this.state.info)
                        this.getCode(data.data.details);
                    }
                })
                .catch((err)=>{
                    console.log(err);
                    Toast('出现未知错误，请稍后再试～');
                })
        }
    }
    render(){
        const { navigate } = this.props.navigation;
        return(
            <View style={{flex:1,backgroundColor: '#ffffff'}}>
                <Header title={this.state.title} navigate={this.props.navigation} jump={'Home'}/>
                <Loading loading={this.state.loading}/>
                <ScrollView style={styles.flex}>
                    <View style={[styles.flex_column,styles.content_wrap]}>
                        <Text style={{fontSize:px2dp(15),color:'#d7ecfc',marginBottom:px2dp(10)}}>
                            您本次支付
                            <Text style={{color:'#ffffff',fontWeight: '600',letterSpacing:px2dp(2)}}>成功</Text>
                        </Text>
                        <View style={{flexDirection:'row',marginBottom: px2dp(10)}}>
                            <Text style={styles.price_num}>{this.state.price}</Text>
                            <Text style={{fontSize:px2dp(15),lineHeight:px2dp(60),color:'#d7ecfc'}}>元</Text>
                        </View>
                        <Image
                            source={require('./../../images/success_pay.png')}
                            style={styles.success_img}
                        />
                        <TouchableWithoutFeedback onPress={()=>{NoDoublePrint.onPress(()=>{this.printInfo()})}}>
                            <View style={styles.print_btn}>
                                <Text style={styles.print_btn_font}>打印小票</Text>
                            </View>
                        </TouchableWithoutFeedback>
                        <Image
                            source={require('./../../images/pay_result_bottom.png')}
                            style={styles.result_bottom}
                        />
                    </View>
                    <View style={{paddingHorizontal:px2dp(17)}}>
                        <TouchableWithoutFeedback onPress={()=>{navigate('Home')}}>
                            <View style={styles.bottom_btn}>
                                <Text style={styles.bottom_btn_font}>返回首页</Text>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </ScrollView>
            </View>
        )
    }
    componentDidMount() {
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            this.props.navigation.navigate('Home'); // works best when the goBack is async
            return true;
        });
    }
    componentWillUnmount() {
        this.backHandler.remove();
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
    flex_column:{
        flexDirection:'column',
        alignItems:'center'
    },
    content_wrap:{
        flex:1,
        height:px2dp(460),
        backgroundColor:'#64bdf9',
        paddingTop: px2dp(30)
    },
    price_num:{
        fontSize:px2dp(35),
        color:'#ffffff',
        letterSpacing: px2dp(2),
        marginRight: px2dp(5),
        fontWeight: '600'
    },
    bottom_btn:{
        flex:1,
        height:px2dp(40),
        backgroundColor:'#ffffff',
        borderRadius:px2dp(8),
        elevation:3,
        marginBottom:px2dp(25),
        marginTop:px2dp(38)
    },
    bottom_btn_font:{
        textAlign: 'center',
        lineHeight:px2dp(40),
        fontSize:px2dp(16),
        color:'#64bdf9'
    },
    result_bottom:{
        width:width,
        height:px2dp(60),
        position: 'absolute',
        left:0,
        bottom:-px2dp(10)
    },
    success_img:{
        width:px2dp(205),
        height:px2dp(189)
    },
    print_btn:{
        width:px2dp(148),
        height:px2dp(43),
        borderWidth: px2dp(1),
        borderColor:'#ffffff',
        borderRadius: px2dp(10),
        marginTop: px2dp(25),
        backgroundColor:'#7bc7fa'
    },
    print_btn_font:{
        fontSize:px2dp(16),
        color:'#fff',
        textAlign: 'center',
        lineHeight:px2dp(40),
        letterSpacing: px2dp(2),
        fontWeight: '600'
    }

});