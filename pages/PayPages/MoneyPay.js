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
    ImageBackground, BackHandler
} from 'react-native';
var {width,height} = Dimensions.get('window');
import px2dp from './../tools/px2dp';
import Header from "./../CommonModules/Header";
import {dataReset,feach_request,getStorage,Toast} from './../tools/Public';
import NoDoublePress from "../tools/NoDoublePress";
export default class MoneyPay extends Component{
    static navigationOptions = {
        header: null
    };
    constructor(props){
        super(props);
        this.state = {
            title:'现金支付'
        }
    }
    componentWillMount(){
        getStorage('userInfo')
            .then(data=>{
                this.setState({
                    userInfo:data
                })
            }).catch(err=>{
            console.log(err)
        })

    }
    submitInfo(){
        const price = this.props.navigation.state.params.price;
        const info = this.props.navigation.state.params.info;
        var data={
            contracts_id:info.contracts_id,
            channel:'cash',
            amount:price,
            order_source:this.state.userInfo.name,
            token:this.state.userInfo.token
        };
        data = dataReset(data);
        feach_request('/pos_contracts_pay','POST',data,this.props.navigation)
            .then((data)=>{
                if(data.status==0){
                    Toast('已提交到财务～')
                }
            })
            .catch((err)=>{
                console.log(err);
                Toast('出现未知错误，信息无法提交～');
            })
    }
    render(){
        const { navigate } = this.props.navigation;
        const price = this.props.navigation.state.params.price;
        return(
            <View style={{flex:1,backgroundColor: '#fcfcfc'}}>
                <Header title={this.state.title} navigate={this.props.navigation} jump={'Home'}/>
                <ScrollView style={styles.flex}>
                    <View style={{paddingHorizontal: px2dp(34),paddingTop: px2dp(20)}}>
                        <View style={styles.content_wrap}>
                            <ImageBackground source={require("./../../images/money_bg.png")} style={{width: '100%',height: '100%'}}>
                                <View style={styles.flex_column}>
                                    <Text style={{fontSize:px2dp(14)}}>您本次支付金额</Text>
                                    <View style={{flexDirection:'row',marginBottom: px2dp(10)}}>
                                        <Text style={styles.price_num}>{price}</Text>
                                        <Text style={{fontSize:px2dp(14),lineHeight:px2dp(60)}}>元</Text>
                                    </View>
                                    <Text style={styles.marked_words}>需要财务确认后即可进账</Text>
                                    <TouchableWithoutFeedback onPress={()=>NoDoublePress.onPress(()=>{this.submitInfo()})}>
                                        <View style={styles.look_over_btn}>
                                            <Text style={styles.look_over_font}>提交到财务</Text>
                                        </View>
                                    </TouchableWithoutFeedback>

                                </View>
                            </ImageBackground>
                        </View>
                    </View>
                    <View style={{paddingHorizontal:px2dp(17)}}>
                        <TouchableWithoutFeedback onPress={()=>{navigate('Home')}}>
                            <View style={styles.bottom_btn}>
                                <Text style={styles.bottom_btn_font}>返回首页</Text>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </ScrollView>
            </View>
        )
    }
    componentDidMount() {
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            this.props.navigation.navigate('Home'); // works best when the goBack is async
            return true;
        });
    }
    componentWillUnmount() {
        this.backHandler.remove();
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
    flex_column:{
        flexDirection:'column',
        alignItems:'center',
        paddingTop: px2dp(67),
        paddingBottom: px2dp(50)
    },
    content_wrap:{
        width:px2dp(307),
        height:px2dp(442)
    },
    price_num:{
        fontSize:px2dp(35),
        color:'#64bdf9',
        letterSpacing: px2dp(2),
        marginRight: px2dp(5)
    },
    look_over_btn:{
        width:px2dp(128),
        height:px2dp(43),
        backgroundColor: '#64bdf9',
        borderRadius:px2dp(8),
        elevation:3,
        marginTop: px2dp(60)
    },
    look_over_font:{
        fontSize:px2dp(16),
        color:'#ffffff',
        textAlign: 'center',
        lineHeight: px2dp(43)
    },
    bottom_btn:{
        flex:1,
        height:px2dp(40),
        backgroundColor:'#ffffff',
        borderRadius:px2dp(8),
        elevation:3,
        marginBottom:px2dp(25),
        marginTop:px2dp(60)
    },
    bottom_btn_font:{
        textAlign: 'center',
        lineHeight:px2dp(40),
        fontSize:px2dp(16),
        color:'#64bdf9'
    },
    marked_words:{
        fontSize:px2dp(13),
        paddingVertical: px2dp(55)
    }
});