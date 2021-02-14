import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { socket } from '../core/socket';
import { setFillColor, setTool } from '../store/actions';
import { PaintState } from '../store/reducer';
import '../styles/toolbar.scss';
import { Brush } from '../tools/Brush';
import { Circle } from '../tools/Circle';
import { Eraser } from '../tools/Eraser';
import { Rect } from '../tools/Rect';
import { ColorInput } from './colorInput';
import axios from 'axios';
import { SocketActions } from '../interface/socket';

export const ToolBar: React.FC = () => {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const dispatch = useDispatch();
  const canvas = useSelector((state: PaintState) => state.canvas);
  const session = useSelector((state: PaintState) => state.session);

  const handleColorChange = (event: React.FormEvent<HTMLInputElement>): void => {
    dispatch(setFillColor(event.currentTarget.value));
  }

  const handleUndo = (): void => {
    socket.emit(SocketActions.DO, {session, do: 'undo'});
  }

  const handleRedo = (): void => {
    socket.emit(SocketActions.DO, {session, do: 'redo'});
  }

  const handleUploadImageClick = (): void => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  }

  const handleUploadImage = (event: React.FocusEvent<HTMLInputElement>): void => {
    const file = event.currentTarget.files![0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      socket.emit(SocketActions.IMAGE_UPLOAD, reader.result, (data: any) => {
        console.log('callback');
        socket.emit('update_image', reader.result);
      });
    }
  }

  const handlerDownLoadImage = (): void => {
    const dataUrl = canvas?.toDataURL();
    const a = document.createElement('a');
    a.href = dataUrl!;
    a.download = `${session}.jpg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  const handleClickClear = async (): Promise<void> => {
    try {
      await axios.get('http://localhost:5000/clear?session=' + session);
      socket.emit(SocketActions.CLEAR, session);
    } catch (error) {
      console.log('clear error');
      socket.emit(SocketActions.CLEAR, session);
    }
  }
  
  return (
    <div className="toolbar">
      <div style={{display:'flex', alignItems:'center'}}>
        <button className="toolbar__button" onClick={() => dispatch(setTool(new Brush(canvas!, socket, session!)))} title="Brush">
          <i className="fa fa-paint-brush" aria-hidden="true"></i>
        </button>
        <button className="toolbar__button" onClick={() => dispatch(setTool(new Rect(canvas!, socket, session!)))} title="Rect">
          <i className="fa fa-square" aria-hidden="true"></i>
        </button>
        <button className="toolbar__button" onClick={() => dispatch(setTool(new Circle(canvas!, socket, session!)))} title="Circle">
          <i className="fa fa-circle-o" aria-hidden="true"></i>
        </button>
        <button className="toolbar__button" onClick={() => dispatch(setTool(new Eraser(canvas!, socket, session!)))} title="Eraser">
          <i className="fa fa-eraser" aria-hidden="true"></i>
        </button>
        <button className="toolbar__button" onClick={handleUndo} title="Undo">
          <i className="fa fa-reply" aria-hidden="true"></i>
          </button>
        <button className="toolbar__button" onClick={handleRedo} title="Redo">
          <i className="fa fa-share" aria-hidden="true"></i>
        </button>
        <ColorInput onColorChange={handleColorChange}/>
      </div>
      <div  style={{display:'flex', alignItems:'center'}}>
        <button className="toolbar__button" onClick={handleClickClear} title="Clear canvas">
          Clear
        </button>
        <input type="file" ref={inputRef} onChange={handleUploadImage} accept={'.jpeg, .jpg, .png'} hidden/>
        <button className="toolbar__button" onClick={handleUploadImageClick} title="Upload image">
          <i className="fa fa-upload" aria-hidden="true"></i>
        </button>
        <button className="toolbar__button" onClick={handlerDownLoadImage} title="Save image">
          <i className="fa fa-file-image-o" aria-hidden="true"></i>
        </button>
        <button className="toolbar__button" title="Exit">
          <a href="/"><i className="fa fa-sign-out" aria-hidden="true"></i></a>
        </button>
      </div>
    </div>
  )
}