import React from 'react';
import Styles from './ActiveFixtures.module.scss';
import { useRecoilValue, useRecoilState } from 'recoil';
import { patchList, appSettings } from '../atoms';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import DragList from './DragList';

const ActiveFixtures = () => {
    const [thePatch, setThePatch] = useRecoilState(patchList);
    const theSettings = useRecoilValue(appSettings);

    const universeCount = (uni) => {
        let count = 0;
        for(let i=0,l=uni.length;i<l;++i){
            count = count + +uni[i].channels;
        }
        return count;
    }

    const hasPatch = () => {
        let patch = 0;
        for(let i=0,l=thePatch.length;i<l;++i){
            patch += thePatch[i].length;
        }
        return patch > 0;
    }

    const handleOnDragEnd = (result) => {
        if (!result.destination) return;

        let newPatch = [...thePatch];
        let sourceUniverseIndex = result.source.droppableId.substring(9);
        let sourceIndex = result.source.index;
        let destUniverseIndex = result.destination.droppableId.substring(9);
        let destIndex = result.destination.index;

        newPatch[parseInt(sourceUniverseIndex) - 1] = Object.assign([], newPatch[parseInt(sourceUniverseIndex) - 1]);
        newPatch[parseInt(destUniverseIndex) - 1] = Object.assign([], newPatch[parseInt(destUniverseIndex) - 1]);
        
        let [removedItem] = newPatch[parseInt(sourceUniverseIndex) - 1].splice(sourceIndex,1);
        newPatch[parseInt(destUniverseIndex) - 1].splice(destIndex,0,removedItem);

        let dmxCount = newPatch[parseInt(destUniverseIndex) - 1].reduce((p,n) => {
            return p + +n.channels;
        },0);
        if(dmxCount <= 512){
            setThePatch(newPatch);
        } else {
            alert(`Can not move this fixture into Universe ${destUniverseIndex} as the channel count will be greater than the Universe limit. (${dmxCount - 512} channel${dmxCount - 512 === 1 ? '' : 's'} over)`)
        }
    }

    return(
        <div className={Styles.container}>
            {!hasPatch() && <p className={Styles.noFixtureTxt}>No Fixtures Added</p>}
            {hasPatch() && 
                <DragDropContext onDragEnd={handleOnDragEnd}>
                    {thePatch.map((uni,i) => {
                        return <div key={i}>
                            {uni.length ? 
                                <div key={i} className={Styles.universe}>
                                    <p className={Styles.tableHeader}>Universe {i + 1} <span className={Styles.smallHeader}>({universeCount(uni)}/512)</span></p>
                                    <div className={Styles.table}>
                                        <div className={Styles.tableHead}>
                                            <div className={Styles.tc1}></div>
                                            <div className={Styles.tc2}>Model</div>
                                            {theSettings.ShowMode && <div className={Styles.tc3}>Mode</div>}
                                            {theSettings.ShowChCount && <div className={Styles.tc4}>Ch.</div>}
                                            <div className={Styles.tc5}>Patch #</div>
                                            {theSettings.ShowDip && <div className={Styles.tc6}></div>}
                                        </div>
                                        <Droppable droppableId={`Universe-${i + 1}`}>
                                            {(provided) => (
                                                <div className={Styles.tableBody} {...provided.droppableProps} ref={provided.innerRef}>
                                                    <DragList universe={uni} universeIndex={i} />
                                                    {provided.placeholder}
                                                </div>
                                            )}
                                        </Droppable>
                                    </div>
                                </div>
                            :<></>}
                        </div>
                    })}
                </DragDropContext>
            }
        </div>
    );
}

export default ActiveFixtures;