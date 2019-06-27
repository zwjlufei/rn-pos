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
    ScrollView
} from 'react-native';
var {width,height} = Dimensions.get('window');
import px2dp from './../tools/px2dp';
import Header from "./../CommonModules/Header";
import {getStorage, Toast} from "../tools/Public";
export default class CarePay extends Component{
    static navigationOptions = {
        header: null
    };
    constructor(props){
        super(props);
        this.state = {
            dateShow:false,
            startTime:'',
            serverDay:3,
            info:'',
            userInfo:''
        }
    }
    componentWillMount(){
        const info = this.props.navigation.state.params.info;
        this.setState({
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
    render(){
        const { navigate } = this.props.navigation;
        return(
            <View style={{flex:1,backgroundColor: '#fcfcfc'}}>
                <Header title={'支付陪护单'} navigate={this.props.navigation}/>
                <ScrollView style={styles.flex}>
                    <View style={[styles.flex_space_between,styles.item_style]}>
                        <Text style={styles.item_title}>订单类型:</Text>
                        <Text style={styles.item_content}>陪护单</Text>
                    </View>
                    <View style={[styles.flex_space_between,styles.item_style]}>
                        <Text style={styles.item_title}>开始时间:</Text>
                        <Text style={styles.item_content}>{this.state.info.start_datetime}</Text>
                    </View>
                    <View style={[styles.flex_space_between,styles.item_style]}>
                        <Text style={styles.item_title}>结束时间:</Text>
                        <Text style={styles.item_content}>{this.state.info.end_datetime}</Text>
                    </View>
                    <View style={[styles.flex_space_between,styles.item_style]}>
                        <Text style={styles.item_title}>服务时长:</Text>
                        <Text style={[styles.item_content,styles.blue_color]}>{this.state.info.ph_days}天</Text>
                    </View>
                    <View style={[styles.flex_space_between,styles.item_style]}>
                        <Text style={styles.item_title}>客户姓名:</Text>
                        <Text style={styles.item_content}>{this.state.info.customer_name}({this.state.info.customer_phone})</Text>
                    </View>
                    <View style={[styles.flex_space_between,styles.padding_gap]}>
                        <Text style={{fontSize:px2dp(14)}}>您本次订单金额</Text>
                        <View style={styles.money_wrap}>
                            <Image
                                source={require('./../../images/money_symbol.png')}
                                style={{width:px2dp(30),height:px2dp(30)}}
                            />
                            <Text style={{fontSize:px2dp(25),color: '#64bdf9'}}>{this.state.info.amount}</Text>
                        </View>
                    </View>
                    <View style={{flexDirection:'row',justifyContent: 'center',alignItems:'center',marginTop: px2dp(30)}}>
                        <View style={styles.warn_symbol_wrap}>
                            <Text style={styles.warn_symbol}>!</Text>
                        </View>
                        <Text style={{fontSize:px2dp(12),color:'#b0b0b0'}}>请与客户确认订单再进行支付</Text>
                    </View>

                </ScrollView>
                <TouchableWithoutFeedback onPress={()=>{navigate('PayWays',{info:this.state.info,price:this.state.info.amount})}}>
                    <View style={styles.editor_btn}>
                        <Text style={styles.editor_btn_font}>立即支付</Text>
                    </View>
                </TouchableWithoutFeedback>
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
        fontSize:px2dp(14)
    },
    item_content:{
        flex:2,
        fontSize:px2dp(14),
        color:'#000'
    },
    item_style:{
        paddingHorizontal: px2dp(17),
        height:px2dp(53),
        borderBottomWidth: px2dp(1),
        borderBottomColor:'#efefef'
    },
    blue_color:{
        color:'#64bdf9'
    },
    money_wrap:{
        flexDirection:'row',
        alignItems: 'center'
    },
    padding_gap:{
        paddingHorizontal: px2dp(17),
        height:px2dp(79)
    },
    warn_symbol_wrap:{
        width:px2dp(15),
        height:px2dp(15),
        borderRadius:px2dp(15),
        backgroundColor: '#b0b0b0',
        marginRight: px2dp(10)
    },
    warn_symbol:{
        fontSize:px2dp(12),
        color:'#ffffff',
        textAlign: 'center',
        lineHeight:px2dp(15)
    },
    editor_btn:{
        height:px2dp(45),
        elevation:3,
        backgroundColor:'#ffffff',
        borderRadius: px2dp(10),
        marginHorizontal: px2dp(17),
        marginTop: px2dp(85),
        marginBottom: px2dp(25)
    },
    editor_btn_font:{
        fontSize:px2dp(16),
        color:'#64bdf9',
        textAlign: 'center',
        lineHeight: px2dp(45)
    },
    bottom_btn:{
        width:px2dp(158),
        height:px2dp(43),
        elevation:3,
        backgroundColor:'#ffffff',
        borderRadius:5,
        marginTop:px2dp(15),
        marginBottom:px2dp(25)
    },
    bottom_btn_font:{
        fontSize:px2dp(16),
        color:'#64bdf9',
        textAlign: 'center',
        lineHeight:px2dp(43)
    },
    bottom_btn_on:{
        backgroundColor:'#64bdf9'
    },
    bottom_font_on:{
        color:'#ffffff'
    },
    input_style:{
        backgroundColor:'#ffffff',
        height:px2dp(40),
        borderRadius:5,
        elevation:3,
        paddingLeft: px2dp(10),
        flex:2
    },
    right_arrow:{
        position: 'absolute',
        right:px2dp(17),
        top:px2dp(8)
    },
    input_font:{
        fontSize:px2dp(15)
    },
    no_border:{
        borderBottomWidth: 0,
        borderBottomColor:'#fff'
    }
});