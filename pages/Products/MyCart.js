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
    FlatList, DeviceEventEmitter, AsyncStorage
} from 'react-native';
var {width,height} = Dimensions.get('window');
import Header from './../CommonModules/Header';
import px2dp from "./../tools/px2dp";
import {dataReset,feach_request,getStorage,Toast} from './../tools/Public';
export default class MyCart extends Component{
    static navigationOptions = {
        header: null
    };
    constructor(props){
        super(props);
        this.state = {
            msg:'',
            total:0,
            refreshing:false,
            data:[],
            info:{},
            index:null
        }
        this.getTotal=this.getTotal.bind(this);
    }
    componentWillMount(){
        let goods = this.props.navigation.state.params.goods;
        this.getTotal(goods);
        this.setState({
            data:goods
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
    //计算订单金额
    getTotal(goods){
        let total=0;
        goods.map((item,index)=>{
            total = total + item.price*item.num;
        })
        this.setState({
            total:total
        })
    }
    //数量减少
    minus(item,index){
        const arr = JSON.parse(JSON.stringify(this.state.data));
        var price = this.state.total;
        arr[index].num--;
        price = price - item.price;
        if(arr[index].num==0){
            this.setState({
                index: index
            })
            arr.splice(index,1);
            // Toast('商品数量不能小于1～')
        }
        this.setState({
            total:price,
            data:arr
        });
    }
    //数量增加
    add(item,index){
        const arr = JSON.parse(JSON.stringify(this.state.data));
        var price = this.state.total;
        arr[index].num++;
        price = price + item.price;
        this.setState({
            total:price,
            data:arr
        });
    }
    //渲染列表
    renderList(item,index){
        return(
            <View style={styles.item_style}>
                <View style={[styles.flex]}>
                    <Text style={styles.font_center}>{item.name}</Text>
                </View>
                <View style={[styles.flex,styles.item_center]}>
                    <Text style={styles.font_center}>{item.price}</Text>
                </View>
                <View style={[styles.car_wrap,styles.flex_around,styles.prl_15]}>
                    <TouchableWithoutFeedback onPress={()=>{this.minus(item,index)}}>
                        <View  style={styles.round}>
                            <Text  style={{textAlign:'center',lineHeight:px2dp(18),color: '#cccccc'}}>—</Text>
                        </View>
                    </TouchableWithoutFeedback>
                    <View style={styles.input_style}>
                        <Text style={{textAlign:'center',lineHeight:px2dp(25)}}>{item.num}</Text>
                    </View>
                    <TouchableWithoutFeedback onPress={()=>{this.add(item,index)}}>
                        <View style={[styles.round,styles.blue_round]}>
                            <Text style={{textAlign:'center',lineHeight:px2dp(18),color: '#64bdf9'}}>+</Text>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </View>
        )
    }
    //立即支付
    goPay(){
        // this.props.navigation.navigate('PayWays',{info:this.state.info,price:this.state.total});
        const customerId=this.props.navigation.state.params.customerId;
        //如果购物车为空不可提交
        var data={
            products:JSON.stringify(this.state.data),
            customer_id:customerId,
            type:'sw',
            amount:this.state.total,
            token:this.state.userInfo.token
        };
        data = dataReset(data);
        console.log(data)
        feach_request('/pos_create_order','POST',data,this.props.navigation)
            .then((data)=>{
                if(data.status==0){
                    this.props.navigation.navigate('PayWays',{info:data.data.order,price:data.data.order.amount});
                }
            })
            .catch((err)=>{
                console.log(err);
                Toast('出现未知错误，请稍后再试～');
            })
    }
    render(){
        const { navigate } = this.props.navigation;
        const name=this.props.navigation.state.params.name;
        return(
            <View style={[styles.flex,styles.container]}>
                <Header title={'购物车'} navigate={this.props.navigation}/>
                <ScrollView style={styles.flex}>
                    <View style={styles.bottom_border}>
                        <Text style={styles.customer_name}>客户姓名:  {name}</Text>
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
                            this.state.data.length>0?( <FlatList
                                data={this.state.data}
                                renderItem={({item,index}) => this.renderList(item,index)}
                                keyExtractor={(item, index) => index.toString()}
                            />):(
                                <View>
                                    <Text style={{textAlign:'center',lineHeight:px2dp(100)}}>您的购物车空啦～</Text>
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
                            <Text style={{textAlign:'center',fontSize:px2dp(25),color:'#65bdf9'}}>{this.state.total}</Text>
                            {/*<TextInput keyboardType='numeric' onChangeText={(text)=>{this.setState({total:text})}} style={styles.price_wrap} defaultValue={this.state.total.toString()}/>*/}
                        </View>
                    </View>
                </ScrollView>
                <TouchableWithoutFeedback onPress={()=>{this.goPay()}}>
                    <View style={styles.bottom_btn}>
                        <Text style={styles.bottom_btn_font}>立即支付</Text>
                    </View>
                </TouchableWithoutFeedback>
            </View>
        )
    }
    // //页面将要离开的是时候发送通知
    componentWillUnmount(){
        // AsyncStorage.setItem('carData',JSON.stringify(this.state.data));
        DeviceEventEmitter.emit('UpdatePage',this.state.data,this.state.total);
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
        height:px2dp(43),
        borderBottomWidth: px2dp(1),
        borderBottomColor:'#e2e2e2',
        paddingHorizontal: px2dp(18)
    },
    customer_name:{
        lineHeight: px2dp(43),
        fontSize:px2dp(16),
        fontWeight: '600'
    },
    bottom_btn:{
        width:width,
        height:px2dp(46),
        backgroundColor:'#64bdf9'
    },
    bottom_btn_font:{
        textAlign: 'center',
        lineHeight:px2dp(40),
        fontSize:px2dp(16),
        color:'#fff'
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
        paddingHorizontal:px2dp(12),
        borderBottomWidth:1,
        borderBottomColor:'#cccccc',
        height:px2dp(27),
        borderRadius: px2dp(5),
        paddingVertical: 0,
        color:'#65bdf9',
        fontSize:px2dp(25)
    }
});