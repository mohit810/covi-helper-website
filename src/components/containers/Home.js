import React, {lazy, Suspense, useState} from 'react';
import {DATA_API_ROOT, GOSPEL_DATE} from '../../helpers/constants';
import useStickySWR from '../../helpers/hooks/useStickySWR';
import {fetcher, getStatistic, retry} from '../../helpers/commonFunctions';
import TableLoader from "../loaders/Table";
import {useLocalStorage, useSessionStorage} from "react-use";
import {Helmet} from "react-helmet";
const MapExplorer = lazy(() => retry(() => import('../map/MapExplorer')));
const StateHeader = lazy(() => retry(() => import('../state/StateHeader')));
const Minigraphs = lazy(() => retry(() => import('../Minigraphs')));
const Vaccinated = lazy(() => retry(() => import('../Vaccinated')));
const Table = lazy(() => retry(() => import('../table/Table')));

export default function Home() {
    const [regionHighlighted, setRegionHighlighted] = useState({
        stateCode: 'TT',
        districtName: null,
    });

    const [anchor, setAnchor] = useLocalStorage('anchor', null);
    const [expandTable, setExpandTable] = useLocalStorage('expandTable', false);
    const [mapStatistic, setMapStatistic] = useSessionStorage(
        'mapStatistic',
        'active'
    );
    const [date, setDate] = useState('');
    const {data: timeseries} = useStickySWR(
        `${DATA_API_ROOT}/timeseries.min.json`,
        fetcher,
        {
            revalidateOnMount: true,
            refreshInterval: 100000,
        }
    );

    const {data} = useStickySWR(
        `${DATA_API_ROOT}/data${date ? `-${date}` : ''}.min.json`,
        fetcher,
        {
            revalidateOnMount: true,
            refreshInterval: 100000,
        }
    );

    const hideVaccinated = getStatistic(data?.['TT'], 'total', 'vaccinated') === 0;
    const hideDistrictData = date !== '' && date < GOSPEL_DATE;

    return(
        <React.Fragment>
            <Helmet>
                <title>
                    Covid-19 Outbreak
                </title>
                <meta
                    name="Home"
                    content={`Covid-19 Outbreak: Latest Map and Case Count`}
                />
            </Helmet>
            <div className="w-auto h-auto">
                <div className="w-auto flex flex-col md:flex-row">
                    <div className="w-full md:w-6/12 p-2">
                        {data && (
                            <Suspense fallback={<div style={{height: '50rem'}} />}>
                                <StateHeader data={data['TT']} stateCode={'TT'} />
                                <MapExplorer
                                    stateCode="TT"
                                    {...{date, data}}
                                    {...{mapStatistic, setMapStatistic}}
                                    {...{regionHighlighted, setRegionHighlighted}}
                                    {...{anchor, setAnchor}}
                                    {...{expandTable, hideDistrictData}}
                                />
                            </Suspense>
                        )}
                    </div>
                    <div className="w-full md:w-6/12 p-2">
                        <>
                            {!timeseries && <div style={{height: '107px'}} />}
                            {timeseries && (
                                <Suspense fallback={<div  style={{height: '107px'}} />}>
                                    <Minigraphs
                                        data={data['TT']}
                                        timeseries={timeseries['TT']?.dates}
                                        {...{date}}
                                    />
                                </Suspense>
                            )}
                        </>
                        <div className="flex justify-center pb-16">
                            {!hideVaccinated && (
                                <Suspense fallback={<div  style={{height: '107px'}}/>}>
                                    <Vaccinated
                                        data={data['TT']}
                                    />
                                </Suspense>)
                            }
                        </div>
                    </div>
                </div>
                <div>
                    {data && (
                        <Suspense fallback={<TableLoader />}>
                            <Table
                                {...{
                                    data,
                                    regionHighlighted,
                                    setRegionHighlighted,
                                    expandTable,
                                    setExpandTable,
                                    hideDistrictData,
                                    hideVaccinated,
                                }}
                            />
                        </Suspense>
                    )}
                </div>
            </div>
        </React.Fragment>
    )
}