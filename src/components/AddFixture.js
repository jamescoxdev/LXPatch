import React, { useState } from 'react';
import Styles from './AddFixture.module.scss';
import LXData from '../data/lxData';
import { useRecoilState } from 'recoil';
import { patchList } from '../atoms';

const AddFixture = () => {
    const [model,setModel] = useState('Select Model');
    const [mode, setMode] = useState('Select Mode');
    const [quant,setQuant] = useState('');
    const [thePatch,setThePatch] = useRecoilState(patchList);

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
        for(let i=0;i<quant;++i){
            let fixture = {
                id: fixtures.length,
                name: model,
                mode: modeCh[0],
                channels: modeCh[1]
            }
            fixtures.push(fixture);
        }
        setThePatch(fixtures);
        setModel('Select Model');
        setMode('Select Mode');
        setQuant('');
    }

    return(
        <div className={Styles.container}>
            <select onChange={(e) => setModel(e.target.value)} value={model}>
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
            <input placeholder={'How Many?'} disabled={model === 'Select Model' || mode === 'Select Mode'} type={'number'} onChange={(e) => setQuant(e.target.value)} value={quant} />
            <button disabled={model === 'Select Model' || mode === 'Select Mode' || quant === '' || quant === 0 || quant === '0'} onClick={addFixture}>Add</button>
        </div>
    );
}

export default AddFixture;