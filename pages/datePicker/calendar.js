import React , {Component}from "react";
import {StyleSheet, View, Text, Dimensions, Modal, TouchableWithoutFeedback} from "react-native";
import { formatFn, getDefaultDate } from "./utils";
import zhCn from "./rmc-date-picker/lib/locale/zh_CN";
import enUs from "./rmc-date-picker/lib/locale/en_US";
import MDatePicker from "./rmc-date-picker/lib/DatePicker";
import px2dp from "../tools/px2dp";
var {width,height} = Dimensions.get('window');
export default class DatePicker extends Component {
    constructor(props){
        super(props);
        this.state=({
            noChange:true,
            time:'',
            modalVisible:this.props.show
        })
    }
    static defaultProps = {
        extra: "请选择"
    };

    componentWillMount(){
        this.setState({
            time:formatFn(this.props.mode,new Date())
        })
    }
    onDateChange = (date) => {
        this.setState({
            noChange:false,
            time:formatFn(this.props.mode,date)
        })
    }
    render() {
        const {
            children,
            extra,
            minuteStep,
            locale,
            mode,
            minDate,
            maxDate,
            date,
            onValueChange
        } = this.props;
        return (
            <View>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={this.props.show}
                    onRequestClose={() => {
                        this.setState({
                            modalVisible: false
                        })
                        this.props.closeDate(false)
                    }}
                >
                    <View style={styles.picker_wrap}>
                        <View style={styles.sub_picker_wrap}>
                            <MDatePicker
                                style={{backgroundColor:'#ffffff'}}
                                minuteStep={minuteStep}
                                locale={this.props.locale && this.props.locale == "US" ? enUs : zhCn}
                                mode={this.props.mode}
                                minDate={minDate}
                                maxDate={maxDate}
                                defaultDate={getDefaultDate(this.props)}
                                onDateChange={this.onDateChange}
                            />
                            <View style={styles.flex_space_between}>
                                <TouchableWithoutFeedback onPress={()=>{this.setState({
                                    modalVisible: false
                                });
                                  this.props.closeDate(false)
                                }}>
                                    <View>
                                        <Text style={{fontSize:22}}>取消</Text>
                                    </View>
                                </TouchableWithoutFeedback>
                                <TouchableWithoutFeedback onPress={()=>{
                                    this.setState({
                                        modalVisible: false
                                    });
                                    this.props.getTime(this.state.time)
                                    this.props.closeDate(false);
                                }}>
                                    <View>
                                        <Text style={{fontSize:22}}>确定</Text>
                                    </View>
                                </TouchableWithoutFeedback>
                            </View>
                        </View>
                    </View>
                </Modal>
            </View>

        );
    }
}
const styles = StyleSheet.create({
    picker_wrap:{
        flex:1,
        flexDirection:'column',
        justifyContent:'center',
        backgroundColor: 'rgba(0,0,0,0.5)'
    },
    sub_picker_wrap:{
        width:width,
        height:300,
        backgroundColor:'#ffffff',
        paddingTop: 30,
        paddingBottom: 20,
        paddingHorizontal: px2dp(10)
    },
    flex_space_between:{
        width:width,
        flex:1,
        flexDirection:'row',
        justifyContent: 'space-around',
        alignItems:'center',
        marginTop: 10
    }
})