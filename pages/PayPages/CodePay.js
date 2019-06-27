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
    ImageBackground,
    BackHandler
} from 'react-native';
var {width,height} = Dimensions.get('window');
import px2dp from './../tools/px2dp';
import Header from "./../CommonModules/Header";
import {dataReset,feach_request,getStorage,Toast} from './../tools/Public';
import Loading from "../CommonModules/Loading";
export default class CodePay extends Component{
    static navigationOptions = {
        header: null
    };
    constructor(props){
        super(props);
        this.state = {
            title:'',
            code:'',
            loading:false,
            userInfo:'',
            way:''
        }
    }
    componentWillMount(){
        const way = this.props.navigation.state.params.way;
        const price = this.props.navigation.state.params.price;
        const info = this.props.navigation.state.params.info;
        this.setState({
            info:info,
            price:price
        })
        var source='';
        if(way=='wechat'){
            this.setState({
                title:'微信支付',
                way:'微信'
            })
           source='wechat';
        }else {
            this.setState({
                title:'支付宝支付',
                way:'支付宝'
            })
            source='alipay';
        }
        getStorage('userInfo')
            .then(data=>{
                this.setState({
                    userInfo:data
                })
                var data={
                    order_id:info.order_id,
                    channel:source,
                    amount:price,
                    pay_type:'order_pay',
                    order_source:data.name,
                    token:data.token
                };
                data = dataReset(data);
                feach_request('/pos_order_pay','POST',data,this.props.navigation)
                    .then((data)=>{
                        this.setState({
                            code:data.data.qr_img,
                            orderNum:data.data.order_pay_no
                        })
                    })
                    .catch((err)=>{
                        console.log(err);
                        Toast('出现未知错误，请稍后再试～');
                    })
            }).catch(err=>{
            console.log(err)
        })
        // token:this.state.userInfo.token

    }

    render(){
        const { navigate } = this.props.navigation;
        const price = this.props.navigation.state.params.price;
        return(
            <View style={{flex:1,backgroundColor: '#fcfcfc'}}>
                <Header title={this.state.title} navigate={this.props.navigation} jump={'Home'}/>
                <ScrollView style={styles.flex}>
                    <View style={{paddingHorizontal: px2dp(17)}}>
                        <View style={styles.content_wrap}>
                            <ImageBackground source={require("./../../images/code_bg.png")} style={{width: '100%',height: '100%'}}>
                                <View style={styles.flex_column}>
                                    <Text style={{fontSize:px2dp(14)}}>您本次支付金额</Text>
                                    <View style={{flexDirection:'row',marginBottom: px2dp(10)}}>
                                        <Text style={styles.price_num}>{price}</Text>
                                        <Text style={{fontSize:px2dp(14),lineHeight:px2dp(60)}}>元</Text>
                                    </View>
                                    <View style={{width:px2dp(250),height:px2dp(170),flexDirection:'row',justifyContent: 'center'}}>
                                        {/*<QRCode*/}
                                            {/*value={'https://github.com/forrest23/ReactNativeComponents'}*/}
                                            {/*size={200}*/}
                                        {/*/>*/}
                                        <Image
                                            style={{
                                                width: 150,
                                                height: 150,
                                                resizeMode: 'contain',
                                            }}
                                            source={{
                                                uri:
                                                    `data:image/png;base64,${this.state.code}`,
                                            }}
                                        />
                                    </View>
                                    <Text style={{fontSize:px2dp(12),marginTop: px2dp(20),color: '#7f7f7f'}}>请{this.state.way}扫码进行支付</Text>
                                    <TouchableWithoutFeedback onPress={()=>{this.lookResult()}}>
                                        <View style={styles.look_over_btn}>
                                            <Text style={styles.look_over_font}>查询结果</Text>
                                        </View>
                                    </TouchableWithoutFeedback>
                                </View>
                            </ImageBackground>
                        </View>
                        <TouchableWithoutFeedback onPress={()=>{navigate('Home')}}>
                            <View style={styles.bottom_btn}>
                                <Text style={styles.bottom_btn_font}>返回首页</Text>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                    <Loading loading={this.state.loading}/>
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
    lookResult(){
        this.setState({
            loading:true
        })
        // this.state.orderNum,
        var data={
            order_pay_no:this.state.orderNum,
            token:this.state.userInfo.token
        };
        data = dataReset(data);
        feach_request('/pos_inquire_pay','POST',data,this.props.navigation)
            .then((data)=>{
                if(data.status=='0'){
                    this.setState({
                        loading:false
                    })
                }
                if(data.data.pay_status=='fail'){
                    Toast('查询失败，请稍后再试～');
                }else if(data.data.pay_status=='success'){
                    this.props.navigation.navigate('SuccessPay',{info:data.data.details,price:this.state.price,source:'code'});
                }else {
                    Toast('暂无结果，请稍后再试～');
                }
            })
            .catch((err)=>{
                console.log(err);
                Toast('出现未知错误，请稍后再试～');
            })
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
        alignItems:'center',
        paddingTop: px2dp(67),
        paddingBottom: px2dp(50)
    },
    content_wrap:{
        width:px2dp(339),
        height:px2dp(500)
    },
    price_num:{
        fontSize:px2dp(35),
        color:'#64bdf9',
        letterSpacing: px2dp(2),
        marginRight: px2dp(5)
    },
    look_over_btn:{
        width:px2dp(108),
        height:px2dp(43),
        backgroundColor: '#64bdf9',
        borderRadius:px2dp(8),
        elevation:3,
        marginTop: px2dp(50)
    },
    look_over_font:{
        fontSize:px2dp(16),
        color:'#ffffff',
        textAlign: 'center',
        lineHeight: px2dp(43)
    },
    bottom_btn:{
        flex:1,
        height:px2dp(40),
        backgroundColor:'#ffffff',
        borderRadius:px2dp(8),
        elevation:3,
        marginBottom:px2dp(25),
        marginTop:px2dp(25)
    },
    bottom_btn_font:{
        textAlign: 'center',
        lineHeight:px2dp(40),
        fontSize:px2dp(16),
        color:'#64bdf9'
    },
    nanny_photo:{
        width:px2dp(200),
        height:px2dp(200)
    }
});