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
export default class SalaryList extends Component{
    static navigationOptions = {
        header: null
    };
    constructor(props){
        super(props);
        this.state = {
            hasGive:0,
            orderType:'全部',
            salaryState:'全部',
            salaryTime:'全部'
        }
    }
    //打开分类抽屉
    onPenRightDrawer() {
        this.drawer.openDrawer();
    }
    //查询按钮
    closeRightDrawer() {
        this.props.navigation.navigate('FilterOrderList',{source:'salary'});
        this.drawer.closeDrawer();
    }
    //订单类型
    changeOrderType(type){
        this.setState({
            orderType:type
        })
    }
    //发放状态
    changeSalaryState(type){
        this.setState({
            salaryState:type
        })
    }
    //发工资时间
    changeSalaryTime(type){
        this.setState({
            salaryTime:type
        })
    }
    //已发工资和未发工资切换
    salaryTab(state){
        this.setState({
            hasGive:state
        })
    }
    //重置
    resetOption(){
        this.setState({
            orderType:'全部',
            salaryState:'全部',
            salaryTime:'全部'
        })
    }
    render(){
        const { navigate } = this.props.navigation;
        const navigationView = (
            <View style={styles.draw_wrap}>
                <View>
                    <View style={styles.draw_item}>
                        <Text style={{fontSize:px2dp(16),color:'#333'}}>订单类型</Text>
                        <View style={styles.draw_btn_wrap}>
                            <TouchableWithoutFeedback onPress={()=>{this.changeOrderType('全部')}}>
                                <View style={[styles.draw_btn,this.state.orderType=='全部'?styles.draw_btn_on:'']}>
                                    <Text style={[styles.draw_btn_font,this.state.orderType=='全部'?styles.draw_btn_font_on:'']}>全部</Text>
                                </View>
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback onPress={()=>{this.changeOrderType('陪护单')}}>
                                <View style={[styles.draw_btn,this.state.orderType=='陪护单'?styles.draw_btn_on:'']}>
                                    <Text style={[styles.draw_btn_font,this.state.orderType=='陪护单'?styles.draw_btn_font_on:'']}>陪护单</Text>
                                </View>
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback onPress={()=>{this.changeOrderType('母指单')}}>
                                <View style={[styles.draw_btn,this.state.orderType=='母指单'?styles.draw_btn_on:'']}>
                                    <Text style={[styles.draw_btn_font,this.state.orderType=='母指单'?styles.draw_btn_font_on:'']}>母指单</Text>
                                </View>
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback onPress={()=>{this.changeOrderType('导乐单')}}>
                                <View style={[styles.draw_btn,this.state.orderType=='导乐单'?styles.draw_btn_on:'']}>
                                    <Text style={[styles.draw_btn_font,this.state.orderType=='导乐单'?styles.draw_btn_font_on:'']}>导乐单</Text>
                                </View>
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback onPress={()=>{this.changeOrderType('月嫂单')}}>
                                <View style={[styles.draw_btn,this.state.orderType=='月嫂单'?styles.draw_btn_on:'']}>
                                    <Text style={[styles.draw_btn_font,this.state.orderType=='月嫂单'?styles.draw_btn_font_on:'']}>月嫂单</Text>
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                    </View>
                    <View style={styles.draw_item}>
                        <Text style={{fontSize:px2dp(16),color:'#333'}}>发放状态</Text>
                        <View style={styles.draw_btn_wrap}>
                            <TouchableWithoutFeedback onPress={()=>{this.changeSalaryState('全部')}}>
                                <View style={[styles.draw_btn,this.state.salaryState=='全部'?styles.draw_btn_on:'']}>
                                    <Text style={[styles.draw_btn_font,this.state.salaryState=='全部'?styles.draw_btn_font_on:'']}>全部</Text>
                                </View>
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback onPress={()=>{this.changeSalaryState('未发放')}}>
                                <View style={[styles.draw_btn,this.state.salaryState=='未发放'?styles.draw_btn_on:'']}>
                                    <Text style={[styles.draw_btn_font,this.state.salaryState=='未发放'?styles.draw_btn_font_on:'']}>未发放</Text>
                                </View>
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback onPress={()=>{this.changeSalaryState('已发放')}}>
                                <View style={[styles.draw_btn,this.state.salaryState=='已发放'?styles.draw_btn_on:'']}>
                                    <Text style={[styles.draw_btn_font,this.state.salaryState=='已发放'?styles.draw_btn_font_on:'']}>已发放</Text>
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                    </View>
                    <View style={styles.draw_item}>
                        <Text style={{fontSize:px2dp(16),color:'#333'}}>发工资时间</Text>
                        <View style={styles.draw_btn_wrap}>
                            <TouchableWithoutFeedback onPress={()=>{this.changeSalaryTime('全部')}}>
                                <View style={[styles.draw_btn,this.state.salaryTime=='全部'?styles.draw_btn_on:'']}>
                                    <Text style={[styles.draw_btn_font,this.state.salaryTime=='全部'?styles.draw_btn_font_on:'']}>全部</Text>
                                </View>
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback onPress={()=>{this.changeSalaryTime('本月')}}>
                                <View style={[styles.draw_btn,this.state.salaryTime=='本月'?styles.draw_btn_on:'']}>
                                    <Text style={[styles.draw_btn_font,this.state.salaryTime=='本月'?styles.draw_btn_font_on:'']}>本月</Text>
                                </View>
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback onPress={()=>{this.changeSalaryTime('上月')}}>
                                <View style={[styles.draw_btn,this.state.salaryTime=='上月'?styles.draw_btn_on:'']}>
                                    <Text style={[styles.draw_btn_font,this.state.salaryTime=='上月'?styles.draw_btn_font_on:'']}>上月</Text>
                                </View>
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback onPress={()=>{this.changeSalaryTime('今年')}}>
                                <View style={[styles.draw_btn,this.state.salaryTime=='今年'?styles.draw_btn_on:'']}>
                                    <Text style={[styles.draw_btn_font,this.state.salaryTime=='今年'?styles.draw_btn_font_on:'']}>今年</Text>
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                    </View>
                </View>
                <View style={{paddingHorizontal:px2dp(18),flexDirection:'row',justifyContent: 'space-between',marginTop: px2dp(40)}}>
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
                    <View style={{flex:1,backgroundColor: '#fcfcfc'}}>
                        <Header right={true} title={'工资列表'} navigate={this.props.navigation} onPenRightDrawer={this.onPenRightDrawer.bind(this)}/>
                        <View style={{elevation:5,backgroundColor:'#fff',marginBottom: px2dp(10)}}>
                            <View style={styles.search_wrap}>
                                <View style={styles.sub_search_wrap}>
                                    <TextInput placeholder={'请输入员工姓名/手机号'} style={styles.search_input}/>
                                    <Icon name="search" size={18} color="#a9a9a9" style={styles.seek_symbol} />
                                </View>
                            </View>
                            <View style={[styles.flex_space_between,styles.check_class_wrap]}>
                                <TouchableWithoutFeedback onPress={()=>{this.salaryTab(0)}}>
                                    <View style={[styles.class_item,this.state.hasGive==0?styles.class_item_on:'']}>
                                        <Text style={[styles.class_item_title,this.state.hasGive==0?styles.class_title_blue:'']}>未发工资</Text>
                                    </View>
                                </TouchableWithoutFeedback>
                                <View style={styles.class_gap}></View>
                                <TouchableWithoutFeedback onPress={()=>{this.salaryTab(1)}}>
                                    <View style={[styles.class_item,this.state.hasGive==1?styles.class_item_on:'']}>
                                        <Text style={[styles.class_item_title,this.state.hasGive==1?styles.class_title_blue:'']}>已发工资</Text>
                                    </View>
                                </TouchableWithoutFeedback>
                            </View>
                        </View>
                        <ScrollView>
                            <View>
                                <TouchableWithoutFeedback onPress={()=>{navigate('SalaryDetail')}}>
                                    <View style={[styles.flex_space_between,styles.salary_item]}>
                                        <Text style={{fontSize:px2dp(13)}}>周晓日(月嫂)</Text>
                                        <Text style={{fontSize:px2dp(13)}}>10月份工资</Text>
                                        <View style={{flexDirection: 'row',alignItems: 'center'}}>
                                            {
                                                this.state.hasGive==0?(
                                                    <Text style={{fontSize:px2dp(13),color: '#f54c6c',marginRight: px2dp(10)}}>未发</Text>
                                                ):(
                                                    <Text style={{fontSize:px2dp(13),color: '#7ace2a',marginRight: px2dp(10)}}>已发</Text>
                                                )
                                            }
                                            <Icon name="angle-right" size={28} color="#b0b0b0" />
                                        </View>
                                    </View>
                                </TouchableWithoutFeedback>
                                <View style={[styles.flex_space_between,styles.salary_item]}>
                                    <Text style={{fontSize:px2dp(13)}}>周晓日(月嫂)</Text>
                                    <Text style={{fontSize:px2dp(13)}}>10月份工资</Text>
                                    <View style={{flexDirection: 'row',alignItems: 'center'}}>
                                        <Text style={{fontSize:px2dp(13),color: '#7ace2a',marginRight: px2dp(10)}}>已发</Text>
                                        <Icon name="angle-right" size={28} color="#b0b0b0" />
                                    </View>
                                </View>
                                <View style={[styles.flex_space_between,styles.salary_item]}>
                                    <Text style={{fontSize:px2dp(13)}}>周晓日(月嫂)</Text>
                                    <Text style={{fontSize:px2dp(13)}}>10月份工资</Text>
                                    <View style={{flexDirection: 'row',alignItems: 'center'}}>
                                        <Text style={{fontSize:px2dp(13),color: '#7ace2a',marginRight: px2dp(10)}}>已发</Text>
                                        <Icon name="angle-right" size={28} color="#b0b0b0" />
                                    </View>
                                </View>
                                <View style={styles.more_btn}>
                                    <Text style={{fontSize:px2dp(18),textAlign:'center',lineHeight: px2dp(42),color:'#64bdf9'}}>加载更多</Text>
                                </View>
                            </View>
                        </ScrollView>
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
        height:px2dp(65)
    },
    sub_search_wrap:{
        flex:1,
        borderRadius:px2dp(13),
        backgroundColor:'#f2f2f2',
        height:px2dp(40)
    },
    search_input:{
        flex:1,
        paddingLeft: px2dp(40),
        height:px2dp(40),
        fontSize:px2dp(14)
    },
    seek_symbol:{
        position: 'absolute',
        left:px2dp(13),
        top:px2dp(10)
    },
    check_class_wrap:{
        height:px2dp(40),
        paddingHorizontal: px2dp(45)
    },
    class_gap:{
        width:1,
        height:px2dp(25),
        backgroundColor:'#d9d9d9'
    },
    class_item:{
        width:px2dp(98),
        height:px2dp(40)
    },
    class_item_title:{
        fontSize: px2dp(14),
        lineHeight:px2dp(40),
        textAlign: 'center'
    },
    class_item_on:{
        borderBottomWidth:px2dp(2),
        borderBottomColor:'#64bdf9'
    },
    class_title_blue:{
        color:'#64bdf9'
    },
    salary_item:{
        paddingLeft: px2dp(25),
        paddingRight: px2dp(11),
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
        marginTop: px2dp(21),
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
        paddingBottom: px2dp(20),
        paddingLeft:px2dp(18),
        marginBottom:px2dp(30)
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
    }
});