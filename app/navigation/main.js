import React from "react";
import login from "@layouts/login";
import register from "@layouts/register";
import main from "@layouts/main";
import accountSetting from "@layouts/accountSetting";
import previousOffers from "@layouts/previousOffers";
import purchasePremium from "@layouts/purchasePremium";
import purchaseType from "@layouts/purchaseType";
import purchaseMain from "@layouts/purchaseMain";
import increaseTime from "@layouts/increaseTime";
import sell from "@layouts/sell";
import { createBottomTabNavigator } from "react-navigation-tabs";
import { createStackNavigator } from "react-navigation-stack";
import helper from "@layouts/helper";

// Main Stack View App
const StackNavigator = createStackNavigator(
    {
        login: {
            screen: login
        },
        register: {
            screen: register
        },
        main: {
            screen: main
        },
        accountSetting: {
            screen: accountSetting
        },
        increaseTime: {
            screen: increaseTime
        },
        previousOffers: {
            screen: previousOffers
        },
        purchasePremium: {
            screen: purchasePremium
        },
        purchaseType: {
            screen: purchaseType
        },
        sell: {
            screen: sell
        },
        purchaseMain: {
            screen: purchaseMain
        },
        helper: {
            screen: helper
        },
    },
    {
        headerMode: "none",
        initialRouteName: "login"
    }
);

// Define Root Stack support Modal Screen
const RootStack = createStackNavigator(
    {
        StackNavigator: {
            screen: StackNavigator
        }
    },
    {
        mode: "modal",
        headerMode: "none",
        initialRouteName: "StackNavigator",
    }
);

export default RootStack;