import { useState, useEffect } from 'react';
import './FrontPage.css';

const apiUrl = 'https://9vm09a3iel.execute-api.us-east-2.amazonaws.com/customers'

export function FrontPage() {

    const [data, updateData] = useState([] as Array<Object>);
    const [message, updateMessage] = useState('');
    const [newData, updateNewData] = useState({ id: '', name: '', email: '' });



    const addData = () => {
        if (!(newData.id.length && newData.name.length && newData.email.length)) {
            window.alert('Please enter all values of ID , Name and Email before adding');
            return;
        }

        const requestOptions = {
            method: 'PUT',
            body: JSON.stringify(newData)
        }
        fetch(apiUrl, requestOptions)
            .then(response => response.json())
            .then(data => { fetchData(); updateNewData({ id: '', name: '', email: '' }); UpdateInfoText('Record added successfully!') })
            .catch(() => { UpdateInfoText('Error adding the record') })
    }

    const deleteData = (id: number) => {
        const requestOptions = {
            method: 'DELETE'
        }
        fetch(`${apiUrl}/${id}`, requestOptions)
            .then(response => response.json())
            .then(data => { fetchData(); updateNewData({ id: '', name: '', email: '' }); UpdateInfoText('Record deleted successfully!') })
            .catch(() => { UpdateInfoText('Error deleting the record') })
    }

    const editData = (id: number) => {
        fetch(`${apiUrl}/${id}`)
            .then(response => response.json())
            .then(data => { updateNewData(data.Item); UpdateInfoText('Please enter new values in the input box and Hit save') })
            .catch(() => { UpdateInfoText('Error updating the data') })

    }

    const fetchData = () => {
        fetch(apiUrl)
            .then(res => res.json())
            .then((response: any) => {
                if (response) {
                    updateData(response.Items);
                }
            }).catch((err) => {
                console.log(err)
                UpdateInfoText('Error fetching the data')
            })
    }

    const UpdateInfoText = (message: string) => {
        updateMessage(message);
        setTimeout(() => {
            updateMessage('');
        }, 5000)
    }

    const getDetails = data.map((d: any) => <tr key={d.id}>
        <td>{d.id}</td>
        <td>{d.name}</td>
        <td>{d.email}</td>
        <td>
            <button className="edit" onClick={() => editData(d.id)}>Edit</button> &nbsp;
            <button className="delete" onClick={() => deleteData(d.id)}>Delete</button>
        </td>
    </tr>)

    const changeText = (event: any, param: String) => {
        let newObj;
        if (event.which > 90 || event.which < 48) return;
        switch (param) {
            case 'id':
                newObj = { id: event.target.value, name: newData.name, email: newData.email }
                updateNewData(newObj)
                break;

            case 'name':
                newObj = { id: newData.id, name: event.target.value, email: newData.email }
                updateNewData(newObj)
                break;

            case 'email':
                newObj = { id: newData.id, name: newData.name, email: event.target.value }
                updateNewData(newObj)
                break;
        }

    }

    useEffect(() => {
        fetchData();
    }, []);

    return (<div className="main">
        <table>
            <tbody>
                <tr className="table-heading">
                    <th>ID</th>
                    <th>NAME</th>
                    <th>EMAIL</th>
                    <th>EDIT/DELETE</th>
                </tr>

                {getDetails}
                <tr>
                    <td>
                        <input type="text" placeholder="id" value={newData.id} onChange={(e) => changeText(e, 'id')} />
                    </td>
                    <td>
                        <input type="text" placeholder="name" value={newData.name} onChange={(e) => changeText(e, 'name')} />
                    </td>
                    <td>
                        <input type="text" placeholder="email" value={newData.email} onChange={(e) => changeText(e, 'email')} />
                    </td>
                    <td>
                        <button className="save" onClick={addData}>Save</button>
                    </td>
                </tr>
            </tbody>
        </table>
        <div className={message.length ? "message" : ""}>
            {message}
        </div>
    </div>);
}