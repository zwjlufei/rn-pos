//顶部导航
import React, {Component} from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    StatusBar,
    Dimensions,
    TouchableWithoutFeedback,
    Image,
    TextInput,
    ImageBackground,
    BackHandler,
    ScrollView,
    FlatList, DeviceEventEmitter, AsyncStorage, Alert
} from 'react-native';
var {width,height} = Dimensions.get('window');
import Header from './../CommonModules/Header';
import px2dp from "./../tools/px2dp";
import {dataReset,feach_request,getStorage,Toast} from './../tools/Public';
export default class ProductDetails extends Component{
    static navigationOptions = {
        header: null
    };
    constructor(props){
        super(props);
        this.state = {
            msg:'',
            total:0,
            refreshing:false,
            goods:[],
            info:{},
            index:null
        }
        // this.getTotal=this.getTotal.bind(this);
    }
    componentWillMount(){
        // let goods = this.props.navigation.state.params.rowData;
        const rowData=this.props.navigation.state.params.rowData;
        console.log('rowData',rowData)
        // let goods = [{name:'商品1',num:1,price:1},{name:'商品2',num:3,price:5},{name:'商品3',num:4,price:10}]
        // this.getTotal(goods);
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
        console.log(data)
        feach_request('/pos_order_details','POST',data,this.props.navigation)
            .then((data)=>{
                if(data.status==0){
                    // data.data.order.order_id=rowData.id;
                    this.setState({
                        loading:false,
                        info:data.data.order,
                        goods:data.data.order.product,
                        total: data.data.order.amount
                    })
                }
            })
            .catch((err)=>{
                console.log(err);
                Toast('出现未知错误，请稍后再试～');
            })
    }
    //渲染列表
    renderList(item,index){
        return(
            <View style={styles.item_style}>
                <View style={[styles.flex]}>
                    <Text style={styles.font_center}>{item.name}</Text>
                </View>
                <View style={[styles.flex]}>
                    <Text style={styles.font_center}>{item.price}</Text>
                </View>
                <View style={[styles.car_wrap,styles.flex_around,styles.prl_15]}>
                    <Text style={{textAlign:'center',lineHeight:px2dp(25)}}>{item.quantity}</Text>
                </View>
            </View>
        )
    }
    render(){
        const { navigate } = this.props.navigation;
        return(
            <View style={[styles.flex,styles.container]}>
                <Header title={'产品订单详情'} navigate={this.props.navigation}/>
                <ScrollView style={styles.flex}>
                    <View style={styles.bottom_border}>
                        <Text style={styles.customer_name}>客户姓名:  {this.state.info.customer_name}</Text>
                        <Text style={styles.customer_name}>客户手机号:  {this.state.info.customer_phone}</Text>
                    </View>
                    <View style={styles.item_style}>
                        <Text style={[styles.flex,styles.font_center]}>名称</Text>
                        <View style={styles.nav_gap}></View>
                        <Text style={[styles.flex,styles.font_center]}>单价/元</Text>
                        <View style={styles.nav_gap}></View>
                        <View style={[styles.car_wrap]}>
                            <Text style={styles.font_center}>数量</Text>
                        </View>
                    </View>
                    <View>
                        {
                            this.state.goods.length>0?( <FlatList
                                data={this.state.goods}
                                renderItem={({item,index}) => this.renderList(item,index)}
                                keyExtractor={(item, index) => index.toString()}
                            />):(
                                <View>
                                    <Text style={{textAlign:'center',lineHeight:px2dp(100)}}>您的商品走丢了～</Text>
                                </View>
                            )
                        }
                    </View>
                    <View style={[styles.flex_space_between,styles.padding_gap]}>
                        <Text style={{fontSize:px2dp(14)}}>您本次订单金额</Text>
                        <View style={styles.money_wrap}>
                            <Image
                                source={require('./../../images/new_money_icon.png')}
                                style={{width:px2dp(30),height:px2dp(30)}}
                            />
                            <Text style={{fontSize:px2dp(25),color: '#64bdf9'}}>{this.state.total}</Text>
                        </View>
                    </View>
                </ScrollView>
                <View style={{flexDirection:'row',borderTopWidth: px2dp(1),borderTopColor:'#eee'}}>
                    <TouchableWithoutFeedback onPress={()=>{
                        Alert.alert(
                            '',
                            '您确定要进行退单吗？',
                            [
                                {text: '取消', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                                {text: '确定', onPress: () => {
                                        navigate('ProductBack',{info:this.state.info})
                                    }},
                            ],
                            { cancelable: false }
                        );
                    }}>
                        <View style={[styles.bottom_btn,styles.white_bg]}>
                            <Text style={[styles.bottom_btn_font,styles.blue_font]}>退单</Text>
                        </View>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback onPress={()=>{navigate('PayWays',{info:this.state.info,price:this.state.info.amount})}}>
                        <View style={styles.bottom_btn}>
                            <Text style={styles.bottom_btn_font}>立即支付</Text>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    flex:{
        flex: 1
    },
    container:{
        backgroundColor:'#fcfcfc'
    },
    nav_gap:{
        width:px2dp(1),
        height:px2dp(23),
        backgroundColor: "#d9d9d9"
    },
    item_center:{
        justifyContent:'center',
        alignItems:'center'
    },
    item_style:{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height:px2dp(45),
        borderBottomWidth: px2dp(1),
        borderBottomColor:'#e2e2e2'
    },
    prl_18:{
        paddingHorizontal: px2dp(18)
    },
    prl_15:{
        paddingHorizontal: px2dp(15)
    },
    flex_space_between:{
        flexDirection:'row',
        justifyContent: 'space-between',
        alignItems:'center'
    },
    car_wrap:{
        width:px2dp(150)
    },
    font_center:{
        textAlign:'center'
    },
    delete_btn:{
        width:px2dp(70),
        height:px2dp(30),
        borderWidth: px2dp(1),
        borderColor:'#b9b9b9',
        borderRadius:px2dp(5),
        backgroundColor:'#efefef'
    },
    delete_btn_font:{
        textAlign: 'center',
        lineHeight:px2dp(26)
    },
    total_money:{
        textAlign: 'right',
        marginTop: px2dp(20)
    },
    plr_18:{
        paddingHorizontal: px2dp(18)
    },
    bottom_border:{
        height:px2dp(90),
        borderBottomWidth: px2dp(1),
        borderBottomColor:'#e2e2e2',
        paddingHorizontal: px2dp(18)
    },
    customer_name:{
        lineHeight: px2dp(40),
        fontSize:px2dp(16),
        fontWeight: '600'
    },
    bottom_btn:{
        width:width/2,
        height:px2dp(46),
        backgroundColor:'#64bdf9'
    },
    bottom_btn_font:{
        textAlign: 'center',
        lineHeight:px2dp(46),
        fontSize:px2dp(18),
        color:'#fff'
    },
    white_bg:{
        backgroundColor:'#fff'
    },
    blue_font:{
        color:'#64bdf9'
    },
    flex_around:{
        flexDirection:'row',
        justifyContent: 'space-around',
        alignItems: 'center'
    },
    input_style:{
        width:px2dp(70),
        borderWidth:1,
        borderColor:'#cccccc',
        height:px2dp(27),
        borderRadius: px2dp(5),
        marginHorizontal: px2dp(15)
    },
    round:{
        width:px2dp(20),
        height:px2dp(20),
        borderRadius:px2dp(20),
        borderWidth:1,
        borderColor:'#cccccc'
    },
    blue_round:{
        borderColor:'#65bdf9'
    },
    padding_gap:{
        paddingHorizontal: px2dp(17),
        height:px2dp(55)
    },
    money_wrap:{
        flexDirection:'row',
        alignItems: 'center'
    },
    price_wrap:{
        width:px2dp(70),
        borderWidth:1,
        borderColor:'#cccccc',
        height:px2dp(27),
        borderRadius: px2dp(5),
        paddingVertical: 0
    }
});