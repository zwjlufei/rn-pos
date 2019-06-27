//员工选择组件
import React, {Component} from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    StatusBar,
    Dimensions,
    FlatList,
    ScrollView,
    TouchableWithoutFeedback, Image, TextInput, Keyboard
} from 'react-native';
var {width,height} = Dimensions.get('window');
import px2dp from './../tools/px2dp';
import Icon from "react-native-vector-icons/FontAwesome";
import {dataReset, feach_request, getStorage, Toast} from "../tools/Public";
export default class SelectStaff extends Component{
    static navigationOptions = {
        header: null
    };
    constructor(props){
        super(props);
        this.state = {
            title:'',
            value:'',
            listShow:false,
            userInfo:'',
            arr:[],
            selectedIndex:-1
        }
    }
    componentWillMount(){
        getStorage('userInfo')
            .then(data=>{
                this.setState({
                    userInfo:data
                })
                this.getData('',data)
            }).catch(err=>{
            console.log(err)
        })
    }
    //输入内容改变时
    _changeText(text){
        this.setState({
            value: text
        });
        if(!text){
            this.getData('',this.state.userInfo)
        }
    }
    getData(name,userInfo){
        var data={
            name:name,
            user_type:'waiter',
            hospital:userInfo.name,
            token:userInfo.token
        };
        // token:this.state.userInfo.tokens
        data = dataReset(data);
        feach_request('/pos_user_search','POST',data,this.props.navigation)
            .then((data)=>{
                if(data.status==0){
                    this.setState({
                        arr:data.data.waiter
                    });

                }
            })
            .catch((err)=>{
                console.log(err);
                Toast('出现未知错误，信息无法提交～');
            })
    }
    getContent(item,index){
        this.setState({
            selectedIndex:index,
            value:item.name
        });
        this.props.getName(item.name,item.id);
    }
    //渲染人员列表
    renderItem=({item,index})=>(
        <TouchableWithoutFeedback onPress={()=>this.getContent(item,index)}>
            <View style={[styles.item_wrap,this.state.selectedIndex==index?styles.select_border:'']}>
                <Text style={styles.item_name}>{item.name}</Text>
                <Text style={styles.item_info}>{item.native_place?item.native_place:'无'}  |  {item.age}岁</Text>
                {
                    this.state.selectedIndex==index?(
                        <Image
                            source={require('./../../images/seclect.png')}
                            style={styles.select_img}
                        />
                    ):(null)
                }

            </View>
        </TouchableWithoutFeedback>
    )
    render(){
        return(
            <View>
                <View style={[styles.flex_space_between,styles.item_style]}>
                    <Text style={styles.item_title}>服务员工</Text>
                    <View style={[styles.flex,styles.input_style,this.props.source?styles.ml_10:'']}>
                        <TextInput
                            style={[styles.input_font]}
                            onChangeText={this._changeText.bind(this)}
                            value={this.state.value}
                            placeholder={'请选择服务员工姓名'}/>
                    </View>
                    <TouchableWithoutFeedback onPress={()=>{
                        this.setState({
                            selectedIndex:-1
                        });
                        this.getData(this.state.value,this.state.userInfo);
                        if(this.flatListRef.props.data.length!==0){
                            this.flatListRef.scrollToIndex({animated: true,index: 0});
                        }
                    }}>
                        <View style={styles.search_btn}>
                            <Text style={styles.search_btn_font}>搜索</Text>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
                <View style={[styles.list_wrap]}>
                    <View style={{flex:1}}>
                        <FlatList
                            data={this.state.arr}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={this.renderItem}
                            extraData={this.state}
                            horizontal={true}
                            showsHorizontalScrollIndicator = {false}
                            getItemLayout={(data,index)=>(
                                {length: px2dp(85), offset: px2dp(85) * index, index}
                            )}
                            ref={(ref) => { this.flatListRef = ref; }}
                        />
                    </View>

                </View>
            </View>
        )
    }
    componentWillUnmount() {
        this.settimeId && clearTimeout(this.settimeId);
    }
}
const styles = StyleSheet.create({
    flex:{
        flex:1,
        flexDirection: 'row',
        justifyContent: 'flex-start'
    },
    input_style:{
        flex:1,
        borderWidth: 0,
        borderRadius:5,
        elevation:2,
        paddingLeft: px2dp(10),
        marginLeft: px2dp(18),
        height:px2dp(40)
    },
    input_font:{
        fontSize:px2dp(15)
    },
    select_img:{
        width:px2dp(21),
        height:px2dp(21),
        position: 'absolute',
        right:px2dp(0),
        top:px2dp(0)
    },
    list_wrap:{
        height:px2dp(100),
        backgroundColor: '#fff',
        borderRadius:px2dp(5),
        elevation:2,
        marginTop:px2dp(5)
    },
    item_title:{
        fontSize:px2dp(14)
    },
    flex_space_between:{
        flexDirection:'row',
        justifyContent: 'space-between',
        alignItems:'center'
    },
    item_style:{
        height:px2dp(53),
        marginTop: px2dp(17)
    },
    item_wrap:{
        width:px2dp(85),
        height:px2dp(80),
        borderColor:'#c5c5c5',
        borderWidth:1,
        borderRadius:px2dp(7),
        marginTop: px2dp(9),
        marginHorizontal: px2dp(8),
        flexDirection:'column',
        justifyContent:'center',
        alignItems: 'center'
    },
    item_name:{
        fontSize:px2dp(14),
        color:'#191919',
        marginBottom: px2dp(10)
    },
    item_info:{
        fontSize:px2dp(12),
        color:'#666666'
    },
    search_btn:{
        width:px2dp(57),
        height:px2dp(30),
        borderColor:'#64bdf9',
        borderWidth:1,
        borderRadius:px2dp(5),
        elevation:1,
        marginLeft: px2dp(15)
    },
    search_btn_font:{
        color:'#64bdf9',
        fontSize:px2dp(15),
        lineHeight:px2dp(25),
        textAlign: 'center'
    },
    select_border:{
        borderColor:'#64bdf9'
    },
    ml_10:{
        marginLeft: px2dp(30)
    }
});