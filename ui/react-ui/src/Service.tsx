import axios from 'axios';
import {useEffect, useState} from "react";

function Service() {

    const [customers, setCustomers] = useState([]);

    useEffect(() => {
        axios.get('https://jsonplaceholder.typicode.com/users')
            .then((response)=> {
                setCustomers(response.data)
                console.log(response)
            })
            .catch(function (error) {
                console.log(error)
            })
    }, []);

    return(
        <>
            <div className="p-4">
                <h1 className="text-2xl font-bold mb-4">Customer List</h1>
                {customers.length > 0 ? (
                    <table className="table-auto border-collapse border border-gray-300 w-full">
                        <thead>
                        <tr className="bg-gray-200">
                            <th className="border border-gray-300 p-2">ID</th>
                            <th className="border border-gray-300 p-2">Name</th>
                            <th className="border border-gray-300 p-2">Username</th>
                            <th className="border border-gray-300 p-2">Email</th>
                            <th className="border border-gray-300 p-2">City</th>
                            <th className="border border-gray-300 p-2">Company</th>
                        </tr>
                        </thead>
                        <tbody>
                        {customers.map(customer => (
                            <tr key={customer.id}>
                                <td className="border border-gray-300 p-2">{customer.id}</td>
                                <td className="border border-gray-300 p-2">{customer.name}</td>
                                <td className="border border-gray-300 p-2">{customer.username}</td>
                                <td className="border border-gray-300 p-2">{customer.email}</td>
                                <td className="border border-gray-300 p-2">{customer.address.city}</td>
                                <td className="border border-gray-300 p-2">{customer.company.name}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                ) : (
                    <p>Loading...</p>
                )}
            </div>
        </>
    )
}

export default Service;