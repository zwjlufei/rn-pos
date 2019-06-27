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
import {dataReset, feach_request, getStorage, Toast} from "../tools/Public";
import Loading from "../CommonModules/Loading";
import constant from "../tools/constant";
export default class DoulaOrderInfo extends Component{
    static navigationOptions = {
        header: null
    };
    constructor(props){
        super(props);
        this.state = {
            hasGive:false,
            info:'',
            userInfo:''
        }
    }
    componentWillMount(){
        const rowData=this.props.navigation.state.params.rowData;
        getStorage('userInfo')
            .then(data=>{
                this.setState({
                    userInfo:data
                })
                this.initData(rowData,data);
            }).catch(err=>{
            console.log(err)
        })

    }
    //数据初始化
    initData(rowData,userInfo){
        var data={
            order_id:rowData.id,
            order_type:rowData.type,
            token:userInfo.token
        };
        data = dataReset(data);
        feach_request('/pos_order_details','POST',data,this.props.navigation)
            .then((data)=>{
                if(data.status==0){
                    data.data.order.order_id=rowData.id;
                    this.setState({
                        loading:false,
                        info:data.data.order
                    })
                }
            })
            .catch((err)=>{
                console.log(err);
                Toast('出现未知错误，信息无法提交～');
            })
    }
    render(){
        const { navigate } = this.props.navigation;
        const hasBtn = this.props.navigation.state.params.hasBtn;
        return(
            <View style={{flex:1,backgroundColor: '#fcfcfc'}}>
                <Header title={'导乐单信息'} navigate={this.props.navigation}/>
                {
                    this.state.info?(
                        <ScrollView>
                            <View style={styles.info_item}>
                                <View style={styles.flex_space_between}>
                                    <Text style={styles.item_title}>客户姓名:</Text>
                                    <Text style={styles.item_content}>{this.state.info.customer_name}</Text>
                                </View>
                                <View style={styles.flex_space_between}>
                                    <Text style={styles.item_title}>客户手机号:</Text>
                                    <Text style={styles.item_content}>{this.state.info.customer_phone}</Text>
                                </View>
                                <View style={styles.flex_space_between}>
                                    <Text style={styles.item_title}>客户身份证号:</Text>
                                    <Text style={styles.item_content}>{this.state.info.customer_id_number?this.state.info.customer_id_number:'无'}</Text>
                                </View>
                                <View style={styles.flex_space_between}>
                                    <Text style={styles.item_title}>宝宝生日:</Text>
                                    <Text style={styles.item_content}>{this.state.info.customer_birth}</Text>
                                </View>
                                <View style={styles.flex_space_between}>
                                    <Text style={styles.item_title}>宝宝性别:</Text>
                                    <Text style={styles.item_content}>{constant[this.state.info.customer_sex]}</Text>
                                </View>
                            </View>
                            <View style={styles.info_item}>
                                <View style={styles.flex_space_between}>
                                    <Text style={styles.item_title}>订单号:</Text>
                                    <Text style={styles.item_content}>{this.state.info.order_id}</Text>
                                </View>
                                <View style={styles.flex_space_between}>
                                    <Text style={styles.item_title}>创建时间:</Text>
                                    <Text style={styles.item_content}>{this.state.info.create_date}</Text>
                                </View>
                                <View style={styles.flex_space_between}>
                                    <Text style={styles.item_title}>床号:</Text>
                                    <Text style={styles.item_content}>{this.state.info.bed_no}</Text>
                                </View>
                                <View style={styles.flex_space_between}>
                                    <Text style={styles.item_title}>订单类型:</Text>
                                    <Text style={styles.item_content}>{constant[this.state.info.order_type]}</Text>
                                </View>
                                <View style={styles.flex_space_between}>
                                    <Text style={styles.item_title}>订单状态:</Text>
                                    <Text style={[styles.item_content,styles.strong_font]}>{constant[this.state.info.status]}</Text>
                                </View>
                                <View style={styles.flex_space_between}>
                                    <Text style={styles.item_title}>服务类型:</Text>
                                    <Text style={styles.item_content}>{constant[this.state.info.service_type]}  {constant[this.state.info.parturition_type]}</Text>
                                </View>
                                <View style={styles.flex_space_between}>
                                    <Text style={styles.item_title}>服务开始时间:</Text>
                                    <Text style={styles.item_content}>{this.state.info.start_datetime}</Text>
                                </View>
                                <View style={styles.flex_space_between}>
                                    <Text style={styles.item_title}>服务结束时间:</Text>
                                    <Text style={styles.item_content}>{this.state.info.end_datetime}</Text>
                                </View>
                                <View style={styles.flex_space_between}>
                                    <Text style={styles.item_title}>订单金额:</Text>
                                    <Text style={[styles.item_content,styles.blue_color]}>{this.state.info.amount}元</Text>
                                </View>
                            </View>
                            <View style={styles.info_item}>
                                <View style={styles.flex_space_between}>
                                    <Text style={styles.item_title}>服务员工姓名:</Text>
                                    <Text style={styles.item_content}>{this.state.info.employee_name}</Text>
                                </View>
                            </View>
                        </ScrollView>
                        ):(
                        <Loading loading={this.state.loading}/>
                    )
                }
                {
                    hasBtn&&this.state.info?(
                        <View style={[styles.flex_space_between,styles.bottom_btn_wrap]}>
                            <TouchableWithoutFeedback onPress={()=>{navigate('DoulaPay',{info:this.state.info})}}>
                                <View style={[styles.bottom_btn,styles.bottom_btn_on]}>
                                    <Text style={[styles.bottom_btn_font,styles.bottom_btn_font_on]}>立即支付</Text>
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                    ):(null)
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
    item_title:{
        flex:1,
        fontSize:px2dp(13),
        color:'#4b4b4b',
        lineHeight:px2dp(32)
    },
    item_content:{
        flex:2,
        fontSize:px2dp(14),
        color:'#000',
        lineHeight:px2dp(32)
    },
    info_item:{
        borderBottomWidth: 1,
        borderBottomColor:'#efefef',
        paddingVertical: px2dp(24),
        paddingHorizontal: px2dp(18)
    },
    bottom_btn:{
        flex:1,
        height:px2dp(50)
    },
    bottom_btn_font:{
        textAlign:'center',
        color:'#64bdf9',
        fontSize:px2dp(18),
        lineHeight:px2dp(50)
    },
    bottom_btn_on:{
        backgroundColor:'#64bdf9'
    },
    bottom_btn_font_on:{
        color:'#fff'
    },
    bottom_btn_wrap:{
        height:px2dp(50),
        elevation:3,
        backgroundColor: '#fff'
    },
    btn_gap:{
        width:1,
        height:px2dp(25),
        backgroundColor:'#d9d9d9'
    },
    blue_color:{
        color:'#64bdf9'
    },
    strong_font:{
        fontWeight: '600'
    }
});