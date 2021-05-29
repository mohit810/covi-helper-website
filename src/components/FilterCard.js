import React, {useEffect, useState} from "react";

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export default function FilterCard({cardsData, parentCallback}) {
    const [selectedCard,setSelectedCard] = useState("all")
    const [isApplied,setIsApplied] = useState('all')

    useEffect(() => {
        const onTrigger = (event) => {
            parentCallback(selectedCard);
        }
        onTrigger()
    },[selectedCard])

    const clicked = (Id) =>{
        setIsApplied(Id)
        setSelectedCard(Id)
    }

    return(
        <div className="flex flex-nowrap overflow-x-auto px-3 lg:px-5">
            {cardsData.map((data) =>
                data.id === 'volunteer'?
                    (
                        <div key={data.id}/>
                    ) : (
                        <div key={data.id}
                             onClick={()=>clicked(data.id)}
                             className="flex-shrink-0 my-2 pr-3">
                            <button className="w-full inline-flex bg-gray-100 rounded-full focus:outline-none">
                                <div className={classNames(isApplied === data.id ?"bg-red-100":"bg-blue-100","m-2 p-1 rounded-full")}>
                                    <div className={classNames(isApplied === data.id ?"material-icons text-2xl text-red-500":"text-indigo-500","w-9 h-9 pl-0.5 pt-0.5")}>
                                        {isApplied === data.id ? <>close</>:data.img}
                                    </div>
                                </div>
                                <div className="flex-1 self-center md:text-left space-y-4 mr-3 pr-2">
                                    <figcaption className="font-medium">
                                        <div className="text-gray-500">
                                            {data.name}
                                        </div>
                                    </figcaption>
                                </div>
                            </button>
                        </div>
                    )
            )}
        </div>
    )
}