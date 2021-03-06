import {SPRING_CONFIG_NUMBERS, STATISTIC_CONFIGS} from '../../helpers/constants.js';
import {formatNumber, getTableStatistic} from '../../helpers/commonFunctions';

import classnames from 'classnames';
import equal from 'fast-deep-equal';
import {memo} from 'react';
import {animated, useSpring} from 'react-spring';

const Cell = ({statistic, data, isPerMillion, lastUpdatedTT}) => {
    const {total, delta} = getTableStatistic(
        data,
        statistic,
        {perMillion: isPerMillion},
        lastUpdatedTT
    );

    const spring = useSpring({
        total: total,
        delta: delta,
        config: SPRING_CONFIG_NUMBERS,
    });

    const statisticConfig = STATISTIC_CONFIGS[statistic];

    return (
        <div className="cell statistic">
            {statisticConfig?.showDelta && (
                <animated.div
                    className={classnames('delta', `is-${statistic}`)}
                    title={delta}
                >
                    {spring.delta.to((delta) =>
                        delta > 0
                            ? '\u2191' + formatNumber(delta, statisticConfig.format)
                            : delta < 0
                            ? '\u2193' + formatNumber(Math.abs(delta), statisticConfig.format)
                            : ''
                    )}
                </animated.div>
            )}

            <animated.div className="total" title={total}>
                {spring.total.to((total) =>
                    formatNumber(total, statisticConfig.format, statistic)
                )}
            </animated.div>
        </div>
    );
};

const isCellEqual = (prevProps, currProps) => {
    if (!equal(prevProps.data?.total, currProps.data?.total)) {
        return false;
    }
    if (!equal(prevProps.data?.delta, currProps.data?.delta)) {
        return false;
    }
    if (!equal(prevProps.isPerMillion, currProps.isPerMillion)) {
        return false;
    }
    return true;
};

export default memo(Cell, isCellEqual);