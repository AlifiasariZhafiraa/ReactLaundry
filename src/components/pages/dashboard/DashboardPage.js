import React from 'react'
import HomeAdmin from './DashboardAdmin'
import HomeOwner from './DashboardOwner'
import HomeKasir from './DashboardKasir'

import paket from '../paket/PaketAPI'
import member from '../member/MemberAPI'
import outlet from '../outlet/OutletAPI'
import transaksi from '../transaksi/TransaksiAPI'
import getRole from '../../../utils/access'

const check = (role, count) => {
  if (role === "admin") {
    return (
      <HomeAdmin count={count} />
    )
  } else if (role === "kasir") {
    return (
      <HomeKasir count={count} />
    )
  } else if (role === "owner") {
    return (
      <HomeOwner count={count} />
    )
  } else {
    <h1>access denied</h1>
  }
}

export default function HomePage() {

  React.useEffect(() => {
    const User = getRole();
    if (User === null || User === undefined) {
      window.location = "/denied";
    }

    setRole(User)


    const fetch = async () => {
      let temp = {
        paket: 0,
        member: 0,
        outlet: 0,
        transaksi: 0
      }

      const countPaket = await paket.count();
      temp.paket = countPaket

      const countMember = await member.count();
      temp.member = countMember

      const countOutlet = await outlet.count();
      temp.outlet = countOutlet

      const countTransaksi = await transaksi.count();
      temp.transaksi = countTransaksi

      setCounts(temp)
    };

    fetch();

  }, []);

  const [counts, setCounts] = React.useState(
    {
      paket: 0,
      member: 0,
      outlet: 0,
      transaksi: 0
    }
  );
  const [role, setRole] = React.useState("");

  return (
    <>{check(role, counts)}</>
  )
}