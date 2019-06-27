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
    ScrollView, TouchableNativeFeedback, DeviceEventEmitter
} from 'react-native';
var {width,height} = Dimensions.get('window');
import px2dp from './../tools/px2dp';
import Header from "./../CommonModules/Header";
import Icon from "react-native-vector-icons/FontAwesome";
import {dataReset, feach_request, getStorage, Toast} from "../tools/Public";
import constant from "../tools/constant";
export default class EditInfo extends Component{
    static navigationOptions = {
        header: null
    };
    constructor(props){
        super(props);
        this.state = {
            hasGive:false,
            stateShow:false,
            workState:'',
            price:'',
            priceShow:false,
            hospitalStatus:'',
            phone:''
        }
    }
    componentWillMount(){
        const rowData=this.props.navigation.state.params.info;
        this.setState({
            hospitalStatus:rowData.hospital_status,
            phone:rowData.phone_number,
            ph_price:rowData.price
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

    //数据初始化
    saveInfo(){
        const phoneReg = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;
        if(!phoneReg.test(this.state.phone)){
            Toast('手机号格式不正确～');
            return false;
        }
        const id=this.props.navigation.state.params.id;
        var data={
            waiter_id:id,
            hospital_status:this.state.hospitalStatus,
            ph_price:this.state.ph_price,
            phone_number:this.state.phone,
            token:this.state.userInfo.token
        };
        data = dataReset(data);
        feach_request('/pos_waiter_edit','POST',data,this.props.navigation)
            .then((data)=>{
                if(data.status==0){
                    this.props.navigation.goBack();
                }
            })
            .catch((err)=>{
                console.log(err);
                Toast('出现未知错误，信息无法提交～');
            })
    }
    //状态选择
    changeState(state,hospitalStatus){
        this.setState({
            workState:state,
            stateShow:false,
            hospitalStatus:hospitalStatus
        })
    }
    //价格选择
    changePrice(price){
        this.setState({
            price:price+'元/天',
            ph_price:price,
            priceShow:false
        })
    }
    render(){
        const { navigate } = this.props.navigation;
        const rowData=this.props.navigation.state.params.info;
        const name=this.props.navigation.state.params.name;
        return(
            <View style={{flex:1,backgroundColor: '#fcfcfc'}}>
                <Header title={'编辑资料'} navigate={this.props.navigation}/>
                <ScrollView>
                    <View style={styles.container}>
                        <View>
                            <View  style={styles.item_title_wrap}>
                                <Text style={styles.item_title}>服务员工</Text>
                                <Text style={{fontSize:px2dp(14),color:'#64bdf9',lineHeight:px2dp(40)}}>{name}</Text>
                            </View>
                            <Text style={styles.item_title}>状态</Text>
                            <View>
                                <TouchableWithoutFeedback onPress={()=>{this.setState({stateShow:!this.state.stateShow})}}>
                                    <View>
                                        <TextInput value={this.state.workState} style={[styles.input_font,styles.input_style]} placeholder={rowData.hospital_status?'在岗':'离岗'} editable={false}/>
                                        <Icon name="angle-down" size={25} color="#b2b2b2" style={styles.right_arrow} />
                                    </View>
                                </TouchableWithoutFeedback>
                                {
                                    this.state.stateShow?(
                                        <View style={styles.input_down_wrap}>
                                            <View style={{flex:1}}>
                                                <TouchableNativeFeedback onPress={()=>{this.changeState('在职',true)}}>
                                                    <View style={{height:px2dp(40)}}>
                                                        <Text style={styles.down_font}>在职</Text>
                                                    </View>
                                                </TouchableNativeFeedback>
                                                <TouchableNativeFeedback onPress={()=>{this.changeState('离职',false)}}>
                                                    <View style={{height:px2dp(40)}}>
                                                        <Text style={styles.down_font}>离职</Text>
                                                    </View>
                                                </TouchableNativeFeedback>
                                            </View>
                                        </View>
                                    ):(null)
                                }
                            </View>
                            <Text style={styles.item_title}>价格</Text>
                            <View>
                                {
                                    this.state.stateShow?(
                                        <View>
                                            <TextInput value={this.state.price} style={[styles.input_font,styles.input_style]} placeholder={'请输入服务员工价格'} editable={false}/>
                                            <Icon name="angle-down" size={25} color="#b2b2b2" style={styles.right_arrow} />
                                        </View>
                                    ):(
                                        <TouchableWithoutFeedback onPress={()=>{this.setState({priceShow:!this.state.priceShow})}}>
                                            <View>
                                                <TextInput value={this.state.price} style={[styles.input_font,styles.input_style]} placeholder={rowData.price+'元/天'} editable={false}/>
                                                <Icon name="angle-down" size={25} color="#b2b2b2" style={styles.right_arrow} />
                                            </View>
                                        </TouchableWithoutFeedback>
                                    )
                                }
                                {
                                    this.state.priceShow?(
                                        <View style={[styles.input_down_wrap,styles.price_down_height]}>
                                            <View style={{flex:1}}>
                                                <TouchableNativeFeedback onPress={()=>{this.changePrice('150')}}>
                                                    <View style={{height:px2dp(40)}}>
                                                        <Text style={styles.down_font}>150元/天</Text>
                                                    </View>
                                                </TouchableNativeFeedback>
                                                <TouchableNativeFeedback onPress={()=>{this.changePrice('180')}}>
                                                    <View style={{height:px2dp(40)}}>
                                                        <Text style={styles.down_font}>180元/天</Text>
                                                    </View>
                                                </TouchableNativeFeedback>
                                                <TouchableNativeFeedback onPress={()=>{this.changePrice('200')}}>
                                                    <View style={{height:px2dp(40)}}>
                                                        <Text style={styles.down_font}>200元/天</Text>
                                                    </View>
                                                </TouchableNativeFeedback>
                                            </View>
                                        </View>
                                    ):(null)
                                }

                            </View>
                            <Text style={styles.item_title}>手机号</Text>
                            <View style={{flex:1}}>
                                <View style={styles.input_style}>
                                    <TextInput style={styles.input_font} defaultValue={rowData.phone_number} maxLength={11} onChangeText={(text)=>{this.setState({phone:text})}} editable={this.state.priceShow?false:true}/>
                                </View>
                            </View>
                        </View>
                        <TouchableWithoutFeedback onPress={()=>{this.saveInfo()}}>
                            <View style={styles.bottom_btn}>
                                <Text style={styles.bottom_btn_font}>保存</Text>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </ScrollView>
            </View>

        )
    }
    //页面将要离开的是时候发送通知
    componentWillUnmount(){
        DeviceEventEmitter.emit('UpdateData');
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
    container:{
        flex:1,
        flexDirection:'column',
        justifyContent: 'space-between',
        paddingHorizontal: px2dp(17),
        paddingVertical: px2dp(25)
    },
    item_title_wrap:{
        width:px2dp(120),
        flexDirection:'row',
        justifyContent:'space-between'
    },
    item_title:{
        fontSize:px2dp(15),
        color:'#333',
        lineHeight:px2dp(40)
    },
    input_style:{
        height:px2dp(40),
        borderRadius:5,
        elevation:2,
        paddingLeft: px2dp(10),
        marginVertical: px2dp(10)
    },
    input_font:{
        fontSize:px2dp(15),
        color:'#b2b2b2'
    },
    right_arrow:{
        position: 'absolute',
        right:px2dp(17),
        top:px2dp(18)
    },
    bottom_btn:{
        height:px2dp(46),
        backgroundColor:'#ffffff',
        borderRadius:px2dp(8),
        elevation:3,
        marginTop:px2dp(150)
    },
    bottom_btn_font:{
        textAlign: 'center',
        lineHeight:px2dp(40),
        fontSize:px2dp(16),
        color:'#64bdf9'
    },
    input_down_wrap:{
        width:px2dp(341),
        height:px2dp(90),
        backgroundColor:'#fff',
        elevation:4,
        position: 'absolute',
        left:0,
        top:px2dp(48),
        borderBottomRightRadius:px2dp(5),
        borderBottomLeftRadius:px2dp(5)
    },
    down_font:{
        color:'#b2b2b2',
        fontSize: px2dp(14),
        textAlign:'center',
        lineHeight:px2dp(40)
    },
    price_down_height:{
        height:px2dp(120)
    }
});