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
import Icon from "react-native-vector-icons/FontAwesome";
import ForgetLock from "./ForgetLock";
import {getStorage, Toast} from "./tools/Public";
export default class SetPage extends Component{
    static navigationOptions = {
        header: null
    };
    constructor(props){
        super(props);
        this.state = {
            name:'',
            en:''
        }
        this.exitLogin=this.exitLogin.bind(this);
    }
    componentWillMount(){
        getStorage('userInfo')
            .then(data=>{
                this.setState({
                    name:data.name,
                    en:data.en
                })
            }).catch(err=>{
            console.log(err)
        })
    }
    //退出登录
    exitLogin(){
        const { navigate } = this.props.navigation;
        AsyncStorage.multiRemove(['userInfo','pwdImage'],function (error) {
            if (error) {
                Toast('退出登录失败～');
            }else {
                Toast('退出登录～');
                navigate('Login');
            }
        })
    }
    render(){
        const { navigate } = this.props.navigation;
        return(
            <View style={{flex:1,backgroundColor: '#fcfcfc'}}>
                <Header title={'设置'} navigate={this.props.navigation}/>
                <View style={[styles.flex_space_between,styles.item]}>
                    <Text style={styles.title}>当前登录账号:</Text>
                    <Text style={styles.content}>{this.state.name}</Text>
                </View>
                <View style={[styles.flex_space_between,styles.item]}>
                    <Text style={styles.title}>终端设备号(EN):</Text>
                    <Text style={styles.content}>{this.state.en}</Text>
                </View>
                <View style={styles.item_gap}></View>
                <TouchableWithoutFeedback onPress={()=>{navigate('SetLock')}}>
                    <View style={[styles.flex_space_between,styles.item]}>
                        <Text style={styles.title}>修改锁屏密码</Text>
                        <Icon name="angle-right" size={25} color="#b0b0b0" />
                    </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={()=>{navigate('ForgetLock')}}>
                    <View style={[styles.flex_space_between,styles.item]}>
                        <Text style={styles.title}>忘记锁屏密码</Text>
                        <Icon name="angle-right" size={25} color="#b0b0b0" />
                    </View>
                </TouchableWithoutFeedback>
                <View style={[styles.flex_space_between,styles.item]}>
                    <Text style={styles.title}>关于我们</Text>
                    <Text>版本1.0.3</Text>
                </View>
                <TouchableWithoutFeedback onPress={()=>{this.exitLogin()}}>
                    <View style={[styles.flex_space_between,styles.item]}>
                        <Text style={styles.title}>退出登录</Text>
                        <Icon name="angle-right" size={25} color="#b0b0b0" />
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
    title:{
        flex:1,
        lineHeight:px2dp(48),
        fontSize:px2dp(14),
        color:'#4b4b4b'
    },
    content:{
        flex:2,
        lineHeight:px2dp(48),
        marginLeft:px2dp(17),
        fontSize:px2dp(14),
        color:'#4b4b4b'
    },
    item:{
        borderBottomWidth: px2dp(1),
        borderBottomColor:'#efefef',
        paddingHorizontal: px2dp(17)
    },
    item_gap:{
        height:px2dp(5),
        backgroundColor: '#efefef'
    }
});