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
import constant from "../tools/constant";
export default class NannyPay extends Component{
    static navigationOptions = {
        header: null
    };
    constructor(props){
        super(props);
        this.state = {
            hasPay:false //是否交过款
        }
    }

    render(){
        const { navigate } = this.props.navigation;
        const info = this.props.navigation.state.params.info;
        return(

            <View style={{flex:1,backgroundColor: '#fcfcfc'}}>
                <Header title={'支付月嫂单'} navigate={this.props.navigation}/>
                <ScrollView>
                    <View style={[styles.flex_space_between,styles.item_style]}>
                        <Text style={styles.item_title}>订单详情:</Text>
                        <Text style={styles.item_content}>月嫂单</Text>
                    </View>
                    <View style={[styles.flex_space_between,styles.item_style]}>
                        <Text style={styles.item_title}>上户时间:</Text>
                        <Text style={styles.item_content}>{info.start_datetime?info.start_datetime:info.start_date}</Text>
                    </View>
                    <View style={[styles.flex_space_between,styles.item_style]}>
                        <Text style={styles.item_title}>服务时长:</Text>
                        <Text style={[styles.item_content,styles.blue_color]}>{info.days}天</Text>
                    </View>
                    <View style={[styles.flex_space_between,styles.item_style]}>
                        <Text style={styles.item_title}>客户姓名:</Text>
                        <Text style={styles.item_content}>{info.customer_name}({info.customer_phone})</Text>
                    </View>
                    <View style={[styles.flex_space_between,styles.item_style]}>
                        <Text style={styles.item_title}>服务员工:</Text>
                        <Text style={styles.item_content}>{info.waiter_name}({info.waiter_phone_number})</Text>
                    </View>
                    <View style={[styles.flex_space_between,styles.item_style]}>
                        <Text style={styles.item_title}>特殊类型:</Text>
                        <Text style={styles.item_content}>{constant[info.special_type]}</Text>
                    </View>
                    <View style={[styles.flex_space_between,styles.item_style]}>
                        <Text style={styles.item_title}>服务地点:</Text>
                        <Text style={styles.item_content}>{info.customer_address}</Text>
                    </View>
                    <View style={[styles.flex_space_between,styles.padding_gap]}>
                        <Text style={{fontSize:px2dp(14)}}>您本次订单金额</Text>
                        <View style={styles.money_wrap}>
                            <Image
                                source={require('./../../images/money_symbol.png')}
                                style={{width:px2dp(30),height:px2dp(30)}}
                            />
                            <Text style={{fontSize:px2dp(25),color: '#64bdf9'}}>{info.amount}</Text>
                        </View>
                    </View>
                    <View style={{flexDirection:'row',justifyContent: 'center',alignItems:'center',marginTop: px2dp(10)}}>
                        <View style={styles.warn_symbol_wrap}>
                            <Text style={styles.warn_symbol}>!</Text>
                        </View>
                        <Text style={{fontSize:px2dp(12),color:'#b0b0b0'}}>请与客户确认订单再进行支付</Text>
                    </View>
                        {
                            (info.amount-info.arrears>0)?(
                                <TouchableWithoutFeedback onPress={()=>{navigate('PayWays',{info:info,price:info.arrears})}}>
                                    <View style={styles.editor_btn}>
                                        <Text style={styles.editor_btn_font}>支付尾款</Text>
                                    </View>
                                </TouchableWithoutFeedback>
                                ):(
                                <View style={styles.flex_space_between}>
                                    <TouchableWithoutFeedback onPress={()=>{navigate('PayWays',{info:info,price:(info.amount*0.3).toFixed(2)})}}>
                                        <View style={styles.editor_btn}>
                                            <Text style={styles.editor_btn_font}>支付30%定金</Text>
                                        </View>
                                    </TouchableWithoutFeedback>
                                    <TouchableWithoutFeedback onPress={()=>{navigate('PayWays',{info:info,price:info.amount})}}>
                                        <View style={[styles.editor_btn,styles.editor_btn_on]}>
                                            <Text style={[styles.editor_btn_font,styles.editor_font_on]}>支付全款</Text>
                                        </View>
                                    </TouchableWithoutFeedback>
                                </View>
                            )
                        }


                </ScrollView>
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
        borderWidth: px2dp(1),
        borderColor:'#efefef'
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
        flex:1,
        elevation:3,
        backgroundColor:'#ffffff',
        borderRadius: px2dp(10),
        marginHorizontal: px2dp(17),
        marginTop: px2dp(45),
        marginBottom: px2dp(25)
    },
    editor_btn_font:{
        fontSize:px2dp(16),
        color:'#64bdf9',
        textAlign: 'center',
        lineHeight: px2dp(45)
    },
    editor_btn_on:{
        backgroundColor:'#64bdf9'
    },
    editor_font_on:{
        color:'#fff'
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
    }
});