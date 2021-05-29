import React, {useContext, Suspense, useState} from "react";
import {COVI_HELPER_API} from "../../helpers/constants";
import {AuthContext} from "../../helpers/Auth";
import VolunteerCard from "../VolunteerCard";
import VerifyCard from "../VerifyCard";
import {noData} from "../../helpers/commonFunctions";


export default function MasterDashboard() {
    const {currentUser} = useContext(AuthContext)
    const [volunteerData,setVolunteerData] = useState(null)
    const [volunteerBtn,setVolunteerBtn] = useState('Get Volunteers List')
    const [resourceBtn,setResourceBtn] = useState('Get Resource List')
    const [resourceData,setResourceData] = useState(null)
    const [volunteerFlag, setVolunteerFlag] = useState(false)
    const [resourceFlag, setResourceFlag] = useState(false)
    const [responseCode,setResponseCode] = useState(0)

    async function getRequest (url) {
        var response = await fetch(url)
        return await response.json();
    }

    const getVolunteers = () => {
        if (currentUser != null && volunteerData == null) {
            getRequest(`${COVI_HELPER_API}/getVolunteers/${currentUser.email}`)
                .then(result => {
                    setVolunteerBtn('Display Volunteer List')
                    setVolunteerData(result.volunteers)
                    setVolunteerFlag(true)
                    setResourceFlag(false)
                })
                .catch((error) => {
                    console.log('Error:', error);
                });
        } else {
            setVolunteerFlag(true)
            setResourceFlag(false)
        }
    }

    const getResource = () => {
        if (currentUser != null && resourceData == null){
            getRequest(`${COVI_HELPER_API}/getResources/${currentUser.email}`)
                .then(result => {
                    setResourceBtn('Display Volunteer List')
                    setResourceData(result['resourceMaster'][0])
                    setResponseCode(result.responseCode)
                    setVolunteerFlag(false)
                    setResourceFlag(true)
                })
                .catch((error) => {
                    console.log('Error:', error);
                });
        } else {
            setVolunteerFlag(false)
            setResourceFlag(true)
        }
    }

    const verifyAction = (data,type) => {
        const tempTimestamp = new Date()
        tempTimestamp.toLocaleDateString()
        var temp = {}
        var project
        if (type === "Oxygen"){
            project = resourceData.oxygen.find((p) => {
                return p === data;
            });
            project.verified_by = currentUser.email
            project.verfied_time = tempTimestamp
        } else if (type === "Bed"){
            project = resourceData.bed.find((p) => {
                return p === data;
            });
            project.verified_by = currentUser.email
            project.verfied_time = tempTimestamp
        }else if (type === "Plasma"){
            project = resourceData.plasma.find((p) => {
                return p === data;
            });
            project.verified_by = currentUser.email
            project.verfied_time = tempTimestamp
        }else if (type === "Medicine"){
            project = resourceData.medicine.find((p) => {
                return p === data;
            });
            project.verified_by = currentUser.email
            project.verfied_time = tempTimestamp
        }else if (type === "Ambulance"){
            project = resourceData.ambulance.find((p) => {
                return p === data;
            });
            project.verified_by = currentUser.email
            project.verfied_time = tempTimestamp
        }else if (type === "Helping Hand"){
            project = resourceData.helpingHand.find((p) => {
                return p === data;
            });
            project.verified_by = currentUser.email
            project.verfied_time = tempTimestamp
        }
        temp["oxygen"] = resourceData.oxygen != null ? resourceData.oxygen : null
        temp["plasma"] = resourceData.plasma != null ? resourceData.plasma : null
        temp["bed"] = resourceData.bed != null ? resourceData.bed : null
        temp["ambulance"] = resourceData.ambulance != null ? resourceData.ambulance : null
        temp["helpingHand"] = resourceData.helpingHand != null ? resourceData.helpingHand : null
        temp["medicine"] = resourceData.medicine != null ? resourceData.medicine : null
        return temp
    }

    const deleteAction = (data,type) => {
        var temp = {}
        if (type === "Oxygen"){
            temp["oxygen"] = resourceData.oxygen != null ? resourceData.oxygen.filter(item => item !== data) : null
            temp["plasma"] = resourceData.plasma
            temp["bed"] = resourceData.bed
            temp["ambulance"] = resourceData.ambulance
            temp["helpingHand"] = resourceData.helpingHand
            temp["medicine"] = resourceData.medicine
        } else if (type === "Bed"){
            temp["oxygen"] = resourceData.oxygen
            temp["plasma"] = resourceData.plasma
            temp["bed"] = resourceData.bed != null ? resourceData.bed.filter(item => item !== data) : null
            temp["ambulance"] = resourceData.ambulance
            temp["helpingHand"] = resourceData.helpingHand
            temp["medicine"] = resourceData.medicine
        }else if (type === "Plasma"){
            temp["oxygen"] = resourceData.oxygen
            temp["plasma"] = resourceData.plasma != null ? resourceData.plasma.filter(item => item !== data) : null
            temp["bed"] = resourceData.bed
            temp["ambulance"] = resourceData.ambulance
            temp["helpingHand"] = resourceData.helpingHand
            temp["medicine"] = resourceData.medicine
        }else if (type === "Medicine"){
            temp["oxygen"] = resourceData.oxygen
            temp["plasma"] = resourceData.plasma
            temp["bed"] = resourceData.bed
            temp["ambulance"] = resourceData.ambulance
            temp["helpingHand"] = resourceData.helpingHand
            temp["medicine"] = resourceData.medicine != null ? resourceData.medicine.filter(item => item !== data) : null
        }else if (type === "Ambulance"){
            temp["oxygen"] = resourceData.oxygen
            temp["plasma"] = resourceData.plasma
            temp["bed"] = resourceData.bed
            temp["ambulance"] = resourceData.ambulance != null ? resourceData.ambulance.filter(item => item !== data) : null
            temp["helpingHand"] = resourceData.helpingHand
            temp["medicine"] = resourceData.medicine
        }else if (type === "Helping Hand"){
            temp["helpingHand"] = resourceData.helpingHand != null ? resourceData.helpingHand.filter(item => item !== data) : null
            temp["oxygen"] = resourceData.oxygen
            temp["plasma"] = resourceData.plasma
            temp["bed"] = resourceData.bed
            temp["ambulance"] = resourceData.ambulance
            temp["medicine"] = resourceData.medicine
        }
        return temp
    }

    const handleResourceVerification = (data,type,action) => {
        var tempData = {}
        if (action === "submit"){
            tempData = verifyAction(data,type)
        } else if (action === "delete") {
            tempData = deleteAction(data,type)
        }
        setResourceData(tempData)
    }

    const renderData = () => {
        if (responseCode === 0) {
            {noData("sentiment_dissatisfied","Not Allowed","")}
        } else if (responseCode === 1) {
            if (resourceData.oxygen == null && resourceData.plasma == null && resourceData.medicine == null && resourceData.bed == null && resourceData.ambulance == null && resourceData.helpingHand == null){
                {noData("sentiment_very_satisfied","Nothing to verify!","All caught up.")}
            } else {
                return (
                    <div className="grid grid-cols-1 lg:grid-cols-2">
                        {resourceData.oxygen != null && resourceData.oxygen.map((data) => {
                            return (
                                <VerifyCard key={data.id} lead={'Oxygen'} verifyCallback={handleResourceVerification}
                                            resourceData={data}/>
                            )
                        })}
                        {resourceData.plasma != null && resourceData.plasma.map((data) => {
                            return (
                                <VerifyCard key={data.id} resourceData={data}
                                            verifyCallback={handleResourceVerification} lead={'Plasma'}/>
                            )
                        })}
                        {resourceData.medicine != null && resourceData.medicine.map((data) => {
                            return (
                                <VerifyCard key={data.id} resourceData={data}
                                            verifyCallback={handleResourceVerification} lead={'Medicine'}/>
                            )
                        })}
                        {resourceData.bed != null && resourceData.bed.map((data) => {
                            return (
                                <VerifyCard key={data.id} resourceData={data}
                                            verifyCallback={handleResourceVerification} lead={'Bed'}/>
                            )
                        })}
                        {resourceData.ambulance != null && resourceData.ambulance.map((data) => {
                            return (
                                <VerifyCard key={data.id} resourceData={data}
                                            verifyCallback={handleResourceVerification} lead={'Ambulance'}/>
                            )
                        })}
                        {resourceData.helpingHand != null && resourceData.helpingHand.map((data) => {
                            return (
                                <VerifyCard key={data.id} resourceData={data}
                                            verifyCallback={handleResourceVerification} lead={'Helping Hand'}/>
                            )
                        })}
                    </div>
                )
            }
        }
    }

    const volunteerCallback = (data, action) => {
        var tempData ={}
        if(action === "verify"){
            var project = volunteerData.find((p) => {
                return p === data;
            });
            project.allowed = true
            tempData =  volunteerData.filter(item => item)
        } else if(action === "remove") {
            tempData =  volunteerData.filter(item => item !== data)
        }
        setVolunteerData(tempData)
    }

    return(
        <div className="pb-5 min-h-screen h-auto" >
            <header className="bg-white shadow sticky top-0 z-30">
                <div className="flex flex-col sm:flex-row max-w-7xl py-3 px-4 sm:px-6 lg:px-8">
                    <h1 className="flex-none mx-auto my-auto text-3xl font-bold text-gray-900">Master Dashboard</h1>
                    <button
                        type="button"
                        className="flex-none mx-auto my-2 px-5 h-10 justify-center text-sm font-medium text-white bg-green-600 shadow-md border border-transparent rounded-md hover:bg-green-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                        onClick={getVolunteers}>
                        {volunteerBtn}
                    </button>
                    <button
                        type="button"
                        className="flex-none mx-auto my-2 px-5 h-10 justify-center text-sm font-medium text-white bg-green-600 shadow-md border border-transparent rounded-md hover:bg-green-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                        onClick={getResource}>
                        {resourceBtn}
                    </button>
                </div>
            </header>
            {!volunteerFlag && !resourceFlag && (
                <div className="h-screen w-screen grid grid-cols-1 gap-2 place-content-center text-center">
                    <span className="material-icons text-6xl text-green-600">smart_button</span>
                    Click on any Button to get the Data
                </div>
            )}
            <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3" >
                {volunteerFlag && !resourceFlag && (
                    <Suspense fallback={<div style={{height: '50rem'}} />}>
                        {volunteerData !== null ? (
                            volunteerData.map((data) => {
                                return (
                                    <div key={data.id}>
                                        <VolunteerCard volunteerData={data} currentUser={currentUser.email} actionCallback={volunteerCallback}/>
                                    </div>
                                )
                            })
                        ): (
                            <>
                                {noData("sentiment_dissatisfied","It seems there are no Volunteer Registrations!","")}
                            </>
                        )}
                    </Suspense>
                )}
            </div>
            <>
                {!volunteerFlag && resourceFlag && (
                    <Suspense fallback={<div style={{height: '50rem'}} />}>
                        {renderData()}
                    </Suspense>
                )}
            </>
        </div>
    )
}