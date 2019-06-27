//顶部导航
import React, {Component} from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    StatusBar,
    Dimensions,
    TouchableWithoutFeedback, Image
} from 'react-native';
var {width,height} = Dimensions.get('window');
import px2dp from './../tools/px2dp';
export default class NoNet extends Component{
    static navigationOptions = {
        header: null
    };
    constructor(props){
        super(props);
        this.state = {

        }
    }

    render(){
        return(
            <View style={styles.flex}>
                <View style={{flexDirection: 'column',alignItems: 'center'}}>
                    <Image
                        source={require('./../../images/no_network.png')}
                        style={{width:px2dp(340),height:px2dp(185)}}
                    />
                    <Text style={styles.title}>网络丢失了...</Text>
                </View>
                <TouchableWithoutFeedback onPress={()=>{this.props.init()}}>
                    <View style={styles.fresh_btn}>
                        <Text style={styles.btn_font}>点击刷新</Text>
                    </View>
                </TouchableWithoutFeedback>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    flex:{
        flex: 1,
        flexDirection: 'column',
        alignItems:'center',
        paddingTop: px2dp(55)
    },
    fresh_btn:{
        width:px2dp(158),
        height:px2dp(43),
        backgroundColor:'#64bdf9',
        borderRadius:px2dp(5),
        elevation:3,
        marginBottom: px2dp(30),
        marginTop:px2dp(17)
    },
    btn_font:{
        textAlign: 'center',
        lineHeight:px2dp(43),
        color: '#fff',
        fontSize: px2dp(16)
    },
    title:{
        fontSize:px2dp(12),
        color:'#b7b7b7',
        position: 'absolute',
        bottom:px2dp(5),
    }
});