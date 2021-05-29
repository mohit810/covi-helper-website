import React, {useContext, Suspense, useState, useEffect} from "react";
import Loader from "../loaders/Loader";
import {AuthContext} from "../../helpers/Auth";
import {noData} from "../../helpers/commonFunctions";
import {COVI_HELPER_API} from "../../helpers/constants";
import VerifyCard from "../VerifyCard";
import {useLocation} from "react-router-dom";

export default function Verify() {
    const location = useLocation();
    const {currentUser} = useContext(AuthContext)
    const [verifyData,setVerifyData] = useState('')
    const [notVerified,setNotVerified] = useState(false)
    const [responseCode,setResponseCode] = useState(0)

    useEffect(()=>{
        getRequest()
            .then(result =>{
                if (result.responseCode ===1) {
                    setVerifyData(result['resourceMaster'][0])
                    setResponseCode(result.responseCode)
                } else {
                    setNotVerified(true)
                }
            })

    },[currentUser])

    async function getRequest () {
        var response = await fetch(`${COVI_HELPER_API}/verify/${currentUser.email}`)
        return await response.json();
    }

    const handleVerification = (data,type,action) => {
        var temp = {}
        if (type === "Oxygen"){
            temp["oxygen"] = verifyData.oxygen != null ? verifyData.oxygen.filter(item => item !== data) : null
            temp["plasma"] = verifyData.plasma
            temp["bed"] = verifyData.bed
            temp["ambulance"] = verifyData.ambulance
            temp["helpingHand"] = verifyData.helpingHand
            temp["medicine"] = verifyData.medicine
        } else if (type === "Bed"){
            temp["oxygen"] = verifyData.oxygen
            temp["plasma"] = verifyData.plasma
            temp["bed"] = verifyData.bed != null ? verifyData.bed.filter(item => item !== data) : null
            temp["ambulance"] = verifyData.ambulance
            temp["helpingHand"] = verifyData.helpingHand
            temp["medicine"] = verifyData.medicine
        }else if (type === "Plasma"){
            temp["oxygen"] = verifyData.oxygen
            temp["plasma"] = verifyData.plasma != null ? verifyData.plasma.filter(item => item !== data) : null
            temp["bed"] = verifyData.bed
            temp["ambulance"] = verifyData.ambulance
            temp["helpingHand"] = verifyData.helpingHand
            temp["medicine"] = verifyData.medicine
        }else if (type === "Medicine"){
            temp["oxygen"] = verifyData.oxygen
            temp["plasma"] = verifyData.plasma
            temp["bed"] = verifyData.bed
            temp["ambulance"] = verifyData.ambulance
            temp["helpingHand"] = verifyData.helpingHand
            temp["medicine"] = verifyData.medicine != null ? verifyData.medicine.filter(item => item !== data) : null
        }else if (type === "Ambulance"){
            temp["oxygen"] = verifyData.oxygen
            temp["plasma"] = verifyData.plasma
            temp["bed"] = verifyData.bed
            temp["ambulance"] = verifyData.ambulance != null ? verifyData.ambulance.filter(item => item !== data) : null
            temp["helpingHand"] = verifyData.helpingHand
            temp["medicine"] = verifyData.medicine
        }else if (type === "Helping Hand"){
            temp["helpingHand"] = verifyData.helpingHand != null ? verifyData.helpingHand.filter(item => item !== data) : null
            temp["oxygen"] = verifyData.oxygen
            temp["plasma"] = verifyData.plasma
            temp["bed"] = verifyData.bed
            temp["ambulance"] = verifyData.ambulance
            temp["medicine"] = verifyData.medicine
        }
        setVerifyData(temp)
    }

    const renderData = () => {
        if (responseCode === 0) {
            return (
                <div>
                    Not Allowed
                </div>
            )
        } else if (responseCode === 1) {
            if(verifyData.oxygen == null && verifyData.plasma == null && verifyData.medicine == null && verifyData.bed == null && verifyData.ambulance == null && verifyData.helpingHand == null){
                return (
                    <>
                        {noData("sentiment_very_satisfied","Nothing to verify!","All caught up.")}
                    </>
                )
            } else {
                return(
                    <div className="grid grid-cols-1 lg:grid-cols-2">
                        {verifyData.oxygen != null && verifyData.oxygen.map((data)=>{
                            return (
                                <VerifyCard key={data.id} lead={'Oxygen'} verifyCallback={handleVerification} resourceData={data} />
                            )
                        })}
                        {verifyData.plasma != null && verifyData.plasma.map((data)=>{
                            return (
                                <VerifyCard key={data.id} resourceData={data} verifyCallback={handleVerification} lead={'Plasma'}/>
                            )
                        })}
                        {verifyData.medicine != null && verifyData.medicine.map((data)=>{
                            return (
                                <VerifyCard key={data.id} resourceData={data} verifyCallback={handleVerification} lead={'Medicine'}/>
                            )
                        })}
                        {verifyData.bed != null && verifyData.bed.map((data)=>{
                            return (
                                <VerifyCard key={data.id} resourceData={data} verifyCallback={handleVerification} lead={'Bed'}/>
                            )
                        })}
                        {verifyData.ambulance != null && verifyData.ambulance.map((data)=>{
                            return (
                                <VerifyCard key={data.id} resourceData={data} verifyCallback={handleVerification} lead={'Ambulance'}/>
                            )
                        })}
                        {verifyData.helpingHand != null && verifyData.helpingHand.map((data)=>{
                            return (
                                <VerifyCard key={data.id} resourceData={data} verifyCallback={handleVerification} lead={'Helping Hand'}/>
                            )
                        })}
                    </div>
                )
            }
        }
    }

    return(
        <div className="pb-5 min-h-screen h-auto">
            <header className="bg-white shadow sticky top-0">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                </div>
            </header>
            <>
                {!verifyData && !notVerified && (
                    <Loader/>
                )}
                {!verifyData && notVerified && (
                    <>
                        {noData("sentiment_very_satisfied","Whaaaaatt! We haven't verified you.","Apologies, we will verify your details and give you access in some time.")}
                    </>
                )}
                {verifyData && (
                    <Suspense fallback={<div style={{height: '50rem'}} />}>
                        {renderData()}
                    </Suspense>
                )}
            </>
        </div>
    )
}