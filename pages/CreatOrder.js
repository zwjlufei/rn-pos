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
    ScrollView, Modal
} from 'react-native';
var {width,height} = Dimensions.get('window');
import px2dp from './tools/px2dp';
import Header from "./CommonModules/Header";
import {checkID, Toast} from "./tools/Public";
export default class CreatOrder extends Component{
    static navigationOptions = {
        header: null
    };
    constructor(props){
        super(props);
        this.state = {
            modalVisible: false,
            card:''
        }
    }
    render(){
        const { navigate } = this.props.navigation;
        const native=this.props.navigation.state.params.native;
        const name=this.props.navigation.state.params.name;
        const customer=this.props.navigation.state.params.customer;
        return(
            <View style={{flex:1,backgroundColor: '#fcfcfc'}}>
                <Header title={'医院终端'} navigate={this.props.navigation}/>
                <ScrollView>
                    <View style={{paddingHorizontal: px2dp(12),paddingTop: px2dp(25)}}>
                        <Text style={styles.create_order_wrap}>选择订单类型</Text>
                        <View>
                            <TouchableWithoutFeedback onPress={()=>{navigate('BasicInfo',{source:'CreateCare',native:native,customer:customer})}}>
                                <View style={[styles.sub_item_wrap,styles.main_item_wrap]}>
                                    <Image
                                        source={require('./../images/order_one.png')}
                                        style={{width:px2dp(60),height:px2dp(60)}}
                                    />
                                    <Text style={styles.item_font}>陪护单</Text>
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                        <View style={[styles.flex_space_between,styles.flex_wrap]}>
                            <TouchableWithoutFeedback onPress={()=>{navigate('BasicInfo',{source:'CreateProlactin',native:native,customer:customer})}}>
                                <View style={[styles.sub_item_wrap,styles.sub_bg_one]}>
                                    <Image
                                        source={require('./../images/order_two.png')}
                                        style={{width:px2dp(60),height:px2dp(60)}}
                                    />
                                    <Text style={styles.item_font}>母指单</Text>
                                </View>
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback onPress={()=>{navigate('BasicInfo',{source:'CreateDoula',native:native,customer:customer})}}>
                                <View style={[styles.sub_item_wrap,styles.sub_bg_two]}>
                                    <Image
                                        source={require('./../images/order_three.png')}
                                        style={{width:px2dp(60),height:px2dp(60)}}
                                    />
                                    <Text style={styles.item_font}>导乐单</Text>
                                </View>
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback onPress={()=>{navigate('BasicInfo',{source:'CreateNanny',native:native,customer:customer})}}>
                                <View style={[styles.sub_item_wrap,styles.sub_bg_three]}>
                                    <Image
                                        source={require('./../images/order_four.png')}
                                        style={{width:px2dp(60),height:px2dp(60)}}
                                    />
                                    <Text style={styles.item_font}>月嫂单</Text>
                                </View>
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback onPress={()=>{navigate('BasicInfo',{source:'ProductList',name:name,native:native,customer:customer})}}>
                                <View style={styles.sub_item_wrap}>
                                    <Image
                                        source={require('./../images/product_icon.png')}
                                        style={{width:px2dp(60),height:px2dp(60)}}
                                    />
                                    <Text style={styles.item_font}>产品单</Text>
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                    </View>
                </ScrollView>
            </View>

        )
    }
}
const styles = StyleSheet.create({
    flex:{
        flex:1
    },
    flex_space_between:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems:'center'
    },
    create_order_wrap:{
        textAlign: 'center',
        paddingTop:px2dp(50),
        fontSize: px2dp(18),
        fontWeight: '600',
        marginBottom:px2dp(13)
    },
    sub_item_wrap:{
        width:px2dp(170),
        height:px2dp(122),
        backgroundColor:'#ffffff',
        borderRadius: px2dp(5),
        marginTop: px2dp(12),
        elevation:3,
        flexDirection:'column',
        alignItems:'center',
        paddingTop: px2dp(20)
    },
    main_item_wrap:{
        width:338,
        marginBottom: px2dp(10)
    },
    flex_wrap:{
        flexWrap: 'wrap'
    },
    item_font:{
        fontSize:px2dp(14),
        fontWeight: '600',
        letterSpacing: px2dp(2)
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
        height:px2dp(40),
        borderRadius:px2dp(5),
        backgroundColor:'#64bdf9',
        marginHorizontal:px2dp(17),
        marginTop:px2dp(25),
        elevation:3
    },
    input_style:{
        backgroundColor:'#ffffff',
        height:px2dp(40),
        borderRadius:5,
        elevation:3,
        paddingLeft: px2dp(10),
        marginHorizontal: px2dp(20),
        paddingVertical: 0
    },
});