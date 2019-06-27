var NoDoublePrint = {
    lastPressTime: 1,
    onPress(callback){
        let curTime = new Date().getTime();
        if (curTime - this.lastPressTime > 5000) {
            this.lastPressTime = curTime;
            callback();
        }
    },
};
module.exports = NoDoublePrint;