import React, {Fragment, useEffect, useRef, useState,} from 'react';
import {ContributeCardData} from "../helpers/ContributeCardData";
import {Dialog, Transition} from "@headlessui/react";
import {States} from "../helpers/States";
import VerifyDetailsForm from "./VerifyDetailsForm";
import {verifiedTime} from "../helpers/commonFunctions";

export default function VerifyCard ({lead,verifyCallback,resourceData}) {
    const [open, setOpen] = useState(false);
    const cancelButtonRef = useRef();
    const [allCity,setAllCity] = useState(window.cities())
    const [city,setCity] = useState('')
    const [state,setState] = useState('')

    useEffect(()=>{
        getDistrictState()
    })

    const renderIcon = () => {
        if (lead === "Oxygen"){
            return (ContributeCardData[0].img)
        } else if (lead === "Bed"){
            return (ContributeCardData[1].img)
        }else if (lead === "Plasma"){
            return (ContributeCardData[2].img)
        }else if (lead === "Medicine"){
            return (ContributeCardData[3].img)
        }else if (lead === "Ambulance"){
            return (ContributeCardData[4].img)
        }else if (lead === "Helping Hand"){
            return (ContributeCardData[5].img)
        }
    }

    const createdTime = (gate) => {
        const isoDateTime = new Date(gate);
        return isoDateTime.toLocaleDateString()
    }

    function closeModal() {
        setOpen(false);
    }

    function closeAndUpdateUI(action) {
        setOpen(false);
        verifyCallback(resourceData,lead,action)
    }

    const getDistrictState = () => {
        const currentState = States.filter((state, index, arr) => {
            return state.id == resourceData.statecode
        });

        const currentcity = allCity.filter((city, index, arr) => {
            return city.id == resourceData.citycode
        });
        setState(currentState[0])
        setCity(currentcity[0])
        //return
    }

    return (
        <div className="flex-1 w-full">
            <figure className="flex flex-col sm:flex-row bg-white rounded-xl shadow-sm m-10 p-4">
                <div className="w-14 h-14 p-3 self-center bg-blue-100 text-indigo-500 rounded-full m-3">
                    {renderIcon()}
                </div>
                <div className="m-3 sm:m-0 sm:ml-2 md:p-4 text-center self-center sm:text-left space-y-4">
                    <figcaption className="font-medium">
                        {resourceData.verified_by == "" ?(
                            <div className="text-cyan-600 text-2xl sm:mr-4 mx-auto sm:ml-0">
                                {lead} Lead
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2">
                                <div className="text-cyan-600 text-2xl sm:mr-4 mx-auto sm:ml-0">
                                    {lead} Lead
                                </div>
                                <div className="flex flex-nowrap self-center mx-auto sm:mx-0 text-green-600">
                                    <div>
                                        <div className="flex flex-wrap">
                                            <h1 className="justify-center my-auto text-lg">Verified</h1>
                                            <p className="justify-center ml-1 my-auto">on {verifiedTime(resourceData.verfied_time)}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div className="text-gray-500">
                            of {resourceData.lead_type}  {/*by {props.resourceData.name}*/} {/*on {createdTime(props.resourceData.creationTime)}*/}
                        </div>
                        <div className="text-gray-500">
                            in {city.name}, {state.name}
                        </div>
                    </figcaption>
                </div>
                <div className="mx-auto space-y-4 m-3 sm:m-0 sm:space-y-0 sm:my-auto sm:mr-4 sm:ml-auto sm:mx-0">
                    <button
                        className="px-4 py-2 font-medium tracking-wide text-white capitalize transition-colors duration-200 transform bg-blue-600 rounded-md dark:bg-gray-800 hover:bg-blue-500 dark:hover:bg-gray-700 focus:outline-none focus:bg-blue-500 dark:focus:bg-gray-700"
                        onClick={()=>{setOpen(true)}}>
                        Open
                    </button>
                </div>
            </figure>
            <Transition show={open} as={Fragment}>
                <Dialog
                    as="div"
                    className="fixed inset-0 z-10 overflow-y-auto"
                    initialFocus={cancelButtonRef}
                    static
                    open={open}
                    onClose={closeModal}
                >
                    <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
                    <div className="min-h-screen px-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <Dialog.Overlay className="fixed inset-0" />
                        </Transition.Child>

                        {/* This element is to trick the browser into centering the modal contents. */}
                        <span
                            className="inline-block h-screen align-middle"
                            aria-hidden="true"
                        >
                            &#8203;
                        </span>
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <div className="inline-block w-full max-w-md p-6 mb-4 mt-20 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                                <Dialog.Title
                                    as="h3"
                                    className="text-lg font-medium leading-6 text-gray-900">
                                    Verify Following Details
                                </Dialog.Title>
                                <VerifyDetailsForm parentCallback={closeModal} updateUI={closeAndUpdateUI} resourceType={resourceData} lead={lead} state={state} city={city} />
                            </div>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition>
        </div>
    )
}