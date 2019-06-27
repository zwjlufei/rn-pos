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
import PasswordGesture from 'react-native-gesture-password';
export default class LockScreen extends Component{
    static navigationOptions = {
        header: null
    };
    constructor(props){
        super(props);
        this.state = {
            message: '请输入密码图案',
            status: 'normal',
            pwd:''
        }
    }
    componentWillMount(){
        getStorage('pwdImage')
            .then(data=>{
                this.setState({
                    pwd:data
                })
            })
    }
    onStart(){
        this.setState({
            status: 'normal',
            message: '请输入密码图案'
        });
    }
    onEnd(password){
        const { navigate } = this.props.navigation;
            if (password == this.state.pwd) {
                this.setState({
                    status: 'right',
                    message: '输入成功'
                });
                navigate('SalaryList')
            } else {
                this.setState({
                    status: 'wrong',
                    message: '密码错误请重新输入'
                });
            }
    }
    //左侧按钮
    leftBtn(){
        const { navigate } = this.props.navigation;
        navigate('Home');
    }
    render(){
        const { navigate } = this.props.navigation;
        return(
            <View style={{flex:1,backgroundColor: '#fcfcfc'}}>
                <Header title={'输入锁屏密码'} navigate={this.props.navigation}/>
                <PasswordGesture
                    ref='pp'
                    style={{backgroundColor:'#fcfcfc'}}
                    status={this.state.status}
                    message={this.state.message}
                    interval={500}
                    onStart={() => this.onStart()}
                    onEnd={(password) => this.onEnd(password)}
                />
                <TouchableWithoutFeedback onPress={()=>{this.leftBtn()}}>
                    <View style={styles.btn_wrap}>
                        <Text style={styles.btn_font}>修改密码</Text>
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
    }
});