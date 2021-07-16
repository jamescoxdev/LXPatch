import React, { useState, useEffect } from 'react';
import Styles from './ActiveFixtures.module.scss';
import { useRecoilState } from 'recoil';
import { patchList } from '../atoms';
import DeleteIcon from '@material-ui/icons/Delete';
import DipSwitch from './DipSwitch';

const ActiveFixtures = () => {
    const [thePatch,setThePatch] = useRecoilState(patchList);
    const [universe,setUniverse] = useState([]);

    useEffect(() => {
        setUniverse([]);
        let fakeVerse = [];
        let max = 512;
        let container = [];
        let counter = 0;
        for(let i=0,l=thePatch.length;i<l;++i){
            if(+counter + +thePatch[i].channels <= max){
                container.push(thePatch[i]);
                counter = +counter + +thePatch[i].channels;
            } else {
                let cloned = [...container];
                fakeVerse.push(cloned);
                container.length = 0;
                container = [];
                counter = 0;
                container.push(thePatch[i]);
                counter = +counter + +thePatch[i].channels;
            }
        }
        if(container.length){
            fakeVerse.push(container);
        }
        setUniverse(fakeVerse);
    },[thePatch]);

    const universeCount = (uni) => {
        let count = 0;
        for(let i=0,l=uni.length;i<l;++i){
            count = count + +uni[i].channels;
        }
        return count;
    }

    const getPatchNum = (uni,index) => {
        let theUni = universe[uni];
        let patch = 1;
        for(let i=0,l=theUni.length;i<l;++i){
            if(i !== index){
                patch = patch + +theUni[i].channels;
            }
            if(i === index){
                i = theUni.length;
            }
        }
        return patch;
    }

    const deleteItem = (id) => {
        let cloned = [...thePatch];
        let filtered = cloned.filter((i) => {
            return i.id !== id;
        });
        setThePatch(filtered);
    }

    return(
        <div className={Styles.container}>
            {thePatch.length === 0 && <p className={Styles.noFixtureTxt}>No Fixtures Added</p>}
            {universe.length > 0 && 
            <>
            {universe.map((uni,i) => {
                return <div key={i} className={Styles.universe}>
                    <p className={Styles.tableHeader}>Universe {i + 1} <span className={Styles.smallHeader}>({universeCount(uni)}/512)</span></p>
                    <table>
                        <thead>
                            <tr>
                                <th></th>
                                <th>Model</th>
                                <th>Mode</th>
                                <th>Patch #</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {uni.map((lx,li) => {
                                return <tr key={li}>
                                    <td><p className={Styles.delete} onClick={() => { deleteItem(lx.id) }}><DeleteIcon style={{cursor:'pointer',fontSize:'1.3em'}} /></p></td>
                                    <td>{lx.name}</td>
                                    <td>{lx.mode}</td>
                                    <td>{getPatchNum(i,li)}</td>
                                    <td><DipSwitch dmx={getPatchNum(i,li)} /></td>
                                </tr>
                            })}
                        </tbody>
                    </table>
                </div>
                })}
            </>}
        </div>
    );
}

export default ActiveFixtures;