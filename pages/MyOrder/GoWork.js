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
    DeviceEventEmitter
} from 'react-native';
var {width,height} = Dimensions.get('window');
import px2dp from './../tools/px2dp';
import Header from "./../CommonModules/Header";
import Icon from "react-native-vector-icons/FontAwesome";
import DatePicker from "../datePicker/calendar";
import {dataReset, feach_request, getStorage, Toast} from "../tools/Public";
export default class GoWork extends Component{
    static navigationOptions = {
        header: null
    };
    constructor(props){
        super(props);
        this.state = {
            value:'',
            dateShow:false,
            info:''
        }
        this.goWork=this.goWork.bind(this);
    }
    componentWillMount(){
        const info=this.props.navigation.state.params.info;
        this.setState({
            info:info
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
    //获取时间
    getTime(time){
        this.setState({
            value:time
        })
    }
    //时间选择器
    closeDate(show){
        this.setState({
            dateShow:show
        })
    }
    //上户按钮
    goWork(){
        var data={
            contracts_id:this.state.info.contracts_id,
            start_datetime:this.state.value+':00',
            token:this.state.userInfo.token
        };
        data = dataReset(data);
        if(this.state.value){
            feach_request('/pos_start_service','POST',data,this.props.navigation)
                .then((data)=>{
                    if(data.status==0){
                        this.props.navigation.navigate('NannyOrderInfo')
                    }else {
                        Toast('上户未成功，请稍后再试～')
                    }
                })
                .catch((err)=>{
                    console.log(err);
                    Toast('出现未知错误，信息无法提交～');
                })
        }else {
            Toast('请选择上户时～');
        }

    }
    render(){
        const { navigate } = this.props.navigation;
        return(
            <View style={{flex:1,backgroundColor: '#fcfcfc'}}>
                <Header title={'上户'} navigate={this.props.navigation}/>
                <ScrollView style={styles.flex}>
                    <View style={[styles.flex_space_between,styles.item_style,styles.no_border]}>
                        <Text style={styles.item_title}>预上户时间:</Text>
                        <Text style={styles.item_content}>{this.state.info.start_date}</Text>
                    </View>
                    <View style={[styles.flex_space_between,styles.item_style,styles.no_border]}>
                        <Text style={styles.item_title}>上户时间:</Text>
                        <TouchableWithoutFeedback onPress={()=>{this.setState({dateShow:true})}}>
                            <View style={[styles.flex,styles.input_style]}>
                                <TextInput style={styles.input_font} value={this.state.value} placeholder={'请选择上户时间'} editable={false}/>
                                <Icon name="angle-down" size={25} color="#b2b2b2" style={styles.right_arrow} />
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </ScrollView>
                <TouchableWithoutFeedback onPress={()=>{this.goWork()}}>
                    <View style={styles.editor_btn}>
                        <Text style={styles.editor_btn_font}>上户</Text>
                    </View>
                </TouchableWithoutFeedback>

                {
                    this.state.dateShow?(<DatePicker getTime={this.getTime.bind(this)} show={this.state.dateShow} closeDate={this.closeDate.bind(this)} mode={'datetime'}/>):(null)
                }
            </View>

        )
    }
    //页面将要离开的是时候发送通知
    componentWillUnmount(){
        DeviceEventEmitter.emit('ChangeData');
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
    item_title:{
        flex:1,
        fontSize:px2dp(14)
    },
    item_content:{
        flex:2,
        fontSize:px2dp(14),
        color:'#000'
    },
    item_style:{
        paddingHorizontal: px2dp(17),
        height:px2dp(53),
        borderBottomWidth: px2dp(1),
        borderBottomColor:'#efefef'
    },
    blue_color:{
        color:'#64bdf9'
    },
    editor_btn:{
        height:px2dp(45),
        elevation:3,
        backgroundColor:'#ffffff',
        borderRadius: px2dp(10),
        marginHorizontal: px2dp(17),
        marginTop: px2dp(85),
        marginBottom: px2dp(25)
    },
    editor_btn_font:{
        fontSize:px2dp(16),
        color:'#64bdf9',
        textAlign: 'center',
        lineHeight: px2dp(45)
    },
    input_style:{
        backgroundColor:'#ffffff',
        height:px2dp(40),
        borderRadius:5,
        elevation:3,
        paddingLeft: px2dp(10),
        flex:2
    },
    right_arrow:{
        position: 'absolute',
        right:px2dp(17),
        top:px2dp(8)
    },
    input_font:{
        fontSize:px2dp(15)
    },
    no_border:{
        borderBottomWidth: 0,
        borderBottomColor:'#fff'
    }
});