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
    ScrollView, DeviceEventEmitter
} from 'react-native';
var {width,height} = Dimensions.get('window');
import px2dp from './../tools/px2dp';
import Header from "./../CommonModules/Header";
import {dataReset, feach_request, getStorage, Toast} from "../tools/Public";
import constant from './../tools/constant';
import Loading from './../CommonModules/Loading';
import EmptyList from "../CommonModules/EmptyStyle";
export default class NannyDetail extends Component{
    static navigationOptions = {
        header: null
    };
    constructor(props){
        super(props);
        this.state = {
            hasGive:false,
            user:{},
            order:[],
            info:{},
            loading:true
        }
    }

    componentWillMount(){
        const info=this.props.navigation.state.params.info;
        this.setState({
            user:info
        })
        getStorage('userInfo')
            .then(data=>{
                this.setState({
                    userInfo:data
                })
                // this.initData(rowData,data);
                this.initData(info,data);
            }).catch(err=>{
            console.log(err)
        })
    }
    //注册通知
    componentDidMount(){
        DeviceEventEmitter.addListener('UpdateData',()=>{
            //接收到详情页发送的通知，刷新首页的数据，改变按钮颜色和文字，刷新UI
            this.initData(this.state.user,this.state.userInfo);
        });
    }
    //数据初始化
    initData(info,userInfo){
        var data={
            waiter_id:info.id,
            token:userInfo.token
        };
        data = dataReset(data);
        feach_request('/pos_waiter_order','POST',data,this.props.navigation)
            .then((data)=>{
                if(data.status==0){
                    this.setState({
                        order:data.data.order,
                        info:data.data.info,
                        loading:false
                    })
                }
            })
            .catch((err)=>{
                console.log(err);
                Toast('出现未知错误，请稍后再试～');
            })
    }
    //历史接单数据跳转到详情页
    goOrderDetail(item){
        if(item.type=='ys'){
            this.props.navigation.navigate('NannyOrderInfo',{hasBtn:false,rowData: item})
        }else if(item.type=='ph'){
            this.props.navigation.navigate('CareOrderInfo',{hasBtn:false,rowData: item})
        }else if(item.type=='cr'){
            this.props.navigation.navigate('ProlactinOrderInfo',{hasBtn:false,rowData: item})
        }else if(item.type=='dl'){
            this.props.navigation.navigate('DoulaOrderInfo',{hasBtn:false,rowData: item})
        }
    }
    render(){
        const { navigate } = this.props.navigation;
        return(
            <View style={{flex:1,backgroundColor: '#fcfcfc'}}>
                <Header title={'员工资料'} navigate={this.props.navigation}/>
                <ScrollView>
                    <Loading loading={this.state.loading}/>
                    <View style={{paddingLeft: px2dp(18),paddingVertical: px2dp(25),flexDirection:'row'}}>
                        {/*<Image*/}
                            {/*style={styles.nanny_photo}*/}
                            {/*source={{uri: 'http://cdn.ayi800.com/image/3418a34f62664c29d518390552d321f9.jpg'}}*/}
                            {/*resizeMode='cover'*/}
                            {/*resizeMethod='auto'/>*/}
                        <Image
                            style={styles.nanny_photo}
                            source={{
                                uri:
                                    `data:image/png;base64,${this.state.user.image}`,
                            }}
                        />
                        <View style={styles.nanny_info}>
                            <View style={{flexDirection:'row',alignItems:'flex-end'}}>
                                <Text style={{fontSize:px2dp(15),color:'#000',marginRight:px2dp(10)}}>{this.state.user.name}</Text>
                                <Text style={this.state.info.hospital_status?styles.green_font:styles.red_font}>{this.state.info.hospital_status?'在岗':'离岗'}</Text>
                            </View>
                            <View style={{flexDirection:'row'}}>
                                <Text style={[styles.nanny_info_font,styles.margin_gap]}>{this.state.user.age}岁</Text>
                                <Text style={styles.nanny_info_font}>{this.state.info.native_place}</Text>
                            </View>
                            <Text style={styles.nanny_info_font}>价格：{this.state.info.price}元/天</Text>
                            <Text style={styles.nanny_info_font}>手机号: {this.state.info.phone_number}</Text>
                        </View>
                        <TouchableWithoutFeedback onPress={()=>{navigate('EditInfo',{info:this.state.info,id:this.state.user.id,name:this.state.user.name})}}>
                            <View style={styles.edit_wrap}>
                                <Image
                                    source={require('./../../images/edit.png')}
                                    style={styles.edit_img}
                                />
                                <Text>编辑</Text>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                    <View style={styles.module_gap}></View>
                    <View style={styles.order_wrap}>
                        <Text style={styles.order_title}>历史接单数据:</Text>
                        {
                            this.state.order.length==0?(
                                <EmptyList hint={'还没有接单记录哦～'}/>
                            ):(
                                this.state.order.map((item,index)=>{
                                    return(
                                        <TouchableWithoutFeedback key={index} onPress={()=>{this.goOrderDetail(item)}}>
                                            <View style={[styles.flex_space_between,styles.salary_item]}>
                                                <Text style={{fontSize:px2dp(13)}}>{item.start_datetime}</Text>
                                                <Text style={{fontSize:px2dp(13),color: '#64bdf9'}}>{constant[item.type]}({item.id})</Text>
                                                <Text style={{fontSize:px2dp(13)}}>{item.days}天</Text>
                                                <Text style={{fontSize:px2dp(13),marginRight: px2dp(10)}}>{constant[item.contract_status]}</Text>
                                            </View>
                                        </TouchableWithoutFeedback>
                                    )
                                })
                            )
                        }
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
    salary_item:{
        paddingHorizontal: px2dp(18),
        height:px2dp(50),
        borderBottomWidth: 1,
        borderBottomColor: '#efefef'
    },
    module_gap:{
        height:px2dp(5),
        backgroundColor:'#efefef'
    },
    nanny_photo:{
        width: px2dp(110),
        height: px2dp(110),
        resizeMode: "contain",
        borderRadius:px2dp(5)
    },
    nanny_info:{
        flexDirection:'column',
        justifyContent: 'space-between',
        marginLeft: px2dp(20),
        paddingVertical: px2dp(5)
    },
    nanny_info_font:{
        fontSize:px2dp(13),
        color:'#8a8a8a'
    },
    margin_gap:{
        marginRight:px2dp(20)
    },
    edit_img:{
        width:px2dp(9),
        height:px2dp(10),
        marginRight:px2dp(10)
    },
    edit_wrap:{
        flexDirection:'row',
        alignItems:'center',
        height:30,
        paddingTop:px2dp(9),
        flex:1,
        justifyContent:'flex-end',
        paddingRight: px2dp(20)
    },
    order_wrap:{
        paddingTop: px2dp(30),
        backgroundColor:'#fff'
    },
    order_title:{
        paddingLeft: px2dp(17),
        fontSize:px2dp(15),
        color:'#333',
        fontWeight: '600',
        letterSpacing: px2dp(2)
    },
    green_font:{
        fontSize:px2dp(12),
        color:'#7ace2a'
    },
    red_font:{
        fontSize:px2dp(12),
        color:'#f54c6c'
    }
});