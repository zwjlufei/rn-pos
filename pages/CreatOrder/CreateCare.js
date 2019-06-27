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
import SelectStaff from './../CommonModules/SelectStaff';
import DatePicker from "../datePicker/calendar";
import OtherBtn from "../CommonModules/OtherBtn";
import {dataReset, feach_request, getStorage, timeTransform, Toast} from './../tools/Public';
import SelectEmploye from './../CommonModules/SelectEmploye';
import NoDoublePress from "../tools/NoDoublePress";
export default class CreateCare extends Component{
    static navigationOptions = {
        header: null
    };
    constructor(props){
        super(props);
        this.state = {
            sever_time:'3',//服务时长
            other_time:'其他',
            value:'',//开始时间
            dateShow:false,
            show:false,
            price:'400',
            name:'',//员工姓名
            contractsId:'',
            userInfo:'',
            employee:'',
            employeeId:'',
            employeeArr:[],
            waiterId:''
        }
    }
    componentWillMount(){
        getStorage('userInfo')
            .then(data=>{
                this.setState({
                    userInfo:data
                })
            }).catch(err=>{
            console.log(err)
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
    //其他按钮值改变
    changeDay(day){
        if(day){
            this.setState({
                sever_time:day,
                other_time:day,
                show:false
            })
        }else {
            this.setState({
                show:false
            })
        }
    }
    //获取员工姓名
    getName(name,id){
        this.setState({
            name:name,
            waiterId:id
        })

    }
    //获取出单人
    getEmployee(name,id){
        this.setState({
            employee:name,
            employeeId:id
        })
    }
    //服务时长按钮切换
    changServerBtn(msg){
        if(msg!=='3' && msg!=='5'){
            this.setState({
                show:true
            })
        }else {
            this.setState({
                show:false
            })
        }
        this.setState({
            sever_time:msg
        })
    }
    //数据验证
    checkData(){
        if(!this.state.value){
            Toast('请将信息填写完整～');
            return false;
        }
        if(!this.state.waiterId){
            Toast('请确保服务员姓名的准确性和唯一性');
            return false;
        }
        if(!this.state.employeeId){
            Toast('请确保出单人的准确性和唯一性～');
            return false;
        }
        if(this.state.sever_time=='其他'){
            Toast('请选择服务时长～');
            return false;
        }
        return true;
    }
    //创建订单
    createOrder(){
        const newTime=timeTransform(this.state.value,'day',this.state.sever_time);
        const customerId= this.props.navigation.state.params.customerId;
        var data={
            contracts_id:this.state.contractsId,
            start_datetime:this.state.value+':00',
            end_datetime:newTime,
            waiter_id:this.state.waiterId,
            ph_price:this.state.price,
            ph_days:this.state.sever_time,
            customer_id:customerId,
            sign_user:this.state.employeeId,
            type:'ph',
            token:this.state.userInfo.token
        };
        // token:this.state.userInfo.token
        data = dataReset(data);
        if(this.checkData()){
            feach_request('/pos_create_order','POST',data,this.props.navigation)
                .then((data)=>{
                    if(data.status==0){
                        this.setState({
                            contractsId:data.data.order.contracts_id
                        });
                        this.props.navigation.navigate('CareInfo',{info:data.data.order});
                    }

                })
                .catch((err)=>{
                    console.log(err);
                    Toast('出现未知错误，信息无法提交～');
                })
        }
    }
    //服务单价
    getPrice(text){
        const newText = text.replace(/[^\d]+/, '');
        this.setState({
            price:newText
        })
    }
    render(){
        const { navigate } = this.props.navigation;
        return(
            <View style={{width:width,height:height,backgroundColor: '#fcfcfc'}}>
                <Header title={'陪护单信息'} navigate={this.props.navigation}/>
                <ScrollView>
                <View style={{flex:1,flexDirection:'column',justifyContent:'space-between'}}>
                    <View style={{paddingHorizontal: px2dp(17)}}>
                        <View style={[styles.flex_space_between,styles.item_gap]}>
                            <Text style={{fontSize: px2dp(14)}}>开始时间</Text>
                            <TouchableWithoutFeedback onPress={()=>{this.setState({dateShow:true})}}>
                                <View style={[styles.flex,styles.input_style]}>
                                    <TextInput style={styles.input_font} value={this.state.value} placeholder={'请选择开始时间'} editable={false}/>
                                    <Icon name="angle-down" size={25} color="#b2b2b2" style={styles.right_arrow} />
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                        {/*<View style={[styles.flex_space_between,styles.item_gap]}>*/}
                            {/*<Text style={{fontSize: px2dp(14)}}>服务员工</Text>*/}
                            <SelectStaff navigation={this.props.navigation} getName={this.getName.bind(this)} />
                        {/*</View>*/}
                        <View style={[styles.flex_space_between,styles.item_gap]}>
                            <Text style={{fontSize: px2dp(14)}}>服务单价</Text>
                            <TextInput keyboardType={'numeric'} onChangeText={(text)=>{this.getPrice(text)}} style={[styles.input_font,styles.flex,styles.input_style]} placeholder={'400'}/>
                        </View>
                        <SelectEmploye navigation={this.props.navigation} getName={this.getEmployee.bind(this)} />
                        <View style={styles.item_gap}>
                            <Text style={{fontSize: px2dp(14)}}>服务时长</Text>
                            <View style={[styles.flex_space_between,styles.title_item_gap]}>
                                <TouchableWithoutFeedback onPress={()=>{
                                    this.changServerBtn('3')
                                }}>
                                    <View style={[this.state.sever_time=='3'?styles.sex_btn_on:styles.sex_btn]}>
                                        <Text style={[styles.sex_font_style,this.state.sever_time=='3'?styles.sex_font_on:'']}>3天</Text>
                                    </View>
                                </TouchableWithoutFeedback>
                                <TouchableWithoutFeedback onPress={()=>{
                                    this.changServerBtn('5')
                                }}>
                                    <View style={[this.state.sever_time=='5'?styles.sex_btn_on:styles.sex_btn]}>
                                        <Text style={[styles.sex_font_style,this.state.sever_time=='5'?styles.sex_font_on:'']}>5天</Text>
                                    </View>
                                </TouchableWithoutFeedback>
                                <TouchableWithoutFeedback onPress={()=>{
                                    this.changServerBtn(this.state.other_time)
                                }}>
                                    <View style={[this.state.sever_time==this.state.other_time?styles.sex_btn_on:styles.sex_btn]}>
                                        <Text style={[styles.sex_font_style,this.state.sever_time==this.state.other_time?styles.sex_font_on:'']}>{this.state.other_time}{this.state.other_time=='其他'?'':'天'}</Text>
                                    </View>
                                </TouchableWithoutFeedback>
                            </View>
                            {
                                this.state.show?(
                                    <OtherBtn type={'care'} show={this.state.show} changeDay={this.changeDay.bind(this)} />
                                ):(null)
                            }
                        </View>
                    </View>
                    <View style={{flexDirection:'row',justifyContent:'space-between',marginBottom:px2dp(25),
                    paddingHorizontal:px2dp(17)}}>
                        <TouchableWithoutFeedback onPress={()=>{
                            this.props.navigation.goBack();
                        }}>
                            <View style={styles.bottom_btn}>
                                <Text style={styles.bottom_btn_font}>返回第一步</Text>
                            </View>
                        </TouchableWithoutFeedback>

                        <TouchableWithoutFeedback onPress={()=>NoDoublePress.onPress(()=>{this.createOrder()})}>
                            <View style={[styles.bottom_btn,styles.bottom_btn_on]}>
                                <Text style={[styles.bottom_btn_font,styles.bottom_font_on]}>生成订单</Text>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </View>
                </ScrollView>

                {
                    this.state.dateShow?(<DatePicker getTime={this.getTime.bind(this)} show={this.state.dateShow} closeDate={this.closeDate.bind(this)} mode={'datetime'}/>):(null)
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
    item_gap:{
        marginTop:px2dp(24)
    },
    title_item_gap:{
        marginTop:px2dp(18)
    },
    padding_right:{
        paddingRight: px2dp(23)
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
        marginLeft: px2dp(18)
    },
    sex_btn:{
        width:px2dp(105),
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
        marginTop:px2dp(45),
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
    right_arrow:{
        position: 'absolute',
        right:px2dp(17),
        top:px2dp(8)
    },
    site:{
        width:px2dp(116),
        height:px2dp(40),
        backgroundColor:'#ffffff',
        elevation:3,
        borderRadius:5
    },
    site_font:{
        fontSize:px2dp(16),
        color:'#b2b2b2',
        lineHeight:px2dp(40),
        paddingLeft: px2dp(17)
    },
    multi_line_input:{
        flex:1,
        height:px2dp(70),
        borderRadius:px2dp(10),
        elevation:3,
        backgroundColor:'#ffffff',
        paddingLeft:px2dp(17)
    },
    input_font:{
        fontSize:px2dp(15),
        color:'#333'
    }
});