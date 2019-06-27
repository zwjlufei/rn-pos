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
    TouchableNativeFeedback,
    FlatList
} from 'react-native';
var {width,height} = Dimensions.get('window');
import px2dp from './../tools/px2dp';
import Header from "./../CommonModules/Header";
import Icon from "react-native-vector-icons/FontAwesome";
import DatePicker from "../datePicker/calendar";
import OtherBtn from "../CommonModules/OtherBtn";
import {dataReset,feach_request,getStorage,Toast,timeTransform} from './../tools/Public';
import SelectEmploye from "../CommonModules/SelectEmploye";
import NoDoublePress from "../tools/NoDoublePress";
export default class CreateDoula extends Component{
    static navigationOptions = {
        header: null
    };
    constructor(props){
        super(props);
        this.state = {
            value:'',
            birthDown:false,
            birthValue:'',
            serverDown:false,
            serverValue:'',
            show:false,
            time:'',
            name:'',
            hour:'',
            userInfo:null,
            contractsId:'',
            serviceType:'',
            parturitionType:'',
            waiterArr:[],
            waiterId:'',
            employeeId:'',
            timeState:'start',
            arr:[{title:'半程(800元)',num:'800'},{title:'全程(1500元)',num:'1500'},{title:'全程(1800元)',num:'1800'},{title:'全程(2000元)',num:'2000'},{title:'全程(2300元)',num:'2300'}]
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
        if(this.state.timeState=='start'){
            this.setState({
                value:time
            })
        }else if(this.state.timeState=='end'){
            this.setState({
                time:time
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
        });
    }
    //生产类型
    changeBirth(type,parturitionType){
        this.setState({
            birthValue:type,
            birthDown:false,
            parturitionType:parturitionType
        })
    }
    //服务类型
    changeServer(type,serviceType){
        if(type=='半程(800元)'){
            this.setState({
                hour:4,
                serverValue:type,
                serverDown:false,
                serviceType:serviceType
            })

        }else {
            this.setState({
                hour:8,
                serverValue:type,
                serverDown:false,
                serviceType:serviceType
            })

        }
    }

    //核算参数
    checkData(){
        if(!this.state.waiterId){
            Toast('请确保服务员姓名的准确性和唯一性');
            return false;
        }
        if(!this.state.serviceType || !this.state.parturitionType || !this.state.value|| !this.state.time){
            Toast('请将信息填写完整～');
            return false;
        }
        return true;
    }
    //创建订单
    createOrder(){
        // const that = this;
        const customerId= this.props.navigation.state.params.customerId;
        var data={
            contracts_id:this.state.contractsId,
            start_datetime:this.state.value+':00',
            service_type:this.state.serviceType,
            employee_id:this.state.waiterId,
            parturition_type:this.state.parturitionType,
            customer_id:customerId,
            sign_user:this.state.waiterId,
            type:'dl',
            end_datetime:this.state.time+':00',
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
                        this.props.navigation.navigate('DoulaInfo',{info:data.data.order});
                    }
                })
                .catch((err)=>{
                    console.log(err);
                    Toast('出现未知错误，信息无法提交～');
                })
        }

    }
    //渲染人员列表
    renderItem=({item,index})=>(
        <TouchableNativeFeedback onPress={()=>{this.changeServer(item.title,item.num)}}>
            <View style={{height:px2dp(35)}}>
                <Text style={styles.down_font}>{item.title}</Text>
            </View>
        </TouchableNativeFeedback>
    )
    render(){
        const { navigate } = this.props.navigation;
        return(
            <View style={{flex:1,backgroundColor: '#fcfcfc'}}>
                <Header title={'导乐单信息'} navigate={this.props.navigation}/>
                <ScrollView>
                <View style={{paddingHorizontal: px2dp(17)}}>
                    <SelectEmploye navigation={this.props.navigation} title={'服务员工'} getName={this.getName.bind(this)} waiter={'请输入服务员工姓名'}/>
                    <View style={[styles.flex_space_between,styles.item_gap]}>
                        <Text style={{fontSize: px2dp(14)}}>分娩类型</Text>
                        <View style={[styles.flex,styles.down_input_wrap]}>
                            <TouchableWithoutFeedback onPress={()=>{this.setState({birthDown: !this.state.birthDown})}}>
                                <View>
                                    <TextInput value={this.state.birthValue} style={[styles.input_font,styles.input_style]} editable={false} placeholder={'请选择生产类型'}/>
                                    <Icon name="angle-down" size={25} color="#b2b2b2" style={styles.right_arrow} />
                                </View>
                            </TouchableWithoutFeedback>
                            {
                                this.state.birthDown?( <View style={styles.down_box}>
                                    <View style={{flex:1}}>
                                        <TouchableNativeFeedback onPress={()=>{this.changeBirth('顺产','sc')}}>
                                            <View style={{height:px2dp(40)}}>
                                                <Text style={styles.down_font}>顺产</Text>
                                            </View>
                                        </TouchableNativeFeedback>
                                        <TouchableNativeFeedback onPress={()=>{this.changeBirth('顺改刨','sgp')}}>
                                            <View style={{height:px2dp(40)}}>
                                                <Text style={styles.down_font}>顺改刨</Text>
                                            </View>
                                        </TouchableNativeFeedback>
                                    </View>
                                </View>):(null)
                            }
                        </View>
                    </View>
                    <View style={[styles.flex_space_between,styles.item_gap]}>
                        <Text style={{fontSize: px2dp(14)}}>开始时间</Text>
                        <TouchableWithoutFeedback onPress={()=>{
                            if(!this.state.birthDown){
                                this.setState({dateShow:true,timeState:'start'})
                            }
                        }}>
                            <View  style={[styles.flex,styles.down_input_wrap]}>
                                <TextInput style={[styles.input_font,styles.input_style]} value={this.state.value} placeholder={'请选择开始时间'} editable={false}/>
                                <Icon name="angle-down" size={25} color="#b2b2b2" style={styles.right_arrow} />
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                    <View style={[styles.flex_space_between,styles.item_gap]}>
                        <Text style={{fontSize: px2dp(14)}}>结束时间</Text>
                        <TouchableWithoutFeedback onPress={()=>{
                            if(!this.state.birthDown){
                                this.setState({dateShow:true,timeState:'end'})
                            }
                        }}>
                            <View  style={[styles.flex,styles.down_input_wrap]}>
                                <TextInput style={[styles.input_font,styles.input_style]} value={this.state.time} placeholder={'请选择结束时间'} editable={false}/>
                                <Icon name="angle-down" size={25} color="#b2b2b2" style={styles.right_arrow} />
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                    <View style={[styles.flex_space_between,styles.item_gap]}>
                        <Text style={{fontSize: px2dp(14)}}>服务类型</Text>
                        <View  style={[styles.flex,styles.down_input_wrap]}>
                            <TouchableWithoutFeedback onPress={()=>{this.setState({serverDown: !this.state.serverDown})}}>
                                <View>
                                    <TextInput value={this.state.serverValue} style={[styles.input_font,styles.input_style]} editable={false}  placeholder={'请选择服务类型'}/>
                                    <Icon name="angle-down" size={25} color="#b2b2b2" style={styles.right_arrow} />
                                </View>
                            </TouchableWithoutFeedback>
                            {
                                this.state.serverDown?( <View style={[styles.down_box,styles.server_down_height]}>
                                    <View style={{flex:1}}>
                                        <FlatList
                                            data={this.state.arr}
                                            keyExtractor={(item, index) => index.toString()}
                                            renderItem={this.renderItem}
                                            getItemLayout={(data,index)=>(
                                                {length: px2dp(85), offset: px2dp(85) * index, index}
                                            )}
                                        />
                                    </View>
                                </View>):(null)
                            }
                        </View>
                    </View>
                    <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                        <TouchableWithoutFeedback onPress={()=>{
                            this.props.navigation.goBack();
                        }}>
                            <View style={styles.bottom_btn}>
                                <Text style={styles.bottom_btn_font}>返回第一步</Text>
                            </View>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={()=>NoDoublePress.onPress(()=>{
                            if(!this.state.serverDown){
                                this.createOrder()
                            }
                        })}>
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
    input_style:{
        borderRadius:5,
        elevation:2,
        paddingLeft: px2dp(10),
    },
    bottom_btn:{
        width:px2dp(158),
        height:px2dp(43),
        elevation:2,
        backgroundColor:'#ffffff',
        borderRadius:5,
        marginTop:px2dp(90),
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
    input_font:{
        fontSize:px2dp(15),
        height:px2dp(40)
    },
    end_time_wrap:{
        paddingHorizontal: px2dp(40),
        marginTop:px2dp(19)
    },
    add_time_btn:{
        width:px2dp(100),
        height:px2dp(40),
        elevation:2,
        borderRadius:px2dp(5),
        justifyContent:'center',
        alignItems: 'center'
    },
    down_box:{
        width:px2dp(266),
        height:px2dp(100),
        paddingVertical: px2dp(10),
        backgroundColor:'#ffffff',
        elevation:4,
        position: 'absolute',
        left:0,
        top:px2dp(38),
        borderBottomRightRadius:px2dp(5),
        borderBottomLeftRadius:px2dp(5)
    },
    down_input_wrap:{
        marginLeft: px2dp(18)
    },
    down_font:{
        color:'#b2b2b2',
        fontSize: px2dp(14),
        textAlign:'center',
        lineHeight: px2dp(35)
    },
    server_down_height:{
        height:px2dp(120),
        paddingVertical: px2dp(0),
        paddingBottom: px2dp(10)
    }
});