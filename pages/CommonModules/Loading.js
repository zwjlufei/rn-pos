//顶部导航
import React, {Component} from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    StatusBar,
    Dimensions,
    TouchableWithoutFeedback, Image, ActivityIndicator
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
            loading:true
        }
    }
    componentWillReceiveProps(nextProps){
        this.setState({
            loading:nextProps.loading
        })
    }
    render(){
        return(
            <View>
                {
                    this.state.loading ? (
                        <View style={{position: 'absolute',left: 0,width:width,height:px2dp(200),paddingTop:px2dp(150),elevation:5}}>
                            <ActivityIndicator
                                animating={this.state.loading}
                                size='large'
                                style={{backgroundColor:'transparent'}}
                                color="#d9d9d9"
                            />
                        </View>
                    ):(null)
                }
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