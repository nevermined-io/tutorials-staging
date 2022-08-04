import '@nevermined-io/styles/lib/esm/styles/globals.scss'
import '@nevermined-io/styles/lib/esm/index.css'
import React from 'react'
// import './App.css'
import { MultipleAssets } from 'components/MultipleAssets/MultipleAssets'
import { NavBar } from 'components/NavBar/NavBar'
import { PublishAsset } from 'components/PublishAsset/PublishAsset'
import { Route, Routes } from 'react-router-dom'
import { SingleAsset } from 'components/SingleAsset/SingleAsset'
import { User } from 'components/User/User'

function App() {
  return (
    <div className="App">
      <NavBar />
      <Routes>
        <Route path="/" element={<MultipleAssets />} />
        <Route path="/did/:did" element={<SingleAsset />} />
        <Route path="/publish" element={<PublishAsset />} />
        <Route path="/user/:address" element={<User />} />
      </Routes>
    </div>
  )
}

export default App
