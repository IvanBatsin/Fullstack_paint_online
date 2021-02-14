import React from 'react';
import '../styles/canvas.scss';
import { useDispatch, useSelector } from 'react-redux';
import { putUndo, redo, setCanvas, setTool, undo } from '../store/actions';
import { Brush } from '../tools/Brush';
import { socket } from '../core/socket';
import { SocketActions, SocketDrawObj, User } from '../interface/socket';
import { Rect } from '../tools/Rect';
import axios from 'axios';
import { darwImage } from '../utils/drawImage';
import { Eraser } from '../tools/Eraser';
import { Circle } from '../tools/Circle';
import { PaintState } from '../store/reducer';
import { UsersList } from './UsersList';

export const Canvas: React.FC = () => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const username = useSelector((state: PaintState) => state.username);
  const session = useSelector((state: PaintState) => state.session);
  const [users, setUsers] = React.useState<string[]>([]);
  const dispatch = useDispatch();

  const mouseUpHandler = async (): Promise<void> => {
    const dataUrl = canvasRef.current?.toDataURL();
    await axios.post('http://localhost:5000/image', {dataUrl, session});
  }

  const drawHandler = async (msg: SocketDrawObj): Promise<void> => {
    if (canvasRef.current) {
      const figure = msg.figure;
      const ctx = canvasRef.current?.getContext('2d');
      switch(figure.type) {
        case 'brush': {
          Brush.drawBrush(ctx!, figure!.x, figure!.y, figure.strokeColor!, figure.lineWidth!);
          dispatch(putUndo(canvasRef.current!.toDataURL()));
          break;
        }
  
        case 'eraser': {
          Eraser.drawEraser(ctx!, figure!.x, figure!.y, figure.lineWidth!);
          dispatch(putUndo(canvasRef.current!.toDataURL()));
          break;
        }
  
        case 'circle': {
          Circle.drawCircle(ctx!, figure!.x, figure!.y, figure.radius!, figure.fill!, figure.strokeColor!, figure.lineWidth!);
          dispatch(putUndo(canvasRef.current!.toDataURL()));
          await mouseUpHandler();
          break;
        }
  
        case 'rect': {
          Rect.drawRect(ctx!, figure!.x, figure!.y, figure.width!, figure.height!, figure.fill!, figure.strokeColor!, figure.lineWidth!);
          dispatch(putUndo(canvasRef.current!.toDataURL()));
          await mouseUpHandler();
          break;
        }
  
        case 'finish': {
          ctx?.beginPath();
          break;
        }
      }
    }
  }

  const loadImage = async (): Promise<void> => {
    const ctx = canvasRef.current?.getContext('2d');
    try {
      const {data} = await axios.get<string>('http://localhost:5000/image?session=' + session);
      const image = new Image();
      image.src = data;
      image.onload = () => {
        darwImage(ctx!, image, canvasRef.current!.width, canvasRef.current!.height);
      }
    } catch (error) {
      console.log(error);
      ctx?.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);
    }
  }
  
  React.useEffect(() => {
    socket.open();
    if (canvasRef.current) {
      dispatch(setCanvas(canvasRef.current));
      dispatch(setTool(new Brush(canvasRef.current, socket, session!)));

      const msg: User = {
        session: session!,
        username: username!
      };

      socket.emit(SocketActions.JOIN, msg);

      socket.on(SocketActions.JOINED, (users: string[]) => {
        console.log(users);
        setUsers(users);
      });

      socket.on(SocketActions.DRAW, (msg: SocketDrawObj) => {
        drawHandler(msg);
      });

      socket.on('update_image', (data: string) => {
        const image = new Image();
        image.src = data;
        image.onload = () => {
          darwImage(canvasRef.current?.getContext('2d')!, image, canvasRef.current!.width, canvasRef.current!.height);
        }
      });

      socket.on(SocketActions.DO, (msg: {session: string, do: string}) => {
        msg.do === 'undo' ? dispatch(undo()) : dispatch(redo());
      });

      socket.on(SocketActions.CLEAR, () => {
        canvasRef.current?.getContext('2d')?.clearRect(0, 0, canvasRef.current?.width, canvasRef.current?.height);
      });

      socket.on(SocketActions.EXIT, (users: string[]) => {
        setUsers(users);
      });
    }

    loadImage();

    return () => {
      socket.close();
    };
  }, []);

  if (!session || !username) return null;

  return (
    <div className="canvas">
      <canvas onMouseUp={mouseUpHandler} ref={canvasRef} width={600} height={400}/>
      {users.length > 0 && <UsersList users={users} sessionName={session!}/>}
    </div>
  )
}