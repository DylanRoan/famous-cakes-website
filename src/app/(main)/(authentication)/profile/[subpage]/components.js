'use client'

import AccountPanel from "@//app/components/profile/account";
import CartPanel from "@//app/components/profile/cart";
import Link from "next/link";

export function InformationPanel ({ subpage }) {

    if (subpage == "account") return <AccountPanel></AccountPanel>
    if (subpage == "cart") return <CartPanel></CartPanel>

    return <AccountPanel></AccountPanel>
    
}