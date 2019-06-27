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
    ToastAndroid,
    ImageBackground, Modal
} from 'react-native';
var {width,height} = Dimensions.get('window');
import px2dp from './../tools/px2dp';
import Header from "./../CommonModules/Header";
import Echarts from 'native-echarts';
import Icon from "react-native-vector-icons/FontAwesome";
import DatePicker from "../datePicker/calendar";
import {dataReset, feach_request, getStorage, Toast,compareTime} from "../tools/Public";
export default class CheckPay extends Component{
    static navigationOptions = {
        header: null
    };
    constructor(props){
        super(props);
        this.state = {
            nav:'today',
            modalVisible:false,
            startTime:'',
            dateShow:'',
            endTime:'',
            btnState:0,
            timeStart:new Date(),
            timeEnd:new Date(),
            flow:[{amount:0},{amount:0},{amount:0},{amount:0}],
            totalAmount:'',
            ways:[{amount:0},{amount:0},{amount:0},{amount:0}],
            payAmount:''
        }
    }
    componentWillMount(){
        getStorage('userInfo')
            .then(data=>{
                this.setState({
                    userInfo:data
                })
                this.initData(data,this.state.nav)
            }).catch(err=>{
            console.log(err)
        })
    }
    //请求数据
    initData(userInfo,nav){
        var data={
            pay_time:nav,
            order_source:userInfo.name,
            token:userInfo.token
        };
        // token:this.state.userInfo.token
        data = dataReset(data);
        console.log(data)
        feach_request('/pos_order_flow_detail','POST',data,this.props.navigation)
            .then((data)=>{
                console.log(data)
                if(data.status==0){
                    this.setState({
                        flow:data.data.flow,
                        toalMount:data.data.flow_amount,
                        ways:data.data.pay_with,
                        payMount:data.data.pay_amount,
                        start:data.data.start,
                        end:data.data.end
                    })
                }
            })
            .catch((err)=>{
                console.log(err);
                Toast('出现未知错误，请稍后再试～');
            })

    }
    //获取时间
    getTime(time){
        if(!this.state.btnState){
            this.setState({
                startTime:time
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
    //导航切换
    changeNav(state){
        if(state =='4'){
            this.setState({
                modalVisible:true
            })
        }
        this.setState({
            nav:state
        })
        this.initData(this.state.userInfo,state);
    }
    //获取数据
    changeDate(){
        // const compare=compareTime(time2,time1)
        // if(compare){
        //     this.setState({
        //         timeStart:this.state.startTime,
        //         timeEnd:this.state.endTime,
        //         modalVisible:false
        //     })
        // }else {
        //     Toast("结束时间不能小于开始时间～");
        // }

    }
    render(){
        const { navigate } = this.props.navigation;
        const option = {
            tooltip: {    //定义环形图item点击弹框
                trigger: 'item',
                formatter: "{a} <br/>{b}: {c} ({d}%)"
            },
            series: [{
                name:'数据来源',
                type:'pie',
                hoverAnimation:true,
                radius: ['58%', '90%'],
                avoidLabelOverlap: false,
                selectedOffset:6,
                selectedMode:'single',
                center: ['50%', '50%'],     //这里可以设置环形图展示的位置
                label: {
                    normal: {
                        show: false,
                        position: 'center'
                    },
                    emphasis: {               //设置点击展示环形图内部文本样式
                        show: true,
                        textStyle: {
                            fontSize: '30',
                            fontWeight: 'bold'
                        }
                    }
                },

                labelLine: {
                    normal: {
                        show: false
                    }
                },
                data:[{value:this.state.flow[1].amount, name:'陪护单'}, {value:this.state.flow[2].amount, name:'母指单'}, {value:this.state.flow[3].amount, name:'导乐单'}, {value:this.state.flow[0].amount, name:'月嫂单'}]
            }],
            //可以根据下标来定义item内容的颜色
            color:['#7489ff', '#7dc0ff','#ffdc70','#ff9d76']
        };
        const options = {
            tooltip: {    //定义环形图item点击弹框
                trigger: 'way',
                formatter: "{a} <br/>{b}: {c} ({d}%)"
            },
            series: [{
                name:'数据来源',
                type:'pie',
                hoverAnimation:true,
                radius: ['58%', '90%'],
                avoidLabelOverlap: false,
                selectedOffset:7,
                selectedMode:'single',
                center: ['50%', '50%'],     //这里可以设置环形图展示的位置
                label: {
                    normal: {
                        show: false,
                        position: 'center'
                    },
                    emphasis: {               //设置点击展示环形图内部文本样式
                        show: true,
                        textStyle: {
                            fontSize: '30',
                            fontWeight: 'bold'
                        }
                    }
                },

                labelLine: {
                    normal: {
                        show: false
                    }
                },
                data:[{value:this.state.ways[1].amount, name:'支付宝'}, {value:this.state.ways[0].amount, name:'微信'}, {value:this.state.ways[2].amount, name:'POS刷卡'}, {value:this.state.ways[3].amount, name:'现金'}]
            }],
            //可以根据下标来定义item内容的颜色
            color:['#7dc0ff','#7cf2c4','#ffdc70','#ff9d76']
        };
        return(
            <View style={{flex:1,backgroundColor: '#ffffff'}}>
                <Header title={'订单流水'} navigate={this.props.navigation}/>
                <View style={[styles.flex_space_between,styles.nav_cut]}>
                    <TouchableWithoutFeedback onPress={()=>{this.changeNav('today')}}>
                        <View style={[styles.nav_cut_item,this.state.nav=='today'?styles.nav_item_on:'']}>
                            <Text style={[styles.nav_item_font,this.state.nav=='today'?styles.nav_font_on:'']}>今日</Text>
                        </View>
                    </TouchableWithoutFeedback>
                    <View style={styles.nav_gap}></View>
                    <TouchableWithoutFeedback onPress={()=>{this.changeNav('this_week')}}>
                        <View style={[styles.nav_cut_item,this.state.nav=='this_week'?styles.nav_item_on:'']}>
                            <Text style={[styles.nav_item_font,this.state.nav=='this_week'?styles.nav_font_on:'']}>本周</Text>
                        </View>
                    </TouchableWithoutFeedback>
                    <View style={styles.nav_gap}></View>
                    <TouchableWithoutFeedback onPress={()=>{this.changeNav('this_month')}}>
                        <View style={[styles.nav_cut_item,this.state.nav=='this_month'?styles.nav_item_on:'']}>
                            <Text style={[styles.nav_item_font,this.state.nav=='this_month'?styles.nav_font_on:'']}>本月</Text>
                        </View>
                    </TouchableWithoutFeedback>
                    {/*<View style={styles.nav_gap}></View>*/}
                    {/*<TouchableWithoutFeedback onPress={()=>{this.changeNav('4')}}>*/}
                        {/*<View style={[styles.nav_cut_item,this.state.nav=='4'?styles.nav_item_on:'']}>*/}
                            {/*<Text style={[styles.nav_item_font,this.state.nav=='4'?styles.nav_font_on:'']}>自定义</Text>*/}
                        {/*</View>*/}
                    {/*</TouchableWithoutFeedback>*/}
                </View>
                <ScrollView style={styles.flex}>
                    <View style={{paddingHorizontal: px2dp(18),paddingVertical: px2dp(24)}}>
                        <View style={[styles.flex_row,styles.mb_24]}>
                            <Text style={styles.module_title}>统计时间:</Text>
                            <Text style={styles.font_style}>{this.state.start} 至 {this.state.end}</Text>
                        </View>
                        <Text style={[styles.module_title,styles.mb_22]}>产品类型</Text>
                        <View style={{height:px2dp(210)}}>
                            <Echarts option={option} height={220}/>
                        </View>
                        <View style={[styles.prl_100,styles.mb_25]}>
                            <View style={[styles.flex_space_between,styles.item_wrap]}>
                                <View style={{width:px2dp(30)}}>
                                    <View style={styles.item_symbol}></View>
                                </View>
                                <Text style={styles.item_font}>陪护单</Text>
                                <Text style={[styles.item_font,styles.text_width]}>{this.state.flow[1].amount}元</Text>
                                <Text style={styles.item_font}>({((Number(this.state.flow[1].amount)/Number(this.state.toalMount))*100).toFixed(2)}%)</Text>
                                <Text style={styles.item_font}>{this.state.flow[1].sum}单</Text>
                            </View>
                            <View style={[styles.flex_space_between,styles.item_wrap]}>
                                <View style={[styles.flex_space_between,styles.item_wrap]}>
                                    <View style={{width:px2dp(30)}}>
                                        <View style={[styles.item_symbol,styles.blue_bg]}></View>
                                    </View>
                                    <Text style={styles.item_font}>母指单</Text>
                                    <Text style={[styles.item_font,styles.text_width]}>{this.state.flow[2].amount}元</Text>
                                    <Text style={styles.item_font}>({((Number(this.state.flow[2].amount)/Number(this.state.toalMount))*100).toFixed(2)}%)</Text>
                                    <Text style={styles.item_font}>{this.state.flow[2].sum}单</Text>
                                </View>
                            </View>
                            <View style={[styles.flex_space_between,styles.item_wrap]}>
                                <View style={{width:px2dp(30)}}>
                                    <View style={[styles.item_symbol,styles.yellow_bg]}></View>
                                </View>
                                <Text style={styles.item_font}>导乐单</Text>
                                <Text style={[styles.item_font,styles.text_width]}>{this.state.flow[3].amount}元</Text>
                                <Text style={styles.item_font}>({((Number(this.state.flow[3].amount)/Number(this.state.toalMount))*100).toFixed(2)}%)</Text>
                                <Text style={{fontSize:px2dp(13)}}>{this.state.flow[3].sum}单</Text>
                            </View>
                            <View style={[styles.flex_space_between,styles.item_wrap]}>
                                <View style={{width:px2dp(30)}}>
                                    <View style={[styles.item_symbol,styles.origin_bg]}></View>
                                </View>
                                <Text style={styles.item_font}>月嫂单</Text>
                                <Text style={[styles.item_font,styles.text_width]}>{this.state.flow[0].amount}元</Text>
                                <Text style={styles.item_font}>({((Number(this.state.flow[0].amount)/Number(this.state.toalMount))*100).toFixed(2)}%)</Text>
                                <Text style={{fontSize:px2dp(13)}}>{this.state.flow[0].sum}单</Text>
                            </View>
                        </View>
                        <View style={[styles.flex_row,styles.mb_24]}>
                            <Text style={styles.module_title}>总计金额:</Text>
                            <Text style={[styles.font_style,styles.mr_10]}>{this.state.toalMount}元</Text>
                            <Text style={styles.font_style}>{Number(this.state.flow[0].sum)+Number(this.state.flow[1].sum)+Number(this.state.flow[2].sum)+Number(this.state.flow[3].sum)}单</Text>
                        </View>
                    </View>
                    <View style={styles.module_gap}></View>
                    <View style={{paddingHorizontal: px2dp(18),paddingVertical: px2dp(24)}}>
                        <View style={[styles.flex_row,styles.mb_24]}>
                            <Text style={styles.module_title}>统计时间:</Text>
                            <Text style={styles.font_style}>{this.state.start} 至 {this.state.end}</Text>
                        </View>
                        <Text style={[styles.module_title,styles.mb_22]}>产品类型</Text>
                        <View style={{height:px2dp(210)}}>
                            <Echarts option={options} height={220}/>
                        </View>
                        <View style={[styles.prl_100,styles.mb_25]}>
                            <View style={[styles.flex_space_between,styles.item_wrap]}>
                                <View style={{width:px2dp(30)}}>
                                    <View style={[styles.item_symbol,styles.blue_bg]}></View>
                                </View>
                                <Text style={styles.item_font}>支付宝</Text>
                                <Text style={[styles.item_font,styles.text_width]}>{this.state.ways[1].amount}元</Text>
                                <Text style={styles.item_font}>({((Number(this.state.ways[1].amount)/Number(this.state.payMount))*100).toFixed(2)}%)</Text>
                                <Text style={styles.item_font}>{this.state.ways[1].sum}单</Text>
                            </View>
                            <View style={[styles.flex_space_between,styles.item_wrap]}>
                                <View style={{width:px2dp(30)}}>
                                    <View style={[styles.item_symbol,styles.green_bg]}></View>
                                </View>
                                <Text style={styles.item_font}>微信</Text>
                                <Text style={[styles.item_font,styles.text_width]}>{this.state.ways[0].amount}元</Text>
                                <Text style={styles.item_font}>({((Number(this.state.ways[0].amount)/Number(this.state.payMount))*100).toFixed(2)}%)</Text>
                                <Text style={{fontSize:px2dp(13)}}>{this.state.ways[0].sum}单</Text>
                            </View>
                            <View style={[styles.flex_space_between,styles.item_wrap]}>
                                <View style={{width:px2dp(30)}}>
                                <View style={[styles.item_symbol,styles.yellow_bg]}></View>
                                </View>
                                <Text style={styles.item_font}>POS刷卡</Text>
                                <Text style={[styles.item_font,styles.text_width]}>{this.state.ways[2].amount}元</Text>
                                <Text style={styles.item_font}>({((Number(this.state.ways[2].amount)/Number(this.state.payMount))*100).toFixed(2)}%)</Text>
                                <Text style={{fontSize:px2dp(13)}}>{this.state.ways[2].sum}单</Text>
                            </View>
                            <View style={[styles.flex_space_between,styles.item_wrap]}>
                                <View style={{width:px2dp(30)}}>
                                <View style={[styles.item_symbol,styles.origin_bg]}></View>
                                </View>
                                <Text style={styles.item_font}>现金</Text>
                                <Text style={[styles.item_font,styles.text_width]}>{this.state.ways[3].amount}元</Text>
                                <Text style={styles.item_font}>({((Number(this.state.ways[3].amount)/Number(this.state.payMount))*100).toFixed(2)}%)</Text>
                                <Text style={{fontSize:px2dp(13)}}>{this.state.ways[3].sum}单</Text>
                            </View>
                        </View>
                        <View style={[styles.flex_row,styles.mb_24]}>
                            <Text style={styles.module_title}>总计金额:</Text>
                            <Text style={[styles.font_style,styles.mr_10]}>{this.state.payMount}元</Text>
                            <Text style={{fontSize:px2dp(13)}}>{Number(this.state.ways[0].sum)+Number(this.state.ways[1].sum)+Number(this.state.ways[2].sum)+Number(this.state.ways[3].sum)}单</Text>
                        </View>
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
                            <Text style={{fontSize:px2dp(14),marginBottom:px2dp(13)}}>开始时间</Text>
                            <TouchableWithoutFeedback onPress={()=>{
                                this.setState({dateShow:true,btnState:0})
                            }}>
                                <View style={{marginBottom:px2dp(20)}}>
                                    <TextInput style={[styles.input_font,styles.input_style]} value={this.state.startTime} placeholder={'请选择开始时间'} editable={false}/>
                                    <Icon name="angle-down" size={25} color="#b2b2b2" style={styles.right_arrow} />
                                </View>
                            </TouchableWithoutFeedback>
                            <Text style={{fontSize:px2dp(14),marginBottom:px2dp(13)}}>结束时间</Text>
                            <TouchableWithoutFeedback onPress={()=>{
                                this.setState({dateShow:true,btnState:1})
                            }}>
                                <View style={{marginBottom:px2dp(28)}}>
                                    <TextInput style={[styles.input_font,styles.input_style]} value={this.state.endTime} placeholder={'请选择结束时间'} editable={false}/>
                                    <Icon name="angle-down" size={25} color="#b2b2b2" style={styles.right_arrow} />
                                </View>
                            </TouchableWithoutFeedback>
                            <View style={styles.flex_space_between}>
                                <TouchableWithoutFeedback onPress={()=>{
                                    this.setState({
                                        modalVisible: false
                                    })
                                }}>
                                    <View style={styles.modal_btn}>
                                        <Text style={styles.modal_font}>取消</Text>
                                    </View>
                                </TouchableWithoutFeedback>
                                <TouchableWithoutFeedback onPress={()=>{this.changeDate()}}>
                                    <View style={[styles.modal_btn,styles.modal_btn_on]}>
                                        <Text style={[styles.modal_font,styles.modal_font_on]}>确定</Text>
                                    </View>
                                </TouchableWithoutFeedback>
                            </View>
                        </View>
                    </View>
                </Modal>
                {
                    this.state.dateShow?(<DatePicker getTime={this.getTime.bind(this)} show={this.state.dateShow} closeDate={this.closeDate.bind(this)} mode={'date'}/>):(null)
                }
            </View>
        )
    }
}
const styles = StyleSheet.create({
    flex:{
        flex:1,
    },
    flex_space_between:{
        flexDirection:'row',
        justifyContent: 'space-between',
        alignItems:'center'
    },
    nav_cut:{
        paddingHorizontal: px2dp(30),
        height:px2dp(42),
        elevation:3,
        backgroundColor:'#ffffff'
    },
    nav_cut_item:{
        width:px2dp(59)
    },
    nav_item_font:{
        textAlign: 'center',
        color:'#7f7f7f',
        fontSize:px2dp(14),
        lineHeight:px2dp(42)
    },
    nav_gap:{
        width:px2dp(1),
        height:px2dp(23),
        backgroundColor: "#d9d9d9"
    },
    nav_item_on:{
        borderBottomWidth: px2dp(2),
        borderBottomColor:'#64bdf9'
    },
    nav_font_on:{
        color: '#64bdf9'
    },
    module_title:{
        fontSize:px2dp(13),
        color:'#333',
        marginRight: px2dp(20)
    },
    font_style:{
        fontSize:px2dp(14),
        color:'#727272'
    },
    mb_24:{
        marginBottom:px2dp(24)
    },
    mb_22:{
        marginBottom:px2dp(22)
    },
    mb_25:{
        marginBottom:px2dp(25)
    },
    item_symbol:{
        width:px2dp(9),
        height:px2dp(9),
        borderRadius:px2dp(9),
        backgroundColor:'#7489ff'
    },
    prl_100:{
        paddingHorizontal:px2dp(40)
    },
    item_wrap:{
        height:px2dp(30)
    },
    flex_row:{
        flexDirection:'row',
        alignItems: 'center'
    },
    blue_bg:{
        backgroundColor:'#7dc0ff'
    },
    yellow_bg:{
        backgroundColor:'#ffdc70'
    },
    origin_bg:{
        backgroundColor:'#ff9d76'
    },
    green_bg:{
        backgroundColor:'#7cf2c4'
    },
    mr_10:{
        marginRight: px2dp(10)
    },
    module_gap:{
        height:5,
        backgroundColor:'#efefef'
    },
    item_font:{
        fontSize:px2dp(13),
        width:px2dp(66)
    },
    modal_wrap:{
        flex:1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center'
    },
    success_wrap:{
        width:px2dp(280),
        height:px2dp(280),
        borderRadius:px2dp(5),
        backgroundColor:'#fff',
        paddingTop: px2dp(24),
        paddingHorizontal:px2dp(17)
    },
    input_style:{
        borderRadius:5,
        elevation:2,
        paddingLeft: px2dp(10),
    },
    input_font:{
        fontSize:px2dp(15),
        height:px2dp(40)
    },
    right_arrow:{
        position: 'absolute',
        right:px2dp(17),
        top:px2dp(8)
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
    },
    text_width:{
        width:px2dp(90)
    }
});