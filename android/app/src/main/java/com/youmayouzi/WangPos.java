package com.youmayouzi;

import android.util.Log;


import android.app.AlertDialog;
import android.app.AlertDialog.Builder;
import android.content.DialogInterface;
import android.content.Intent;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import cn.weipass.pos.sdk.impl.WeiposImpl;
import cn.weipass.pos.sdk.Scanner;
import cn.weipass.pos.sdk.Scanner.OnResultListener;
import cn.weipass.pos.sdk.Printer;
import cn.weipass.pos.sdk.IPrint.OnEventListener;


import com.wangpos.by.cashier3.CashierHelper;
import com.wangpos.by.cashier3.CashierHelper.PayCallBack;

import java.util.List;

import org.json.JSONObject;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Locale;

public class WangPos extends ReactContextBaseJavaModule {

    //wangPOS 支付APP_ID，
    public static final String APP_ID = "5bbee5f4eb67001ab2b1dd11";
    public static final String NOTIFY_URL = "http://jiabank.8jiajia.com/api/notify/wangpos";

    private ReactApplicationContext reactContext;


    public WangPos (ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }
    private Callback locationCallback;

    @ReactMethod
    public void scanQR( Callback locationCallback ) {
        this.locationCallback = locationCallback;
        Scanner scanner = WeiposImpl.as().openScanner();

        if (scanner==null) {
            locationCallback.invoke("Error: Scanner is not ready.");
            return;
        }

        /**
         * 扫码类型，二维码
         * TYPE_QR = 1;
         *
         * 扫描类型，条码
         *  TYPE_BAR = 2;
         */
        scanner.scan(Scanner.TYPE_QR, myScannerListener);
    }

    public OnResultListener myScannerListener = new OnResultListener() {
        @Override
        public void onResult(int what, String in) {
            final StringBuffer sb = new StringBuffer(256);
            // TODO Auto-generated method stub

            sb.append(in);
            locationCallback.invoke(sb.toString());
        }
    };


    @ReactMethod
    public void print( String json, Callback locationCallback ) {
        this.locationCallback = locationCallback;
        Printer printer = null;


        try {
            // 设备可能没有打印机，open会抛异常
            printer = WeiposImpl.as().openPrinter();
        } catch (Exception e) {
            // TODO: handle exception
            locationCallback.invoke("Error: Printer is not ready.");
            return;
        }
        printer.setOnEventListener(myPrinterListener);

        ToolsUtil.printNormal(json, printer);
    }

    public OnEventListener myPrinterListener = new OnEventListener() {
        @Override
        public void onEvent(final int what, String in) {
            final StringBuffer sb = new StringBuffer(256);
            // TODO Auto-generated method stub

            final String message = ToolsUtil.getPrintErrorInfo(what, in);
            if (message == null || message.length() < 1) {
                sb.append("打印机信息状态未知：null") ;
                locationCallback.invoke(sb.toString());
                return;
            }
            sb.append(message);
            locationCallback.invoke(sb.toString());
        }
    };

    /*
     * 刷卡消费
     *   out_trade_no  商户支付订单号，商户系统内部订单号，确保在商户体系内部唯一
     *   body          商品描述，订单内商品描述，格式为“应用名称/店铺名称-实际商品名称”
     *   total_fee     订单金额  单位(分)
     *   notify_url    通知url   支付完成后，接收订单支付结果的Url
     *   goods_detail  商品详情  订单包含的商品列表信息，Json格式，其它说明详见商品明细说明
     *                           [{'goods_id':'iphone7s_128G','goods_name':'iphone7s 128G','quantity':10,'price':100}]
     *                           goods_id	  商品的编号
     *                           goods_name  商品名称
     *                           quantity	  商品数量
     *                           price	价格  单位为分
     */
    @ReactMethod
    public void consume(String out_trade_no, String body, String total_fee, String goods_detail, Callback locationCallback) {
        String app_id = APP_ID;
        int pay_type = Constant.PAY_TYPE_BANK_CARD;
        String notify_url = NOTIFY_URL;

        this.locationCallback = locationCallback;
        HashMap<String, String> params = new HashMap<>();

        params.put("app_id", app_id);   // 在北京微智全景技术有限公司的开发者中心(http://bp.wangpos.com/)注册账号，开发者中心->基本配置->开发者Id:
        params.put("out_trade_no", out_trade_no);   // 商户订单号，确保在商户体系内唯一
        params.put("body", body);   // 商品描述
        params.put("goods_detail", goods_detail);   // 商品详情
        params.put("pay_type", pay_type + "");      // 支付方式
        params.put("total_fee", total_fee + "");    // 订单金额
        params.put("notify_url", notify_url);

        CashierHelper.consume(reactContext, params, myPayCallBack);
    }

    public  PayCallBack  myPayCallBack = new PayCallBack() {
        @Override
        public void success(final String data) {
            //回调默认是在当前应用程序的主线程
            //Log.d(TAG, "success: " + data);
            try {
                JSONObject object = new JSONObject(data);
                JSONObject jsonData = object.optJSONObject("data");
                //tvResult.setText("支付成功：" + data);
                locationCallback.invoke("支付成功：" + data);

            } catch (Exception e) {
                e.printStackTrace();
                locationCallback.invoke("支付失败：");
            }
        }
        @Override
        public void failed(final String errorMessage) {
            //回调默认是在当前应用程序的主线程
            //Log.d(TAG, "failed: " + errorMessage);
            //tvResult.setText("支付失败：" + errorMessage);
            locationCallback.invoke("支付失败：" + errorMessage);
        }
    };


    @ReactMethod
    public void query(String out_trade_no, Callback locationCallback) {
        String app_id = APP_ID;

        this.locationCallback = locationCallback;
        HashMap<String, String> params = new HashMap<>();

        params.put("out_trade_no", out_trade_no);
        params.put("app_id", app_id);

        CashierHelper.query(reactContext, params, myPayQueryCallBack);

    }

    public  PayCallBack  myPayQueryCallBack = new PayCallBack() {
        @Override
        public void success(final String s) {
           // Log.d(TAG, "success: " + s);
            locationCallback.invoke("success："+ s);
        }

        @Override
        public void failed(final String s) {
            //Log.d(TAG, "failed: " + s);
            locationCallback.invoke("failed："+ s);
        }
    };


    @ReactMethod
    public void printPay(String out_trade_no, Callback locationCallback) {
        String app_id = APP_ID;

        this.locationCallback = locationCallback;
        HashMap<String, String> params = new HashMap<>();

        params.put("out_trade_no", out_trade_no);
        params.put("app_id", app_id);

        CashierHelper.print(reactContext, params, myPayQueryCallBack); //callback is same as the myPayQueryCallBack, so use it.

    }

    @ReactMethod
    public void settle(Callback locationCallback) {
        String app_id = APP_ID;

        this.locationCallback = locationCallback;
        HashMap<String, String> params = new HashMap<>();

        params.put("app_id", app_id);

        CashierHelper.settle(reactContext, params, myPayQueryCallBack); //callback is same as the myPayQueryCallBack, so use it.
    }

    @ReactMethod
    public void getDeviceType( Callback locationCallback ) {
        this.locationCallback = locationCallback;
        String deviceInfo = WeiposImpl.as().getDeviceInfo();

        locationCallback.invoke(deviceInfo);
        return;
    }

    @ReactMethod
    public void isWangPos( Callback locationCallback ) {
        this.locationCallback = locationCallback;
        String deviceInfo = WeiposImpl.as().getDeviceInfo();

        if (deviceInfo == null)
            locationCallback.invoke("False");
        else
            locationCallback.invoke("True");

        return;
    }


    @Override
    public String getName() {
        return "WangPos";
    }
}
