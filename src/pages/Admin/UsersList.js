import React, {useEffect} from 'react'
import { message, Table } from 'antd'
import { useDispatch } from 'react-redux'
import { GetAllDoctors } from '../../apicalls/doctor'
import {ShowLoader} from '../../redux/loaderSlice'
import { GetAllUsers } from '../../apicalls/users'

function UsersList() {
  const [users, setusers] = React.useState([])

  const dispatch = useDispatch();
  const getData = async () => {
    try {
        dispatch(ShowLoader(true))
        const response = await GetAllUsers()
        dispatch(ShowLoader(false))
        if(response.success){
          setusers(response.data)
        }else{
          throw new Error(response.message)
        }
    } catch (error) {
      dispatch(ShowLoader(false))
      message.error(error.message)
    }
  };

  useEffect(() =>{
    getData();
  },[])

  const columns=[
    {
      title:"ID",
      dataIndex:"id",
    },
    {
      title:"Name",
      dataIndex:"name",
    },
    {
      title:"Email",
      dataIndex:"email"
    },
    {
      title:"Role",
      dataIndex:"role",
      render :(text,record) =>{
        return text.toUpperCase()
      }
    },     
  ];
  return (
    <div>
      <Table columns = {columns} dataSource={users} />
    </div>
  )
}

export default UsersList;
