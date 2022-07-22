import React from 'react'
import './App.css'
import { MultipleAssets } from 'components/MultipleAssets/MultipleAssets'
import { NavBar } from 'components/NavBar/NavBar'
import { PublishAsset } from 'components/PublishAsset/PublishAsset'
import { Route, Routes } from 'react-router-dom'
import { SingleAsset } from 'components/SingleAsset/SingleAsset'

function App() {
  return (
    <div className="App">
      <NavBar />
      <Routes>
        <Route path="/" element={<MultipleAssets />} />
        <Route path=":did" element={<SingleAsset />} />
        <Route path="/publish" element={<PublishAsset />} />
      </Routes>
    </div>
  )
}

export default App
