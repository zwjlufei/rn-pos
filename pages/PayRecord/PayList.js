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
    ImageBackground
} from 'react-native';
var {width,height} = Dimensions.get('window');
import px2dp from './../tools/px2dp';
import Header from "./../CommonModules/Header";
import Icon from "react-native-vector-icons/FontAwesome";
import {dataReset,feach_request,getStorage,Toast,timeTransform} from './../tools/Public';
import constant from './../tools/constant';
import Loading from './../CommonModules/Loading';
import EmptyList from './../CommonModules/EmptyStyle';
import PageListView from 'react-native-page-listview';
export default class PayList extends Component{
    static navigationOptions = {
        header: null
    };
    constructor(props){
        super(props);
        this.state = {
            nav:'1',
            loading:true,
            empty:false
        }
        this.renderRow=this.renderRow.bind(this);
    }

    changeNav(state){
        this.setState({
            nav:state
        })
    }
    //上拉加载
    loadMore=(page,callback)=>{
        this.setState({
            page:page
        })
        var data={
            offset:(page-1)*10,
            hospital:this.state.userInfo.name,
            token:this.state.userInfo.token
        };
        data = dataReset(data);
        feach_request('/pos_order_flow','POST',data,this.props.navigation)
            .then((data)=>{
                if(data.status==0){
                    callback(data.data.flow)
                }
            })
            .catch((err)=>{
                console.log(err);
                Toast('出现未知错误，信息无法提交～');
            })
    };
    //下拉刷新
    refresh=(callBack)=>{
        getStorage('userInfo')
            .then(data=>{
                this.setState({
                    userInfo:data
                })
                this.initData(callBack,data)
            }).catch(err=>{
            console.log(err)
        })
    }
    //数据初始化
    initData(callBack,userInfo){
        this.setState({
            page:0
        })
        var data={
            offset:0,
            hospital:this.state.userInfo.name,
            token:this.state.userInfo.token
        };
        data = dataReset(data);
        feach_request('/pos_order_flow','POST',data,this.props.navigation)
            .then((data)=>{
                if(data.status==0){
                    this.setState({
                        loading:false
                    });
                    if(data.data.flow.length==0){
                        this.setState({
                            empty:true
                        })
                    }else {
                        callBack(data.data.flow);
                    }
                }
            })
            .catch((err)=>{
                console.log(err);
                Toast('出现未知错误，请稍后再试～');
            })
    }

    //渲染列表
    renderRow(rowData,index){
        // const { navigate } = this.props.navigation;
        // const time=timeTransform(rowData.time);
        return(
            <TouchableWithoutFeedback onPress={()=>{
                if(rowData.order_type){
                    this.props.navigation.navigate('PayDetail',{info:rowData})
                }
            }}>
                <View style={[styles.flex_space_between,styles.item_wrap]}>
                    <Text style={styles.pay_item}>{rowData.time}</Text>
                    <Text style={styles.pay_item}>{constant[rowData.channel]}</Text>
                    <Text style={styles.pay_item}>{constant[rowData.order_type]}</Text>
                    <View style={[styles.flex,styles.item_last_module]}>
                        <Text style={styles.price_num}>{rowData.amount}元</Text>
                        <Icon name="angle-right" size={28} color="#b0b0b0" />
                    </View>
                </View>
            </TouchableWithoutFeedback>
        )
    }
    render(){
        const { navigate } = this.props.navigation;
        return(
            <View style={{flex:1,backgroundColor: '#ffffff'}}>
                <Header title={'订单流水'} navigate={this.props.navigation} check={true}/>
                <View style={[styles.flex_space_between,styles.nav_cut]}>
                    <View style={[styles.flex,styles.nav_cut_item]}>
                        <Text style={styles.nav_item_font}>时间</Text>
                    </View>
                    <View style={styles.nav_gap}></View>
                    <View style={[styles.flex,styles.nav_cut_item]}>
                        <Text style={styles.nav_item_font}>支付方式</Text>
                    </View>
                    <View style={styles.nav_gap}></View>
                    <View style={[styles.flex,styles.nav_cut_item]}>
                        <Text style={styles.nav_item_font}>合同类型</Text>
                    </View>
                    <View style={styles.nav_gap}></View>
                    <View style={[styles.flex,styles.nav_cut_item]}>
                        <Text style={styles.nav_item_font}>金额</Text>
                    </View>
                </View>
                <View style={{paddingTop: px2dp(10),flex:1}}>
                    <Loading loading={this.state.loading}/>
                    {
                        this.state.empty?(
                            <EmptyList />
                        ):(
                            <PageListView
                                pageLen={10}
                                style={{flex:1}}
                                renderRow={this.renderRow}
                                refresh={this.refresh}
                                loadMore={this.loadMore}
                            />

                        )
                    }
                </View>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    flex:{
        flex:1,
    },
    flex_space_between:{
        flexDirection:'row',
        justifyContent: 'space-between',
        alignItems:'center'
    },
    nav_cut:{
        paddingHorizontal: px2dp(15),
        height:px2dp(42),
        elevation:3,
        backgroundColor:'#ffffff'
    },
    nav_item_font:{
        textAlign: 'center',
        color:'#333',
        fontSize:px2dp(14),
        lineHeight:px2dp(42)
    },
    nav_gap:{
        width:px2dp(1),
        height:px2dp(23),
        backgroundColor: "#d9d9d9"
    },
    bottom_btn:{
        height:px2dp(46),
        backgroundColor:'#ffffff',
        borderRadius:px2dp(8),
        elevation:3,
        marginVertical: px2dp(25)
    },
    bottom_btn_font:{
        textAlign: 'center',
        lineHeight:px2dp(40),
        fontSize:px2dp(16),
        color:'#64bdf9'
    },
    pay_item:{
        flex:1,
        textAlign:'center',
        fontSize:px2dp(14),
        color:'#323232'
    },
    item_last_module:{
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center'
    },
    price_num:{
        color:'#64bdf9',
        fontSize:px2dp(14),
        fontWeight: '600'
    },
    item_wrap:{
        borderBottomWidth: px2dp(1),
        borderBottomColor:'#efefef',
        height:px2dp(60)
    }
});