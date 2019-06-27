package com.youmayouzi;

public class Constant {

    public static final int ACTION_QUERY = 1;
    public static final int ACTION_SETTLE = 2;
    public static final int ACTION_PRINT = 3;


    public static final int PAY_TYPE_BANK_CARD = 1;  //银行卡, 其他类型不支持。

    public static final int PAY_OPERATION_TYPE_PAY_CARD = 1; //刷卡
    public static final int PAY_OPERATION_TYPE_INSERT_CARD = 2; //插卡
    public static final int PAY_OPERATION_TYPE_WAVE_CARD  = 3; //挥卡

    public static final int  TRADE_STATUS_TO_BE_PAID = 100;  //未完成，待支付
    public static final int  TRADE_STATUS_FINISH = 101;      //交易成功
    public static final int  TRADE_STATUS_CLOSED = 102;      //交易已关闭
    public static final int  TRADE_STATUS_FINISH_WITH_REFUND = 103;   //交易成功，且有退款

    public static final int  SETTLEMENT_STATUS_NOT = 0;    //未结算
    public static final int  SETTLEMENT_STATUS_YES = 1;    //已结算

    public static final int  ORDER_STATUS_FINISH = 1;      //支付完成
    public static final int  ORDER_STATUS_CLOSED = 2;      //支付关闭
    public static final int  ORDER_STATUS_REFUND = 3;      //退款

}
