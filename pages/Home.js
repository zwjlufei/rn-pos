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
    BackHandler, AsyncStorage
} from 'react-native';
var {width,height} = Dimensions.get('window');
import px2dp from './tools/px2dp';
import Header from "./CommonModules/Header";
import {getStorage} from "./tools/Public";
import {Toast} from './tools/Public';
export default class Home extends Component{
    static navigationOptions = {
        header: null
    };
    constructor(props){
        super(props);
        this.state = {
            hospital:''
        }
    }
    componentWillMount(){
        getStorage('userInfo')
            .then(data=>{
                this.setState({
                    hospital:data.name
                })
            }).catch(err=>{
            console.log(err)
        })
        const key=this.props.navigation.state.key;
        // AsyncStorage.setItem('homeKey',JSON.stringify(key));
    }
    render(){
        const { navigate } = this.props.navigation;
        return(
            <View style={{flex:1,backgroundColor: '#fcfcfc'}}>
                <Header title={'医院终端'} navigate={this.props.navigation} left={true} login={true}/>
                <ScrollView>
                    <View style={{paddingHorizontal: px2dp(12),paddingTop: px2dp(25)}}>
                        <TouchableWithoutFeedback onPress={()=>{navigate('CreateOrder',{native:'normal',id:''})}}>
                            <View style={styles.create_order_wrap}>
                                <Image
                                    source={require('./../images/create_order.png')}
                                    style={{width:px2dp(70),height:px2dp(70)}}
                                />
                                <View>
                                    <Text style={{fontSize:px2dp(18),color:'#fff',marginBottom: px2dp(5)}}>我要出单</Text>
                                    <Text  style={{fontSize:px2dp(12),color:'#b1c7ee'}}>陪护单、母指单、导乐师、月嫂单</Text>
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                        <View style={[styles.flex_space_between,styles.flex_wrap]}>
                            <TouchableWithoutFeedback onPress={()=>{navigate('OrderList',{name:''})}}>
                                <View style={styles.sub_item_wrap}>
                                    <Image
                                        source={require('./../images/my_order.png')}
                                        style={{width:px2dp(42),height:px2dp(52)}}
                                    />
                                    <Text style={styles.item_font}>我的订单</Text>
                                </View>
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback onPress={()=>{navigate('MyCustomers')}}>
                                <View style={[styles.sub_item_wrap,styles.sub_bg_one]}>
                                    <Image
                                        source={require('./../images/customer.png')}
                                        style={{width:px2dp(50),height:px2dp(50)}}
                                    />
                                    <Text style={styles.item_font}>我的客户</Text>
                                </View>
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback onPress={()=>{navigate('PayList')}}>
                                <View style={[styles.sub_item_wrap,styles.sub_bg_two]}>
                                    <Image
                                        source={require('./../images/pay.png')}
                                        style={{width:px2dp(55),height:px2dp(45)}}
                                    />
                                    <Text style={styles.item_font}>支付记录</Text>
                                </View>
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback onPress={()=>{navigate('NannyList')}}>
                                <View style={[styles.sub_item_wrap,styles.sub_bg_three]}>
                                    <Image
                                        source={require('./../images/staff.png')}
                                        style={{width:px2dp(39),height:px2dp(44)}}
                                    />
                                    <Text style={styles.item_font}>人员管理</Text>
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                    </View>
                </ScrollView>
                <View style={{marginBottom:px2dp(10)}}>
                    <Text style={styles.bottom_font}>{this.state.hospital}</Text>
                    <Text style={styles.bottom_font}>家嘉母婴</Text>
                </View>
            </View>

        )
    }
    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress',
            this.onBackButtonPressAndroid);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress',
            this.onBackButtonPressAndroid);
    }
    onBackButtonPressAndroid = () => {
        if (this.props.navigation.isFocused()) {
            if (this.lastBackPressed && this.lastBackPressed + 2000 >= Date.now()) {
                //最近2秒内按过back键，可以退出应用。
                this.props.navigation.goBack();
                return false;
            }
            this.lastBackPressed = Date.now();
            Toast('再按一次退出应用');
            return true;
        }
    }
}
const styles = StyleSheet.create({
    flex:{
        flex:1
    },
    flex_space_between:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems:'center'
    },
    create_order_wrap:{
        height:px2dp(185),
        backgroundColor: '#4183dc',
        borderRadius:px2dp(5),
        elevation:3,
        marginBottom:px2dp(12),
        flexDirection: 'row',
        paddingHorizontal: px2dp(35),
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    sub_item_wrap:{
        width:px2dp(170),
        height:px2dp(122),
        backgroundColor:'#4ca0dc',
        borderRadius: px2dp(5),
        marginTop: px2dp(12),
        elevation:3,
        flexDirection:'column',
        alignItems:'center',
        paddingTop: px2dp(20)
    },
    flex_wrap:{
        flexWrap: 'wrap'
    },
    sub_bg_one:{
        backgroundColor:'#5ec5f5'
    },
    sub_bg_two:{
        backgroundColor:'#6ce0de'
    },
    sub_bg_three:{
        backgroundColor:'#6fe7ce'
    },
    item_font:{
        fontSize:px2dp(14),
        color:'#ffffff',
        marginTop: px2dp(10),
        fontWeight: '600',
        letterSpacing: px2dp(2)
    },
    bottom_font:{
        textAlign:'center',
        lineHeight:px2dp(19),
        fontSize:px2dp(12),
        color:'#a1a1a1'
    }
});