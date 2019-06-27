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
    AsyncStorage,
    ImageBackground, Keyboard, DeviceEventEmitter
} from 'react-native';
var {width,height} = Dimensions.get('window');
import px2dp from './../tools/px2dp';
import Header from "./../CommonModules/Header";
import Icon from "react-native-vector-icons/FontAwesome";
import Loading from "../CommonModules/Loading";
import EmptyList from "../CommonModules/EmptyStyle";
import PageListView from "react-native-page-listview";
import constant from './../tools/constant';
import {dataReset,feach_request,getStorage,Toast} from './../tools/Public';
export default class ProductList extends Component{
    static navigationOptions = {
        header: null
    };
    constructor(props){
        super(props);
        this.state = {
            nav:'1',
            hasLive:false,
            noNet:false,
            loading:true,
            dataList:[],//返回的数据长度，以此判断是否加载完成
            pageLen:0,
            goodCar:[],
            goodNum:0,
            initData:[],
            product:''
        }
        this.renderRow=this.renderRow.bind(this);
        this.addCar=this.addCar.bind(this);
    }
    componentWillMount(){
        AsyncStorage.setItem('carData',JSON.stringify(this.state.goodCar));
    }
    //上拉加载
    loadMore=(page,callback)=>{
        var data={
            offset:(page-1)*10,
            name:this.state.product,
            token:this.state.userInfo.token
        };
        data = dataReset(data);
        feach_request('/pos_product_search','POST',data,this.props.navigation)
            .then((data)=>{
                if(this.state.pageLen!==9){
                    this.setState({
                        dataList: data.data.result,
                        pageLen: data.data.result.length,
                        initData:[...this.state.initData,...data.data.result]
                    })
                    let newArr = [];
                    for(let i=0;i<data.data.result.length;i+=2){
                        newArr.push(data.data.result.slice(i,i+2));
                    }
                    callback(newArr)
                }else {
                    callback([])
                }
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
                this.initData('init',callBack,data)
            }).catch(err=>{
            console.log(err)
        })
    }
    //数据初始化
    initData(source,callBack,userInfo){
        this.setState({
            pageLen:0,
            dataList:[]
        });
        var data={
            offset:0,
            name:this.state.product,
            token:userInfo.token
        };
        data = dataReset(data);
        feach_request('/pos_product_search','POST',data,this.props.navigation)
            .then((data)=>{
                this.setState({
                    initData:data.data.result,
                    loading:false
                });
                if(data.data.result.length==0){
                    this.setState({
                        empty:true
                    })
                }else {
                    this.setState({
                        empty:false
                    })
                    let newArr = [];
                    for(let i=0;i<data.data.result.length;i+=2){
                        newArr.push(data.data.result.slice(i,i+2));
                    }
                    if(source=='init'){
                        callBack(newArr)
                    }else {
                        this.PL.manualRefresh(newArr);
                    }
                }
            })
            .catch((err)=>{
                console.log(err);
                Toast('出现未知错误，请稍后再试～');
            })
    }
    //查找商品
    findStaff(){
        this.setState({
            loading:true
        })
        this.initData('filter','',this.state.userInfo)
        Keyboard.dismiss();
    }
    //加入购物车
    addCar(item){
        item.isAddCar=!item.isAddCar;
        var arr = this.state.goodCar;
        if(item.isAddCar){
            item.num=1;
            arr.push(item)
        }else {
            arr.map((arrItem,arrIndex)=>{
                if(arrItem.id==item.id){
                    arr.splice(arrIndex, 1);
                }
            })

        }
        this.setState({
            goodCar: arr,
            goodNum:arr.length
        })
    }
    //渲染列表
    renderRow(rowData,index){
        // const { navigate } = this.props.navigation;
        return(
            <View style={[styles.flex_space_between,styles.nanny_list_wrap]}>
                {
                    rowData.map((item,index)=>{
                        return(
                            <TouchableWithoutFeedback key={item.id} onPress={()=>{this.addCar(item)}}>
                                <View style={styles.product_item}>
                                    <View style={{paddingHorizontal:px2dp(15)}}>
                                        <Text style={styles.product_info} numberOfLines={2}>{item.name}</Text>
                                        <Text style={styles.product_info}>{item.price}元/{item.norm}</Text>
                                    </View>
                                    {
                                        item.isAddCar?(
                                            <Image
                                                source={require('./../../images/delete.png')}
                                                style={styles.btn_style}
                                            />
                                            ):(
                                            <Image
                                                source={require('./../../images/car.png')}
                                                style={styles.btn_style}
                                            />
                                        )
                                    }
                                </View>
                            </TouchableWithoutFeedback>
                        )
                    })
                }
            </View>
        )
    }
    render(){
        const { navigate } = this.props.navigation;
        const name=this.props.navigation.state.params.name;
        const customerId=this.props.navigation.state.params.customerId;
        return(
            <View style={{flex:1,backgroundColor: '#ffffff'}}>
                <View style={{elevation:1}}>
                    <Header title={'产品单信息'} navigate={this.props.navigation}/>
                    <View>
                        <View style={styles.search_wrap}>
                            <View style={styles.sub_search_wrap}>
                                <TextInput placeholder={'请输入产品名称...'} ref='aReferName' style={styles.search_input} onChangeText={(text)=>{this.setState({product:text})}} onSubmitEditing={()=>{this.findStaff()}}/>
                            </View>
                            <TouchableWithoutFeedback onPress={()=>{this.findStaff()}}>
                                <View style={styles.seek_symbol}>
                                    <Icon name="search" size={18} color="#a9a9a9"/>
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                    </View>

                </View>
                <View style={{flex:1,backgroundColor: '#ffffff'}}>
                    <Loading loading={this.state.loading}/>
                    <View style={this.state.empty?styles.listShow:styles.listHide}>
                        <EmptyList hint={'暂无产品～'}/>
                    </View>
                    <View style={this.state.empty?styles.listHide:styles.listShow}>
                        <PageListView
                            pageLen={this.state.dataList.length==9?4:5}
                            renderRow={this.renderRow}
                            refresh={this.refresh}
                            loadMore={this.loadMore}
                            ref={(r)=>{!this.PL&&(this.PL=r)}}
                        />
                    </View>
                </View>
                <TouchableWithoutFeedback onPress={()=>{
                    if(this.state.goodNum>0){
                        navigate('MyCart',{'goods':this.state.goodCar,name:name,customerId:customerId})
                    }else {
                        Toast('请添加商品到购物车～')
                    }
                }}>
                    <View style={styles.bottom_btn}>
                        <Text style={styles.bottom_btn_font}>我的购物车({this.state.goodNum})</Text>
                    </View>
                </TouchableWithoutFeedback>
            </View>
        )
    }

    //注册通知
    componentDidMount(){
        DeviceEventEmitter.addListener('UpdatePage',(data)=>{
            this.state.initData.map((item,index)=>{
                item.isAddCar=false;
                data.map((dataItem,datIndex)=>{
                    if(dataItem.id==item.id){
                        item.isAddCar=true;
                    }
                })
            });
          this.setState({
              goodCar:data,
              goodNum:data.length
          })
        });
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
        paddingHorizontal: px2dp(55),
        height:px2dp(42),
        elevation:3,
        backgroundColor:'#ffffff'
    },
    nav_cut_item:{
        width:px2dp(80)
    },
    nav_item_font:{
        textAlign: 'center',
        color:'#7f7f7f',
        fontSize:px2dp(14),
        lineHeight:px2dp(42)
    },
    nav_gap:{
        width:px2dp(1),
        height:px2dp(23),
        backgroundColor: "#d9d9d9"
    },
    nav_item_on:{
        borderBottomWidth: px2dp(2),
        borderBottomColor:'#64bdf9'
    },
    nav_font_on:{
        color: '#64bdf9'
    },
    nanny_list_wrap:{
        paddingHorizontal: px2dp(17),
        flexWrap: 'wrap',
        paddingTop: px2dp(15)
    },
    product_item:{
        width:px2dp(156),
        height:px2dp(120),
        backgroundColor:'#ffffff',
        elevation:3,
        borderRadius:px2dp(5),
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: px2dp(10),
        marginBottom:px2dp(15)
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
    listShow:{
        flex:1
    },
    listHide:{
        display: 'none'
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
    product_info:{
        fontSize:px2dp(15),
        textAlign:'center',
        lineHeight:px2dp(20)
    },
    btn_style:{
        width:px2dp(156),
        height:px2dp(49),
        position: 'absolute',
        bottom:-px2dp(5)
    }
});