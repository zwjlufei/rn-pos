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
    FlatList, DeviceEventEmitter, AsyncStorage, Modal
} from 'react-native';
var {width,height} = Dimensions.get('window');
import Header from './../CommonModules/Header';
import px2dp from "./../tools/px2dp";
import {dataReset,feach_request,getStorage,Toast} from './../tools/Public';
export default class ProductBack extends Component{
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
            index:null,
            modalVisible: false
        }
    }
    componentWillMount(){
        let info = this.props.navigation.state.params.info;
        console.log('info',info)
        let total = 45;
        info.product.map((item,index)=>{
            item.num=item.quantity
        })
        this.setState({
            info:info,
            goods:info.product,
            total:info.already_pay,
            initPrice:info.already_pay?true:false
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
    //数量减少
    minus(item,index){
        const arr = JSON.parse(JSON.stringify(this.state.goods));
        var price = this.state.total;
        if(arr[index].num==0){
            Toast('商品退还数量不能小于0～')
        }else {
            if(this.state.initPrice){
                arr[index].num--;
                price = price - item.price;
                this.setState({
                    total:price,
                    goods:arr
                });
            }else {
                Toast('您还没有付款，无法修改商品数量～')
            }
        }

    }
    //数量增加
    add(item,index){
        const arr = JSON.parse(JSON.stringify(this.state.goods));
        let price = this.state.total;
        arr[index].num++;
        if(arr[index].num>item.quantity){
            Toast('商品退还数量不能大于购买数量～')
        }else {
            price = price + item.price;
            this.setState({
                total:price,
                goods:arr
            });
        }
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
    //提交审核
    goBack(){
        if(this.state.initPrice==0 || this.state.total>0){
            this.setState({
                modalVisible: true
            })
        }else {
            Toast('使用产品已达上限，无法提交~')
        }
    }
    //确定金额提交数据
    submitData(){
        this.setState({
            modalVisible: false
        });
        let backArr = [];
        this.state.goods.map((item,index)=>{
            if(item.num>0){
                backArr.push(item)
            }
        });
        console.log(backArr)
        var data={
            products:JSON.stringify(backArr),
            order_id:this.state.info.order_id,
            amount:this.state.total,
            type:'sw',
            hospital:this.state.userInfo.name,
            token:this.state.userInfo.token
        };
        data = dataReset(data);
        feach_request('/pos_contracts_charge_back','POST',data,this.props.navigation)
            .then((data)=>{
                if(data.status==0){
                    if (this.state.initPrice==0){
                        Toast('已退单～')
                    } else {
                        Toast('已提交审核～')
                    }
                }
            })
            .catch((err)=>{
                console.log(err);
                Toast('出现未知错误，请稍后再试～');
            })
    }
    render(){
        const { navigate } = this.props.navigation;
        return(
            <View style={[styles.flex,styles.container]}>
                <Header title={'产品退单'} navigate={this.props.navigation}/>
                <ScrollView style={styles.flex}>
                    <View style={styles.bottom_border}>
                        <Text style={styles.customer_name}>客户姓名:   {this.state.info.customer_name}</Text>
                        <Text style={styles.customer_name}>客户手机号:   {this.state.info.customer_phone}</Text>
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
                </ScrollView>
                <TouchableWithoutFeedback onPress={()=>{this.goBack()}}>
                    <View style={styles.bottom_btn}>
                        <Text style={styles.bottom_btn_font}>提交审核</Text>
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
                            <Text style={{textAlign:'center',fontSize:px2dp(18),marginBottom: px2dp(20)}}>本次退款金额</Text>
                            <Text style={{textAlign:'center',fontSize:px2dp(20),color:'#65bdf9'}}>{this.state.total}元</Text>
                            <View style={[styles.flex_space_between,styles.plr_17]}>
                                <TouchableWithoutFeedback onPress={()=>{
                                    this.setState({
                                        modalVisible: false
                                    })
                                }}>
                                    <View style={[styles.modal_btn,styles.white_bg]}>
                                        <Text style={{color:'#64bdf9',textAlign:'center',lineHeight:px2dp(40),fontSize:px2dp(16)}}>取消</Text>
                                    </View>
                                </TouchableWithoutFeedback>
                                <TouchableWithoutFeedback onPress={()=>{this.submitData();}}>
                                    <View style={styles.modal_btn}>
                                        <Text style={{color:'#fff',textAlign:'center',lineHeight:px2dp(40),fontSize:px2dp(16)}}>确定</Text>
                                    </View>
                                </TouchableWithoutFeedback>
                            </View>
                        </View>
                    </View>
                </Modal>
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
        width:px2dp(70),
        borderWidth:1,
        borderColor:'#cccccc',
        height:px2dp(27),
        borderRadius: px2dp(5),
        paddingVertical: 0
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
        width:px2dp(90),
        height:px2dp(40),
        borderRadius:px2dp(5),
        backgroundColor:'#64bdf9',
        marginTop:px2dp(30),
        elevation:3
    },
    plr_17:{
        paddingHorizontal:px2dp(17)
    },
    white_bg:{
        backgroundColor:'#fff'
    }
});