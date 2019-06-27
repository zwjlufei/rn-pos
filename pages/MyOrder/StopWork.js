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
    ScrollView, Modal, DeviceEventEmitter
} from 'react-native';
var {width,height} = Dimensions.get('window');
import px2dp from './../tools/px2dp';
import Header from "./../CommonModules/Header";
import {compareTime, dataReset, feach_request, getStorage, timeTransform, Toast} from "../tools/Public";
export default class StopWork extends Component{
    static navigationOptions = {
        header: null
    };
    constructor(props){
        super(props);
        this.state = {
            relaxDay:'0',
            userInfo: '',
            info:'',
            endTime:'',
            modalVisible: false,
            price:''
        }
    }
    componentWillMount(){
        const info=this.props.navigation.state.params.info;
        const newTime=timeTransform(info.start_datetime,'day',info.days);
        this.setState({
            info:info,
            endTime:newTime
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
//调休天数
    getRelaxDay(text){
        const newText = text.replace(/[^\d.]/g,'');
        this.setState({
            relaxDay:newText
        });
        const days=Number(this.state.info.days)+Number(newText);
        const newTime=timeTransform(this.state.info.start_datetime,'day',days);
        this.setState({
            endTime:newTime
        })
    }
    //核算数据
    checkData(){
        const date=new Date();
        const nowDate=date.getFullYear() + '-' + Number(date.getMonth() + 1) + '-' + Number(date.getDate());
        const endDate=this.state.endTime.substring(0,10);
        const compare = compareTime(endDate,nowDate);
        if(this.state.relaxDay==''){
            Toast('调休天数不能为空～');
            return false;
        }
        if(compare){
            Toast('还没有到下户时间哦～');
            return false;
        }
        return true;
    }
    //下户按钮
    stopWork(){
        var data={
            contracts_id:this.state.info.contracts_id,
            change_days:this.state.relaxDay,
            token:this.state.userInfo.token
        };
        data = dataReset(data);
        if(this.checkData()){
            feach_request('/pos_start_service','POST',data,this.props.navigation)
                .then((data)=>{
                    if(data.status==0){
                        this.setState({
                            modalVisible: true,
                            price:data.data.salary
                        })
                    }else {
                        Toast('下户未成功，请稍后再试～')
                    }
                })
                .catch((err)=>{
                    console.log(err);
                    Toast('出现未知错误，信息无法提交～');
                })
        }
    }
    render(){
        const { navigate } = this.props.navigation;
        return(
            <View style={{flex:1,backgroundColor: '#fcfcfc'}}>
                <Header title={'下户'} navigate={this.props.navigation}/>
                <ScrollView style={styles.flex}>
                    <View style={[styles.flex_space_between,styles.item_style]}>
                        <Text style={styles.item_title}>订单号:</Text>
                        <Text style={styles.item_content}>{this.state.info.order_id}</Text>
                    </View>
                    <View style={[styles.flex_space_between,styles.item_style]}>
                        <Text style={styles.item_title}>上户时间:</Text>
                        <Text style={styles.item_content}>{this.state.info.start_datetime}</Text>
                    </View>
                    <View style={[styles.flex_space_between,styles.item_style]}>
                        <Text style={styles.item_title}>订单天数:</Text>
                        <Text style={styles.item_content}>{this.state.info.days}天</Text>
                    </View>
                    <View style={[styles.flex_space_between,styles.item_style,styles.item_gap]}>
                        <Text style={styles.item_title}>调休天数:</Text>
                        <View style={styles.input_style}>
                            <TextInput keyboardType='numeric' style={styles.input_font} onChangeText={(text)=>{this.getRelaxDay(text)}} defaultValue={this.state.relaxDay}/>
                        </View>
                    </View>
                    <View style={[styles.flex_space_between,styles.item_style]}>
                        <Text style={styles.item_title}>下户时间:</Text>
                        <Text style={styles.item_content}>{this.state.endTime}</Text>
                    </View>
                    {/*<View style={[styles.flex_space_between,styles.padding_gap]}>*/}
                        {/*<Text style={{fontSize:px2dp(14)}}>系统计算服务员工提成</Text>*/}
                        {/*<View style={styles.money_wrap}>*/}
                            {/*<Image*/}
                                {/*source={require('./../../images/money_symbol.png')}*/}
                                {/*style={{width:px2dp(30),height:px2dp(30)}}*/}
                            {/*/>*/}
                            {/*<Text style={{fontSize:px2dp(25),color: '#64bdf9'}}>7000</Text>*/}
                        {/*</View>*/}
                    {/*</View>*/}

                </ScrollView>
                <TouchableWithoutFeedback onPress={()=>{this.stopWork()}}>
                    <View style={styles.editor_btn}>
                        <Text style={styles.editor_btn_font}>下户</Text>
                    </View>
                </TouchableWithoutFeedback>
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
                            {
                                (this.state.price>this.state.info.amount*0.7)?(
                                    <Text style={{textAlign:'center',fontSize:px2dp(18),marginBottom: px2dp(20)}}>服务员续单工资</Text>
                                    ):(
                                     <Text style={{textAlign:'center',fontSize:px2dp(18),marginBottom: px2dp(20)}}>服务员工资核算</Text>
                                )
                            }

                            <Text style={{textAlign:'center',fontSize:px2dp(15),color:'#a3a3a3'}}>{this.state.price}元</Text>
                            <TouchableWithoutFeedback onPress={()=>{
                                this.setState({
                                    modalVisible: false
                                })
                                navigate('NannyOrderInfo');
                            }}>
                                <View style={styles.modal_btn}>
                                    <Text style={{color:'#fff',textAlign:'center',lineHeight:px2dp(40),fontSize:px2dp(16)}}>确定</Text>
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                    </View>
                </Modal>
            </View>

        )
    }
    //页面将要离开的是时候发送通知
    componentWillUnmount(){
        DeviceEventEmitter.emit('ChangeData');
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
        height:px2dp(53),
        borderWidth: px2dp(1),
        borderColor:'#efefef'
    },
    blue_color:{
        color:'#64bdf9'
    },
    money_wrap:{
        flexDirection:'row',
        alignItems: 'center'
    },
    padding_gap:{
        paddingHorizontal: px2dp(17),
        height:px2dp(79)
    },
    warn_symbol_wrap:{
        width:px2dp(15),
        height:px2dp(15),
        borderRadius:px2dp(15),
        backgroundColor: '#b0b0b0',
        marginRight: px2dp(10)
    },
    warn_symbol:{
        fontSize:px2dp(12),
        color:'#ffffff',
        textAlign: 'center',
        lineHeight:px2dp(15)
    },
    editor_btn:{
        height:px2dp(45),
        elevation:3,
        backgroundColor:'#ffffff',
        borderRadius: px2dp(10),
        marginHorizontal: px2dp(17),
        marginTop: px2dp(5),
        marginBottom: px2dp(25)
    },
    editor_btn_font:{
        fontSize:px2dp(16),
        color:'#64bdf9',
        textAlign: 'center',
        lineHeight: px2dp(45)
    },
    bottom_btn:{
        width:px2dp(158),
        height:px2dp(43),
        elevation:3,
        backgroundColor:'#ffffff',
        borderRadius:5,
        marginTop:px2dp(15),
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
    input_style:{
        borderRadius:5,
        elevation:2,
        paddingLeft: px2dp(10),
        flex:2,
        height:px2dp(42)
    },
    modal_wrap:{
        flex:1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center'
    },
    success_wrap:{
        width:px2dp(240),
        height:px2dp(200),
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
        marginTop:px2dp(30)
    }
});