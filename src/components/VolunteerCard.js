import React from 'react';
import {COVI_HELPER_API} from "../helpers/constants";

export default function VolunteerCard ({volunteerData, actionCallback, currentUser}) {

    const consumeApi = (type) => {
        if (type === "verify") {
            const data = {
                email: volunteerData.email,
                allowed: true
            };
            fetch(`${COVI_HELPER_API}/verifyVolunteer/${currentUser}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })
                .then(response => response.status)
                .then(data => {
                    if (data === 200) {
                        actionCallback(volunteerData, type)
                    } else {
                        //error handling
                    }
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
        } else if (type === "remove") {
            const data = {
                email: volunteerData.email,
                allowed: false
            };
            fetch(`${COVI_HELPER_API}/removeVolunteer/${currentUser}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })
                .then(response => response.status)
                .then(data => {
                    if (data === 200) {
                        actionCallback(volunteerData, type)
                    } else {
                        //error handling
                    }
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
        }
    }

    return (
        <div className="flex-1 w-full">
            <figure className="flex flex-col bg-white rounded-xl shadow-sm m-10 p-4">
                <div className="w-24 h-24 self-center bg-yellow-100 text-indigo-500 rounded-full m-3">
                    {volunteerData.picture === "" ? <span className="material-icons text-yellow-400 text-7xl p-3">person_outline</span>: <img className="items-center justify-center w-24 h-24 rounded-full " aria-hidden="true" src={volunteerData.picture}/>}
                </div>
                <div className="flex-1 inline-grid my-3 sm:m-0  md:p-4 sm:self-center ">
                    <div className="sm:mx-auto my-2 text-cyan-600 text-2xl ">
                        Name: {volunteerData.name}
                    </div>
                    <div className="sm:mx-auto my-2 text-cyan-600 text-xl">
                        <div className="flex flex-row">
                            <span className="material-icons text-blue-500 pr-1 sm:px-1 py-0.5">phone</span>
                            <span>{volunteerData.phoneNumber}</span>
                        </div>
                    </div>
                    <div className="flex flex-nowrap overflow-x-auto sm:mx-auto my-2 text-cyan-600 text-xl">
                        <span className="material-icons text-blue-500 pr-1 sm:px-1 py-0.5">mail</span>
                        <p className="">{volunteerData.email}</p>
                    </div>
                </div>
                {volunteerData.allowed ? (
                    <div className="grid grid-cols-1 gap-2 mx-auto  m-3 ">
                        <button
                            className="px-4 py-2 font-medium tracking-wide text-white capitalize transition-colors duration-200 transform bg-red-600 shadow-md rounded-md dark:bg-gray-800 hover:bg-red-500 dark:hover:bg-gray-700 focus:outline-none focus:bg-red-600 dark:focus:bg-gray-700"
                            onClick={()=>{consumeApi("remove")}}>
                            Remove
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-2 mx-auto  m-3 ">
                        <button
                            className="px-4 py-2 font-medium tracking-wide text-white capitalize transition-colors duration-200 transform bg-green-600 shadow-md rounded-md dark:bg-gray-800 hover:bg-green-500 dark:hover:bg-gray-700 focus:outline-none focus:bg-green-600 dark:focus:bg-gray-700"
                            onClick={()=>consumeApi("verify")}>
                            Verify
                        </button>
                        <button
                            className="px-4 py-2 font-medium tracking-wide text-white capitalize transition-colors duration-200 transform bg-red-600 shadow-md rounded-md dark:bg-gray-800 hover:bg-red-500 dark:hover:bg-gray-700 focus:outline-none focus:bg-blue-500 dark:focus:bg-gray-700"
                            onClick={()=>{consumeApi("remove")}}>
                            Remove
                        </button>
                    </div>
                )}
            </figure>
        </div>
    )
}