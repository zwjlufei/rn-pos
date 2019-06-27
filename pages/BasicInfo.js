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
    ScrollView, Modal
} from 'react-native';
var {width,height} = Dimensions.get('window');
import px2dp from './tools/px2dp';
import Header from "./CommonModules/Header";
import Icon from "react-native-vector-icons/FontAwesome";
import Date from './datePicker/calendar';
import {dataReset, feach_request, getStorage, Toast, checkID} from './tools/Public';
import NoDoublePress from './tools/NoDoublePress';
export default class BasicInfo extends Component{
    static navigationOptions = {
        header: null
    };
    constructor(props){
        super(props);
        this.state = {
            sex_btn_on:'male',
            dateShow:false,
            value:'',
            bedNum:'',
            name:'',
            phone:'',
            card:'',
            customerId:'',
            userInfo:null,
            modalVisible:false,
            customer:'',
            native:''
        }
    }
    componentWillMount(){
        const native = this.props.navigation.state.params.native;
        const customer = this.props.navigation.state.params.customer;
        if(customer){
            this.setState({
                name:customer.name.toString(),
                phone:customer.phone.toString(),
                sex_btn_on:customer.sex.toString(),
                value:customer.birth?customer.birth.toString():'',
                card:customer.id_number.toString(),
                bedNum:customer.bed_no.toString(),
                customerId:customer.customer_id
            })
        }
        getStorage('userInfo')
            .then(data=>{
                this.setState({
                    userInfo:data,
                    native:native
                })
            }).catch(err=>{
                console.log(err)
        })
    }
    //性别按钮切换
    changBtn(msg){
        this.setState({
            sex_btn_on:msg
        })
    }
    //获取时间
    getTime(time){
        this.setState({
            value:time
        })
    }
    //时间选择器
    closeDate(show){
        this.setState({
            dateShow:show
        })
    }
    //信息验证
    regNum(source){
        const phoneReg = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;
        if(source=='ProductList'){
            if(!this.state.name.trim()){
                Toast('请填写客户姓名～');
                return false;
            }
        }else {
            if(!this.state.bedNum.trim() || !this.state.name.trim() || !this.state.value.trim()){
                Toast('请确认信息完整性～');
                return false;
            }
        }
        if(!phoneReg.test(this.state.phone)){
            Toast('手机号格式不正确～');
            return false;
        }
        if(source=='CreateNanny'&&!this.state.card){
            Toast('请填写身份证～');
            return false;
        }
        if(this.state.card){
            const regState=checkID(this.state.card);
            if(!regState){
                Toast('身份证格式不正确～');
                return false;
            }
        }
        return true;
    }
    //创建订单
    createOrder(source){
        var data={
            customer_id:this.state.customerId,
            name:this.state.name,
            phone:this.state.phone,
            id_number:this.state.card,
            birth:this.state.value,
            sex:this.state.sex_btn_on,
            bed_no: this.state.bedNum,
            hospital:this.state.userInfo.name,
            token:this.state.userInfo.token
        };
        data = dataReset(data);
        if(this.regNum(source)){
            feach_request('/pos_create_customers','POST',data,this.props.navigation)
                .then((data)=>{
                    if(data.data.code=='30003' || data.data.code=='30001' ){
                        this.setState({
                            customerId:data.data.customer_id
                        });
                        this.props.navigation.navigate(source,{customerId:data.data.customer_id,name:this.state.name});
                    }else if(data.data.code=='30002'){
                        this.setState({
                            modalVisible:true,
                            customer:data.data.customer_name,
                            customerId:data.data.customer_id
                        })
                    }
                })
                .catch((err)=>{
                    console.log(err);
                    Toast('出现未知错误，信息无法提交～');
                })
        }
    }
    //确认订单
    ensureOrder(source){
        var data={
            customer_id:this.state.customerId,
            name:this.state.name,
            phone:this.state.phone,
            id_number:this.state.card,
            birth:this.state.value,
            sex:this.state.sex_btn_on,
            bed_no: this.state.bedNum,
            hospital:this.state.userInfo.name,
            token:this.state.userInfo.token
        };
        data = dataReset(data);
        if(this.regNum(source)){
            feach_request('/pos_customer_submit','POST',data,this.props.navigation)
                .then((data)=>{
                    if(data.status=='0'){
                        this.props.navigation.navigate(source,{customerId:this.state.customerId,name:this.state.name});
                    }
                })
                .catch((err)=>{
                    console.log(err);
                    Toast('出现未知错误，信息无法提交～');
                })
        }
    }
    //跳转到下一个页面
    goNext(source){
        this.setState({
            modalVisible: false
        });
        if(source=='CreateNanny'){
            this.props.navigation.navigate(source,{customerId:this.state.customerId,name:this.state.customer,card:''});
        }else {
            this.props.navigation.navigate(source,{customerId:this.state.customerId,name:this.state.customer});
        }
    }
    render(){
        const { navigate } = this.props.navigation;
        const source = this.props.navigation.state.params.source;
        return(
            <View style={{flex:1,backgroundColor: '#fcfcfc'}}>
                <Header title={'客户基础信息'} navigate={this.props.navigation}/>
                <ScrollView>
                    <View style={styles.info_item_box}>
                        <Image
                            source={require('./../images/info_bed_icon.png')}
                            style={{width:px2dp(17),height:px2dp(15)}}
                        />
                        <View style={styles.item_title}>
                            <Text style={{fontSize:px2dp(14)}}>床</Text>
                            <Text style={{fontSize:px2dp(14)}}>位</Text>
                        </View>
                        <TextInput keyboardType='numeric' onChangeText={(text)=>{this.setState({bedNum:text})}} placeholder={'请填写床位号'} defaultValue={this.state.bedNum} style={[styles.flex,styles.input_style]}/>
                    </View>
                    <View style={styles.info_item_box}>
                        <Image
                            source={require('./../images/info_name_icon.png')}
                            style={{width:px2dp(17),height:px2dp(15)}}
                        />
                        <View style={styles.item_title}>
                            <Text style={{fontSize:px2dp(14)}}>姓</Text>
                            <Text style={{fontSize:px2dp(14)}}>名</Text>
                        </View>
                        <TextInput onChangeText={(text)=>{this.setState({name:text})}} placeholder={'请填写客户姓名'} defaultValue={this.state.name} style={[styles.flex,styles.input_style]}/>
                    </View>
                    <View style={styles.info_item_box}>
                        <Image
                            source={require('./../images/info_phone_icon.png')}
                            style={{width:px2dp(17),height:px2dp(15)}}
                        />
                        <View style={styles.item_title}>
                            <Text style={{fontSize:px2dp(14)}}>手</Text>
                            <Text style={{fontSize:px2dp(14)}}>机</Text>
                            <Text style={{fontSize:px2dp(14)}}>号</Text>
                        </View>
                        <TextInput keyboardType='numeric' onChangeText={(text)=>{this.setState({phone:text})}} editable={this.state.native=='normal'?true:false} placeholder={'请填写客户手机号'} defaultValue={this.state.phone} maxLength={11} style={[styles.flex,styles.input_style]}/>
                    </View>
                    <View style={styles.info_item_box}>
                        <Image
                            source={require('./../images/info_code_icon.png')}
                            style={{width:px2dp(17),height:px2dp(15)}}
                        />
                        <View style={styles.item_title}>
                            <Text style={{fontSize:px2dp(14)}}>身份证号</Text>
                        </View>
                        <TextInput keyboardType='numeric' onChangeText={(text)=>{this.setState({card:text})}} placeholder={'请填写客户身份证号'} defaultValue={this.state.card} maxLength={18} style={[styles.flex,styles.input_style]}/>
                    </View>
                    <View style={styles.info_item_box}>
                        <Image
                            source={require('./../images/info_birthday_icon.png')}
                            style={{width:px2dp(17),height:px2dp(15)}}
                        />
                        <View style={styles.item_title}>
                            <Text style={{fontSize:px2dp(14)}}>宝宝生日</Text>
                        </View>
                        <TouchableWithoutFeedback onPress={()=>{this.setState({dateShow:true})}}>
                            <View style={[styles.flex,styles.input_style]}>
                                <TextInput style={styles.input_font} placeholder={'请选择宝宝生日'} value={this.state.value} editable={false}/>
                                <Icon name="angle-down" size={25} color="#b2b2b2" style={styles.right_arrow} />
                            </View>
                        </TouchableWithoutFeedback>

                    </View>
                    <View style={{paddingHorizontal: px2dp(17),
                        marginTop: px2dp(25),
                        flexDirection: 'row',
                        justifyContent: 'space-between'}}>
                        <Image
                            source={require('./../images/info_sex_icon.png')}
                            style={{width:px2dp(17),height:px2dp(15),marginTop:px2dp(13)}}
                        />
                        <View style={styles.item_title}>
                            <Text style={{fontSize:px2dp(14),lineHeight:px2dp(40)}}>宝宝性别</Text>
                        </View>
                        <View style={{flex:1,flexWrap: 'wrap',flexDirection:'row',justifyContent:'space-between',marginLeft: px2dp(10)}}>
                            <TouchableWithoutFeedback onPress={()=>{
                                this.changBtn('male')
                            }}>
                                <View style={[this.state.sex_btn_on=='male'?styles.sex_btn_on:styles.sex_btn]}>
                                    <Text style={[styles.sex_font_style,this.state.sex_btn_on=='male'?styles.sex_font_on:'']}>男</Text>
                                </View>
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback onPress={()=>{
                                this.changBtn('female')
                            }}>
                                <View style={[this.state.sex_btn_on=='female'?styles.sex_btn_on:styles.sex_btn]}>
                                    <Text style={[styles.sex_font_style,this.state.sex_btn_on=='female'?styles.sex_font_on:'']}>女</Text>
                                </View>
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback onPress={()=>{
                                this.changBtn('twin')
                            }}>
                                <View style={[this.state.sex_btn_on=='twin'?styles.sex_btn_on:styles.sex_btn]}>
                                    <Text style={[styles.sex_font_style,this.state.sex_btn_on=='twin'?styles.sex_font_on:'']}>双胞胎</Text>
                                </View>
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback onPress={()=>{
                                this.changBtn('double')
                            }}>
                                <View style={[this.state.sex_btn_on=='double'?styles.sex_btn_on:styles.sex_btn]}>
                                    <Text style={[styles.sex_font_style,this.state.sex_btn_on=='double'?styles.sex_font_on:'']}>龙凤胎</Text>
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                    </View>
                <View style={{flexDirection:'row',justifyContent:'space-between',paddingHorizontal:px2dp(17)}}>
                    <TouchableWithoutFeedback onPress={()=>{this.props.navigation.goBack()}}>
                        <View style={styles.bottom_btn}>
                            <Text style={styles.bottom_btn_font}>返回第一步</Text>
                        </View>
                    </TouchableWithoutFeedback>
                    {
                        this.state.native=='normal'?(
                            <TouchableWithoutFeedback onPress={()=>NoDoublePress.onPress(()=>{this.createOrder(source)})}>
                                <View style={[styles.bottom_btn,styles.bottom_btn_on]}>
                                    <Text style={[styles.bottom_btn_font,styles.bottom_font_on]}>创建订单</Text>
                                </View>
                            </TouchableWithoutFeedback>
                        ):(
                            <TouchableWithoutFeedback onPress={()=>NoDoublePress.onPress(()=>{this.ensureOrder(source)})}>
                                <View style={[styles.bottom_btn,styles.bottom_btn_on]}>
                                    <Text style={[styles.bottom_btn_font,styles.bottom_font_on]}>确定客户信息</Text>
                                </View>
                            </TouchableWithoutFeedback>
                        )
                    }

                </View>
                </ScrollView>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={this.state.modalVisible}
                    onRequestClose={() => {
                        this.setState({
                            modalVisible: false
                        })
                    }}>
                    <View style={styles.modal_wrap}>
                        <View style={styles.success_wrap}>
                            <View style={{paddingHorizontal:px2dp(20),marginBottom: px2dp(25)}}>
                                <Text style={{fontSize:px2dp(16),textAlign:'center',lineHeight:px2dp(35)}}>该手机号已在{this.state.customer}名下，是否更改手机号？</Text>
                            </View>
                            <View style={styles.flex_space_between}>
                                <TouchableWithoutFeedback onPress={()=>{
                                    this.setState({
                                        modalVisible: false,
                                        customerId:''
                                    })
                                }}>
                                    <View style={styles.modal_btn}>
                                        <Text style={styles.modal_font}>是</Text>
                                    </View>
                                </TouchableWithoutFeedback>
                                <TouchableWithoutFeedback onPress={()=>{this.goNext(source)}}>
                                    <View style={[styles.modal_btn,styles.modal_btn_on]}>
                                        <Text style={[styles.modal_font,styles.modal_font_on]}>否</Text>
                                    </View>
                                </TouchableWithoutFeedback>
                            </View>
                        </View>
                    </View>
                </Modal>
                {
                    this.state.dateShow?(<Date getTime={this.getTime.bind(this)} show={this.state.dateShow} closeDate={this.closeDate.bind(this)} mode={'date'}/>):(null)
                }

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
    info_item_box:{
       paddingHorizontal: px2dp(17),
        marginTop: px2dp(25),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems:'center'
    },
    input_style:{
        backgroundColor:'#ffffff',
        height:px2dp(40),
        borderRadius:5,
        elevation:3,
        paddingLeft: px2dp(10),
        marginLeft: px2dp(10),
       color:'#333'
    },
    input_font:{
        fontSize:px2dp(15),
        color:'#333'
    },
    right_arrow:{
        position: 'absolute',
        right:px2dp(17),
        top:px2dp(8)
    },
    sex_btn:{
       width:px2dp(111),
       height:px2dp(40),
        elevation:3,
        backgroundColor:'#ffffff',
        borderRadius: 5,
        marginBottom: px2dp(15)
    },
    item_title:{
        width:px2dp(57),
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal:px2dp(10)
    },
    sex_btn_on:{
        width:px2dp(111),
        height:px2dp(40),
        elevation:3,
        borderRadius: 5,
        marginBottom: px2dp(15),
       backgroundColor:'#64bdf9'
    },
    sex_font_style:{
        fontSize:px2dp(14),
        textAlign: 'center',
        lineHeight:px2dp(40),
        color:'#b2b2b2'
    },
    sex_font_on:{
        color:'#ffffff'
    },
    bottom_btn:{
       width:px2dp(158),
        height:px2dp(43),
        elevation:3,
        backgroundColor:'#ffffff',
        borderRadius:5,
        marginTop:px2dp(60),
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
    modal_wrap:{
        flex:1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center'
    },
    success_wrap:{
        width:px2dp(280),
        height:px2dp(200),
        borderRadius:px2dp(5),
        backgroundColor:'#fff',
        paddingTop: px2dp(30),
        paddingHorizontal:px2dp(17)
    },
    modal_btn:{
        width:px2dp(117),
        height:px2dp(40),
        elevation:3,
        backgroundColor:'#fff',
        borderRadius:px2dp(5)
    },
    modal_font:{
        textAlign: 'center',
        lineHeight: px2dp(40),
        color:'#64bdf9'
    },
    modal_btn_on:{
        backgroundColor:'#64bdf9'
    },
    modal_font_on:{
        color:'#fff'
    }
});