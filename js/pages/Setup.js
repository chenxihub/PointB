import React, {Component} from 'react';

import {StackNavigator} from 'react-navigation';

import WelcomePage from './WelcomePage';

function setup() {
    //进行相关的配置
    const ModalStack = StackNavigator({
        Home: {
            screen: WelcomePage,
        }
    });
    return <ModalStack/>
}

module.export = setup;