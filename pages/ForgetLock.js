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
    AsyncStorage
} from 'react-native';
var {width,height} = Dimensions.get('window');
import px2dp from './tools/px2dp';
import Header from "./CommonModules/Header";
import {getStorage} from './tools/Public';
export default class ForgetLock extends Component{
    static navigationOptions = {
        header: null
    };
    constructor(props){
        super(props);
        this.state = {

        }
    }
    //确认密码然后跳转到设置密码页
    affirmBtn(){
        const { navigate } = this.props.navigation;
        navigate('SetLock')
    }
    render(){
        return(
            <View style={{flex:1,backgroundColor: '#fcfcfc'}}>
                <Header title={'忘记锁屏密码'} navigate={this.props.navigation}/>
                <View style={styles.flex}>
                    <TextInput placeholder={'请输入账号登录密码'} style={styles.input_style}/>
                </View>
                <TouchableWithoutFeedback onPress={()=>{this.affirmBtn()}}>
                    <View style={styles.btn_wrap}>
                        <Text style={styles.btn_font}>确认</Text>
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
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems:'center'
    },
    btn_wrap:{
        height:px2dp(40),
        marginHorizontal:px2dp(17),
        borderRadius:px2dp(5),
        elevation:3,
        backgroundColor:'#64bdf9',
        marginBottom:px2dp(25)
    },
    btn_font:{
        textAlign: 'center',
        lineHeight:px2dp(40),
        color:'#fff',
        fontSize:px2dp(18)
    },
    input_style:{
        backgroundColor:'#ffffff',
        height:px2dp(40),
        borderRadius:5,
        elevation:3,
        paddingLeft: px2dp(10),
        margin:px2dp(17)
    },
});