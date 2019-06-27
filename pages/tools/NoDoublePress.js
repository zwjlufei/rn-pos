var NoDoublePress = {
    lastPressTime: 1,
    onPress(callback){
        let curTime = new Date().getTime();
        if (curTime - this.lastPressTime > 3000) {
            this.lastPressTime = curTime;
            callback();
        }
    },
};
module.exports = NoDoublePress;