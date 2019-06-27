/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';


import WangPos from './youmayouzi'

const instructions = Platform.select({
    ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
    android:
        'Double tap R on your keyboard to reload,\n' +
        'Shake or press menu button for dev menu',
});

type Props = {};
export default class YoumayouziNR extends Component {
    constructor(props) {
        super(props);
        this.state = {
            location: null,
        }
    }

    componentDidMount() {
        //info = WangPos.scanQR();
        //this.setState({location: info});
        //二维码
        //WangPos.scanQR((location)=> {
        //    this.setState({location: location})
        //});
        //打印
        // aa = '{"order_no":"1111000202", "type":"月嫂单",  "service":"李丽丽",  "location":"北京市朝阳区",  "pay":"12800"}';
        // WangPos.print(aa, (location)=> {
        //     this.setState({location: location})
        // });

        //测试刷卡
        // WangPos.consume("A0000888882234", "柚妈柚子/小屯路-收款", "1", "[{'goods_id':'iphone7s_128G','goods_name':'iphone7s 128G','quantity':10,'price':100}]",(location)=> {
        //    this.setState({location: location})
        // });

        //测试查询
        //WangPos.query("A0000888882229", (location)=> {
        //    this.setState({location: location})
        //});

        //测试打印指定订单
        /*WangPos.printPay("A0000888882229", (location)=> {
            this.setState({location: location})
        });*/

        //测试打印
        /*WangPos.settle((location)=> {
            this.setState({location: location})
        });*/

        //测试获取信息
        // WangPos.getDeviceType((location)=> {
        //     this.setState({location: location})
        // });

    }

    render() {

        if (this.state.location) {
            return <Text >
                { this.state.location}
            </Text>
        } else {
            return <View>
                <Text>你好! xx</Text>
            </View>
        };
    }
}
