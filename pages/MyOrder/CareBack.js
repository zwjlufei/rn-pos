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
    ToastAndroid,
    ScrollView, TouchableNativeFeedback, Modal, DeviceEventEmitter
} from 'react-native';
var {width,height} = Dimensions.get('window');
import px2dp from './../tools/px2dp';
import Header from "./../CommonModules/Header";
import Icon from "react-native-vector-icons/FontAwesome";
import {dataReset, feach_request, getStorage, timeTransform, Toast} from "../tools/Public";
import OtherBtn from "../CommonModules/OtherBtn";
export default class CareBack extends Component{
    static navigationOptions = {
        header: null
    };
    constructor(props){
        super(props);
        this.state = {
            isWork:true,
            reason:'',
            reasonShow:false,
            endTime:'',
            modalVisible:false,
            startTime:'',
            relaxDay:0,
            workDay:'',
            checkInfo:true,
            userInfo: '',
            info:'',
            compute:'1',
            description:'',
            phSalary:[],
            show:false
        }
    }
    componentWillMount(){
        const info=this.props.navigation.state.params.info;
        getStorage('userInfo')
            .then(data=>{
                this.setState({
                    userInfo:data,
                    info:info,
                    endTime:info.end_datetime
                })
            }).catch(err=>{
            console.log(err)
        })

    }
    //获取时间
    getEndTime(day){
        if(day){
            const newTime=timeTransform(this.state.info.start_datetime,'day',day);
            this.setState({
                workDay:day.toString(),
                show:false,
                endTime:newTime
            });
        }else {
            this.setState({
                show:false
            });
        }
        // 提交数据时要保证下户时间不能等于小于上户时间
    }
    //时间选择器
    closeDate(show){
        this.setState({
            dateShow:show
        })
    }
    //退单原因选择
    changeReason(reason,msg){
        this.setState({
            reasons:reason,
            reason:msg,
            reasonShow:false
        })
    }
    //数据检测
    checkData(){
        if (this.state.reasons==''){
            Toast('请选择退单原因～')
            return false;
        }
        if (this.state.description==''){
            Toast('请输入退单原因～')
            return false;
        }
        if (this.state.endTime==''){
            Toast('请选择结束时间～')
            return false;
        }
        return true;
    }
    //信息提交
    submitInfo(compute){
        var data={
            contracts_id:this.state.info.contracts_id,
            order_id:this.state.info.order_id,
            reason:this.state.reasons,
            description :this.state.description,
            compute:compute,
            user_name:this.state.userInfo.name,
            end_datetime:this.state.endTime,
            token:this.state.userInfo.token
        };
        data = dataReset(data);
        if(this.checkData()){
            feach_request('/pos_contracts_charge_back','POST',data,this.props.navigation)
                .then((data)=>{
                    if(data.status==0){
                        if(data.data.error=="end_datetime error"){
                            this.setState({
                                endTime:data.data.right_time
                            })
                            Toast(`结束时间不超过${data.data.right_time}`)
                        }else {
                            this.setState({
                                refund:data.data.refund_amount,
                                phSalary:data.data.ph_salary
                            })
                            if(compute=='1'){
                                this.setState({
                                    modalVisible: true
                                })
                            }else {
                                this.setState({
                                    checkInfo:false
                                })
                            }
                        }
                    }
                })
                .catch((err)=>{
                    console.log(err);
                    Toast('未知错误，请稍后再试～');
                })
        }
    }
    render(){
        const { navigate } = this.props.navigation;
        return(
            <View style={{flex:1,backgroundColor: '#fcfcfc'}}>
                <Header title={'陪护退单'} navigate={this.props.navigation}/>
                <ScrollView style={styles.flex}>
                    <View style={[styles.flex_space_between,styles.item_style,styles.top_gap]}>
                        <Text style={styles.item_title}>退单原因:</Text>
                        <View style={{flex:2}}>
                            <TouchableWithoutFeedback onPress={()=>{
                                this.setState({
                                    reasonShow:!this.state.reasonShow
                                })
                            }}>
                                <View>
                                    <TextInput value={this.state.reason} style={[styles.input_font,styles.input_style]} placeholder={'请选择退单原因'} editable={false}/>
                                    <Icon name="angle-down" size={25} color="#b2b2b2" style={styles.right_arrow} />
                                </View>
                            </TouchableWithoutFeedback>
                            {
                                this.state.reasonShow?(
                                    <View style={styles.down_box}>
                                        <View style={{flex:1}}>
                                            <TouchableNativeFeedback onPress={()=>{
                                                this.changeReason('customer','客户原因')
                                            }}>
                                                <View style={{height:px2dp(40)}}>
                                                    <Text style={styles.down_font}>客户原因</Text>
                                                </View>
                                            </TouchableNativeFeedback>
                                            <TouchableNativeFeedback onPress={()=>{
                                                this.changeReason('waiter','服务员原因')
                                            }}>
                                                <View style={{height:px2dp(40)}}>
                                                    <Text style={styles.down_font}>服务员原因</Text>
                                                </View>
                                            </TouchableNativeFeedback>
                                            <TouchableNativeFeedback onPress={()=>{
                                                this.changeReason('company','公司原因')
                                            }}>
                                                <View style={{height:px2dp(40)}}>
                                                    <Text style={styles.down_font}>公司原因</Text>
                                                </View>
                                            </TouchableNativeFeedback>
                                        </View>
                                    </View>
                                ):(null)
                            }

                        </View>
                    </View>
                    <View style={styles.flex}>
                        <TextInput multiline={true} onChangeText={(text)=>{this.setState({description:text})}}  style={styles.reason_wrap} placeholder={'请输入退单原因...'}/>
                    </View>
                    <View>
                        <View style={{paddingBottom: px2dp(17)}}>
                            <View style={[styles.flex_space_between,styles.item_style]}>
                                <Text style={styles.item_title}>陪护单价:</Text>
                                <Text style={styles.item_content}>{this.state.info.ph_price}元</Text>
                            </View>
                            <View style={[styles.flex_space_between,styles.item_style]}>
                                <Text style={styles.item_title}>上户时间:</Text>
                                <Text style={styles.item_content}>{this.state.info.start_datetime}</Text>
                            </View>
                            <View style={[styles.flex_space_between,styles.item_style]}>
                                <Text style={styles.item_title}>服务时长:</Text>
                                <TouchableWithoutFeedback onPress={()=>{
                                    this.setState({
                                        show:true
                                    })
                                }}>
                                    <View style={[styles.flex,styles.input_style]}>
                                        <TextInput value={this.state.workDay} style={[styles.input_font]} placeholder={'请选择实际服务时长'} editable={false}/>
                                        <Icon name="angle-down" size={25} color="#b2b2b2" style={styles.right_arrow} />
                                    </View>
                                </TouchableWithoutFeedback>
                            </View>
                            {
                                this.state.show?(
                                    <OtherBtn type={'care'} show={this.state.show} changeDay={this.getEndTime.bind(this)} />
                                ):(null)
                            }
                            <View style={[styles.flex_space_between,styles.item_style]}>
                                <Text style={styles.item_title}>结束时间:</Text>
                                <Text style={styles.item_content}>{this.state.endTime}</Text>
                            </View>
                        </View>
                    </View>
                </ScrollView>
                <TouchableNativeFeedback onPress={()=>{this.submitInfo('1')}}>
                    <View style={styles.editor_btn}>
                        <Text style={styles.editor_btn_font}>提交审核</Text>
                    </View>
                </TouchableNativeFeedback>
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
                        {
                            this.state.checkInfo?(
                                <View style={styles.success_wrap}>
                                    <View style={{height:px2dp(130)}}>
                                        <Text style={{textAlign:'center',fontSize:px2dp(18),marginBottom: px2dp(10),marginTop:-px2dp(10)}}>信息核对</Text>
                                        {
                                            this.state.phSalary.length==0?(
                                                <Text style={{textAlign:'center',fontSize:px2dp(15),color:'#a3a3a3',marginBottom:px2dp(10)}}>陪护工资：0元</Text>
                                            ):(
                                                this.state.phSalary.map((item,index)=>{
                                                    return(
                                                        <Text key={index} style={{textAlign:'center',fontSize:px2dp(15),color:'#a3a3a3',marginBottom:px2dp(5)}}>{item.name}：{item.salary}元</Text>
                                                    )
                                                })
                                            )
                                        }
                                        <Text style={{textAlign:'center',fontSize:px2dp(15),color:'#a3a3a3'}}>客户退还：{this.state.refund}元</Text>
                                    </View>

                                    <View style={styles.flex_space_between}>
                                        <TouchableWithoutFeedback onPress={()=>{
                                            this.setState({
                                                modalVisible: false
                                            })
                                        }}>
                                            <View style={[styles.modal_btn,styles.modal_btn_left,styles.mt_30,styles.flex]}>
                                                <Text style={{color:'#64bdf9',textAlign:'center',lineHeight:px2dp(40),fontSize:px2dp(16)}}>修改</Text>
                                            </View>
                                        </TouchableWithoutFeedback>
                                        <TouchableWithoutFeedback onPress={()=>{this.submitInfo('0')}}>
                                            <View style={[styles.modal_btn,styles.mt_30,styles.flex]}>
                                                <Text style={{color:'#fff',textAlign:'center',lineHeight:px2dp(40),fontSize:px2dp(16)}}>确定</Text>
                                            </View>
                                        </TouchableWithoutFeedback>
                                    </View>
                                </View>
                            ):(
                                <View style={styles.success_wrap}>
                                    <Text style={{textAlign:'center',fontSize:px2dp(18),marginBottom: px2dp(20)}}>已提交</Text>
                                    <Text style={{textAlign:'center',fontSize:px2dp(15),color:'#a3a3a3'}}>审核信息将交由财务操作！</Text>
                                    <TouchableWithoutFeedback onPress={()=>{navigate('CareOrderInfo')}}>
                                        <View style={styles.modal_btn}>
                                            <Text style={{color:'#fff',textAlign:'center',lineHeight:px2dp(40),fontSize:px2dp(16)}}>确定</Text>
                                        </View>
                                    </TouchableWithoutFeedback>
                                </View>
                            )
                        }

                    </View>
                </Modal>
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
        flex:1,
        fontSize:px2dp(14)
    },
    item_content:{
        flex:2,
        fontSize:px2dp(14),
        color:'#000'
    },
    item_style:{
        paddingHorizontal: px2dp(17),
        marginVertical: px2dp(13)
    },
    padding_gap:{
        paddingHorizontal: px2dp(17),
        height:px2dp(79)
    },
    editor_btn:{
        height:px2dp(45),
        elevation:3,
        borderRadius: px2dp(10),
        marginHorizontal: px2dp(17),
        backgroundColor:'#fff',
        marginBottom: px2dp(25)
    },
    editor_btn_font:{
        fontSize:px2dp(16),
        color:'#64bdf9',
        textAlign: 'center',
        lineHeight: px2dp(45)
    },
    input_style:{
        borderRadius:5,
        elevation:2,
        paddingLeft: px2dp(10),
        flex:2,
        height:px2dp(40)
    },
    right_arrow:{
        position: 'absolute',
        right:px2dp(17),
        top:px2dp(8)
    },
    input_font:{
        fontSize:px2dp(15),
        color:'#333'
    },
    module_gap:{
        height:px2dp(5),
        backgroundColor:'#efefef'
    },
    reason_wrap:{
        fontSize:px2dp(15),
        height:px2dp(125),
        borderRadius:5,
        elevation:2,
        marginHorizontal: px2dp(17),
        marginVertical: px2dp(15),
        padding: px2dp(10),
        textAlignVertical: 'top'
    },
    top_gap:{
        marginTop:px2dp(10)
    },
    item_gap:{
        marginTop:px2dp(10)
    },
    new_item_style:{
        paddingHorizontal: px2dp(17),
        height:px2dp(40)
    },
    down_box:{
        width:px2dp(226),
        height:px2dp(130),
        backgroundColor:'#fff',
        position: 'absolute',
        left:0,
        top:px2dp(38),
        elevation:4,
        zIndex:10000,
        borderBottomLeftRadius:px2dp(5),
        borderBottomRightRadius:px2dp(5)
    },
    down_font:{
        color:'#b2b2b2',
        fontSize: px2dp(14),
        textAlign:'center',
        lineHeight: px2dp(40)
    },
    modal_wrap:{
        flex:1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center'
    },
    success_wrap:{
        width:px2dp(240),
        height:px2dp(230),
        borderRadius:px2dp(5),
        backgroundColor:'#fff',
        paddingTop: px2dp(35)
    },
    modal_btn:{
        height:px2dp(40),
        borderRadius:px2dp(5),
        backgroundColor:'#64bdf9',
        marginHorizontal:px2dp(17),
        marginTop:px2dp(35),
        elevation:3
    },
    mt_30:{
        marginTop:px2dp(10)
    },
    modal_btn_left:{
        backgroundColor:'#fff',
    }
});