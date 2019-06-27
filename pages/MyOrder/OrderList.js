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
    DrawerLayoutAndroid,
    ActivityIndicator,
    TouchableOpacity,
    Keyboard
} from 'react-native';
var {width,height} = Dimensions.get('window');
import px2dp from './../tools/px2dp';
import Header from "./../CommonModules/Header";
import Icon from "react-native-vector-icons/FontAwesome";
import EmptyList from './../CommonModules/EmptyStyle';
import PageListView from 'react-native-page-listview';
import {dataReset,feach_request,getStorage,Toast} from './../tools/Public';
import constant from './../tools/constant';
import Loading from './../CommonModules/Loading';
export default class OrderList extends Component{
    static navigationOptions = {
        header: null
    };
    constructor(props){
        super(props);
        this.state = {
            tabType:'serving',
            orderState:'all',
            payTime:'all',
            payState:'all',
            payWay:'all',
            empty:false,
            arr:[],
            userInfo:'',
            loading:true,
            customer:'',
            filter:false,
            page:0,
            btnArr:{}
        }
        this.goOrderDetail=this.goOrderDetail.bind(this);
        this.renderRow=this.renderRow.bind(this);
    }
    //打开分类抽屉
    onPenRightDrawer() {
        this.drawer.openDrawer();
    }
    //筛选确认
    closeRightDrawer() {
        this.state.btnArr={};
        this.state.btnArr.contract_status=this.state.payWay;
        this.state.btnArr.contracts_type=this.state.orderState;
        this.state.btnArr.pay_time=this.state.payTime;
        this.state.btnArr.pay_status=this.state.payState;
        var data={
            offset:0,
            status:this.state.payWay,
            order_type:this.state.orderState,
            order_create:this.state.payTime,
            pay_status:this.state.payState,
            hospital:this.state.userInfo.name,
            token:this.state.userInfo.token
        };
        data = dataReset(data);
        feach_request('/pos_order_search','POST',data,this.props.navigation)
            .then((data)=>{
                if(data.status==0){
                    this.props.navigation.navigate('FilterOrderList',{source:'order',data:data.data.order,btnArr:this.state.btnArr});
                    this.drawer.closeDrawer();
                }

            })
            .catch((err)=>{
                console.log(err);
                Toast('出现未知错误，请稍后再试～');
            })
    }
    //订单类型切换
    changeOrderType(type){
        this.setState({
            orderState:type
        })
    }
    //支付时间切换
    changePayTime(type){
        this.setState({
            payTime:type
        })
    }
    //支付状态切换
    changePayState(type){
        this.setState({
            payState:type
        })
    }
    //支付方式切换
    changePayWay(type){
        this.setState({
            payWay:type
        })
    }
    //重置
    resetOption(){
        this.setState({
            orderState:'all',
            payTime:'all',
            payState:'all',
            payWay:'all'
        })
    }
    //页面Tab切换
    changeTab(state){
        this.setState({
            tabType:state,
            customer:'',
            loading:true
        });
        this.initData('tab',state,'')
    }
    //上拉加载
    loadMore=(page,callback)=>{
        this.setState({
            page:page
        })
        var data={
            offset:(page-1)*10,
            status:this.state.tabType,
            order_type:'all',
            order_create:'all',
            pay_status:'all',
            customer:this.state.customer,
            hospital:this.state.userInfo.name,
            token:this.state.userInfo.token
        };
        data = dataReset(data);
        feach_request('/pos_order_search','POST',data,this.props.navigation)
            .then((data)=>{
                callback(data.data.order)
            })
            .catch((err)=>{
                console.log(err);
                Toast('出现未知错误，请稍后再试～');
            })
    };
    //下拉刷新
    refresh=(callBack)=>{
        const name=this.props.navigation.state.params.name;
        if(name){
            this.setState({
                tabType:'all'
            })
        }
        getStorage('userInfo')
            .then(data=>{
                this.setState({
                    userInfo:data,
                    name:name
                })
                this.initData('init',this.state.tabType,name,callBack,data)
            }).catch(err=>{
            console.log(err)
        })
    }
    //头部搜索
    filterCustomer(){
        this.setState({
            tabType:'all',
            loading:true
        })
        this.initData('filter','all','');
        Keyboard.dismiss();
    }
    //数据初始化
    initData(source,type,name,callBack,userInfo){
        this.setState({
            page:0
        })
        var data={
            offset:0,
            status:type,
            order_type:'all',
            order_create:'all',
            pay_status:'all',
            customer:name?name:(source=='filter'?this.state.customer:''),
            hospital:this.state.userInfo.name,
            token:this.state.userInfo.token
        };
        data = dataReset(data);
        feach_request('/pos_order_search','POST',data,this.props.navigation)
            .then((data)=>{
                if(data.status==0){
                    this.setState({
                        loading:false
                    });
                    if(data.data.order.length==0){
                        this.setState({
                            empty:true
                        })
                    }else {
                        this.setState({
                            empty:false
                        });
                        if(source=='init'){
                            this.setState({
                                dataList:data.data.order
                            });
                            callBack(data.data.order);
                        }else {
                            this.PL.manualRefresh(data.data.order);
                        }

                    }
                }

            })
            .catch((err)=>{
                console.log(err);
                Toast('出现未知错误，请稍后再试～');
            })
    }
    //页面跳转
    goOrderDetail(rowData){
        if(rowData.type=='ys'){
            this.props.navigation.navigate('NannyOrderInfo',{hasBtn:true,rowData:rowData})
        }else if(rowData.type=='ph'){
            this.props.navigation.navigate('CareOrderInfo',{hasBtn:true,rowData:rowData})
        }else if(rowData.type=='cr'){
            this.props.navigation.navigate('ProlactinOrderInfo',{hasBtn:true,rowData:rowData})
        }else if(rowData.type=='dl'){
            this.props.navigation.navigate('DoulaOrderInfo',{hasBtn:true,rowData:rowData})
        }else if(rowData.type=='sw'){
            this.props.navigation.navigate('ProductDetails',{hasBtn:true,rowData:rowData})
        }
    }
    //列表渲染
    renderRow(rowData,index){
        // const { navigate } = this.props.navigation;
        return(
            <TouchableWithoutFeedback onPress={()=>{this.goOrderDetail(rowData)}}>
                <View style={styles.order_item}>
                    <View style={styles.flex_space_between}>
                        <View style={{flexDirection:'row'}}>
                            <Text style={styles.order_item_title}>客户姓名:</Text>
                            <Text style={styles.order_item_content}>{rowData.customer_name}</Text>
                        </View>
                        <Text style={rowData.status=='serving'?styles.green_color:(rowData.status=='done'?styles.gray_color:(rowData.status=='pending'?styles.yellow_color:styles.red_color))}>{constant[rowData.status]}</Text>
                    </View>
                    <View style={styles.flex_space_between}>
                        <View style={{flexDirection:'row'}}>
                            <Text style={styles.order_item_title}>订单类型:</Text>
                            <Text style={styles.order_item_content}>{constant[rowData.type]}</Text>
                            <Text style={styles.order_item_content}>{rowData.times}{rowData.type=='cr'?'次':(rowData.type=='dl'?'小时':(rowData.type=='sw'?'':'天'))}</Text>
                        </View>
                    </View>
                    <View style={styles.flex_space_between}>
                        <View style={{flexDirection:'row'}}>
                            <Text style={styles.order_item_title}>付款情况:</Text>
                            {
                                rowData.pay_status=='deposit' && rowData.arrears!=='0'?(
                                    <Text style={styles.order_item_content}>已付{rowData.already_pay}元 欠款{rowData.arrears}元</Text>
                                ):(
                                    <Text style={styles.order_item_content}>{constant[rowData.pay_status]}</Text>
                                )
                            }
                        </View>
                    </View>
                    <View style={styles.flex_space_between}>
                        <View style={{flexDirection:'row'}}>
                            <Text style={styles.order_item_title}>创建时间:</Text>
                            <Text style={styles.order_item_content}>{rowData.create_date}</Text>
                        </View>
                        <Icon name="angle-right" size={28} color="#b0b0b0" />
                    </View>
                </View>
            </TouchableWithoutFeedback>
        )
    }
    render(){
        const navigationView = (
            <View style={styles.draw_wrap}>
                <View>
                    <View style={styles.draw_item}>
                        <Text style={{fontSize:px2dp(16),color:'#333'}}>订单类型</Text>
                        <View style={styles.draw_btn_wrap}>
                            <TouchableWithoutFeedback onPress={()=>{this.changeOrderType('all')}}>
                                <View style={[styles.draw_btn,this.state.orderState=='all'?styles.draw_btn_on:'']}>
                                    <Text style={[styles.draw_btn_font,this.state.orderState=='all'?styles.draw_btn_font_on:'']}>全部</Text>
                                </View>
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback onPress={()=>{this.changeOrderType('ph')}}>
                                <View style={[styles.draw_btn,this.state.orderState=='ph'?styles.draw_btn_on:'']}>
                                    <Text style={[styles.draw_btn_font,this.state.orderState=='ph'?styles.draw_btn_font_on:'']}>陪护单</Text>
                                </View>
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback onPress={()=>{this.changeOrderType('cr')}}>
                                <View style={[styles.draw_btn,this.state.orderState=='cr'?styles.draw_btn_on:'']}>
                                    <Text style={[styles.draw_btn_font,this.state.orderState=='cr'?styles.draw_btn_font_on:'']}>母指单</Text>
                                </View>
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback onPress={()=>{this.changeOrderType('dl')}}>
                                <View style={[styles.draw_btn,this.state.orderState=='dl'?styles.draw_btn_on:'']}>
                                    <Text style={[styles.draw_btn_font,this.state.orderState=='dl'?styles.draw_btn_font_on:'']}>导乐单</Text>
                                </View>
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback onPress={()=>{this.changeOrderType('ys')}}>
                                <View style={[styles.draw_btn,this.state.orderState=='ys'?styles.draw_btn_on:'']}>
                                    <Text style={[styles.draw_btn_font,this.state.orderState=='ys'?styles.draw_btn_font_on:'']}>月嫂单</Text>
                                </View>
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback onPress={()=>{this.changeOrderType('sw')}}>
                                <View style={[styles.draw_btn,this.state.orderState=='sw'?styles.draw_btn_on:'']}>
                                    <Text style={[styles.draw_btn_font,this.state.orderState=='sw'?styles.draw_btn_font_on:'']}>产品单</Text>
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                    </View>
                    <View style={styles.draw_item}>
                        <Text style={{fontSize:px2dp(16),color:'#333'}}>创建时间</Text>
                        <View style={styles.draw_btn_wrap}>
                            <TouchableWithoutFeedback onPress={()=>{this.changePayTime('all')}}>
                                <View style={[styles.draw_btn,this.state.payTime=='all'?styles.draw_btn_on:'']}>
                                    <Text style={[styles.draw_btn_font,this.state.payTime=='all'?styles.draw_btn_font_on:'']}>全部</Text>
                                </View>
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback onPress={()=>{this.changePayTime('today')}}>
                                <View style={[styles.draw_btn,this.state.payTime=='today'?styles.draw_btn_on:'']}>
                                    <Text style={[styles.draw_btn_font,this.state.payTime=='today'?styles.draw_btn_font_on:'']}>今天</Text>
                                </View>
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback onPress={()=>{this.changePayTime('this_week')}}>
                                <View style={[styles.draw_btn,this.state.payTime=='this_week'?styles.draw_btn_on:'']}>
                                    <Text style={[styles.draw_btn_font,this.state.payTime=='this_week'?styles.draw_btn_font_on:'']}>本周</Text>
                                </View>
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback onPress={()=>{this.changePayTime('this_month')}}>
                                <View style={[styles.draw_btn,this.state.payTime=='this_month'?styles.draw_btn_on:'']}>
                                    <Text style={[styles.draw_btn_font,this.state.payTime=='this_month'?styles.draw_btn_font_on:'']}>本月</Text>
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                    </View>
                    <View style={styles.draw_item}>
                        <Text style={{fontSize:px2dp(16),color:'#333'}}>支付状态</Text>
                        <View style={styles.draw_btn_wrap}>
                            <TouchableWithoutFeedback onPress={()=>{this.changePayState('all')}}>
                                <View style={[styles.draw_btn,this.state.payState=='all'?styles.draw_btn_on:'']}>
                                    <Text style={[styles.draw_btn_font,this.state.payState=='all'?styles.draw_btn_font_on:'']}>全部</Text>
                                </View>
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback onPress={()=>{this.changePayState('deposit')}}>
                                <View style={[styles.draw_btn,this.state.payState=='deposit'?styles.draw_btn_on:'']}>
                                    <Text style={[styles.draw_btn_font,this.state.payState=='deposit'?styles.draw_btn_font_on:'']}>已付定金</Text>
                                </View>
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback onPress={()=>{this.changePayState('unpaid')}}>
                            <View style={[styles.draw_btn,this.state.payState=='unpaid'?styles.draw_btn_on:'']}>
                                <Text style={[styles.draw_btn_font,this.state.payState=='unpaid'?styles.draw_btn_font_on:'']}>未支付</Text>
                            </View>
                        </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback onPress={()=>{this.changePayState('paid')}}>
                                <View style={[styles.draw_btn,this.state.payState=='paid'?styles.draw_btn_on:'']}>
                                    <Text style={[styles.draw_btn_font,this.state.payState=='paid'?styles.draw_btn_font_on:'']}>已付全款</Text>
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                    </View>
                    <View style={styles.draw_item}>
                        <Text style={{fontSize:px2dp(16),color:'#333'}}>合同状态</Text>
                        <View style={styles.draw_btn_wrap}>
                            <TouchableWithoutFeedback onPress={()=>{this.changePayWay('all')}}>
                                <View style={[styles.draw_btn,this.state.payWay=='all'?styles.draw_btn_on:'']}>
                                    <Text style={[styles.draw_btn_font,this.state.payWay=='all'?styles.draw_btn_font_on:'']}>全部</Text>
                                </View>
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback onPress={()=>{this.changePayWay('done')}}>
                                <View style={[styles.draw_btn,this.state.payWay=='done'?styles.draw_btn_on:'']}>
                                    <Text style={[styles.draw_btn_font,this.state.payWay=='done'?styles.draw_btn_font_on:'']}>已完结</Text>
                                </View>
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback onPress={()=>{this.changePayWay('serving')}}>
                                <View style={[styles.draw_btn,this.state.payWay=='serving'?styles.draw_btn_on:'']}>
                                    <Text style={[styles.draw_btn_font,this.state.payWay=='serving'?styles.draw_btn_font_on:'']}>服务中</Text>
                                </View>
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback onPress={()=>{this.changePayWay('pending')}}>
                                <View style={[styles.draw_btn,this.state.payWay=='pending'?styles.draw_btn_on:'']}>
                                    <Text style={[styles.draw_btn_font,this.state.payWay=='pending'?styles.draw_btn_font_on:'']}>待服务</Text>
                                </View>
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback onPress={()=>{this.changePayWay('chargeback_done')}}>
                                <View style={[styles.draw_btn,this.state.payWay=='chargeback_done'?styles.draw_btn_on:'']}>
                                    <Text style={[styles.draw_btn_font,this.state.payWay=='chargeback_done'?styles.draw_btn_font_on:'']}>退单</Text>
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                    </View>
                </View>
                <View style={{paddingHorizontal:px2dp(18),flexDirection:'row',justifyContent: 'space-between',marginTop: px2dp(20)}}>
                    <TouchableWithoutFeedback onPress={()=>{this.resetOption()}}>
                        <View style={styles.draw_bottom_btn}>
                            <Text style={styles.draw_bottom_font}>重置</Text>
                        </View>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback onPress={()=>{this.closeRightDrawer()}}>
                        <View style={[styles.draw_bottom_btn,styles.draw_btn_on]}>
                            <Text style={[styles.draw_bottom_font,styles.draw_btn_font_on]}>查询</Text>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </View>
        );
        return(
            <DrawerLayoutAndroid
                drawerWidth={300}
                drawerPosition={DrawerLayoutAndroid.positions.Right}
                ref={(drawer) => {
                    this.drawer = drawer;
                }}
                renderNavigationView={() => navigationView}>
                <View style={{height:px2dp(150)}}>
                    <Header right={true} title={'订单列表'} navigate={this.props.navigation} onPenRightDrawer={this.onPenRightDrawer.bind(this)}/>
                    <View style={{elevation:3,backgroundColor:'#fff'}}>
                        <View style={styles.search_wrap}>
                            <View style={styles.sub_search_wrap}>
                                <TextInput placeholder={'请输入客户姓名/手机号'} style={styles.search_input} onChangeText={(text)=>{this.setState({customer:text})}} onSubmitEditing={()=>{this.filterCustomer()}}/>
                            </View>
                            <TouchableWithoutFeedback onPress={()=>{this.filterCustomer()}}>
                                <View style={styles.seek_symbol}>
                                    <Icon name="search" size={18} color="#a9a9a9"/>
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                        <View style={[styles.flex_space_between,styles.check_class_wrap]}>
                            <TouchableWithoutFeedback onPress={()=>{this.changeTab('serving')}}>
                                <View style={[styles.class_item,this.state.tabType=='serving'?styles.class_item_on:'']}>
                                    <Text style={[styles.class_item_title,this.state.tabType=='serving'?styles.class_title_blue:'']}>服务中</Text>
                                </View>
                            </TouchableWithoutFeedback>
                            <View style={styles.class_gap}></View>
                            <TouchableWithoutFeedback onPress={()=>{this.changeTab('done')}}>
                                <View style={[styles.class_item,this.state.tabType=='done'?styles.class_item_on:'']}>
                                    <Text style={[styles.class_item_title,this.state.tabType=='done'?styles.class_title_blue:'']}>已完单</Text>
                                </View>
                            </TouchableWithoutFeedback>
                            <View style={styles.class_gap}></View>
                            <TouchableWithoutFeedback onPress={()=>{this.changeTab('all')}}>
                                <View style={[styles.class_item,this.state.tabType=='all'?styles.class_item_on:'']}>
                                    <Text style={[styles.class_item_title,this.state.tabType=='all'?styles.class_title_blue:'']}>全部订单</Text>
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                    </View>
                </View>
                <View style={{flex:1,backgroundColor: '#fcfcfc',paddingTop: -px2dp(20)}}>
                    <Loading loading={this.state.loading}/>
                            <View style={this.state.empty?styles.listShow:styles.listHide}>
                                <EmptyList />
                            </View>
                            <View style={this.state.empty?styles.listHide:styles.listShow}>
                                <PageListView
                                    pageLen={10}
                                    style={{flex:1,backgroundColor: 'red'}}
                                    renderRow={this.renderRow}
                                    refresh={this.refresh}
                                    loadMore={this.loadMore}
                                    ref={(r)=>{!this.PL&&(this.PL=r)}}
                                />
                            </View>

                </View>
            </DrawerLayoutAndroid>

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
    search_wrap:{
        backgroundColor:'#fff',
        paddingHorizontal: px2dp(17),
        paddingVertical: px2dp(10),
        borderWidth: 1,
        borderColor:'#f2f2f2',
        height:px2dp(60)
    },
    sub_search_wrap:{
        width:px2dp(310),
        borderRadius:px2dp(13),
        backgroundColor:'#f2f2f2',
        height:px2dp(40)
    },
    search_input:{
        paddingLeft: px2dp(17),
        height:px2dp(40),
        fontSize:px2dp(13)
    },
    seek_symbol:{
        flex:1,
        position: 'absolute',
        right:0,
        top:px2dp(18),
        width:px2dp(50),
        height:px2dp(30),
        paddingLeft:px2dp(17)
    },
    check_class_wrap:{
        height:px2dp(43),
        paddingHorizontal: px2dp(20)
    },
    class_gap:{
        width:1,
        height:px2dp(25),
        backgroundColor:'#d9d9d9'
    },
    class_item:{
        width:px2dp(85),
        height:px2dp(43)
    },
    class_item_title:{
        fontSize: px2dp(14),
        lineHeight:px2dp(43),
        textAlign: 'center'
    },
    class_item_on:{
        borderBottomWidth:px2dp(2),
        borderBottomColor:'#64bdf9'
    },
    class_title_blue:{
        color:'#64bdf9'
    },
    more_btn:{
        marginHorizontal: px2dp(17),
        height:px2dp(42),
        backgroundColor:'#fff',
        elevation:3,
        marginVertical: px2dp(25),
        borderRadius: px2dp(5)
    },
    draw_wrap:{
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: px2dp(30),
        paddingBottom: px2dp(43),
        justifyContent: 'space-between'
    },
    draw_btn:{
        width:px2dp(72),
        height:px2dp(34),
        backgroundColor:'#fff',
        elevation:3,
        borderRadius: px2dp(5),
        marginRight:px2dp(10),
        marginBottom: px2dp(10)
    },
    draw_btn_font:{
        textAlign:'center',
        lineHeight:px2dp(34),
        fontSize:px2dp(15),
        color:'#64bdf9'
    },
    draw_btn_wrap:{
        flexWrap: 'wrap',
        marginTop: px2dp(10),
        flexDirection:'row'
    },
    draw_btn_on:{
        backgroundColor:'#64bdf9'
    },
    draw_btn_font_on:{
        color:'#fff'
    },
    draw_item:{
        borderBottomWidth:1,
        borderBottomColor:'#f2f2f2',
        paddingLeft:px2dp(18),
        marginBottom:px2dp(10)
    },
    draw_bottom_btn:{
        width:px2dp(115),
        height:px2dp(45),
        backgroundColor:'#fff',
        elevation:3,
        borderRadius: px2dp(5)
    },
    draw_bottom_font:{
        textAlign:'center',
        lineHeight:px2dp(45),
        fontSize:px2dp(16)
    },
    order_item:{
        flexDirection:'column',
        height:px2dp(155),
        paddingHorizontal:px2dp(17),
        paddingVertical: px2dp(23),
        borderBottomWidth:1,
        borderBottomColor:'#efefef',
        justifyContent:'space-between'
    },
    order_item_title:{
        fontSize:px2dp(13),
        color:'#4b4b4b',
        marginRight: px2dp(10)
    },
    order_item_content:{
        fontSize:px2dp(13),
        color:'#000',
        marginRight: px2dp(10)
    },
    green_color:{
        color:'#7ace2a',
        fontSize:px2dp(13)
    },
    red_color:{
        color:'#f54c6c',
        fontSize:px2dp(13)
    },
    yellow_color:{
        color:'#ffd43e',
        fontSize:px2dp(13)
    },
    gray_color:{
        color:'#7e7e7e',
        fontSize:px2dp(13)
    },
    listShow:{
        flex:1
    },
    listHide:{
        display: 'none'
    }
});