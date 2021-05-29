import { Popover, Transition } from '@headlessui/react'
import React, {Fragment, useState} from 'react';
import {ContributeCardData} from "../helpers/ContributeCardData";
import {verifiedTime} from "../helpers/commonFunctions";

export default function ResourceCard(props) {

    const renderIcon = () => {
        if (props.lead === "Oxygen"){
            return (ContributeCardData[0].img)
        } else if (props.lead === "Bed"){
            return (ContributeCardData[1].img)
        }else if (props.lead === "Plasma"){
            return (ContributeCardData[2].img)
        }else if (props.lead === "Medicine"){
            return (ContributeCardData[3].img)
        }else if (props.lead === "Ambulance"){
            return (ContributeCardData[4].img)
        }else if (props.lead === "Helping Hand"){
            return (ContributeCardData[5].img)
        }
    }

    const getCurrentDate = () => {
        const tempTimestamp = new Date()
        return tempTimestamp.toISOString()
    }

    const getDate = (date) => {
        var mdy = verifiedTime(date)
        var mdx = mdy.split('/');
        var recoveryDate =  new Date(parseInt(mdx[2]), parseInt(mdx[0])-1, parseInt(mdx[1]));
        return recoveryDate
    }

    const datediff = (first, second) => {
        return Math.round((second-first)/(1000*60*60*24));
    }


    const handleNotesRender = () => {
        if (props.lead === "Plasma") {
            var temDate = getDate(props.resourceData.notes)
            return (
                <>
                    {datediff(temDate,getDate(getCurrentDate()))} Days since Recovery on {temDate.toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </>
            )
        } else {
            return (
                <>
                    {props.resourceData.notes}
                </>
            )
        }
    }

    return(
        <div className="px-3 py-8 w-full">
            <div className="shadow-xl rounded-lg">
                <div className="bg-white rounded-xl px-6 md:px-8">
                    <div className="pt-8 pb-8">
                        <div className="flex flex-col sm:flex-row ">
                            <>
                                <div className="w-14 h-14 self-center p-3 bg-blue-100 text-indigo-500 rounded-full mr-0 sm:mr-4 shadow-lg">{renderIcon()}</div>
                            </>
                            <div className="self-center">
                                <h1 className="text-2xl text-center sm:text-left font-bold text-gray-700">{props.lead}</h1>
                                <p className="text-sm text-center sm:text-left text-gray-600">{props.resourceData.lead_type} by {props.resourceData.name}</p>
                            </div>
                            {props.resourceData.verified_by == "" ?(<></>) : (
                                <div className="flex flex-nowrap self-center sm:ml-auto text-green-600">
                                    <span className="material-icons text-4xl">task_alt</span>
                                    <div>
                                        <div className="flex flex-wrap">
                                            <h1 className="justify-center ml-1 my-auto text-lg">Verified</h1>
                                            <p className="justify-center ml-1 my-auto">on</p>
                                        </div>
                                        <p className="text-sm ml-1 text-green-600">{verifiedTime(props.resourceData.verfied_time)}</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        <p className="ml-3 mt-6 self-center text-center sm:text-left text-gray-700">{props.resourceData.notes == ""?(<>No Notes</>):(<>{handleNotesRender()}</>)}</p>

                        <div className="flex justify-around mt-8">
                            {props.resourceData.url == "" ? (<></>):(
                                <a href={props.resourceData.url} target="_blank">
                                    <div className="flex flex-col mx-3 text-center">
                                        <i className="material-icons">place</i>
                                        <>Map</>
                                    </div>
                                </a>
                            )}
                            {props.resourceData.phoneNumber == "" ? (<></>):(
                                <Popover className="relative">
                                    {({ open }) => (
                                        <>
                                            <Popover.Button>
                                                <div className="flex flex-col mx-3 text-center">
                                                    <i className="material-icons">phone</i>
                                                    <>Phone</>
                                                </div>
                                            </Popover.Button>
                                            <Transition
                                                as={Fragment}
                                                show={open}
                                                enter="transition ease-out duration-200"
                                                enterFrom="opacity-0 translate-y-1"
                                                enterTo="opacity-100 translate-y-0"
                                                leave="transition ease-in duration-150"
                                                leaveFrom="opacity-100 translate-y-0"
                                                leaveTo="opacity-0 translate-y-1"
                                            >
                                                <Popover.Panel className="absolute z-10 max-w-sm px-4 mt-3 transform -translate-x-1/2 left-1/2 sm:px-0 lg:max-w-3xl">
                                                    <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                                                        <div className="relative grid gap-8 bg-white p-5">
                                                            <>{props.resourceData.phoneNumber}</>
                                                        </div>
                                                    </div>
                                                </Popover.Panel>
                                            </Transition>
                                        </>
                                    )}
                                </Popover>
                            )}
                            {props.resourceData.whatsappNumber == "" ? (<></>):(
                                <Popover className="relative">
                                    {({ open }) => (
                                        <>
                                            <Popover.Button>
                                                <div className="flex flex-col mx-3 text-center">
                                                    <i className="material-icons">chat</i>
                                                    <>Whatsapp</>
                                                </div>
                                            </Popover.Button>
                                            <Transition
                                                as={Fragment}
                                                show={open}
                                                enter="transition ease-out duration-200"
                                                enterFrom="opacity-0 translate-y-1"
                                                enterTo="opacity-100 translate-y-0"
                                                leave="transition ease-in duration-150"
                                                leaveFrom="opacity-100 translate-y-0"
                                                leaveTo="opacity-0 translate-y-1"
                                            >
                                                <Popover.Panel className="absolute z-10 max-w-sm px-4 mt-3 transform -translate-x-1/2 left-1/2 sm:px-0 lg:max-w-3xl">
                                                    <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                                                        <div className="relative grid gap-8 bg-white p-5 inline-block">
                                                            <>{props.resourceData.whatsappNumber}</>
                                                        </div>
                                                    </div>
                                                </Popover.Panel>
                                            </Transition>
                                        </>
                                    )}
                                </Popover>
                            )}
                            {props.resourceData.website == "" ? (<></>):(
                                <a href={props.resourceData.website} target="_blank">
                                    <div className="flex flex-col mx-3 text-center">
                                        <i className="material-icons">web</i>
                                        <>Website</>
                                    </div>
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}