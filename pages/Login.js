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
    ImageBackground, AsyncStorage
} from 'react-native';
var {width,height} = Dimensions.get('window');
import px2dp from './tools/px2dp';
import WangPos from './../youmayouzi';
import {dataReset,feach_request,getStorage,Toast} from './tools/Public';
import NoDoublePress from "./tools/NoDoublePress";
import Icon from "react-native-vector-icons/FontAwesome";
export default class Login extends Component{
    static navigationOptions = {
        header: null
    };
    constructor(props){
        super(props);
        this.state = {
            location:'',
            user:'',
            pwd:'',
            isPhone:false,
            pwdShow:true
        }
    }
    componentWillMount(){
        const { navigate } = this.props.navigation;
        getStorage('userInfo')
            .then(data=>{
                if(data.token){
                    var data = {
                        token:data.token
                    }
                    data = dataReset(data);
                    feach_request('/pos_check_token','POST',data,this.props.navigation)
                        .then((data)=>{
                            if(data.data.code==0){
                                navigate('Home')
                            }
                        }).catch((err)=>{
                        console.log('err',err)
                    })
                }
            }).catch(err=>{
            console.log(err)
        })
        WangPos.isWangPos((state)=>{
            if(state!=='False'){
                WangPos.getDeviceType((location)=> {
                    this.setState({location: location})
                });
            }else {
                this.setState({
                    isPhone:true
                })
            }
        })
    }
    //数据提交
    _request(){
        const { navigate } = this.props.navigation;
        if(this.state.isPhone){
            var  location={en:'e1551df8'};
        }else {
            var location = JSON.parse(this.state.location);
        }
        var data = {
            device_no:location.en,
            user: this.state.user,
            pwd:this.state.pwd
        }
        data = dataReset(data);
        feach_request('/pos_login','POST',data)
            .then((data)=>{
                if(data.status==0){
                    data.data.en = location.en;
                    AsyncStorage.setItem('userInfo',JSON.stringify(data.data));
                    // navigate('SetLock');
                    navigate('Home');
                }else {
                    Toast('请检查用户名和密码的正确性～')
                }
            }).catch((err)=>{
                console.log(err)
            })
    }
    render(){
        const { navigate } = this.props.navigation;
        return(
            <View style={{flex:1,backgroundColor: '#fcfcfc'}}>
                <ScrollView>
                    <View style={{width:width,height:px2dp(250)}}>
                        <Image
                            source={require('./../images/login_bg.png')}
                            style={{width:width,height:px2dp(140)}}
                        />
                        <Image
                            source={require('./../images/logo.png')}
                            style={styles.logo}
                        />
                        <Text style={styles.title}>家嘉母婴</Text>
                        <Text style={{textAlign: 'center',fontSize:px2dp(9),color:'#badefa',letterSpacing: px2dp(2)}}>HAPPY-FAMILY</Text>
                    </View>
                    <View style={{padding: px2dp(12)}}>
                        <View style={styles.login_wrap}>
                            <View style={[styles.flex_space_between,styles.mb_25]}>
                                <Image
                                    source={require('./../images/login_name.png')}
                                    style={{width:px2dp(25),height:px2dp(25)}}
                                />
                                <TextInput onChangeText={(text)=>{this.setState({user:text})}} placeholder={'请填写账号'} style={styles.input_style}/>
                            </View>
                            <View style={styles.flex_space_between}>
                                <Image
                                    source={require('./../images/login_pwd.png')}
                                    style={{width:px2dp(25),height:px2dp(25)}}
                                />
                                <View style={styles.input_style}>
                                    <TextInput onChangeText={(text)=>{this.setState({pwd:text})}}
                                               placeholder={'请填写密码'}
                                               style={{height:px2dp(40)}}
                                               secureTextEntry={this.state.pwdShow}
                                    />
                                    <TouchableWithoutFeedback onPress={()=>{
                                        this.setState({
                                            pwdShow:!this.state.pwdShow
                                        })
                                    }}>
                                    <View style={styles.right_eye}>
                                        <Icon name={this.state.pwdShow?'eye-slash':'eye'} size={18} color="#b2b2b2" />
                                    </View>
                                    </TouchableWithoutFeedback>

                                </View>


                            </View>
                            <TouchableWithoutFeedback onPress={()=>NoDoublePress.onPress(()=>{this._request()})}>
                                <View style={{justifyContent: 'center',alignItems: 'center',marginTop: px2dp(25),paddingRight: px2dp(20)}}>
                                    <View style={styles.login_btn}>
                                        <Text style={{fontSize:px2dp(16),color:'#fff',textAlign:'center',lineHeight:px2dp(42)}}>登录</Text>
                                    </View>
                                </View>
                            </TouchableWithoutFeedback>
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
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems:'center'
    },
    logo:{
        width:px2dp(120),
        height:px2dp(120),
        position: 'absolute',
        left:width/2,
        top:px2dp(80),
        marginLeft: -px2dp(60)
    },
    title:{
        textAlign: 'center',
        fontSize:px2dp(18),
        color:'#64bdf9',
        marginTop: px2dp(50),
        letterSpacing: px2dp(1),
        marginBottom:px2dp(5)
    },
    login_wrap:{
        height:px2dp(240),
        backgroundColor: '#fff',
        borderRadius:px2dp(8),
        elevation:4,
        paddingTop: px2dp(40),
        paddingLeft: px2dp(20)
    },
    input_style:{
        flex:1,
        borderWidth: px2dp(1),
        borderColor:'#f0f0f0',
        borderRadius: px2dp(5),
        marginHorizontal: px2dp(10),
        height:px2dp(40),
        paddingLeft: px2dp(15)
    },
    mb_25:{
        marginBottom: px2dp(20)
    },
    login_btn:{
        width:px2dp(166),
        height:px2dp(42),
        backgroundColor:'#64bdf9',
        borderRadius:px2dp(5)
    },
    right_eye:{
        position: 'absolute',
        right:px2dp(0),
        top:px2dp(0),
        width:px2dp(50),
        height:px2dp(40),
        paddingTop: px2dp(9),
        paddingLeft:px2dp(15)
    }
});