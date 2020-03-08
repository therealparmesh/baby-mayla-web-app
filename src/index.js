import 'antd/dist/antd.min.css';
import 'react-vertical-timeline-component/style.min.css';
import { useEffect, useState } from 'preact/hooks';
import { Input, Layout, Menu } from 'antd';
import './core/global.css';
import { FeedingsTab } from './components/feedings-tab';
import { PumpingsTab } from './components/pumpings-tab';

const Main = () => {
  const [activeTab, setActiveTab] = useState('feedings');

  let tab;

  switch (activeTab) {
    case 'feedings':
      tab = <FeedingsTab />;
      break;
    case 'pumpings':
      tab = <PumpingsTab />;
      break;
    default:
      tab = null;
  }

  return (
    <Layout style={{ height: '100%', width: '100%' }}>
      <Layout.Content style={{ overflow: 'auto', padding: '32px 32px 96px' }}>
        {tab}
      </Layout.Content>
      <Menu
        theme="dark"
        mode="horizontal"
        style={{
          position: 'fixed',
          bottom: 0,
          width: '100%',
          lineHeight: '64px',
          textAlign: 'center',
        }}
        selectedKeys={[activeTab]}
        onClick={({ key }) => setActiveTab(key)}
      >
        <Menu.Item key="feedings" style={{ width: '50%' }}>
          Feedings
        </Menu.Item>
        <Menu.Item key="pumpings" style={{ width: '50%' }}>
          Pumpings
        </Menu.Item>
      </Menu>
    </Layout>
  );
};

const App = () => {
  const key = `BABY_MAYLA_WEB_APP_CLIENT_PASSWORD_${process.env.NODE_ENV.toUpperCase()}`;

  const [password, setPassword] = useState(
    typeof window !== 'undefined' &&
      localStorage.getItem(key) === process.env.CLIENT_PASSWORD
      ? localStorage.getItem(key)
      : '',
  );

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, password);
    }
  }, [password]);

  let screen;

  if (typeof window === 'undefined') {
    screen = null;
  } else if (password === process.env.CLIENT_PASSWORD) {
    screen = <Main />;
  } else {
    screen = (
      <Input.Password
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '50%',
        }}
        placeholder="Enter password..."
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
    );
  }

  return (
    <div id="app" style={{ height: '100%', width: '100%' }}>
      {screen}
    </div>
  );
};

export default App;
