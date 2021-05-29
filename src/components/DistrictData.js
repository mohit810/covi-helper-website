import React, {Suspense, useEffect, useState} from "react";
import FilterCard from "./FilterCard";
import {ContributeCardData} from "../helpers/ContributeCardData";
import {useLocation} from "react-router-dom";
import {COVI_HELPER_API} from "../helpers/constants";
import useStickySWR from "../helpers/hooks/useStickySWR";
import {fetcher} from "../helpers/commonFunctions";
import ResourceCard from "./ResourceCard";
import Loader from "./loaders/Loader";

export default function DistrictData(props) {
    const location = useLocation();
    const [url,setUrl] = useState('')
    const [filter,setFilter] = useState('all')

    useEffect(()=>{
        if (props.cityDetail == null){
            setUrl(`${COVI_HELPER_API}${location.pathname}`)
        } else {
            setUrl(`${COVI_HELPER_API}/resource/${props.statedetail.name}/${props.cityDetail.name}/${props.cityDetail.id}`)
        }
    },[props.cityDetail,props.statedetail])

    const {data: resourceData} = useStickySWR(
        `${url}`,
        fetcher,
        {
            revalidateOnMount: true
        }
    );

    const renderOxygen = () => {
        return  (
            <>
                {resourceData['resourceMaster'][0].oxygen == null ? <></> : resourceData['resourceMaster'][0].oxygen.map((data) => {
                        return (
                            <ResourceCard key={data.id} resourceData={data} lead={'Oxygen'}/>
                        )
                    }
                )}
            </>
        )
    }

    const renderPlasma = () => {
        return  (
            <>
                {resourceData['resourceMaster'][0].plasma == null ? <></> : resourceData['resourceMaster'][0].plasma.map((data)=>{
                        return (
                            <ResourceCard key={data.id} resourceData={data} lead={'Plasma'}/>
                        )
                    }
                )}
            </>
        )
    }

    const renderMedicine = () => {
        return  (
            <>
                {resourceData['resourceMaster'][0].medicine == null ? <></> : resourceData['resourceMaster'][0].medicine.map((data)=>{
                        return (
                            <ResourceCard key={data.id} resourceData={data} lead={'Medicine'}/>
                        )
                    }
                )}
            </>
        )
    }

    const renderBed = () => {
        return  (
            <>
                {resourceData['resourceMaster'][0].bed == null ? <></> : resourceData['resourceMaster'][0].bed.map((data)=>{
                        return (
                            <ResourceCard key={data.id} resourceData={data} lead={'Bed'}/>
                        )
                    }
                )}
            </>
        )
    }

    const renderAmbulance = () => {
        return  (
            <>
                {resourceData['resourceMaster'][0].ambulance == null ? <></> : resourceData['resourceMaster'][0].ambulance.map((data)=>{
                        return (
                            <ResourceCard key={data.id} resourceData={data} lead={'Ambulance'}/>
                        )
                    }
                )}
            </>
        )
    }

    const renderHelpingHand = () => {
        return  (
            <>
                {resourceData['resourceMaster'][0].helpingHand == null ? <></> : resourceData['resourceMaster'][0].helpingHand.map((data)=>{
                        return (
                            <ResourceCard key={data.id} resourceData={data} lead={'Helping Hand'}/>
                        )
                    }
                )}
            </>
        )
    }
    const noData = () => {
        return (
            <div className='w-screen h-screen grid grid-cols-1 gap-2 place-content-center text-center'>
                <div  className="material-icons text-5xl text-red-700">
                    info
                </div>
                <div>No Data Available</div>
            </div>
        )
    }
    const renderData = () =>{
        if(resourceData['resourceMaster'][0].oxygen == null && resourceData['resourceMaster'][0].plasma == null && resourceData['resourceMaster'][0].medicine == null && resourceData['resourceMaster'][0].bed == null && resourceData['resourceMaster'][0].ambulance == null && resourceData['resourceMaster'][0].helpingHand == null && filter === "all"){
            return (
                <>
                    {noData()}
                </>
            )
        } else if (filter === "all") {
            return (
                <>
                    {renderOxygen()}{renderPlasma()}{renderMedicine()}{renderBed()}{renderAmbulance()}{renderHelpingHand()}
                </>
            )
        } else if(filter === ContributeCardData[0].id) {
            return (
                <>
                    {resourceData['resourceMaster'][0].oxygen == null ? <>{noData()}</> : <>{renderOxygen()}</>}
                </>
            )
        } else if(filter === ContributeCardData[1].id) {
            return (
                <>
                    {resourceData['resourceMaster'][0].bed == null ? <>{noData()}</> : <>{renderBed()}</>}
                </>
            )
        } else if(filter === ContributeCardData[2].id) {
            return (
                <>
                    {resourceData['resourceMaster'][0].plasma == null ? <>{noData()}</> : <>{renderPlasma()}</>}
                </>
            )
        } else if(filter === ContributeCardData[3].id) {
            return (
                <>
                    {resourceData['resourceMaster'][0].medicine == null ? <>{noData()}</> : <>{renderMedicine()}</>}
                </>
            )
        } else if(filter === ContributeCardData[4].id) {
            return (
                <>
                    {resourceData['resourceMaster'][0].ambulance == null ? <>{noData()}</> : <>{renderAmbulance()}</>}
                </>
            )
        } else if(filter === ContributeCardData[5].id) {
            return (
                <>
                    {resourceData['resourceMaster'][0].helpingHand == null ? <>{noData()}</> : <>{renderHelpingHand()}</>}
                </>
            )
        }
    }

    function closeModal(data) {
        setFilter(data)
    }

    function copyToClipboard() {
        var textField = document.createElement('textarea')
        textField.innerText = url.replaceAll(" ","%20")
        document.body.appendChild(textField)
        textField.select()
        document.execCommand('copy')
        textField.remove()
    }

    return(
        <div className="districtData">
            <div className="w-full">
                <header className="bg-white space-x-4 sticky top-0 mb-3 z-20" style={{boxShadow: "0px 2px rgba(0, 0, 0, 0.1)"}} >
                    <FilterCard cardsData={ContributeCardData} parentCallback={closeModal}/>
                </header>
                <div className="flex flex-col min-h-screen">
                    <div className="flex flex-wrap sm:grid sm:grid-cols-2 xl:grid-cols-3 justify-center">
                        {!resourceData &&(
                            <Loader/>
                        )}
                        {resourceData && (
                            <Suspense fallback={<div style={{height: '50rem'}} />}>
                                {renderData()}
                            </Suspense>
                        )}
                    </div>
                    {document.queryCommandSupported("copy") && (
                        <button className="grid bg-blue-100 block h-12 w-12 sticky text-xl mt-auto ml-auto  bottom-5 right-5 rounded-full"
                                onClick={copyToClipboard}>
                            <span className="material-icons place-self-center">share</span>
                        </button>)}
                </div>
            </div>
        </div>
    )
}