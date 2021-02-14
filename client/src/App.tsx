import React from 'react';
import { Canvas } from './components/Canvas';
import { SettingBar } from './components/SettingBar';
import { ToolBar } from './components/ToolBar';
import './styles/app.scss';
import { Route, Switch, Redirect, useHistory } from 'react-router-dom';
import { Login } from './components/LoginPage';
import { useSelector } from 'react-redux';
import { PaintState } from './store/reducer';

export const App: React.FC = () => {
  const session = useSelector((state: PaintState) => state.session);
  const username = useSelector((state: PaintState) => state.username);
  const history = useHistory();

  React.useEffect(() => {
    if (session && username) {
      history.push(`/${session}`);
    } else if (!session || !username) {
      history.push('/');
    }
  }, [session, username]);

  return (
    <div className="app">
      <Switch>
        <Route exact path="/" component={Login}/>
        <Route path="/:session">
          <ToolBar/>
          <SettingBar/>
          <Canvas/>
        </Route>
        <Redirect to={`${session ? session : '/'}`}/>
      </Switch>
    </div>
  );
}