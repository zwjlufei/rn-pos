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
import Icon from "react-native-vector-icons/FontAwesome";
export default class SalaryDetail extends Component{
    static navigationOptions = {
        header: null
    };
    constructor(props){
        super(props);
        this.state = {
            hasFinish:true
        }
    }
    render(){
        const { navigate } = this.props.navigation;
        return(
            <View style={{flex:1,backgroundColor: '#fcfcfc'}}>
                <Header title={'工资详情'} navigate={this.props.navigation}/>
                <ScrollView>
                    <View style={{paddingLeft: px2dp(18),paddingVertical: px2dp(25),flexDirection:'row'}}>
                        <Image
                            style={styles.nanny_photo}
                            source={{uri: 'http://cdn.ayi800.com/image/3418a34f62664c29d518390552d321f9.jpg'}}
                            resizeMode='cover'
                            resizeMethod='auto'/>
                        <View style={styles.nanny_info}>
                            <View style={{flexDirection:'row',alignItems:'center'}}>
                                <Text style={{fontSize:px2dp(15),color:'#191919',marginRight:px2dp(10)}}>赵向华</Text>
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
                    <View style={styles.flex_row}>
                        <Text style={{fontSize:px2dp(15),color:'#191919',paddingLeft:px2dp(17)}}>基础薪资：</Text>
                        <Text>3000元</Text>
                    </View>
                    <Text style={{fontSize:px2dp(15),color:'#191919',paddingLeft:px2dp(17)}}>本月提成：</Text>
                    <TouchableWithoutFeedback onPress={()=>{navigate('UnitDetail')}}>
                        <View style={[styles.flex_space_between,styles.salary_item]}>
                            <Text style={{fontSize:px2dp(13)}}>周晓日(月嫂)</Text>
                            <Text style={{fontSize:px2dp(13)}}>10天</Text>
                            {
                                this.state.hasFinish?(
                                    <Text style={{fontSize:px2dp(13),color: '#f54c6c'}}>未完单</Text>
                                ):(
                                    <Text style={{fontSize:px2dp(13),color: '#7ace2a'}}>已完单</Text>
                                )
                            }
                            <View style={{flexDirection: 'row',alignItems: 'center'}}>
                                <Text style={{fontSize:px2dp(13),marginRight: px2dp(10)}}>2000元</Text>
                                <Icon name="angle-right" size={28} color="#b0b0b0" />
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                    <View style={[styles.flex_space_between,styles.salary_item]}>
                        <Text style={{fontSize:px2dp(13)}}>周晓日(月嫂)</Text>
                        <Text style={{fontSize:px2dp(13)}}>10天</Text>
                        <Text style={{fontSize:px2dp(13),color: '#7ace2a'}}>已完单</Text>
                        <View style={{flexDirection: 'row',alignItems: 'center'}}>
                            <Text style={{fontSize:px2dp(13),marginRight: px2dp(10)}}>2000元</Text>
                            <Icon name="angle-right" size={28} color="#b0b0b0" />
                        </View>
                    </View>
                    <View style={[styles.flex_space_between,styles.salary_item]}>
                        <Text style={{fontSize:px2dp(13)}}>周晓日(月嫂)</Text>
                        <Text style={{fontSize:px2dp(13)}}>10天</Text>
                        <Text style={{fontSize:px2dp(13),color: '#7ace2a'}}>已完单</Text>
                        <View style={{flexDirection: 'row',alignItems: 'center'}}>
                            <Text style={{fontSize:px2dp(13),marginRight: px2dp(10)}}>2000元</Text>
                            <Icon name="angle-right" size={28} color="#b0b0b0" />
                        </View>
                    </View>
                    <View style={{flexDirection:'row',justifyContent:'flex-end',alignItems:'center',paddingRight: px2dp(18),marginTop: px2dp(22)}}>
                        <Text style={{fontSize:px2dp(14)}}>合计：</Text>
                        <Text style={{fontSize:px2dp(26),color:'#64bdf9'}}>9000元</Text>
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
    flex_row:{
        flexDirection:'row',
        alignItems:'center',
        paddingTop: px2dp(30),
        marginBottom:px2dp(15)
    },
    salary_item:{
        paddingHorizontal: px2dp(18),
        height:px2dp(50),
        borderBottomWidth: 1,
        borderBottomColor: '#efefef'
    },
    module_gap:{
        height:px2dp(5),
        backgroundColor:'#efefef'
    },
    nanny_photo:{
        width: px2dp(110),
        height: px2dp(110),
        resizeMode: "contain",
        borderRadius:px2dp(5)
    },
    nanny_info:{
        flexDirection:'column',
        justifyContent: 'space-between',
        marginLeft: px2dp(20),
        paddingVertical: px2dp(5)
    },
    nanny_info_font:{
        fontSize:px2dp(13),
        color:'#8a8a8a'
    },
    margin_gap:{
        marginRight:px2dp(20)
    }
});