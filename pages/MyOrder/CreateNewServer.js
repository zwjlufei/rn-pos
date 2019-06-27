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
import DatePicker from "../datePicker/calendar";
import SelectStaff from "../CommonModules/SelectStaff";
import {compareTime, dataReset, feach_request, getStorage, timeTransform, Toast} from "../tools/Public";
import SelectEmploye from "../CommonModules/SelectEmploye";
import OtherBtn from "../CommonModules/OtherBtn";
export default class CreateNewServer extends Component{
    static navigationOptions = {
        header: null
    };
    constructor(props){
        super(props);
        this.state = {
            value:'',
            dateShow:false,
            name:'',
            birthDown:false,
            isWork:'',
            serverCount:0,
            source:'start',
            userInfo:'',
            toCustomer:'no',
            workDay:'',
            startTime:''
        }
    }
    componentWillMount(){
        const info =  this.props.navigation.state.params.info;
        this.setState({
            info:info,
            startTime:info.start_datetime
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
    //获取时间
    getTime(time){
        if(this.state.source=='start'){
            this.setState({
                value:time
            })
        }else {
            this.setState({
                endTime:time
            })
        }

    }
    //时间选择器
    closeDate(show){
        this.setState({
            dateShow:show
        })
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
    //是否上户
    changeBirth(type,state){
        this.setState({
            isWork:type,
            birthDown:false,
            toCustomer:state
        })
    }
    //核算数据
    checkData(source){

        if(source=='care'){
            if(!this.state.waiterId){
                Toast('请确保服务员姓名的准确性和唯一性');
                return false;
            }
            const compare = compareTime(this.state.info.end_datetime,this.state.startTime);
            if(!compare){
                Toast('开始时间不能超过合同的结束时间哦');
                return false;
            }
        }else {
            if(!this.state.value||!this.state.endTime){
                Toast('请确保信息的完整性');
                return false;
            }
            if(!this.state.employeeId){
                Toast('请确保员工姓名的准确性和唯一性');
                return false;
            }
        }
        return true;
    }
    //数据提交
    submitData(){
        //this.state.toCustomer
        const source = this.props.navigation.state.params.source;
        if(source=='care'){
            var data={
                contracts_id:this.state.info.contracts_id,
                waiter_id:this.state.waiterId,
                start_datetime:this.state.startTime,
                token:this.state.userInfo.token
            };
        }else {
            var data={
                contracts_id:this.state.info.contracts_id,
                employee_id:this.state.employeeId,
                start_datetime:this.state.value+':00',
                end_datetime:this.state.endTime+':00',
                to_customer:this.state.toCustomer,
                token:this.state.userInfo.token
            };
        }
        data = dataReset(data);
        if(this.checkData(source)){
            feach_request('/pos_cr_service_record','POST',data,this.props.navigation)
                .then((data)=>{
                    if(data.status==0){
                        Toast('创建成功～');
                        this.props.navigation.goBack( );
                    }
                })
                .catch((err)=>{
                    console.log(err);
                    Toast('出现未知错误，信息无法提交～');
                })
        }

    }
    //获取开始时间
    getStartTime(day){
        if(day){
            const newTime=timeTransform(this.state.info.start_datetime,'day',day);
            this.setState({
                workDay:day.toString(),
                show:false,
                startTime:newTime
            });
        }else {
            this.setState({
                show:false
            });
        }
    }
    render(){
        const { navigate } = this.props.navigation;
        const source = this.props.navigation.state.params.source;
        return(
            <View style={{flex:1,backgroundColor: '#fcfcfc'}}>
                <Header title={'创建服务记录'} navigate={this.props.navigation}/>
                <View style={styles.flex}>
                    <View style={{height:px2dp(510)}}>
                        {
                            source=='care'?(
                                <View>
                                    <View style={[styles.flex_space_between,styles.item_style]}>
                                        <Text style={styles.item_title}>已服务时长</Text>
                                        <TouchableWithoutFeedback onPress={()=>{
                                            this.setState({
                                                show:true
                                            })
                                        }}>
                                            <View style={[styles.flex,styles.input_style]}>
                                                <TextInput value={this.state.workDay} style={[styles.input_font]} placeholder={'请选择合同已服务时长'} editable={false}/>
                                                <Icon name="angle-down" size={25} color="#b2b2b2" style={styles.right_arrow} />
                                            </View>
                                        </TouchableWithoutFeedback>
                                    </View>
                                    {
                                        this.state.show?(
                                            <OtherBtn type={'care'} show={this.state.show} changeDay={this.getStartTime.bind(this)} />
                                        ):(null)
                                    }
                                    <View style={[styles.flex_space_between,styles.item_style]}>
                                        <Text style={styles.item_title}>开始时间:</Text>
                                        <Text style={styles.item_content}>{this.state.startTime}</Text>
                                    </View>
                                </View>
                                ):(
                                <View style={[styles.flex_space_between,styles.item_style]}>
                                    <Text style={styles.item_title}>开始时间</Text>
                                    <TouchableWithoutFeedback onPress={()=>{this.setState({dateShow:true,source:'start'})}}>
                                        <View style={[styles.flex,styles.input_style]}>
                                            <TextInput style={styles.input_font} value={this.state.value} placeholder={'请选择开始时间'} editable={false}/>
                                            <Icon name="angle-down" size={25} color="#b2b2b2" style={styles.right_arrow} />
                                        </View>
                                    </TouchableWithoutFeedback>
                                </View>
                            )
                        }

                        {
                            source=='care'?(null):(
                                <View style={[styles.flex_space_between,styles.item_style]}>
                                    <Text style={styles.item_title}>结束时间</Text>
                                    <TouchableWithoutFeedback onPress={()=>{this.setState({dateShow:true,source:'end'})}}>
                                        <View style={[styles.flex,styles.input_style]}>
                                            <TextInput style={styles.input_font} value={this.state.endTime} placeholder={'请选择结束时间'} editable={false}/>
                                            <Icon name="angle-down" size={25} color="#b2b2b2" style={styles.right_arrow} />
                                        </View>
                                    </TouchableWithoutFeedback>
                                </View>
                            )
                        }
                        {
                            source=='care'?(
                                <View style={{paddingHorizontal: px2dp(17)}}>
                                    <SelectStaff navigation={this.props.navigation} source={'care'} getName={this.getName.bind(this)}/>
                                </View>
                            ):(
                                <View style={{paddingHorizontal: px2dp(17)}}>
                                    <SelectEmploye navigation={this.props.navigation} title={'服务员工'} waiter={'请选择服务员工'} getName={this.getEmployee.bind(this)}/>
                                </View>
                            )
                        }

                        {
                            this.state.info.order_type=='ph' || this.state.info.cr_customers_remaining==0?(null):(
                                <View style={[styles.flex_space_between,styles.item_style,styles.down_wrap]}>
                                    <Text style={{fontSize: px2dp(14)}}>是否上户</Text>
                                    <View style={[styles.flex]}>
                                        <TouchableWithoutFeedback onPress={()=>{this.setState({birthDown: !this.state.birthDown})}}>
                                            <View style={[styles.flex,styles.input_style]}>
                                                <TextInput style={styles.input_font} value={this.state.isWork} placeholder={'请选择是否上户'} editable={false}/>
                                                <Icon name="angle-down" size={25} color="#b2b2b2" style={styles.right_arrow} />
                                            </View>
                                        </TouchableWithoutFeedback>
                                        {
                                            this.state.birthDown?( <View style={styles.down_box}>
                                                <View style={{flex:1}}>
                                                    <TouchableNativeFeedback onPress={()=>{this.changeBirth('是','yes')}}>
                                                        <View style={{height:px2dp(40)}}>
                                                            <Text style={styles.down_font}>是</Text>
                                                        </View>
                                                    </TouchableNativeFeedback>
                                                    <TouchableNativeFeedback onPress={()=>{this.changeBirth('否','no')}}>
                                                        <View style={{height:px2dp(40)}}>
                                                            <Text style={styles.down_font}>否</Text>
                                                        </View>
                                                    </TouchableNativeFeedback>
                                                </View>
                                            </View>):(null)
                                        }
                                    </View>
                                </View>
                            )
                        }
                    </View>
                    <TouchableWithoutFeedback onPress={()=>{this.submitData()}}>
                        <View style={styles.editor_btn}>
                            <Text style={styles.editor_btn_font}>确认</Text>
                        </View>
                    </TouchableWithoutFeedback>
                </View>

                {
                    this.state.dateShow?(<DatePicker getTime={this.getTime.bind(this)} show={this.state.dateShow} closeDate={this.closeDate.bind(this)} mode={'datetime'}/>):(null)
                }
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
    item_title:{
        fontSize:px2dp(14)
    },
    item_style:{
        paddingHorizontal: px2dp(17),
        height:px2dp(53),
        marginTop: px2dp(17)
    },
    blue_color:{
        color:'#64bdf9'
    },
    editor_btn:{
        height:px2dp(45),
        elevation:3,
        backgroundColor:'#ffffff',
        borderRadius: px2dp(10),
        marginHorizontal: px2dp(17),
        marginTop: px2dp(10),
        marginBottom: px2dp(25)
    },
    editor_btn_font:{
        fontSize:px2dp(16),
        color:'#64bdf9',
        textAlign: 'center',
        lineHeight: px2dp(45)
    },
    input_style:{
        backgroundColor:'#ffffff',
        height:px2dp(40),
        borderRadius:5,
        elevation:3,
        paddingLeft: px2dp(10),
        flex:3,
        marginLeft: px2dp(17)
    },
    right_arrow:{
        position: 'absolute',
        right:px2dp(17),
        top:px2dp(8)
    },
    input_font:{
        fontSize:px2dp(15)
    },
    down_box:{
        width:px2dp(267),
        height:px2dp(100),
        paddingVertical: px2dp(10),
        backgroundColor:'#ffffff',
        elevation:4,
        position: 'absolute',
        left:px2dp(17),
        top:px2dp(38),
        borderBottomRightRadius:px2dp(5),
        borderBottomLeftRadius:px2dp(5)
    },
    down_font:{
        color:'#b2b2b2',
        fontSize: px2dp(14),
        textAlign:'center',
        lineHeight: px2dp(40)
    },
    server_down_height:{
        height:px2dp(180)
    },
    down_wrap:{
        height:px2dp(40)
    },
    item_content:{
        flex:2,
        fontSize:px2dp(14),
        color:'#000',
        marginLeft: px2dp(18)
    }
});