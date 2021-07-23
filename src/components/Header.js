import React from 'react';
import Styles from './Header.module.scss';
import Logo from '../img/patch.png';
import SettingsIcon from '@material-ui/icons/Settings';
import { appSettings, showSettings, patchList } from '../atoms';
import { useRecoilState } from 'recoil';

const Header = () => {
    const [settings,setSettings] = useRecoilState(appSettings);
    const [toggleSettings,setToggleSettings] = useRecoilState(showSettings);
    const [thePatch,setThePatch] = useRecoilState(patchList);
    const onChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.name === 'UniverseCount' ? +e.target.value : e.target.value;
        const name = e.target.name;
        let cloned = {...settings};
        cloned[name] = value;
        setSettings(cloned);
        if(name === 'UniverseCount'){
            let cloned = [...thePatch];
            if(+value > cloned.length){
                while(+value > cloned.length){
                    cloned.push([]);
                }
            } else if(+value < cloned.length){
                while(+value < cloned.length){
                    cloned.pop();
                }
            }
            setThePatch(cloned);
        }
    }
    return(
        <>
            <div className={Styles.Header}>
                <img src={Logo} alt={'logo'} className={Styles.logo} />
                <p className={Styles.title}>LX Patch</p>
                <div style={{flex:1}} />
                <SettingsIcon className={Styles.settingsIcon} onClick={() => { setToggleSettings(!toggleSettings) }} />
            </div>
            {toggleSettings && <div className={Styles.settingsContainer}>
                <div className={Styles.settingRow}>
                    <p>Universe Count</p>
                    <input type={'number'} min="1" style={{width:'60px'}} value={settings.UniverseCount} name='UniverseCount' onChange={(e) => onChange(e)} />
                </div>
                <div className={Styles.settingRow}>
                    <p>Show Dip Switches</p>
                    <label className={Styles.switch}>
                        <input type={'checkbox'} checked={settings.ShowDip} name='ShowDip' onChange={(e) => onChange(e)} />
                        <span className={`${Styles.slider} ${Styles.round}`} />
                    </label>
                </div>
                <div className={Styles.settingRow}>
                    <p>Show Fixture Mode</p>
                    <label className={Styles.switch}>
                        <input type={'checkbox'} checked={settings.ShowMode} name='ShowMode' onChange={(e) => onChange(e)} />
                        <span className={`${Styles.slider} ${Styles.round}`} />
                    </label>
                </div>
                <div className={Styles.settingRow}>
                    <p>Show Fixture Channel Count</p>
                    <label className={Styles.switch}>
                        <input type={'checkbox'} checked={settings.ShowChCount} name='ShowChCount' onChange={(e) => onChange(e)} />
                        <span className={`${Styles.slider} ${Styles.round}`} />
                    </label>
                </div>
            </div>}
        </>
    );
}

export default Header;