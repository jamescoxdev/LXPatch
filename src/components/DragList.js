import React from 'react';
import DipSwitch from './DipSwitch';
import DeleteIcon from '@material-ui/icons/Delete';
import Styles from './DragList.module.scss';
import { useRecoilState, useRecoilValue } from 'recoil';
import { patchList, appSettings } from '../atoms';
import { Draggable } from 'react-beautiful-dnd';

const DragList = ({universe,universeIndex}) => {
    const [thePatch,setThePatch] = useRecoilState(patchList);
    const theSettings = useRecoilValue(appSettings);

    const getPatchNum = (uni,index) => {
        let theUni = thePatch[uni];
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
    const deleteItem = (uni,id) => {
        let cloned = [...thePatch];
        let filtered = cloned[uni].filter((i) => {
            return i.id !== id;
        });
        cloned[uni] = filtered;
        setThePatch(cloned);
    }

    return(
        <>
            {universe.map((lx,li) => {
                return <Draggable key={lx.id} draggableId={lx.id} index={li}>
                    {(provided,snapshot) => (
                        <>
                            <div className={`${Styles.tableRow} ${Styles.desktopRow} ${snapshot.isDragging ? Styles.rowDragging : ''}`} ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                <div className={Styles.tc1}><p className={Styles.delete} onClick={() => { deleteItem(universeIndex,lx.id) }}><DeleteIcon style={{cursor:'pointer',fontSize:'1.3em'}} /></p></div>
                                <div className={Styles.tc2}>{lx.name}</div>
                                {theSettings.ShowMode && <div className={Styles.tc3}>{lx.mode}</div>}
                                {theSettings.ShowChCount && <div className={Styles.tc4}>{lx.channels}</div>}
                                <div className={Styles.tc5}>{getPatchNum(universeIndex,li)}</div>
                                {theSettings.ShowDip && <div className={Styles.tc6}><DipSwitch dmx={getPatchNum(universeIndex,li)} /></div>}
                            </div>
                            <div className={`${Styles.tableRow} ${Styles.mobileRow} ${snapshot.isDragging ? Styles.rowDragging : ''}`} ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                <div>
                                    <div className={Styles.mtc}>Model</div>
                                    {theSettings.ShowMode && <div className={Styles.mtc}>Mode</div>}
                                    {theSettings.ShowChCount && <div className={Styles.mtc}>Ch.</div>}
                                    <div className={Styles.mtc} style={{height:'30px',padding:'0px 5px'}}>Patch #</div>
                                </div>
                                <div className={Styles.mobileRowContent}>
                                    <div className={Styles.tc2}>{lx.name}</div>
                                    {theSettings.ShowMode && <div className={Styles.tc3}>{lx.mode}</div>}
                                    {theSettings.ShowChCount && <div className={Styles.tc4}>{lx.channels}</div>}
                                    <div style={{display:'flex',flexDirection:'row'}}>
                                        <div className={Styles.tc5}>{getPatchNum(universeIndex,li)}</div>
                                        {theSettings.ShowDip && <div className={Styles.tc6}><DipSwitch dmx={getPatchNum(universeIndex,li)} /></div>}
                                    </div>
                                </div>
                                <div className={Styles.tc1}><p className={Styles.delete} onClick={() => { deleteItem(universeIndex,lx.id) }}><DeleteIcon style={{cursor:'pointer',fontSize:'1.3em'}} /></p></div>
                            </div>
                        </>
                    )}
                </Draggable>
            })}
        </>
    );
}

export default DragList;