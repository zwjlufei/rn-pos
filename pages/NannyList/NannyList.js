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
    ImageBackground, Keyboard
} from 'react-native';
var {width,height} = Dimensions.get('window');
import px2dp from './../tools/px2dp';
import Header from "./../CommonModules/Header";
import NoNet from './../CommonModules/NoNet';
import Icon from "react-native-vector-icons/FontAwesome";
import Loading from "../CommonModules/Loading";
import EmptyList from "../CommonModules/EmptyStyle";
import PageListView from "react-native-page-listview";
import constant from './../tools/constant';
import {dataReset,feach_request,getStorage,Toast} from './../tools/Public';
export default class NannyList extends Component{
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
            listState:'',
            customer:''
        }
        this.renderRow=this.renderRow.bind(this);
        this.goDetail=this.goDetail.bind(this);
    }
    //tab切换
    changeNav(state,listState){
        this.setState({
            nav:state,
            listState:listState,
            loading:true
        })
        this.initData('change',listState,'',this.state.userInfo)
    }
    //上拉加载
    loadMore=(page,callback)=>{
        var data={
            offset:(page-1)*10,
            hospital:this.state.userInfo.name,
            name:this.state.customer,
            hospital_status:this.state.listState,
            token:this.state.userInfo.token
        };
        data = dataReset(data);
        feach_request('/pos_waiter_manage','POST',data,this.props.navigation)
            .then((data)=>{
                if(this.state.pageLen!==9){
                    this.setState({
                        dataList: data.data.waiter,
                        pageLen: data.data.waiter.length
                    })
                    let newArr = [];
                    for(let i=0;i<data.data.waiter.length;i+=2){
                        newArr.push(data.data.waiter.slice(i,i+2));
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
                this.initData('init',this.state.listState,callBack,data)
            }).catch(err=>{
            console.log(err)
        })
    }
    //数据初始化
    initData(source,type,callBack,userInfo){
        this.setState({
            pageLen:0,
            dataList:[]
        });
        var data={
            offset:0,
            hospital:userInfo.name,
            name:source=='filter'?this.state.customer:'',
            hospital_status:type,
            token:userInfo.token
        };
        data = dataReset(data);
        feach_request('/pos_waiter_manage','POST',data,this.props.navigation)
            .then((data)=>{
                this.setState({
                        loading:false
                    });
                if(data.data.waiter.length==0){
                    this.setState({
                        empty:true
                    })
                }else {
                    this.setState({
                        empty:false
                    })
                    let newArr = [];
                    for(let i=0;i<data.data.waiter.length;i+=2){
                        newArr.push(data.data.waiter.slice(i,i+2));
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
    goDetail(data){
        this.props.navigation.navigate('NannyDetail',{info:data})
    }
    //查找员工
    findStaff(){
        this.setState({
            nav:'1',
            loading:true
        });
        this.initData('filter','','',this.state.userInfo)
        Keyboard.dismiss();
    }
    //渲染列表
    renderRow(rowData,index){
        // const { navigate } = this.props.navigation;
        return(
            <View style={[styles.flex_space_between,styles.nanny_list_wrap]}>
                {
                    rowData.map((item,index)=>{
                        return(
                            <TouchableWithoutFeedback key={index} onPress={()=>{this.goDetail(item)}}>
                                <View style={styles.nanny_item}>
                                    <Image
                                        style={styles.nanny_photo}
                                        source={{
                                            uri:
                                                `data:image/png;base64,${item.image}`,
                                        }}
                                    />
                                    <Text style={{fontSize: px2dp(15),color:'#333'}}>{item.name}</Text>
                                    <View style={styles.item_line}></View>
                                    <View style={styles.nanny_info}>
                                        <Text style={{fontSize: px2dp(13),color:'#8d8d8d',marginRight: px2dp(15)}}>{item.age}岁</Text>
                                        <Text style={{fontSize: px2dp(13),color:'#8d8d8d'}}>{item.native_place}</Text>
                                    </View>
                                    <View style={styles.nanny_info}>
                                        <View style={styles.rim}>
                                            <Text style={{fontSize: px2dp(12),color:'#64bdf9',textAlign: 'center',lineHeight: px2dp(18)}}>{constant[item.waiter_type]}</Text>
                                        </View>
                                        <Text style={{fontSize: px2dp(12),color:'#64bdf9'}}>{item.price}元/天</Text>
                                    </View>
                                    {
                                        !item.hospital_status?(
                                            <Image
                                                source={require('./../../images/live_post.png')}
                                                style={styles.nanny_state}
                                            />
                                        ):(
                                            <Image
                                                source={require('./../../images/has_post.png')}
                                                style={styles.nanny_state}
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
        return(
            <View style={{flex:1,backgroundColor: '#ffffff'}}>
                <View style={{elevation:1}}>
                    <Header title={'人员管理'} navigate={this.props.navigation}/>
                    <View>
                        <View style={styles.search_wrap}>
                            <View style={styles.sub_search_wrap}>
                                <TextInput placeholder={'请输入员工姓名/手机号'} style={styles.search_input} onChangeText={(text)=>{this.setState({customer:text})}} onSubmitEditing={()=>{this.findStaff()}}/>
                            </View>
                            <TouchableWithoutFeedback onPress={()=>{this.findStaff()}}>
                                <View style={styles.seek_symbol}>
                                    <Icon name="search" size={18} color="#a9a9a9"/>
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                        <View style={[styles.flex_space_between,styles.nav_cut]}>
                            <TouchableWithoutFeedback onPress={()=>{this.changeNav('1','')}}>
                                <View style={[styles.nav_cut_item,this.state.nav=='1'?styles.nav_item_on:'']}>
                                    <Text style={[styles.nav_item_font,this.state.nav=='1'?styles.nav_font_on:'']}>全部</Text>
                                </View>
                            </TouchableWithoutFeedback>
                            <View style={styles.nav_gap}></View>
                            <TouchableWithoutFeedback onPress={()=>{this.changeNav('2',true)}}>
                                <View style={[styles.nav_cut_item,this.state.nav=='2'?styles.nav_item_on:'']}>
                                    <Text style={[styles.nav_item_font,this.state.nav=='2'?styles.nav_font_on:'']}>在岗</Text>
                                </View>
                            </TouchableWithoutFeedback>
                            <View style={styles.nav_gap}></View>
                            <TouchableWithoutFeedback onPress={()=>{this.changeNav('3',false)}}>
                                <View style={[styles.nav_cut_item,this.state.nav=='3'?styles.nav_item_on:'']}>
                                    <Text style={[styles.nav_item_font,this.state.nav=='3'?styles.nav_font_on:'']}>离岗</Text>
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                    </View>

                </View>
                {/*{*/}
                    {/*this.state.noNet?(*/}
                        {/*<NoNet init={this.dataInit.bind(this)}/>*/}
                    {/*):(*/}
                        {/**/}
                    {/*)*/}
                {/*}*/}
                {/*<View style={[styles.flex,styles.flex_space_between,styles.nanny_list_wrap]}>*/}
                <View style={{flex:1,backgroundColor: '#ffffff'}}>
                    <Loading loading={this.state.loading}/>
                    <View style={this.state.empty?styles.listShow:styles.listHide}>
                        <EmptyList hint={'您的人员列表为空～'}/>
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
        paddingHorizontal: px2dp(44),
        height:px2dp(42),
        elevation:3,
        backgroundColor:'#ffffff'
    },
    nav_cut_item:{
        width:px2dp(47)
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
    nanny_item:{
        width:px2dp(156),
        height:px2dp(219),
        backgroundColor:'#ffffff',
        elevation:3,
        borderRadius:px2dp(5),
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: px2dp(15),
        marginBottom:px2dp(15)
    },
    nanny_photo:{
        width:px2dp(75),
        height:px2dp(75),
        borderRadius: px2dp(75),
        marginBottom: px2dp(15)
    },
    item_line:{
        width:px2dp(35),
        height:px2dp(3),
        borderRadius:px2dp(3),
        backgroundColor:'#64bdf9',
        marginTop: px2dp(10),
        marginBottom: px2dp(15)
    },
    nanny_info:{
        flexDirection:'row',
        alignItems:'center',
        marginBottom:px2dp(10)
    },
    rim:{
        width:px2dp(48),
        height:px2dp(20),
        borderWidth: px2dp(1),
        borderColor:'#64bdf9',
        borderRadius: px2dp(5),
        marginRight: px2dp(10)
    },
    nanny_state:{
        width:px2dp(40),
        height:px2dp(25),
        position: 'absolute',
        right:-px2dp(8),
        top:px2dp(5)
    },
    bottom_btn:{
        flex:1,
        height:px2dp(46),
        backgroundColor:'#ffffff',
        borderRadius:px2dp(8),
        elevation:3,
        marginBottom:px2dp(25),
        marginTop:px2dp(38)
    },
    bottom_btn_font:{
        textAlign: 'center',
        lineHeight:px2dp(40),
        fontSize:px2dp(16),
        color:'#64bdf9'
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
    }
});