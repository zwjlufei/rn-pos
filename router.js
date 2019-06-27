import React from 'react';
import {createStackNavigator} from 'react-navigation';
import Login from './pages/Login';
import CreateOrder from './pages/CreatOrder';
import BasicInfo from './pages/BasicInfo';
import NannyInfo from  './pages/CreatOrder/NannyInfo';
import CreateNanny from './pages/CreatOrder/CreatNanny';
import CreateDoula from './pages/CreatOrder/CreateDoula';
import DoulaInfo from './pages/CreatOrder/DoulaInfo';
import CreateCare from './pages/CreatOrder/CreateCare';
import CareInfo from './pages/CreatOrder/CareInfo';
import CreateProlactin from './pages/CreatOrder/CreateProlactin';
import ProlactinInfo from './pages/CreatOrder/ProlactinInfo';
import OrderList from './pages/MyOrder/OrderList';
import NannyOrderInfo from './pages/MyOrder/NannyOrderInfo';
import ProlactinOrderInfo from './pages/MyOrder/ProlactinOrderInfo';
import DoulaOrderInfo from './pages/MyOrder/DoulaOrderInfo';
import CareOrderInfo from './pages/MyOrder/CareOrderInfo';
import NannyPay from './pages/MyOrder/NannyPay';
import ProlactinPay from './pages/MyOrder/ProlactinPay';
import CarePay from './pages/MyOrder/CarePay';
import DoulaPay from './pages/MyOrder/DoulaPay';
import StopWork from './pages/MyOrder/StopWork';
import GoWork from './pages/MyOrder/GoWork';
import CreateNewServer from './pages/MyOrder/CreateNewServer';
import ChargeBack from './pages/MyOrder/ChargeBack';
import PayWays from './pages/PayPages/PayWays';
import CodePay from './pages/PayPages/CodePay';
import SuccessPay from './pages/PayPages/SuccessPay';
import FailPay from './pages/PayPages/FailPay';
import NannyList from './pages/NannyList/NannyList';
import NannyDetail from './pages/NannyList/NannyDetail';
import EditInfo from './pages/NannyList/EditInfo';
import PayList from './pages/PayRecord/PayList';
import PayDetail from './pages/PayRecord/PayDetail';
import CheckPay from './pages/PayRecord/CheckPay';
import Home from './pages/Home';
import SetPage from './pages/SetPage';
import LockScreen from './pages/LockScreen';
import SetLock from './pages/SetLock';
import ForgetLock from './pages/ForgetLock';
import CareBack from './pages/MyOrder/CareBack';
import ProlactinBack from './pages/MyOrder/ProlactinBack';
import MyCustomers from './pages/MyCustomers/MyCustomers';
import ProductList from './pages/Products/ProductList';
import MyCart from './pages/Products/MyCart';
import SalaryList from './pages/SalaryList/SalaryList';
import FilterOrderList from './pages/SalaryList/FilterOrderList';
import SalaryDetail from './pages/SalaryList/SalaryDetail';
import UnitDetail from './pages/SalaryList/UnitDetail';
import ProductDetails from './pages/Products/ProductDetails';
import ProductBack from './pages/Products/ProductBack';
const Router = createStackNavigator({
        Login: {
            screen: Login
        }, // 登录页
        CreateOrder:{
            screen:CreateOrder
        },
        BasicInfo:{
            screen:BasicInfo
        },
        NannyInfo:{
            screen:NannyInfo
        },
        CreateNanny:{
            screen:CreateNanny
        },
        CreateDoula:{
            screen:CreateDoula
        },
        DoulaInfo:{
            screen:DoulaInfo
        },
        CreateCare:{
            screen:CreateCare
        },
        CareInfo:{
            screen:CareInfo
        },
        CreateProlactin:{
            screen:CreateProlactin
        },
        ProlactinInfo:{
            screen:ProlactinInfo
        },
        OrderList:{
            screen:OrderList
        },
        NannyOrderInfo:{
            screen:NannyOrderInfo
        },
        ProlactinOrderInfo:{
            screen:ProlactinOrderInfo
        },
        DoulaOrderInfo:{
            screen:DoulaOrderInfo
        },
        CareOrderInfo:{
            screen:CareOrderInfo
        },
        NannyPay:{
            screen:NannyPay
        },
        ProlactinPay:{
            screen:ProlactinPay
        },
        CarePay:{
            screen:CarePay
        },
        DoulaPay:{
            screen:DoulaPay
        },
        StopWork:{
            screen:StopWork
        },
        GoWork:{
            screen:GoWork
        },
        CreateNewServer:{
            screen:CreateNewServer
        },
        ChargeBack:{
            screen:ChargeBack
        },
        PayWays:{
            screen:PayWays
        },
        CodePay:{
            screen:CodePay
        },
        SuccessPay:{
            screen:SuccessPay
        },
        FailPay:{
            screen:FailPay
        },
        NannyList:{
            screen:NannyList
        },
        NannyDetail:{
            screen:NannyDetail
        },
        EditInfo:{
            screen:EditInfo
        },
        PayList:{
            screen:PayList
        },
        PayDetail:{
            screen:PayDetail
        },
        CheckPay:{
            screen:CheckPay
        },
        Home:{
            screen:Home
        },
        SetPage:{
            screen:SetPage
        },
        LockScreen:{
            screen:LockScreen
        },
        SetLock:{
            screen:SetLock
        },
        ForgetLock:{
            screen:ForgetLock
        },
        CareBack:{
            screen:CareBack
        },
        ProlactinBack:{
            screen:ProlactinBack
        },
        MyCustomers:{
            screen:MyCustomers
        },
        ProductList:{
            screen:ProductList
        },
        MyCart:{
            screen:MyCart
        },
        SalaryList:{
            screen:SalaryList
        },
        FilterOrderList:{
            screen:FilterOrderList
        },
        SalaryDetail:{
            screen:SalaryDetail
        },
        UnitDetail:{
            screen:UnitDetail
        },
        ProductDetails:{
            screen:ProductDetails
        },
        ProductBack:{
            screen:ProductBack
        }
    },
    {
        initialRouteName: 'Login'
    });

export default Router;
