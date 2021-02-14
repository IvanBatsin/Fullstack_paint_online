import React from 'react';
import { useDispatch } from 'react-redux';
import { setLineWidth, setStrokeColor } from '../store/actions';
import '../styles/toolbar.scss';
import { ColorInput } from './colorInput';

export const SettingBar: React.FC = () => {
  const dispatch = useDispatch();

  const handleLineWidth = (event: React.FormEvent<HTMLInputElement>): void => {
    dispatch(setLineWidth(+event.currentTarget.value));
  }

  const colorChangeHandler = (event: React.FormEvent<HTMLInputElement>) => {
    dispatch(setStrokeColor(event.currentTarget.value));
  }

  return (
    <div className="settingbar">
      <label htmlFor="stroke_width" style={{marginRight: 10}}>Choose stroke width: </label>
      <input type="number" id="stroke_width" onChange={handleLineWidth} defaultValue={1} style={{marginRight: 20}} min={1} max={50}/>
      <ColorInput id="stroke_color" label="Choose stroke color:" onColorChange={colorChangeHandler}/>
    </div>
  )
}