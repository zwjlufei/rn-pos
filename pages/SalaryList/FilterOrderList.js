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
    DrawerLayoutAndroid
} from 'react-native';
var {width,height} = Dimensions.get('window');
import px2dp from './../tools/px2dp';
import Header from "./../CommonModules/Header";
import Icon from "react-native-vector-icons/FontAwesome";
import constant from './../tools/constant';
import PageListView from 'react-native-page-listview';
import {dataReset,feach_request,getStorage,Toast} from './../tools/Public';
import EmptyList from "../CommonModules/EmptyStyle";
export default class FilterOrderList extends Component{
    static navigationOptions = {
        header: null
    };
    constructor(props){
        super(props);
        this.state = {
            hasGive:false,
            title:'',
            type:'',
            userInfo:''
        }
        this.orderRefresh=this.orderRefresh.bind(this);
        this.orderLoadMore=this.orderLoadMore.bind(this);
        this.renderOrder=this.renderOrder.bind(this);
        this.goOrderDetail=this.goOrderDetail.bind(this);
    }
    componentWillMount(){
        const source = this.props.navigation.state.params.source;
        if(source=='salary'){
            this.setState({
                title:'工资列表'
            })
        }else {
            this.setState({
                title:'订单列表'
            })
        }
        getStorage('userInfo')
            .then(data=>{
                this.setState({
                    userInfo:data
                })
            }).catch(err=>{
            console.log(err)
        })
    }
    //上拉加载
    orderLoadMore=(page,callback)=>{
        const btnArr=this.props.navigation.state.params.btnArr;
        var data={
            offset:(page-1)*10,
            status:btnArr.contract_status,
            order_type:btnArr.contracts_type,
            order_create:btnArr.pay_time,
            pay_status:btnArr.pay_status,
            hospital:this.state.userInfo.name,
            token:this.state.userInfo.token
        };
        data = dataReset(data);
        console.log(data)
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
    orderRefresh=(callBack)=>{
        const listData=this.props.navigation.state.params.data;
        callBack(listData)
    }
    renderItem(){
        const source = this.props.navigation.state.params.source;
        const { navigate } = this.props.navigation;
        if(source=='salary'){
            return(
                <TouchableWithoutFeedback onPress={()=>{navigate('SalaryDetail')}}>
                    <View style={[styles.flex_space_between,styles.salary_item]}>
                        <Text style={{fontSize:px2dp(13)}}>周晓日(月嫂)</Text>
                        <Text style={{fontSize:px2dp(13)}}>10月份工资</Text>
                        <View style={{flexDirection: 'row',alignItems: 'center'}}>
                            {
                                this.state.hasGive?(
                                    <Text style={{fontSize:px2dp(13),color: '#f54c6c',marginRight: px2dp(10)}}>未发</Text>
                                ):(
                                    <Text style={{fontSize:px2dp(13),color: '#7ace2a',marginRight: px2dp(10)}}>已发</Text>
                                )
                            }
                            <Icon name="angle-right" size={28} color="#b0b0b0" />
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            )
        }else{
            return(
                //注意跳转时根据订单类型不同跳转不同页面
                <PageListView
                    pageLen={10}
                    renderRow={this.renderOrder}
                    refresh={this.orderRefresh}
                    loadMore={this.orderLoadMore}
                />
            )
        }
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
    //订单列表渲染
    renderOrder(rowData){
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
        const source = this.props.navigation.state.params.source;
        const btnArr = this.props.navigation.state.params.btnArr;
        const listData=this.props.navigation.state.params.data;
        return(
            <View  style={{flex:1,backgroundColor: '#fcfcfc'}}>
                <View style={{elevation: 1,backgroundColor:'#fff'}}>
                    <Header title={this.state.title} navigate={this.props.navigation}/>
                    <View style={styles.filter_result_wrap}>
                        <Text style={{fontSize:px2dp(16),color:'#333'}}>根据以下条件筛选</Text>
                        {
                            source=='salary'?(
                                <View style={styles.filter_btn_wrap}>
                                    <View style={styles.filter_btn}>
                                        <Text style={styles.filter_btn_font}>本月</Text>
                                    </View>
                                </View>
                            ):(
                                <View style={styles.filter_btn_wrap}>
                                    {
                                        btnArr.contract_status=='all'?(null):(
                                            <View style={styles.filter_btn}>
                                                <Text style={styles.filter_btn_font}>{constant[btnArr.contract_status]}</Text>
                                            </View>
                                        )
                                    }
                                    {
                                        btnArr.contracts_type=='all'?(null):(
                                            <View style={styles.filter_btn}>
                                                <Text style={styles.filter_btn_font}>{constant[btnArr.contracts_type]}</Text>
                                            </View>
                                        )
                                    }
                                    {
                                        btnArr.pay_time=='all'?(null):(
                                            <View style={styles.filter_btn}>
                                                <Text style={styles.filter_btn_font}>{constant[btnArr.pay_time]}</Text>
                                            </View>
                                        )
                                    }
                                    {
                                        btnArr.pay_status=='all'?(null):(
                                            <View style={styles.filter_btn}>
                                                <Text style={styles.filter_btn_font}>{constant[btnArr.pay_status]}</Text>
                                            </View>
                                        )
                                    }
                                </View>
                            )
                        }
                    </View>
                </View>
                <View style={styles.module_gap}></View>
                <View style={{flex:1,backgroundColor: '#fcfcfc'}}>
                    {
                        listData.length==0?(
                            <EmptyList />
                        ):(
                            this.renderItem()
                        )
                    }

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
    salary_item:{
        paddingHorizontal: px2dp(18),
        height:px2dp(50),
        borderBottomWidth: 1,
        borderBottomColor: '#efefef'
    },
    more_btn:{
        marginHorizontal: px2dp(17),
        height:px2dp(42),
        backgroundColor:'#fff',
        elevation:3,
        marginVertical: px2dp(25),
        borderRadius: px2dp(5)
    },
    filter_result_wrap:{
        paddingHorizontal: px2dp(18),
        paddingVertical: px2dp(25)
    },
    filter_btn:{
        width:px2dp(72),
        height:px2dp(35),
        borderWidth: 1,
        borderColor:'#64bdf9',
        borderRadius: px2dp(5),
        marginRight:px2dp(15)
    },
    filter_btn_font:{
        fontSize:px2dp(15),
        color:'#64bdf9',
        textAlign: 'center',
        lineHeight: px2dp(30)
    },
    filter_btn_wrap:{
        flexDirection:'row',
        marginTop: px2dp(13),
        height:px2dp(40)
    },
    module_gap:{
        height:px2dp(8),
        backgroundColor:'#efefef'
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
    }
});