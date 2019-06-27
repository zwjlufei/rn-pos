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
import constant from './../tools/constant';
export default class DoulaInfo extends Component{
    static navigationOptions = {
        header: null
    };
    constructor(props){
        super(props);
        this.state = {

        }
    }

    render(){
        const { navigate } = this.props.navigation;
        const info = this.props.navigation.state.params.info;
        return(
            <View style={{flex:1,backgroundColor: '#fcfcfc'}}>
                <Header title={'导乐单信息'} navigate={this.props.navigation}/>
                <ScrollView >
                <View style={[styles.flex_space_between,styles.item_style]}>
                    <Text style={styles.item_title}>订单详情:</Text>
                    <Text style={styles.item_content}>{constant[info.type]}</Text>
                </View>
                <View style={[styles.flex_space_between,styles.item_style]}>
                    <Text style={styles.item_title}>开始时间:</Text>
                    <Text style={styles.item_content}>{info.start_datetime}</Text>
                </View>
                <View style={[styles.flex_space_between,styles.item_style]}>
                    <Text style={styles.item_title}>结束时间:</Text>
                    <Text style={styles.item_content}>{info.end_datetime}</Text>
                </View>
                <View style={[styles.flex_space_between,styles.item_style]}>
                    <Text style={styles.item_title}>服务时长:</Text>
                    <Text style={[styles.item_content,styles.blue_color]}>{info.duration}小时</Text>
                </View>
                <View style={[styles.flex_space_between,styles.item_style]}>
                    <Text style={styles.item_title}>服务类型:</Text>
                    <Text style={styles.item_content}>{constant[info.service_type]}</Text>
                </View>
                <View style={[styles.flex_space_between,styles.item_style]}>
                    <Text style={styles.item_title}>生产类型:</Text>
                    <Text style={styles.item_content}>{constant[info.parturition_type]}</Text>
                </View>
                <View style={[styles.flex_space_between,styles.item_style]}>
                    <Text style={styles.item_title}>客户姓名:</Text>
                    <Text style={styles.item_content}>{info.customer_name}({info.customer_phone})</Text>
                </View>
                <View style={[styles.flex_space_between,styles.item_style]}>
                    <Text style={styles.item_title}>服务员工:</Text>
                    <Text style={styles.item_content}>{info.employee_name}({info.employee_phone})</Text>
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
                <View style={{flexDirection:'row',justifyContent: 'center',alignItems:'center'}}>
                    <View style={styles.warn_symbol_wrap}>
                        <Text style={styles.warn_symbol}>!</Text>
                    </View>
                    <Text style={{fontSize:px2dp(12),color:'#b0b0b0'}}>请与客户确认订单再进行支付</Text>
                </View>
                <View style={{flexDirection:'row',justifyContent:'space-between',paddingHorizontal:px2dp(17),marginTop:px2dp(15)}}>
                    <TouchableWithoutFeedback onPress={()=>{this.props.navigation.goBack()}}>
                        <View style={styles.bottom_btn}>
                            <Text style={styles.bottom_btn_font}>编辑订单</Text>
                        </View>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback onPress={()=>{navigate('PayWays',{info:info,price:info.amount})}}>
                        <View style={[styles.bottom_btn,styles.bottom_btn_on]}>
                            <Text style={[styles.bottom_btn_font,styles.bottom_font_on]}>立即支付</Text>
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
        fontSize:px2dp(14)
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
        height:px2dp(55)
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