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
    Picker
} from 'react-native';
var {width,height} = Dimensions.get('window');
import px2dp from './../tools/px2dp';
import Header from "./../CommonModules/Header";
import Icon from "react-native-vector-icons/FontAwesome";
import SelectStaff from './../CommonModules/SelectStaff';
import OtherBtn from './../CommonModules/OtherBtn';
import ModalDropdown from 'react-native-modal-dropdown';
import DatePicker from "../datePicker/calendar";
import {dataReset,feach_request,getStorage,Toast} from './../tools/Public';
import SelectEmploye from "../CommonModules/SelectEmploye";
import NoDoublePress from "../tools/NoDoublePress";
const BZ=['东城区','西城区','朝阳区','丰台区','石景山区','海淀区','门头沟区','房山区','通州区','顺义区','昌平区','大兴区','怀柔区','平谷区','密云区','延庆区'];
const HZ = ['上城区','下城区','江干区','拱墅区','西湖区','滨江区','萧山区','余杭区','富阳区','临安区','桐庐县','淳安县','建德市'];
export default class CreateNanny extends Component{
    static navigationOptions = {
        header: null
    };
    constructor(props){
        super(props);
        this.state = {
            sever_time:'26',
            other_time:'其他',
            type:'cg',
            show:false,
            scroll:true,
            area:BZ,
            dateShow:false,
            value:'',
            city:'',
            subCity:'',
            address:'',
            contractsId:'',
            userInfo:null,
            inputValue:'',
            waiterArr:[],
            downShow:false,
            waiterId:'',
            employeeId:'',
            price:'9800',
            priceBtn:'month',
            money:'9800'
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
    //获取员工姓名
    getName(name,id){
        this.setState({
            waiterId:id
        });
    }
    //获取出单人
    getEmployee(name,id){
        this.setState({
            employeeId:id
        })
    }
    //服务时长按钮切换
    changServerBtn(msg){
        if(msg!=='26' && msg!=='42'){
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
    //特殊类型切换
    changTypeBtn(msg){
        this.setState({
            type:msg,
            show:false
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
    //禁止滚动
    stopScroll(state){
        if(state){
            this.setState({
                scroll:false
            })
        }else {
            this.setState({
                scroll:true
            })
        }
    }
    //省份切换
    changePro=((value)=>{
        if(value==0){
            this.setState({
                area:BZ,
                city:'北京'
            })
        }else {
            this.setState({
                area:HZ,
                city:'杭州'
            })
        }
    })
    //服务单价按钮切换
    changePriceBtn(text){
        if(text=='month'){
            this.setState({
                price:'9800',
                priceBtn:'month',
                money:'9800'
            })
        }else {
            this.setState({
                price:'400',
                priceBtn:'day',
                money:'400'
            })
        }
    }
    //核算数据
    checkData(){
        const address=this.state.city+this.state.subCity+this.state.address;
        if(!this.state.value || !address){
            Toast('请确保信息完整性～');
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
        const priceReg=/^[1-9]\d*$/;
        if(!priceReg.test(this.state.money)){
            Toast('服务单价请输入整数数字～');
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
        // const that = this;
        const customerId= this.props.navigation.state.params.customerId;
        const card= this.props.navigation.state.params.card;
        var data={
            contracts_id:this.state.contractsId,
            start_date:this.state.value,
            id_number:card?card:'',
            days:this.state.sever_time,
            waiter_id:this.state.waiterId,
            special_type:this.state.type,
            address:this.state.city+this.state.subCity+this.state.address,
            customer_id:customerId,
            sign_user:this.state.employeeId,
            type:'ys',
            unit_price:(this.state.priceBtn=='month'?this.state.money:this.state.money*26),
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
                        this.props.navigation.navigate('NannyInfo',{info:data.data.order});
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
                <Header title={'月嫂单信息'} navigate={this.props.navigation}/>
                <ScrollView scrollEnabled={this.state.scroll}>
                <View style={{paddingHorizontal: px2dp(17)}}>
                    <View style={[styles.flex_space_between,styles.item_gap]}>
                        <Text style={{fontSize: px2dp(14)}}>上户时间</Text>
                        <TouchableWithoutFeedback onPress={()=>{this.setState({dateShow:true})}}>
                            <View style={[styles.flex,styles.input_style]}>
                                <TextInput style={styles.input_font} value={this.state.value} placeholder={'请选择上户时间'} editable={false}/>
                                <Icon name="angle-down" size={25} color="#b2b2b2" style={styles.right_arrow} />
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                    <View style={styles.item_gap}>
                        <Text style={{fontSize: px2dp(14)}}>服务时长</Text>
                        <View style={[styles.flex_space_between,styles.title_item_gap]}>
                            <TouchableWithoutFeedback onPress={()=>{
                                this.changServerBtn('26')
                            }}>
                                <View style={[this.state.sever_time=='26'?styles.sex_btn_on:styles.sex_btn]}>
                                    <Text style={[styles.sex_font_style,this.state.sever_time=='26'?styles.sex_font_on:'']}>26</Text>
                                </View>
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback onPress={()=>{
                                this.changServerBtn('42')
                            }}>
                                <View style={[this.state.sever_time=='42'?styles.sex_btn_on:styles.sex_btn]}>
                                    <Text style={[styles.sex_font_style,this.state.sever_time=='42'?styles.sex_font_on:'']}>42</Text>
                                </View>
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback onPress={()=>{
                                this.changServerBtn(this.state.other_time)
                            }}>
                                <View style={[this.state.sever_time==this.state.other_time?styles.sex_btn_on:styles.sex_btn]}>
                                    <Text style={[styles.sex_font_style,this.state.sever_time==this.state.other_time?styles.sex_font_on:'']}>{this.state.other_time}</Text>
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                    </View>
                    {/*<View style={[styles.flex_space_between,styles.item_gap]}>*/}
                        {/*<Text style={{fontSize: px2dp(14)}}>服务员工</Text>*/}
                        <SelectStaff navigation={this.props.navigation} getName={this.getName.bind(this)} scroll={true} stopScroll={this.stopScroll.bind(this)}/>
                    {/*</View>*/}
                    <SelectEmploye navigation={this.props.navigation} getName={this.getEmployee.bind(this)} />
                    <View style={styles.item_gap}>
                        <Text style={{fontSize: px2dp(14)}}>服务单价</Text>
                        <View style={[styles.title_item_gap]}>
                            <View style={[styles.flex_space_between,styles.price_btn_wrap]}>
                                <TouchableWithoutFeedback onPress={()=>{this.changePriceBtn('month')}}>
                                    <View style={[styles.price_btn,this.state.priceBtn=='month'?styles.bottom_btn_on:'']}>
                                        <Text style={[styles.price_btn_font,this.state.priceBtn=='month'?styles.bottom_font_on:'']}>月单价</Text>
                                    </View>
                                </TouchableWithoutFeedback>
                                <View style={{width:px2dp(1),height:px2dp(30),backgroundColor:'#e0e0e0'}}></View>
                                <TouchableWithoutFeedback onPress={()=>{this.changePriceBtn('day')}}>
                                    <View style={[styles.price_btn,this.state.priceBtn=='day'?styles.bottom_btn_on:'']}>
                                        <Text style={[styles.price_btn_font,this.state.priceBtn=='day'?styles.bottom_font_on:'']}>日单价</Text>
                                    </View>
                                </TouchableWithoutFeedback>
                            </View>
                            <TextInput keyboardType={'numeric'} onChangeText={(text)=>{this.setState({money:text})}} style={[styles.input_font,styles.input_style,styles.price_input]} defaultValue={this.state.price}/>
                        </View>
                    </View>
                    <View style={styles.item_gap}>
                        <Text style={{fontSize: px2dp(14)}}>特殊类型</Text>
                        <View style={[styles.flex_space_between,styles.title_item_gap]}>
                            <TouchableWithoutFeedback onPress={()=>{
                                this.changTypeBtn('cg')
                            }}>
                                <View style={[this.state.type=='cg'?styles.sex_btn_on:styles.sex_btn]}>
                                    <Text style={[styles.sex_font_style,this.state.type=='cg'?styles.sex_font_on:'']}>常规</Text>
                                </View>
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback onPress={()=>{
                                this.changTypeBtn('zce')
                            }}>
                                <View style={[this.state.type=='zce'?styles.sex_btn_on:styles.sex_btn]}>
                                    <Text style={[styles.sex_font_style,this.state.type=='zce'?styles.sex_font_on:'']}>早产+20%</Text>
                                </View>
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback onPress={()=>{
                                this.changTypeBtn('sbt')
                            }}>
                                <View style={[this.state.type=='sbt'?styles.sex_btn_on:styles.sex_btn]}>
                                    <Text style={[styles.sex_font_style,this.state.type=='sbt'?styles.sex_font_on:'']}>双胞胎+20%</Text>
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                    </View>
                    <View style={[styles.item_gap,styles.flex]}>
                        <Text style={{fontSize: px2dp(14)}}>服务地点</Text>
                        <View style={[styles.flex_space_between,styles.title_item_gap]}>
                            <View style={[styles.flex,styles.flex_space_between,styles.padding_right]}>
                                <View>
                                    <Text style={{fontSize: px2dp(14)}}>省</Text>
                                </View>
                                <View style={styles.site}>
                                    <ModalDropdown
                                        options={['北京', '杭州']}
                                        defaultValue={'请选择'}
                                        onSelect={this.changePro}
                                        textStyle={{lineHeight:px2dp(40),fontSize:px2dp(15),color:'#888'}}
                                        dropdownStyle={styles.site_down_box}
                                        style={{width:px2dp(116),height:px2dp(40),paddingLeft:px2dp(10)}}
                                    />
                                    <Icon name="angle-down" size={25} color="#b2b2b2" style={styles.right_arrow} />
                                </View>
                            </View>
                            <View style={[styles.flex,styles.flex_space_between]}>
                                <View>
                                    <Text style={{fontSize: px2dp(14)}}>市/区</Text>
                                </View>
                                <View style={styles.site}>
                                    <ModalDropdown
                                        options={this.state.area}
                                        defaultValue={'请选择'}
                                        onSelect={(value)=>{
                                           this.setState({
                                               subCity:this.state.area[value]
                                           })
                                        }}
                                        textStyle={{lineHeight:px2dp(40),fontSize:px2dp(15),color:'#888'}}
                                        dropdownStyle={styles.area_down_box}
                                        style={{width:px2dp(116),height:px2dp(40),paddingLeft:px2dp(10)}}
                                    />
                                    <Icon name="angle-down" size={25} color="#b2b2b2" style={styles.right_arrow} />
                                </View>
                            </View>
                        </View>
                    </View>
                    <View style={styles.item_gap}>
                        <Text style={{fontSize: px2dp(14)}}>详细地址</Text>
                        <View style={{paddingVertical: px2dp(10),marginTop:px2dp(8)}}>
                            <TextInput
                                placeholder={'例如：朝阳路大悦城13号楼1-9'}
                                style={[styles.multi_line_input,styles.input_font]}
                                multiline={true}
                                onChangeText={(text)=>{this.setState({address:text})}}
                            />
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
                        <TouchableWithoutFeedback onPress={()=>NoDoublePress.onPress(()=>{this.createOrder()})}>
                            <View style={[styles.bottom_btn,styles.bottom_btn_on]}>
                                <Text style={[styles.bottom_btn_font,styles.bottom_font_on]}>生成订单</Text>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </View>
                    {
                        this.state.show?(
                            <OtherBtn type={'day'} show={this.state.show} changeDay={this.changeDay.bind(this)} />
                        ):(null)
                    }
            </ScrollView>
            {
                this.state.dateShow?(<DatePicker getTime={this.getTime.bind(this)} show={this.state.dateShow} closeDate={this.closeDate.bind(this)} mode={'date'}/>):(null)
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
        marginTop:px2dp(92),
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
        borderRadius:5,
        paddingLeft:px2dp(5)
    },
    site_font:{
        fontSize:px2dp(16),
        color:'#b2b2b2',
        lineHeight:px2dp(40),
        paddingLeft: px2dp(17)
    },
    multi_line_input:{
        height:px2dp(70),
        borderRadius:px2dp(10),
        elevation:2,
        paddingLeft:px2dp(17),
        backgroundColor:'#fff',
        textAlignVertical: 'top'
    },
    input_font:{
        fontSize:px2dp(15)
    },
    site_down_box:{
        width:px2dp(116),
        height:px2dp(78),
        backgroundColor:'#fff',
        elevation:3,
        borderBottomRightRadius:px2dp(5),
        borderBottomLeftRadius:px2dp(5),
        borderTopColor:'#f2f2f2',
        marginLeft:-px2dp(15),
        marginTop:-px2dp(2)
    },
    down_box_font:{
        fontSize:px2dp(15),
        textAlign:'center',
        lineHeight:px2dp(40),
        color:'#b2b2b2'
    },
    down_font_on:{
        color:'#64bdf9'
    },
    input_height:{
        height:px2dp(40)
    },
    area_down_box:{
        width:px2dp(116),
        height:px2dp(150),
        backgroundColor:'#fff',
        elevation:3,
        borderBottomRightRadius:px2dp(5),
        borderBottomLeftRadius:px2dp(5),
        borderTopColor:'#f2f2f2',
        marginRight:px2dp(5),
        marginTop:-px2dp(2)
    },
    price_btn:{
        flex:1,
        height:px2dp(30)
    },
    price_btn_font:{
        textAlign:'center',
        lineHeight:px2dp(30),
        color:'#b2b2b2'
    },
    price_btn_wrap:{
        backgroundColor:'#fff',
        elevation:3,
        borderTopLeftRadius:px2dp(5),
        borderTopRightRadius:px2dp(5),
        overflow: 'hidden'
    },
    price_input:{
        marginLeft:0,
        borderTopLeftRadius: 0,
        borderTopRightRadius:0
    }
});