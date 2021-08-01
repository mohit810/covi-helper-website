import {SPRING_CONFIG_NUMBERS, STATISTIC_CONFIGS} from '../helpers/constants.js';
import {formatNumber, getStatistic} from '../helpers/commonFunctions';
import equal from 'fast-deep-equal';
import { memo } from 'react';
import {animated,useSpring} from "react-spring";

function Vaccinated({data}) {

    function format(date){
        //write code for edge case of night
        return [
            (date.getDate()) /*+ not in use
            ([, 'st', 'nd', 'rd'][/1?.$/.exec(yesterday.getDate())] || 'th')*/,
            [ 'january', 'february', 'march', 'april',
                'may', 'june', 'july', 'august',
                'september', 'october', 'november', 'december'
            ][date.getMonth()],
            date.getFullYear()
        ].join('')
    }

// test formatting for all dates within a month from today

    let masterDate = new Date();
    let yesterday = new Date();
    yesterday.setDate(masterDate.getDate() - 1);
    const vaccineURL = "https://www.mohfw.gov.in/pdf/CummulativeCovidVaccinationReport"+format(yesterday)+".pdf"

    const total = getStatistic(data, 'total', 'vaccinated')
    const spring = useSpring({
        total: getStatistic(data, 'total', 'vaccinated'),
        // delta: getStatistic(data, 'delta', 'vaccinated'),
        config: SPRING_CONFIG_NUMBERS,
    });

    const statisticConfig = STATISTIC_CONFIGS.vaccinated;
    return (
        <figure className="bg-red-100 rounded-xl p-2">
            <a
                href={vaccineURL}
                target="_blank">
                <div className="flex flex-row" style={{color: "#df648b"}}>
                    <div className="flex flex-row ">
                        <span className="material-icons text-base mr-1">favorite</span>
                        <div className="mr-2">
                            <animated.div>
                                {spring.total.to((total) => formatNumber(total, 'long'))}
                            </animated.div>
                        </div>
                    </div>
                    <div>
                        {STATISTIC_CONFIGS['vaccinated'].displayName}
                    </div>
                </div>
            </a>
        </figure>
    );
}

const isEqual = (prevProps, currProps) => {
    if (!equal(prevProps.data, currProps.data)) {
        return false;
    }
    return true;
};

export default memo(Vaccinated, isEqual);