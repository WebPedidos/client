import React,{useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import logoWhite from '../../../assets/img/png/logo.png';

import {getMenuApi} from '../../../api/menu';

import {Menu} from 'antd';


import './MenuTop.scss';

export default function MenuTop(){

    const [menuData, setMenuData]= useState({});

    useEffect(()=>{
        getMenuApi().then(response =>{
            console.log(response);
        });
            
    },[]);

    return(
        <Menu className="menu-top-web" mode="horizontal">
            <Menu.Item className="menu-top__logo">
                <Link to={"/"}>
                    <img src={logoWhite} alt="logo web" />
                </Link>
            </Menu.Item>
            <Menu.Item className="menu-top__item">
                <Link to={"/"}>
                    Home
                </Link>
            </Menu.Item>
            <Menu.Item className="menu-top-web__item">
                <Link to={"/contact"}>
                    Contacto
                </Link>
            </Menu.Item>
            <Menu.Item className="menu-top-web__item">
                <Link to={"/admin"}>
                    Admin
                </Link>
            </Menu.Item>
            <div>
                Social Media
            </div>
        </Menu>
    )
}