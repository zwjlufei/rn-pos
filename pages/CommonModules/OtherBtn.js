//顶部导航
import React, {Component} from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    StatusBar,
    Dimensions,
    TouchableWithoutFeedback,
    Modal, TextInput
} from 'react-native';
const {width,height} = Dimensions.get('window');
import px2dp from './../tools/px2dp';
import Picker from 'react-native-wheel-picker';
import {dataReset,feach_request,getStorage,Toast} from './../tools/Public';
const PickerItem = Picker.Item;
const itemList=[];
const timeList=[-1,-2,-3,-4,-5,-6,-7,0];
const lastList=[];
const careList=[];
for(var i=0;i<100;i++){
    if(i<10){
        timeList.push(i+1)
    }
    if(i<28){
        careList.push((i+1)/2)
    }
    if(i!==25 || i!==41){
        itemList.push(i+1)
    }
    if(i<50){
        lastList.push(i+1)
    }
}
export default class OtherBtn extends Component{
    static navigationOptions = {
        header: null
    };
    constructor(props){
        super(props);
        this.state = {
            modalVisible:true,
            selectedItem : '',
            itemList: [],
            unit:''
        }
    }
    componentWillMount(){
        if(this.props.type=='day'){
            this.setState({
                selectedItem : (itemList.length/2)-1,
                itemList: itemList,
                unit:'  天'
            })
        }else if(this.props.type=='time'){
            this.setState({
                selectedItem : 7,
                itemList: timeList,
                unit:'  小时'
            })
        }else if(this.props.type=='care'){
            this.setState({
                selectedItem : 7,
                itemList: careList,
                unit:'  天'
            })
        }else{
            this.setState({
                selectedItem : 2,
                itemList: lastList,
                unit:'  次'
            })
        }
    }
    //picker值切换
    onPickerSelect (index) {
        this.setState({
            selectedItem: index
        })
    }
    //确定按钮执行的事件
    confirmFun(){
        const day = this.state.itemList[this.state.selectedItem];
        this.props.changeDay(day);
        this.setState({
            modalVisible: false
        })
    }
    render(){
        return(
            <Modal
                animationType="slide"
                transparent={true}
                visible={this.state.modalVisible}
                onRequestClose={() => {
                    this.setState({
                        modalVisible: false
                    })
                }}>
                <View style={styles.modal_wrap}>
                    <View style={styles.content_wrap}>
                        <View>
                            <Picker style={{width: px2dp(240), height: px2dp(150)}}
                                    selectedValue={this.state.selectedItem}
                                    itemStyle={{color:"#333", fontSize:20}}
                                    onValueChange={(index) => this.onPickerSelect(index)}>
                                {this.state.itemList.map((value, i) => (
                                    <PickerItem label={value+this.state.unit} value={i} key={i}/>
                                ))}
                            </Picker>
                            <View style={styles.arrow_top}></View>
                            <View style={styles.arrow_bottom}></View>
                        </View>
                        <View style={styles.font_wrap}>
                        <TouchableWithoutFeedback onPress={()=>{
                            this.props.changeDay();
                            this.setState({
                                modalVisible: false
                            })
                        }}>
                            <View style={styles.modal_btn}>
                                <Text style={styles.btn_font}>取消</Text>
                            </View>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={()=>{this.confirmFun()}}>
                            <View style={[styles.modal_btn,styles.btn_bg]}>
                                <Text style={[styles.btn_font,styles.right_btn_font]}>确定</Text>
                            </View>
                        </TouchableWithoutFeedback>
                        </View>
                    </View>
                </View>
            </Modal>
        )
    }
}
const styles = StyleSheet.create({
    flex:{
        flex: 1
    },
    modal_wrap:{
        flex:1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center'
    },
    headerBox:{
        width:width,
        height:px2dp(50),
        backgroundColor:'#64bdf9',
        flexDirection:'row',
        justifyContent: 'space-between',
        alignItems:'center',
        paddingLeft: px2dp(17),
        paddingRight: px2dp(17)
    },
    content_wrap:{
        width:px2dp(280),
        height:px2dp(245),
        backgroundColor:'#ffffff',
        paddingHorizontal:px2dp(15),
        borderRadius:px2dp(10),
        paddingTop: px2dp(10)
    },
    close_btn:{
        position: 'absolute',
        top:px2dp(-20)
    },
    arrow_top:{
        width:px2dp(250),
        height:px2dp(1),
        backgroundColor:'#f2f2f2',
        position: 'absolute',
        top: px2dp(59),
        left:0
    },
    arrow_bottom:{
        width:px2dp(250),
        height:px2dp(2),
        backgroundColor:'#f2f2f2',
        position: 'absolute',
        top: px2dp(89),
        left:0
    },
    font_wrap:{
        flexDirection: 'row',
        justifyContent:'space-between',
        alignItems:'center',
        marginTop:px2dp(20)
    },
    modal_btn:{
        width:px2dp(118),
        height:px2dp(43),
        borderRadius:5,
        elevation:2
    },
    btn_bg:{
        backgroundColor:'#64bdf9'
    },
    btn_font:{
        textAlign: 'center',
        lineHeight:px2dp(43),
        color: '#64bdf9'
    },
    right_btn_font:{
        color: '#fff'
    },
    input_style:{
        backgroundColor:'#ffffff',
        height:px2dp(40),
        borderRadius:5,
        elevation:3,
        paddingLeft: px2dp(10)
    },
    input_font:{
        fontSize:px2dp(15),
        color:'#333'
    }
});