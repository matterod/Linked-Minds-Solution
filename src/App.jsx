import React, { useState } from 'react';
import Auth from './components/Auth';
import ControlPanel from './components/ControlPanel';

function App() {
  const [user, setUser] = useState(null);

  return (
    <div>
      <Auth setUser={setUser} />
      <ControlPanel user={user} />
    </div>
  );
}

export default App;
