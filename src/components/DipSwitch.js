import React, { useState, useEffect } from 'react';
import Styles from './DipSwitch.module.scss';

const DipSwitch = ({dmx}) => {
    const init = [false,false,false,false,false,false,false,false,false];
    const [dips,setDips] = useState(init);
    useEffect(() => {
        const dipVals = [256,128,64,32,16,8,4,2,1];
        let set = 0;
        let newDips = [];
        for(let i=0,l=dipVals.length;i<l;++i){
            if(set + dipVals[i] <= +dmx){
                set+= dipVals[i];
                newDips.push(true);
            } else {
                newDips.push(false);
            }
        }
        let flipped = newDips.reverse();
        setDips(flipped);
    },[dmx]);
    return(
        <div className={Styles.container}>
            {dips.map((dip,i) => {
                return <div className={Styles.dipContainer} key={i}>
                    <div className={`${Styles.dip} ${dip ? Styles.dipActive : ''}`} />
                </div>
            })}
            <div className={Styles.dipContainer}>
                <div className={Styles.dip} />
            </div>
        </div>
    );
}

export default DipSwitch;