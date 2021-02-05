import React, {useState, useEffect} from 'react';
import {Switch,List, Avatar, Button, notification} from 'antd';
import NoAvatar from '../../../../assets/img/png/no-avatar.png';
import {EditOutlined, DeleteOutlined, StopOutlined, CheckOutlined} from '@ant-design/icons';
import Modal from '../../../Modal';
import EditUserForm from '../EditUserForm';

import {getAvatarApi, activateUserApi} from '../../../../api/user';

import {getAccessTokenApi} from '../../../../api/auth';

import './ListsUsers.scss';




export default function ListUsers(props){
    const {usersActive, usersInactive, setReloadUsers} = props;
    const [viewUsersActives, setViewUsersActive] =useState(true);
    const [isVisibleModal, setIsVisibleModal] = useState(false);
    const [modalTitle, setModalTitle]= useState("");
    const [modalContent, setModalContent ] = useState(null);
 

    return(
        <div className="list-users">
            <div className="list-users__switch">
                <Switch
                    defaultChecked
                    onChange={()=> setViewUsersActive(!viewUsersActives)}
                />
                <span>
                    {viewUsersActives ? "Usuarios Activos" : "Usuarios Inactivos"}
                </span>


            </div>
            {viewUsersActives? 
            <UsersActive 
                usersActive={usersActive} 
                setIsVisibleModal={setIsVisibleModal} 
                setModalTitle={setModalTitle} 
                setModalContent={setModalContent}
                setReloadUsers={setReloadUsers}
            /> : 
            <UsersInactive 
                usersInactive={usersInactive}
                setReloadUsers={setReloadUsers}
            />}

            <Modal
            title={modalTitle}
            isVisible={isVisibleModal}
            setIsVisible={setIsVisibleModal}
            >
                {modalContent}
            </Modal>
        </div>
    )
}

function UsersActive(props){
    const {
        usersActive, 
        setIsVisibleModal, 
        setModalTitle, 
        setModalContent,
        setReloadUsers
    } = props;

    const editUser= user =>{
        setIsVisibleModal(true);
        setModalTitle(
            `Editar ${user.name ? user.name : "sin nombre"} ${
                user.lastname ? user.lastname : "..."}`
                );
        setModalContent(<EditUserForm 
            user={user} 
            setIsVisibleModal={setIsVisibleModal} 
            setReloadUsers={setReloadUsers}
            />)
    }


    return(
        <List 
            className="users-active"
            itemLayout="horizontal"
            dataSource={usersActive}
            renderItem={user => <UserActive user={user} editUser={editUser} setReloadUsers={setReloadUsers}/> }
        />
    )
}

function UserActive(props){
    const {user, editUser, setReloadUsers } = props;
    const [avatar, setAvatar] = useState(null);

    useEffect(()=>{
        if(user.avatar){
            getAvatarApi(user.avatar).then(response=>{
                setAvatar(response);
            })
        }else{
            setAvatar(null);
        }
    },[user])

    const desactivateUser = ()=>{
        const accessToken = getAccessTokenApi();

        activateUserApi(accessToken, user._id, false)
        .then(response=> {
            notification["success"]({
                message: response
            })
            setReloadUsers(true);
        })
        .catch(err =>{
            notification["error"]({
                message: err
            });
        } );
    };



    return(
        <List.Item
                actions={
                    [
                        <Button
                        type="primary"
                        onClick={()=> editUser(user)}
                        >
                            <EditOutlined />
                        </Button>,
                        <Button
                        type="danger"
                        onClick={desactivateUser}
                        >
                           <StopOutlined />
                        </Button>,
                        <Button
                        type="danger"
                        onClick={()=> console.log("delete user")}
                        >
                           <DeleteOutlined />
                        </Button>
                        
                    ]
                }
                >
                    <List.Item.Meta
                    avatar={<Avatar src={ avatar ? avatar : NoAvatar }/>}
                    title={`
                        ${user.name ? user.name : "..."} 
                        ${user.lastname ? user.lastname : "..."}
                    `}
                    description ={user.email}
                    />
                </List.Item>
    )
}

function UsersInactive(props){
    const {usersInactive, setReloadUsers} =props
    return(
        <List 
            className="users-inactive"
            itemLayout="horizontal"
            dataSource={usersInactive}
            renderItem={user=> <UserInactive user={user} setReloadUsers={setReloadUsers} />}
        />
    )
}

function UserInactive(props){
    const {user, setReloadUsers} = props;
    const [avatar, setAvatar] = useState(null);

    useEffect(()=>{
        if (user.avatar){
            getAvatarApi(user.avatar).then(response =>{
                setAvatar(response);
            });
        } else{
            setAvatar(null);
        }
    }, [user]);

    const activateUser = () =>{
        const accessToken = getAccessTokenApi();

        activateUserApi(accessToken, user._id, true)
        .then(response=> {
            notification["success"]({
                message: response
            })
            setReloadUsers(true);
        })
        .catch(err =>{
            notification["error"]({
                message: err
            });
        } );
    };


    return (
        <List.Item
                actions={
                    [
                        <Button
                        type="primary"
                        onClick={activateUser}
                        >
                            <CheckOutlined />
                        </Button>,
                        <Button
                        type="danger"
                        onClick={()=> console.log("delete user")}
                        >
                           <DeleteOutlined />
                        </Button>
                        
                    ]
                }
                >
                    <List.Item.Meta
                    avatar={<Avatar src={ avatar ? avatar : NoAvatar }/>}
                    title={`
                        ${user.name ? user.name : "..."} 
                        ${user.lastname ? user.lastname : "..."}
                    `}
                    description ={user.email}
                    />
                </List.Item>
    )
}