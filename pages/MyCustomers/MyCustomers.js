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
export default class MyCustomers extends Component{
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
        this.renderRow=this.renderRow.bind(this);
    }
    //上拉加载
    loadMore=(page,callback)=>{
        this.setState({
            page:page
        })
        var data={
            offset:(page-1)*10,
            name:this.state.customer,
            hospital:this.state.userInfo.name,
            token:this.state.userInfo.token
        };
        data = dataReset(data);
        feach_request('/pos_customer_search','POST',data,this.props.navigation)
            .then((data)=>{
                callback(data.data.customers)
            })
            .catch((err)=>{
                console.log(err);
                Toast('出现未知错误，请稍后再试～');
            })
    };
    //下拉刷新
    refresh=(callBack)=>{
        getStorage('userInfo')
            .then(data=>{
                this.setState({
                    userInfo:data
                })
                this.initData('init',this.state.tabType,callBack,data)
            }).catch(err=>{
            console.log(err)
        })
    }
    //头部搜索
    filterCustomer(){
        this.initData('filter','all');
        Keyboard.dismiss();
    }
    //数据初始化
    initData(source,type,callBack,userInfo){
        this.setState({
            page:0
        })
        var data={
            offset:0,
            name :source=='filter'?this.state.customer:'',
            hospital:this.state.userInfo.name,
            token:this.state.userInfo.token
        };
        data = dataReset(data);
        feach_request('/pos_customer_search','POST',data,this.props.navigation)
            .then((data)=>{
                if(data.status==0){
                    this.setState({
                        loading:false
                    });
                    if(data.data.customers.length==0){
                        this.setState({
                            empty:true
                        })
                    }else {
                        this.setState({
                            empty:false
                        });
                        if(source=='init'){
                            this.setState({
                                dataList:data.data.customers
                            });
                            callBack(data.data.customers);
                        }else {
                            this.PL.manualRefresh(data.data.customers);
                        }

                    }
                }

            })
            .catch((err)=>{
                console.log(err);
                Toast('出现未知错误，请稍后再试～');
            })
    }
    //列表渲染
    renderRow(rowData,index){
        const { navigate } = this.props.navigation;
        return(
            <View style={[styles.order_item,styles.flex_space_between]}>
                <Text style={[styles.flex,styles.order_item_title]}>{rowData.bed_no?rowData.bed_no+'床':'无'}</Text>
                <Text style={[styles.flex,styles.order_item_title]}>{rowData.name}({rowData.order_sum})</Text>
                <Text style={[styles.flex,styles.order_item_title]}>{rowData.create_date}</Text>
                <View style={[styles.flex,styles.last_item]}>
                    {/*<TouchableWithoutFeedback onPress={()=>{navigate('OrderList',{name:rowData.name})}}>*/}
                        {/*<View style={[styles.btn_style,styles.mb_10]}>*/}
                            {/*<Text style={styles.order_item_content}>客户订单</Text>*/}
                        {/*</View>*/}
                    {/*</TouchableWithoutFeedback>*/}
                    <TouchableWithoutFeedback onPress={()=>{navigate('CreateOrder',{native:'customerList',name:rowData.name,customer:rowData})}}>
                        <View  style={styles.btn_style}>
                            <Text style={styles.order_item_content}>创建订单</Text>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </View>
        )
    }
    render(){
        return(
            <View style={{flex:1,backgroundColor:'#fcfcfc'}}>
                <View style={{height:px2dp(150)}}>
                    <Header title={'我的客户'} navigate={this.props.navigation}/>
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
                            <View style={styles.class_item}>
                                <Text style={styles.class_item_title}>床号</Text>
                            </View>
                            <View style={styles.class_gap}></View>
                            <View style={styles.class_item}>
                                <Text style={styles.class_item_title}>姓名(订单数)</Text>
                            </View>
                            <View style={styles.class_gap}></View>
                            <View style={styles.class_item}>
                                <Text style={styles.class_item_title}>创建时间</Text>
                            </View>
                            <View style={styles.class_gap}></View>
                            <View style={styles.class_item}>
                                <Text style={styles.class_item_title}>操作</Text>
                            </View>
                        </View>
                    </View>
                </View>
                <View style={{flex:1,backgroundColor: '#fcfcfc'}}>
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
        height:px2dp(43)
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
        height:px2dp(90),
        paddingVertical: px2dp(10),
        borderBottomWidth:1,
        borderBottomColor:'#efefef'
    },
    order_item_title:{
        fontSize:px2dp(13),
        color:'#4b4b4b',
        textAlign:'center'
    },
    order_item_content:{
        fontSize:px2dp(13),
        color:'#fff',
        textAlign:'center',
        lineHeight:px2dp(33)
    },
    listShow:{
        flex:1
    },
    listHide:{
        display: 'none'
    },
    btn_style:{
        width:px2dp(75),
        height:px2dp(35),
        elevation:2,
        backgroundColor:'#64bdf9',
        borderRadius:px2dp(8)
    },
    mb_10:{
        marginBottom:px2dp(15)
    },
    last_item:{
        alignItems: 'center'
    }
});