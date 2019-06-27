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
import WangPos from './../../youmayouzi';
import {dataReset, feach_request, getStorage, Toast} from "../tools/Public";
import NoDoublePress from "../tools/NoDoublePress";
export default class PayWays extends Component{
    static navigationOptions = {
        header: null
    };
    constructor(props){
        super(props);
        this.state = {
            payInfo:'',
            price:'',
            info:''
        }
    }
    componentWillMount(){
        const info = this.props.navigation.state.params.info;
        const price = this.props.navigation.state.params.price;
        this.setState({
            price:price.toString(),
            info:info
        })
        getStorage('userInfo')
            .then(data=>{
                this.setState({
                    userInfo:data
                })
            }).catch(err=>{
            console.log(err)
        })
    }
    //pos机支付
    posPay(){
        var data={
            order_id:this.state.info.order_id,
            channel:'wangpos_pos',
            amount:this.state.price,
            pay_type:'order_pay',
            order_source:this.state.userInfo.name,
            token:this.state.userInfo.token
        };
        data = dataReset(data);
        console.log(data)
        if(this.checkPrice()){
            feach_request('/pos_order_pay','POST',data,this.props.navigation)
                .then((data)=>{
                    console.log(data)
                    if (data.status=='0'){
                        WangPos.consume(data.data.order_pay_no, `家嘉母婴医院端/${this.state.userInfo.name}`, parseInt(this.state.price*100).toString(), "[{'goods_id':'iphone7s_128G','goods_name':'iphone7s 128G','quantity':10,'price':100}]",(result)=> {
                            result=JSON.parse(result.substring(5));
                            const dataArr=dataReset(result.data);
                            if(result.errCode==0){
                                feach_request('/pos_odoo_2_ebank','POST',dataArr)
                                    .then((data)=>{
                                        console.log('result',data)
                                    })
                                    .catch((err)=>{
                                        console.log(err);
                                    })
                                this.props.navigation.navigate('SuccessPay',{price:this.state.price,source:'pos',info:this.state.info,id:data.data.order_pay_no});
                            }else {
                                this.props.navigation.navigate('FailPay',{price:this.state.price});
                            }
                        });
                    }
                })
                .catch((err)=>{
                    console.log(err);
                    Toast('网络错误，请稍后再试～');
                })
        }
    }
    //金额为零
    checkPrice(){
        if(this.state.price=='0'){
            Toast('付款金额不能为0！');
            return false;
        }
        return true;
    }
    render(){
        const { navigate } = this.props.navigation;
        return(
            <View style={{flex:1,backgroundColor: '#fcfcfc'}}>
                <Header title={'支付页'} navigate={this.props.navigation} jump={'Home'}/>
                <ScrollView style={styles.flex}>
                    <View style={[styles.flex_space_between,styles.padding_gap]}>
                        <Text style={{fontSize:px2dp(14)}}>确认您本次订单金额</Text>
                        <View style={styles.money_wrap}>
                            <TextInput keyboardType='numeric' style={{fontSize:px2dp(25),color: '#64bdf9',borderBottomWidth: 1,borderBottomColor:'#666'}} defaultValue={this.state.price} onChangeText={(text)=>{this.setState({price:text})}}/>
                            <Text  style={{fontSize:px2dp(15),color: '#64bdf9'}}>元</Text>
                            {/*<Image*/}
                                {/*source={require('./../../images/edit.png')}*/}
                                {/*style={{width:px2dp(15),height:px2dp(15),marginLeft: px2dp(10)}}*/}
                            {/*/>*/}
                        </View>
                    </View>
                    <View style={[styles.flex_row,styles.margin_gap]}>
                        <View style={styles.title_symbol}></View>
                        <Text style={{fontSize:px2dp(13),color:'#000'}}>扫码支付</Text>
                    </View>
                    <View style={{paddingHorizontal:px2dp(10),marginBottom:px2dp(10)}}>
                        <TouchableWithoutFeedback onPress={()=>{
                            if (this.checkPrice()){
                                navigate('CodePay',{way:'wechat',price:this.state.price,info:this.state.info});
                            }

                        }}>
                            <View>
                                <ImageBackground source={require("./../../images/pay_bg.png")} style={[styles.pay_item,styles.flex_space_between]}>
                                    <View style={{width:px2dp(130),flexDirection:'row',justifyContent: 'space-between', alignItems:'center'}}>
                                        <Image
                                            source={require('./../../images/wechat.png')}
                                            style={{width:px2dp(34),height:px2dp(34)}}
                                        />
                                        <Text style={{fontSize:px2dp(16),color:'#4c4c4c',fontWeight: '600'}}>微信扫码</Text>
                                    </View>
                                    <Text style={{fontSize:px2dp(20),color:'#d9d9d9',lineHeight:px2dp(15)}}>...</Text>
                                </ImageBackground>
                            </View>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={()=>{
                            if (this.checkPrice()){
                                navigate('CodePay',{way:'zhifubao',price:this.state.price,info:this.state.info});
                            }
                        }}>
                            <View>
                                <ImageBackground source={require("./../../images/pay_bg.png")} style={[styles.pay_item,styles.flex_space_between]}>
                                    <View style={{width:px2dp(145),flexDirection:'row',justifyContent: 'space-between', alignItems:'center'}}>
                                        <Image
                                            source={require('./../../images/zhifubao.png')}
                                            style={{width:px2dp(34),height:px2dp(34)}}
                                        />
                                        <Text style={{fontSize:px2dp(16),color:'#4c4c4c',fontWeight: '600'}}>支付宝扫码</Text>
                                    </View>
                                    <Text style={{fontSize:px2dp(20),color:'#d9d9d9',lineHeight:px2dp(15)}}>...</Text>
                                </ImageBackground>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                    <View style={[styles.flex_row,styles.margin_gap]}>
                        <View style={[styles.title_symbol,styles.green_color]}></View>
                        <Text style={{fontSize:px2dp(13),color:'#000'}}>其它支付</Text>
                    </View>
                    <View style={{paddingHorizontal:px2dp(10)}}>

                        <TouchableWithoutFeedback onPress={()=>{this.posPay()}}>
                            <View>
                                <ImageBackground source={require("./../../images/pay_bg.png")} style={[styles.pay_item,styles.flex_space_between]}>
                                    <View style={{width:px2dp(140),flexDirection:'row',justifyContent: 'space-between', alignItems:'center'}}>
                                        <Image
                                            source={require('./../../images/pos.png')}
                                            style={{width:px2dp(34),height:px2dp(34)}}
                                        />
                                        <Text style={{fontSize:px2dp(16),color:'#4c4c4c',fontWeight: '600'}}>pos机刷卡</Text>
                                    </View>
                                    <Text style={{fontSize:px2dp(20),color:'#d9d9d9',lineHeight:px2dp(15)}}>...</Text>
                                </ImageBackground>
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
    flex_row:{
        flexDirection:'row',
        alignItems:'center'
    },
    money_wrap:{
        flexDirection:'row',
        alignItems: 'center'
    },
    padding_gap:{
        paddingHorizontal: px2dp(17),
        height:px2dp(79)
    },
    title_symbol:{
        width:px2dp(2),
        height:px2dp(12),
        borderRadius:px2dp(2),
        backgroundColor: '#64bdf9',
        marginRight: px2dp(10)
    },
    pay_item:{
        width: '100%',
        height: px2dp(75),
        marginBottom: px2dp(10),
        paddingHorizontal:px2dp(20),
    },
    margin_gap:{
        marginBottom: px2dp(20),
        paddingHorizontal: px2dp(17)
    },
    green_color:{
        backgroundColor:'#5de220'
    }
});