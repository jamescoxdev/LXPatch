import React, { useState, useEffect } from 'react';
import Styles from './AddFixture.module.scss';
import LXData from '../data/lxData';
import { useRecoilState, useRecoilValue } from 'recoil';
import { patchList, appSettings } from '../atoms';
import guid from '../utils/guid';

const AddFixture = () => {
    const Settings = useRecoilValue(appSettings);
    const [universe,setUniverse] = useState(1);
    const [model,setModel] = useState('Select Model');
    const [mode, setMode] = useState('Select Mode');
    const [quant,setQuant] = useState('');
    const [thePatch,setThePatch] = useRecoilState(patchList);
    const [uniArray,setUniArray] = useState([]);

    useEffect(() => {
        let uniCount = Settings.UniverseCount;
        let count = [];
        for(let i=0,l=uniCount;i<l;++i){
            count.push(i + 1);
        }
        setUniArray(count);
        setUniverse(uniCount !== 1 ? 'Which Universe?' : 1);
    },[Settings]);

    const getModeOpts = () => {
        if(model !== 'Select Model'){
            let models = LXData.filter((lxGroups) => {
                let models = lxGroups.models.filter((lxModel) => {
                    return lxModel.name === model;
                });
                return models.length;
            });
            let modes = models[0].models.filter((lxModel) => {
                return lxModel.name === model;
            });
            return modes[0].modes;
        }
        return [];
    }

    const addFixture = () => {
        let fixtures = [...thePatch];
        let modeCh = mode.split('|');
        let uniChCount = fixtures[+universe - 1].length === 0 ? 0 : fixtures[+universe - 1].reduce((total,current) => {
            return total + +current.channels;
        },0);
        let noPush = 0;
        for(let i=0;i<quant;++i){
            if(+uniChCount + +modeCh[1] <= 512){
                let fixture = {
                    id: guid(),
                    name: model,
                    mode: modeCh[0],
                    channels: modeCh[1]
                }
                fixtures[+universe - 1] = Object.assign([], fixtures[+universe - 1]);
                fixtures[+universe - 1].push(fixture);
                uniChCount += +modeCh[1];
            } else {
                noPush++;
            }
        }
        let set = false;
        if(noPush > 0){
            if(quant - noPush > 0){
                if(window.confirm(`There ${noPush > 1 ? 'are' : 'is'} ${noPush} fixture${noPush > 1 ? 's' : ''} that wont fit in Universe ${universe}. Do you want to add the first ${quant - noPush > 1 ? (quant - noPush) + ' fixtures?' : 'fixture?'}`)){
                    set = true;
                }
            } else {
                alert(`${noPush > 1 ? 'These fixtures' : 'This fixture'} wont fit in Universe ${universe}`);
            }
        } else {
            set = true;
        }
        if(set){
            setThePatch(fixtures);
            setUniverse(Settings.UniverseCount === 1 ? 1 : 'Which Universe?');
            setModel('Select Model');
            setMode('Select Mode');
            setQuant('');
        }
    }

    return(
        <div className={Styles.container}>
            {+Settings.UniverseCount !== 1 && <select onChange={(e) => setUniverse(e.target.value)} value={universe}>
                <option>Which Universe?</option>
                {uniArray.map((c,i) => {
                    return <option key={i}>{c}</option>
                })}
            </select>}
            <select disabled={universe === 'Which Universe?'} onChange={(e) => setModel(e.target.value)} value={model}>
                <option>Select Model</option>
                {LXData.map((lxGroup,i) => {
                    return <optgroup key={i} label={lxGroup.type}>
                        {lxGroup.models.map((model,mi) => {
                            return <option key={mi}>{model.name}</option>
                        })}
                    </optgroup>
                })}
            </select>
            <select disabled={model === 'Select Model'} onChange={(e) => setMode(e.target.value)} value={mode}>
                <option>Select Mode</option>
                {getModeOpts().map((mode,i) => {
                    return <option key={i} value={`${mode.mode}|${mode.channels}`}>{mode.mode}</option>
                })}
            </select>
            <input placeholder={'How Many?'} min="1" disabled={model === 'Select Model' || mode === 'Select Mode'} type={'number'} onChange={(e) => setQuant(e.target.value)} value={quant} />
            <button disabled={model === 'Select Model' || mode === 'Select Mode' || quant === '' || quant === 0 || quant === '0'} onClick={addFixture}>Add</button>
        </div>
    );
}

export default AddFixture;