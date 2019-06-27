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
import OtherBtn from "../CommonModules/OtherBtn";
import {dataReset,feach_request,getStorage,Toast} from './../tools/Public';
import ModalDropdown from "react-native-modal-dropdown";
import SelectEmploye from "../CommonModules/SelectEmploye";
import NoDoublePress from "../tools/NoDoublePress";
const BZ=['东城区','西城区','朝阳区','丰台区','石景山区','海淀区','门头沟区','房山区','通州区','顺义区','昌平区','大兴区','怀柔区','平谷区','密云区','延庆区'];
const HZ = ['上城区','下城区','江干区','拱墅区','西湖区','滨江区','萧山区','余杭区','富阳区','临安区','桐庐县','淳安县','建德市'];
export default class CreateProlactin extends Component{
    static navigationOptions = {
        header: null
    };
    constructor(props){
        super(props);
        this.state = {
            sever_time:'1',
            other_time:'其他',
            type:'常规',
            show:false,
            price:'',
            name:'',
            count:'0',
            userInfo:'',
            contractsId:'',
            waiterArr:[],
            waiterId:'',
            scroll:true,
            area:BZ,
            employeeId:'',
            unitPrice:'400'
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
    changServerBtn(msg){
        if(msg!=='1' && msg!=='2'){
            this.setState({
                show:true
            })
        }else {
            this.setState({
                show:false,
                price:(msg*this.state.unitPrice+this.state.count*100).toString()
            })
        }
        this.setState({
            sever_time:msg
        })
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
    //其他按钮值改变
    changeDay(day){
        if(day){
            this.setState({
                sever_time:day,
                other_time:day,
                price:(day*this.state.unitPrice+this.state.count*100).toString(),
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
            waiterId:id
        })
    }
    //上户次数
    getCount(text){
        const newText = text.replace(/[^\d]+/, '');
        this.setState({
            count:newText
        });
        if(this.state.sever_time!=='其他' && newText<=this.state.sever_time){
           this.setState({
               price:(this.state.sever_time*400+newText*100).toString()
           })
        }
    }
    //验证数据
    checkData(){
        if(!this.state.waiterId){
            Toast('请确保服务员姓名的准确性和唯一性');
            return false;
        }
        if(!this.state.count>this.state.sever_time && this.state.sever_time!=='其他'){
            Toast('请确保上户次数不大于服务次数～');
            return false;
        }
        if(this.state.sever_time=='其他'){
            Toast('请选择服务次数～');
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
            cr_times:this.state.sever_time,
            cr_customers_times:this.state.count,
            employee_id:this.state.waiterId,
            customer_id:customerId,
            sign_user:this.state.waiterId,
            type:'cr',
            cr_price:this.state.unitPrice,
            cr_address:this.state.city+this.state.subCity+this.state.address,
            token:this.state.userInfo.token
        };
        data = dataReset(data);
        if(this.checkData()){
            feach_request('/pos_create_order','POST',data,this.props.navigation)
                .then((data)=>{
                    if(data.status==0){
                        this.setState({
                            contractsId:data.data.order.contracts_id
                        });
                        this.props.navigation.navigate('ProlactinInfo',{info:data.data.order});
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
            unitPrice:newText,
            price:(this.state.sever_time*newText+this.state.count*100).toString(),
        })
    }
    render(){
        const { navigate } = this.props.navigation;
        return(
            <View style={{flex:1,backgroundColor: '#fcfcfc'}}>
                <Header title={'母指单信息'} navigate={this.props.navigation}/>
                <ScrollView scrollEnabled={this.state.scroll}>
                <View style={{flex:1,flexDirection:'column',justifyContent:'space-between'}}>
                    <View style={{paddingHorizontal: px2dp(17)}}>
                        <SelectEmploye navigation={this.props.navigation} title={'服务员工'} getName={this.getName.bind(this)} waiter={'请输入服务员工姓名'} scroll={true} stopScroll={this.stopScroll.bind(this)}/>
                        <View style={styles.item_gap}>
                            <Text style={{fontSize: px2dp(14)}}>服务次数</Text>
                            <View style={[styles.flex_space_between,styles.title_item_gap]}>
                                <TouchableWithoutFeedback onPress={()=>{
                                    this.changServerBtn('1')
                                }}>
                                    <View style={[this.state.sever_time=='1'?styles.sex_btn_on:styles.sex_btn]}>
                                        <Text style={[styles.sex_font_style,this.state.sever_time=='1'?styles.sex_font_on:'']}>1次</Text>
                                    </View>
                                </TouchableWithoutFeedback>
                                <TouchableWithoutFeedback onPress={()=>{
                                    this.changServerBtn('2')
                                }}>
                                    <View style={[this.state.sever_time=='2'?styles.sex_btn_on:styles.sex_btn]}>
                                        <Text style={[styles.sex_font_style,this.state.sever_time=='2'?styles.sex_font_on:'']}>2次</Text>
                                    </View>
                                </TouchableWithoutFeedback>
                                <TouchableWithoutFeedback onPress={()=>{
                                    this.changServerBtn(this.state.other_time)
                                }}>
                                    <View style={[this.state.sever_time==this.state.other_time?styles.sex_btn_on:styles.sex_btn]}>
                                        <Text style={[styles.sex_font_style,this.state.sever_time==this.state.other_time?styles.sex_font_on:'']}>{this.state.other_time}{this.state.other_time=='其他'?'':'次'}</Text>
                                    </View>
                                </TouchableWithoutFeedback>
                                {
                                    this.state.show?(
                                        <OtherBtn type={'prolactin'} show={this.state.show} changeDay={this.changeDay.bind(this)} />
                                    ):(null)
                                }
                            </View>
                        </View>
                        <View style={[styles.flex_space_between,styles.item_gap]}>
                            <Text style={{fontSize: px2dp(14)}}>上户次数</Text>
                            <TextInput keyboardType='numeric' onChangeText={(text)=>{this.getCount(text)}} style={[styles.input_font,styles.flex,styles.input_style]} placeholder={'如在医院服务则不输入！'}/>
                        </View>
                        <View style={[styles.flex_space_between,styles.item_gap]}>
                            <Text style={{fontSize: px2dp(14)}}>服务单价</Text>
                            <TextInput keyboardType={'numeric'} onChangeText={(text)=>{this.getPrice(text)}} style={[styles.input_font,styles.flex,styles.input_style]} placeholder={'400'}/>
                        </View>
                        <View style={[styles.item_gap,styles.item_gap]}>
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
                        <View style={[styles.flex_space_between,styles.item_gap]}>
                            <Text style={{fontSize: px2dp(14)}}>订单金额</Text>
                            <TextInput value={this.state.price} style={[styles.input_font,styles.flex,styles.input_style]} placeholder={'系统将自动计算出订单金额'} editable={false}/>
                        </View>
                    </View>
                    <View style={{flexDirection:'row',justifyContent:'space-between',paddingHorizontal:px2dp(17)}}>
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
    input_style:{
        backgroundColor:'#ffffff',
        height:px2dp(40),
        borderRadius:5,
        elevation:3,
        paddingLeft: px2dp(10),
        marginLeft: px2dp(15)
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
    input_font:{
        fontSize:px2dp(15)
    },
    end_time_wrap:{
        paddingHorizontal: px2dp(40),
        marginTop:px2dp(19)
    },
    add_time_btn:{
        width:px2dp(100),
        height:px2dp(40),
        backgroundColor:'#ffffff',
        elevation:3,
        borderRadius:px2dp(5),
        justifyContent:'center',
        alignItems: 'center'
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
    padding_right:{
        paddingRight: px2dp(23)
    },
    area_down_box:{
        width:px2dp(115),
        height:px2dp(150),
        backgroundColor:'#fff',
        elevation:3,
        borderBottomRightRadius:px2dp(5),
        borderBottomLeftRadius:px2dp(5),
        borderTopColor:'#f2f2f2',
        marginRight:px2dp(6),
        marginTop:-px2dp(2)
    }
});