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
export default class EmptyStyle extends Component{
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
                <Image
                    source={require('./../../images/empty_list.png')}
                    style={{width:px2dp(340),height:px2dp(185),marginBottom:px2dp(15)}}
                />
                <Text style={{fontSize:px2dp(12),color:'#b7b7b7'}}>{this.props.hint?this.props.hint:'还没有订单记录哦！'}</Text>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    flex:{
        flex: 1,
        flexDirection: 'column',
        alignItems:'center',
        paddingTop: px2dp(47)
    },

});