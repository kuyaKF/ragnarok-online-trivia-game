import { Route, Routes } from 'react-router-dom'
import AppLayout from '@/components/layout/AppLayout'
import DatabasePage from '@/features/database/DatabasePage'
import MonsterDetailPage from '@/features/database/MonsterDetailPage'
import GiftBoxPage from '@/features/giftbox/GiftBoxPage'
import HomePage from '@/features/home/HomePage'
import NotFoundPage from '@/features/not-found/NotFoundPage'
import ItemDropPage from '@/features/trivia/drops/ItemDropPage'
import FactCheckPage from '@/features/trivia/facts/FactCheckPage'
import NameGuessPage from '@/features/trivia/name/NameGuessPage'

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/db" element={<DatabasePage />} />
        <Route path="/db/:id" element={<MonsterDetailPage />} />
        <Route path="/trivia/name" element={<NameGuessPage />} />
        <Route path="/trivia/facts" element={<FactCheckPage />} />
        <Route path="/trivia/drops" element={<ItemDropPage />} />
        <Route path="/giftbox" element={<GiftBoxPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
