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
    DrawerLayoutAndroid
} from 'react-native';
var {width,height} = Dimensions.get('window');
import px2dp from './../tools/px2dp';
import Header from "./../CommonModules/Header";
export default class UnitDetail extends Component{
    static navigationOptions = {
        header: null
    };
    constructor(props){
        super(props);
        this.state = {
            hasGive:false
        }
    }
    render(){
        const { navigate } = this.props.navigation;
        return(
            <View style={{flex:1,backgroundColor: '#fcfcfc'}}>
                <Header title={'提成详情'} navigate={this.props.navigation}/>
                <ScrollView>
                    <View style={{paddingLeft: px2dp(18),paddingVertical: px2dp(30)}}>
                        <View style={styles.nanny_info}>
                            <View style={{flexDirection:'row',alignItems:'center'}}>
                                <Text style={{fontSize:px2dp(15),color:'#000',marginRight:px2dp(10)}}>赵向华</Text>
                                <Text style={{fontSize:px2dp(11),color:'#7ace2a'}}>在岗</Text>
                            </View>
                            <View style={{flexDirection:'row'}}>
                                <Text style={[styles.nanny_info_font,styles.margin_gap]}>38岁</Text>
                                <Text style={styles.nanny_info_font}>黑龙江</Text>
                            </View>
                            <Text style={styles.nanny_info_font}>价格：200元/天</Text>
                            <Text style={styles.nanny_info_font}>手机号: 15810977141</Text>
                        </View>
                    </View>
                    <View style={styles.module_gap}></View>
                    <View style={{paddingLeft: px2dp(18),paddingVertical: px2dp(30)}}>
                        <View style={styles.unit_item}>
                            <Text style={styles.unit_item_title}>床号:</Text>
                            <Text style={styles.unit_item_content}>01</Text>
                        </View>
                        <View style={styles.unit_item}>
                            <Text style={styles.unit_item_title}>订单号:</Text>
                            <Text style={[styles.unit_item_content,styles.blue_color]}>98765443</Text>
                        </View>
                        <View style={styles.unit_item}>
                            <Text style={styles.unit_item_title}>订单开始时间:</Text>
                            <Text style={styles.unit_item_content}>2018-10-20  12:10</Text>
                        </View>
                        <View style={styles.unit_item}>
                            <Text style={styles.unit_item_title}>订单到期时间:</Text>
                            <Text style={styles.unit_item_content}>2018-10-28  12:10</Text>
                        </View>
                        <View style={styles.unit_item}>
                            <Text style={styles.unit_item_title}>本次提成核算截止时间:</Text>
                            <Text style={styles.unit_item_content}>2018-10-20  12:10</Text>
                        </View>
                        <View style={styles.unit_item}>
                            <Text style={styles.unit_item_title}>本次提成计算天数:</Text>
                            <Text style={styles.unit_item_content}>12天</Text>
                        </View>
                        <View style={styles.unit_item}>
                            <Text style={styles.unit_item_title}>本次未提成计算天数:</Text>
                            <Text style={styles.unit_item_content}>8天</Text>
                        </View>
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
    module_gap:{
        height:px2dp(5),
        backgroundColor:'#efefef'
    },
    nanny_info:{
        flexDirection:'column',
        justifyContent: 'space-between',
        paddingVertical: px2dp(5),
        height:px2dp(100)
    },
    nanny_info_font:{
        fontSize:px2dp(13),
        color:'#8a8a8a'
    },
    margin_gap:{
        marginRight:px2dp(20)
    },
    unit_item:{
        flexDirection:'row',
        alignItems:'center',
        height:px2dp(41)
    },
    unit_item_title:{
        fontSize:px2dp(15),
        color:'#000',
        marginRight:px2dp(20)
    },
    unit_item_content:{
        fontSize:px2dp(16),
        color:'#4b4b4b'
    },
    blue_color:{
        color:'#64bdf9'
    }
});