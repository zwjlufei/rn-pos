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
import Icon from "react-native-vector-icons/FontAwesome";
export default class FailPay extends Component{
    static navigationOptions = {
        header: null
    };
    constructor(props){
        super(props);
        this.state = {
            title:'支付完成'
        }
    }
    componentWillMount(){

    }
    goBack(){
        this.props.navigate.goBack();
    }
    render(){
        const { navigate } = this.props.navigation;
        const price=this.props.navigation.state.params.price;
        return(
            <View style={{flex:1,backgroundColor: '#ffffff'}}>
                <StatusBar backgroundColor={'#d14761'}/>
                <View style={styles.headerBox}>
                    <TouchableWithoutFeedback onPress={()=>{this.props.navigation.goBack()}}>
                        <View style={[styles.flex,styles.pl_17]}>
                            <Icon name="angle-left" size={30} color="#ffffff" />
                        </View>
                    </TouchableWithoutFeedback>
                    <View style={{flex:2,flexDirection:'row',justifyContent: 'center'}}>
                        <Text style={styles.title_style}>{this.state.title}</Text>
                    </View>
                    <View style={styles.flex}></View>
                </View>
                <ScrollView style={styles.flex}>
                    <View style={[styles.flex_column,styles.content_wrap]}>
                        <Text style={{fontSize:px2dp(15),color:'#d7ecfc',marginBottom:px2dp(10)}}>
                            您本次支付
                            <Text style={{color:'#ffffff',fontWeight: '600',letterSpacing:px2dp(2)}}>失败</Text>
                        </Text>
                        <View style={{flexDirection:'row',marginBottom: px2dp(10)}}>
                            <Text style={styles.price_num}>{price}</Text>
                            <Text style={{fontSize:px2dp(15),lineHeight:px2dp(60),color:'#d7ecfc'}}>元</Text>
                        </View>
                        <Image
                            source={require('./../../images/fail_pay.png')}
                            style={styles.success_img}
                        />
                        <TouchableWithoutFeedback onPress={()=>{navigate('PayWays')}}>
                            <View style={styles.print_btn}>
                                <Text style={styles.print_btn_font}>重新支付</Text>
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
        backgroundColor:'#e94f6c',
        paddingTop: px2dp(30)
    },
    price_num:{
        fontSize:px2dp(35),
        color:'#ffffff',
        letterSpacing: px2dp(2),
        marginRight: px2dp(5)
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
        height:px2dp(190)
    },
    print_btn:{
        width:px2dp(148),
        height:px2dp(43),
        borderWidth: px2dp(1),
        borderColor:'#ffffff',
        borderRadius: px2dp(10),
        marginTop: px2dp(25),
        backgroundColor:'#ec6982'
    },
    print_btn_font:{
        fontSize:px2dp(16),
        color:'#fff',
        textAlign: 'center',
        lineHeight:px2dp(40),
        letterSpacing: px2dp(2),
        fontWeight: '600'
    },
    headerBox:{
        width:width,
        height:px2dp(50),
        backgroundColor:'#e94f6c',
        flexDirection:'row',
        justifyContent: 'space-between',
        alignItems:'center',
        paddingLeft: px2dp(17),
        paddingRight: px2dp(17)
    },
    title_style:{
        fontSize:px2dp(19),
        color:'#ffffff',
        fontWeight: '600',
        letterSpacing: px2dp(2)
    },
    pl_17:{
        paddingLeft: px2dp(17)
    }
});