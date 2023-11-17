import { Route, Routes } from 'react-router-dom';

import HomePage from '../dashboard/DashboardPage';
import DeniedPage from '../DeniedPage';
import MemberPage from '../member/MemberPage';
import OutletPage from '../outlet/OutletPage';
import PaketPage from '../paket/PaketPage';
import TransaksiPage from '../transaksi/TransaksiPage';
import UserPage from '../user/UserPage';
import GenerateLaporan from '../laporan/GenerateLaporan';



export const MainRoute = () => (
  <Routes>
    <Route path='/dashboard' element={<HomePage />}></Route>
    <Route path='/member' element={<MemberPage />}></Route>
    <Route path='/outlet' element={<OutletPage />}></Route>
    <Route path='/paket' element={<PaketPage />}></Route>
    <Route path='/transaksi' element={<TransaksiPage />}></Route>
    <Route path='/user' element={<UserPage />}></Route>
    <Route path='/generate/laporan' element={<GenerateLaporan />}></Route>
    <Route path='/denied' element={<DeniedPage />}></Route>
  </Routes>
)